# Journal Entries

## Overview

Journal entries are the core feature of Habby, allowing users to record daily reflections, track habits, and attach photos in a minimalist interface.

## Features

### Short-Form Entries

- Character limit encourages concise reflection
- Focus on key events and thoughts for the day
- Clean, distraction-free input interface

### Photo Attachments

- One photo per day
- Photos are compressed and optimized for storage
- Thumbnail view in timeline with expandable full-screen view

### Chronological Timeline

- Entries organized by month and date
- Reverse chronological order (newest first)
- Visual indicators for photos and tracked habits

## Implementation Details

### Data Structure

Each journal entry is stored as a `DayData` object:

```typescript
interface DayData {
  text: string;         // Journal entry text
  habits: HabitValue[]; // Tracked habits for the day
  photo?: string;       // Optional photo reference
}
```

### Entry Creation Flow

1. User taps on a day in the timeline
2. Bottom sheet opens with date displayed
3. User enters text in the input field
4. User can track habits with toggle/slider
5. User can add a photo via camera or gallery
6. Entry is saved when sheet is closed
7. Timeline updates with new entry

### Photo Management

Photos are handled by the `useImageHandler` and `useImageStorage` hooks:

- `takePhoto()`: Captures a new photo via camera
- `chooseFromGallery()`: Selects a photo from the device
- `handlePhotoDelete()`: Removes a photo from an entry
- Photos are stored with date-based filenames
- Base64 encoding used for import/export

### UI Components

The primary components for journal entries are:

- `DayRow.tsx`: Timeline row for a single day
- `ActionModal.tsx`: Bottom sheet for entry creation/editing
- `ActionModalContent.tsx`: Content area with text input and habits
- `ThumbnailView.tsx`: Photo thumbnail display
- `ImageViewer.tsx`: Full-screen photo viewer

## Usage Example

```typescript
// From ActionModalContent.tsx
<TextArea
  value={localText}
  onChangeText={setLocalText}
  placeholder={t("common.whatHappened")}
  multiline
  autoFocus={false}
  maxLength={CHARACTER_LIMIT}
  // Additional styling props
/>

<Text fontSize="$3" opacity={0.6} alignSelf="flex-end">
  {localText.length}/{CHARACTER_LIMIT}
</Text>

{localPhoto && (
  <ThumbnailView
    filename={localPhoto}
    onPress={onPhotoPress}
    containerStyle={{
      alignSelf: "center",
      marginVertical: theme.spacing.sm,
    }}
  />
)}
```

## Performance Considerations

- Memoization for timeline rows to prevent unnecessary re-renders
- Lazy loading of images
- Windowed approach for date ranges
- Throttled scroll handling

## Future Enhancements

Potential future improvements to the journal entries feature:

1. Rich text formatting options
2. Multiple photos per day
3. Voice notes
4. Tags/categories for entries
5. Search functionality
