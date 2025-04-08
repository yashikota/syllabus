import { Link, useLoaderData, useLocation } from "react-router";
import type { Courses } from "~/types/syllabus";
import type { Route } from "./+types/syllabus";

import { CalendarArrowUp, Share2 } from "lucide-react";
import type { MetaFunction } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export const syllabusAppURL = "https://syllabus.naist.yashikota.com";

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  const syllabusParams = params as Route.LoaderArgs["params"];
  const location = useLocation();

  return [
    {
      title: `${data?.[syllabusParams.syllabusID]?.basic_course_information.class_name} | NAIST Syllabus App`,
    },
    {
      name: "description",
      content: "奈良先端科学技術大学院大学 シラバス検索/閲覧アプリ",
    },
    {
      name: "theme-color",
      content: "#66c4d0",
    },
    {
      name: "robots",
      content: "noindex",
    },
    {
      link: `rel="alternate" hreflang="ja" href="${syllabusAppURL}/${location.pathname}"`,
    },
    {
      link: `rel="alternate" hreflang="en" href="${syllabusAppURL}/${location.pathname}?lang=en"`,
    },
    {
      link: `rel="alternate" hreflang="x-default" href="${syllabusAppURL}/${location.pathname}?lang=en"`,
    },
    {
      property: "og:title",
      content: `${data?.[syllabusParams.syllabusID]?.basic_course_information.class_name} | NAIST Syllabus App`,
    },
    {
      property: "og:description",
      content: "奈良先端科学技術大学院大学 シラバス検索/閲覧アプリ",
    },
    {
      property: "og:site_name",
      content: "NAIST Syllabus App",
    },
    {
      property: "og:url",
      content: `${syllabusAppURL}/${location.pathname}`,
    },
    {
      property: "og:image",
      content: "https://syllabus.naist.yashikota.com/logo.png",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "twitter:card",
      content: "summary",
    },
  ];
};

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const lang = url.searchParams.get("lang") || "ja";

  const yearResponse = await fetch(
    "https://yashikota.github.io/syllabus/year.json",
  );
  const yearData = await yearResponse.json();
  const year = url.searchParams.get("year") || yearData.current_year;

  try {
    const url = `https://yashikota.github.io/syllabus/${year}-${lang}.json`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch");
    }
    return (await res.json()) as Courses;
  } catch (e) {
    console.error("Failed to fetch", e);
    return {};
  }
}

function linkify(text: string | string[] | null) {
  if (!text) {
    return null;
  }
  const textContent = Array.isArray(text) ? text.join("\n") : text;
  const processedText = textContent.replace(/\\n/g, "\n");

  const urlRegex = /(https?:\/\/[^\s)]+)/g;

  const processText = processedText.split(urlRegex).map((part, _) => {
    if (part.match(urlRegex)) {
      return (
        <Link
          to={part}
          className="text-blue-500 underline"
          target="_blank"
          rel="noreferrer"
        >
          {part}
        </Link>
      );
    }
    return part;
  });
  return processText;
}

export default async function Syllabus({ params }: Route.LoaderArgs) {
  const syllabuses = useLoaderData() as Courses;
  if (!syllabuses || Object.keys(syllabuses).length === 0) {
    return <div className="text-center">Loading...</div>;
  }
  const syllabus = syllabuses[params.syllabusID];
  const lang = new URLSearchParams(useLocation().search).get("lang") || "ja";
  const yearResponse = await fetch(
    "https://yashikota.github.io/syllabus/year.json",
  );
  const yearData = await yearResponse.json();
  const year = new URLSearchParams(useLocation().search).get("year") || yearData.current_year;

  return (
    <main className="mx-auto w-full max-w-screen-lg pb-4 px-4 whitespace-pre-wrap">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold m-4">
          {syllabus.basic_course_information.class_name}
        </h1>

        <div className="flex justify-end p-4">
          <Button
            size="sm"
            className="bg-emerald-500 hover:bg-emerald-700"
            onClick={async () => {
              if (navigator.share) {
                await navigator.share({
                  title: document.title,
                  text: "NAIST Syllabus App",
                  url:
                    syllabusAppURL +
                    window.location.pathname +
                    window.location.search,
                });
              } else {
                const msg =
                  lang === "ja"
                    ? "このブラウザはシェア機能に対応していません"
                    : "This browser does not support sharing";
                alert(msg);
              }
            }}
          >
            <Share2 />
            {lang === "ja" ? "共有" : "Share"}
          </Button>
        </div>
      </div>

      <Card className="mb-4 bg-stone-50">
        <CardHeader>
          <CardTitle>
            {lang === "ja" ? "授業科目基本情報" : "Basic course information"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {[
            {
              label: lang === "ja" ? "開講年度・学期" : "Semester",
              value: syllabus.basic_course_information.semester,
            },
            {
              label: lang === "ja" ? "授業番号" : "Subject number",
              value: syllabus.basic_course_information.subject_number,
            },
            {
              label: lang === "ja" ? "授業コード" : "Class code",
              value: syllabus.basic_course_information.class_code,
            },
            {
              label: lang === "ja" ? "授業名" : "Class name",
              value: syllabus.basic_course_information.class_name,
            },
            {
              label: lang === "ja" ? "科目区分" : "Course type",
              value: syllabus.basic_course_information.course_type,
            },
            {
              label: lang === "ja" ? "教職科目" : "Teacher training course",
              value: syllabus.basic_course_information.teacher_training_course,
            },
            {
              label: lang === "ja" ? "単位数" : "Number of Credits",
              value: syllabus.basic_course_information.number_of_credits,
            },
            {
              label:
                lang === "ja" ? "選択・必修・自由" : "Required・Elective etc.",
              value: syllabus.basic_course_information.required_elective_etc,
            },
            {
              label: lang === "ja" ? "授業形態" : "Style",
              value: syllabus.basic_course_information.style,
            },
            {
              label: lang === "ja" ? "主な使用言語" : "Main Language",
              value: syllabus.basic_course_information.main_language,
            },
            {
              label: lang === "ja" ? "開講時期" : "Scheduling",
              value: syllabus.basic_course_information.scheduling,
            },
            {
              label: lang === "ja" ? "履修登録の要否" : "Subject Registration",
              value: syllabus.basic_course_information.subject_registration,
            },
          ].map((item, index, array) => (
            <div
              key={item.label}
              className={`flex py-2 ${
                index !== array.length - 1 ? "border-b" : ""
              }`}
            >
              <span className="w-2/5 font-right mr-2">{item.label}</span>
              <span className="w-3/5">{item.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-4 bg-stone-50">
        <CardHeader>
          <CardTitle>
            {lang === "ja"
              ? "教育プログラム別の履修区分"
              : "Registration Category"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap pb-2">
            <div className="w-1/6">
              <div className="py-2">
                {lang === "ja" ? "プログラム名" : "Education Programs"}
              </div>
              <div className="py-2">
                {lang === "ja" ? "履修区分" : "Registration Category"}
              </div>
              <div className="py-2">
                {lang === "ja" ? "コア科目" : "Core Subjects"}
              </div>
            </div>
            {Object.entries(syllabus.registration_category).map(
              ([key, value]) =>
                key !== "registration_requirements" && (
                  <div key={key} className="w-1/6">
                    <h3 className="text-lg font-bold py-2">
                      {key.toUpperCase()}
                    </h3>
                    <div className="py-2">{value.registration_class}</div>
                    <div className="py-2">{value.core_subjects}</div>
                  </div>
                ),
            )}
          </div>
          <div className="py-2 border-t">
            {linkify(syllabus.registration_category.registration_requirements)}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4 bg-stone-50">
        <CardHeader>
          <CardTitle>{lang === "ja" ? "授業科目概要" : "Overview"}</CardTitle>
        </CardHeader>
        <CardContent>
          {[
            {
              label: lang === "ja" ? "担当責任教員" : "Supervising lecturer",
              value: syllabus.overview.supervising_lecturer,
            },
            {
              label: lang === "ja" ? "担当教員" : "Lecturer",
              value: syllabus.overview.lecturer,
            },
            {
              label:
                lang === "ja"
                  ? "教育目的 / 学修到達目標"
                  : "Learning Objectives / Goals",
              value: syllabus.overview.learning_objective_goals,
            },
            {
              label:
                lang === "ja"
                  ? "授業概要 / 指導方針"
                  : "Course Outline / Teaching Method",
              value: syllabus.overview.outline_teaching_method,
            },
          ].map((item, index, array) => (
            <div
              key={item.label}
              className={`flex py-2 ${
                index !== array.length - 1 ? "border-b" : ""
              }`}
            >
              <span className="w-1/3 font-right">{item.label}</span>
              <span className="w-2/3">{linkify(item.value)}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-4 bg-stone-50">
        <CardHeader>
          <CardTitle>
            {lang === "ja" ? "テキスト・参考書" : "Textbook/Reference book"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {[
            {
              label: lang === "ja" ? "テキスト" : "Textbook",
              value: syllabus.textbook_reference.textbook,
            },
            {
              label: lang === "ja" ? "参考書" : "Reference book",
              value: syllabus.textbook_reference.reference_book,
            },
          ].map((item, index, array) => (
            <div
              key={item.label}
              className={`flex py-2 ${
                index !== array.length - 1 ? "border-b" : ""
              }`}
            >
              <span className="w-1/3 font-right">{item.label}</span>
              <span className="w-2/3">{linkify(item.value)}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-4 bg-stone-50">
        <CardHeader>
          <CardTitle>
            {lang === "ja" ? "その他" : "Other information"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {[
            {
              label: lang === "ja" ? "履修条件" : "Prerequisites",
              value: syllabus.other_information.prerequisites,
            },
            {
              label: lang === "ja" ? "オフィスアワー" : "Office hour",
              value: syllabus.other_information.office_hour,
            },
            {
              label: lang === "ja" ? "成績評価の方法と基準" : "Grading",
              value: syllabus.other_information.grading,
            },
            {
              label: lang === "ja" ? "関連科目" : "Related subjects",
              value: syllabus.other_information.related_subjects,
            },
            {
              label: lang === "ja" ? "関連学位" : "Related Degree",
              value: syllabus.other_information.related_degrees,
            },
            {
              label: lang === "ja" ? "注意事項" : "Notice",
              value: syllabus.other_information.notice,
            },
          ].map((item, index, array) => (
            <div
              key={item.label}
              className={`flex py-2 ${
                index !== array.length - 1 ? "border-b" : ""
              }`}
            >
              <span className="w-1/3 font-right">{item.label}</span>
              <span className="w-2/3">{linkify(item.value)}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-4 bg-stone-50">
        <CardHeader>
          <CardTitle>
            {lang === "ja" ? "授業関連URL" : "Lecture related URL"}
          </CardTitle>
        </CardHeader>
        <CardContent>{linkify(syllabus.url)}</CardContent>
      </Card>

      <Card className="mb-4 bg-stone-50">
        <CardHeader>
          <CardTitle>
            {lang === "ja" ? "その他参考資料等" : "References"}
          </CardTitle>
        </CardHeader>
        <CardContent>{linkify(syllabus.references)}</CardContent>
      </Card>

      <Card className="mb-4 bg-stone-50">
        <CardHeader className="flex">
          <div className="flex justify-between items-center w-full">
            <CardTitle>
              {lang === "ja" ? "授業情報" : "Class information"}
            </CardTitle>
            <Link
              to={`https://calendar.google.com/calendar/r?cid=webcal://syllabus.naist.yashikota.com/ics/${year}/${lang}/${syllabus.basic_course_information.class_code}`}
              className="text-sm text-blue-500 flex items-center"
              target="_blank"
              rel="noreferrer"
            >
              <Button size="sm" className="bg-emerald-500 hover:bg-emerald-700">
                <CalendarArrowUp className="mr-1" />
                {lang === "ja"
                  ? "Googleカレンダーに登録する"
                  : "Add to Google Calendar"}
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {syllabus.schedule.map((item, _) => (
            <div key={item.number} className="py-2 border-b">
              <div className="flex flex-col md:flex-row items-start gap-2">
                {/* for mobile layout */}
                <div className="md:w-6 font-bold flex-shrink-0 flex items-center space-x-2">
                  <span>{item.number}</span>
                  <span className="md:hidden">{linkify(item.theme)}</span>
                </div>

                {/* for desktop layout */}
                <div className="flex-1 flex flex-col ml-4">
                  <div className="font-bold hidden md:block">
                    {linkify(item.theme)}
                  </div>
                  <div>{linkify(item.datetime)}</div>
                  <div>{linkify(item.room)}</div>
                  <div>{linkify(item.lecturer)}</div>
                </div>
                <div className="ml-4 md:w-3/5">{linkify(item.content)}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
