import re
import time

from playwright.sync_api import sync_playwright


def fetch_sessions(lang):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        url = "https://edu-portal.naist.jp/uprx/up/pk/pky001/Pky00101.xhtml?guestlogin=Kmh006"
        page.goto(url)

        if lang == "en":
            page.click("id=headerForm:j_idt96")
            time.sleep(1)

        # Select Term
        page.select_option("id=funcForm:kaikoGakki_input", index=0)

        # Get session
        page.click("id=funcForm:search")
        page.wait_for_selector(".ui-datatable-tablewrapper")

        # Get latest viewstate, rx-token, rx-loginkey, and cookie
        viewstate_elements = page.locator('input[name="javax.faces.ViewState"]').all()
        view_state = viewstate_elements[-1].get_attribute("value")

        rx_token_elements = page.query_selector_all('input[name="rx-token"]')
        rx_token = rx_token_elements[-1].get_attribute("value")

        rx_loginkey_elements = page.query_selector_all('input[name="rx-loginKey"]')
        rx_loginkey = rx_loginkey_elements[-1].get_attribute("value")

        cookies = page.context.cookies()
        cookie = [c["value"] for c in cookies if c["name"] == "JSESSIONID"][0]

        max_page_elements = page.query_selector_all(".ui-paginator-current")
        max_page = int(re.search(r"\d+", max_page_elements[-1].inner_text()).group())

        browser.close()
        time.sleep(1)  # Activate session

        return {
            "view_state": view_state,
            "rx_token": rx_token,
            "rx_loginkey": rx_loginkey,
            "cookie": cookie,
            "max_page": max_page,
        }
