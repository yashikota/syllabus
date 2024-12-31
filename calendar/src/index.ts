import { Hono } from "hono";
import { type DateArray, createEvents } from "ics";
import type { Course, Courses } from "../types/syllabus";

const app = new Hono();

type PeriodTime = {
  start: [number, number];
  end: [number, number];
};

type PeriodTimes = {
  [key: number]: PeriodTime;
};

// https://www.naist.jp/campuslife/information/calendar.html
const PERIOD_TIMES: PeriodTimes = {
  1: { start: [9, 20], end: [10, 50] },
  2: { start: [11, 0], end: [12, 30] },
  3: { start: [13, 30], end: [15, 0] },
  4: { start: [15, 10], end: [16, 40] },
  5: { start: [16, 50], end: [18, 20] },
  6: { start: [18, 30], end: [20, 0] },
};

function parseDateTime(
  datetime: string,
  year: string,
): {
  start: DateArray;
  end: DateArray;
} {
  try {
    const [month, day] = datetime.split("[")[0].split("/");
    const period = Number.parseInt(datetime.match(/\[(\d+)\]/)?.[1] ?? "");

    const periodTime = PERIOD_TIMES[period];
    if (!periodTime) {
      throw new Error(`Invalid period: ${period}`);
    }

    return {
      start: [
        Number.parseInt(year),
        Number.parseInt(month),
        Number.parseInt(day),
        periodTime.start[0],
        periodTime.start[1],
      ] as DateArray,
      end: [
        Number.parseInt(year),
        Number.parseInt(month),
        Number.parseInt(day),
        periodTime.end[0],
        periodTime.end[1],
      ] as DateArray,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse datetime: ${datetime}, ${errorMessage}`);
  }
}

function generateICS(syllabus: any[], year: string): Promise<string> {
  try {
    const events = syllabus.flatMap((course) => {
      const class_name = Object.keys(course)[0];
      return course[class_name].map((lesson: any) => {
        const { start, end } = parseDateTime(lesson.datetime, year);
        const syllabusUrl = `https://syllabus.naist.yashikota.com/${course.class_code}`;
        const description = `${lesson.content.replace(/\\n/g, "\n")}\n${syllabusUrl}`;
        const title = `${class_name} | ${lesson.theme.replace(/\\n/g, "")}`;

        return {
          calName: `NAIST Syllabus App ${year}`,
          start,
          end,
          title: title,
          location: lesson.room,
          description,
          status: "CONFIRMED",
          transp: "OPAQUE",
          uid: Math.random().toString(36).substring(6),
        };
      });
    });

    return new Promise((resolve, reject) => {
      createEvents(events, (error, value) => {
        if (error) {
          console.error("ICS generation error:", error);
          reject(new Error(`Failed to create events: ${error.message}`));
        }
        if (!value) {
          reject(new Error("Generated ICS content is empty"));
        }
        resolve(value);
      });
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return Promise.reject(
      new Error(`Failed to generate events: ${errorMessage}`),
    );
  }
}

app.get("/", async (c) => {
  const year = c.req.query("year");
  if (!year) {
    return c.text("year is required", 400);
  }

  const lang = c.req.query("lang");
  if (!lang) {
    return c.text("lang is required", 400);
  }
  if (lang !== "ja" && lang !== "en") {
    return c.text("lang must be 'ja' or 'en'", 400);
  }

  const url = `https://yashikota.github.io/syllabus/${year}-${lang}.json`;
  const syllabuses: Courses = await fetch(url).then((res) => res.json());

  const classCodes = c.req.query("class_codes");
  if (!classCodes) {
    return c.text("class_codes is required", 400);
  }

  const class_code = classCodes.split(",");
  const syllabus = class_code
    .map((code) => {
      const course = syllabuses[code] as Course;
      if (!course) return null;
      return {
        [course.basic_course_information.class_name]: course.schedule,
        class_code: course.basic_course_information.class_code,
      };
    })
    .filter(Boolean);

  try {
    const icsContent = await generateICS(syllabus, year);
    if (!icsContent) {
      throw new Error("Generated ICS content is empty");
    }
    return new Response(icsContent, {
      headers: {
        "Content-Type": "text/calendar",
        "Content-Disposition": "attachment; filename=course-schedule.ics",
      },
    });
  } catch (error) {
    console.error("Error generating calendar:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return c.text(`Error generating calendar: ${errorMessage}`, 500);
  }
});

export default app;
