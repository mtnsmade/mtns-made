/**
 * MTNS MADE - Cleanup Webflow Lapsed Members
 *
 * Unpublishes members and their projects from Webflow CMS
 * who are no longer active in Memberstack.
 *
 * Usage:
 *   node cleanup-webflow-lapsed.js --dry-run   # Preview changes
 *   node cleanup-webflow-lapsed.js             # Execute changes
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { parse } = require('csv-parse/sync');
const fs = require('fs');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // Memberstack active members export
  activeMembersCsv: '/Users/paulmosig/Downloads/member-export-2026-02-08T01-28-51-575Z.csv',

  // Supabase
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,

  // Webflow
  webflowToken: process.env.WEBFLOW_API_TOKEN,
  webflowSiteId: process.env.WEBFLOW_SITE_ID,
  membersCollectionId: process.env.WEBFLOW_MEMBERS_COLLECTION_ID,
  projectsCollectionId: process.env.WEBFLOW_PROJECTS_COLLECTION_ID,
};

// Parse args
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');

// Initialize clients
const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

const WEBFLOW_API = 'https://api.webflow.com/v2';

// ============================================
// WEBFLOW API HELPERS
// ============================================

async function webflowRequest(endpoint, options = {}) {
  const url = `${WEBFLOW_API}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${CONFIG.webflowToken}`,
      'Content-Type': 'application/json',
      'accept': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Webflow API error (${response.status}): ${error}`);
  }

  return response.json();
}

async function fetchAllWebflowItems(collectionId) {
  let items = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const response = await webflowRequest(
      `/collections/${collectionId}/items?limit=${limit}&offset=${offset}`
    );

    items = items.concat(response.items || []);

    if (!response.items || response.items.length < limit) {
      break;
    }

    offset += limit;
    await sleep(1000); // Rate limiting
  }

  return items;
}

async function unpublishWebflowItem(collectionId, itemId) {
  // Set item to draft (unpublished)
  return webflowRequest(`/collections/${collectionId}/items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      fieldData: {},
      isDraft: true,
    }),
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('='.repeat(60));
  console.log('MTNS MADE - Cleanup Webflow Lapsed Members');
  console.log('='.repeat(60));
  console.log();

  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
  }

  // 1. Load active members from Memberstack CSV
  console.log('📥 Loading active members from Memberstack export...');
  const csvContent = fs.readFileSync(CONFIG.activeMembersCsv, 'utf-8');
  const activeRecords = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });

  const activeMemberstackIds = new Set(
    activeRecords.map(r => r['Member ID']?.trim()).filter(id => id)
  );
  console.log(`   Active members in Memberstack: ${activeMemberstackIds.size}`);

  // 2. Fetch all members from Webflow
  console.log('\n📥 Fetching members from Webflow CMS...');
  const webflowMembers = await fetchAllWebflowItems(CONFIG.membersCollectionId);
  console.log(`   Members in Webflow: ${webflowMembers.length}`);

  // 3. Find lapsed members (in Webflow but not active in Memberstack)
  const lapsedMembers = webflowMembers.filter(member => {
    const memberstackId = member.fieldData?.['memberstack-id'];
    return memberstackId && !activeMemberstackIds.has(memberstackId);
  });

  console.log(`\n📊 Found ${lapsedMembers.length} lapsed members to unpublish`);

  if (lapsedMembers.length === 0) {
    console.log('\n✅ No lapsed members found. Webflow is already clean.');
    return;
  }

  // Show preview of lapsed members
  console.log('\nLapsed members:');
  for (const member of lapsedMembers.slice(0, 20)) {
    const name = member.fieldData?.name || 'Unknown';
    const email = member.fieldData?.['email-address'] || member.fieldData?.email || '';
    const msId = member.fieldData?.['memberstack-id'] || '';
    console.log(`   - ${name} (${email}) [${msId}]`);
  }
  if (lapsedMembers.length > 20) {
    console.log(`   ... and ${lapsedMembers.length - 20} more`);
  }

  // 4. Fetch all projects from Webflow
  console.log('\n📥 Fetching projects from Webflow CMS...');
  const webflowProjects = await fetchAllWebflowItems(CONFIG.projectsCollectionId);
  console.log(`   Projects in Webflow: ${webflowProjects.length}`);

  // 5. Find projects belonging to lapsed members
  const lapsedMemberIds = new Set(lapsedMembers.map(m => m.id));
  const lapsedMemberMsIds = new Set(
    lapsedMembers.map(m => m.fieldData?.['memberstack-id']).filter(id => id)
  );

  const projectsToUnpublish = webflowProjects.filter(project => {
    // Check by member reference field
    const memberRef = project.fieldData?.member;
    if (memberRef && lapsedMemberIds.has(memberRef)) {
      return true;
    }

    // Check by memberstack ID field
    const msId = project.fieldData?.['memberstack-id'];
    if (msId && lapsedMemberMsIds.has(msId)) {
      return true;
    }

    return false;
  });

  console.log(`   Projects from lapsed members: ${projectsToUnpublish.length}`);

  // 6. Execute unpublishing
  if (DRY_RUN) {
    console.log('\n' + '='.repeat(60));
    console.log('DRY RUN SUMMARY');
    console.log('='.repeat(60));
    console.log(`\nWould unpublish:`);
    console.log(`   - ${lapsedMembers.length} members`);
    console.log(`   - ${projectsToUnpublish.length} projects`);
    console.log('\nRun without --dry-run to apply changes.');
    return;
  }

  // Unpublish members
  console.log('\n📤 Unpublishing lapsed members from Webflow...');
  let membersUnpublished = 0;
  let memberErrors = 0;

  for (const member of lapsedMembers) {
    try {
      await unpublishWebflowItem(CONFIG.membersCollectionId, member.id);
      membersUnpublished++;
      process.stdout.write(`\r   Progress: ${membersUnpublished}/${lapsedMembers.length}`);
      await sleep(500); // Rate limiting
    } catch (error) {
      memberErrors++;
      console.error(`\n   Error unpublishing ${member.fieldData?.name}: ${error.message}`);
    }
  }
  console.log();

  // Unpublish projects
  console.log('\n📤 Unpublishing projects from lapsed members...');
  let projectsUnpublished = 0;
  let projectErrors = 0;

  for (const project of projectsToUnpublish) {
    try {
      await unpublishWebflowItem(CONFIG.projectsCollectionId, project.id);
      projectsUnpublished++;
      process.stdout.write(`\r   Progress: ${projectsUnpublished}/${projectsToUnpublish.length}`);
      await sleep(500); // Rate limiting
    } catch (error) {
      projectErrors++;
      console.error(`\n   Error unpublishing ${project.fieldData?.name}: ${error.message}`);
    }
  }
  console.log();

  // 7. Update Supabase with lapsed status
  console.log('\n📤 Updating Supabase with lapsed status...');

  const lapsedMsIds = Array.from(lapsedMemberMsIds);
  const now = new Date().toISOString();

  const { error: supabaseError } = await supabase
    .from('members')
    .update({
      subscription_status: 'lapsed',
      subscription_lapsed_at: now,
    })
    .in('memberstack_id', lapsedMsIds);

  if (supabaseError) {
    console.error(`   Error updating Supabase: ${supabaseError.message}`);
  } else {
    console.log(`   Updated ${lapsedMsIds.length} members in Supabase`);
  }

  // 8. Summary
  console.log('\n' + '='.repeat(60));
  console.log('COMPLETE');
  console.log('='.repeat(60));
  console.log(`\nMembers unpublished: ${membersUnpublished} (${memberErrors} errors)`);
  console.log(`Projects unpublished: ${projectsUnpublished} (${projectErrors} errors)`);
  console.log(`Supabase updated: ${lapsedMsIds.length} members marked as lapsed`);

  // Verify counts
  const { count: activeCount } = await supabase
    .from('members')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'active');

  const { count: lapsedCount } = await supabase
    .from('members')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'lapsed');

  console.log(`\nSupabase member counts:`);
  console.log(`   Active: ${activeCount}`);
  console.log(`   Lapsed: ${lapsedCount}`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
