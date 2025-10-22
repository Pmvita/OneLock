# Android Emulator Setup Guide

This guide will help you set up and run Android emulators for OneLock development on macOS.

## Prerequisites

- **Android Studio** installed (download from [developer.android.com](https://developer.android.com/studio))
- **Android SDK** configured during Android Studio installation
- **Node.js 18+** and npm installed

## Quick Start

### 1. Check Available Emulators

First, check what Android Virtual Devices (AVDs) you have available:

```bash
~/Library/Android/sdk/emulator/emulator -list-avds
```

This will show you all available emulators. Common output might look like:
```
Medium_Phone_API_35
Medium_Phone_API_35_2
Pixel_9_Pro_API_35
```

### 2. Start an Emulator

Start your preferred emulator (replace `Medium_Phone_API_35` with your actual emulator name):

```bash
~/Library/Android/sdk/emulator/emulator -avd Medium_Phone_API_35
# or emulator -avd Medium_Phone_API_35
```

Wait for the emulator to fully boot up (you'll see the Android home screen).

### 3. Run OneLock on Android

Once the emulator is running, navigate to your OneLock project directory and start Expo:

```bash
cd /Users/petermvita/Desktop/Coding/OneLock
npx expo start
```

Then press `a` in the terminal to open the app on Android, or run:

```bash
npx expo start --android
```

## Setting Up Android SDK PATH (Recommended)

To make emulator commands easier to use, add the Android SDK to your system PATH.

### Add to ~/.zshrc

Open your shell configuration file:

```bash
nano ~/.zshrc
```

Add these lines at the end:

```bash
# Android SDK Configuration
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

### Reload Your Shell

```bash
source ~/.zshrc
```

### Now You Can Use Short Commands

After setting up the PATH, you can use these simplified commands:

```bash
# List available emulators
emulator -list-avds

# Start an emulator
emulator -avd Pixel_9_Pro_API_35

# Check connected devices
adb devices
```

## Creating New Emulators

If you don't have any emulators or want to create new ones:

### 1. Open Android Studio

```bash
open -a "Android Studio"
```

### 2. Open AVD Manager

- Go to **Tools → AVD Manager**, or
- Click the AVD Manager icon in the toolbar

### 3. Create Virtual Device

1. Click **"Create Virtual Device"**
2. Choose a device (recommended: Pixel 6 or Pixel 9 Pro)
3. Select a system image (API level 30+ recommended)
4. Click **"Next"** and then **"Finish"**

## Troubleshooting

### "Command not found: emulator"

This means the Android SDK tools aren't in your PATH. Either:
- Use the full path: `~/Library/Android/sdk/emulator/emulator`
- Or set up the PATH as described above

### "No Android connected device found"

This means no emulator is currently running. Start an emulator first:

```bash
emulator -avd <your-emulator-name>
```

### "No development build installed"

Your project uses Expo Development Build. You have two options:

#### Option 1: Build and Install Development Build
```bash
npx expo run:android
```

#### Option 2: Switch to Expo Go
In your Expo terminal, press `s` to switch to Expo Go mode, then press `a` to open Android.

### Emulator Won't Start

Common solutions:
1. **Check available space**: Emulators need several GB of free space
2. **Restart Android Studio**: Sometimes the emulator service needs a restart
3. **Check system requirements**: Ensure your Mac meets Android Studio requirements
4. **Try a different emulator**: Some emulators work better than others

### Performance Issues

For better emulator performance:
1. **Enable Hardware Acceleration**: In Android Studio → AVD Manager → Edit → Advanced Settings → Graphics: Hardware - GLES 2.0
2. **Allocate more RAM**: Increase RAM allocation in emulator settings
3. **Use x86_64 images**: They're faster than ARM images on Intel Macs

## Development Workflow

### Daily Development

1. **Start emulator**:
   ```bash
   emulator -avd Pixel_9_Pro_API_35
   ```

2. **Start Expo development server**:
   ```bash
   cd /Users/petermvita/Desktop/Coding/OneLock
   npx expo start
   ```

3. **Press `a`** to open on Android

### Hot Reloading

The emulator supports hot reloading, so changes to your code will automatically update in the emulator.

### Debugging

- **React Native Debugger**: Available through Expo dev tools
- **Chrome DevTools**: Press `j` in Expo terminal to open debugger
- **Console Logs**: Visible in the Expo terminal

## Alternative: Physical Android Device

If you prefer using a physical Android device:

1. **Enable Developer Options**:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times

2. **Enable USB Debugging**:
   - Go to Settings → Developer Options
   - Turn on "USB Debugging"

3. **Connect via USB** and run:
   ```bash
   npx expo start --android
   ```

4. **Or use Expo Go app**:
   - Install Expo Go from Google Play Store
   - Scan the QR code from `npx expo start`

## Useful Commands Reference

```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd <emulator-name>

# List connected devices
adb devices

# Install APK on connected device
adb install <path-to-apk>

# Start Expo with Android
npx expo start --android

# Build development build
npx expo run:android

# Clear Expo cache
npx expo start --clear
```

## Next Steps

Once your Android emulator is running:

1. **Test OneLock features** on Android
2. **Verify biometric authentication** works
3. **Test different screen sizes** with various emulators
4. **Check performance** and optimize if needed

For more development tips, see the main [README.md](../README.md) file.
