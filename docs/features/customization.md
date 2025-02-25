# Customization and Accessibility

## Overview

Habby offers extensive customization options to enhance user experience and accessibility. This includes theme selection, language preferences, and various settings to make the app more personal and usable.

## Features

### Theming

- Multiple theme options
- System theme integration
- Light and dark mode variants
- Color palette customization

### Localization

- Support for 8 languages:
  - English
  - Spanish (Español)
  - French (Français)
  - German (Deutsch)
  - Italian (Italiano)
  - Portuguese (Português)
  - Dutch (Nederlands)
  - Catalan (Català)
- Complete translation of all app content
- Date and time formatting per locale

### Accessibility Features

- Reduced motion support
- Font scaling compatibility
- High contrast option
- Screen reader compatibility

## Implementation Details

### Theme System

Themes are implemented through the `themeProvider` store:

```typescript
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  
  const isDark = useMemo(() => {
    if (themeMode === "system") {
      return systemColorScheme === "dark";
    }
    return themeMode.startsWith("dark");
  }, [themeMode, systemColorScheme]);
  
  const theme = useMemo(() => {
    // Theme selection logic based on mode
    // Returns appropriate theme object
  }, [themeMode, systemColorScheme]);
  
  // Provider implementation
};
```

Theme definitions include:

- Color palettes
- Typography
- Spacing constants
- Border radius values
- Opacity levels

### Localization System

Language support is implemented using i18next/react-i18next:

```typescript
// i18n configuration
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en, es, fr, de, it, pt, nl, ca } from './translations';

// Configuration and resource loading
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en.translation },
      es: { translation: es.translation },
      fr: { translation: fr.translation },
      // Additional languages
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export const i18nInitialized = i18n.isInitialized
  ? Promise.resolve()
  : new Promise((resolve) => {
      i18n.on('initialized', resolve);
    });
```

Translation usage example:

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text>{t('common.today')}</Text>
      <Text>{t('habits.management.title', { month: 'February' })}</Text>
    </View>
  );
};
```

### Settings UI

The settings screen provides access to all customization options:

- Theme selection with color previews
- Language dropdown
- Reminder time setting
- Data management
- Accessibility toggles

## User Flow for Customization

1. User accesses Settings screen
2. User can select theme preference
   - System (follows device settings)
   - Light mode variants
   - Dark mode variants
3. User can change language
4. User can adjust notification preferences
5. Changes apply immediately

## Accessibility Considerations

The app includes several accessibility features:

```typescript
// Reduced motion detection
useEffect(() => {
  AccessibilityInfo.isReduceMotionEnabled().then((reduceMotionEnabled) => {
    setIsReduceMotionEnabled(reduceMotionEnabled);
  });

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

// Apply appropriate animation settings
const animationConfig = isReduceMotionEnabled
  ? REDUCED_MOTION_CONFIGS
  : DEFAULT_ANIMATION_CONFIGS;
```

## Integration with OS Settings

- Respects system dark/light mode
- Follows system accessibility settings
- Adapts to device language when available

## Future Enhancements

Potential improvements to customization features:

1. Custom color palette editor
2. Additional theme options
3. Font selection
4. Layout customization
5. Support for additional languages
6. Voice control integration
7. Custom gesture controls
8. Widget customization
