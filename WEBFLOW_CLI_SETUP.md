# Webflow CLI Setup Instructions

## Issue
The `webflow` command is not recognized because the Webflow CLI is not installed globally or not accessible in your PATH.

## Solution

### Option 1: Use npm scripts (Recommended)
I've added npm scripts to your `package.json` so you can run Webflow CLI commands through npm:

```powershell
# Login to Webflow
npm run webflow:auth

# Run DevLink
npm run webflow:devlink

# Run any webflow command
npm run webflow -- [command]
```

### Option 2: Install globally
If you want to use `webflow` directly from the command line:

```powershell
npm install -g @webflow/webflow-cli
```

After global installation, you can use:
```powershell
webflow auth login
webflow devlink
```

### Option 3: Use npx (No installation needed)
You can run the CLI without installing it globally:

```powershell
npx @webflow/webflow-cli auth login
npx @webflow/webflow-cli devlink
```

## Current Setup

The Webflow CLI is already in your `devDependencies` in `package.json`:
- Package: `@webflow/webflow-cli`
- Version: `^1.10.0`

## Available npm Scripts

After running `npm install`, you can use:

- `npm run webflow:auth` - Login to Webflow
- `npm run webflow:devlink` - Run DevLink
- `npm run webflow -- [command]` - Run any webflow CLI command

## DevLink Configuration

Your `webflow.json` file is already configured for DevLink:
- Root directory: `./devlink`
- CSS modules: enabled
- File extensions: JSX for JS files
- Component library: "Nice And Easy Code Library"

## Next Steps

1. Run `npm install` to ensure all dependencies are installed
2. Use `npm run webflow:auth` to authenticate with Webflow
3. Use `npm run webflow:devlink` to start the DevLink connection

## Troubleshooting

If you still get errors:

1. **Check Node.js version**: Webflow CLI requires Node.js 16+ 
   ```powershell
   node --version
   ```

2. **Clear npm cache**:
   ```powershell
   npm cache clean --force
   ```

3. **Reinstall dependencies**:
   ```powershell
   npm install
   ```

4. **Check PATH**: Make sure npm global bin directory is in your PATH
   ```powershell
   npm config get prefix
   ```

