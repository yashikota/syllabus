import { Link, useLoaderData, useLocation } from "react-router";
import type { Courses } from "~/types/syllabus";
import type { Route } from "./+types/syllabus";

import type { MetaFunction } from "react-router";
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
      content: `${syllabusAppURL}${location.pathname}`,
    },
    {
      property: "og:image",
      content: "https://syllabus.naist.yashikota.com/logo.png",
    },
    {
      name: "theme-color",
      content: "#66c4d0",
    },
    {
      name: "robots",
      content: "noindex",
    }
  ];
};

export async function loader() {
  try {
    const url = "https://yashikota.github.io/syllabus/2024-ja.json";
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

// async function copyURL(url: string) {
//   try {
//     await navigator.clipboard.writeText(url);
//     toast("URLをコピーしました");
//   } catch (e) {
//     console.error("Failed to copy URL", e);
//     toast("URLのコピーに失敗しました");
//   }
// }

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

export default function Syllabus({ params }: Route.LoaderArgs) {
  const syllabuses = useLoaderData() as Courses;
  if (!syllabuses || Object.keys(syllabuses).length === 0) {
    return <div className="text-center">Loading...</div>;
  }
  const syllabus = syllabuses[params.syllabusID];
  const location = useLocation();

  return (
    <>
      {/*
       <div className="flex justify-end p-4">
        <Button
          className="bg-emerald-500 hover:bg-emerald-700"
          onClick={() => {
            copyURL(`${origin}${location.pathname}`);
          }}
        >
          <Copy />
          URLをコピー
        </Button>
        <Toaster />
      </div>
      */}

      <main className="mx-auto w-full max-w-screen-lg pb-4 px-4 whitespace-pre-wrap">
        <h1 className="text-2xl font-bold m-4">
          {syllabus.basic_course_information.class_name}
        </h1>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>授業科目基本情報</CardTitle>
          </CardHeader>
          <CardContent>
            {[
              {
                label: "開講年度・学期",
                value: syllabus.basic_course_information.semester,
              },
              {
                label: "授業番号",
                value: syllabus.basic_course_information.subject_number,
              },
              {
                label: "授業コード",
                value: syllabus.basic_course_information.class_code,
              },
              {
                label: "授業名",
                value: syllabus.basic_course_information.class_name,
              },
              {
                label: "科目区分",
                value: syllabus.basic_course_information.course_type,
              },
              {
                label: "教職科目",
                value:
                  syllabus.basic_course_information.teacher_training_course,
              },
              {
                label: "単位数",
                value: syllabus.basic_course_information.number_of_credits,
              },
              {
                label: "選択・必修・自由",
                value: syllabus.basic_course_information.required_elective_etc,
              },
              {
                label: "授業形態",
                value: syllabus.basic_course_information.style,
              },
              {
                label: "主な使用言語",
                value: syllabus.basic_course_information.main_language,
              },
              {
                label: "開講時期",
                value: syllabus.basic_course_information.scheduling,
              },
              {
                label: "履修登録の要否",
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

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>教育プログラム別の履修区分</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap pb-2">
              <div className="w-1/6">
                <div className="py-2 mt-10">履修区分</div>
                <div className="py-2">コア科目</div>
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
              {linkify(
                syllabus.registration_category.registration_requirements,
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>授業科目概要</CardTitle>
          </CardHeader>
          <CardContent>
            {[
              {
                label: "担当責任教員",
                value: syllabus.overview.supervising_lecturer,
              },
              {
                label: "担当教員",
                value: syllabus.overview.lecturer,
              },
              {
                label: "教育目的 / 学修到達目標",
                value: syllabus.overview.learning_objective_goals,
              },
              {
                label: "授業概要 / 指導方針",
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

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>テキスト・参考書</CardTitle>
          </CardHeader>
          <CardContent>
            {[
              {
                label: "テキスト",
                value: syllabus.textbook_reference.textbook,
              },
              {
                label: "参考書",
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

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>その他</CardTitle>
          </CardHeader>
          <CardContent>
            {[
              {
                label: "履修条件",
                value: syllabus.other_information.prerequisites,
              },
              {
                label: "オフィスアワー",
                value: syllabus.other_information.office_hour,
              },
              {
                label: "成績評価の方法と基準",
                value: syllabus.other_information.grading,
              },
              {
                label: "関連科目",
                value: syllabus.other_information.related_subjects,
              },
              {
                label: "関連学位",
                value: syllabus.other_information.related_degrees,
              },
              {
                label: "注意事項",
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

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>授業関連URL</CardTitle>
          </CardHeader>
          <CardContent>{linkify(syllabus.url)}</CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>その他参考資料等</CardTitle>
          </CardHeader>
          <CardContent>{linkify(syllabus.references)}</CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>スケジュール</CardTitle>
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
    </>
  );
}
