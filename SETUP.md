# Setup Guide

## Initial Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   - Copy `.env.example` to `.env`
   - Add your Neon database connection string:
     ```
     DATABASE_URL=postgresql://user:password@host/database?sslmode=require
     ```
   - Generate secrets for authentication:
     ```
     AUTH_SECRET=your-random-secret-here
     SESSION_SECRET=your-random-session-secret-here
     ```

3. **Set Up Database**
   ```bash
   # Push schema to database
   npm run db:push
   
   # Or generate migrations
   npm run db:generate
   npm run db:migrate
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Database Schema

The database includes the following tables:

- **users** - User accounts and profiles
- **blog_posts** - Blog content
- **testimonials** - Customer testimonials
- **gatb_questions** - GATB test questions (parts 1-7)
- **work_values_questions** - Work Values assessment questions
- **firo_b_questions** - FIRO-B test questions
- **interest_inventory_questions** - Interest Inventory questions
- **personality_aspect_questions** - Personality Aspect questions
- **behavior_response_questions** - Behavior Response questions
- **user_test_responses** - User test answers and scores

## Next Steps

### 1. Migrate Data from Webflow
- Export data from Webflow CMS collections
- Import into Neon database using scripts or Drizzle Studio

### 2. Complete Authentication
- [x] Login page
- [x] Registration page
- [ ] Password reset functionality
- [ ] Email verification

### 3. Build Test Pages
- [ ] GATB Part 1-7 test pages
- [ ] Work Values assessment
- [ ] FIRO-B test
- [ ] Interest Inventory
- [ ] Personality Aspect
- [ ] Behavior Response

### 4. User Dashboard
- [x] Basic dashboard
- [ ] Test results display
- [ ] Report download
- [ ] Profile management

### 5. Additional Pages
- [ ] Service pages (For Corporates, Academic Institutions)
- [ ] Student category pages
- [ ] Contact page
- [ ] Blog listing and detail pages
- [ ] Testimonials page

### 6. Styling & Design
- Match Webflow design more closely
- Add animations
- Improve mobile responsiveness
- Add loading states

## Data Migration Script

You'll need to create scripts to migrate data from Webflow. Here's a template:

```typescript
// scripts/migrate-from-webflow.ts
import { db } from '../src/db';
import { users, blogPosts, testimonials } from '../src/db/schema';

// Fetch data from Webflow API
// Transform and insert into Neon database
```

## Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to your hosting platform (Vercel, Netlify, etc.)

3. Set environment variables in your hosting platform

4. Run database migrations in production


