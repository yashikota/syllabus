import { useLoaderData } from "react-router";
import { SyllabusCard } from "~/components/design/card";
import type { Courses } from "~/types/syllabus";
import type { Route } from "./+types/home";
import { syllabusAppURL } from "./syllabus";

export function meta(_args: Route.MetaArgs) {
  return [
    {
      title: "NAIST Syllabus App",
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
      name: "theme-color",
      content: "#66c4d0",
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
  if (!syllabuses || Object.keys(syllabuses).length === 0) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <main className="m-4">
      {/* <Search /> */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4">
        {Object.entries(syllabuses).map(([key, course]) => (
          <SyllabusCard key={key} course={course} />
        ))}
      </div>
    </main>
  );
}
