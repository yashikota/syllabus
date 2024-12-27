import json
import os
import unicodedata


def normalize(text: str) -> str:
    t = unicodedata.normalize("NFKC", text)
    return t.replace("<![CDATA[", "").replace("]]>", "")


def output_json(data: dict, filename: str):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)


def resolve_lut(name: str) -> str:
    return REVERSE_LUT.get(name)


LUT = {
    # format key: [ja, en]
    # Basic course information
    "semester": ["開講年度・学期", "Semester"],
    "subject_number": ["授業番号", "Subject number"],
    "class_code": ["授業コード", "Class code"],
    "class_name": ["授業名", "Class name"],
    "course_type": ["科目区分", "Course type"],
    "teacher_training_course": ["教職科目", "Teacher training course"],
    "number_of_credits": ["単位数", "Number of Credits"],
    "required_elective_etc": ["選択・必修・自由", "Required・Elective etc."],
    "style": ["授業形態", "Style"],
    "main_language": ["主な使用言語", "Main Language"],
    "scheduling": ["開講時期", "Scheduling"],
    "subject_registration": ["履修登録の要否", "Subject Registration"],
    #
    # Registration Category
    "education_programs": ["プログラム名", "Education Programs"],
    "registration_class": ["履修区分", "Registration Class"],
    "core_subjects": ["コア科目", "Core Subjects"],
    "registration_requirements": ["履修方法", "Registration requirements"],
    #
    # Overview
    "supervising_lecturer": ["担当責任教員", "Supervising lecturer"],
    "lecturer": ["担当教員", "Lecturer"],
    "learning_objective_goals": [
        "教育目的 / 学修到達目標",
        "Learning Objectives / Goals",
    ],
    "outline_teaching_method": [
        "授業概要 / 指導方針",
        "Course Outline / Teaching Method",
    ],
    #
    # Textbook/Reference book
    "textbook": ["テキスト", "Textbook"],
    "reference_book": ["参考書", "Reference book"],
    #
    # Other information
    "prerequisites": ["履修条件", "Prerequisites"],
    "office_hour": ["オフィスアワー", "Office hour"],
    "grading": ["成績評価の方法と基準", "Grading"],
    "related_subjects": ["関連科目", "Related subjects"],
    "related_degrees": ["関連学位", "Related Degree"],
    "notice": ["注意事項", "Notice"],
    #
    # Lecture related URL
    # References
    #
    # Class information
    "number": ["回数", "Number"],
    "datetime_room": ["日時・場所", "Date [Time] / Room"],
    # "lecturer": ["担当教員", "Lecturer"], // already defined
    "theme": ["テーマ", "Theme"],
    "content": ["内容", "Content"],
    #
    # Section type
    "basic_course_information": ["授業科目基本情報", "Basic course information"],
    "registration_category": ["教育プログラム別の履修区分", "Registration Category"],
    "overview": ["授業科目概要", "Overview"],
    "textbook_reference": ["テキスト・参考書", "Textbook/Reference book"],
    "other": ["その他", "Other information"],
    "url": ["授業関連URL", "Lecture related URL"],
    "references": ["その他参考資料等", "References"],
    "schedule": ["授業情報", "Class information"],
}

REVERSE_LUT = {text: key for key, texts in LUT.items() for text in texts}
