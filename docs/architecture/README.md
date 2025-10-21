# Architecture Documentation

## System Overview

OneLock follows a modular, service-oriented architecture designed for scalability, maintainability, and security. The application is built using React Native with Expo, implementing modern mobile development patterns.

## Core Architecture Principles

### 1. Separation of Concerns
- **UI Components**: Pure presentation components with minimal business logic
- **Services**: Business logic and data management
- **Utils**: Pure functions and utilities
- **Types**: TypeScript definitions for type safety

### 2. Security-First Design
- All sensitive operations go through secure services
- Mock encryption demonstrates real-world patterns
- Biometric authentication integration
- Secure local storage using Expo SecureStore

### 3. Modular Component System
- Reusable UI components
- Consistent design system
- Type-safe component interfaces
- Comprehensive error handling

## Folder Structure

```
OneLock/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation screens
│   ├── auth/              # Authentication screens
│   ├── password/          # Password management screens
│   └── _layout.tsx        # Root layout configuration
├── components/            # Reusable UI components
│   ├── ui/                # Basic UI components
│   ├── password/          # Password-specific components
│   └── index.ts           # Component exports
├── services/              # Business logic services
│   ├── auth.ts            # Authentication service
│   ├── storage.ts         # Storage and encryption
│   └── index.ts           # Service exports
├── utils/                 # Utility functions
│   └── index.ts           # Password utilities
├── types/                 # TypeScript definitions
│   └── index.ts           # Type exports
├── constants/             # App constants
│   └── index.ts           # Theme and configuration
├── mockData/              # Sample data
│   └── passwords.json     # Mock password data
├── docs/                  # Documentation
└── tests/                 # Test files
```

## Service Layer Architecture

### Authentication Service (`services/auth.ts`)
Handles all authentication-related operations:

```typescript
class AuthenticationService {
  // Biometric authentication
  static async authenticateWithBiometrics(): Promise<boolean>
  static async isBiometricAvailable(): Promise<boolean>
  
  // Master password management
  static async setupMasterPassword(password: string): Promise<void>
  static async verifyMasterPassword(password: string): Promise<boolean>
  static async changeMasterPassword(current: string, new: string): Promise<void>
  
  // Settings management
  static async getSettings(): Promise<UserSettings>
  static async updateSettings(settings: Partial<UserSettings>): Promise<void>
  
  // Auto-lock functionality
  static async setLastUnlockTime(): Promise<void>
  static async shouldAutoLock(): Promise<boolean>
}
```

### Storage Service (`services/storage.ts`)
Manages secure data storage and mock encryption:

```typescript
class MockEncryptionService {
  // Mock encryption/decryption
  static async encrypt(text: string): Promise<string>
  static async decrypt(encryptedText: string): Promise<string>
  static async hashPassword(password: string): Promise<string>
  static async verifyPassword(password: string, hash: string): Promise<boolean>
}

class SecureStorageService {
  // Secure key-value storage
  static async setItem(key: string, value: string): Promise<void>
  static async getItem(key: string): Promise<string | null>
  static async removeItem(key: string): Promise<void>
  static async clearAll(): Promise<void>
}

class PasswordDataService {
  // Password CRUD operations
  static async loadPasswords(): Promise<PasswordEntry[]>
  static async savePasswords(passwords: PasswordEntry[]): Promise<void>
  static async addPassword(password: PasswordEntry): Promise<void>
  static async updatePassword(id: string, updates: Partial<PasswordEntry>): Promise<void>
  static async deletePassword(id: string): Promise<void>
}
```

## Component Architecture

### UI Components (`components/ui/`)
Basic reusable components following design system:

- **Button**: Configurable button with variants and states
- **Input**: Form input with validation and error states
- **Card**: Container component with shadow and styling
- **LoadingSpinner**: Loading indicator component

### Password Components (`components/password/`)
Specialized components for password management:

- **PasswordCard**: Displays password entry with actions
- **CategoryBadge**: Category indicator with color coding
- **StrengthMeter**: Visual password strength indicator
- **PasswordGeneratorModal**: Password generation interface
- **EmptyState**: Empty state with call-to-action

### Component Design Patterns

1. **Props Interface**: All components use TypeScript interfaces
2. **Default Props**: Sensible defaults for optional props
3. **Error Boundaries**: Graceful error handling
4. **Accessibility**: ARIA labels and screen reader support
5. **Performance**: Memoization where appropriate

## Navigation Architecture

### Expo Router Implementation
File-based routing with type-safe navigation:

```
app/
├── _layout.tsx           # Root layout with Stack navigator
├── index.tsx             # Initial route (auth check)
├── auth/
│   ├── _layout.tsx       # Auth stack layout
│   ├── setup.tsx         # Master password setup
│   └── login.tsx         # Login screen
├── (tabs)/
│   ├── _layout.tsx       # Tab navigator layout
│   ├── index.tsx         # Vault (home) screen
│   ├── categories.tsx    # Categories screen
│   ├── favorites.tsx     # Favorites screen
│   └── settings.tsx      # Settings screen
└── password/
    ├── [id].tsx          # Password details
    ├── add.tsx           # Add password
    └── edit/
        └── [id].tsx      # Edit password
```

### Navigation Patterns
- **Stack Navigation**: Modal presentations and deep linking
- **Tab Navigation**: Main app sections
- **Type-Safe Routes**: TypeScript route parameters
- **Conditional Navigation**: Authentication-based routing

## State Management

### Local State
- React hooks for component state
- useState for form data and UI state
- useEffect for side effects and data loading

### Global State (Future)
- Zustand for global state management
- Persistent state for user preferences
- Optimistic updates for better UX

## Security Architecture

### Authentication Flow
1. **First Launch**: Master password setup
2. **Subsequent Launches**: Biometric or password authentication
3. **Auto-Lock**: Background timer with configurable duration
4. **Session Management**: Secure session handling

### Data Protection
1. **Encryption**: Mock implementation with real-world patterns
2. **Secure Storage**: Expo SecureStore for sensitive data
3. **Input Validation**: Comprehensive validation and sanitization
4. **Error Handling**: Secure error messages without data leakage

### Security Considerations
- Master password never stored in plain text
- Biometric data handled by system APIs
- Secure key derivation (mock implementation)
- Auto-clear clipboard after password copy
- Session timeout handling

## Performance Architecture

### Optimization Strategies
1. **Lazy Loading**: Screen-based code splitting
2. **Memoization**: React.memo for expensive components
3. **Efficient Lists**: FlatList with proper keyExtractor
4. **Image Optimization**: Optimized assets and caching
5. **Bundle Splitting**: Separate bundles for different features

### Memory Management
- Proper cleanup in useEffect
- Weak references where appropriate
- Efficient data structures
- Garbage collection optimization

## Testing Architecture

### Test Structure
```
tests/
├── unit/                 # Unit tests
│   ├── utils/           # Utility function tests
│   └── services/        # Service layer tests
├── components/          # Component tests
├── integration/         # Integration tests
└── e2e/                 # End-to-end tests
```

### Testing Patterns
- **Unit Tests**: Pure function testing
- **Component Tests**: React Native Testing Library
- **Integration Tests**: Service layer testing
- **Mock Implementations**: External dependency mocking

## Build Architecture

### Development Builds
- Expo Go compatibility
- Hot reloading enabled
- Debug mode with dev tools
- Source maps for debugging

### Production Builds
- Standalone app generation
- Code minification and optimization
- Asset optimization
- Security hardening

### EAS Build Configuration
```json
{
  "build": {
    "development": {
      "developmentClient": false,
      "distribution": "internal",
      "ios": { "simulator": true },
      "android": { "buildType": "apk" }
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

## Scalability Considerations

### Horizontal Scaling
- Modular service architecture
- Stateless service design
- Efficient data structures
- Caching strategies

### Vertical Scaling
- Performance monitoring
- Memory usage optimization
- CPU efficiency improvements
- Battery usage optimization

### Future Enhancements
- Cloud synchronization
- Multi-device support
- Team collaboration features
- Enterprise integrations
