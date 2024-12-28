import { useLoaderData } from "react-router";
import { SyllabusCard } from "~/components/design/syllabusCard";
import type { Courses } from "~/types/syllabus";
import type { Route } from "./+types/home";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "NAIST Syllabus App" },
    { name: "description", content: "NAIST Syllabus App" },
  ];
}

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

export default function Home() {
  const syllabuses = useLoaderData() as Courses;
  if (!syllabuses || Object.keys(syllabuses).length === 0) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <main className="m-4">
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4">
        {Object.entries(syllabuses).map(([key, course]) => (
          <SyllabusCard key={key} course={course} />
        ))}
      </div>
    </main>
  );
}
