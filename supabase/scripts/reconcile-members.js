/**
 * MTNS MADE - Member Reconciliation Script
 *
 * Compares Memberstack export against imported Supabase data
 * Identifies missing, orphaned, or mismatched records
 *
 * Usage: node reconcile-members.js
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

  // Memberstack export CSV
  memberstackCsv: '/Users/paulmosig/Downloads/member-export-2026-02-06T05-35-58-410Z.csv',
};

const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

// ============================================
// MAIN RECONCILIATION
// ============================================

async function reconcile() {
  console.log('='.repeat(60));
  console.log('MTNS MADE - Member Reconciliation Report');
  console.log('='.repeat(60));
  console.log();

  // 1. Load Memberstack data
  console.log('Loading Memberstack export...');
  const csvContent = fs.readFileSync(CONFIG.memberstackCsv, 'utf-8');
  const memberstackRecords = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true,
  });

  // Create lookup by Memberstack ID
  const memberstackById = {};
  const memberstackByEmail = {};

  for (const record of memberstackRecords) {
    const id = record['Member ID']?.trim();
    const email = record['email']?.trim()?.toLowerCase();

    if (id) {
      memberstackById[id] = record;
    }
    if (email) {
      memberstackByEmail[email] = record;
    }
  }

  console.log(`  Memberstack records: ${memberstackRecords.length}`);
  console.log(`  Unique Memberstack IDs: ${Object.keys(memberstackById).length}`);
  console.log();

  // 2. Load Supabase members
  console.log('Loading Supabase members...');
  const { data: supabaseMembers, error } = await supabase
    .from('members')
    .select('id, memberstack_id, webflow_id, name, email, slug');

  if (error) {
    console.error('Error loading Supabase members:', error.message);
    return;
  }

  // Create lookup by Memberstack ID
  const supabaseByMemberstackId = {};
  const supabaseByWebflowId = {};
  const supabaseByEmail = {};

  for (const member of supabaseMembers) {
    if (member.memberstack_id) {
      supabaseByMemberstackId[member.memberstack_id] = member;
    }
    if (member.webflow_id) {
      supabaseByWebflowId[member.webflow_id] = member;
    }
    if (member.email) {
      supabaseByEmail[member.email.toLowerCase()] = member;
    }
  }

  console.log(`  Supabase members: ${supabaseMembers.length}`);
  console.log();

  // 3. Find members in Memberstack but NOT in Supabase
  console.log('-'.repeat(60));
  console.log('MEMBERS IN MEMBERSTACK BUT NOT IN SUPABASE');
  console.log('-'.repeat(60));

  const missingFromSupabase = [];

  for (const [msId, record] of Object.entries(memberstackById)) {
    if (!supabaseByMemberstackId[msId]) {
      missingFromSupabase.push({
        memberstackId: msId,
        email: record['email'],
        firstName: record['First name'],
        lastName: record['Last Name'],
        webflowId: record['Webflow Member ID'],
        hasWebflowId: !!record['Webflow Member ID']?.trim(),
      });
    }
  }

  if (missingFromSupabase.length === 0) {
    console.log('  None! All Memberstack members are in Supabase.');
  } else {
    console.log(`  Found ${missingFromSupabase.length} members:`);
    console.log();

    // Separate by whether they have Webflow ID
    const withWebflow = missingFromSupabase.filter(m => m.hasWebflowId);
    const withoutWebflow = missingFromSupabase.filter(m => !m.hasWebflowId);

    if (withWebflow.length > 0) {
      console.log(`  WITH Webflow ID (should have been imported): ${withWebflow.length}`);
      for (const m of withWebflow.slice(0, 10)) {
        console.log(`    - ${m.email} (MS: ${m.memberstackId}, WF: ${m.webflowId})`);
      }
      if (withWebflow.length > 10) {
        console.log(`    ... and ${withWebflow.length - 10} more`);
      }
    }

    console.log();

    if (withoutWebflow.length > 0) {
      console.log(`  WITHOUT Webflow ID (Memberstack-only, not in Webflow CMS): ${withoutWebflow.length}`);
      for (const m of withoutWebflow.slice(0, 10)) {
        console.log(`    - ${m.email} (${m.firstName} ${m.lastName})`);
      }
      if (withoutWebflow.length > 10) {
        console.log(`    ... and ${withoutWebflow.length - 10} more`);
      }
    }
  }

  console.log();

  // 4. Find members in Supabase but NOT in Memberstack
  console.log('-'.repeat(60));
  console.log('MEMBERS IN SUPABASE BUT NOT IN MEMBERSTACK');
  console.log('-'.repeat(60));

  const missingFromMemberstack = [];

  for (const member of supabaseMembers) {
    if (!memberstackById[member.memberstack_id]) {
      missingFromMemberstack.push(member);
    }
  }

  if (missingFromMemberstack.length === 0) {
    console.log('  None! All Supabase members exist in Memberstack.');
  } else {
    console.log(`  Found ${missingFromMemberstack.length} orphaned records:`);
    for (const m of missingFromMemberstack.slice(0, 20)) {
      console.log(`    - ${m.name} (${m.email}) - MS ID: ${m.memberstack_id}`);
    }
    if (missingFromMemberstack.length > 20) {
      console.log(`    ... and ${missingFromMemberstack.length - 20} more`);
    }
  }

  console.log();

  // 5. Summary
  console.log('='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`  Memberstack total:           ${memberstackRecords.length}`);
  console.log(`  Supabase total:              ${supabaseMembers.length}`);
  console.log(`  Missing from Supabase:       ${missingFromSupabase.length}`);
  console.log(`    - With Webflow ID:         ${missingFromSupabase.filter(m => m.hasWebflowId).length}`);
  console.log(`    - Without Webflow ID:      ${missingFromSupabase.filter(m => !m.hasWebflowId).length}`);
  console.log(`  Orphaned in Supabase:        ${missingFromMemberstack.length}`);
  console.log();

  // Calculate match rate
  const matchedCount = supabaseMembers.length - missingFromMemberstack.length;
  const matchRate = ((matchedCount / memberstackRecords.length) * 100).toFixed(1);
  console.log(`  Match rate: ${matchRate}% (${matchedCount}/${memberstackRecords.length} Memberstack records matched)`);
}

reconcile().catch(console.error);
