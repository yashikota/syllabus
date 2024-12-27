# syllabus-scraping

## Source

<https://edu-portal.naist.jp/uprx/up/pk/pky001/Pky00101.xhtml?guestlogin=Kmh006>

## Run

```sh
YEAR={year} docker compose up --build
```

## Dev

```sh
uv sync
uv run src/main.py --year {year}
```
