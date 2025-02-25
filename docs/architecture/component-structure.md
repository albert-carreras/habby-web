# Component Structure

## Overview

habby uses a modular component architecture organized by feature and responsibility. This document outlines the
component structure and describes how UI elements work together.

## Component Organization

The application organizes components into several directories based on functionality:

### Screen Components (`/app`)

Top-level screen components that serve as entry points for the app's main views:

- **`_layout.tsx`**: Root layout with initialization, theme, providers, and navigation setup
- **`index.tsx`**: Main journal timeline view
- **`stats.tsx`**: Statistics and metrics screen
- **`settings.tsx`**: Settings and preferences screen

### Feature-Specific Components (`/components/*`)

Components organized by feature area:

#### Header Components (`/components/header`)

- **`MonthHeader.tsx`**: Header for month sections with collapsible goal interface
- Other header-related UI elements

#### Main View Components (`/components/main`)

- **`DayRow.tsx`**: Individual day entry row for the journal timeline
- **`HabitDots.tsx`**: Visual habit tracking indicators

#### Sheet Components (`/components/sheet`)

Bottom sheet modal components for data entry and interaction:

- **`ActionModal.tsx`**: Main bottom sheet container
- **`ActionModalContent.tsx`**: Content area for day entry
- **`ActionModalHeader.tsx`**: Header area with date and controls
- **`HabitManagement.tsx`**: Interface for managing habits
- **`ActionSlider.tsx`**: Slider control for habit rating
- **`ActionControl.tsx`**: Action buttons for sheet management
- **`HabitRow.tsx`**: Individual habit row for editing

#### Stats Components (`/components/stats`)

- Statistical visualization and reporting components

#### Onboarding Components (`/components/onboarding`)

- Components for the first-time user experience

### Shared UI Components (`/components/ui`)

Reusable UI elements used throughout the app:

- **`CircleButton.tsx`**: Circular action button
- **`CustomBackdrop.tsx`**: Backdrop for modals
- **`ErrorBoundary.tsx`**: Error handling wrapper
- **`Gradient.tsx`**: Gradient overlays
- **`ImageViewer.tsx`**: Full-screen photo viewer
- **`PhotoIcon.tsx`**: Photo indicator and button
- **`StatusBarManager.tsx`**: Status bar handling
- **`ThumbnailView.tsx`**: Photo thumbnail display

## Component Communication

Components communicate primarily through:

1. **Props**: Direct parent-child communication
2. **State Stores**: Zustand stores for shared state
3. **Custom Hooks**: Encapsulated logic and data access

## Key Component Implementations

### DayRow Component

```typescript
// Simplified example of DayRow component
export const DayRow = memo(
  ({ day, onPress, expandedPhotoId, onPhotoExpand }: DayRowProps) => {
    // Component state and hooks
    const { theme } = useTheme();
    const dayData = useDayStore(daySelector);
    const habits = useHabitStore(monthHabitsSelector);

    // Render day entry with habits and optional photo
    return (
      <TouchableOpacity onPress = { handlePress } >
        <YStack>
          <XStack>
            {/* Date display */ }
        < YStack >
        <Text>{ day.date.getDate() } < /Text>
        < Text > { weekday } < /Text>
        < /YStack>

    {/* Journal entry text */
    }
    <Text>{ dayData?.text || ""
  }
    </Text>

    {/* Habit indicators */
    }
    <HabitDots habits = { dayData?.habits || []
  }
    />

    {/* Photo indicator */
    }
    <PhotoIcon hasPhoto = {!!
    dayData?.photo
  }
    />
    < /XStack>

    {/* Photo thumbnail (if expanded) */
    }
    {
      dayData?.photo && isExpanded && (
        <ThumbnailView filename = { dayData.photo }
      />
    )
    }
    </YStack>
    < /TouchableOpacity>
  )
    ;
  },
  arePropsEqual
);
```

### Bottom Sheet Architecture

The app uses a bottom sheet pattern for user input rather than separate screens:

```typescript
// Simplified ActionModal pattern
export const ActionModal = () => {
  const { theme } = useTheme();
  const { isOpen, close } = useSheetStore();
  const { localText, setLocalText, localHabits, handleHabitChange } = useActionModalState();

  // Render bottom sheet for entry input
  return (
    <BottomSheet
      snapPoints = { ["90%"] }
  onClose = { handleClose }
    >
    <BottomSheetScrollView>
      <YStack>
        {/* Header with date and actions */ }
    < ActionModalHeader / >

    {/* Main content area */ }
    < ActionModalContent
  localText = { localText }
  setLocalText = { setLocalText }
  localHabits = { localHabits }
  handleHabitChange = { handleHabitChange }
  />
  < /YStack>
  < /BottomSheetScrollView>
  < /BottomSheet>
)
  ;
};
```

## Performance Optimizations

Several techniques are used to optimize component performance:

1. **Memoization**: React.memo for expensive components
2. **Custom equality checks**: Prevents unnecessary re-renders
3. **Callback memoization**: useCallback for event handlers
4. **Deferred loading**: Progressive loading of content

Example of performance optimization:

```typescript
// Custom equality check for DayRow component
const arePropsEqual = (prevProps: DayRowProps, nextProps: DayRowProps) => {
  return (
    prevProps.day.date.getTime() === nextProps.day.date.getTime() &&
    prevProps.expandedPhotoId === nextProps.expandedPhotoId &&
    prevProps.day.text === nextProps.day.text &&
    JSON.stringify(prevProps.day.habits) ===
    JSON.stringify(nextProps.day.habits)
  );
};

export const DayRow = memo(
  // Component implementation
  // ...
  arePropsEqual
);
```
