# Component Reference

## Overview

This document provides detailed reference information for Habby's key components, including their purpose, props, and implementation details. Use this as a guide when modifying existing components or developing new features.

## Core Screen Components

### `app/index.tsx` - Timeline View

The main timeline screen that displays journal entries chronologically by month.

**Key Features:**
- SectionList for month-based grouping
- Lazy loading of entries with windowing
- Sticky month headers
- Day row interactions
- Jump-to-today functionality

**Key Props and State:**
```typescript
// Internal state
const [showScrollButton, setShowScrollButton] = useState(false);
const [expandedPhotoId, setExpandedPhotoId] = useState<string | null>(null);

// Custom hooks
const { dateWindow, handleEndReached, jumpToDate } = useDateWindows();
```

**Important Functions:**
- `handleRowPress`: Opens day entry modal
- `handleEndReachedThrottled`: Loads more entries when scrolling
- `scrollToToday`: Jumps to current date
- `handlePhotoExpand`: Expands/collapses photo view

### `app/stats.tsx` - Statistics View

Displays statistics and analytics about journal entries, habits, and goals.

**Key Features:**
- Monthly statistics overview
- Habit completion charts
- Goal achievement metrics
- Date range selection

### `app/settings.tsx` - Settings View

Handles user preferences, customization, and data management.

**Key Features:**
- Theme selection
- Language preference
- Notification settings
- Data import/export
- App information

## Main Feature Components

### `components/header/MonthHeader.tsx`

Month header with expandable goals section.

**Props:**
```typescript
interface MonthHeaderProps {
  date: Date;
  onHeaderLayoutChange?: () => void;
}
```

**Key Features:**
- Month name and year display
- Expandable goals section
- Goal summary statistics
- Tooltip support

### `components/main/DayRow.tsx`

Individual day entry row in the timeline.

**Props:**
```typescript
interface DayRowProps {
  day: Day;
  onPress?: () => void;
  expandedPhotoId?: string | null;
  onPhotoExpand?: (id: string | null) => void;
}
```

**Key Features:**
- Date display
- Journal entry text
- Habit indicators
- Photo thumbnail (expandable)
- Animation for updates

**Optimizations:**
- Memoization with custom equality check
- Animated highlight for updates
- Lazy loading of images

### `components/sheet/ActionModal.tsx`

Bottom sheet modal for day entries and habit management.

**Key Features:**
- Dynamic content based on mode
- Keyboard handling
- Photo capture/selection
- Habit tracking controls
- Automatic saving
- Accessibility support

### `components/sheet/HabitManagement.tsx`

Interface for configuring monthly habits.

**Key Features:**
- Add/edit/delete habits
- Toggle/scale type selection
- Icon selection for toggle habits
- Limit enforcement (max 3 habits)
- Monthly persistence

### `components/onboarding/Onboarding.tsx`

First-time user experience flow.

**Key Features:**
- Multi-step tour
- Feature introduction
- Notification setup
- Skip functionality
- Progress tracking

## UI Components

### `components/ui/CircleButton.tsx`

Reusable circular button with icon.

**Props:**
```typescript
interface CircleButtonProps {
  icon: string;
  onPress: () => void;
  color?: string;
  iconColor?: string;
  size?: number;
  iconSize?: number;
  disabled?: boolean;
}
```

### `components/ui/ImageViewer.tsx`

Full-screen image viewer with zoom capability.

**Props:**
```typescript
interface ImageViewerProps {
  filename?: string | null;
  visible: boolean;
  onClose: () => void;
}
```

### `components/ui/ThumbnailView.tsx`

Image thumbnail display with touch handling.

**Props:**
```typescript
interface ThumbnailViewProps {
  filename: string;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}
```

### `components/ui/CustomBackdrop.tsx`

Custom backdrop for bottom sheets with tap handling.

**Props:**
```typescript
interface CustomBackdropProps {
  onClose: () => void;
  disabled?: boolean;
}
```

### `components/sheet/ActionSlider.tsx`

Custom slider for habit rating input.

**Props:**
```typescript
interface ActionSliderProps {
  value: number | undefined;
  onChange: (value: number) => void;
  color?: string;
}
```

## Utility Components

### `components/ui/ErrorBoundary.tsx`

Error boundary for capturing and displaying runtime errors.

**Key Features:**
- Error capture and logging
- Fallback UI
- Error reporting to Sentry
- Reset functionality

### `components/ui/StatusBarManager.tsx`

Manages system status bar appearance.

**Key Features:**
- Theme-aware coloring
- Platform-specific implementation
- Adapts to light/dark mode

### `components/ui/Gradient.tsx`

Provides gradient overlays for visual polish.

**Props:**
```typescript
interface GradientOverlayProps {
  position?: "top" | "bottom" | "both";
  height?: number;
  opacity?: number;
}
```

## Compound Components

### `components/sheet/ActionModalContent.tsx`

Content area for day entry bottom sheet.

**Props:**
```typescript
interface ActionModalContentProps {
  localText: string;
  setLocalText: (text: string) => void;
  localHabits: HabitValue[];
  localPhoto?: string;
  handlePhotoDelete: () => void;
  monthHabits: HabitDefinition[];
  currentDate: Date;
  handleHabitChange: (habitId: string, value: number | boolean) => void;
  onPhotoPress: () => void;
  onManagementPress: () => void;
}
```

**Key Features:**
- Text input with character limit
- Habit tracking controls
- Photo thumbnail display
- Habit management access

### `components/sheet/ActionModalHeader.tsx`

Header area for bottom sheets.

**Props:**
```typescript
interface ActionModalHeaderProps {
  isHabitsSheet: boolean;
  currentDate: Date;
  monthName: string;
  isProcessing: boolean;
  takePhoto: () => void;
  chooseFromGallery: () => void;
  handleClose: () => void;
}
```

**Key Features:**
- Date display
- Sheet title
- Photo capture buttons
- Close button
- Loading indicator

## Usage Examples

### Day Row Implementation

```tsx
<DayRow
  day={item}
  onPress={() => handleRowPress(item.date)}
  expandedPhotoId={expandedPhotoId}
  onPhotoExpand={handlePhotoExpand}
/>
```

### Action Modal Usage

```tsx
<ActionModal />
```

### Month Header Usage

```tsx
<MonthHeader
  date={section.monthDate}
  onHeaderLayoutChange={refreshStickyHeader}
/>
```

### Habit Management

```tsx
<HabitManagement />
```

## Component Relationships

The components follow a hierarchical structure:

1. Screen components (`app/*.tsx`) provide top-level structure
2. Feature components manage specific functionality
3. UI components handle reusable visual elements
4. Each component connects to state via Zustand stores
5. Compound components combine multiple elements for complex interfaces

## Styling Approach

Components use Tamagui for styling with theme-aware properties:

```tsx
<XStack
  margin={theme.spacing.md}
  alignItems="center"
  gap={theme.spacing.md}
>
  {/* Component content */}
</XStack>
```

For custom styling, components use:
- Theme-aware colors and spacing
- Responsive sizing
- Platform-specific adaptations
