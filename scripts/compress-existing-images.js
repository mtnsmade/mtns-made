#!/usr/bin/env node
/**
 * MTNS MADE - Compress Existing Images
 *
 * Scans Supabase storage buckets for oversized images and compresses them.
 *
 * Usage:
 *   node scripts/compress-existing-images.js --dry-run    # Preview what would be compressed
 *   node scripts/compress-existing-images.js              # Actually compress images
 *   node scripts/compress-existing-images.js --bucket=member-images  # Only process one bucket
 *
 * Requirements:
 *   npm install @supabase/supabase-js sharp
 */

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import path from 'path';

// Configuration
const SUPABASE_URL = 'https://epszwomtxkpjegbjbixr.supabase.co';
const SUPABASE_SERVICE_KEY = 'sb_secret_Fkcjnv3h3awIOEE5qRla9w_mu22-56_';

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const MAX_DIMENSION = 2000;
const JPEG_QUALITY = 80;

const BUCKETS = ['member-images', 'project-images', 'event-images'];

// Database table mappings for URL updates
const BUCKET_DB_MAPPINGS = {
  'member-images': {
    table: 'members',
    urlColumns: ['profile_image_url', 'header_image_url']
  },
  'project-images': {
    table: 'projects',
    urlColumns: ['feature_image_url', 'gallery_images']
  },
  'event-images': {
    table: 'events',
    urlColumns: ['image_url']
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const bucketArg = args.find(a => a.startsWith('--bucket='));
const specificBucket = bucketArg ? bucketArg.split('=')[1] : null;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Stats tracking
const stats = {
  scanned: 0,
  oversized: 0,
  compressed: 0,
  savedBytes: 0,
  errors: 0
};

async function listAllFiles(bucket) {
  const allFiles = [];

  // List top-level folders (member IDs)
  const { data: folders, error: folderError } = await supabase.storage
    .from(bucket)
    .list('', { limit: 1000 });

  if (folderError) {
    console.error(`Error listing ${bucket}:`, folderError.message);
    return allFiles;
  }

  for (const folder of folders || []) {
    if (folder.id) {
      // It's a file at root level
      allFiles.push({ ...folder, path: folder.name });
    } else {
      // It's a folder, list its contents
      const { data: files, error: filesError } = await supabase.storage
        .from(bucket)
        .list(folder.name, { limit: 1000 });

      if (filesError) {
        console.error(`Error listing ${bucket}/${folder.name}:`, filesError.message);
        continue;
      }

      for (const file of files || []) {
        if (file.id) {
          // Check for nested folders (e.g., project-images/memberId/projectId/)
          const { data: nestedFiles } = await supabase.storage
            .from(bucket)
            .list(`${folder.name}/${file.name}`, { limit: 1000 });

          if (nestedFiles && nestedFiles.length > 0 && nestedFiles[0].id) {
            // These are actual files
            for (const nested of nestedFiles) {
              if (nested.id) {
                allFiles.push({
                  ...nested,
                  path: `${folder.name}/${file.name}/${nested.name}`
                });
              }
            }
          } else {
            // file.name is an actual file
            allFiles.push({
              ...file,
              path: `${folder.name}/${file.name}`
            });
          }
        }
      }
    }
  }

  return allFiles;
}

async function downloadFile(bucket, filePath) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(filePath);

  if (error) throw error;
  return Buffer.from(await data.arrayBuffer());
}

async function compressImage(buffer, filename) {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  let pipeline = image;

  // Resize if too large
  if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
    pipeline = pipeline.resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: 'inside',
      withoutEnlargement: true
    });
  }

  // Convert to JPEG and compress
  const compressed = await pipeline
    .jpeg({ quality: JPEG_QUALITY, progressive: true })
    .toBuffer();

  return compressed;
}

async function uploadFile(bucket, filePath, buffer) {
  // Change extension to .jpg if not already
  const newPath = filePath.replace(/\.[^.]+$/, '.jpg');

  const { error } = await supabase.storage
    .from(bucket)
    .upload(newPath, buffer, {
      contentType: 'image/jpeg',
      upsert: true
    });

  if (error) throw error;

  return newPath;
}

async function deleteFile(bucket, filePath) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) throw error;
}

async function updateDatabaseUrls(bucket, oldPath, newPath) {
  const mapping = BUCKET_DB_MAPPINGS[bucket];
  if (!mapping) return;

  const oldUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${oldPath}`;
  const newUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${newPath}`;

  if (oldUrl === newUrl) return;

  for (const column of mapping.urlColumns) {
    if (column === 'gallery_images') {
      // Special handling for JSON array column
      // This would need custom logic - skip for now
      continue;
    }

    const { error } = await supabase
      .from(mapping.table)
      .update({ [column]: newUrl })
      .eq(column, oldUrl);

    if (error) {
      console.error(`  Error updating ${mapping.table}.${column}:`, error.message);
    }
  }
}

async function processFile(bucket, file) {
  stats.scanned++;

  // Skip non-image files
  const ext = path.extname(file.name).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
    return;
  }

  // Check file size from metadata
  const fileSize = file.metadata?.size || 0;

  if (fileSize <= MAX_FILE_SIZE) {
    return; // Already small enough
  }

  stats.oversized++;
  const sizeMB = (fileSize / 1024 / 1024).toFixed(2);

  console.log(`\n📦 ${bucket}/${file.path}`);
  console.log(`   Size: ${sizeMB}MB (over ${MAX_FILE_SIZE / 1024 / 1024}MB limit)`);

  if (isDryRun) {
    console.log('   [DRY RUN] Would compress this file');
    return;
  }

  try {
    // Download
    console.log('   Downloading...');
    const buffer = await downloadFile(bucket, file.path);

    // Compress
    console.log('   Compressing...');
    const compressed = await compressImage(buffer, file.name);
    const newSizeMB = (compressed.length / 1024 / 1024).toFixed(2);
    const savedBytes = buffer.length - compressed.length;

    console.log(`   Compressed: ${sizeMB}MB → ${newSizeMB}MB (saved ${(savedBytes / 1024 / 1024).toFixed(2)}MB)`);

    // Upload new version
    console.log('   Uploading compressed version...');
    const newPath = await uploadFile(bucket, file.path, compressed);

    // Update database references if path changed
    if (newPath !== file.path) {
      console.log('   Updating database references...');
      await updateDatabaseUrls(bucket, file.path, newPath);

      // Delete old file
      console.log('   Deleting original...');
      await deleteFile(bucket, file.path);
    }

    stats.compressed++;
    stats.savedBytes += savedBytes;
    console.log('   ✅ Done');

  } catch (error) {
    stats.errors++;
    console.error(`   ❌ Error: ${error.message}`);
  }
}

async function processBucket(bucket) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing bucket: ${bucket}`);
  console.log('='.repeat(60));

  const files = await listAllFiles(bucket);
  console.log(`Found ${files.length} files`);

  for (const file of files) {
    await processFile(bucket, file);
  }
}

async function main() {
  console.log('🖼️  MTNS MADE - Image Compression Script');
  console.log('========================================');

  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
  }

  const bucketsToProcess = specificBucket ? [specificBucket] : BUCKETS;

  for (const bucket of bucketsToProcess) {
    await processBucket(bucket);
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Files scanned:    ${stats.scanned}`);
  console.log(`Oversized files:  ${stats.oversized}`);
  console.log(`Compressed:       ${stats.compressed}`);
  console.log(`Errors:           ${stats.errors}`);
  console.log(`Space saved:      ${(stats.savedBytes / 1024 / 1024).toFixed(2)}MB`);

  if (isDryRun && stats.oversized > 0) {
    console.log('\n💡 Run without --dry-run to actually compress these files');
  }
}

main().catch(console.error);
