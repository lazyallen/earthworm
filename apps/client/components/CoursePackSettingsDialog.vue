<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click="closeDialog"
  >
    <div
      class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
      @click.stop
    >
      <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">课程包设置</h2>

      <div class="space-y-4">
        <!-- 课程包信息显示 -->
        <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
          <h3 class="mb-2 font-medium text-gray-900 dark:text-white">{{ coursePackTitle }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ coursePackDescription || "暂无描述" }}
          </p>
        </div>

        <!-- 危险操作区域 -->
        <div
          class="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
        >
          <h4 class="mb-2 font-medium text-red-800 dark:text-red-400">危险操作</h4>
          <p class="mb-4 text-sm text-red-600 dark:text-red-400">
            删除课程包将永久删除该课程包及其包含的所有课程。此操作无法撤销。
          </p>

          <button
            @click="confirmDelete"
            :disabled="isDeleting"
            class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ isDeleting ? "删除中..." : "删除课程包" }}
          </button>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="mt-6 flex justify-end space-x-3">
        <button
          @click="closeDialog"
          class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          取消
        </button>
      </div>
    </div>
  </div>

  <!-- 确认删除对话框 -->
  <div
    v-if="showDeleteConfirm"
    class="z-60 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
      <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">确认删除</h3>
      <p class="mb-6 text-sm text-gray-600 dark:text-gray-400">
        您确定要删除课程包"{{ coursePackTitle }}"吗？此操作无法撤销。
      </p>

      <div class="flex justify-end space-x-3">
        <button
          @click="showDeleteConfirm = false"
          class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          取消
        </button>
        <button
          @click="handleDelete"
          :disabled="isDeleting"
          class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ isDeleting ? "删除中..." : "确认删除" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  isOpen: boolean;
  coursePackId: string;
  coursePackTitle: string;
  coursePackDescription?: string;
}

interface Emits {
  close: [];
  deleted: [coursePackId: string];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showDeleteConfirm = ref(false);
const isDeleting = ref(false);

function closeDialog() {
  emit("close");
}

function confirmDelete() {
  showDeleteConfirm.value = true;
}

async function handleDelete() {
  try {
    isDeleting.value = true;
    emit("deleted", props.coursePackId);
    // 删除成功后关闭确认对话框，父组件会处理关闭设置对话框
    showDeleteConfirm.value = false;
  } catch (error) {
    console.error("删除课程包失败：", error);
  } finally {
    isDeleting.value = false;
  }
}
</script>

<style scoped>
/* 自定义样式如果需要 */
</style>
