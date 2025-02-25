# Data Flow and Storage

## Overview

Habby implements an offline-first architecture with local data storage. This document explains how data flows through the application and how it's stored.

## Data Flow

The application follows a unidirectional data flow pattern:

1. **User Interaction**: User interacts with the UI (adds entry, tracks habit, etc.)
2. **Action Dispatch**: Component calls a store action function
3. **State Update**: Store updates its internal state
4. **Re-render**: Components subscribed to that state re-render
5. **Persistence**: Updated state is automatically persisted to AsyncStorage

### Example Data Flow

When a user creates a journal entry:

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌────────────┐
│             │     │              │     │               │     │            │
│  User adds  │     │ Component    │     │ useDayStore   │     │            │
│  journal    │ --> │ calls        │ --> │ updates       │ --> │ Component  │
│  entry      │     │ setDay()     │     │ state         │     │ re-renders │
│             │     │              │     │               │     │            │
└─────────────┘     └──────────────┘     └───────────────┘     └────────────┘
                                               │
                                               │
                                               ▼
                                         ┌────────────┐
                                         │            │
                                         │ AsyncStorage│
                                         │ persists   │
                                         │ data       │
                                         │            │
                                         └────────────┘
```

## Data Storage

### Primary Storage

Habby uses React Native's `AsyncStorage` for persisting data:

- **Day Entries**: Stored in useDayStore
- **Habits**: Stored in useHabitStore
- **Monthly Goals**: Stored in useMonthGoalsStore
- **Settings**: Theme, language, and notification preferences

### Storage Structure

Each store's data is persisted independently:

```typescript
// Example of Zustand persistence with AsyncStorage
export const useDayStore = create<DaysState>()(
  persist(
    (set, get) => ({
      // Store implementation
    }),
    {
      name: "day-storage", // Storage key
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
```

### Image Storage

Photos attached to entries are handled differently:

1. Images are captured or selected using `expo-image-picker`
2. Images are processed with `expo-image-manipulator` (resized, compressed)
3. Images are stored as base64 strings or files in app's document directory
4. Entries store references to these images

```typescript
// From useImageHandler.ts
const takePhoto = useCallback(async () => {
  try {
    // Take photo
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    
    // Process and store image
    if (!result.canceled) {
      const processedImage = await processImage(result.assets[0].uri);
      const storedImage = await storeImage(processedImage, dateString);
      onImageSelected(storedImage.filename);
    }
  } catch (error) {
    trackError(`Error taking photo: ${error}`);
  }
}, [dateString, onImageSelected]);
```

## Data Export and Import

Habby implements data portability with export/import functionality:

### Export Process
1. Data is collected from all stores
2. Images are gathered from storage
3. Everything is packed into a structured ZIP archive
4. Archive is shared via system share sheet

### Import Process
1. User selects a ZIP archive
2. Data structure is validated
3. Images are extracted and stored
4. Store data is populated with imported information

```typescript
// Simplified data export function
export const handleExport = async (
  days: Record<string, DayData>,
  monthlyGoals: Record<string, MonthGoal[]>,
  imageStorage: ReturnType<typeof useImageStorage>,
) => {
  // Create JSON data
  const data = {
    version: EXPORT_VERSION,
    exportDate: new Date().toISOString(),
    days,
    monthlyGoals,
    imageMap,
  };
  
  // Create ZIP file
  const zip = new JSZip();
  zip.file("journal.json", JSON.stringify(data));
  
  // Add images to ZIP
  Object.entries(images).forEach(([path, base64]) => {
    zip.file(path, base64, { base64: true });
  });
  
  // Generate and share ZIP
  const zipContent = await zip.generateAsync({ type: "base64" });
  await Share.share({ url: zipFilePath });
};
```

## Data Windows and Pagination

To optimize performance with large datasets, Habby implements a window-based approach to data loading:

1. Only a limited window of dates is rendered at once
2. As user scrolls, additional data is loaded
3. This prevents loading the entire history at once

```typescript
// From useDateWindows.ts
const handleEndReached = useCallback(() => {
  if (isLoadingRef.current) return;

  isLoadingRef.current = true;

  setTimeout(() => {
    setDateWindow((currentWindow) => {
      const nextWindow = generateNextWindow(currentWindow.endDate);
      // Load next batch of dates
      return {
        startDate: currentWindow.startDate,
        endDate: nextWindow.endDate,
      };
    });
    
    isLoadingRef.current = false;
  }, 100);
}, []);
```

## Error Handling

Data operations include error handling to prevent data loss:

1. Try/catch blocks around storage operations
2. Validation before data import
3. Fallbacks for corrupted data
4. Sentry error tracking for debugging
