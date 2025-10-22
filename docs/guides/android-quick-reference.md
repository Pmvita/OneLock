# Quick Reference - Android Development Commands

## Essential Commands

### Check Available Emulators
```bash
~/Library/Android/sdk/emulator/emulator -list-avds
```

### Start Android Emulator
```bash
~/Library/Android/sdk/emulator/emulator -avd Pixel_9_Pro_API_35
```

### Start OneLock Development
```bash
cd /Users/petermvita/Desktop/Coding/OneLock
npx expo start
# Then press 'a' for Android
```

### Alternative: Direct Android Start
```bash
cd /Users/petermvita/Desktop/Coding/OneLock
npx expo start --android
```

## After Setting Up PATH (Recommended)

Once you've added Android SDK to your PATH in `~/.zshrc`:

### Simplified Commands
```bash
# List emulators
emulator -list-avds

# Start emulator
emulator -avd Pixel_9_Pro_API_35

# Check connected devices
adb devices
```

## Troubleshooting Commands

### Clear Expo Cache
```bash
npx expo start --clear
```

### Build Development Build
```bash
npx expo run:android
```

### Switch to Expo Go Mode
```bash
# In Expo terminal, press 's' then 'a'
```

## Your Available Emulators
Based on your system:
- `Medium_Phone_API_35`
- `Medium_Phone_API_35_2`
- `Pixel_9_Pro_API_35` (recommended)

## Daily Workflow
1. `emulator -avd Pixel_9_Pro_API_35`
2. `cd /Users/petermvita/Desktop/Coding/OneLock`
3. `npx expo start`
4. Press `a` in terminal

For detailed setup instructions, see [Android Emulator Setup Guide](android-emulator-setup.md).
