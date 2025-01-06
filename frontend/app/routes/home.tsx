import { useMemo } from "react";
import { useLoaderData } from "react-router";
import { useSearchParams } from "react-router";
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
  const year = url.searchParams.get("year") || "2024";
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
  const syllabuses = useLoaderData() as Courses;
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") || "ja";
  const query = searchParams.get("q")?.toLowerCase() || "";
  const rawTargets = searchParams.get("targets");
  const targets = rawTargets
    ? rawTargets.split(",")
    : ["class_name", "lecturer", "class_code_number"];

  if (!syllabuses || Object.keys(syllabuses).length === 0) {
    return <div className="text-center">Loading...</div>;
  }

  const filteredSyllabuses = useMemo(() => {
    return Object.entries(syllabuses).filter(([_, course]) => {
      if (!query) return true;

      return targets.some((target) => {
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
    });
  }, [syllabuses, query, targets]);

  return (
    <main className="m-4">
      <Search />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredSyllabuses.map(([key, course]) => (
          <SyllabusCard key={key} course={course} />
        ))}
      </div>
    </main>
  );
}
