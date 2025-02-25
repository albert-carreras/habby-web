# Statistics and Metrics

## Overview

Habby provides comprehensive statistics and metrics to help users visualize their progress in journaling, habit tracking, and goal achievement. The Stats view offers insights into patterns and trends over time.

## Features

### Monthly Overview

- Days journaled counter
- Days tracked counter
- Overall completion rate
- Visual summaries by month

### Habit Analytics

- Average rating for scale-based habits
- Minimum and maximum values
- Completion rates for toggle habits
- Visual representation of trends

### Goal Metrics

- Goal achievement rates
- Month-over-month comparison

## Implementation Details

### Data Structure

The statistics view uses data from multiple stores:

- Day entries from `useDayStore`
- Habit definitions from `useHabitStore`
- Goal tracking from `useMonthGoalsStore`

### Calculation Methods

Statistics are calculated using utility functions that:

1. Aggregate data by month
2. Calculate percentages and averages
3. Determine completion rates
4. Find minimum and maximum values

Example calculation:

```typescript
// Calculate habit completion rate
const calculateCompletionRate = (
  habits: HabitValue[],
  daysInMonth: number
): number => {
  const toggleHabits = habits.filter(h => h.type === 'toggle');
  const completedHabits = toggleHabits.filter(h => h.value === true);
  return (completedHabits.length / (toggleHabits.length || 1)) * 100;
};

// Calculate average rating
const calculateAverageRating = (
  habits: HabitValue[]
): number => {
  const ratingHabits = habits.filter(
    h => h.type === 'rating' && typeof h.value === 'number'
  );
  
  if (ratingHabits.length === 0) return 0;
  
  const sum = ratingHabits.reduce(
    (acc, h) => acc + (h.value as number),
    0
  );
  
  return sum / ratingHabits.length;
};
```

### UI Components

The primary components for statistics are:

- `stats.tsx`: Main statistics screen
- Various metric display components
- Cards for each statistic category

### Visual Display

Statistics are presented with a clean, card-based layout:

```tsx
// Simplified stats view example
<ScrollView>
  <Card>
    <Text>Overview</Text>
    <StatItem
      label="Days Journaled"
      value={stats.daysJournaled}
      icon="edit"
    />
    <StatItem
      label="Days Tracked"
      value={stats.daysTracked}
      icon="calendar"
    />
    <StatItem
      label="Completion"
      value={`${stats.completionRate}%`}
      icon="check-circle"
    />
  </Card>
  
  {/* Habit-specific cards */}
  {stats.habits.map(habit => (
    <Card key={habit.id}>
      <Text>{habit.label}</Text>
      {habit.type === 'rating' ? (
        <>
          <StatItem
            label="Average Rating"
            value={`${habit.average}/10`}
            icon="bar-chart"
          />
          <StatItem
            label="Max Rating"
            value={`${habit.max}/10`}
            icon="arrow-up"
          />
          <StatItem
            label="Min Rating"
            value={`${habit.min}/10`}
            icon="arrow-down"
          />
        </>
      ) : (
        <StatItem
          label="Completion"
          value={`${habit.completionRate}%`}
          icon="percent"
        />
      )}
    </Card>
  ))}
</ScrollView>
```

## Navigation

The Stats view is accessible from the main navigation and provides:

- Month selection for viewing different time periods
- Individual habit details
- Overview metrics

## Visualization Style

Statistics are presented with:

- Clear numerical values
- Contextual icons
- Simple labels
- Consistent color coding based on the app theme

## Future Enhancements

Potential improvements to the Statistics feature:

1. Interactive charts and graphs
2. Time-based trend visualization
3. Correlation analysis between habits
4. Exportable reports
5. Comparative analysis across months
6. Streak tracking and visualization
7. Custom date range selection
8. Achievement badges and milestones
