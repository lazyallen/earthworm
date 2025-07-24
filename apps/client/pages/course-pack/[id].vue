<template>
  <div class="flex w-full flex-col">
    <template v-if="isLoading">
      <Loading></Loading>
    </template>

    <template v-else>
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-center text-3xl dark:border-gray-600">
          {{ coursePackStore.currentCoursePack?.title }}
        </h2>
        <button
          @click="showImportDialog = true"
          class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          导入课程
        </button>
      </div>
      <div class="h-full scrollbar-hide">
        <div
          class="grid h-[79vh] grid-cols-1 justify-start gap-8 overflow-y-auto overflow-x-hidden pb-96 pl-0 pr-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <template
            v-for="course in coursePackStore.currentCoursePack?.courses"
            :key="course.id"
          >
            <CoursesCourseCard
              :title="course.title"
              :description="course.description"
              :id="course.id"
              :count="course.completionCount"
              :coursePackId="course.coursePackId"
              @click="handleChangeCourse(course.id)"
              @refresh="handleRefresh"
            />
          </template>
        </div>
      </div>

      <!-- 导入对话框 -->
      <CourseImportDialog
        :isOpen="showImportDialog"
        :coursePackId="coursePackId"
        @close="showImportDialog = false"
        @success="handleImportSuccess"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from "nuxt/app";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import CourseImportDialog from "~/components/courses/CourseImportDialog.vue";
import { useActiveCourseMap } from "~/composables/courses/activeCourse";
import { useCoursePackStore } from "~/store/coursePack";

const isLoading = ref(false);
const showImportDialog = ref(false);
const route = useRoute();
const router = useRouter();
const coursePackStore = useCoursePackStore();
const coursePackId = route.params.id as string;
const { updateActiveCourseMap } = useActiveCourseMap();

setup();

async function setup() {
  isLoading.value = true;
  await coursePackStore.setupCoursePack(coursePackId);
  isLoading.value = false;
}

function handleChangeCourse(courseId: string) {
  console.log("Navigating to course:", courseId);
  const targetPath = `/game/${coursePackId}/${courseId}`;
  console.log("Target path:", targetPath);
  updateActiveCourseMap(coursePackId, courseId);

  try {
    // 尝试使用 navigateTo
    navigateTo(targetPath);
    console.log("navigateTo called successfully");
  } catch (error) {
    console.error("navigateTo error:", error);
    // 备选方案：使用 router.push
    try {
      router.push(targetPath);
      console.log("router.push called successfully");
    } catch (routerError) {
      console.error("router.push error:", routerError);
    }
  }
}

function handleImportSuccess() {
  // 导入成功后刷新课程包数据
  console.log("课程导入成功！");
  // 重新加载课程包数据以显示新导入的课程
  coursePackStore.setupCoursePack(coursePackId, true);
}

function handleRefresh() {
  // 课程编辑或删除后刷新课程包数据
  coursePackStore.setupCoursePack(coursePackId, true);
}
</script>

<style></style>
