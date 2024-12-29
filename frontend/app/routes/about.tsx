import type { Route } from "./+types/about";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "About | NAIST Syllabus App" },
    { name: "description", content: "NAIST Syllabus App" },
  ];
}

export default function About() {
  return (
    <main className="m-4">
      <p>NAIST Syllabus App</p>
    </main>
  );
}
