/**
 * MTNS MADE - Member Import Script
 *
 * Imports members from Webflow CSV export into Supabase
 *
 * Usage:
 *   1. Install dependencies: npm install @supabase/supabase-js csv-parse
 *   2. Set environment variables or edit config below
 *   3. Run: node import-members.js
 */

const { createClient } = require('@supabase/supabase-js');
const { parse } = require('csv-parse/sync');
const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // Supabase connection (use service role key for imports)
  supabaseUrl: process.env.SUPABASE_URL || 'https://epszwomtxkpjegbjbixr.supabase.co',
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwc3p3b210eGtwamVnYmpiaXhyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDMxMTkzNSwiZXhwIjoyMDg1ODg3OTM1fQ.H553wnuQ6gcrbyhOu-H8V7TE4bZtNaYq7Nd15-_rBmw',

  // CSV file path
  csvPath: process.env.CSV_PATH || '/Users/paulmosig/Downloads/MTNS MADE - Members - 64a938756620ae4bee88df34.csv',

  // Import options
  dryRun: false,  // Set to true to test without inserting
  batchSize: 50,  // Records per batch insert
};

// ============================================
// INITIALIZE SUPABASE
// ============================================

const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

// ============================================
// LOOKUP MAPS (populated at runtime)
// ============================================

const lookups = {
  suburbs: {},           // slug -> uuid
  membershipTypes: {},   // slug -> uuid
  directories: {},       // slug -> uuid
  subDirectories: {},    // slug -> uuid
  supplierCategories: {}, // slug -> uuid
  spaceCategories: {},   // slug -> uuid
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Load all reference tables into lookup maps
 */
async function loadLookups() {
  console.log('Loading reference tables...');

  // Suburbs
  const { data: suburbs } = await supabase.from('suburbs').select('id, slug');
  suburbs?.forEach(r => lookups.suburbs[r.slug] = r.id);
  console.log(`  Loaded ${Object.keys(lookups.suburbs).length} suburbs`);

  // Membership Types
  const { data: membershipTypes } = await supabase.from('membership_types').select('id, slug');
  membershipTypes?.forEach(r => lookups.membershipTypes[r.slug] = r.id);
  console.log(`  Loaded ${Object.keys(lookups.membershipTypes).length} membership types`);

  // Directories
  const { data: directories } = await supabase.from('directories').select('id, slug');
  directories?.forEach(r => lookups.directories[r.slug] = r.id);
  console.log(`  Loaded ${Object.keys(lookups.directories).length} directories`);

  // Sub-Directories
  const { data: subDirectories } = await supabase.from('sub_directories').select('id, slug');
  subDirectories?.forEach(r => lookups.subDirectories[r.slug] = r.id);
  console.log(`  Loaded ${Object.keys(lookups.subDirectories).length} sub-directories`);

  // Supplier Categories
  const { data: supplierCategories } = await supabase.from('supplier_categories').select('id, slug');
  supplierCategories?.forEach(r => lookups.supplierCategories[r.slug] = r.id);
  console.log(`  Loaded ${Object.keys(lookups.supplierCategories).length} supplier categories`);

  // Creative Space Categories
  const { data: spaceCategories } = await supabase.from('creative_space_categories').select('id, slug');
  spaceCategories?.forEach(r => lookups.spaceCategories[r.slug] = r.id);
  console.log(`  Loaded ${Object.keys(lookups.spaceCategories).length} space categories`);
}

/**
 * Parse semicolon-separated slugs into array
 */
function parseSlugs(value) {
  if (!value || value.trim() === '') return [];
  return value.split(';').map(s => s.trim()).filter(s => s.length > 0);
}

/**
 * Convert CSV boolean values
 */
function parseBoolean(value) {
  if (!value) return false;
  return value.toLowerCase() === 'true';
}

/**
 * Transform CSV row to member record
 */
function transformMember(row) {
  // Skip archived or draft members
  if (parseBoolean(row['Archived']) || parseBoolean(row['Draft'])) {
    return null;
  }

  // Must have memberstack ID
  const memberstackId = row['Memberstack ID'];
  if (!memberstackId || memberstackId.trim() === '') {
    console.warn(`  Skipping member "${row['Name']}" - no Memberstack ID`);
    return null;
  }

  // Look up suburb UUID
  const suburbSlug = row['Suburb']?.trim();
  const suburbId = suburbSlug ? lookups.suburbs[suburbSlug] : null;
  if (suburbSlug && !suburbId) {
    console.warn(`  Warning: Unknown suburb "${suburbSlug}" for member "${row['Name']}"`);
  }

  // Look up membership type UUID
  const membershipSlug = row['Choose Membership Type']?.trim();
  const membershipTypeId = membershipSlug ? lookups.membershipTypes[membershipSlug] : null;
  if (membershipSlug && !membershipTypeId) {
    console.warn(`  Warning: Unknown membership type "${membershipSlug}" for member "${row['Name']}"`);
  }

  return {
    // System IDs
    memberstack_id: memberstackId.trim(),
    webflow_id: row['Item ID']?.trim() || null,

    // Basic Info
    name: row['Name']?.trim() || null,
    slug: row['Slug']?.trim() || null,
    first_name: row['First name']?.trim() || null,
    last_name: row['Last Name']?.trim() || null,
    email: row['Email Address']?.trim() || null,

    // Business Info
    business_name: row['Trading or Business Name']?.trim() || null,
    suburb_id: suburbId,

    // Profile Content
    bio: row['Member Bio']?.trim() || null,
    short_summary: row['Member short summary']?.trim() || null,

    // Images
    profile_image_url: row['Profile Image']?.trim() || null,
    header_image_url: row['Header Image']?.trim() || null,

    // Membership & Status
    membership_type_id: membershipTypeId,
    status: row['Status']?.trim() || null,

    // Member Type Flags
    is_business: parseBoolean(row['Member is small business, large business or not for profit']),
    is_creative_space: parseBoolean(row['Member is Creative Space']),
    is_supplier: parseBoolean(row['Member is Supplier']),

    // Display Preferences
    show_address: parseBoolean(row['Member wants to display public address']),
    show_opening_hours: parseBoolean(row['Member wants to display public opening hours']),

    // Opening Hours
    opening_monday: row['Opening Monday']?.trim() || null,
    opening_tuesday: row['Opening Tuesday']?.trim() || null,
    opening_wednesday: row['Opening Wednesday']?.trim() || null,
    opening_thursday: row['Opening Thursday']?.trim() || null,
    opening_friday: row['Opening Friday']?.trim() || null,
    opening_saturday: row['Opening Saturday']?.trim() || null,
    opening_sunday: row['Opening Sunday']?.trim() || null,

    // Social Links
    website: row['Website']?.trim() || null,
    instagram: row['Instagram']?.trim() || null,
    facebook: row['Fcaebook']?.trim() || null,  // Note: typo in original CSV
    linkedin: row['LinkedIn']?.trim() || null,
    tiktok: row['Tiktok']?.trim() || null,
    youtube: row['Youtube']?.trim() || null,

    // Categories (for junction tables - stored temporarily)
    _mainDirectories: parseSlugs(row['Main Directories']),
    _chosenDirectories: parseSlugs(row['Chosen directories']),
    _supplierCategories: parseSlugs(row['Supplier Categories']),
    _spaceCategories: parseSlugs(row['Space Category']),
  };
}

/**
 * Insert member and their category relationships
 */
async function insertMember(member) {
  // Extract category arrays (not part of members table)
  const mainDirectories = member._mainDirectories;
  const chosenDirectories = member._chosenDirectories;
  const supplierCategories = member._supplierCategories;
  const spaceCategories = member._spaceCategories;

  // Remove temporary fields
  delete member._mainDirectories;
  delete member._chosenDirectories;
  delete member._supplierCategories;
  delete member._spaceCategories;

  // Insert member
  const { data: insertedMember, error: memberError } = await supabase
    .from('members')
    .upsert(member, { onConflict: 'memberstack_id' })
    .select('id')
    .single();

  if (memberError) {
    console.error(`  Error inserting member "${member.name}":`, memberError.message);
    return null;
  }

  const memberId = insertedMember.id;

  // Insert main directories relationships
  for (const slug of mainDirectories) {
    const directoryId = lookups.directories[slug];
    if (directoryId) {
      const { error } = await supabase
        .from('member_directories')
        .upsert({ member_id: memberId, directory_id: directoryId },
                { onConflict: 'member_id,directory_id' });
      if (error && !error.message.includes('duplicate')) {
        console.error(`  Error linking directory "${slug}":`, error.message);
      }
    } else {
      console.warn(`  Warning: Unknown directory "${slug}" for member "${member.name}"`);
    }
  }

  // Insert chosen directories (sub-directories) relationships
  for (const slug of chosenDirectories) {
    const subDirectoryId = lookups.subDirectories[slug];
    if (subDirectoryId) {
      const { error } = await supabase
        .from('member_sub_directories')
        .upsert({ member_id: memberId, sub_directory_id: subDirectoryId },
                { onConflict: 'member_id,sub_directory_id' });
      if (error && !error.message.includes('duplicate')) {
        console.error(`  Error linking sub-directory "${slug}":`, error.message);
      }
    } else {
      console.warn(`  Warning: Unknown sub-directory "${slug}" for member "${member.name}"`);
    }
  }

  // Insert supplier categories relationships
  for (const slug of supplierCategories) {
    const categoryId = lookups.supplierCategories[slug];
    if (categoryId) {
      const { error } = await supabase
        .from('member_supplier_categories')
        .upsert({ member_id: memberId, supplier_category_id: categoryId },
                { onConflict: 'member_id,supplier_category_id' });
      if (error && !error.message.includes('duplicate')) {
        console.error(`  Error linking supplier category "${slug}":`, error.message);
      }
    } else {
      console.warn(`  Warning: Unknown supplier category "${slug}" for member "${member.name}"`);
    }
  }

  // Insert space categories relationships
  for (const slug of spaceCategories) {
    const categoryId = lookups.spaceCategories[slug];
    if (categoryId) {
      const { error } = await supabase
        .from('member_space_categories')
        .upsert({ member_id: memberId, space_category_id: categoryId },
                { onConflict: 'member_id,space_category_id' });
      if (error && !error.message.includes('duplicate')) {
        console.error(`  Error linking space category "${slug}":`, error.message);
      }
    } else {
      console.warn(`  Warning: Unknown space category "${slug}" for member "${member.name}"`);
    }
  }

  return memberId;
}

// ============================================
// MAIN IMPORT FUNCTION
// ============================================

async function importMembers() {
  console.log('='.repeat(50));
  console.log('MTNS MADE - Member Import');
  console.log('='.repeat(50));

  // Load reference data
  await loadLookups();

  // Read CSV file
  console.log(`\nReading CSV: ${CONFIG.csvPath}`);
  const csvContent = fs.readFileSync(CONFIG.csvPath, 'utf-8');

  // Parse CSV
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`Found ${records.length} records in CSV`);

  // Transform and filter records
  const members = records
    .map(transformMember)
    .filter(m => m !== null);

  console.log(`${members.length} valid members to import (after filtering archived/draft/no-memberstack-id)`);

  if (CONFIG.dryRun) {
    console.log('\n[DRY RUN] - No data will be inserted');
    console.log('Sample transformed member:');
    console.log(JSON.stringify(members[0], null, 2));
    return;
  }

  // Import members
  console.log('\nImporting members...');
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    const result = await insertMember(member);

    if (result) {
      successCount++;
    } else {
      errorCount++;
    }

    // Progress indicator
    if ((i + 1) % 50 === 0 || i === members.length - 1) {
      console.log(`  Progress: ${i + 1}/${members.length} (${successCount} success, ${errorCount} errors)`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('Import Complete');
  console.log('='.repeat(50));
  console.log(`Total processed: ${members.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Errors: ${errorCount}`);

  // Verify counts
  const { count: memberCount } = await supabase
    .from('members')
    .select('*', { count: 'exact', head: true });

  const { count: dirCount } = await supabase
    .from('member_directories')
    .select('*', { count: 'exact', head: true });

  const { count: subDirCount } = await supabase
    .from('member_sub_directories')
    .select('*', { count: 'exact', head: true });

  console.log(`\nDatabase counts:`);
  console.log(`  members: ${memberCount}`);
  console.log(`  member_directories: ${dirCount}`);
  console.log(`  member_sub_directories: ${subDirCount}`);
}

// Run import
importMembers().catch(console.error);
