# Security Best Practices

## Database Credentials

⚠️ **IMPORTANT**: Never expose Neon database credentials to client-side code.

### Environment Variables

- Store `DATABASE_URL` in `.env` file (which is in `.gitignore`)
- Never commit `.env` to version control
- Use `.env.example` as a template (without real credentials)

### Server-Side Only

The database connection is configured to only work server-side:

```typescript
// src/db/index.ts
// This code only runs on the server
const sql = neon(getDatabaseUrl());
export const db = drizzle(sql, { schema });
```

### Verification

- Database queries should only happen in:
  - API routes (`src/pages/api/**`)
  - Server-side Astro pages (`.astro` files)
  - Middleware (`src/middleware.ts`)
  - Server-side utilities (`src/lib/**`)

## Authentication Security

### Session Management

- Sessions use **JWT tokens** signed with `SESSION_SECRET`
- Tokens are stored in **httpOnly cookies** (not accessible via JavaScript)
- Cookies are **secure** in production (HTTPS only)
- Cookies use **SameSite: lax** for CSRF protection

### Password Security

- Passwords are hashed using **bcrypt** with 12 rounds
- Passwords are never stored in plain text
- Passwords are never returned in API responses
- Password validation enforces strength requirements

### API Security

- All authentication endpoints validate input
- Rate limiting should be added in production
- Error messages don't reveal sensitive information
- CORS should be configured for production

## Environment Variables

Required environment variables:

```bash
# Database (server-side only)
DATABASE_URL='postgresql://...'

# Authentication secrets (generate strong random strings)
SESSION_SECRET='your-secret-here'
AUTH_SECRET='your-secret-here'
```

### Generating Secrets

Use strong random strings:

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Production Checklist

- [ ] Change all default secrets
- [ ] Use HTTPS only
- [ ] Enable secure cookies
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Set up monitoring and logging
- [ ] Regular security updates
- [ ] Database backups
- [ ] Environment variable security in hosting platform


