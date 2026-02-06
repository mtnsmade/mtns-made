/**
 * MTNS MADE - Project Import Script
 *
 * Imports projects from Webflow CSV export into Supabase
 * Only imports projects belonging to active members
 *
 * Usage: node import-projects.js [--include-lapsed]
 */

const { createClient } = require('@supabase/supabase-js');
const { parse } = require('csv-parse/sync');
const fs = require('fs');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  supabaseUrl: 'https://epszwomtxkpjegbjbixr.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwc3p3b210eGtwamVnYmpiaXhyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDMxMTkzNSwiZXhwIjoyMDg1ODg3OTM1fQ.H553wnuQ6gcrbyhOu-H8V7TE4bZtNaYq7Nd15-_rBmw',

  projectsCsv: '/Users/paulmosig/Downloads/MTNS MADE - Projects - 64aa150f02bee661d503cf59.csv',

  dryRun: false,
};

const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

// Parse args
const args = process.argv.slice(2);
const includeLapsed = args.includes('--include-lapsed');

// ============================================
// LOOKUPS
// ============================================

const lookups = {
  members: {},        // memberstack_id -> { id, subscription_status }
  membersBySlug: {},  // slug -> member_id
  subDirectories: {}, // slug -> id
};

// ============================================
// HELPERS
// ============================================

async function loadLookups() {
  console.log('Loading reference tables...');

  // Members (with subscription status)
  const { data: members } = await supabase
    .from('members')
    .select('id, memberstack_id, slug, subscription_status');

  members?.forEach(m => {
    if (m.memberstack_id) {
      lookups.members[m.memberstack_id] = {
        id: m.id,
        status: m.subscription_status,
      };
    }
    if (m.slug) {
      lookups.membersBySlug[m.slug] = m.id;
    }
  });
  console.log(`  Loaded ${members?.length || 0} members`);

  // Sub-directories
  const { data: subDirs } = await supabase
    .from('sub_directories')
    .select('id, slug');
  subDirs?.forEach(s => lookups.subDirectories[s.slug] = s.id);
  console.log(`  Loaded ${subDirs?.length || 0} sub-directories`);
}

function parseBoolean(value) {
  if (!value) return false;
  return value.toLowerCase() === 'true';
}

function parseCategorySlugs(value) {
  if (!value || value.trim() === '') return [];
  return value.split(';').map(s => s.trim()).filter(s => s.length > 0);
}

function transformProject(row) {
  // Skip archived, draft, or deleted
  if (parseBoolean(row['Archived']) || parseBoolean(row['Draft']) || parseBoolean(row['Deleted'])) {
    return null;
  }

  const memberstackId = row['Memberstack ID']?.trim();
  const memberSlug = row['Member']?.trim();

  // Try to find member by memberstack ID first, then by slug
  let memberData = memberstackId ? lookups.members[memberstackId] : null;
  let memberId = memberData?.id;

  if (!memberId && memberSlug) {
    memberId = lookups.membersBySlug[memberSlug];
    if (memberId) {
      // Get status for this member
      const member = Object.values(lookups.members).find(m => m.id === memberId);
      memberData = member || { id: memberId, status: 'unknown' };
    }
  }

  if (!memberId) {
    return { skip: true, reason: 'no-member', name: row['Name'], memberSlug };
  }

  // Check subscription status
  const status = memberData?.status || 'active';
  if (status === 'lapsed' && !includeLapsed) {
    return { skip: true, reason: 'lapsed', name: row['Name'], memberSlug };
  }

  // Parse categories
  const categorySlugs = parseCategorySlugs(row['Relevant Directory Categories']);

  return {
    project: {
      webflow_id: row['Item ID']?.trim() || null,
      memberstack_id: memberstackId || null,
      airtable_id: row['Airtable ID']?.trim() || null,

      name: row['Name']?.trim() || 'Untitled',
      slug: row['Slug']?.trim() || null,

      member_id: memberId,

      key_detail: row['Key Detail']?.trim() || null,
      short_description: row['Project Short Description']?.trim() || null,
      description: row['Project Description']?.trim() || row['Project Description - Editable']?.trim() || null,

      feature_image_url: row['Feature Image']?.trim() || null,
      showreel_link: row['Showreel Link']?.trim() || null,

      image_one_url: row['Add image One']?.trim() || null,
      image_two_url: row['Add Image Two']?.trim() || null,
      image_three_url: row['Add Image Three']?.trim() || null,
      image_four_url: row['Add Image Four']?.trim() || null,
      image_five_url: row['Add Image Five']?.trim() || null,

      external_link: row['Project External Link']?.trim() || null,

      homepage_feature: parseBoolean(row['Homepage Feature']),
      display_order: row['Display Order'] ? parseInt(row['Display Order'], 10) : null,

      is_archived: parseBoolean(row['Archived']),
      is_draft: parseBoolean(row['Draft']),
      is_deleted: parseBoolean(row['Deleted']),
    },
    categorySlugs,
  };
}

async function insertProject(data) {
  const { project, categorySlugs } = data;

  // Insert project
  const { data: inserted, error } = await supabase
    .from('projects')
    .upsert(project, { onConflict: 'webflow_id' })
    .select('id')
    .single();

  if (error) {
    console.error(`  Error inserting "${project.name}":`, error.message);
    return null;
  }

  const projectId = inserted.id;

  // Insert category relationships
  for (const slug of categorySlugs) {
    const subDirId = lookups.subDirectories[slug];
    if (subDirId) {
      await supabase
        .from('project_sub_directories')
        .upsert({ project_id: projectId, sub_directory_id: subDirId },
                { onConflict: 'project_id,sub_directory_id' });
    }
  }

  return projectId;
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('='.repeat(60));
  console.log('MTNS MADE - Project Import');
  console.log('='.repeat(60));
  console.log();
  console.log(`Include lapsed members: ${includeLapsed ? 'Yes' : 'No'}`);
  console.log();

  await loadLookups();

  // Read CSV
  console.log(`\nReading CSV: ${CONFIG.projectsCsv}`);
  const csv = fs.readFileSync(CONFIG.projectsCsv, 'utf-8');
  const records = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });

  console.log(`Found ${records.length} records in CSV`);

  // Transform and categorize
  const toImport = [];
  const skipped = {
    archived: 0,
    noMember: [],
    lapsed: [],
  };

  for (const row of records) {
    const result = transformProject(row);

    if (!result) {
      skipped.archived++;
    } else if (result.skip) {
      if (result.reason === 'no-member') {
        skipped.noMember.push({ name: result.name, memberSlug: result.memberSlug });
      } else if (result.reason === 'lapsed') {
        skipped.lapsed.push({ name: result.name, memberSlug: result.memberSlug });
      }
    } else {
      toImport.push(result);
    }
  }

  console.log(`\nTo import: ${toImport.length}`);
  console.log(`Skipped (archived/draft/deleted): ${skipped.archived}`);
  console.log(`Skipped (no member found): ${skipped.noMember.length}`);
  console.log(`Skipped (lapsed member): ${skipped.lapsed.length}`);

  if (skipped.noMember.length > 0 && skipped.noMember.length <= 10) {
    console.log('\nProjects with no matching member:');
    for (const p of skipped.noMember) {
      console.log(`  - "${p.name}" (member slug: ${p.memberSlug})`);
    }
  }

  if (skipped.lapsed.length > 0) {
    console.log(`\nProjects from lapsed members (not imported):`);
    for (const p of skipped.lapsed.slice(0, 10)) {
      console.log(`  - "${p.name}" (member: ${p.memberSlug})`);
    }
    if (skipped.lapsed.length > 10) {
      console.log(`  ... and ${skipped.lapsed.length - 10} more`);
    }
    console.log('\nTo include these, run: node import-projects.js --include-lapsed');
  }

  if (CONFIG.dryRun) {
    console.log('\n[DRY RUN] No data inserted.');
    return;
  }

  // Import
  console.log('\nImporting projects...');
  let success = 0;
  let errors = 0;

  for (let i = 0; i < toImport.length; i++) {
    const result = await insertProject(toImport[i]);
    if (result) {
      success++;
    } else {
      errors++;
    }

    if ((i + 1) % 50 === 0 || i === toImport.length - 1) {
      console.log(`  Progress: ${i + 1}/${toImport.length}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('COMPLETE');
  console.log('='.repeat(60));
  console.log(`Imported: ${success}`);
  console.log(`Errors: ${errors}`);

  // Verify
  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });

  const { count: catCount } = await supabase
    .from('project_sub_directories')
    .select('*', { count: 'exact', head: true });

  console.log(`\nDatabase counts:`);
  console.log(`  projects: ${projectCount}`);
  console.log(`  project_sub_directories: ${catCount}`);
}

main().catch(console.error);
