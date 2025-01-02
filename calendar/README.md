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
https://calendar.yashikota.workers.dev/{YEAR}/{LANG}/{CLASS_CODES}
```

### Parameters Description

- `year`: Year (e.g., `2024`)
- `lang`: Language setting (`ja` for Japanese, `en` for English)
- `class_codes`: Single class code or Comma-separated list of class codes

### Add to Google Calendar

```txt
https://calendar.google.com/calendar/r?cid=webcal://calendar.yashikota.workers.dev/{YEAR}/{LANG}/{CLASS_CODES}
```

## Dev

```sh
npm i
npm run dev
```
