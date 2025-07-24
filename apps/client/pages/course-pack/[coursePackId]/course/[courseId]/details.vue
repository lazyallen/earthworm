<template>
  <div class="flex w-full flex-col">
    <template v-if="isLoading">
      <Loading></Loading>
    </template>

    <template v-else>
      <!-- 顶部导航栏 -->
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <UButton
            icon="i-heroicons-arrow-left"
            variant="ghost"
            color="gray"
            @click="goBack"
          >
            返回课程列表
          </UButton>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ courseDetails?.title }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">课程详情</p>
          </div>
        </div>

        <UButton
          @click="startLearning"
          color="primary"
          size="lg"
        >
          开始学习
        </UButton>
      </div>

      <!-- 课程信息卡片 -->
      <div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <UCard class="col-span-1 md:col-span-2">
          <template #header>
            <h2 class="text-lg font-semibold">课程信息</h2>
          </template>

          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-600 dark:text-gray-300">课程名称</label>
              <p class="mt-1 text-gray-900 dark:text-gray-100">{{ courseDetails?.title }}</p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-600 dark:text-gray-300">课程描述</label>
              <p class="mt-1 text-gray-900 dark:text-gray-100">
                {{ courseDetails?.description || "暂无描述" }}
              </p>
            </div>

            <div v-if="courseDetails?.video">
              <label class="text-sm font-medium text-gray-600 dark:text-gray-300">视频链接</label>
              <a
                :href="courseDetails.video"
                target="_blank"
                class="mt-1 block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
              >
                {{ courseDetails.video }}
              </a>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">学习统计</h2>
          </template>

          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-300">课程顺序</span>
              <span class="font-medium">第 {{ courseDetails?.order }} 课</span>
            </div>

            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-300">句子总数</span>
              <span class="font-medium">{{ courseDetails?.statements?.length || 0 }} 句</span>
            </div>

            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-300">完成次数</span>
              <span class="font-medium text-green-600"
                >{{ courseDetails?.completionCount || 0 }} 次</span
              >
            </div>

            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-300">当前进度</span>
              <span class="font-medium"
                >{{ courseDetails?.statementIndex || 0 }} /
                {{ courseDetails?.statements?.length || 0 }}</span
              >
            </div>

            <div class="mt-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-300">进度</span>
                <span class="font-medium">{{ progressPercent }}%</span>
              </div>
              <div class="mt-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  class="h-2 rounded-full bg-green-500 transition-all duration-300"
                  :style="{ width: `${progressPercent}%` }"
                ></div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- 句子列表 -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">句子列表</h2>
            <div class="flex items-center gap-2">
              <UButton
                :variant="showMasteredOnly ? 'solid' : 'outline'"
                size="sm"
                @click="showMasteredOnly = !showMasteredOnly"
              >
                只显示已掌握
              </UButton>
              <span class="text-sm text-gray-500"> 共 {{ filteredStatements.length }} 句 </span>
            </div>
          </div>
        </template>

        <div class="space-y-2">
          <div
            v-for="statement in filteredStatements"
            :key="statement.id"
            :class="[
              'flex items-center gap-4 rounded-lg border p-4 transition-all duration-200',
              statement.isMastered
                ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800',
            ]"
          >
            <!-- 序号 -->
            <div
              class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium dark:bg-gray-700"
            >
              {{ statement.order }}
            </div>

            <!-- 句子内容 -->
            <div class="flex-1 space-y-1">
              <div class="flex items-center gap-2">
                <p class="font-medium text-gray-900 dark:text-gray-100">
                  {{ statement.english }}
                </p>
                <UButton
                  v-if="statement.soundmark"
                  icon="i-heroicons-speaker-wave"
                  size="xs"
                  variant="ghost"
                  @click="playAudio(statement.english)"
                  :title="statement.soundmark"
                />
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ statement.chinese }}
              </p>
              <p
                v-if="statement.soundmark"
                class="text-xs text-gray-500 dark:text-gray-500"
              >
                {{ statement.soundmark }}
              </p>
            </div>

            <!-- 掌握状态 -->
            <div class="flex items-center">
              <UBadge
                :color="statement.isMastered ? 'green' : 'gray'"
                :variant="statement.isMastered ? 'solid' : 'outline'"
              >
                {{ statement.isMastered ? "已掌握" : "未掌握" }}
              </UBadge>
            </div>
          </div>

          <!-- 空状态 -->
          <div
            v-if="filteredStatements.length === 0"
            class="flex flex-col items-center justify-center py-12 text-gray-500"
          >
            <div class="mb-2 text-4xl">📝</div>
            <p>{{ showMasteredOnly ? "暂无已掌握的句子" : "暂无句子数据" }}</p>
          </div>
        </div>
      </UCard>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import type { Course } from "~/types";
import { fetchCourse } from "~/api/course";
import { useTTS } from "~/composables/user/tts";

const route = useRoute();
const router = useRouter();
const { playTTS, fallbackTTS } = useTTS();

const coursePackId = route.params.coursePackId as string;
const courseId = route.params.courseId as string;

const isLoading = ref(true);
const courseDetails = ref<Course | null>(null);
const showMasteredOnly = ref(false);

// 计算属性
const progressPercent = computed(() => {
  if (!courseDetails.value || !courseDetails.value.statements.length) return 0;
  return Math.round(
    (courseDetails.value.statementIndex / courseDetails.value.statements.length) * 100,
  );
});

const filteredStatements = computed(() => {
  if (!courseDetails.value?.statements) return [];

  if (showMasteredOnly.value) {
    return courseDetails.value.statements.filter((statement) => statement.isMastered);
  }

  return courseDetails.value.statements;
});

// 获取课程详情
async function loadCourseDetails() {
  try {
    isLoading.value = true;
    courseDetails.value = await fetchCourse(coursePackId, courseId);
  } catch (error) {
    console.error("Failed to load course details:", error);
    toast.error("加载课程详情失败");
  } finally {
    isLoading.value = false;
  }
}

// 返回课程列表
function goBack() {
  router.push(`/course-pack/${coursePackId}`);
}

// 开始学习
function startLearning() {
  router.push(`/game/${coursePackId}/${courseId}`);
}

// 播放音频
async function playAudio(text: string) {
  try {
    // 使用项目的 TTS 系统
    await playTTS(text);
  } catch (error) {
    console.warn("TTS failed, using browser speech synthesis:", error);
    // 降级到浏览器内置语音合成
    fallbackTTS(text);
  }
}

// 初始化
loadCourseDetails();
</script>

<style scoped>
/* 自定义样式 */
</style>
