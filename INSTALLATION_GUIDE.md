# Installation Guide - Fixing OneDrive Issues

## Problem
OneDrive file locking is preventing `npm install` from completing successfully.

## Solution Options

### Option 1: Pause OneDrive Sync (Recommended)
1. Right-click the OneDrive icon in your system tray (bottom-right corner)
2. Click "Pause syncing" → Select "2 hours"
3. Open PowerShell or Command Prompt in the project directory
4. Run: `npm install --legacy-peer-deps --no-optional`
5. Wait for installation to complete
6. Resume OneDrive syncing after installation

### Option 2: Exclude node_modules from OneDrive
1. Right-click the OneDrive folder in File Explorer
2. Go to OneDrive settings
3. Click "Manage backup"
4. Uncheck the `chefs_kiss` folder or exclude `node_modules` specifically
5. Run: `npm install --legacy-peer-deps --no-optional`

### Option 3: Move Project Outside OneDrive
1. Move the entire `chefs_kiss` folder to `C:\Users\kgosi\Desktop\chefs_kiss` (outside OneDrive)
2. Open terminal in the new location
3. Run: `npm install --legacy-peer-deps --no-optional`

### Option 4: Use Expo CLI (Best for Expo Projects)
```bash
cd "C:\Users\kgosi\OneDrive - Curro Holdings\Desktop\chefs_kiss\chefs_kiss"
npx expo install --fix
```

## After Installation

Once packages are installed, run the project:

```bash
npm start
```

Then scan the QR code with Expo Go app on your phone, or press `w` to open in web browser.

## Current Status
✅ All TypeScript errors fixed
✅ Code is Expo Go compatible (no React Navigation)
✅ All dependencies listed in package.json
⏳ Waiting for package installation

