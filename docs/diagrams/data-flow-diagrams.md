# Data Flow Diagrams

## Journal Entry Data Flow

```mermaid
flowchart TD
    User([User]) -->|Creates entry| UI[Day Entry Sheet]
    UI -->|Calls| SetDay[setDay action]
    SetDay -->|Updates| DayStore[useDayStore]
    DayStore -->|Persists| AsyncStorage[(AsyncStorage)]
    DayStore -->|Triggers| Rerender[UI Re-render]
    Rerender -->|Shows| Timeline[Timeline View]
    User -->|Views| Timeline
    
    subgraph "Image Flow"
        UI -->|Capture photo| ImagePicker[Image Picker]
        ImagePicker -->|Returns URI| ImageProcess[Image Processing]
        ImageProcess -->|Compressed image| ImageStorage[Image Storage]
        ImageStorage -->|Returns filename| SetDay
    end
    
    subgraph "Habit Update Flow"
        UI -->|Track habits| HabitUpdate[handleHabitChange]
        HabitUpdate -->|Updates local state| LocalState[Local Habit State]
        LocalState -->|On save| SetDay
    end
```

## Habit Management Data Flow

```mermaid
flowchart TD
    User([User]) -->|Opens habits sheet| HabitUI[Habit Management UI]
    HabitUI -->|Loads habits| FetchHabits[getMonthHabits]
    FetchHabits -->|Returns| HabitStore[useHabitStore]
    HabitStore -->|Supplies| MonthHabits[Monthly Habit Definitions]
    MonthHabits -->|Displays in| HabitUI
    
    User -->|Modifies habits| HabitUI
    HabitUI -->|Updates local state| LocalState[Local Habit State]
    User -->|Saves changes| SaveHabits[updateMonthHabits]
    LocalState -->|Provides new config| SaveHabits
    SaveHabits -->|Updates| HabitStore
    HabitStore -->|Persists| AsyncStorage[(AsyncStorage)]
    
    subgraph "Habit Type Changes"
        SaveHabits -->|May trigger| DayUpdate[Update Day Habits]
        DayUpdate -->|Updates| DayStore[useDayStore]
        DayStore -->|Persists| AsyncStorage
    end
    
    HabitStore -->|Triggers| Rerender[UI Re-render]
    Rerender -->|Updates| Timeline[Timeline View]
    Rerender -->|Updates| DayEntry[Day Entry Sheet]
```

## Monthly Goals Data Flow

```mermaid
flowchart TD
    User([User]) -->|Taps month header| MonthHeader[Month Header]
    MonthHeader -->|Toggles expansion| ToggleMonth[toggleMonth action]
    ToggleMonth -->|Updates| GoalStore[useMonthGoalsStore]
    GoalStore -->|Returns expanded state| MonthHeader
    
    User -->|Adds goal| AddGoal[addGoal action]
    AddGoal -->|Creates new goal| GoalStore
    
    User -->|Edits goal| UpdateGoal[updateGoal action]
    UpdateGoal -->|Modifies goal| GoalStore
    
    User -->|Completes goal| ToggleGoal[updateGoal with completed=true]
    ToggleGoal -->|Marks complete| GoalStore
    
    User -->|Deletes goal| RemoveGoal[removeGoal action]
    RemoveGoal -->|Removes goal| GoalStore
    
    GoalStore -->|Persists| AsyncStorage[(AsyncStorage)]
    GoalStore -->|Triggers| Rerender[UI Re-render]
    Rerender -->|Updates| MonthHeader
    Rerender -->|Updates| Stats[Statistics View]
```

## Settings and Theme Data Flow

```mermaid
flowchart TD
    User([User]) -->|Changes theme| ThemeUI[Theme Selector]
    ThemeUI -->|Sets theme| SetTheme[setThemeMode action]
    SetTheme -->|Updates| ThemeStore[themeProvider]
    ThemeStore -->|Persists| AsyncStorage[(AsyncStorage)]
    
    ThemeStore -->|Provides theme| AppComponents[All App Components]
    
    User -->|Changes language| LangUI[Language Selector]
    LangUI -->|Sets language| SetLang[i18n.changeLanguage]
    SetLang -->|Updates| I18n[i18n instance]
    SetLang -->|Persists| AsyncStorage
    
    I18n -->|Provides translations| AppComponents
    
    User -->|Sets notification| NotifUI[Notification Settings]
    NotifUI -->|Configures| SetNotif[setNotificationTime]
    SetNotif -->|Updates| NotifStore[useNotificationStore]
    NotifStore -->|Schedules| Notifications[Expo Notifications]
    NotifStore -->|Persists| AsyncStorage
```

## Data Export/Import Flow

```mermaid
flowchart TD
    User([User]) -->|Requests export| ExportUI[Export Button]
    ExportUI -->|Triggers| HandleExport[handleExport function]
    HandleExport -->|Retrieves data| DayStore[useDayStore]
    HandleExport -->|Retrieves data| GoalStore[useMonthGoalsStore]
    HandleExport -->|Retrieves images| ImageStorage[Image Storage]
    
    DayStore -->|Provides entries| CreateExport[Generate Export Data]
    GoalStore -->|Provides goals| CreateExport
    ImageStorage -->|Provides images| CreateExport
    
    CreateExport -->|Creates| ZipFile[ZIP Archive]
    ZipFile -->|Shared via| ShareSheet[System Share Sheet]
    ShareSheet -->|Presented to| User
    
    User -->|Initiates import| ImportUI[Import Button]
    ImportUI -->|Triggers| HandleImport[handleImport function]
    HandleImport -->|Opens| FilePicker[Document Picker]
    FilePicker -->|Returns| ZipImport[ZIP File]
    
    ZipImport -->|Extracted| Validation[Data Validation]
    Validation -->|If valid| ProcessImport[Process Import Data]
    
    ProcessImport -->|Stores images| ImageStorage
    ProcessImport -->|Updates| DayStore
    ProcessImport -->|Updates| GoalStore
    
    DayStore -->|Persists| AsyncStorage[(AsyncStorage)]
    GoalStore -->|Persists| AsyncStorage
    
    DayStore -->|Triggers| Rerender[UI Re-render]
    GoalStore -->|Triggers| Rerender
    Rerender -->|Updates| Timeline[Timeline View]
```

## Timeline Data Loading Flow

```mermaid
flowchart TD
    User([User]) -->|Opens app| App[App Launch]
    App -->|Initializes| DateWindow[useDateWindows]
    DateWindow -->|Creates initial window| Window[Date Window]
    
    Window -->|Used to generate| GenerateDays[generateDaysInWindow]
    DayStore[useDayStore] -->|Provides entries| GenerateDays
    GenerateDays -->|Returns| DaysList[Days List]
    
    DaysList -->|Grouped by| GroupMonth[groupByMonth]
    GroupMonth -->|Returns| Sections[Month Sections]
    Sections -->|Rendered by| SectionList[Timeline SectionList]
    
    User -->|Scrolls down| ScrollEvent[Scroll to End]
    ScrollEvent -->|Triggers| LoadMore[handleEndReached]
    LoadMore -->|Expands| Window
    Window -->|Triggers re-generation| GenerateDays
    
    User -->|Taps today button| JumpToday[scrollToToday]
    JumpToday -->|Calls| JumpDate[jumpToDate]
    JumpDate -->|Updates| Window
    JumpDate -->|Scrolls to| SectionList
```

## Onboarding Flow

```mermaid
flowchart TD
    User([User]) -->|First launch| App[App Launch]
    App -->|Checks| OnboardingStore[useOnboardingStore]
    OnboardingStore -->|If first time| OnboardingUI[Onboarding UI]
    
    OnboardingUI -->|User progresses| TourSteps[Feature Tour Steps]
    TourSteps -->|Completes tour| SetComplete[setHasCompletedOnboarding]
    SetComplete -->|Updates| OnboardingStore
    OnboardingStore -->|Persists| AsyncStorage[(AsyncStorage)]
    
    OnboardingStore -->|When complete| MainApp[Main App Experience]
    MainApp -->|Opens| FirstEntry[First Day Entry]
    FirstEntry -->|Guides| User
    
    OnboardingStore -->|Provides status| Tooltips[Progressive Tooltips]
    Tooltips -->|Guides| User
```

## Notifications Flow

```mermaid
flowchart TD
    User([User]) -->|Sets reminder| NotifUI[Notification Settings]
    NotifUI -->|Configures| SetTime[setReminderTime]
    SetTime -->|Updates| NotifStore[useNotificationStore]
    
    NotifStore -->|Checks| Permissions[Request Permissions]
    Permissions -->|If granted| Schedule[scheduleNotification]
    Schedule -->|Creates| Notification[Daily Reminder]
    
    NotifStore -->|Persists| AsyncStorage[(AsyncStorage)]
    
    Notification -->|At scheduled time| NotifTrigger[Notification Trigger]
    NotifTrigger -->|Alerts| User
    User -->|Taps notification| OpenApp[App Launch]
    OpenApp -->|Opens| DayEntry[Today's Entry Sheet]
```

## State Persistence Flow

```mermaid
flowchart TD
    App[App Launch] -->|Initializes| Stores[Zustand Stores]
    
    Stores -->|Initializes with| PersistMiddleware[Persist Middleware]
    PersistMiddleware -->|Retrieves from| AsyncStorage[(AsyncStorage)]
    AsyncStorage -->|Hydrates| Stores
    
    User([User]) -->|Interacts with app| Actions[Store Actions]
    Actions -->|Update| Stores
    Stores -->|Automatically persist to| AsyncStorage
    
    subgraph "Key Stores"
        DayStore[useDayStore]
        HabitStore[useHabitStore]
        GoalStore[useMonthGoalsStore]
        ThemeStore[themeProvider]
        NotifStore[useNotificationStore]
        OnboardingStore[useOnboardingStore]
    end
    
    Stores -->|Includes| DayStore
    Stores -->|Includes| HabitStore
    Stores -->|Includes| GoalStore
    Stores -->|Includes| ThemeStore
    Stores -->|Includes| NotifStore
    Stores -->|Includes| OnboardingStore
    
    AsyncStorage -->|Contains keys| StorageKeys[Storage Keys]
    StorageKeys -->|Includes| DayKey["day-storage"]
    StorageKeys -->|Includes| HabitKey["habit-storage"]
    StorageKeys -->|Includes| GoalKey["month-goals-storage"]
    StorageKeys -->|Includes| ThemeKey["theme-preference"] 
    StorageKeys -->|Includes| NotifKey["notification-settings"]
    StorageKeys -->|Includes| OnboardingKey["onboarding-storage"]
```
