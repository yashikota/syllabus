import requests
from bs4 import BeautifulSoup
from parse import Parser
from session import fetch_sessions
from tqdm import tqdm
from util import normalize, output_json


class Scraping:
    def __init__(self, year: int, lang: str = "ja"):
        self.year = year
        self.lang = lang
        self.result = {}

        # Sessions
        self.sessions = fetch_sessions(lang)
        self.URL = "https://edu-portal.naist.jp/uprx/up/km/kmh006/Kmh00601.xhtml"
        self.headers = {
            "accept": "application/xml",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "cookie": f"HttpOnly; JSESSIONID={self.sessions['cookie']}",
            "faces-request": "partial/ajax",
            "x-requested-with": "XMLHttpRequest",
        }

    def __paginate(self, page_number: int):
        data = {
            "javax.faces.source": "funcForm:table",
            "javax.faces.partial.execute": "funcForm:table",
            "javax.faces.partial.render": "funcForm:table",
            "funcForm:table_pagination": "true",
            "funcForm:table_first": str(page_number * 100),
            "funcForm:table_rows": "100",
            "funcForm:table_encodeFeature": "true",
            "funcForm": "funcForm",
            "rx-token": self.sessions["rx_token"],
            "rx-loginKey": self.sessions["rx_loginkey"],
            "javax.faces.ViewState": self.sessions["view_state"],
        }

        response = requests.post(self.URL, headers=self.headers, data=data)
        if response.status_code != requests.codes.ok:
            raise ValueError(f"Failed to paginate to page {page_number}")

    def __fetch_syllabus(self, index: int):
        source_key = f"funcForm:table:{index}:jugyoKmkName"
        data = {
            "javax.faces.source": source_key,
            "javax.faces.partial.execute": source_key,
            source_key: source_key,
            "funcForm": "funcForm",
            "rx-token": self.sessions["rx_token"],
            "rx-loginKey": self.sessions["rx_loginkey"],
            "funcForm:kaikoNendo_input": self.year,
            "javax.faces.ViewState": self.sessions["view_state"],
        }

        self.response = requests.post(self.URL, headers=self.headers, data=data)
        if self.response.status_code != requests.codes.ok:
            raise ValueError(f"Failed to fetch syllabus from page {index}")

    def __parse(self):
        text = normalize(self.response.text)
        soup = BeautifulSoup(text, "html.parser")
        element = soup.find(id="pkx02301:ch:table")
        self.result.update(Parser().run(element))

    def run(self):
        for i in tqdm(
            range(self.sessions["max_page"]),
            desc=f"{self.year}-{self.lang}",
        ):
            self.__paginate(i // 100)
            self.__fetch_syllabus(i)
            self.__parse()

        output_json(self.result, f"data/{self.year}-{self.lang}.json")
