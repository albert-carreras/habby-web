# Daily Check-in User Flow

## Overview

The daily check-in is the most frequent user journey in habby. This flow enables users to record their daily reflections, track habits, and optionally add photos to capture moments.

## Flow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │     │             │
│  Open App   │ ──► │  View Main  │ ──► │ Tap on Day  │ ──► │ Bottom Sheet│ ──► │ Enter Text  │
│             │     │  Timeline   │     │   Entry     │     │   Opens     │     │ Reflection  │
│             │     │             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                                      │
                                                                                      ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │     │             │
│  Timeline   │ ◄── │   Sheet     │ ◄── │  Optionally │ ◄── │ Track Daily │ ◄── │ Optionally  │
│  Updates    │     │   Closes    │     │  Save Photo │     │   Habits    │     │  Add Photo  │
│             │     │             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

## Detailed Steps

### 1. Opening the App

- User launches habby app
- App loads the main timeline view
- Today's date is highlighted or marked as current

### 2. Viewing the Timeline

- User sees chronological list of days
- Days are organized by month
- Previous entries are visible with habit indicators
- Empty slots appear for days without entries

### 3. Accessing Entry Mode

- User taps on a day (typically today)
- If tapping a past day, previous entry is loaded
- If tapping today or empty day, blank entry form appears

### 4. Bottom Sheet Presentation

- Bottom sheet slides up from bottom of screen
- Sheet displays:
  - Date header
  - Text input area
  - Photo attachment options
  - Habit tracking controls
  - Character counter (if applicable)

### 5. Creating Journal Entry

- User types reflection text in the input area
- Text has character limit to encourage concise reflection
- User can see character count/remaining

### 6. Tracking Habits

- Below the text area, configured habits are displayed
- Toggle habits can be marked as done/not done
- Scale habits can be adjusted with slider (0-10)

### 7. Photo Attachment (Optional)

- User can tap camera icon to add photo
- Options appear for:
  - Take new photo
  - Choose from gallery
- Selected photo appears as thumbnail
- Thumbnail can be tapped to view full-screen

### 8. Saving the Entry

- Entry is automatically saved when:
  - User closes the bottom sheet
  - User navigates away
  - User taps outside the sheet
- No explicit "save" button needed

### 9. Confirmation and Updates

- Bottom sheet closes with subtle animation
- Timeline updates to show new entry
- New habit indicators appear
- Photo indicator shows if photo was added

## Implementation Notes

### Key Components Involved

- `index.tsx`: Main timeline screen
- `DayRow.tsx`: Individual day entry row
- `ActionModal.tsx`: Bottom sheet container
- `ActionModalContent.tsx`: Content of the entry sheet
- `useActionModalState.ts`: Hook for managing entry state

### State Management

```typescript
// From useActionModalState.ts
const handleTextChange = useCallback((text: string) => {
  setLocalState((prev) => ({ ...prev, text }));
  setIsDirty(true);
}, []);

const saveChanges = useCallback(async () => {
  if (isOpen !== "habits" && isDirty) {
    const updates: DayData = {
      text: localState.text,
      habits: localState.habits,
      photo: localState.photo === undefined ? null : localState.photo,
    };

    batchUpdateDay(dateString, updates);
    setIsDirty(false);
  }
}, [isOpen, isDirty, localState, dateString, batchUpdateDay]);
```

### UX Considerations

- Bottom sheet is dismissible with:
  - Swipe down
  - Tap outside
  - Close button
- Small haptic feedback when tracking habits
- Visual feedback when entry is saved
- Photos display as thumbnails first to save space
- Keyboard properly adjusts the layout

## Error Handling

- If taking a photo fails, user is notified
- If entry fails to save, retry mechanism activates
- If text exceeds character limit, input is restricted
- Network errors don't affect basic functionality (offline-first)

## Edge Cases

- **Device Rotation**: UI adjusts to orientation changes
- **Low Storage**: Warns if photo storage is limited
- **Offline Mode**: Functions normally without connectivity
- **Past Entries**: Can be edited without restrictions
- **Multiple Devices**: Data may need to be manually exported/imported
