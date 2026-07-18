/**
 * MTNS MADE - Recover Deleted Member Webflow Profiles
 *
 * Incident recovery script: on 2026-07-18, a bug in the new lapsed-member-cleanup
 * function hard-deleted 42 members' Webflow CMS profile entries with no grace
 * period or warning email. Their Supabase records are intact (only soft-deleted),
 * and this script recreates their Webflow CMS entry from that intact data using
 * the same field mapping as the normal sync-to-webflow flow.
 *
 * Every recreated profile is created as a DRAFT (isDraft: true, isArchived: false) —
 * never auto-published. Nothing goes live to the public without a separate,
 * deliberate publish step reviewed by a human afterwards.
 *
 * Usage:
 *   node scripts/recover-deleted-members.js --dry-run              # preview only, no writes
 *   node scripts/recover-deleted-members.js --limit=1              # process just the first record (recommended first run)
 *   node scripts/recover-deleted-members.js --ids=<supabase-id>,... # process specific member(s) only
 *   node scripts/recover-deleted-members.js                        # process all affected members
 */

import fs from 'fs';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const WEBFLOW_API_TOKEN = process.env.WEBFLOW_API_TOKEN;
const WEBFLOW_API_BASE = 'https://api.webflow.com/v2';
const WEBFLOW_MEMBERS_COLLECTION_ID = process.env.WEBFLOW_MEMBERS_COLLECTION_ID;

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const limitArg = args.find(a => a.startsWith('--limit='));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1]) : null;
const idsArg = args.find(a => a.startsWith('--ids='));
const ONLY_IDS = idsArg ? idsArg.split('=')[1].split(',') : null;

const sleep = ms => new Promise(r => setTimeout(r, ms));

// The 42 Supabase member IDs whose Webflow entry was genuinely hard-deleted
// (confirmed via direct Webflow API 404 check on 2026-07-18, see
// /tmp/incident_full_check.json for the full audit trail this list was derived from).
const AFFECTED_MEMBER_IDS = [
  // Marcus Dabb ('b46d54c9-11ba-49c9-9edb-c8c88d3d9fe8') already recovered — webflow_id 6a5bdc7c6d5c6ce994be48e7
  '7dcc4bb3-6975-4cb2-b6f9-d7190431dfc6', // Emma Donlevy
  'be636616-52c7-4bc9-96c0-a040680f8b6f', // The Curation Co.
  'cc13c687-542e-4882-96d2-7ed634c69c11', // Alexandre Felix
  '47c43a89-779a-40b2-8187-12dd6707cb06', // Riley Saxton
  'dd23e0ab-31d0-4f1b-8a08-e3fc0d6f3413', // Chris Cannell
  'f3430497-671f-4327-93d7-6e6fa4ab898f', // Claire Absolum
  '4fd34963-1659-4638-a2e3-ca855ce2a330', // Crystal Pettit
  '4ee9dae9-fd79-4a0e-98fe-c26d3a1e2766', // Damon Baker
  '8ebafedd-44d4-4fb4-ab5f-fc181840bb5a', // Jonathan Bone
  '46a1ed60-a835-477e-a99e-fd86c0132223', // Patricia Swift
  'c937dc47-bfe6-4910-892c-49fa96483c3d', // Ben Toupein
  'ca3c7965-47d5-49cb-bb99-07b5317f344e', // Jefferton James
  '52d3a95b-cb20-4f78-8dad-eaa040f89a61', // Linda Kemp
  'a30553a8-db37-4190-bd0b-abdb0576a325', // Judith Martinez Estrada
  'ccdcdfbc-4b2d-4d06-a6af-f13953da55b1', // Katie Harvey
  '188d828c-38c4-4689-af47-20516605038c', // Marie Langley
  '0f5c0000-94cf-4107-a032-4f81481ee296', // Mike Wall
  '95b14fc1-06c8-4119-8b7d-95a0b350be6e', // Helen Sturgess
  'e503b744-334d-4d24-9e97-6c67f011ffb0', // Lisa Stenhouse
  'd7a13c4b-519f-4a8b-9aee-32987ce9eef7', // Tracey Elizabeth
  '6e01567f-9e89-44b7-b089-f6122cf528dd', // Charlotte Whittingham
  'a7b8e611-b804-42a3-8878-82e8a22b70f4', // Melissa Vaarzon-Morel
  '39baf366-4c75-4566-b523-c48332b1834b', // Leigh Hawkes
  '8fa0c590-9060-482d-9ed2-136398e3bcd8', // Alex Salter
  '42d62b7d-f653-49e2-ae37-1854763530c8', // Alexis Christofides
  'fd608ff7-b28b-4541-8594-3b8bb653daa5', // Andrew Ellis
  '5c9fd507-22b0-46d5-b71e-30fd86379dfa', // Jo Langley
  'a68dbb22-d9d7-4d46-8447-5df57529ed17', // Jeffrey Martinez
  '7c7c9fef-7c39-4539-8b93-a137aaf3b8df', // Mariam Sawires
  '06639f7c-94f1-41c2-bec5-9a35d1830f87', // Sabine Hanisch
  'e4b5636a-1728-4f9c-ba87-8daebb9970d6', // Betty Smith
  'f4e6dd6d-47a4-42eb-a196-5aef3e771065', // Charlotte Bakker
  '81da9130-5122-4aeb-b789-13245c544d6a', // Claude Williamson
  'eee933a1-8c3d-4d02-b044-c04d452c9e22', // Kim Draguns
  'bce2e6ed-12d0-44ca-a15c-cd28f29e2244', // Ellie Hofland
  'f58252bd-75e4-4d80-be02-9e28f4fb73bf', // Giles Gartrell-Mills
  '13ddd404-472d-4dc4-9cc1-88c89fc629b0', // Sophie Miller
  '900151df-66fe-4441-a029-b9098f13196c', // Tohby Riddle
  'e34edd16-decf-4d21-b3cf-a4d3d4f648dd', // Vicky Bekfi
  '62a75027-a5ae-4539-80e2-7d5173f4660e', // loulou Oldfield
  '1e077562-8efe-42df-b183-7a62f00f2eb1', // Virginia Burrow
];

async function supabaseFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase ${path} -> ${res.status}: ${text}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

function generateSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').replace(/-+/g, '-');
}

async function checkWebflowSlugExists(slug) {
  const res = await fetch(
    `${WEBFLOW_API_BASE}/collections/${WEBFLOW_MEMBERS_COLLECTION_ID}/items?slug=${encodeURIComponent(slug)}`,
    { headers: { Authorization: `Bearer ${WEBFLOW_API_TOKEN}`, accept: 'application/json' } }
  );
  if (!res.ok) return false;
  const result = await res.json();
  return !!(result.items && result.items.length > 0);
}

async function findAvailableSlug(baseSlug) {
  if (!(await checkWebflowSlugExists(baseSlug))) return baseSlug;
  for (let i = 2; i <= 99; i++) {
    const candidate = `${baseSlug}-${i}`;
    if (!(await checkWebflowSlugExists(candidate))) return candidate;
  }
  return `${baseSlug}-${Date.now().toString(36)}`;
}

async function getSuburbWebflowId(suburbId) {
  if (!suburbId) return null;
  const rows = await supabaseFetch(`suburbs?select=webflow_id&id=eq.${suburbId}`);
  return rows[0]?.webflow_id || null;
}

async function getMembershipTypeWebflowId(membershipTypeId) {
  if (!membershipTypeId) return null;
  const rows = await supabaseFetch(`membership_types?select=webflow_id&id=eq.${membershipTypeId}`);
  return rows[0]?.webflow_id || null;
}

async function getMemberCategoryWebflowIds(memberId) {
  const rows = await supabaseFetch(
    `member_sub_directories?select=sub_directories(webflow_id)&member_id=eq.${memberId}`
  );
  return rows.map(r => r.sub_directories?.webflow_id).filter(Boolean);
}

// Mirrors mapMemberToWebflowFields() in supabase/functions/sync-to-webflow/index.ts
async function buildFieldData(record) {
  const displayName = [record.first_name, record.last_name].filter(Boolean).join(' ')
    || record.name
    || record.email?.split('@')[0]
    || 'Member';

  const fieldData = { name: displayName };

  // Reuse the existing slug they had before (recorded in Supabase, unaffected by the
  // Webflow deletion) rather than re-deriving it from name/business rules.
  const baseSlug = record.slug || generateSlug(displayName);
  fieldData.slug = await findAvailableSlug(baseSlug);

  fieldData['memberstack-id'] = record.memberstack_id;
  if (record.first_name) fieldData['first-name'] = record.first_name;
  if (record.last_name) fieldData['last-name'] = record.last_name;
  if (record.email) fieldData['email-address'] = record.email;
  if (record.bio) fieldData['member-bio'] = record.bio;
  if (record.profile_image_url) fieldData['profile-image'] = { url: record.profile_image_url };
  if (record.header_image_url) fieldData['header-image'] = { url: record.header_image_url };
  fieldData['trading-or-business-name'] = record.business_name || '';

  const suburbWebflowId = await getSuburbWebflowId(record.suburb_id);
  if (suburbWebflowId) fieldData['suburb'] = suburbWebflowId;

  const membershipTypeWebflowId = await getMembershipTypeWebflowId(record.membership_type_id);
  if (membershipTypeWebflowId) fieldData['choose-membership-type'] = membershipTypeWebflowId;

  // Guard against pre-existing bad data (e.g. someone typed "instagram: xyz" or "Being built"
  // into the website field) — Webflow's API validates this as a URL and rejects it on create.
  // Leave the raw Supabase value untouched; only sanitize what we send to Webflow.
  const isValidUrl = record.website && /^https?:\/\//i.test(record.website);
  fieldData['website'] = isValidUrl ? record.website : '';
  fieldData['instagram'] = record.instagram || '';
  fieldData['fcaebook'] = record.facebook || ''; // Note: typo matches existing Webflow field name
  fieldData['linkedin'] = record.linkedin || '';
  fieldData['tiktok'] = record.tiktok || '';
  fieldData['youtube'] = record.youtube || '';

  if (record.opening_monday) fieldData['opening-monday'] = record.opening_monday;
  if (record.opening_tuesday) fieldData['opening-tuesday'] = record.opening_tuesday;
  if (record.opening_wednesday) fieldData['opening-wednesday'] = record.opening_wednesday;
  if (record.opening_thursday) fieldData['opening-thursday'] = record.opening_thursday;
  if (record.opening_friday) fieldData['opening-friday'] = record.opening_friday;
  if (record.opening_saturday) fieldData['opening-saturday'] = record.opening_saturday;
  if (record.opening_sunday) fieldData['opening-sunday'] = record.opening_sunday;

  fieldData['member-wants-to-display-public-address'] = record.show_address || false;
  fieldData['member-wants-to-display-public-opening-hours'] = record.show_opening_hours || false;

  const categoryWebflowIds = await getMemberCategoryWebflowIds(record.id);
  if (categoryWebflowIds.length > 0) fieldData['chosen-directories'] = categoryWebflowIds;

  fieldData['member-is-creative-space'] = record.is_creative_space || false;
  fieldData['member-is-supplier'] = record.is_supplier || false;

  return fieldData;
}

async function createDraftWebflowMember(record) {
  const fieldData = await buildFieldData(record);

  if (DRY_RUN) {
    console.log(`[DRY RUN] Would create Webflow item for ${record.name}:`, JSON.stringify(fieldData, null, 2));
    return { id: 'DRY_RUN_ID', slug: fieldData.slug };
  }

  const res = await fetch(`${WEBFLOW_API_BASE}/collections/${WEBFLOW_MEMBERS_COLLECTION_ID}/items`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WEBFLOW_API_TOKEN}`,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    // Always recreated as an unpublished draft, never archived-and-live or auto-published.
    // A human must explicitly publish these after reviewing.
    body: JSON.stringify({ fieldData, isDraft: true, isArchived: false }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Webflow create failed (${res.status}): ${text}`);
  }

  const result = await res.json();
  return { id: result.id, slug: result.fieldData?.slug || fieldData.slug };
}

async function main() {
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE'}`);

  let targetIds = ONLY_IDS || AFFECTED_MEMBER_IDS;
  if (LIMIT) targetIds = targetIds.slice(0, LIMIT);

  console.log(`Processing ${targetIds.length} member(s)`);

  const results = [];

  for (const id of targetIds) {
    try {
      const rows = await supabaseFetch(`members?select=*&id=eq.${id}`);
      const record = rows[0];
      if (!record) {
        console.error(`SKIP: no Supabase record found for id ${id}`);
        results.push({ id, status: 'skipped_not_found' });
        continue;
      }

      console.log(`\nRecreating: ${record.name} (${record.email})`);
      const { id: webflowId, slug } = await createDraftWebflowMember(record);
      console.log(`  -> Webflow item created: ${webflowId} (slug: ${slug})`);

      if (!DRY_RUN) {
        await supabaseFetch(`members?id=eq.${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ webflow_id: webflowId, slug, is_deleted: false, subscription_status: 'lapsed' }),
        });
        console.log('  -> Supabase record updated');
      }

      results.push({ id, name: record.name, status: 'success', webflowId, slug });
    } catch (err) {
      console.error(`  ERROR for ${id}:`, err.message);
      results.push({ id, status: 'error', error: err.message });
    }

    await sleep(600); // deliberate throttle — this is exactly what was missing last time
  }

  const summary = {
    total: results.length,
    succeeded: results.filter(r => r.status === 'success').length,
    failed: results.filter(r => r.status === 'error').length,
    skipped: results.filter(r => r.status === 'skipped_not_found').length,
  };

  console.log('\n=== SUMMARY ===');
  console.log(summary);
  fs.writeFileSync(
    `recovery-results-${Date.now()}.json`,
    JSON.stringify({ summary, results }, null, 2)
  );
  console.log('Full results written to recovery-results-<timestamp>.json');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
