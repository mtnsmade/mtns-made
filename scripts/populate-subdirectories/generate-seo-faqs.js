/**
 * MTNS MADE - SEO Page Content + FAQ Generator
 *
 * Step 1: Fills missing seo-page-content on 9 items
 * Step 2: Generates faq-s RichText (H3 + P with internal links) for all 109 items
 *
 * Usage:
 *   node generate-seo-faqs.js               # run both steps on all items
 *   node generate-seo-faqs.js --step=1      # only fill missing seo-page-content
 *   node generate-seo-faqs.js --step=2      # only generate faq-s
 *   node generate-seo-faqs.js --dry-run     # preview without writing to Webflow
 *   node generate-seo-faqs.js --limit=5     # process first N items (for testing)
 */

import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';
import fs from 'fs';

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_API_TOKEN;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const COLLECTION_ID = process.env.WEBFLOW_SUBDIRECTORIES_COLLECTION_ID;
const WEBFLOW_API_BASE = 'https://api.webflow.com/v2';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const stepArg = args.find(a => a.startsWith('--step='));
const STEP = stepArg ? parseInt(stepArg.split('=')[1]) : null; // null = both steps
const limitArg = args.find(a => a.startsWith('--limit='));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1]) : null;

// Parent directory ID -> URL slug mapping (derived from sub-directory groupings)
const PARENT_ID_TO_SLUG = {
  '64ad5d25b6907c1bed526490': 'screen',
  '64ad5d2856cac56795029d2a': 'visual-arts',
  '64ad5d2dde2ea6eeaeb94003': 'design',
  '64ad5d31bf826ce4810f9b7a': 'craft',
  '64ad5d37ab90d652594a17a8': 'photography',
  '64ad5d3fde2ea6eeaeb95c9e': 'performing-arts',
  '64ad5d4b9a1e0e4717405adb': 'creative-education',
  '64ad5d519e2a54f5aab831aa': 'publishing',
  '64ad5d5fff882df891ead372': 'artisanal-products',
  '64bfaf6a75299ea8759488fc': 'cultural-work',
};

const PARENT_SLUG_TO_NAME = {
  'screen': 'Screen',
  'visual-arts': 'Visual Arts',
  'design': 'Design',
  'craft': 'Craft',
  'photography': 'Photography',
  'performing-arts': 'Performing Arts',
  'creative-education': 'Creative Education',
  'publishing': 'Publishing',
  'artisanal-products': 'Artisanal Products',
  'cultural-work': 'Cultural Work',
};

const PARENT_CONTEXT = {
  'artisanal-products': 'Artisanal Products - handcrafted goods including food, beverages, homewares, skincare, and toys made by Blue Mountains artisans',
  'craft': 'Craft - traditional and contemporary craft practices including ceramics, textiles, jewellery, woodwork, and more',
  'creative-education': 'Creative Education - teaching and mentoring in creative disciplines across the Blue Mountains',
  'cultural-work': 'Cultural Work - arts management, curation, research, and community cultural development',
  'design': 'Design - professional design services from graphic design to architecture, fashion to industrial design',
  'performing-arts': 'Performing Arts - live performance including music, dance, theatre, and circus arts',
  'photography': 'Photography - professional photography services across all genres and specialties',
  'publishing': 'Publishing - writing, editing, and content creation for print and digital media',
  'screen': 'Screen - film, video, and digital content creation including cinematography, editing, and production',
  'visual-arts': 'Visual Arts - fine art practices including painting, sculpture, installation, and new media',
};

async function webflowRequest(endpoint, options = {}) {
  const response = await fetch(`${WEBFLOW_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
      'Content-Type': 'application/json',
      'accept': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Webflow ${response.status}: ${err}`);
  }
  return response.json();
}

async function fetchAllItems() {
  let items = [];
  let offset = 0;
  const limit = 100;
  while (true) {
    const res = await webflowRequest(`/collections/${COLLECTION_ID}/items?limit=${limit}&offset=${offset}`);
    items = items.concat(res.items || []);
    if (!res.items || res.items.length < limit) break;
    offset += limit;
    await sleep(1000);
  }
  return items;
}

async function updateItem(itemId, fieldData) {
  return webflowRequest(`/collections/${COLLECTION_ID}/items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ fieldData }),
  });
}

async function publishItems(itemIds) {
  for (let i = 0; i < itemIds.length; i += 100) {
    const batch = itemIds.slice(i, i + 100);
    await webflowRequest(`/collections/${COLLECTION_ID}/items/publish`, {
      method: 'POST',
      body: JSON.stringify({ itemIds: batch }),
    });
    await sleep(1500);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateSeoPageContent(anthropic, name, parentSlug) {
  const parentContext = PARENT_CONTEXT[parentSlug] || parentSlug;

  const prompt = `You are writing SEO page content for MTNS MADE, a directory of creative professionals in the Blue Mountains region of Australia.

Write 2-3 paragraphs (as HTML using only <p> tags) for the sub-directory page: "${name}"
Parent category: ${parentContext}

Requirements:
- 150-220 words total
- Explain what "${name}" professionals do and what clients can expect when hiring them
- Mention the Blue Mountains region context naturally
- Include what makes local practitioners distinctive
- Warm, professional tone
- No marketing fluff or generic statements - be specific about this discipline
- Do not use em dashes
- Output only the HTML paragraphs, no JSON wrapper`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.content[0].text.trim();
}

async function generateFaqs(anthropic, name, parentSlug) {
  const parentSlugClean = parentSlug || 'creative';
  const parentName = PARENT_SLUG_TO_NAME[parentSlugClean] || 'Creative Arts';
  const parentContext = PARENT_CONTEXT[parentSlugClean] || '';
  const parentUrl = `/directories/${parentSlugClean}`;

  const prompt = `You are writing FAQ content for MTNS MADE, a directory of creative professionals in the Blue Mountains region of Australia.

Write exactly 4 FAQs for the sub-directory page: "${name}"
Parent category: ${parentName} (${parentContext})
Parent directory URL: ${parentUrl}

Requirements:
- Format: HTML using only <h3> and <p> tags
- Each FAQ is one <h3> question followed by one <p> answer
- Questions should be things a potential client or curious visitor would genuinely ask
- Answers should be helpful, specific, and 2-4 sentences
- At least one answer must include an internal link to ${parentUrl} using the anchor text "${parentName} directory" like: <a href="${parentUrl}">${parentName} directory</a>
- You may also link to /directory (the main member search) with anchor text "MTNS MADE member search" where genuinely useful
- Do not use em dashes
- Do not start questions with "What is" for every FAQ - vary the question formats
- Be specific to the "${name}" discipline, not generic

Output only the HTML, no JSON wrapper, no preamble.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 700,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.content[0].text.trim();
}

async function main() {
  console.log('='.repeat(60));
  console.log('MTNS MADE SEO Content + FAQ Generator');
  console.log('='.repeat(60));

  if (DRY_RUN) console.log('\nDRY RUN - no Webflow writes\n');
  if (STEP) console.log(`\nRunning step ${STEP} only\n`);

  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  console.log('\nFetching sub-directories...');
  let items = await fetchAllItems();
  console.log(`  Found ${items.length} items`);

  if (LIMIT) items = items.slice(0, LIMIT);

  const results = [];
  const errors = [];
  const updatedIds = [];

  // --- STEP 1: Fill missing seo-page-content ---
  const missingSeo = items.filter(i => !i.fieldData?.['seo-page-content']);
  if ((!STEP || STEP === 1) && missingSeo.length > 0) {
    console.log(`\nStep 1: Generating seo-page-content for ${missingSeo.length} items`);

    for (let i = 0; i < missingSeo.length; i++) {
      const item = missingSeo[i];
      const name = item.fieldData?.name || 'Unknown';
      const parentId = item.fieldData?.['choose-parent-directory'];
      const parentSlug = PARENT_ID_TO_SLUG[parentId] || null;

      console.log(`  [${i + 1}/${missingSeo.length}] ${name}`);

      try {
        const content = await generateSeoPageContent(anthropic, name, parentSlug);
        console.log(`    Generated: ${content.substring(0, 60)}...`);

        if (!DRY_RUN) {
          await updateItem(item.id, { 'seo-page-content': content });
          updatedIds.push(item.id);
          await sleep(1500);
        }
        results.push({ name, step: 1, status: 'ok' });
      } catch (err) {
        console.error(`    ERROR: ${err.message}`);
        errors.push({ name, step: 1, error: err.message });
      }
    }
  } else if (!STEP || STEP === 1) {
    console.log('\nStep 1: All items already have seo-page-content - skipping');
  }

  // --- STEP 2: Generate faq-s for all items ---
  const needsFaq = (!STEP || STEP === 2) ? items : [];
  if (needsFaq.length > 0) {
    console.log(`\nStep 2: Generating faq-s for ${needsFaq.length} items`);

    for (let i = 0; i < needsFaq.length; i++) {
      const item = needsFaq[i];
      const name = item.fieldData?.name || 'Unknown';
      const parentId = item.fieldData?.['choose-parent-directory'];
      const parentSlug = PARENT_ID_TO_SLUG[parentId] || null;

      console.log(`  [${i + 1}/${needsFaq.length}] ${name}`);

      try {
        const faqs = await generateFaqs(anthropic, name, parentSlug);
        console.log(`    Generated: ${faqs.substring(0, 60)}...`);

        if (!DRY_RUN) {
          await updateItem(item.id, { 'faq-s': faqs });
          if (!updatedIds.includes(item.id)) updatedIds.push(item.id);
          await sleep(1500);
        }
        results.push({ name, step: 2, status: 'ok' });
      } catch (err) {
        console.error(`    ERROR: ${err.message}`);
        errors.push({ name, step: 2, error: err.message });
      }
    }
  }

  // --- Publish ---
  if (!DRY_RUN && updatedIds.length > 0) {
    console.log(`\nPublishing ${updatedIds.length} updated items...`);
    await publishItems(updatedIds);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Done. Success: ${results.length} | Errors: ${errors.length}`);
  if (errors.length > 0) {
    console.log('Errors:');
    errors.forEach(e => console.log(`  ${e.name} (step ${e.step}): ${e.error}`));
  }

  const outputFile = `seo-faq-results-${new Date().toISOString().split('T')[0]}.json`;
  fs.writeFileSync(outputFile, JSON.stringify({ results, errors }, null, 2));
  console.log(`Results saved to ${outputFile}`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
