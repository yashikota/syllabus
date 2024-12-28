import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import type { Course } from "~/types/syllabus";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Card>
      <a href="https://www.naist.jp">
        <CardHeader>
          <CardTitle>{course.basic_course_information.class_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            {course.basic_course_information.class_code}
          </CardDescription>
        </CardContent>
        <CardFooter>hoge</CardFooter>
      </a>
    </Card>
  );
}
