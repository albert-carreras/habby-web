# Habit Tracking

## Overview

Habit tracking is a core feature of Habby, allowing users to monitor up to three habits daily using two different tracking methods. Habits are configured monthly and visualized in the timeline view.

## Features

### Habit Types

Habby supports two types of habit tracking:

1. **Yes/No Toggle**: Simple binary completion tracking
   - Marked as done or not done for the day
   - Visualized with checkmarks or empty circles
   - Ideal for habits like "Meditation", "Reading", etc.

2. **Rating Scale (0-10)**: Quantitative measurement
   - Tracks intensity, quality, or satisfaction on a 0-10 scale
   - Visualized with color intensity
   - Perfect for tracking mood, energy levels, etc.

### Monthly Configuration

- Users can configure up to 3 habits per month
- Habits can be changed at the start of a new month
- Previous months' data remains intact when habits change

### Customizable Icons

- Yes/No habits include customizable icons
- 30+ built-in icons for common habits
- Visual customization enhances at-a-glance recognition

## Implementation Details

### Data Structure

Habits are defined using two primary structures:

```typescript
// Habit definition (configuration)
interface HabitDefinition {
  id: string;
  label: string;
  type: "toggle" | "rating";
  iconSet?: string;
  defaultValue: boolean | number;
}

// Habit value (daily tracking)
interface HabitValue {
  id: string;
  type: "toggle" | "rating";
  value: boolean | number | undefined;
  iconSet?: string;
}
```

### Habit Management Flow

1. User accesses habit management from month header
2. Bottom sheet opens with current month's habits
3. User can add, edit, or delete habits (up to 3)
4. For each habit, user sets:
   - Name
   - Type (toggle/rating)
   - Icon (for toggles)
5. Changes apply to current month forward

### Daily Tracking Flow

1. User taps a day in the timeline
2. Bottom sheet shows current habits for that month
3. User toggles or adjusts sliders for each habit
4. Values are saved with the day entry

### State Management

Habits are managed through the `useHabitStore`:

```typescript
export const useHabitStore = create<HabitStoreState>()(
  persist(
    (set, get) => ({
      monthlyHabits: {},
      dayData: {},

      getMonthHabits: (monthKey: string) => {
        // Returns habits for the specified month
        // Creates default habits if none exist
      },

      updateMonthHabits: (monthKey: string, habits: HabitDefinition[]) => {
        // Updates habit definitions for a month
        // Updates related day data to maintain consistency
      },
    }),
    {
      name: "habit-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
```

### UI Components

The primary components for habit tracking are:

- `HabitManagement.tsx`: Interface for configuring monthly habits
- `HabitRow.tsx`: Single habit configuration row
- `ActionSlider.tsx`: Slider for rating-type habits
- `HabitDots.tsx`: Visual indicators for habit tracking in timeline

## Visual Representation

Habits are represented in the timeline with colored dots:

- **Toggle habits**: Checked or empty circles
- **Rating habits**: Color-coded circles with intensity based on rating

```typescript
// From HabitDots.tsx
<XStack gap={4} alignItems="center">
  {habitOrder.map((habitId) => {
    const habit = habits.find((h) => h.id === habitId);
    
    if (!habit) return null;
    
    if (habit.type === "toggle") {
      return (
        <View
          key={habitId}
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: habit.value
              ? theme.colors.accent
              : theme.colors.inactive,
            // Additional styling
          }}
        />
      );
    }
    
    // Rating visualization
    return (
      <View
        key={habitId}
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: habit.value
            ? getRatingColor(habit.value as number)
            : theme.colors.inactive,
          // Additional styling
        }}
      />
    );
  })}
</XStack>
```

## Statistics

Habit tracking data is used in the Stats view to provide insights:

- Monthly completion rates
- Average ratings over time
- Streaks and patterns
- Comparison across months

## Future Enhancements

Potential improvements to the habit tracking feature:

1. Unlimited habits with scrollable interface
2. Custom numeric ranges beyond 0-10
3. Habit categories and tagging
4. Notifications for habit reminders
5. Detailed habit analytics with trends
6. Weekly and yearly habit views
