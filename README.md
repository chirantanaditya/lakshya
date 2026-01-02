# Lakshya Counselling - Astro Portal

A career counselling platform built with Astro, React, and Neon DB, migrated from Webflow.

## Features

- 🎯 Career assessment tests (GATB Parts 1-7, Work Values, FIRO-B, Interest Inventory, Personality Aspect, Behavior Response)
- ⏱️ **6-minute timer** on all GATB tests with auto-submit when time expires
- 📊 **Real-time score calculation** with console logging for all GATB tests
- 🎯 **Grading system** for GATB tests (Parts 1-6) with detailed question-by-question breakdown
- 📈 **Work Values attribute scoring** - Calculates scores for 15 work value attributes based on user responses
- 👤 Secure user authentication with JWT sessions
- 📝 Blog functionality
- 💬 Testimonials
- 📊 User dashboard with test results
- 🛡️ **Admin dashboard** with detailed test response viewing, scores, and question-by-question analysis
- 📧 Email invitations via Resend integration
- 🎨 Modern, responsive design

## Tech Stack

- **Framework**: Astro 4.0
- **UI**: React 18, Tailwind CSS
- **Database**: Neon (PostgreSQL)
- **ORM**: Drizzle ORM
- **Authentication**: JWT-based sessions with secure cookies
- **Deployment**: Node.js adapter

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Neon database account
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your:
   - `DATABASE_URL` - Your Neon database connection string
   - `SESSION_SECRET` - A random secret for JWT signing (use `openssl rand -base64 32`)
   - `AUTH_SECRET` - A random secret for authentication
   - `ADMIN_EMAILS` - Comma-separated list of admin email addresses (e.g., `admin@example.com,admin2@example.com`)
   - `RESEND_API_KEY` - Your Resend API key for sending emails
   - `RESEND_FROM_EMAIL` - Email address to send from (must be verified in Resend)
   - `PUBLIC_SITE_URL` - Your site's public URL (e.g., `https://yourdomain.com`)

   ⚠️ **IMPORTANT**: Keep Neon credentials secure - do not expose them to client-side code!

4. Run database migrations:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:4321](http://localhost:4321)

## Security

### Database Credentials
- Database connection is **server-side only**
- Never expose `DATABASE_URL` to client-side code
- Store credentials in `.env` file (already in `.gitignore`)

### Authentication
- JWT-based sessions with secure httpOnly cookies
- Passwords hashed with bcrypt (12 rounds)
- Secure cookie settings in production
- CSRF protection via SameSite cookies

See [SECURITY.md](./SECURITY.md) for more details.

## Database Schema

The database includes tables for:
- Users (Basic members)
- Blog posts
- Testimonials
- Test questions (GATB, Work Values, FIRO-B, etc.)
- User test responses

## Project Structure

```
src/
├── components/     # React components
├── layouts/        # Astro layouts
├── pages/          # Astro pages
│   └── api/        # API routes
├── db/             # Database schema and connection
├── lib/            # Utilities (auth, session, etc.)
└── middleware.ts   # Astro middleware
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio

## Environment Variables

Required environment variables:

```bash
# Neon Database (server-side only)
DATABASE_URL='postgresql://...'

# Authentication secrets
SESSION_SECRET='your-secret-here'
AUTH_SECRET='your-secret-here'

# Admin Configuration
ADMIN_EMAILS='admin@example.com,admin2@example.com'

# Resend Email Configuration
RESEND_API_KEY='re_xxxxxxxxxxxxx'
RESEND_FROM_EMAIL='noreply@yourdomain.com'
PUBLIC_SITE_URL='https://yourdomain.com'
```

## Recent Updates (January 2025)

### Test Timer System
- ✅ Added **6-minute timer** to all GATB tests (Parts 1-7)
- ✅ Timer is **fixed position on the right side**, always visible
- ✅ **Auto-submit** when timer reaches 0
- ✅ Visual warning when less than 1 minute remains (red, pulsing)
- ✅ Progress bar showing time remaining

### Scoring & Grading System
- ✅ **Real-time score calculation** for all GATB tests
- ✅ Scores logged to console after each answer selection
- ✅ **Grading system** implemented for GATB Parts 1-6
- ✅ Scores stored in database with user relationship
- ✅ **Admin dashboard** can view:
  - Score summaries (correct/incorrect/total/percentage)
  - Question-by-question breakdown
  - User answers vs correct answers
  - Color-coded results (green for correct, red for incorrect)

### Test Components
- ✅ All GATB test components updated with timer integration
- ✅ Fixed submission issues for GATB Part 2
- ✅ Auto-submit prevention to avoid duplicate submissions
- ✅ Force submit option when timer expires

### Work Values Assessment (January 2025)
- ✅ **Attribute-based scoring system** implemented
- ✅ Questions parsed from CSV with attribute mappings
- ✅ **15 work value attributes** tracked:
  - Intellectual Stimulation, Altruism, Economic Returns, Variety, Independence
  - Prestige, Aesthetic, Associates, Security, Way of Life
  - Supervisory Relations, Surrounding, Achievement, Management, Creativity
- ✅ Each answer selection adds 1 point to the corresponding attribute(s)
- ✅ Scores calculated and logged to console on submission
- ✅ Attribute scores stored in database for admin review

## Admin Dashboard

The admin dashboard provides tools for managing tests and inviting students:

### Access
- Navigate to `/admin` after logging in with an admin email
- Admin emails are configured via the `ADMIN_EMAILS` environment variable

### Features
- **Test Overview**: View all users, their test statuses, and completion rates
- **User Details**: View detailed information about individual users and their test responses
- **Test Response Details**: 
  - View score summaries with correct/incorrect/total/percentage
  - Question-by-question breakdown with user answers vs correct answers
  - Color-coded results for easy identification
- **Student Invitations**: Send email invitations to students via Resend
- **Search & Filter**: Search users by name/email and filter by test completion status
- **Test Assignment**: Assign specific tests to candidates

### Setting Up Resend
1. Sign up for a Resend account at [resend.com](https://resend.com)
2. Create an API key in your Resend dashboard
3. Verify your domain or use the default `onboarding@resend.dev` for testing
4. Add your API key and from email to your `.env` file

## License

MIT
