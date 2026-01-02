# Data Migration Guide

This guide explains how to migrate data from your Webflow site to the new Astro/Neon DB setup.

## Overview

Your Webflow site has the following CMS collections that need to be migrated:

1. **Basic members** (Users)
2. **Blog Posts**
3. **Testimonials**
4. **GATB Questions** (Parts 1-7)
5. **Work Values**
6. **FIRO-Bs**
7. **Interest Inventories**
8. **Personality Aspects**
9. **Behaviour Responses**
10. **GATB P7 Images** (and related image collections)

## Migration Steps

### 1. Export Data from Webflow

You can export data from Webflow using the Webflow API or manually:

#### Option A: Using Webflow API
```typescript
// scripts/export-webflow-data.ts
import { mcp_webflow_collections_items_list_items } from '@webflow/api';

// Example: Export Basic Members
const basicMembers = await mcp_webflow_collections_items_list_items({
  collection_id: '62b2b4b01a32f3414212c3f0',
  limit: 100
});
```

#### Option B: Manual Export
1. Go to Webflow CMS
2. Open each collection
3. Export as CSV or JSON
4. Save files in `data/webflow-export/`

### 2. Transform Data

Create transformation scripts to convert Webflow data format to your database schema:

```typescript
// scripts/transform-users.ts
import { readFileSync } from 'fs';
import { db } from '../src/db';
import { users } from '../src/db/schema';

const webflowUsers = JSON.parse(readFileSync('data/webflow-export/basic-members.json', 'utf-8'));

for (const user of webflowUsers) {
  await db.insert(users).values({
    name: user['name'],
    slug: user['slug'],
    email: user['email'],
    firstName: user['first-name'],
    lastName: user['last-name'],
    phoneNo: user['phone-no'],
    education: user['education'],
    // Map all other fields...
  });
}
```

### 3. Import Test Questions

For test questions, you'll need to:

1. Export questions from each GATB collection
2. Transform to match your schema
3. Import with proper part numbers

```typescript
// scripts/import-gatb-questions.ts
// Import questions for each part (1-7)
```

### 4. Handle Images

Webflow images are hosted on Webflow CDN. You have options:

1. **Keep Webflow URLs** - Simple but dependent on Webflow
2. **Download and rehost** - More control, requires storage solution
3. **Use Webflow API** - Download via API and upload to your storage

### 5. User Passwords

⚠️ **Important**: User passwords cannot be migrated from Webflow as they're hashed. You'll need to:

1. Reset all user passwords
2. Send password reset emails
3. Or create a migration script that sets temporary passwords

## Migration Script Template

```typescript
// scripts/migrate-all.ts
import { db } from '../src/db';
import { users, blogPosts, testimonials } from '../src/db/schema';

async function migrateAll() {
  console.log('Starting migration...');
  
  // 1. Migrate users
  await migrateUsers();
  
  // 2. Migrate blog posts
  await migrateBlogPosts();
  
  // 3. Migrate testimonials
  await migrateTestimonials();
  
  // 4. Migrate test questions
  await migrateTestQuestions();
  
  console.log('Migration complete!');
}

migrateAll();
```

## Field Mapping Reference

### Basic Members → Users
- `name` → `name`
- `slug` → `slug`
- `email` → `email`
- `first-name` → `firstName`
- `last-name` → `lastName`
- `phone-no` → `phoneNo`
- `education` → `education`
- `enable-tests` → `introductionCompleted`
- `firob` → `enableFiroB`
- `test-completed` → `testCompleted`
- `candidate-report` → `candidateReport` (URL)
- All status fields map directly

### Blog Posts
- `name` → `name`
- `slug` → `slug`
- `post-body` → `postBody`
- `post-summary` → `postSummary`
- `main-image` → `mainImage` (URL)
- `thumbnail-image` → `thumbnailImage` (URL)
- `featured` → `featured`
- `color` → `color`
- `meta-title` → `metaTitle`
- `meta-description` → `metaDescription`
- `alt-text-for-seo` → `altTextForSeo`

## Testing Migration

After migration:

1. Verify record counts match
2. Check sample records for data integrity
3. Test user login (with reset passwords)
4. Verify all relationships
5. Check image URLs are accessible

## Rollback Plan

Keep Webflow data until migration is verified:

1. Don't delete Webflow data immediately
2. Run migration in staging first
3. Test thoroughly before going live
4. Keep backups of both systems


