import { useQueryState } from "nuqs";
import { useMemo } from "react";
import { useLoaderData, useLocation } from "react-router";
import { SyllabusCard } from "~/components/design/card";
import Search from "~/components/design/search";
import type { Courses } from "~/types/syllabus";
import type { Route } from "./+types/home";
import { syllabusAppURL } from "./syllabus";

export function meta(_args: Route.MetaArgs) {
  return [
    {
      title: "NAIST Syllabus App",
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
      link: `rel="alternate" hreflang="ja" href="${syllabusAppURL}"`,
    },
    {
      link: `rel="alternate" hreflang="en" href="${syllabusAppURL}?lang=en"`,
    },
    {
      link: `rel="alternate" hreflang="x-default" href="${syllabusAppURL}?lang=en"`,
    },
    {
      property: "og:title",
      content: "NAIST Syllabus App",
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
      content: syllabusAppURL,
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
}

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const lang = url.searchParams.get("lang") || "ja";
  const year = url.searchParams.get("year") || "2025";
  try {
    const syllabusUrl = `https://yashikota.github.io/syllabus/${year}-${lang}.json`;
    const res = await fetch(syllabusUrl);
    if (!res.ok) {
      throw new Error("Failed to fetch");
    }
    return (await res.json()) as Courses;
  } catch (e) {
    console.error("Failed to fetch", e);
    return {};
  }
}

export default function Home() {
  const lang = new URLSearchParams(useLocation().search).get("lang") || "ja";

  const syllabuses = useLoaderData() as Courses;
  if (!syllabuses || Object.keys(syllabuses).length === 0) {
    return <div className="text-center">Loading...</div>;
  }

  const INITIAL_TARGETS = ["class_name", "lecturer", "class_code_number"];

  const [query, setQuery] = useQueryState("q", {
    defaultValue: "",
    shallow: false,
  });
  const [targets, setTargets] = useQueryState<string[]>("targets", {
    defaultValue: INITIAL_TARGETS,
    parse: (value) => value.split(","),
    serialize: (value) => value.join(","),
    shallow: false,
  });
  const [semester, setSemester] = useQueryState<string[]>("semester", {
    defaultValue: [],
    parse: (value) => value.split(",").filter(Boolean),
    serialize: (value) => value.join(","),
    shallow: false,
  });
  const [courseType, setCourseType] = useQueryState<string[]>("courseType", {
    defaultValue: [],
    parse: (value) => value.split(",").filter(Boolean),
    serialize: (value) => value.join(","),
    shallow: false,
  });
  const [teacherTraining, setTeacherTraining] = useQueryState<string[]>(
    "teacherTraining",
    {
      defaultValue: [],
      parse: (value) => value.split(",").filter(Boolean),
      serialize: (value) => value.join(","),
      shallow: false,
    },
  );
  const [credits, setCredits] = useQueryState<string[]>("credits", {
    defaultValue: [],
    parse: (value) => value.split(",").filter(Boolean),
    serialize: (value) => value.join(","),
    shallow: false,
  });
  const [required, setRequired] = useQueryState<string[]>("required", {
    defaultValue: [],
    parse: (value) => value.split(",").filter(Boolean),
    serialize: (value) => value.join(","),
    shallow: false,
  });
  const [style, setStyle] = useQueryState<string[]>("style", {
    defaultValue: [],
    parse: (value) => value.split(",").filter(Boolean),
    serialize: (value) => value.join(","),
    shallow: false,
  });
  const [language, setLanguage] = useQueryState<string[]>("language", {
    defaultValue: [],
    parse: (value) => value.split(",").filter(Boolean),
    serialize: (value) => value.join(","),
    shallow: false,
  });
  const [scheduling, setScheduling] = useQueryState<string[]>("scheduling", {
    defaultValue: [],
    parse: (value) => value.split(",").filter(Boolean),
    serialize: (value) => value.join(","),
    shallow: false,
  });
  const [registration, setRegistration] = useQueryState<string[]>(
    "registration",
    {
      defaultValue: [],
      parse: (value) => value.split(",").filter(Boolean),
      serialize: (value) => value.join(","),
      shallow: false,
    },
  );

  const filteredSyllabuses = useMemo(() => {
    return Object.entries(syllabuses).filter(([_, course]) => {
      if (query) {
        const matchesQuery = targets.some((target) => {
          switch (target) {
            case "class_name":
              return course.basic_course_information.class_name
                .toLowerCase()
                .includes(query);
            case "lecturer":
              return course.overview.lecturer.toLowerCase().includes(query);
            case "class_code_number":
              return (
                course.basic_course_information.class_code
                  .toLowerCase()
                  .includes(query) ||
                course.basic_course_information.subject_number
                  .toLowerCase()
                  .includes(query)
              );
            default:
              return false;
          }
        });
        if (!matchesQuery) return false;
      }

      if (semester.length > 0) {
        const v = course.basic_course_information.semester;
        const matchesSemester = semester.some((sem) => {
          if (sem === "spring") {
            return v.includes("春") || v.includes("Spring");
          }
          if (sem === "fall") {
            return v.includes("秋") || v.includes("Fall");
          }
          return false;
        });
        if (!matchesSemester) return false;
      }

      if (courseType.length > 0) {
        const v = course.basic_course_information.course_type;
        const matchesCourseType = courseType.some((type) => {
          switch (type) {
            case "general":
              return v.includes("一般") || v.includes("General");
            case "introduction":
              return v.includes("序論") || v.includes("Introduction");
            case "basic":
              return v.includes("基盤") || v.includes("Basic");
            case "specialized":
              return v.includes("専門") || v.includes("Specialized");
            case "pbl":
              return v.includes("PBL") || v.includes("PBL");
            case "research-based":
              return v.includes("研究活動") || v.includes("Research-based");
            case "research-skills":
              return (
                v.includes("研究者の素養") || v.includes("Research Skills")
              );
            case "independent-research":
              return (
                v.includes("自立的な研究能力") ||
                v.includes("Research Abilities")
              );
            default:
              return false;
          }
        });
        if (!matchesCourseType) return false;
      }

      if (teacherTraining.length > 0) {
        const v = course.basic_course_information.teacher_training_course;
        const matchesTraining = teacherTraining.some((training) => {
          switch (training) {
            case "information":
              return v === "情報" || v === "Information";
            case "science":
              return v === "理科" || v === "Science";
            case "none":
              return v === "指定なし" || v === "none";
            default:
              return false;
          }
        });
        if (!matchesTraining) return false;
      }

      if (credits.length > 0) {
        const v = course.basic_course_information.number_of_credits;
        const matchesCredits = credits.some((credit) => {
          return v.includes(credit);
        });
        if (!matchesCredits) return false;
      }

      if (required.length > 0) {
        const v = course.basic_course_information.required_elective_etc;
        const matchesRequired = required.some((req) => {
          switch (req) {
            case "elective":
              return v === "選択" || v === "Elective";
            case "required":
              return v === "必修" || v === "Required";
            case "required-elective":
              return v === "選択必修" || v === "Required-Elective";
            case "free":
              return v === "自由" || v === "Free";
            default:
              return false;
          }
        });
        if (!matchesRequired) return false;
      }

      if (style.length > 0) {
        const v = course.basic_course_information.style;
        const matchesStyle = style.some((s) => {
          switch (s) {
            case "lecture":
              return v === "講義" || v === "Lecture";
            case "seminar":
              return v === "演習" || v === "Seminar";
            case "thesis":
              return v === "論文" || v === "Thesis";
            default:
              return false;
          }
        });
        if (!matchesStyle) return false;
      }

      if (language.length > 0) {
        const v = course.basic_course_information.main_language;
        const matchesLanguage = language.some((lang) => {
          switch (lang) {
            case "ja":
              return v === "日本語" || v === "Japanese";
            case "en":
              return v === "英語" || v === "English";
            case "ja/en":
              return v === "日本語/英語" || v === "Japanese/English";
            default:
              return false;
          }
        });
        if (!matchesLanguage) return false;
      }

      if (scheduling.length > 0) {
        const v = course.basic_course_information.scheduling;
        const matchesScheduling = scheduling.some((schedule) => {
          switch (schedule) {
            case "1":
              return v === "I";
            case "2":
              return v === "II";
            case "3":
              return v === "III";
            case "4":
              return v === "IV";
            case "none":
              return v === "日程の設定なし" || v === "No set of dates";
            case "intensive":
              return v === "集中講義" || v === "Intensive course";
            default:
              return false;
          }
        });
        if (!matchesScheduling) return false;
      }

      if (registration.length > 0) {
        const v = course.basic_course_information.subject_registration;
        const matchesRegistration = registration.some((reg) => {
          switch (reg) {
            case "required":
              return v === "必要" || v === "Required";
            case "not_required":
              return v === "不要" || v === "Not required";
            default:
              return false;
          }
        });
        if (!matchesRegistration) return false;
      }

      return true;
    });
  }, [
    syllabuses,
    query,
    targets,
    semester,
    courseType,
    teacherTraining,
    credits,
    required,
    style,
    language,
    scheduling,
    registration,
  ]);

  return (
    <main className="m-4">
      <Search
        query={query}
        setQuery={setQuery}
        targets={targets}
        setTargets={setTargets}
        semester={semester}
        setSemester={setSemester}
        courseType={courseType}
        setCourseType={setCourseType}
        teacherTraining={teacherTraining}
        setTeacherTraining={setTeacherTraining}
        credits={credits}
        setCredits={setCredits}
        required={required}
        setRequired={setRequired}
        style={style}
        setStyle={setStyle}
        language={language}
        setLanguage={setLanguage}
        scheduling={scheduling}
        setScheduling={setScheduling}
        registration={registration}
        setRegistration={setRegistration}
        INITIAL_TARGETS={INITIAL_TARGETS}
      />
      {filteredSyllabuses.length === 0 ? (
        <div className="text-center text-xl mt-8 text-gray-500">
          {lang === "ja"
            ? "検索結果が見つかりませんでした。"
            : "No results found."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredSyllabuses
            .sort(([_, a], [__, b]) =>
              a.basic_course_information.class_code.localeCompare(
                b.basic_course_information.class_code,
              ),
            )
            .map(([key, course]) => (
              <SyllabusCard key={key} course={course} />
            ))}
        </div>
      )}
    </main>
  );
}
