# Webflow CLI Setup Instructions

## Issue
The `webflow` command is not recognized because the Webflow CLI is not installed globally or not accessible in your PATH.

## Solution

### Option 1: Use pnpm scripts (Recommended)
I've added pnpm scripts to your `package.json` so you can run Webflow CLI commands through pnpm:

```powershell
# Login to Webflow
pnpm run webflow:auth

# Run DevLink
pnpm run webflow:devlink

# Run any webflow command
pnpm run webflow -- [command]
```

### Option 2: Install globally
If you want to use `webflow` directly from the command line:

```powershell
pnpm install -g @webflow/webflow-cli
```

After global installation, you can use:
```powershell
webflow auth login
webflow devlink
```

### Option 3: Use pnpx (No installation needed)
You can run the CLI without installing it globally:

```powershell
pnpx @webflow/webflow-cli auth login
pnpx @webflow/webflow-cli devlink
```

## Current Setup

The Webflow CLI is already in your `devDependencies` in `package.json`:
- Package: `@webflow/webflow-cli`
- Version: `^1.10.0`

## Available pnpm Scripts

After running `pnpm install`, you can use:

- `pnpm run webflow:auth` - Login to Webflow
- `pnpm run webflow:devlink` - Run DevLink
- `pnpm run webflow -- [command]` - Run any webflow CLI command

## DevLink Configuration

Your `webflow.json` file is already configured for DevLink:
- Root directory: `./devlink`
- CSS modules: enabled
- File extensions: JSX for JS files
- Component library: "Nice And Easy Code Library"

## Next Steps

1. Run `pnpm install` to ensure all dependencies are installed
2. Use `pnpm run webflow:auth` to authenticate with Webflow
3. Use `pnpm run webflow:devlink` to start the DevLink connection

## Troubleshooting

If you still get errors:

1. **Check Node.js version**: Webflow CLI requires Node.js 16+ 
   ```powershell
   node --version
   ```

2. **Clear pnpm cache**:
   ```powershell
   pnpm store prune
   ```

3. **Reinstall dependencies**:
   ```powershell
   pnpm install
   ```

4. **Check PATH**: Make sure pnpm global bin directory is in your PATH
   ```powershell
   pnpm config get prefix
   ```

