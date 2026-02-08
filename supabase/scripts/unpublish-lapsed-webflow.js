/**
 * MTNS MADE - Unpublish Lapsed Members from Webflow
 *
 * This script properly unpublishes lapsed members and their projects
 * from the live Webflow site using the unpublish API endpoint.
 *
 * Usage:
 *   node unpublish-lapsed-webflow.js --dry-run   # Preview
 *   node unpublish-lapsed-webflow.js             # Execute
 */

require('dotenv').config();

const CONFIG = {
  webflowToken: process.env.WEBFLOW_API_TOKEN,
  membersCollectionId: process.env.WEBFLOW_MEMBERS_COLLECTION_ID || '64a938756620ae4bee88df34',
  projectsCollectionId: process.env.WEBFLOW_PROJECTS_COLLECTION_ID || '64aa150f02bee661d503cf59',
};

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');

const WEBFLOW_API = 'https://api.webflow.com/v2';

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

  // Handle 204 No Content responses
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function fetchAllItems(collectionId) {
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
    await sleep(500);
  }

  return items;
}

async function archiveItems(collectionId, itemIds) {
  if (itemIds.length === 0) return { success: true };

  let archived = 0;
  let errors = 0;

  for (const itemId of itemIds) {
    try {
      // Archive the item - this removes it from the live site
      await webflowRequest(`/collections/${collectionId}/items/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify({ isArchived: true }),
      });
      archived++;
      process.stdout.write(`\r   Archived: ${archived}/${itemIds.length}`);
      await sleep(300); // Rate limiting
    } catch (error) {
      errors++;
      console.error(`\n   Error archiving ${itemId}: ${error.message}`);
    }
  }
  console.log(); // New line after progress

  return { success: true, archived, errors };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('='.repeat(60));
  console.log('MTNS MADE - Unpublish Lapsed Members from Webflow');
  console.log('='.repeat(60));
  console.log();

  if (DRY_RUN) {
    console.log('DRY RUN MODE - No changes will be made\n');
  }

  // 1. Fetch all members from Webflow
  console.log('Fetching members from Webflow...');
  const members = await fetchAllItems(CONFIG.membersCollectionId);
  console.log(`   Found ${members.length} total members`);

  // 2. Find members with "Changes in draft" status (isDraft: true but still published)
  // These are items where lastPublished exists but isDraft is true
  const lapsedMembers = members.filter(m => m.isDraft === true && m.lastPublished);
  console.log(`   Found ${lapsedMembers.length} members with "Changes in draft" status`);

  if (lapsedMembers.length === 0) {
    console.log('\nNo members to unpublish.');
    return;
  }

  // Show preview
  console.log('\nMembers to unpublish:');
  for (const member of lapsedMembers.slice(0, 20)) {
    const name = member.fieldData?.name || 'Unknown';
    console.log(`   - ${name} (${member.id})`);
  }
  if (lapsedMembers.length > 20) {
    console.log(`   ... and ${lapsedMembers.length - 20} more`);
  }

  // 3. Fetch projects and find those belonging to lapsed members
  console.log('\nFetching projects from Webflow...');
  const projects = await fetchAllItems(CONFIG.projectsCollectionId);
  console.log(`   Found ${projects.length} total projects`);

  const lapsedMemberIds = new Set(lapsedMembers.map(m => m.id));
  const lapsedMemberMsIds = new Set(
    lapsedMembers.map(m => m.fieldData?.['memberstack-id']).filter(id => id)
  );

  const lapsedProjects = projects.filter(p => {
    // Check by member reference
    const memberRef = p.fieldData?.member;
    if (memberRef && lapsedMemberIds.has(memberRef)) return true;

    // Check by memberstack ID
    const msId = p.fieldData?.['memberstack-id'];
    if (msId && lapsedMemberMsIds.has(msId)) return true;

    // Also include projects that are in "Changes in draft" status
    if (p.isDraft === true && p.lastPublished) return true;

    return false;
  });

  console.log(`   Found ${lapsedProjects.length} projects to unpublish`);

  if (DRY_RUN) {
    console.log('\n' + '='.repeat(60));
    console.log('DRY RUN SUMMARY');
    console.log('='.repeat(60));
    console.log(`\nWould unpublish:`);
    console.log(`   - ${lapsedMembers.length} members`);
    console.log(`   - ${lapsedProjects.length} projects`);
    console.log('\nRun without --dry-run to apply changes.');
    return;
  }

  // 4. Archive projects first
  console.log('\nArchiving projects (removes from live site)...');
  const projectIds = lapsedProjects.map(p => p.id);
  let projectResult = { archived: 0, errors: 0 };
  if (projectIds.length > 0) {
    projectResult = await archiveItems(CONFIG.projectsCollectionId, projectIds);
  }

  // 5. Archive members
  console.log('\nArchiving members (removes from live site)...');
  const memberIds = lapsedMembers.map(m => m.id);
  let memberResult = { archived: 0, errors: 0 };
  if (memberIds.length > 0) {
    memberResult = await archiveItems(CONFIG.membersCollectionId, memberIds);
  }

  console.log('\n' + '='.repeat(60));
  console.log('COMPLETE');
  console.log('='.repeat(60));
  console.log(`\nMembers archived: ${memberResult.archived} (${memberResult.errors} errors)`);
  console.log(`Projects archived: ${projectResult.archived} (${projectResult.errors} errors)`);
  console.log('\nArchived items are removed from the live site.');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
