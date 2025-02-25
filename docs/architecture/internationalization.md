# Internationalization (i18n)

## Overview

habby provides full localization support for 8 languages, allowing users to experience the app in their preferred language. This document details the internationalization architecture and implementation.

## Supported Languages

The application supports the following languages:

1. English (en) - Default
2. Spanish (es) - Español
3. French (fr) - Français
4. German (de) - Deutsch
5. Italian (it) - Italiano
6. Portuguese (pt) - Português
7. Dutch (nl) - Nederlands
8. Catalan (ca) - Català

## Implementation Architecture

### Technology Stack

habby uses the following libraries for internationalization:

- **i18next**: Core internationalization framework
- **react-i18next**: React bindings for i18next
- **expo-localization**: Expo module for detecting device locale

### File Structure

The internationalization system is organized as follows:

```
/translations/
  ├── i18n.ts         # i18next configuration
  ├── index.ts        # Export for all translations
  ├── en.ts           # English translations
  ├── es.ts           # Spanish translations
  ├── fr.ts           # French translations
  ├── de.ts           # German translations
  ├── it.ts           # Italian translations
  ├── pt.ts           # Portuguese translations
  ├── nl.ts           # Dutch translations
  └── ca.ts           # Catalan translations
```

### Initialization

The i18n system is initialized in `translations/i18n.ts`:

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { en, es, fr, de, it, pt, nl, ca } from './';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en.translation },
      es: { translation: es.translation },
      fr: { translation: fr.translation },
      de: { translation: de.translation },
      it: { translation: it.translation },
      pt: { translation: pt.translation },
      nl: { translation: nl.translation },
      ca: { translation: ca.translation }
    },
    lng: Localization.locale.split('-')[0],
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export const i18nInitialized = i18n.isInitialized
  ? Promise.resolve()
  : new Promise((resolve) => {
      i18n.on('initialized', resolve);
    });

export default i18n;
```

## Translation Structure

Each language file follows the same structure to ensure consistency:

```typescript
// Example from en.ts
export const en = {
  translation: {
    tooltips: {
      editHabits: "Customize your habits for this month",
      monthHeader: "Set and manage your monthly goals here",
    },
    notifications: {
      // Notification translations
    },
    goals: {
      // Goal-related translations
    },
    stats: {
      // Statistics translations
    },
    onboarding: {
      // Onboarding translations
    },
    settings: {
      // Settings translations
    },
    habits: {
      // Habit-related translations
    },
    common: {
      // Common UI elements
    },
    months: {
      // Month names and formats
    },
    weekDays: {
      // Weekday abbreviations
    },
  },
};
```

## Usage in Components

### Basic Translation

Components use the `useTranslation` hook to access translations:

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <View>
      <Text>{t('common.today')}</Text>
      <Text>{t('common.save')}</Text>
    </View>
  );
};
```

### Formatted Values

For translations with dynamic values, interpolation is used:

```typescript
// Translation string
// "monthYearFormat": "{{month}} {{year}}"

const formattedDate = t('months.monthYearFormat', {
  month: t(`months.${monthName.toLowerCase()}`),
  year: date.getFullYear()
});
```

### Pluralization

For pluralized content, i18next's pluralization features are used:

```typescript
// Translation string
// "daysCount": "{{count}} day",
// "daysCount_plural": "{{count}} days",

const daysText = t('stats.daysCount', { count: daysTracked });
```

## Language Switching

Users can change their preferred language in the Settings screen:

```typescript
const changeLanguage = useCallback(
  async (lang: string) => {
    try {
      await i18n.changeLanguage(lang);
      await AsyncStorage.setItem('user-language', lang);
    } catch (error) {
      trackError(`Error changing language: ${error}`);
    }
  },
  []
);
```

## Date and Time Localization

Dates are formatted according to the selected language:

```typescript
const formatDate = (date: Date, locale: string) => {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
```

For weekday names, translations are used:

```typescript
const weekday = useMemo(() => {
  const weekdayName = day.date
    .toLocaleString("en-US", {
      weekday: "long",
    })
    .toLowerCase();
  return t(`weekDays.short.${weekdayName}`);
}, [day.date, t]);
```

## RTL Support

While the current supported languages are LTR, the app is designed to support RTL languages in the future:

```typescript
// In component styles
<View style={{
  flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row'
}}>
  {/* Component content */}
</View>
```

## Language Detection

On first launch, the app attempts to detect the user's preferred language:

1. Check for previously stored language preference
2. If none, use the device's locale
3. Fall back to English if locale isn't supported

```typescript
const detectLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem('user-language');

    if (savedLanguage && Object.keys(resources).includes(savedLanguage)) {
      return savedLanguage;
    }

    const deviceLocale = Localization.locale.split('-')[0];

    if (Object.keys(resources).includes(deviceLocale)) {
      return deviceLocale;
    }

    return 'en'; // Default fallback
  } catch (error) {
    return 'en';
  }
};
```

## Translation Management

### Adding New Translations

To add translations for a new feature:

1. Add the new keys to all language files
2. Start with English as the base language
3. Provide translations for all supported languages
4. Use descriptive key names for maintainability

### Translation Quality Control

To ensure high-quality translations:

1. Use native speakers for review when possible
2. Maintain consistent terminology across the app
3. Keep context notes for translators
4. Test UI with long text strings to prevent layout issues

## Future Enhancements

Potential improvements to the internationalization system:

1. Add more languages (Japanese, Korean, Chinese, Arabic, etc.)
2. Support for RTL languages (Arabic, Hebrew)
3. Implement a translation management system
4. Add language-specific formatting for numbers and dates
5. Improve handling of plural forms for complex languages
