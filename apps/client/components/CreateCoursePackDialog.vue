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
      <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">新建课程包</h2>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label
            for="title"
            class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            标题 <span class="text-red-500">*</span>
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="请输入课程包标题"
          />
        </div>

        <div class="mb-4">
          <label
            for="description"
            class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            描述
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="请输入课程包描述"
          ></textarea>
        </div>

        <div class="mb-6">
          <label class="flex items-center">
            <input
              v-model="form.isFree"
              type="checkbox"
              class="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">免费课程包</span>
          </label>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="closeDialog"
            class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="isSubmitting || !form.title.trim()"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ isSubmitting ? "创建中..." : "创建" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

interface Props {
  isOpen: boolean;
}

interface Emits {
  (e: "close"): void;
  (e: "submit", data: { title: string; description?: string; isFree: boolean }): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const isSubmitting = ref(false);
const form = reactive({
  title: "",
  description: "",
  isFree: true,
});

function closeDialog() {
  emit("close");
  resetForm();
}

function resetForm() {
  form.title = "";
  form.description = "";
  form.isFree = true;
}

async function handleSubmit() {
  if (!form.title.trim()) return;

  isSubmitting.value = true;
  try {
    emit("submit", {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      isFree: form.isFree,
    });
    closeDialog();
  } finally {
    isSubmitting.value = false;
  }
}
</script>
