# Webflow DevLink Setup Guide

## Understanding the Output

The output you're seeing is **not an error** - it's the help/usage information for the Webflow DevLink CLI. It's telling you what you need to configure.

## Required Configuration

The Webflow CLI needs two environment variables:
1. `WEBFLOW_SITE_ID` - Your Webflow site ID
2. `WEBFLOW_SITE_API_TOKEN` - Your Webflow API token

## Step-by-Step Setup

### Step 1: Get Your Webflow Site ID

Your site ID is: `694a5fcda87a03f212873d78`

(This is the "Copy of Lakshya Counselling" site we've been working with)

### Step 2: Get Your Webflow API Token

**⚠️ IMPORTANT**: You need a REAL API token, not a placeholder!

1. Go to [Webflow Account Settings](https://webflow.com/dashboard/account)
2. Navigate to **API Access** section (in the left sidebar)
3. Click **Generate API Token** or **Create Token**
4. Give it a name (e.g., "Astro Project DevLink")
5. **Copy the token immediately** - you won't be able to see it again!
6. The token will be a long string (40+ characters) like: `abc123def456ghi789jkl012mno345pqr678stu901vwx234yz`

**Common Error**: Using `your_token_here` or `your_api_token_here` as a placeholder will cause authentication errors!

### Step 3: Add to .env File

Add these variables to your `.env` file in the project root:

```env
# Webflow DevLink Configuration
WEBFLOW_SITE_ID=694a5fcda87a03f212873d78
WEBFLOW_SITE_API_TOKEN=your_api_token_here
```

### Step 4: Sync Components

Once configured, you can sync components:

```powershell
# Sync all components
pnpm run webflow:devlink -- sync

# Sync specific components
pnpm run webflow:devlink -- sync component-name-1 component-name-2
```

## Alternative: Pass as Arguments

If you prefer not to use environment variables, you can pass them as arguments:

```powershell
pnpm run webflow:devlink -- sync --site 694a5fcda87a03f212873d78 --api-token your_token_here
```

## Available Commands

### Sync Components
```powershell
pnpm run webflow:devlink -- sync
```

This will:
- Read your `webflow.json` configuration
- Connect to your Webflow site
- Download component code to the `./devlink` directory
- Create React components from your Webflow components

### Sync Specific Components
```powershell
pnpm run webflow:devlink -- sync nav-bar footer-white footer-green
```

## Your Current Configuration

Your `webflow.json` is already set up:
- **Root Directory**: `./devlink` (components will be saved here)
- **CSS Modules**: Enabled
- **File Extensions**: JSX for JS files
- **Library Name**: "Nice And Easy Code Library"

## Troubleshooting

### Error: "WEBFLOW_SITE_ID is not set"
- Make sure your `.env` file exists in the project root
- Verify the variable names are exactly: `WEBFLOW_SITE_ID` and `WEBFLOW_SITE_API_TOKEN`
- Restart your terminal after adding to `.env`

### Error: "Invalid API token"
- Verify your API token is correct
- Make sure you copied the entire token
- Check that the token hasn't expired

### Error: "Site not found"
- Verify the site ID is correct: `694a5fcda87a03f212873d78`
- Make sure your API token has access to this site

## Next Steps

1. Add the environment variables to your `.env` file
2. Run `pnpm run webflow:devlink -- sync` to download components
3. Components will be available in the `./devlink` directory
4. Import and use them in your Astro/React components

## Security Note

⚠️ **Important**: Never commit your `.env` file to git. It contains sensitive API tokens. Make sure `.env` is in your `.gitignore`.

