<template>
  <div class="flex w-full flex-col">
    <template v-if="isLoading">
      <Loading></Loading>
    </template>

    <template v-else>
      <div class="mb-4 flex items-center justify-between">
        <!-- 面包屑导航 -->
        <div class="flex items-center space-x-2 text-sm">
          <button
            @click="navigateTo('/course-pack')"
            class="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            课程包列表
          </button>
          <span class="text-gray-400 dark:text-gray-500">/</span>
          <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">
            {{ coursePackStore.currentCoursePack?.title }}
          </h2>
        </div>

        <div class="flex items-center gap-3">
          <!-- 布局切换按钮 -->
          <div class="flex rounded-lg border border-gray-300 p-1 dark:border-gray-600">
            <UTooltip text="网格布局">
              <UButton
                icon="i-heroicons-squares-2x2"
                size="xs"
                :color="layoutType === 'grid' ? 'primary' : 'gray'"
                :variant="layoutType === 'grid' ? 'solid' : 'ghost'"
                @click="setLayoutType('grid')"
              />
            </UTooltip>
            <UTooltip text="列表布局">
              <UButton
                icon="i-heroicons-list-bullet"
                size="xs"
                :color="layoutType === 'list' ? 'primary' : 'gray'"
                :variant="layoutType === 'list' ? 'solid' : 'ghost'"
                @click="setLayoutType('list')"
              />
            </UTooltip>
          </div>

          <!-- 课程包设置按钮 -->
          <UTooltip text="课程包设置">
            <UButton
              icon="i-heroicons-cog-6-tooth"
              size="xs"
              color="gray"
              variant="ghost"
              @click="showSettingsDialog = true"
            />
          </UTooltip>

          <button
            @click="showImportDialog = true"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            导入课程
          </button>
        </div>
      </div>
      <div class="h-full scrollbar-hide">
        <!-- 空状态显示 -->
        <div
          v-if="
            !coursePackStore.currentCoursePack?.courses ||
            coursePackStore.currentCoursePack.courses.length === 0
          "
          class="flex h-[79vh] flex-col items-center justify-center text-center"
        >
          <div class="mb-4">
            <svg
              class="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6-2.292m0-14.25v14.25"
              ></path>
            </svg>
          </div>
          <h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            课程包还没有课程
          </h3>
          <p class="mb-6 text-gray-500 dark:text-gray-400">点击"导入课程"按钮来添加第一个课程</p>
          <button
            @click="showImportDialog = true"
            class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg
              class="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            导入课程
          </button>
        </div>

        <!-- 网格布局 -->
        <div
          v-else-if="layoutType === 'grid'"
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

        <!-- 列表布局 -->
        <div
          v-else-if="layoutType === 'list'"
          class="h-[79vh] overflow-y-auto overflow-x-hidden pb-96"
        >
          <div class="space-y-0">
            <template
              v-for="course in coursePackStore.currentCoursePack?.courses"
              :key="course.id"
            >
              <CoursesCourseListItem
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
      </div>

      <!-- 导入对话框 -->
      <CourseImportDialog
        :isOpen="showImportDialog"
        :coursePackId="coursePackId"
        @close="showImportDialog = false"
        @success="handleImportSuccess"
      />

      <!-- 课程包设置对话框 -->
      <CoursePackSettingsDialog
        :isOpen="showSettingsDialog"
        :coursePackId="coursePackId"
        :coursePackTitle="coursePackStore.currentCoursePack?.title || ''"
        :coursePackDescription="coursePackStore.currentCoursePack?.description"
        @close="showSettingsDialog = false"
        @deleted="handleCoursePackDeleted"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from "nuxt/app";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import CoursePackSettingsDialog from "~/components/CoursePackSettingsDialog.vue";
import CourseImportDialog from "~/components/courses/CourseImportDialog.vue";
import { useActiveCourseMap } from "~/composables/courses/activeCourse";
import { useCourseLayout } from "~/composables/courses/courseLayout";
import { useCoursePackStore } from "~/store/coursePack";

const isLoading = ref(false);
const showImportDialog = ref(false);
const showSettingsDialog = ref(false);
const route = useRoute();
const router = useRouter();
const coursePackStore = useCoursePackStore();
const coursePackId = route.params.id as string;
const { updateActiveCourseMap } = useActiveCourseMap();
const { layoutType, setLayoutType, initializeLayout } = useCourseLayout();

setup();

onMounted(() => {
  initializeLayout();
});

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

async function handleCoursePackDeleted(deletedCoursePackId: string) {
  try {
    isLoading.value = true;
    await coursePackStore.removeCoursePackById(deletedCoursePackId);
    showSettingsDialog.value = false;

    // 删除成功后跳转到课程包列表页面
    await navigateTo("/course-pack");
  } catch (error) {
    console.error("删除课程包失败：", error);
    // 这里可以添加错误提示
  } finally {
    isLoading.value = false;
  }
}
</script>

<style></style>
