/**
 * MTNS MADE - Import Missing Members from Memberstack
 *
 * Imports members that exist in Memberstack but not in Supabase
 * Uses Memberstack export data directly
 *
 * Usage: node import-missing-members.js
 */

const { createClient } = require('@supabase/supabase-js');
const { parse } = require('csv-parse/sync');
const fs = require('fs');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  supabaseUrl: process.env.SUPABASE_URL || 'https://epszwomtxkpjegbjbixr.supabase.co',
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwc3p3b210eGtwamVnYmpiaXhyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDMxMTkzNSwiZXhwIjoyMDg1ODg3OTM1fQ.H553wnuQ6gcrbyhOu-H8V7TE4bZtNaYq7Nd15-_rBmw',

  memberstackCsv: '/Users/paulmosig/Downloads/member-export-2026-02-06T05-35-58-410Z.csv',

  dryRun: false,  // Set to true to preview without inserting
};

const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

// ============================================
// LOOKUP MAPS
// ============================================

const lookups = {
  suburbs: {},
  membershipTypes: {},
  directories: {},
  subDirectories: {},
  supplierCategories: {},
  spaceCategories: {},
};

// ============================================
// HELPER FUNCTIONS
// ============================================

async function loadLookups() {
  console.log('Loading reference tables...');

  const { data: suburbs } = await supabase.from('suburbs').select('id, slug, name');
  suburbs?.forEach(r => {
    lookups.suburbs[r.slug] = r.id;
    lookups.suburbs[r.name.toLowerCase()] = r.id;
  });

  const { data: membershipTypes } = await supabase.from('membership_types').select('id, slug');
  membershipTypes?.forEach(r => lookups.membershipTypes[r.slug] = r.id);

  const { data: directories } = await supabase.from('directories').select('id, slug, webflow_id');
  directories?.forEach(r => {
    lookups.directories[r.slug] = r.id;
    lookups.directories[r.webflow_id] = r.id;
  });

  const { data: subDirectories } = await supabase.from('sub_directories').select('id, slug, webflow_id');
  subDirectories?.forEach(r => {
    lookups.subDirectories[r.slug] = r.id;
    lookups.subDirectories[r.webflow_id] = r.id;
  });

  const { data: supplierCategories } = await supabase.from('supplier_categories').select('id, slug, webflow_id');
  supplierCategories?.forEach(r => {
    lookups.supplierCategories[r.slug] = r.id;
    lookups.supplierCategories[r.webflow_id] = r.id;
  });

  const { data: spaceCategories } = await supabase.from('creative_space_categories').select('id, slug, webflow_id');
  spaceCategories?.forEach(r => {
    lookups.spaceCategories[r.slug] = r.id;
    lookups.spaceCategories[r.webflow_id] = r.id;
  });

  console.log(`  Loaded ${Object.keys(lookups.suburbs).length / 2} suburbs`);
  console.log(`  Loaded ${Object.keys(lookups.membershipTypes).length} membership types`);
}

/**
 * Parse Memberstack's quoted array format: "64c322813b98e1ea07e8db25","64c322813b98e1ea07e8dae6"
 */
function parseWebflowIds(value) {
  if (!value || value.trim() === '') return [];
  // Remove outer quotes and split by ","
  return value.replace(/^"|"$/g, '')
    .split('","')
    .map(id => id.replace(/"/g, '').trim())
    .filter(id => id.length > 0);
}

/**
 * Generate slug from name
 */
function generateSlug(firstName, lastName, businessName) {
  const name = businessName || `${firstName || ''} ${lastName || ''}`.trim();
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Transform Memberstack record to Supabase member
 */
function transformMemberstackRecord(record) {
  const memberstackId = record['Member ID']?.trim();
  if (!memberstackId) return null;

  const firstName = record['First name']?.trim() || null;
  const lastName = record['Last Name']?.trim() || null;
  const businessName = record['Trading Name']?.trim() || null;

  // Look up suburb
  const suburbName = record['Suburb']?.trim();
  const suburbId = suburbName ? (lookups.suburbs[suburbName.toLowerCase()] || null) : null;

  // Look up membership type
  const membershipSlug = record['Membership Type']?.trim();
  const membershipTypeId = membershipSlug ? lookups.membershipTypes[membershipSlug] : null;

  // Parse categories (Webflow IDs in Memberstack format)
  const categoryIds = parseWebflowIds(record['Categories']);
  const supplierCategoryIds = parseWebflowIds(record['Supplier Categories']);
  const spaceCategoryIds = parseWebflowIds(record['Creative Space Categories'] || record['Space Category']);

  return {
    member: {
      memberstack_id: memberstackId,
      webflow_id: record['Webflow Member ID']?.trim() || null,

      name: `${firstName || ''} ${lastName || ''}`.trim() || businessName || null,
      slug: record['Slug']?.trim() || generateSlug(firstName, lastName, businessName),
      first_name: firstName,
      last_name: lastName,
      email: record['email']?.trim() || null,

      business_name: businessName,
      suburb_id: suburbId,

      bio: record['Bio']?.trim() || null,
      short_summary: null,

      profile_image_url: record['Profile Pic URL']?.trim() || null,
      header_image_url: record['feature-image']?.trim() || null,

      membership_type_id: membershipTypeId,
      status: record['Status']?.trim() || 'active',

      is_business: record['Business']?.toLowerCase() === 'true',
      is_creative_space: record['Space']?.toLowerCase() === 'true',
      is_supplier: record['Supplier']?.toLowerCase() === 'true',

      show_address: false,
      show_opening_hours: false,

      opening_monday: record['Open Monday']?.trim() || null,
      opening_tuesday: record['Open Tuesday']?.trim() || null,
      opening_wednesday: record['Open Wednesday']?.trim() || null,
      opening_thursday: record['Open Thursday']?.trim() || null,
      opening_friday: record['Open Friday']?.trim() || null,
      opening_saturday: record['Open Saturday']?.trim() || null,
      opening_sunday: record['Open Sunday']?.trim() || null,

      website: record['Website']?.trim() || null,
      instagram: record['Instagram']?.trim() || null,
      facebook: record['Facebook']?.trim() || null,
      linkedin: record['LinkedIn']?.trim() || null,
      tiktok: record['TikTok']?.trim() || null,
      youtube: record['YouTube']?.trim() || null,
    },
    categoryIds,
    supplierCategoryIds,
    spaceCategoryIds,
  };
}

/**
 * Insert member and relationships
 */
async function insertMember(data) {
  const { member, categoryIds, supplierCategoryIds, spaceCategoryIds } = data;

  // Insert member
  const { data: inserted, error } = await supabase
    .from('members')
    .upsert(member, { onConflict: 'memberstack_id' })
    .select('id')
    .single();

  if (error) {
    console.error(`  Error inserting ${member.email}:`, error.message);
    return null;
  }

  const memberId = inserted.id;

  // Insert sub-directory relationships (categories are sub-directories)
  for (const webflowId of categoryIds) {
    const subDirId = lookups.subDirectories[webflowId];
    if (subDirId) {
      await supabase
        .from('member_sub_directories')
        .upsert({ member_id: memberId, sub_directory_id: subDirId },
                { onConflict: 'member_id,sub_directory_id' });
    }
  }

  // Insert supplier category relationships
  for (const webflowId of supplierCategoryIds) {
    const catId = lookups.supplierCategories[webflowId];
    if (catId) {
      await supabase
        .from('member_supplier_categories')
        .upsert({ member_id: memberId, supplier_category_id: catId },
                { onConflict: 'member_id,supplier_category_id' });
    }
  }

  // Insert space category relationships
  for (const webflowId of spaceCategoryIds) {
    const catId = lookups.spaceCategories[webflowId];
    if (catId) {
      await supabase
        .from('member_space_categories')
        .upsert({ member_id: memberId, space_category_id: catId },
                { onConflict: 'member_id,space_category_id' });
    }
  }

  return memberId;
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('='.repeat(60));
  console.log('MTNS MADE - Import Missing Members from Memberstack');
  console.log('='.repeat(60));
  console.log();

  await loadLookups();

  // Load Memberstack CSV
  console.log('\nLoading Memberstack export...');
  const csvContent = fs.readFileSync(CONFIG.memberstackCsv, 'utf-8');
  const memberstackRecords = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true,
  });

  // Load existing Supabase members
  const { data: existingMembers } = await supabase
    .from('members')
    .select('memberstack_id');

  const existingIds = new Set(existingMembers?.map(m => m.memberstack_id) || []);

  // Find missing members
  const missingRecords = memberstackRecords.filter(r => {
    const msId = r['Member ID']?.trim();
    return msId && !existingIds.has(msId);
  });

  console.log(`\nFound ${missingRecords.length} members to import`);

  if (CONFIG.dryRun) {
    console.log('\n[DRY RUN] Would import:');
    for (const record of missingRecords) {
      console.log(`  - ${record['email']} (${record['First name']} ${record['Last Name']})`);
    }
    return;
  }

  // Import missing members
  console.log('\nImporting...');
  let success = 0;
  let errors = 0;

  for (const record of missingRecords) {
    const data = transformMemberstackRecord(record);
    if (!data) {
      errors++;
      continue;
    }

    const result = await insertMember(data);
    if (result) {
      console.log(`  + ${record['email']}`);
      success++;
    } else {
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('COMPLETE');
  console.log('='.repeat(60));
  console.log(`  Imported: ${success}`);
  console.log(`  Errors: ${errors}`);
}

main().catch(console.error);
