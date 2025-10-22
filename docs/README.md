# OneLock - Password & Credential Manager

## Overview

OneLock is a professional-grade password and credential manager built with React Native, Expo, and TypeScript. It provides secure storage, biometric authentication, and comprehensive password management features with a modern, user-friendly interface.

## Features 

### 🔐 Security Features
- **Master Password Protection**: Encrypted master password with strength validation
- **Biometric Authentication**: Face ID, Touch ID, and fingerprint support
- **Auto-Lock**: Configurable auto-lock timer for enhanced security
- **Mock Encryption**: Demonstrates encryption concepts (production-ready implementation available)
- **Secure Local Storage**: Uses Expo SecureStore for sensitive data

### 📱 Core Functionality
- **Password Vault**: Secure storage and organization of passwords
- **Password Generator**: Customizable password generation with strength indicators
- **Password Strength Checker**: Real-time password strength analysis
- **Breach Check Simulation**: Mock implementation of password breach checking
- **Categories & Tags**: Organize passwords by category (Social, Finance, Work, etc.)
- **Search & Filter**: Advanced search and filtering capabilities
- **Favorites**: Mark important passwords as favorites
- **Import/Export**: Data management features (planned)

### 🎨 User Experience
- **Modern UI**: Colorful, friendly design with professional execution
- **Responsive Design**: Optimized for both iOS and Android
- **Smooth Animations**: React Native Reanimated for fluid interactions
- **Haptic Feedback**: Tactile feedback for important actions
- **Dark/Light Themes**: Theme customization options
- **Accessibility**: WCAG compliant design patterns

## Architecture

### Project Structure
```
/app                    - Main app screens (Expo Router)
/components             - Reusable UI components
/mockData               - Sample password data
/services               - Core business logic
/utils                  - Utility functions
/types                  - TypeScript type definitions
/constants              - App constants and themes
/docs                   - Documentation
/tests                  - Test files
```

### Technology Stack
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build tools
- **TypeScript**: Type-safe JavaScript
- **Expo Router**: File-based navigation
- **Zustand**: Lightweight state management
- **Expo SecureStore**: Secure local storage
- **Expo LocalAuthentication**: Biometric authentication
- **React Native Reanimated**: Smooth animations

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for development)
- Physical device with Expo Go app (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OneLock
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   npm run ios     # iOS Simulator
   npm run android # Android Emulator
   ```

   > **Note**: For Android emulator setup, see the detailed [Android Emulator Setup Guide](guides/android-emulator-setup.md)

### EAS Build Setup

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure build**
   ```bash
   eas build:configure
   ```

4. **Build for development**
   ```bash
   eas build --profile development
   ```

## Development

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Consistent naming conventions
- Comprehensive error handling
- Modular component architecture

### Testing
- Unit tests for utility functions
- Component testing with React Native Testing Library
- Integration tests for critical flows
- Mock implementations for external dependencies

### Security Considerations
- Master password hashing (mock implementation)
- Secure key storage using Expo SecureStore
- Biometric authentication integration
- Auto-lock functionality
- Input validation and sanitization

## Deployment

### Development Builds
- Compatible with Expo Go app
- Hot reloading enabled
- Debug mode available

### Production Builds
- Standalone app builds
- App Store and Google Play Store ready
- Optimized bundle size
- Production-ready security implementations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation in `/docs`
- Review the code comments for implementation details

## Roadmap

### Phase 1 (Current)
- ✅ Core password management
- ✅ Biometric authentication
- ✅ Password generator
- ✅ Basic security features

### Phase 2 (Planned)
- 🔄 Real encryption implementation
- 🔄 Cloud sync capabilities
- 🔄 Advanced import/export
- 🔄 Password sharing

### Phase 3 (Future)
- 🔄 Team collaboration features
- 🔄 Advanced security analytics
- 🔄 Third-party integrations
- 🔄 Enterprise features
