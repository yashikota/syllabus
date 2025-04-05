import argparse

from scraping import Scraping
from util import output_current_year

def main(year: int):
    Scraping(year, "ja").run()
    Scraping(year, "en").run()
    output_current_year(year)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-y", "--year", type=int, help="The year to scrape", required=True
    )
    main(parser.parse_args().year)
