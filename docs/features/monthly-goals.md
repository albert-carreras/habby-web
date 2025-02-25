# Monthly Goals

## Overview

Monthly Goals is a feature that allows users to set and track up to five objectives for each month. This feature helps users focus on what matters to them and provides a simple way to monitor progress.

## Features

### Goal Management

- Set up to 5 goals per month
- Simple checkbox completion tracking
- Goals are specific to each month
- Previous months' goals are preserved

### Expandable Month Header

- Month headers contain a collapsible goal section
- Visual indication of total goals and completion status
- Easy access from the main timeline view

### Visual Progress Tracking

- Goals show completion status with checkboxes
- Month header shows summary (e.g., "2/5 Achieved")
- Completed goals are visually distinguished

## Implementation Details

### Data Structure

Monthly goals are stored with a simple structure:

```typescript
// Individual goal
interface MonthGoal {
  id: string;
  text: string;
  completed: boolean;
}

// State structure
interface MonthGoalsState {
  goals: Record<string, MonthGoal[]>;
  expandedMonthKey: string | null;
  // Action methods
}
```

### Month Key Format

Goals are organized by month using a consistent key format:
- `YYYY-MM` (e.g., "2025-02" for February 2025)

### State Management

Monthly goals are managed through the `useMonthGoalsStore`:

```typescript
export const useMonthGoalsStore = create<MonthGoalsState>()(
  persist(
    (set) => ({
      expandedMonthKey: null,
      goals: {},

      toggleMonth: (monthKey: string) =>
        set((state) => ({
          expandedMonthKey:
            state.expandedMonthKey === monthKey ? null : monthKey,
        })),

      closeMonth: () => set({ expandedMonthKey: null }),

      addGoal: (monthKey: string) =>
        set((state) => ({
          goals: {
            ...state.goals,
            [monthKey]: [
              ...(state.goals[monthKey] || []),
              {
                id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                text: "",
                completed: false,
              },
            ],
          },
        })),

      updateGoal: (
        monthKey: string,
        goalId: string,
        updates: Partial<MonthGoal>,
      ) => {
        // Update goal properties
      },

      removeGoal: (monthKey: string, goalId: string) => {
        // Remove goal from the month
      },
    }),
    {
      name: "month-goals-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Storage configuration
    },
  ),
);
```

### User Flow for Goal Management

1. User taps the month header to expand goals section
2. User sees current goals and their completion status
3. User can tap "Add Monthly Goal" to create a new goal
4. User enters goal text and saves
5. User checks/unchecks goals to mark completion
6. User can delete goals using the X button
7. Collapsing the month header saves all changes

### UI Components

The primary components for monthly goals are:

- `MonthHeader.tsx`: Contains the collapsible goals section
- Goal entry and display UI within the month header

## Visual Display

Goals are displayed in the month header with a clean, minimal design:

```tsx
// Simplified MonthHeader example
<View>
  <TouchableOpacity onPress={toggleExpanded}>
    <Text>{formatMonth(date)}</Text>
    <Text>{completedGoals}/{totalGoals} Achieved</Text>
  </TouchableOpacity>
  
  {isExpanded && (
    <View>
      {goals.map(goal => (
        <View key={goal.id}>
          <Checkbox
            checked={goal.completed}
            onChange={() => toggleGoalCompletion(goal.id)}
          />
          <TextInput
            value={goal.text}
            onChangeText={(text) => updateGoal(goal.id, { text })}
            placeholder="Your goal..."
          />
          <Button onPress={() => removeGoal(goal.id)}>X</Button>
        </View>
      ))}
      
      {goals.length < 5 && (
        <Button onPress={addGoal}>
          Add Monthly Goal
        </Button>
      )}
    </View>
  )}
</View>
```

## Statistics Integration

Monthly goals data is used in the Stats view:

- Goal achievement rates
- Month-over-month completion trends
- Correlation with habit tracking success

## Future Enhancements

Potential improvements to the Monthly Goals feature:

1. Goal categories (personal, work, health, etc.)
2. Progress tracking beyond binary completion (percentage-based)
3. Recurring goals that automatically copy to new months
4. Reminders for incomplete goals as month end approaches
5. Long-term goals that span multiple months
6. Goal achievement celebrations/rewards
