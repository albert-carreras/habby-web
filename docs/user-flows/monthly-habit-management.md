# Monthly Habit Management User Flow

## Overview

The monthly habit management flow allows users to configure up to three habits they want to track each month. This process involves defining habit types, names, and visual representations.

## Flow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  Open App   │ ──► │  View Main  │ ──► │ Tap on Day  │ ──► │ Bottom Sheet│
│             │     │  Timeline   │     │   Entry     │     │   Opens     │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                  │
                                                                  ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│ Habit Sheet │ ◄── │  Tap "Edit  │ ◄── │ View Current│ ◄── │ Scroll Down │
│   Opens     │     │  Habits"    │     │   Habits    │     │ to Habits   │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                  │
                                                                  ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  Habits are │ ◄── │  Tap Save   │ ◄── │ Configure   │ ◄── │ Add/Edit/   │
│  Updated    │     │             │     │ Each Habit  │     │ Delete Habits│
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

## Detailed Steps

### 1. Accessing Habit Management

There are two ways to access habit management:

#### Method 1: Via Day Entry
- User opens app to main timeline
- User taps on a day to open entry sheet
- User scrolls down to habits section
- User taps "Edit February Habits" button

#### Method 2: Via Month Header
- User opens app to main timeline
- User long-presses on month header
- User selects "Edit Habits" from menu

### 2. Viewing Current Habits

- Bottom sheet displays current month's habits (if any)
- Shows up to 3 habit slots
- Displays habit name, type, and icon (for toggle habits)
- Shows "3/3 Habits" counter at top

### 3. Adding a New Habit

If less than 3 habits are configured:

- User taps "Add New Habit" button
- New empty habit row appears
- Default type is "Toggle"
- Focus moves to habit name input

### 4. Configuring Each Habit

For each habit, user can configure:

#### Habit Type Selection
- User selects habit type:
  - "Yes/No" for binary toggle
  - "Scale" for 0-10 rating

#### Habit Name
- User enters descriptive name
- Examples: "Water", "Sleep", "How are you?"

#### Icon Selection (for Toggle Habits)
- User taps icon button
- Grid of available icons appears
- User selects appropriate icon
- Selected icon appears in preview

### 5. Deleting a Habit

- User taps "X" button on habit row
- Habit is removed immediately
- Counter updates to show available slots

### 6. Reordering Habits (if implemented)

- User holds and drags habit row
- Habits reorder based on drop position
- Visual feedback shows dragging state

### 7. Saving Changes

- User taps "Save" button
- Bottom sheet closes
- Changes are persisted to storage
- Main timeline habit indicators update
- Day entry sheet shows updated habits

### 8. Canceling Changes

- User taps "Cancel" button or swipes down
- Changes are discarded
- Previous habit configuration is maintained

## Implementation Notes

### Key Components Involved

- `HabitManagement.tsx`: Main habit configuration UI
- `HabitRow.tsx`: Individual habit configuration row
- `useHabitManagement.ts`: Hook for managing habit state
- `useHabitStore.ts`: Store for habit persistence

### State Management

```typescript
// From useHabitManagement.ts
const useHabitManagement = () => {
  // Get month from current date
  const monthKey = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}`;
  
  // Get habits for this month
  const habits = useHabitStore((state) => 
    state.monthlyHabits[monthKey]?.habits || []
  );
  
  // Update habits in store
  const updateMonthHabits = useHabitStore(
    (state) => state.updateMonthHabits
  );
  
  // Local state for editing
  const [localHabits, setLocalHabits] = useState(habits);
  
  // Add new habit
  const addHabit = useCallback(() => {
    setLocalHabits((current) => [
      ...current,
      {
        id: `habit-${Date.now()}`,
        label: "",
        type: "toggle",
        defaultValue: false,
      },
    ]);
  }, []);
  
  // Save changes
  const saveChanges = useCallback(() => {
    updateMonthHabits(monthKey, localHabits);
    close(); // Close sheet
  }, [monthKey, localHabits, updateMonthHabits, close]);
  
  // Other functions...
  
  return {
    habits: localHabits,
    addHabit,
    removeHabit,
    updateHabit,
    saveChanges,
    // Other returned values...
  };
};
```

### UX Considerations

- Limit of 3 habits prevents overwhelming users
- Clear visual distinction between toggle and scale types
- Icon selection makes habits visually distinct
- Immediate feedback when saving changes
- Warning if changing habit type for existing data

## Impact on Existing Data

When habits are changed:

- **New habits**: Added to current month configuration
- **Removed habits**: Data preserved but not displayed
- **Modified habits**: Changes apply to future tracking
- **Previous month's habits**: Remain unchanged
- **Past tracking data**: Preserved for all modifications

## Edge Cases

- **Mid-Month Changes**: Only affect future entries
- **Maximum Limit**: UI prevents adding more than 3 habits
- **Empty Names**: Should be validated before saving
- **Habit Type Changes**: May require data migration
- **Year Transition**: New year correctly maintains habits by month
