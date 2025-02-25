# State Management

## Overview

habby uses Zustand as its primary state management solution. Zustand was chosen for its simplicity, minimal boilerplate, and built-in persistence capabilities. This document details the state management architecture in the application.

## Store Organization

The application divides state into multiple specialized stores for better separation of concerns:

### Main Data Stores

These stores handle the core application data:

1. **useDayStore** (`/stores/useDayStore.ts`)
   - Manages daily journal entries
   - Stores text, habits tracked, and photo references
   - Provides methods to update entries

2. **useHabitStore** (`/stores/useHabitStore.ts`)
   - Manages habit definitions per month
   - Handles habit configuration (type, icons, defaults)
   - Provides methods to update monthly habits

3. **useMonthGoalsStore** (`/stores/useMonthGoalsStore.ts`)
   - Manages monthly goals
   - Tracks goal completion status
   - Provides methods to add, update, and remove goals

### UI State Stores

These stores handle UI-specific state:

1. **useSheetStore** (`/stores/useSheetStore.ts`)
   - Controls bottom sheet visibility and state
   - Manages which type of sheet is displayed
   - Handles the currently selected date

2. **themeProvider** (`/stores/themeProvider.tsx`)
   - Manages app theme settings
   - Handles system theme preferences
   - Provides theme toggle functionality

3. **useTooltipStore** (`/stores/useTooltipStore.ts`)
   - Manages tooltip display
   - Tracks which tooltips have been shown to users
   - Controls onboarding element visibility

4. **useOnboardingStore** (`/stores/useOnboardingStore.ts`)
   - Tracks onboarding completion status
   - Manages first-time user experience

5. **useNotificationStore** (`/stores/useNotificationStore.ts`)
   - Handles reminder notification settings
   - Manages notification permissions

## Data Persistence

All major stores use Zustand's `persist` middleware with AsyncStorage to ensure data persists across app launches:

```typescript
export const useDayStore = create<DaysState>()(
  persist(
    (set, get) => ({
      // Store implementation
    }),
    {
      name: "day-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
```

This approach provides:
- Offline-first functionality
- Automatic data restoration
- Transparent persistence without additional code

## Data Types

The application uses TypeScript to enforce type safety across stores. Key types are defined in `/constants/types.ts`:

```typescript
// Key data types
export interface DayData {
  text: string;
  habits: HabitValue[];
  photo?: string;
}

export interface HabitDefinition {
  id: string;
  label: string;
  type: "toggle" | "rating";
  iconSet?: string;
  defaultValue: boolean | number;
}

export interface MonthGoal {
  id: string;
  text: string;
  completed: boolean;
}
```

## State Selectors

Components use selectors to efficiently access only the state they need:

```typescript
// Example of a specialized selector
const daySelector = useCallback(
  (state: DaysState) => state.days[dateString],
  [dateString],
);
const dayData = useDayStore(daySelector);
```

This pattern prevents unnecessary re-renders and improves performance.

## Custom Hooks for Complex State Logic

For complex state operations that span multiple stores, the application uses custom hooks in the `/hooks` directory:

- **useActionModalState**: Manages state for day entry bottom sheets
- **useHabitManagement**: Handles habit editing functionality
- **useDateWindows**: Controls what date ranges are visible

These hooks encapsulate complex state interactions, keeping components clean and focused on rendering.
