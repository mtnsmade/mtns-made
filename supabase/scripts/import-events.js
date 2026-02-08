/**
 * MTNS MADE - Event Import Script
 *
 * Imports events from Webflow CSV export into Supabase
 *
 * Usage: node import-events.js
 */

const { createClient } = require('@supabase/supabase-js');
const { parse } = require('csv-parse/sync');
const fs = require('fs');

// ============================================
// CONFIGURATION
// ============================================

// Load environment variables
require('dotenv').config();

const CONFIG = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,

  eventsCsv: '/Users/paulmosig/Downloads/MTNS MADE - Events - 64aa21e9193adf43b765fcf1 (1).csv',

  dryRun: false,
};

const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

// ============================================
// LOOKUPS
// ============================================

const lookups = {
  members: {},        // memberstack_id -> id
  membersBySlug: {},  // slug -> id
  suburbs: {},        // slug -> id
};

// ============================================
// HELPERS
// ============================================

async function loadLookups() {
  console.log('Loading reference tables...');

  // Members
  const { data: members } = await supabase
    .from('members')
    .select('id, memberstack_id, slug');

  members?.forEach(m => {
    if (m.memberstack_id) lookups.members[m.memberstack_id] = m.id;
    if (m.slug) lookups.membersBySlug[m.slug] = m.id;
  });
  console.log(`  Loaded ${members?.length || 0} members`);

  // Suburbs
  const { data: suburbs } = await supabase
    .from('suburbs')
    .select('id, slug');
  suburbs?.forEach(s => lookups.suburbs[s.slug] = s.id);
  console.log(`  Loaded ${suburbs?.length || 0} suburbs`);
}

function parseBoolean(value) {
  if (!value) return false;
  return value.toLowerCase() === 'true';
}

function parseDate(value) {
  if (!value || value.trim() === '') return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date.toISOString();
}

function parseMemberSlugs(value) {
  if (!value || value.trim() === '') return [];
  return value.split(';').map(s => s.trim()).filter(s => s.length > 0);
}

function transformEvent(row) {
  // Skip archived (but keep drafts for unpublished future events)
  if (parseBoolean(row['Archived'])) {
    return null;
  }

  const memberstackId = row['Memberstack ID']?.trim();
  const memberId = memberstackId ? lookups.members[memberstackId] : null;

  // Parse suburb
  const suburbSlug = row['Choose Suburb']?.trim();
  const suburbId = suburbSlug ? lookups.suburbs[suburbSlug] : null;

  // Parse involved members
  const involvedMemberSlugs = parseMemberSlugs(row['Members involved in this event']);

  return {
    event: {
      webflow_id: row['Item ID']?.trim() || null,
      memberstack_id: memberstackId || null,
      eventbrite_id: row['Eventbrite event ID']?.trim() || null,

      name: row['Name']?.trim() || 'Untitled Event',
      slug: row['Slug']?.trim() || null,

      member_id: memberId,
      member_contact_email: row['Member Contact Email']?.trim() || null,

      time_display: row['Time']?.trim() || null,
      date_display: row['Date']?.trim() || null,
      date_start: parseDate(row['Date Event Starts']),
      date_end: parseDate(row['Date Event Ends']),
      date_expiry: parseDate(row['Event Expiry Date']),

      location_name: row['Location Name']?.trim() || null,
      location_address: row['Location full street address']?.trim() || null,
      suburb_id: suburbId,

      short_description: row['Short Description']?.trim() || null,
      description: row['Description']?.trim() || null,
      feature_image_url: row['Feature Image']?.trim() || null,

      rsvp_link: row['RSVP Link']?.trim() || null,

      is_mtns_made_event: parseBoolean(row['MTNS MADE Event']),
      is_featured: parseBoolean(row['Feature Event']),
      is_past: parseBoolean(row['Event is Past']),

      is_archived: parseBoolean(row['Archived']),
      is_draft: parseBoolean(row['Draft']),
    },
    involvedMemberSlugs,
  };
}

async function insertEvent(data) {
  const { event, involvedMemberSlugs } = data;

  // Insert event
  const { data: inserted, error } = await supabase
    .from('events')
    .upsert(event, { onConflict: 'webflow_id' })
    .select('id')
    .single();

  if (error) {
    console.error(`  Error inserting "${event.name}":`, error.message);
    return null;
  }

  const eventId = inserted.id;

  // Insert involved members relationships
  for (const slug of involvedMemberSlugs) {
    const memberId = lookups.membersBySlug[slug];
    if (memberId) {
      await supabase
        .from('event_members')
        .upsert({ event_id: eventId, member_id: memberId },
                { onConflict: 'event_id,member_id' });
    }
  }

  return eventId;
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('='.repeat(60));
  console.log('MTNS MADE - Event Import');
  console.log('='.repeat(60));
  console.log();

  await loadLookups();

  // Read CSV
  console.log(`\nReading CSV: ${CONFIG.eventsCsv}`);
  const csv = fs.readFileSync(CONFIG.eventsCsv, 'utf-8');
  const records = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });

  console.log(`Found ${records.length} records in CSV`);

  // Transform
  const toImport = [];
  let skippedArchived = 0;

  for (const row of records) {
    const result = transformEvent(row);
    if (!result) {
      skippedArchived++;
    } else {
      toImport.push(result);
    }
  }

  console.log(`\nTo import: ${toImport.length}`);
  console.log(`Skipped (archived): ${skippedArchived}`);

  if (CONFIG.dryRun) {
    console.log('\n[DRY RUN] No data inserted.');
    return;
  }

  // Import
  console.log('\nImporting events...');
  let success = 0;
  let errors = 0;

  for (const data of toImport) {
    const result = await insertEvent(data);
    if (result) {
      success++;
    } else {
      errors++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('COMPLETE');
  console.log('='.repeat(60));
  console.log(`Imported: ${success}`);
  console.log(`Errors: ${errors}`);

  // Verify
  const { count: eventCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true });

  const { count: eventMemberCount } = await supabase
    .from('event_members')
    .select('*', { count: 'exact', head: true });

  console.log(`\nDatabase counts:`);
  console.log(`  events: ${eventCount}`);
  console.log(`  event_members: ${eventMemberCount}`);
}

main().catch(console.error);
