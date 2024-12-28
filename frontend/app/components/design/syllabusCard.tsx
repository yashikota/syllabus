import { Link } from "react-router";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import type { Course } from "~/types/syllabus";

export function SyllabusCard({ course }: { course: Course }) {
  return (
    <Card>
      <Link to={`/${course.basic_course_information.class_code}`}>
        <CardHeader>
          <CardDescription>
            {course.basic_course_information.course_type} |{" "}
            {course.basic_course_information.style}
          </CardDescription>
          <CardTitle>
            [{course.basic_course_information.class_code}]{" "}
            {course.basic_course_information.class_name}
          </CardTitle>
          <CardDescription>
            {course.basic_course_information.semester} |{" "}
            {course.basic_course_information.number_of_credits}
          </CardDescription>
        </CardHeader>
        <CardFooter>{course.overview.supervising_lecturer}</CardFooter>
      </Link>
    </Card>
  );
}
