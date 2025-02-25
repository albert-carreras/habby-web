# Architecture Overview

## Introduction

habby follows a modern React Native architecture focused on simplicity, performance, and offline-first design. This document provides a high-level overview of the application's structure and organization.

## Directory Structure

```
/
├── app/                  # Main application screens using Expo Router
│   ├── _layout.tsx       # Root layout component with setup and providers
│   ├── index.tsx         # Main journal view screen
│   ├── settings.tsx      # Settings screen
│   └── stats.tsx         # Statistics screen
├── assets/               # Static assets (fonts, images, theme definitions)
├── components/           # React components organized by feature
│   ├── header/           # Header components
│   ├── main/             # Main journal view components
│   ├── onboarding/       # Onboarding flow components
│   ├── sheet/            # Bottom sheet components
│   ├── stats/            # Statistics view components
│   └── ui/               # Reusable UI components
├── constants/            # Application constants and type definitions
├── hooks/                # Custom React hooks for shared logic
├── stores/               # Zustand stores for state management
├── translations/         # i18n localization files
└── utils/                # Utility functions
```

## Key Architectural Patterns

### State Management

habby uses Zustand for state management, with multiple specialized stores:

- **useDayStore**: Handles daily journal entries and habit tracking data
- **useHabitStore**: Manages habit definitions and configurations
- **useMonthGoalsStore**: Handles monthly goals
- **useSheetStore**: Controls bottom sheet behavior
- **themeProvider**: Manages app theming
- **useTooltipStore**: Handles tooltip display
- **useNotificationStore**: Manages push notifications
- **useOnboardingStore**: Controls the onboarding flow

Each store uses Zustand's `persist` middleware with AsyncStorage for persistent offline storage.

### UI Architecture

The app follows a component-based architecture with:

1. **Screen Components**: Defined in the `/app` directory, using Expo Router
2. **Feature Components**: Complex components organized by feature in `/components`
3. **Shared UI Components**: Reusable UI elements in `/components/ui`

### Data Flow

1. User interacts with the UI
2. UI components call store actions
3. Store actions update the state
4. UI components re-render based on the updated state
5. State is persisted to AsyncStorage

### Bottom Sheets

The app uses bottom sheets (`@gorhom/bottom-sheet`) extensively for user input rather than separate screens. This creates a seamless journaling experience where users can quickly:

- Write daily entries
- Attach photos
- Track habits
- Set goals

All without navigating away from the main timeline view.

### Navigation

habby uses Expo Router for navigation with a simple structure:

- Main journal timeline (`index.tsx`)
- Statistics view (`stats.tsx`)
- Settings (`settings.tsx`)

Modal content is primarily handled through bottom sheets rather than separate routes.

### Offline-First

All data is stored locally using AsyncStorage, with Zustand's persist middleware ensuring data persistence. This allows the app to function fully offline.

### Localization

The app uses i18next/react-i18next for localization, supporting 8 languages. Translation files are stored in the `translations` directory.
