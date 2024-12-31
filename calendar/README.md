# calendar

## Usage

### Required Parameters

```txt
YEAR=2024
LANG=JA
CLASS_CODES=ST4103sp,ST4102au
```

Assemble the URL using these parameters.  

```txt
https://calendar.yashikota.workers.dev/?year={YEAR}&lang={LANG}&class_codes={CLASS_CODES}
```

### Parameters Description

- `year`: Year (e.g., `2024`)
- `lang`: Language setting (`ja` for Japanese, `en` for English)
- `class_codes`: Comma-separated list of class codes

### Import to Google Calendar

Import the generated calendar URL into Google Calendar.  
For detailed instructions, please refer to:  

<https://support.google.com/calendar/answer/37118>

## Dev

```sh
npm i
npm run dev
```
