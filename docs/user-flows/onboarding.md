# New User Onboarding Flow

## Overview

The onboarding flow introduces new users to habby's key features and gets them set up with initial preferences. This guided experience helps users understand the app's capabilities and encourages immediate engagement.

## Flow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│ Install App │ ──► │ First Launch│ ──► │ Welcome     │ ──► │ Feature     │
│             │     │             │     │ Screen      │     │ Tour        │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                  │
                                                                  ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│ Main App    │ ◄── │ First Entry │ ◄── │ Notification│ ◄── │ Habit       │
│ Experience  │     │ Creation    │     │ Setup       │     │ Setup       │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

## Detailed Steps

### 1. First Launch Detection

- App checks if this is first launch
- `useOnboardingStore` tracks onboarding status
- If first time, onboarding flow begins
- Existing users bypass onboarding

### 2. Welcome Screen

- Introduces app purpose and philosophy
- "Your Bullet Journal" headline
- Brief description of minimalist approach
- "Let's Begin" or "Skip" options

### 3. Feature Tour

The tour consists of several screens highlighting key features:

#### Daily Notes Screen
- Explains the journal entry concept
- Shows character limit benefit
- Emphasizes ease of use

#### Habits Screen
- Introduces the habit tracking feature
- Explains toggle vs. scale options
- Shows habit customization

#### Goals Screen
- Explains monthly goals feature
- Shows goal setting and tracking
- Emphasizes focus and achievement

#### Reminder Screen
- Introduces the notification feature
- Explains daily reminder benefits
- Shows customization options

### 4. Notification Setup

- Asks for notification permission
- Allows setting preferred reminder time
- Option to skip notification setup
- Handles permission rejection gracefully

### 5. Habit Setup

- Guides user to set up first habits
- Pre-populated suggestions
- Limited to 3 habits maximum
- Option to customize or use defaults

### 6. First Entry Creation

- Bottom sheet opens automatically
- Guided prompt for first journal entry
- Example text shown as placeholder
- Encourages habit tracking on first day

### 7. Completion

- Welcome message in main timeline
- Subtle tooltips for key features
- First-time user markers for certain features
- Automatic entry saving

## Implementation Notes

### Key Components Involved

- `Onboarding.tsx`: Main onboarding flow container
- `useOnboardingStore.ts`: Store for onboarding state
- Tour screen components
- Notification permission handling

### Onboarding Store

```typescript
// From useOnboardingStore.ts
interface OnboardingState {
  hasCompletedOnboarding: boolean;
  isFirstTime: boolean;
  setHasCompletedOnboarding: () => void;
  setNotFirstTime: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      isFirstTime: true,

      setHasCompletedOnboarding: () =>
        set({ hasCompletedOnboarding: true }),

      setNotFirstTime: () => set({ isFirstTime: false }),
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
```

### Automatic First Entry

```typescript
// In the app's main component (Index.tsx)
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

### Progressive Tooltips

After onboarding, tooltips guide users through advanced features:

```typescript
useEffect(() => {
  if (
    isOpen &&
    isActionModalFirstOpen &&
    !hasSeenTooltip(TOOLTIP_IDS.EDIT_HABITS)
  ) {
    const timer = setTimeout(() => {
      markActionModalFirstOpen();
      setActiveTooltipId(TOOLTIP_IDS.EDIT_HABITS);
    }, 800);
    return () => clearTimeout(timer);
  }
}, [
  isOpen,
  isActionModalFirstOpen,
  markActionModalFirstOpen,
  setActiveTooltipId,
  hasSeenTooltip,
]);
```

## User Experience Considerations

- **Skip Option**: All screens allow skipping
- **Progress Indicator**: Shows position in onboarding flow
- **Minimal Text**: Brief, focused explanations
- **Visual Examples**: Screenshots or animations
- **Gradual Introduction**: Features introduced one at a time
- **Progressive Disclosure**: Advanced features shown later

## Notifications Integration

The onboarding flow includes notification setup:

- Permission request at appropriate time
- Default reminder time suggestion
- Clear explanation of benefits
- Fallback if permissions denied

## Accessibility

Onboarding is designed for accessibility:

- Works with screen readers
- Supports reduced motion
- Clear, high-contrast text
- Keyboard navigation support

## Post-Onboarding Support

After completing onboarding:

- Tooltips appear for key interactions
- Help information available in settings
- Option to replay onboarding in settings
- First-time markers for complex features

## Measuring Effectiveness

The onboarding flow could track:

- Completion rate
- Time spent in onboarding
- Steps where users drop off
- Features adopted after onboarding
