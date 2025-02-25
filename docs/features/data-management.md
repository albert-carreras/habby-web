# Data Management

## Overview

Habby prioritizes data ownership and portability with comprehensive import and export functionality. This feature allows users to back up their journal data, migrate between devices, and maintain control of their personal information.

## Features

### Data Export

- Complete export of all journal entries, habits, and goals
- Photos included in export package
- Export as a single ZIP file
- Sharing via system share sheet

### Data Import

- Import from previously exported ZIP files
- Data validation to ensure integrity
- Proper handling of images and attachments
- Merge or replace options

### Data Structure

- JSON format for structured data
- Base64 encoding for images
- Version information for compatibility

## Implementation Details

### Export Process

The export feature is implemented in `dataHandlers.ts`:

```typescript
export const handleExport = async (
  days: Record<string, DayData>,
  monthlyGoals: Record<string, MonthGoal[]>,
  imageStorage: ReturnType<typeof useImageStorage>,
  t: (key: string) => string,
  onProgress?: (progress: number) => void,
): Promise<ExportResult> => {
  try {
    // Create temporary directory
    await ensureTempDirectory();
    
    // Generate export data with images
    const { data, images } = await generateExportData(
      days,
      monthlyGoals,
      imageStorage,
      onProgress,
    );

    // Create ZIP archive
    const zip = new JSZip();
    zip.file("journal.json", JSON.stringify(data, null, 2));

    // Add images to archive
    Object.entries(images).forEach(([path, base64]) => {
      zip.file(path, base64, { base64: true });
    });

    // Generate ZIP content and save
    const zipContent = await zip.generateAsync({ type: "base64" });
    const fileName = `journal_export_${timestamp}.zip`;
    const tempFilePath = `${TEMP_DIRECTORY}${fileName}`;
    await FileSystem.writeAsStringAsync(tempFilePath, zipContent, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Share or save the file
    await Share.share({
      url: tempFilePath,
      title: "Journal Export",
    });
    
    return { success: true };
  } catch (error) {
    // Error handling
  } finally {
    // Cleanup temporary files
    await cleanupTempDirectory();
  }
};
```

### Import Process

The import feature validates and processes incoming data:

```typescript
export const handleImport = async (
  handlers: ImportHandlers,
  imageStorage: ReturnType<typeof useImageStorage>,
  t: (key: string) => string,
): Promise<ExportResult> => {
  try {
    // Select ZIP file using document picker
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/zip",
      copyToCacheDirectory: true,
    });

    // Process the selected file
    const zipContent = await FileSystem.readAsStringAsync(
      result.assets[0].uri,
      {
        encoding: FileSystem.EncodingType.Base64,
      },
    );

    // Extract ZIP contents
    const zip = await JSZip.loadAsync(zipContent, { base64: true });
    const journalFile = zip.file("journal.json");
    const journalContent = await journalFile.async("text");
    
    // Parse and validate JSON data
    const importData = JSON.parse(journalContent);
    const structureValidation = validateImportData(importData);
    const consistencyErrors = validateDataConsistency(importData);
    
    // Confirmation dialog
    return new Promise((resolve) => {
      Alert.alert(t("common.alert"), t("settings.importWarningMessage"), [
        {
          text: t("common.cancel"),
          style: "cancel",
          onPress: () => resolve({ success: false }),
        },
        {
          text: t("common.ok"),
          style: "destructive",
          onPress: async () => {
            try {
              // Process the import
              await processImport(
                importData,
                zip,
                handlers,
                imageStorage,
              );
              resolve({ success: true });
            } catch (error) {
              // Error handling
            }
          },
        },
      ]);
    });
  } catch (error) {
    // Error handling
  }
};
```

### Export Data Structure

The export format uses a structured JSON format:

```typescript
// Export data structure
interface JournalData {
  version: string;             // Export format version
  exportDate: string;          // ISO timestamp
  days: Record<string, DayData>; // All journal entries
  monthlyGoals: Record<string, MonthGoal[]>; // All monthly goals
  imageMap: Record<string, string>; // Map of image filenames to archive paths
}
```

### Data Validation

Imports undergo validation to ensure compatibility and data integrity:

```typescript
export const validateImportData = (data: any): ValidationResult => {
  const errors = [];

  // Check structure
  if (!data || typeof data !== 'object') {
    errors.push('Invalid data format');
    return { valid: false, errors };
  }

  // Validate version
  if (!data.version) {
    errors.push('Missing version information');
  }

  // Validate days
  if (!data.days || typeof data.days !== 'object') {
    errors.push('Missing or invalid days data');
  }

  // Additional validation checks...

  return {
    valid: errors.length === 0,
    errors,
  };
};
```

### Image Handling

Images are managed through specialized functions:

```typescript
async function processImport(
  importData: JournalData,
  zipFile: JSZip,
  handlers: ImportHandlers,
  imageStorage: ReturnType<typeof useImageStorage>,
): Promise<void> {
  const imageMap: Record<string, string> = {};

  // Process each image in the archive
  for (const [oldFilename, archivePath] of Object.entries(importData.imageMap)) {
    try {
      const imageFile = zipFile.file(archivePath);
      if (!imageFile) continue;

      const dateMatch = oldFilename.match(/^\d{4}-\d{2}-\d{2}/);
      if (!dateMatch) continue;

      // Extract and store the image
      const base64 = await imageFile.async("base64");
      const dateKey = dateMatch[0];
      const result = await imageStorage.importImage(base64, dateKey);
      
      if (result.success && result.filename) {
        imageMap[oldFilename] = result.filename;
      }
    } catch (error) {
      console.error(`Failed to import image: ${archivePath}`, error);
    }
  }

  // Update day entries with new image references
  for (const [date, dayData] of Object.entries(importData.days)) {
    const updatedData = { ...dayData };
    if (dayData.photo && imageMap[dayData.photo]) {
      updatedData.photo = imageMap[dayData.photo];
    }
    handlers.setDay(date, updatedData);
  }

  // Process monthly goals
  if (importData.monthlyGoals) {
    Object.entries(importData.monthlyGoals).forEach(([month, goals]) => {
      goals.forEach((goal) => {
        handlers.updateGoal(month, goal.id, goal);
      });
    });
  }
}
```

## User Flow for Data Management

1. User accesses Settings screen
2. User selects "Export Journal Data"
   - System share sheet appears with export file
   - User can save to cloud storage, send via email, etc.
3. User selects "Import Journal Data"
   - Document picker opens to select export file
   - Confirmation dialog warns about potential data replacement
   - Import process begins with progress indication
   - Success/failure notification appears

## Security Considerations

- Exports do not contain sensitive user information
- No cloud storage is used without user consent
- All data remains on device by default
- Encryption could be added in future versions

## Future Enhancements

Potential improvements to data management:

1. Encrypted exports with password protection
2. Selective exports (date ranges, specific content)
3. Cloud backup integration (optional)
4. Automatic scheduled backups
5. Conflict resolution for imports
6. Import from other journal apps
7. Export in different formats (PDF, plain text)
