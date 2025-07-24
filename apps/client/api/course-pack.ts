import type { CourseApiResponse } from "./course";
import type { CoursePack, CoursePacksItem } from "~/types";
import { getHttp } from "./http";

export type CoursePacksItemApiResponse = {
  id: string;
  title: string;
  isFree: boolean;
  description: string;
  cover: string;
};

export interface CoursePackApiResponse {
  id: string;
  title: string;
  description: string;
  isFree: boolean;
  cover: string;
  courses: CourseApiResponse[];
}

export async function fetchCoursePacks() {
  const http = getHttp();
  return (await http<CoursePacksItemApiResponse[]>("/course-pack", {
    method: "get",
  })) as CoursePacksItem[];
}

export async function fetchCoursePack(coursePackId: string) {
  const http = getHttp();
  return (await http<CoursePackApiResponse>(`/course-pack/${coursePackId}`, {
    method: "get",
  })) as CoursePack;
}

export async function importCourseFromCsv(
  coursePackId: string,
  csvData: Array<{ chinese: string; english: string; soundmark: string }>,
  courseName?: string,
) {
  const http = getHttp();
  return await http(`/course-pack/${coursePackId}/import`, {
    method: "post",
    body: JSON.stringify({ csvData, courseName }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
