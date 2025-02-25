# Monthly Goal Setting User Flow

## Overview

The monthly goal setting flow allows users to define and track up to five personal goals for each month. Goals are easily accessible from the month header and provide a visual completion status.

## Flow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  Open App   │ ──► │  View Main  │ ──► │ Tap Month   │ ──► │ Month Goals │
│             │     │  Timeline   │     │  Header     │     │  Expand     │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                  │
                                                                  ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│   Month     │ ◄── │ Tap Outside │ ◄── │ Mark Goals  │ ◄── │ Add/Edit    │
│   Collapses │     │   Header    │     │ Complete    │     │   Goals     │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

## Detailed Steps

### 1. Accessing Monthly Goals

- User opens app to main timeline
- Month headers display goal summary (e.g., "2/5 Monthly Goals • 1/2 Achieved")
- User taps on a month header
- Month header expands to show goals section

### 2. Viewing Current Goals

- Expanded header shows all goals for the month
- Each goal displays:
  - Checkbox for completion status
  - Goal text
  - Delete button
- Goal count is displayed (e.g., "2/5 Monthly Goals")

### 3. Adding a New Goal

If fewer than 5 goals are set:

- User taps "+ Add Monthly Goal" button
- New empty goal row appears with:
  - Unchecked checkbox
  - Empty text field with placeholder
  - Delete button
- Text field automatically receives focus
- User enters goal text
- Goal is automatically saved as user types

### 4. Editing Existing Goals

- User taps on goal text
- Text becomes editable
- Changes are saved automatically
- Empty goals are preserved (not auto-deleted)

### 5. Marking Goals Complete

- User taps checkbox next to goal
- Checkbox toggles between unchecked and checked
- Visual feedback shows completion status
- Month header summary updates (e.g., "2/5 Achieved")
- Completed goals remain visible

### 6. Deleting Goals

- User taps "X" button next to goal
- Goal is removed immediately
- Goal count updates
- Remaining goals shift up to fill space

### 7. Closing the Goals View

- User taps outside the expanded header
- User taps on the month header again
- User taps anywhere in the timeline
- Month header collapses back to summary view
- All changes are preserved

## Implementation Notes

### Key Components Involved

- `MonthHeader.tsx`: Contains expandable goals section
- `useMonthGoalsStore.ts`: Store for goal persistence
- Goal UI components within the month header

### State Management

```typescript
// From useMonthGoalsStore.ts
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
      ) =>
        set((state) => ({
          goals: {
            ...state.goals,
            [monthKey]: (state.goals[monthKey] || []).map((goal) =>
              goal.id === goalId ? { ...goal, ...updates } : goal,
            ),
          },
        })),

      removeGoal: (monthKey: string, goalId: string) => {
        // Remove specific goal
      },
    }),
    {
      name: "month-goals-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
```

### Month Header Implementation

```tsx
// Simplified MonthHeader with goals
const MonthHeader = ({ date }) => {
  const monthKey = getMonthKeyFromDate(date);
  const { expandedMonthKey, toggleMonth } = useMonthGoalsStore();
  const goals = useMonthGoalsStore((state) => state.goals[monthKey] || []);
  
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.completed).length;
  const isExpanded = expandedMonthKey === monthKey;
  
  return (
    <View>
      <TouchableOpacity onPress={() => toggleMonth(monthKey)}>
        <Text>{formatMonthYear(date)}</Text>
        {totalGoals > 0 && (
          <Text>{totalGoals} Monthly Goals • {completedGoals}/{totalGoals} Achieved</Text>
        )}
      </TouchableOpacity>
      
      {isExpanded && (
        <View>
          {goals.map(goal => (
            <GoalRow 
              key={goal.id}
              goal={goal}
              monthKey={monthKey}
            />
          ))}
          
          {totalGoals < 5 && (
            <AddGoalButton monthKey={monthKey} />
          )}
        </View>
      )}
    </View>
  );
};
```

### UX Considerations

- Limit of 5 goals prevents overwhelming users
- Goals are stored by month to keep focus relevant
- Visual completion tracking is simple and clear
- No explicit save button needed (automatic saving)
- Expandable interface keeps main timeline clean

## Impact on Timeline

When the user is viewing goals:

- Timeline scroll is disabled while month is expanded
- This prevents accidental dismissal
- User must explicitly collapse the month to continue scrolling

## Statistics Integration

Monthly goals data is used in the Stats view:

- Goal achievement rates
- Completion trends over time
- Possible correlation with habit tracking

## Edge Cases

- **Mid-Month Changes**: Goals can be added/modified any time
- **Maximum Limit**: UI prevents adding more than 5 goals
- **Empty Goals**: System allows empty goals for later completion
- **Month Transition**: Each month has separate goals
- **Year Transition**: Goals are correctly maintained by month and year
