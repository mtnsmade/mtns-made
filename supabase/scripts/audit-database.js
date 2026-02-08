/**
 * Database Structure Audit
 * Identifies redundancies and unused fields
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function audit() {
  console.log('='.repeat(60));
  console.log('DATABASE STRUCTURE AUDIT');
  console.log('='.repeat(60));

  // Get all table counts
  const tables = [
    'members',
    'membership_types',
    'suburbs',
    'directories',
    'sub_directories',
    'supplier_categories',
    'creative_space_categories',
    'member_directories',
    'member_sub_directories',
    'member_supplier_categories',
    'member_space_categories',
    'projects',
    'project_sub_directories',
    'events',
    'event_members'
  ];

  console.log('\nTABLE RECORD COUNTS');
  console.log('-'.repeat(40));

  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`  ${table}: ERROR - ${error.message}`);
    } else {
      console.log(`  ${table}: ${count}`);
    }
  }

  // Analyze member_directories redundancy
  console.log('\n' + '='.repeat(60));
  console.log('REDUNDANCY ANALYSIS');
  console.log('='.repeat(60));

  const { count: mdCount } = await supabase.from('member_directories').select('*', { count: 'exact', head: true });
  console.log(`\n1. member_directories: ${mdCount} records`);
  console.log('   REDUNDANT: Can derive parent directories from member_sub_directories');
  console.log('   via sub_directories.directory_id FK');

  // Check if memberstack_id in projects is needed (we have member_id FK)
  const { data: projectsWithBoth } = await supabase
    .from('projects')
    .select('id, member_id, memberstack_id')
    .not('member_id', 'is', null)
    .limit(5);

  console.log('\n2. projects.memberstack_id');
  console.log('   POTENTIALLY REDUNDANT: We have member_id FK to members table');
  console.log('   memberstack_id only needed during import, not for queries');

  // Check events.memberstack_id
  console.log('\n3. events.memberstack_id');
  console.log('   POTENTIALLY REDUNDANT: Same as projects - have member_id FK');

  // Check members table field usage
  console.log('\n' + '='.repeat(60));
  console.log('MEMBERS TABLE - FIELD USAGE');
  console.log('='.repeat(60));

  const { data: members } = await supabase.from('members').select('*');

  if (members && members.length > 0) {
    const cols = Object.keys(members[0]);
    const usage = [];

    for (const col of cols) {
      const nonNull = members.filter(m => {
        const val = m[col];
        return val !== null && val !== '' && val !== false;
      }).length;
      usage.push({
        col,
        used: nonNull,
        total: members.length,
        pct: Math.round(nonNull / members.length * 100)
      });
    }

    // Sort by usage percentage
    usage.sort((a, b) => a.pct - b.pct);

    console.log('\nLow usage fields (< 20%):');
    for (const u of usage.filter(u => u.pct < 20)) {
      console.log(`  ${u.col}: ${u.used}/${u.total} (${u.pct}%)`);
    }

    console.log('\nMedium usage fields (20-80%):');
    for (const u of usage.filter(u => u.pct >= 20 && u.pct < 80)) {
      console.log(`  ${u.col}: ${u.used}/${u.total} (${u.pct}%)`);
    }

    console.log('\nHigh usage fields (80%+):');
    for (const u of usage.filter(u => u.pct >= 80)) {
      console.log(`  ${u.col}: ${u.used}/${u.total} (${u.pct}%)`);
    }
  }

  // Check projects field usage
  console.log('\n' + '='.repeat(60));
  console.log('PROJECTS TABLE - FIELD USAGE');
  console.log('='.repeat(60));

  const { data: projects } = await supabase.from('projects').select('*');

  if (projects && projects.length > 0) {
    const cols = Object.keys(projects[0]);
    const usage = [];

    for (const col of cols) {
      const nonNull = projects.filter(p => {
        const val = p[col];
        return val !== null && val !== '' && val !== false;
      }).length;
      usage.push({
        col,
        used: nonNull,
        total: projects.length,
        pct: Math.round(nonNull / projects.length * 100)
      });
    }

    usage.sort((a, b) => a.pct - b.pct);

    console.log('\nLow usage fields (< 20%):');
    for (const u of usage.filter(u => u.pct < 20)) {
      console.log(`  ${u.col}: ${u.used}/${u.total} (${u.pct}%)`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('RECOMMENDATIONS');
  console.log('='.repeat(60));
  console.log(`
1. DROP member_directories table
   - Redundant: derive from member_sub_directories + sub_directories.directory_id
   - Saves: ${mdCount} junction records

2. CONSIDER removing memberstack_id from projects/events
   - Only needed during import
   - Can always join through member_id -> members.memberstack_id
   - Keep if you need to re-import without losing data

3. Review low-usage fields in members table
   - Fields with <10% usage may not be worth maintaining
   - Or may indicate data quality issues to fix
`);
}

audit().catch(console.error);
