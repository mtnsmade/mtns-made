/**
 * MTNS MADE - Sync Subscription Status
 *
 * Syncs subscription status from Memberstack active export to Supabase.
 * Implements 3-month retention policy for lapsed members.
 *
 * Usage:
 *   node sync-subscription-status.js [--cleanup]
 *
 * Options:
 *   --cleanup    Also delete members lapsed for > 3 months
 *   --dry-run    Preview changes without applying them
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

  // Export from Memberstack filtered to "active" and "trialling" members
  activeMembersCsv: '/Users/paulmosig/Downloads/member-export-2026-02-06T06-59-24-172Z.csv',

  // Retention period before permanent deletion
  retentionMonths: 3,
};

const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

// Parse command line args
const args = process.argv.slice(2);
const doCleanup = args.includes('--cleanup');
const dryRun = args.includes('--dry-run');

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('='.repeat(60));
  console.log('MTNS MADE - Sync Subscription Status');
  console.log('='.repeat(60));
  console.log();
  console.log(`Mode: ${dryRun ? 'DRY RUN (no changes)' : 'LIVE'}`);
  console.log(`Cleanup: ${doCleanup ? 'Yes (delete lapsed > 3 months)' : 'No'}`);
  console.log();

  // 1. Load active members from Memberstack export
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
  console.log(`  Active/trialling in Memberstack: ${activeMemberstackIds.size}`);

  // 2. Load all Supabase members
  console.log('\nLoading Supabase members...');
  const { data: supabaseMembers, error } = await supabase
    .from('members')
    .select('id, memberstack_id, name, email, subscription_status, subscription_lapsed_at');

  if (error) {
    console.error('Error loading members:', error.message);
    return;
  }
  console.log(`  Total in Supabase: ${supabaseMembers.length}`);

  // 3. Categorize and prepare updates
  const toMarkActive = [];      // Currently lapsed but now active
  const toMarkLapsed = [];      // Currently active but now lapsed
  const alreadyCorrect = [];    // No change needed

  for (const member of supabaseMembers) {
    const isActiveInMemberstack = activeMemberstackIds.has(member.memberstack_id);
    const currentStatus = member.subscription_status || 'active';

    if (isActiveInMemberstack) {
      // Should be active
      if (currentStatus === 'lapsed' || currentStatus === 'cancelled') {
        toMarkActive.push(member);
      } else {
        alreadyCorrect.push(member);
      }
    } else {
      // Should be lapsed
      if (currentStatus === 'active' || currentStatus === 'trialling') {
        toMarkLapsed.push(member);
      } else {
        alreadyCorrect.push(member);
      }
    }
  }

  // 4. Report planned changes
  console.log('\n' + '-'.repeat(60));
  console.log('CHANGES');
  console.log('-'.repeat(60));

  console.log(`\nMembers to mark as ACTIVE (re-subscribed): ${toMarkActive.length}`);
  for (const m of toMarkActive.slice(0, 5)) {
    console.log(`  + ${m.name} (${m.email})`);
  }
  if (toMarkActive.length > 5) console.log(`  ... and ${toMarkActive.length - 5} more`);

  console.log(`\nMembers to mark as LAPSED: ${toMarkLapsed.length}`);
  for (const m of toMarkLapsed.slice(0, 10)) {
    console.log(`  - ${m.name} (${m.email})`);
  }
  if (toMarkLapsed.length > 10) console.log(`  ... and ${toMarkLapsed.length - 10} more`);

  console.log(`\nAlready correct: ${alreadyCorrect.length}`);

  // 5. Apply updates (unless dry run)
  if (!dryRun) {
    console.log('\n' + '-'.repeat(60));
    console.log('APPLYING CHANGES');
    console.log('-'.repeat(60));

    // Mark re-subscribed members as active
    if (toMarkActive.length > 0) {
      console.log(`\nMarking ${toMarkActive.length} members as active...`);
      const { error: activeError } = await supabase
        .from('members')
        .update({
          subscription_status: 'active',
          subscription_lapsed_at: null,
        })
        .in('id', toMarkActive.map(m => m.id));

      if (activeError) {
        console.error('  Error:', activeError.message);
      } else {
        console.log('  Done.');
      }
    }

    // Mark lapsed members
    if (toMarkLapsed.length > 0) {
      console.log(`\nMarking ${toMarkLapsed.length} members as lapsed...`);

      // Only set lapsed_at if not already set (preserve original lapse date)
      for (const member of toMarkLapsed) {
        const updateData = {
          subscription_status: 'lapsed',
        };

        // Only set lapsed_at if it's not already set
        if (!member.subscription_lapsed_at) {
          updateData.subscription_lapsed_at = new Date().toISOString();
        }

        const { error: lapsedError } = await supabase
          .from('members')
          .update(updateData)
          .eq('id', member.id);

        if (lapsedError) {
          console.error(`  Error updating ${member.email}:`, lapsedError.message);
        }
      }
      console.log('  Done.');
    }
  }

  // 6. Cleanup old lapsed members (if requested)
  if (doCleanup) {
    console.log('\n' + '-'.repeat(60));
    console.log('CLEANUP: Members lapsed > 3 months');
    console.log('-'.repeat(60));

    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - CONFIG.retentionMonths);

    const { data: expiredMembers, error: expiredError } = await supabase
      .from('members')
      .select('id, name, email, subscription_lapsed_at')
      .eq('subscription_status', 'lapsed')
      .lt('subscription_lapsed_at', cutoffDate.toISOString());

    if (expiredError) {
      console.error('Error finding expired members:', expiredError.message);
    } else if (expiredMembers && expiredMembers.length > 0) {
      console.log(`\nFound ${expiredMembers.length} members to delete:`);
      for (const m of expiredMembers) {
        const lapsedDate = new Date(m.subscription_lapsed_at).toLocaleDateString();
        console.log(`  - ${m.name} (${m.email}) - lapsed ${lapsedDate}`);
      }

      if (!dryRun) {
        console.log('\nDeleting...');
        const { error: deleteError } = await supabase
          .from('members')
          .delete()
          .in('id', expiredMembers.map(m => m.id));

        if (deleteError) {
          console.error('  Error:', deleteError.message);
        } else {
          console.log(`  Deleted ${expiredMembers.length} members.`);
        }
      } else {
        console.log('\n[DRY RUN] Would delete these members.');
      }
    } else {
      console.log('\nNo members have been lapsed for more than 3 months.');
    }
  }

  // 7. Final summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));

  const { data: finalCounts } = await supabase
    .from('members')
    .select('subscription_status');

  const counts = {
    active: 0,
    trialling: 0,
    lapsed: 0,
    cancelled: 0,
    null: 0,
  };

  for (const m of finalCounts || []) {
    const status = m.subscription_status || 'null';
    counts[status] = (counts[status] || 0) + 1;
  }

  console.log(`\nCurrent subscription status breakdown:`);
  console.log(`  Active:    ${counts.active}`);
  console.log(`  Trialling: ${counts.trialling}`);
  console.log(`  Lapsed:    ${counts.lapsed}`);
  console.log(`  Cancelled: ${counts.cancelled}`);
  if (counts.null > 0) console.log(`  (no status): ${counts.null}`);
  console.log(`  Total:     ${finalCounts?.length || 0}`);
}

main().catch(console.error);
