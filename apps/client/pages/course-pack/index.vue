<template>
  <div class="flex w-full flex-col">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-3xl dark:border-gray-600">课程包列表</h2>
      <button
        @click="showCreateDialog = true"
        class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        新建课程包
      </button>
    </div>
    <template v-if="isLoading">
      <Loading></Loading>
    </template>
    <template v-else>
      <div class="h-[79vh] overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div
          class="grid auto-rows-fr grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-0 md:grid-cols-3 lg:grid-cols-4"
        >
          <template v-for="coursePack in coursePackStore.coursePacks">
            <CoursePackCard
              :coursePack="{
                id: coursePack.id,
                title: coursePack.title,
                description: coursePack.description,
                cover: coursePack.cover,
                isFree: coursePack.isFree,
              }"
              @cardClick="handleGoToCoursePack"
            ></CoursePackCard>
          </template>
        </div>
      </div>
    </template>

    <!-- 新建课程包对话框 -->
    <CreateCoursePackDialog
      :is-open="showCreateDialog"
      @close="showCreateDialog = false"
      @submit="handleCreateCoursePack"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { CoursePack } from "~/types";
import CoursePackCard from "~/components/courses/CoursePackCard.vue";
import CreateCoursePackDialog from "~/components/CreateCoursePackDialog.vue";
import { useNavigation } from "~/composables/useNavigation";
import { useCoursePackStore } from "~/store/coursePack";

const coursePackStore = useCoursePackStore();
const { gotoCourseList } = useNavigation();
const isLoading = ref(false);
const showCreateDialog = ref(false);

setup();

async function setup() {
  // 课程包不会更新 所以初始化的时候只拉取一次数据就好了
  if (coursePackStore.coursePacks.length === 0) {
    isLoading.value = true;
    await coursePackStore.setupCoursePacks();
    isLoading.value = false;
  }
}

function handleGoToCoursePack(coursePack: CoursePack) {
  gotoCourseList(coursePack.id);
}

async function handleCreateCoursePack(data: {
  title: string;
  description?: string;
  isFree: boolean;
}) {
  try {
    isLoading.value = true;
    const newCoursePack = await coursePackStore.createNewCoursePack(data);
    // 创建成功后导航到新创建的课程包详情页
    console.log("课程包创建成功！", newCoursePack);
    if (newCoursePack && newCoursePack.id) {
      gotoCourseList(newCoursePack.id);
    }
  } catch (error) {
    console.error("创建课程包失败：", error);
    // 这里可以显示错误消息
  } finally {
    isLoading.value = false;
  }
}
</script>

<style></style>
