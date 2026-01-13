# How to Get Your Webflow API Token

## The Error

The error you're seeing is because you used a placeholder token (`your_token_here`) instead of your actual Webflow API token. The CLI needs a real, valid API token to access your Webflow site.

## Step-by-Step: Get Your API Token

### Step 1: Log into Webflow
1. Go to [https://webflow.com](https://webflow.com)
2. Log in to your account

### Step 2: Navigate to Account Settings
1. Click on your profile icon (top right)
2. Select **Account Settings** from the dropdown

### Step 3: Go to API Access
1. In the left sidebar, click on **API Access**
2. You'll see a section for **API Tokens**

### Step 4: Generate or Copy Token
**Option A: Generate New Token**
1. Click **Generate API Token** or **Create Token**
2. Give it a name (e.g., "Astro Project DevLink")
3. Copy the token immediately (you won't be able to see it again!)

**Option B: Use Existing Token**
1. If you already have a token, click **Show** or **Copy**
2. Copy the token

### Step 5: Add to .env File

Open your `.env` file and replace the placeholder:

```env
# Replace this:
WEBFLOW_SITE_API_TOKEN=your_token_here

# With your actual token (it will look like this):
WEBFLOW_SITE_API_TOKEN=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

**Important**: 
- The token is long (usually 40+ characters)
- Copy the ENTIRE token
- No spaces before or after
- Keep it secret - never share it or commit it to git

## Verify Your Setup

Your `.env` file should have:

```env
# Webflow DevLink Configuration
WEBFLOW_SITE_ID=694a5fcda87a03f212873d78
WEBFLOW_SITE_API_TOKEN=your_actual_token_here
```

## Test the Connection

After adding your real token, test it:

```powershell
pnpm run webflow:devlink -- sync
```

If successful, you'll see:
- Components being downloaded
- Files created in the `./devlink` directory
- No error messages

## Common Issues

### "401 Unauthorized" Error
- **Cause**: Invalid or expired API token
- **Fix**: Generate a new token and update your `.env` file

### "Site not found" Error
- **Cause**: Wrong site ID or token doesn't have access
- **Fix**: Verify site ID is `694a5fcda87a03f212873d78` and token has access

### "Token format invalid"
- **Cause**: Token has extra spaces or characters
- **Fix**: Copy token again, ensure no leading/trailing spaces

## Security Reminders

⚠️ **Never**:
- Commit your `.env` file to git
- Share your API token publicly
- Use the same token in multiple projects (create separate tokens)

✅ **Always**:
- Keep tokens in `.env` file (already in `.gitignore`)
- Use different tokens for different projects
- Rotate tokens periodically for security

## Alternative: Use Arguments (Not Recommended)

If you don't want to use `.env`, you can pass the token directly (but this is less secure):

```powershell
pnpm run webflow:devlink -- sync --site 694a5fcda87a03f212873d78 --api-token YOUR_REAL_TOKEN_HERE
```

But using `.env` is much better for security!

