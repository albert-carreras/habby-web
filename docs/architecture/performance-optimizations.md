# Performance Optimizations

## Overview

habby implements various performance optimizations to ensure a smooth user experience, even with large datasets and on lower-end devices. This document outlines the key optimizations used throughout the application.

## React Component Optimizations

### Memoization

Components use `React.memo()` with custom equality checks to prevent unnecessary re-renders:

```typescript
// Custom equality check for DayRow
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
  ({ day, onPress, expandedPhotoId, onPhotoExpand }: DayRowProps) => {
    // Component implementation
  },
  arePropsEqual
);
```

### Callback Memoization

All event handlers and callbacks use `useCallback` to prevent recreation on each render:

```typescript
const handleRowPress = useCallback(
  (date: Date) => {
    if (expandedMonthKey) {
      closeMonth();
      return;
    }
    setDate(date);
    openSheet("day");
  },
  [expandedMonthKey, closeMonth, openSheet, setDate],
);
```

### Selector Optimization

Zustand selectors are memoized with `useCallback` to prevent unnecessary store subscriptions:

```typescript
const daySelector = useCallback(
  (state: DaysState) => state.days[dateString],
  [dateString],
);
const dayData = useDayStore(daySelector);
```

## List Rendering Optimizations

### Windowed Loading

The timeline uses a windowed approach to load only a subset of dates at once:

```typescript
const { dateWindow, handleEndReached, jumpToDate } = useDateWindows();

const daysData = useMemo(() => {
  return generateDaysInWindow(dateWindow, days).sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );
}, [dateWindow, days]);
```

### SectionList Configuration

The SectionList is configured for optimal performance:

```typescript
<SectionList
  ref={listRef}
  sections={sections}
  keyExtractor={keyExtractor}
  renderItem={renderItem}
  renderSectionHeader={renderSectionHeader}
  stickySectionHeadersEnabled
  initialNumToRender={5}           // Limited initial render
  maxToRenderPerBatch={3}          // Smaller batch size
  windowSize={5}                   // Limited window
  updateCellsBatchingPeriod={100}  // Batched updates
  onEndReached={handleEndReachedThrottled}
  onEndReachedThreshold={0.5}
  removeClippedSubviews={true}     // Remove off-screen views
  showsVerticalScrollIndicator={false}
  scrollEnabled={!expandedMonthKey}
  extraData={expandedPhotoId}
  maintainVisibleContentPosition={{
    minIndexForVisible: 0,
  }}
/>
```

### Scroll Optimization

Scroll event handling is throttled to prevent excessive calculations:

```typescript
const handleScroll = useCallback(
  (event: any) => {
    if (expandedMonthKey) return;

    // Capture the value immediately before the event is nullified
    const offset = event.nativeEvent.contentOffset.y;

    // Use throttle for the state updates and side effects
    throttle(() => {
      scrollOffsetRef.current = offset;
      const shouldShow = offset > SCROLL_THRESHOLD;
      setShowScrollButton((prev) =>
        prev !== shouldShow ? shouldShow : prev,
      );

      // Additional scroll handling
    }, 50)();
  },
  [expandedMonthKey],
);
```

## Image Handling Optimizations

### Image Compression

Photos are automatically compressed and resized before storage:

```typescript
const processImage = async (uri: string): Promise<string> => {
  try {
    const processedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1200 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return processedImage.uri;
  } catch (error) {
    // Error handling
    return uri;
  }
};
```

### Lazy Loading

Images are loaded only when needed:

- Thumbnails load when scrolled into view
- Full-screen images load only when expanded
- Image caching is enabled for faster reloading

## State Management Optimizations

### Selective Updates

State updates are targeted to only modify what's necessary:

```typescript
batchUpdateDay: (date, updates) =>
  set((state) => {
    const currentDay = state.days[date] || { habits: [], text: "" };
    const updatedDay = { ...currentDay };

    if (updates.text !== undefined) {
      updatedDay.text = updates.text;
    }

    if (updates.habits !== undefined) {
      updatedDay.habits = updates.habits;
    }

    if (updates.photo !== undefined) {
      if (updates.photo === null) {
        delete updatedDay.photo;
      } else {
        updatedDay.photo = updates.photo;
      }
    }

    return {
      days: {
        ...state.days,
        [date]: updatedDay,
      },
    };
  }),
```

### Immutable Updates

State updates follow immutable patterns to work efficiently with React:

```typescript
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
```

## Animation Optimizations

### Native Driver

Animations use the native driver where possible for smoother performance:

```typescript
Animated.timing(highlightAnim, {
  toValue: 1,
  duration: 200,
  useNativeDriver: true,
}).start();
```

### Reduced Motion Support

Animations respect accessibility settings for reduced motion:

```typescript
const animationConfig = isReduceMotionEnabled
  ? SHEET_ANIMATION_CONFIGS.reduced
  : SHEET_ANIMATION_CONFIGS.default;
```

## AsyncStorage Optimizations

### Selective Persistence

Zustand uses the `partialize` option to only store necessary data:

```typescript
persist(
  (set, get) => ({
    // Store implementation
  }),
  {
    name: "month-goals-storage",
    storage: createJSONStorage(() => AsyncStorage),
    version: 1,
    partialize: (state) => ({
      goals: state.goals,
    }),
  },
),
```

### Optimized Storage Structure

Data is stored in multiple keys rather than one large object to improve load times:

- `day-storage`: Daily entries
- `habit-storage`: Habit configurations
- `month-goals-storage`: Monthly goals
- Other settings in separate stores

## UI Rendering Optimizations

### Conditional Rendering

Components use conditional rendering to avoid unnecessary elements:

```typescript
{dayData?.photo && isExpanded && (
  <ThumbnailView
    filename={dayData.photo}
    onPress={() => setShowFullImage(true)}
    containerStyle={{
      alignSelf: "center",
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    }}
  />
)}
```

### Flattened Render Trees

Component hierarchy is kept shallow where possible to improve rendering performance.

## Loading Optimizations

### Deferred Loading

Non-critical UI elements are loaded with slight delays to prioritize core content:

```typescript
useEffect(() => {
  if (isFirstTime) {
    const timer = setTimeout(() => {
      openSheet("day");
      setNotFirstTime();
    }, 100);
    return () => clearTimeout(timer);
  }
}, [isFirstTime, openSheet, setDate, setNotFirstTime]);
```

### Progressive Enhancement

The app loads core functionality first, then enhances with additional features.

## Performance Monitoring

### Throttled Functions

Heavy operations are throttled to prevent excessive CPU usage:

```typescript
export const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  let lastResult: any;

  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      inThrottle = true;
      lastResult = func.apply(this, args);

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }

    return lastResult;
  };
};
```

### Error Tracking

Sentry integration helps identify performance issues in production:

```typescript
try {
  // Code that might cause performance issues
} catch (error) {
  trackError(`Error in critical path: ${error}`);
}
```

## Memory Management

### Reference Cleanup

UseEffect hooks clean up references and subscriptions:

```typescript
useEffect(() => {
  const subscription = AccessibilityInfo.addEventListener(
    "reduceMotionChanged",
    (reduceMotionEnabled) => {
      setIsReduceMotionEnabled(reduceMotionEnabled);
    },
  );

  return () => {
    subscription.remove();
  };
}, []);
```

### Image Cleanup

Unused images are cleaned up to free storage space:

```typescript
const handlePhotoDelete = useCallback(() => {
  const photoToDelete = localState.photo;
  setLocalState((prev) => ({ ...prev, photo: undefined }));
  setIsDirty(true);

  if (photoToDelete) {
    cleanupImage(photoToDelete);
  }
}, [cleanupImage, localState.photo]);
```

## Platform-Specific Optimizations

### Android Optimizations

Special handling for Android platform quirks:

```typescript
if (Platform.OS === "android") {
  Navbar.setBackgroundColorAsync(
    isOpen ? theme.colors.darker : theme.colors.secondary,
  );
}
```

### iOS Optimizations

Optimizations for iOS-specific behaviors:

```typescript
if (Platform.OS === "ios") {
  // iOS-specific optimizations
}
```

## Future Optimization Opportunities

Areas for potential further optimization:

1. **Virtual List Improvement**: Further tuning of list rendering parameters
2. **Image Lazy Loading Library**: Consider a specialized library for image handling
3. **Worklet Animations**: Use React Native Reanimated for smoother animations
4. **SQLite Storage**: For larger datasets, consider migrating to SQLite
5. **Selective Store Subscriptions**: Further optimize store selectors
6. **Web Worker Support**: For heavy calculations in future features
7. **Binary Storage Format**: Consider binary format instead of JSON for large datasets
