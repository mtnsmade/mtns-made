/**
 * MTNS MADE - Cleanup Orphaned Members
 *
 * Removes members from Supabase that no longer exist in Memberstack
 * These are likely deleted accounts or test data
 *
 * Usage: node cleanup-orphaned-members.js
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

  dryRun: false,  // Set to true to preview without deleting
};

const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('='.repeat(60));
  console.log('MTNS MADE - Cleanup Orphaned Members');
  console.log('='.repeat(60));
  console.log();

  // Load Memberstack CSV
  console.log('Loading Memberstack export...');
  const csvContent = fs.readFileSync(CONFIG.memberstackCsv, 'utf-8');
  const memberstackRecords = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true,
  });

  const memberstackIds = new Set(
    memberstackRecords
      .map(r => r['Member ID']?.trim())
      .filter(id => id)
  );

  console.log(`  Memberstack has ${memberstackIds.size} members`);

  // Load Supabase members
  console.log('\nLoading Supabase members...');
  const { data: supabaseMembers, error } = await supabase
    .from('members')
    .select('id, memberstack_id, name, email');

  if (error) {
    console.error('Error loading members:', error.message);
    return;
  }

  console.log(`  Supabase has ${supabaseMembers.length} members`);

  // Find orphaned members
  const orphaned = supabaseMembers.filter(m => !memberstackIds.has(m.memberstack_id));

  console.log(`\nFound ${orphaned.length} orphaned members to remove:`);
  for (const m of orphaned) {
    console.log(`  - ${m.name} (${m.email})`);
    console.log(`    Memberstack ID: ${m.memberstack_id}`);
  }

  if (orphaned.length === 0) {
    console.log('\nNo orphaned members to clean up.');
    return;
  }

  if (CONFIG.dryRun) {
    console.log('\n[DRY RUN] No records deleted.');
    return;
  }

  // Delete orphaned members
  console.log('\nDeleting orphaned members...');

  const orphanedIds = orphaned.map(m => m.id);

  // Junction tables will cascade delete due to ON DELETE CASCADE
  const { error: deleteError } = await supabase
    .from('members')
    .delete()
    .in('id', orphanedIds);

  if (deleteError) {
    console.error('Error deleting members:', deleteError.message);
    return;
  }

  console.log(`\nDeleted ${orphaned.length} orphaned members.`);

  // Verify
  const { count } = await supabase
    .from('members')
    .select('*', { count: 'exact', head: true });

  console.log(`\nSupabase now has ${count} members.`);
}

main().catch(console.error);
