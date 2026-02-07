/**
 * MTNS MADE Sub-Directory Content Generator
 *
 * This script populates the 109 sub-directory pages with:
 * - AI-generated descriptions
 * - SEO titles (max 60 chars)
 * - SEO descriptions (max 160 chars)
 * - Featured project references
 * - Member credits
 *
 * Usage:
 * 1. Copy .env.example to .env and fill in your API keys
 * 2. Run: node index.js
 *
 * Options:
 *   --dry-run    Preview changes without updating Webflow
 *   --category   Only process a specific category (e.g., --category=photography)
 */

import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';
import fs from 'fs';

// Configuration
const WEBFLOW_API_TOKEN = process.env.WEBFLOW_API_TOKEN;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const SUBDIRECTORIES_COLLECTION_ID = process.env.WEBFLOW_SUBDIRECTORIES_COLLECTION_ID;
const PROJECTS_COLLECTION_ID = process.env.WEBFLOW_PROJECTS_COLLECTION_ID;
const MEMBERS_COLLECTION_ID = process.env.WEBFLOW_MEMBERS_COLLECTION_ID;
const SITE_ID = process.env.WEBFLOW_SITE_ID;

const WEBFLOW_API_BASE = 'https://api.webflow.com/v2';

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const categoryArg = args.find(a => a.startsWith('--category='));
const FILTER_CATEGORY = categoryArg ? categoryArg.split('=')[1] : null;

// Parent directory context for better AI generation
const DIRECTORY_CONTEXT = {
  'artisanal-products': 'Artisanal Products - handcrafted goods including food, beverages, homewares, skincare, and toys made by Blue Mountains artisans',
  'craft': 'Craft - traditional and contemporary craft practices including ceramics, textiles, jewellery, woodwork, and more',
  'creative-education': 'Creative Education - teaching and mentoring in creative disciplines across the Blue Mountains',
  'cultural-work': 'Cultural Work - arts management, curation, research, and community cultural development',
  'design': 'Design - professional design services from graphic design to architecture, fashion to industrial design',
  'performing-arts': 'Performing Arts - live performance including music, dance, theatre, and circus arts',
  'photography': 'Photography - professional photography services across all genres and specialties',
  'publishing': 'Publishing - writing, editing, and content creation for print and digital media',
  'screen': 'Screen - film, video, and digital content creation including cinematography, editing, and production',
  'visual-arts': 'Visual Arts - fine art practices including painting, sculpture, installation, and new media'
};

// Validate environment
function validateEnv() {
  const required = [
    'WEBFLOW_API_TOKEN',
    'ANTHROPIC_API_KEY',
    'WEBFLOW_SUBDIRECTORIES_COLLECTION_ID',
    'WEBFLOW_PROJECTS_COLLECTION_ID'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:');
    missing.forEach(key => console.error(`  - ${key}`));
    console.error('\nCopy .env.example to .env and fill in your values.');
    process.exit(1);
  }
}

// Webflow API helper
async function webflowRequest(endpoint, options = {}) {
  const url = `${WEBFLOW_API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
      'Content-Type': 'application/json',
      'accept': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Webflow API error (${response.status}): ${error}`);
  }

  return response.json();
}

// Fetch all items from a collection (handles pagination)
async function fetchAllCollectionItems(collectionId) {
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

    // Rate limiting - Webflow allows 60 requests/minute
    await sleep(1000);
  }

  return items;
}

// Update a collection item
async function updateCollectionItem(collectionId, itemId, fieldData) {
  return webflowRequest(`/collections/${collectionId}/items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ fieldData })
  });
}

// Publish collection items
async function publishItems(collectionId, itemIds) {
  return webflowRequest(`/collections/${collectionId}/items/publish`, {
    method: 'POST',
    body: JSON.stringify({ itemIds })
  });
}

// Sleep helper
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate content using Claude
async function generateContent(anthropic, subDirectory, parentDirectory) {
  const parentContext = DIRECTORY_CONTEXT[parentDirectory] || parentDirectory;

  const prompt = `You are writing content for a creative directory website called MTNS MADE, which showcases creative professionals in the Blue Mountains region of Australia.

Generate content for the sub-directory category: "${subDirectory.name}"
Parent category: ${parentContext}

Please provide:
1. A description (50-80 words) that explains what this creative category encompasses and why someone might hire a professional in this field. Write in a warm, professional tone. Don't start with "Welcome to" or similar.

2. An SEO title (maximum 60 characters) for the page. Format: "[Category] | MTNS MADE Blue Mountains"

3. An SEO meta description (maximum 160 characters) that would encourage clicks from search results. Include "Blue Mountains" for local SEO.

Respond in this exact JSON format:
{
  "description": "Your description here",
  "seoTitle": "Your SEO title here",
  "seoDescription": "Your SEO description here"
}`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }]
  });

  const text = response.content[0].text;

  // Parse JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Failed to parse JSON from response: ${text}`);
  }

  return JSON.parse(jsonMatch[0]);
}

// Find a suitable project to feature for a category
function findFeaturedProject(projects, subDirectoryId, subDirectoryName) {
  // Filter projects that have this category and have a feature image
  const matchingProjects = projects.filter(p => {
    const categories = p.fieldData?.['relevant-directory-categories'] || [];
    const hasImage = p.fieldData?.['feature-image']?.url;
    return categories.includes(subDirectoryId) && hasImage;
  });

  if (matchingProjects.length === 0) {
    return null;
  }

  // Prefer projects with more complete data
  matchingProjects.sort((a, b) => {
    const aScore = (a.fieldData?.['project-description'] ? 1 : 0) +
                   (a.fieldData?.['project-multi-image']?.length || 0);
    const bScore = (b.fieldData?.['project-description'] ? 1 : 0) +
                   (b.fieldData?.['project-multi-image']?.length || 0);
    return bScore - aScore;
  });

  return matchingProjects[0];
}

// Main function
async function main() {
  console.log('='.repeat(60));
  console.log('MTNS MADE Sub-Directory Content Generator');
  console.log('='.repeat(60));

  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN MODE - No changes will be made to Webflow\n');
  }

  if (FILTER_CATEGORY) {
    console.log(`\n📁 Filtering to category: ${FILTER_CATEGORY}\n`);
  }

  validateEnv();

  // Initialize Anthropic client
  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  console.log('\n📥 Fetching sub-directories from Webflow...');
  const subDirectories = await fetchAllCollectionItems(SUBDIRECTORIES_COLLECTION_ID);
  console.log(`   Found ${subDirectories.length} sub-directories`);

  console.log('\n📥 Fetching projects from Webflow...');
  const projects = await fetchAllCollectionItems(PROJECTS_COLLECTION_ID);
  console.log(`   Found ${projects.length} projects`);

  // Filter if category specified
  let itemsToProcess = subDirectories;
  if (FILTER_CATEGORY) {
    itemsToProcess = subDirectories.filter(sd => {
      const parentSlug = sd.fieldData?.['choose-parent-directory'];
      return parentSlug === FILTER_CATEGORY || sd.fieldData?.slug?.includes(FILTER_CATEGORY);
    });
    console.log(`   Processing ${itemsToProcess.length} items in category`);
  }

  // Process each sub-directory
  const results = [];
  const errors = [];

  for (let i = 0; i < itemsToProcess.length; i++) {
    const subDir = itemsToProcess[i];
    const name = subDir.fieldData?.name || 'Unknown';
    const slug = subDir.fieldData?.slug || '';

    // Try to determine parent directory
    let parentSlug = subDir.fieldData?.['choose-parent-directory'];
    if (typeof parentSlug === 'object' && parentSlug !== null) {
      // It might be a reference - we'll use slug to guess
      parentSlug = null;
    }

    console.log(`\n[${i + 1}/${itemsToProcess.length}] Processing: ${name}`);

    try {
      // Generate AI content
      console.log('   🤖 Generating content...');
      const content = await generateContent(anthropic, { name, slug }, parentSlug || 'creative');

      // Validate lengths
      if (content.seoTitle.length > 60) {
        content.seoTitle = content.seoTitle.substring(0, 57) + '...';
      }
      if (content.seoDescription.length > 160) {
        content.seoDescription = content.seoDescription.substring(0, 157) + '...';
      }

      // Find featured project
      const featuredProject = findFeaturedProject(projects, subDir.id, name);

      console.log(`   📝 Description: ${content.description.substring(0, 50)}...`);
      console.log(`   🔍 SEO Title: ${content.seoTitle}`);
      console.log(`   📋 SEO Desc: ${content.seoDescription.substring(0, 50)}...`);

      if (featuredProject) {
        console.log(`   🖼️  Featured Project: ${featuredProject.fieldData?.name || 'Unknown'}`);
      } else {
        console.log('   ⚠️  No suitable project found for feature image');
      }

      // Prepare update data
      const updateData = {
        'directory-description': content.description,
        'seo-title': content.seoTitle,
        'seo-description': content.seoDescription
      };

      if (featuredProject) {
        updateData['project-feature'] = featuredProject.id;
        updateData['member-credit'] = featuredProject.fieldData?.member || null;
        updateData['use-feature-image'] = true;
      }

      // Update Webflow (unless dry run)
      if (!DRY_RUN) {
        console.log('   ⬆️  Updating Webflow...');
        await updateCollectionItem(SUBDIRECTORIES_COLLECTION_ID, subDir.id, updateData);

        // Rate limiting
        await sleep(1500);
      }

      results.push({
        name,
        slug,
        ...content,
        featuredProject: featuredProject?.fieldData?.name || null,
        status: 'success'
      });

    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      errors.push({ name, slug, error: error.message });
    }
  }

  // Publish all updated items
  if (!DRY_RUN && results.length > 0) {
    console.log('\n📤 Publishing updated items...');
    const itemIds = itemsToProcess
      .filter(sd => results.some(r => r.slug === sd.fieldData?.slug))
      .map(sd => sd.id);

    // Publish in batches of 100
    for (let i = 0; i < itemIds.length; i += 100) {
      const batch = itemIds.slice(i, i + 100);
      await publishItems(SUBDIRECTORIES_COLLECTION_ID, batch);
      await sleep(2000);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${results.length}`);
  console.log(`❌ Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach(e => console.log(`  - ${e.name}: ${e.error}`));
  }

  // Save results to file
  const outputFile = `results-${new Date().toISOString().split('T')[0]}.json`;
  fs.writeFileSync(outputFile, JSON.stringify({ results, errors }, null, 2));
  console.log(`\n📄 Results saved to: ${outputFile}`);

  if (DRY_RUN) {
    console.log('\n🔍 This was a DRY RUN - no changes were made to Webflow');
    console.log('   Remove --dry-run to apply changes');
  }
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
