import { Link, useSearchParams } from "react-router";
import { Card } from "~/components/ui/card";

import type { Course } from "~/types/syllabus";

export function SyllabusCard({ course }: { course: Course }) {
  const [searchParams] = useSearchParams();
  return (
    <Card className="bg-stone-50 hover:bg-stone-200">
      <Link
        to={`/${course.basic_course_information.class_code}${
          searchParams.get("lang") === "en" ? "?lang=en" : ""
        }`}
      >
        <div className="p-4">
          <div>
            {course.basic_course_information.course_type} |{" "}
            {course.basic_course_information.style}
          </div>
          <div className="text-md font-semibold">
            [{course.basic_course_information.class_code}]{" "}
            {course.basic_course_information.class_name}
          </div>
          <div>
            {course.basic_course_information.semester} |{" "}
            {course.basic_course_information.number_of_credits} |{" "}
            {course.overview.supervising_lecturer}
          </div>
        </div>
      </Link>
    </Card>
  );
}
