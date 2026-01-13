# Webflow Content Migration Guide

This document outlines the content extracted from the Webflow project and how to migrate it to the Astro/Neon DB setup.

## Extracted Content

### 1. Testimonials

**From Webflow CMS:**
- 2 testimonials in the CMS collection

**From Webflow Homepage:**
- 5 real testimonials embedded in the page content:
  - Muskaan (College Student, Hyderabad)
  - Soman Yadav (Marketing Head, Bangalore)
  - Roshan Singh (Professional Editor, Bangalore)
  - Sargam Chopra (College Student, Ahmedabad)
  - Tarun (Business Owner, Bangalore)

**Total:** 7 testimonials ready to migrate

### 2. Blog Posts

- Blog Posts collection exists in Webflow but is currently empty
- Schema is ready in the database for future blog posts

### 3. Homepage Content

The following content was extracted from the Webflow homepage:

**Hero Section:**
- Title: "Get guided towards the right choice"
- Subtitle: "We provide guidance & counselling that takes your career to the next level"

**Key Sections:**
- "Get a holistic assessment that gives you a 360 degrees view of your potential and personality"
- "How we help?" section with 3 cards:
  - Comprehensive Analysis
  - Personalized Counseling
  - In-Depth Report
- "Why enroll with us?" section with 3 points:
  - Personalized Approach
  - Comprehensive Assessments
  - Academic Planning
- "Our tests are designed for" section with 4 categories:
  - High School Students
  - Senior School Students
  - College Students
  - Corporate Professional
- "We care. We listen. We answer." section with 3 points:
  - Clarity on Future
  - Develop Efficiency & Motivation
  - Experienced Psychologists & Counselors

## Migration Steps

### 1. Run the Migration Script

```bash
pnpm run migrate:webflow
```

This will:
- Insert all testimonials from Webflow into the Neon database
- Skip duplicates (based on slug)
- Log progress and errors

### 2. Verify Migration

Check the database to ensure testimonials were inserted:

```bash
pnpm run db:studio
```

Navigate to the `testimonials` table to see the migrated data.

### 3. Test Homepage

Visit the homepage to see testimonials displayed dynamically from the database.

## Database Schema

### Testimonials Table

```typescript
{
  id: uuid (primary key)
  name: varchar(256)
  slug: varchar(256) (unique)
  testimonialText: text
  authorName: varchar(256)
  authorTitle: varchar(256)
  authorLocation: varchar(256)
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Future Migrations

To migrate additional content:

1. **Blog Posts:** When blog posts are added to Webflow CMS, update the migration script
2. **Test Questions:** Test questions are already in the database schema and can be migrated similarly
3. **User Data:** User data migration should be handled separately with proper password hashing

## Notes

- The migration script uses the `slug` field to prevent duplicates
- Testimonials are displayed on the homepage in a grid layout with colored borders
- The homepage automatically fetches testimonials from the database
- If no testimonials exist, the testimonials section is hidden

