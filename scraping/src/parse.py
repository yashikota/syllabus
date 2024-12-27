from util import resolve_lut


class Parser:
    def __init__(self, element):
        self.element = element
        self.result = {
            "basic_course_information": {},
            "registration_category": {},
            "overview": {},
            "textbook_reference": {},
            "other_information": {},
            "url": None,
            "references": None,
            "schedule": [],
        }
        self.current_section = None

    def parse_syllabus(self):
        rows = self.element.find_all("div", class_="rowStyle rowMargin")
        for row in rows:
            section_type = self.__get_section_type(row)
            if section_type:
                self.current_section = section_type
                continue

            if self.current_section == "basic_course_information":
                self.__parse_basic_section(row)
            elif self.current_section == "registration_category":
                self.__parse_registration_category_section(row)
            elif self.current_section == "overview":
                self.__parse_common_section(row, "overview")
            elif self.current_section == "textbook_reference":
                self.__parse_common_section(row, "textbook_reference")
            elif self.current_section == "other":
                self.__parse_common_section(row, "other_information")
            elif self.current_section == "url":
                self.__parse_url_section(row)
            elif self.current_section == "references":
                self.__parse_references_section(row)
            elif self.current_section == "schedule":
                self.__parse_schedule_section(row)

        class_code = self.result["basic_course_information"].get("class_code")
        return {class_code: self.result} if class_code else self.result

    def __get_section_type(self, row):
        header = row.find("div", class_="ui-widget-header")
        if header and header.get("style", "").find("width:100%") != -1:
            return resolve_lut(header.text.strip().replace("■ ", ""))
        return None

    def _get_text_with_linebreaks(self, element):
        for br in element.find_all("br"):
            br.replace_with("\\n")
        return (
            element.get_text(strip=True)
            .replace("\n\n", "\\n")
            .replace("\n                ", "")
            .strip()
        )

    def __extract_text_from_content(self, content_div):
        """Extract text from content div with fr-box fr-view class"""
        fr_box = content_div.find("div", class_="fr-box fr-view")
        return self._get_text_with_linebreaks(fr_box).strip() if fr_box else ""

    def __process_key_value_pair(self, key_div, value_div):
        """Process a single key-value pair and add it to results"""
        key = key_div.text.strip()
        value = self.__extract_text_from_content(value_div)
        lut_key = resolve_lut(key)
        if lut_key:  # Only add if we have a valid key mapping
            self.result["basic_course_information"][lut_key] = value

    def __parse_basic_section(self, row):
        """Parse a row in the basic section of the syllabus"""
        cols = row.find_all("div", class_=["ui-widget-header", "ui-widget-content"])

        if len(cols) < 2:  # Skip rows without proper key-value structure
            return

        # Process first key-value pair
        self.__process_key_value_pair(cols[0], cols[1])
        # Process second key-value pair if it exists
        if len(cols) == 4:
            self.__process_key_value_pair(cols[2], cols[3])

    def __parse_registration_category_section(self, row):
        """Parse education program registration category section"""
        rc = "registration_category"
        programs = ["is", "bs", "ms", "ds", "dgi"]
        cols = row.find_all("div", class_=["ui-widget-header", "ui-widget-content"])
        row_header = cols[0].text.strip()

        # Avoid name conflicts by changing the name
        if row_header == "Registration Category":
            row_header = "Registration Class"

        # Ignore header rows
        if resolve_lut(row_header) == "education_programs":
            return

        if resolve_lut(row_header) in ["registration_class", "core_subjects"]:
            for i, program in enumerate(programs):
                if program not in self.result[rc]:
                    self.result[rc][program] = {}
                value = self.__extract_text_from_content(cols[i + 1])
                self.result[rc][program][resolve_lut(row_header)] = value
        elif resolve_lut(row_header) == "registration_requirements":
            content = self.__extract_text_from_content(cols[1])
            self.result[rc][resolve_lut(row_header)] = content

    def __parse_common_section(self, row, section):
        if section == "references":
            print(row)
        cols = row.find_all("div", class_=["ui-widget-header", "ui-widget-content"])
        if len(cols) < 2:
            return

        header = cols[0].text.strip()
        content = self.__extract_text_from_content(cols[1])
        self.result[section][resolve_lut(header)] = content

    def __parse_url_section(self, row):
        """Parse URL section of the syllabus"""
        content = row.find("div", class_="fr-box fr-view")
        if content:
            # Extract text with linebreaks and split into lines
            text = self._get_text_with_linebreaks(content)
            # Split by \n and filter out empty lines
            urls = [line for line in text.split("\\n") if line.strip()]
            self.result["url"] = urls

    def __parse_references_section(self, row):
        """Parse references section of the syllabus"""
        content = self.__extract_text_from_content(row)
        if content:
            self.result["references"] = content

    def __parse_schedule_section(self, row):
        """Parse schedule section of the syllabus"""
        cols = row.find_all("div", class_=["ui-widget-header", "ui-widget-content"])
        if len(cols) != 5:  # Skip invalid rows
            return

        datetime_room = self.__extract_text_from_content(cols[1])
        datetime = room = ""
        if "\\n" in datetime_room:
            datetime, room = datetime_room.split("\\n", 1)
        else:
            datetime = datetime_room

        schedule_item = {
            "number": cols[0].text.strip(),
            "datetime": datetime.strip(),
            "room": room.strip(),
            "lecturer": self.__extract_text_from_content(cols[2]),
            "theme": self.__extract_text_from_content(cols[3]),
            "content": self.__extract_text_from_content(cols[4]),
        }

        # Check if there's content in fields other than just "number"
        has_other_content = any(
            schedule_item[key].strip()
            for key in ["datetime", "room", "lecturer", "theme", "content"]
        )

        if has_other_content:  # Only add if there's content besides the number
            self.result["schedule"].append(schedule_item)
