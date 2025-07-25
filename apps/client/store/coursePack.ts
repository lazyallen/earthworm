import { defineStore } from "pinia";
import { ref } from "vue";

import type { CoursePack, CoursePacksItem } from "~/types";
import { fetchCourseHistory } from "~/api/course-history";
import {
  createCoursePack,
  deleteCoursePack,
  fetchCoursePack,
  fetchCoursePacks,
} from "~/api/course-pack";

export const useCoursePackStore = defineStore("course-pack", () => {
  const coursePacks = ref<CoursePacksItem[]>([]);
  const currentCoursePack = ref<CoursePack>();

  async function setupCoursePacks() {
    const res = await fetchCoursePacks();
    coursePacks.value = res;
  }

  async function createNewCoursePack(data: {
    title: string;
    description?: string;
    isFree: boolean;
  }) {
    const newCoursePack = await createCoursePack(data);
    // 重新加载课程包列表
    await setupCoursePacks();
    return newCoursePack;
  }

  async function setupCoursePack(coursePackId: string, forceRefresh = false) {
    if (!forceRefresh && coursePackId === currentCoursePack.value?.id) return;

    const res = await fetchCoursePack(coursePackId);
    currentCoursePack.value = res;
  }

  async function updateCoursesCompleteCount(coursePackId: string) {
    const courseHistory = await fetchCourseHistory(coursePackId);

    const find = (courseId: string) =>
      courseHistory.find((history) => history.courseId === courseId);

    currentCoursePack.value?.courses.forEach((course) => {
      const matchCourseHistory = find(course.id);

      if (matchCourseHistory) {
        course.completionCount = matchCourseHistory.completionCount;
      }
    });
  }

  async function removeCoursePackById(coursePackId: string) {
    await deleteCoursePack(coursePackId);
    // 从列表中移除已删除的课程包
    coursePacks.value = coursePacks.value.filter((pack) => pack.id !== coursePackId);
    // 如果当前课程包被删除，清空当前课程包
    if (currentCoursePack.value?.id === coursePackId) {
      currentCoursePack.value = undefined;
    }
  }

  return {
    setupCoursePack,
    setupCoursePacks,
    createNewCoursePack,
    updateCoursesCompleteCount,
    removeCoursePackById,
    currentCoursePack,
    coursePacks,
  };
});
