/**
 * MTNS MADE - Reconcile Active Members
 *
 * Compares Supabase against Memberstack "active/trialling" export
 * to identify members that should be marked active vs inactive
 */

const { createClient } = require('@supabase/supabase-js');
const { parse } = require('csv-parse/sync');
const fs = require('fs');

const CONFIG = {
  supabaseUrl: 'https://epszwomtxkpjegbjbixr.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwc3p3b210eGtwamVnYmpiaXhyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDMxMTkzNSwiZXhwIjoyMDg1ODg3OTM1fQ.H553wnuQ6gcrbyhOu-H8V7TE4bZtNaYq7Nd15-_rBmw',

  // Active members only export
  activeMembersCsv: '/Users/paulmosig/Downloads/member-export-2026-02-06T06-59-24-172Z.csv',
};

const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

async function main() {
  console.log('='.repeat(60));
  console.log('MTNS MADE - Active Members Reconciliation');
  console.log('='.repeat(60));
  console.log();

  // Load active members from Memberstack
  console.log('Loading active members export...');
  const csv = fs.readFileSync(CONFIG.activeMembersCsv, 'utf-8');
  const activeRecords = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });

  const activeMemberstackIds = new Set(
    activeRecords.map(r => r['Member ID']?.trim()).filter(id => id)
  );

  console.log(`  Active/trialling members in Memberstack: ${activeMemberstackIds.size}`);

  // Load Supabase members
  console.log('\nLoading Supabase members...');
  const { data: supabaseMembers, error } = await supabase
    .from('members')
    .select('id, memberstack_id, name, email, status');

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  console.log(`  Total members in Supabase: ${supabaseMembers.length}`);

  // Categorize
  const activeInBoth = [];
  const inSupabaseNotActive = [];
  const activeNotInSupabase = [];

  for (const member of supabaseMembers) {
    if (activeMemberstackIds.has(member.memberstack_id)) {
      activeInBoth.push(member);
    } else {
      inSupabaseNotActive.push(member);
    }
  }

  for (const msId of activeMemberstackIds) {
    const inSupabase = supabaseMembers.find(m => m.memberstack_id === msId);
    if (!inSupabase) {
      const record = activeRecords.find(r => r['Member ID'] === msId);
      activeNotInSupabase.push({
        memberstackId: msId,
        email: record?.email,
        name: `${record?.['First name'] || ''} ${record?.['Last Name'] || ''}`.trim(),
      });
    }
  }

  // Report
  console.log('\n' + '-'.repeat(60));
  console.log('RESULTS');
  console.log('-'.repeat(60));

  console.log(`\nActive in both Memberstack AND Supabase: ${activeInBoth.length}`);

  console.log(`\nIn Supabase but NOT active in Memberstack (lapsed/cancelled): ${inSupabaseNotActive.length}`);
  if (inSupabaseNotActive.length > 0 && inSupabaseNotActive.length <= 30) {
    for (const m of inSupabaseNotActive) {
      console.log(`  - ${m.name} (${m.email})`);
    }
  } else if (inSupabaseNotActive.length > 30) {
    for (const m of inSupabaseNotActive.slice(0, 10)) {
      console.log(`  - ${m.name} (${m.email})`);
    }
    console.log(`  ... and ${inSupabaseNotActive.length - 10} more`);
  }

  console.log(`\nActive in Memberstack but NOT in Supabase: ${activeNotInSupabase.length}`);
  if (activeNotInSupabase.length > 0) {
    for (const m of activeNotInSupabase.slice(0, 20)) {
      console.log(`  - ${m.name} (${m.email}) [${m.memberstackId}]`);
    }
    if (activeNotInSupabase.length > 20) {
      console.log(`  ... and ${activeNotInSupabase.length - 20} more`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`  Memberstack active/trialling: ${activeMemberstackIds.size}`);
  console.log(`  Supabase total:               ${supabaseMembers.length}`);
  console.log(`  Active match:                 ${activeInBoth.length}`);
  console.log(`  Lapsed (in Supabase):         ${inSupabaseNotActive.length}`);
  console.log(`  Missing from Supabase:        ${activeNotInSupabase.length}`);

  // Return data for potential updates
  return {
    activeInBoth,
    inSupabaseNotActive,
    activeNotInSupabase,
  };
}

main().catch(console.error);
