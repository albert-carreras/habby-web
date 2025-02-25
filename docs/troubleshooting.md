# Troubleshooting Guide

## Overview

This document provides solutions for common issues that may occur during development, testing, or usage of the Habby app. Use this guide to diagnose and resolve problems efficiently.

## Development Issues

### Build Failures

#### Expo Build Issues

**Symptoms:**
- Build fails with Expo errors
- Metro bundler crashes
- Dependency conflicts reported

**Solutions:**
1. Clear cache and node modules:
   ```bash
   expo start --clear
   # Or more aggressively:
   rm -rf node_modules
   yarn cache clean
   yarn install
   ```

2. Check for Expo SDK version mismatches:
   - Ensure all Expo packages use the same version
   - Update packages with `expo install [package-name]` rather than npm/yarn

3. Verify compatible Node.js version:
   - Check the recommended Node.js version for your Expo SDK
   - Use nvm to switch Node versions if needed

#### TypeScript Errors

**Symptoms:**
- TypeScript compilation errors
- Type mismatches
- Missing type definitions

**Solutions:**
1. Update type definitions:
   ```bash
   yarn add -D @types/react @types/react-native
   ```

2. Check for type errors:
   ```bash
   yarn tsc --noEmit
   ```

3. Fix common type issues:
   - Add proper type annotations to functions and variables
   - Use type assertions when needed (`as Type`)
   - Update interfaces in `/constants/types.ts`

### State Management Issues

**Symptoms:**
- UI not updating when state changes
- Inconsistent state between components
- Store reset on reload

**Solutions:**
1. Check store subscriptions:
   - Ensure selectors are memoized with `useCallback`
   - Verify selector dependencies are correct
   - Confirm store is properly initialized

2. Verify persistence setup:
   - Check AsyncStorage keys with React Native Debugger
   - Ensure persist middleware is configured correctly
   - Test with simplified state structure

3. Debug state updates:
   - Add console logs to state change handlers
   - Use React DevTools to inspect component props
   - Check if actions are being called with correct parameters

### UI Rendering Issues

**Symptoms:**
- Components not rendering correctly
- Layout shifts or flickering
- Missing UI elements

**Solutions:**
1. Check component hierarchy:
   - Verify parent components are rendering
   - Check conditional rendering logic
   - Ensure keys are unique in lists

2. Debug styling issues:
   - Check theme application
   - Verify styles are applied correctly
   - Test on multiple screen sizes

3. Performance issues:
   - Verify memoization is working correctly
   - Check for unnecessary re-renders
   - Optimize large lists with windowing techniques

## Data Persistence Issues

### AsyncStorage Failures

**Symptoms:**
- Data not saving between sessions
- "Storage full" errors
- Corrupted data

**Solutions:**
1. Check AsyncStorage availability:
   ```typescript
   try {
     const test = await AsyncStorage.setItem('test-key', 'test-value');
     const value = await AsyncStorage.getItem('test-key');
     console.log('AsyncStorage test:', value === 'test-value');
   } catch (error) {
     console.error('AsyncStorage error:', error);
   }
   ```

2. Handle storage limits:
   - Implement data cleanup for old entries
   - Optimize storage by removing unnecessary data
   - Add error handling for storage failures

3. Fix corrupted data:
   - Add validation for loaded data
   - Implement recovery mechanisms
   - Provide data reset option in settings

### Import/Export Issues

**Symptoms:**
- Export fails to generate file
- Import fails to process file
- Missing data after import

**Solutions:**
1. Debug export process:
   - Check file permissions
   - Verify ZIP creation process
   - Ensure image data is properly encoded

2. Fix import validation:
   - Strengthen data structure validation
   - Add version compatibility checks
   - Improve error reporting

3. Handle large exports:
   - Implement chunking for large datasets
   - Add progress indication
   - Optimize image handling

## User-Facing Issues

### First Launch Problems

**Symptoms:**
- App crashes on first launch
- Onboarding doesn't appear
- Blank screen after splash

**Solutions:**
1. Check initialization order:
   - Ensure fonts are loaded before rendering
   - Verify i18n initialization completes
   - Check theme provider setup

2. Debug splash screen:
   - Ensure splash screen hides correctly
   - Check for errors during initial render
   - Verify permissions handling

3. Test onboarding flow:
   - Reset onboarding state for testing
   - Check `useOnboardingStore` initialization
   - Verify navigation to main app after completion

### Performance Slowdowns

**Symptoms:**
- Scrolling lag in timeline
- Slow bottom sheet animations
- Delayed response to user input

**Solutions:**
1. Optimize timeline rendering:
   - Reduce initial render count
   - Increase batch size for smoother scrolling
   - Enable `removeClippedSubviews`

2. Improve animation performance:
   - Use native driver for animations
   - Simplify animation complexity
   - Implement loading states

3. Profile and optimize:
   - Use React Native Performance Monitor
   - Check for expensive rendering operations
   - Implement additional memoization

### Image Handling Issues

**Symptoms:**
- Images fail to load
- Camera or gallery access fails
- Photos appear corrupted

**Solutions:**
1. Check permissions:
   - Verify camera and photo library permissions
   - Implement proper permission request flow
   - Handle permission denial gracefully

2. Debug image storage:
   - Check file paths for saved images
   - Verify image compression is working
   - Ensure proper cleanup of temporary files

3. Fix display issues:
   - Implement fallbacks for failed images
   - Add error boundaries around image components
   - Optimize image caching

## Platform-Specific Issues

### Android-Specific Problems

**Symptoms:**
- Keyboard handling issues
- Bottom sheet behavior differences
- Status bar appearance problems

**Solutions:**
1. Fix keyboard handling:
   ```typescript
   // Ensure proper keyboard behavior
   <BottomSheet
     android_keyboardInputMode="adjustResize"
     keyboardBehavior="extend"
     keyboardBlurBehavior="restore"
   >
   ```

2. Resolve status bar issues:
   ```typescript
   // Platform-specific status bar
   if (Platform.OS === "android") {
     StatusBar.setBackgroundColor(theme.colors.primary);
     StatusBar.setBarStyle(isDark ? "light-content" : "dark-content");
   }
   ```

3. Fix navigation bar colors:
   ```typescript
   // For Android navigation bar
   if (Platform.OS === "android") {
     Navbar.setBackgroundColorAsync(theme.colors.secondary);
   }
   ```

### iOS-Specific Problems

**Symptoms:**
- Safe area insets not respected
- Bottom sheet dismissal issues
- Date picker differences

**Solutions:**
1. Fix safe area handling:
   ```typescript
   <SafeAreaView
     style={{ flex: 1, backgroundColor: theme.colors.secondary }}
   >
     {/* Component content */}
   </SafeAreaView>
   ```

2. Resolve bottom sheet issues:
   - Tune animation settings for iOS
   - Handle gesture dismissal differently
   - Test on devices with home indicator

3. Fix date handling:
   - Use platform-specific date pickers
   - Test date formatting for all locales
   - Handle 12/24 hour format differences

## Error Reporting and Recovery

### Crash Handling

**Symptoms:**
- App crashes without error messages
- White screen of death
- Unhandled promise rejections

**Solutions:**
1. Implement error boundaries:
   ```tsx
   <ErrorBoundary
     onError={(error) => trackError(`UI Error: ${error.message}`)}
     fallback={<ErrorFallbackScreen />}
   >
     <AppContent />
   </ErrorBoundary>
   ```

2. Add global error handlers:
   ```typescript
   // Add to app entry point
   if (__DEV__) {
     const originalConsoleError = console.error;
     console.error = (...args) => {
       originalConsoleError(...args);
       if (args[0]?.includes?.('Unhandled promise rejection')) {
         console.log('Consider adding error handling to the promise');
       }
     };
   }
   ```

3. Implement recovery mechanisms:
   - Add "Reset App" option in settings
   - Implement data backup before risky operations
   - Create auto-recovery for corrupted state

### Sentry Integration

**Symptoms:**
- Errors not reported to Sentry
- Missing context in error reports
- Duplicate error reports

**Solutions:**
1. Check Sentry configuration:
   ```typescript
   // Verify initialization
   initializeSentry(navigationIntegration);
   ```

2. Improve error context:
   ```typescript
   // Add user context
   Sentry.setUser({
     id: deviceId,
     language: currentLanguage,
   });
   
   // Add operation context
   Sentry.addBreadcrumb({
     category: 'action',
     message: 'User initiated data export',
     level: 'info',
   });
   ```

3. Optimize error tracking:
   - Use `trackError` helper consistently
   - Add transaction monitoring for key flows
   - Implement proper error grouping

## Recovery Procedures

### Data Reset

If the app becomes unusable due to data corruption:

1. Navigate to Settings > Data Management > Redo Onboarding
2. This will reset the app to its initial state
3. Data will be lost unless exported first

### Full Reset (Development)

For development environments, a complete reset:

```bash
# Clear AsyncStorage during development
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.clear();
```

### Logging for Troubleshooting

Enable enhanced logging for troubleshooting:

```typescript
// Add to common utility
export const enableDebugMode = async () => {
  await AsyncStorage.setItem('debug-mode', 'true');
  console.log('Debug mode enabled - please restart the app');
};

// Then use throughout the code
const isDebugMode = await AsyncStorage.getItem('debug-mode') === 'true';
if (isDebugMode) {
  console.log('Debug:', someData);
}
```
