<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">导入课程</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            课程名称
          </label>
          <input
            v-model="courseName"
            type="text"
            placeholder="请输入课程名称（可选）"
            class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">如果不填写，将使用默认名称</p>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            选择CSV文件
          </label>
          <input
            ref="fileInput"
            type="file"
            accept=".csv"
            @change="handleFileSelect"
            class="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            CSV格式要求：chinese, english, soundmark
          </p>
        </div>

        <div
          v-if="csvPreview.length > 0"
          class="max-h-40 overflow-y-auto"
        >
          <h4 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">预览（前5行）：</h4>
          <div class="space-y-1">
            <div
              v-for="(row, index) in csvPreview.slice(0, 5)"
              :key="index"
              class="rounded bg-gray-50 p-2 text-xs dark:bg-gray-700"
            >
              <div><strong>中文:</strong> {{ row.chinese }}</div>
              <div><strong>英文:</strong> {{ row.english }}</div>
              <div><strong>音标:</strong> {{ row.soundmark }}</div>
            </div>
          </div>
          <p class="mt-2 text-xs text-gray-500">共 {{ csvPreview.length }} 条记录</p>
        </div>

        <div
          v-if="error"
          class="text-sm text-red-600"
        >
          {{ error }}
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="$emit('close')"
            class="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
          >
            取消
          </button>
          <button
            @click="handleImport"
            :disabled="csvPreview.length === 0 || isImporting"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ isImporting ? "导入中..." : "导入" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { importCourseFromCsv } from "~/api/course-pack";

interface CsvRow {
  chinese: string;
  english: string;
  soundmark: string;
}

interface Props {
  isOpen: boolean;
  coursePackId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  success: [];
}>();

const fileInput = ref<HTMLInputElement>();
const csvPreview = ref<CsvRow[]>([]);
const error = ref("");
const isImporting = ref(false);
const courseName = ref("");

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  if (!file.name.endsWith(".csv")) {
    error.value = "请选择CSV文件";
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const text = e.target?.result as string;
      parseCsv(text);
    } catch (err) {
      error.value = "文件读取失败";
    }
  };
  reader.readAsText(file, "UTF-8");
}

function parseCsv(text: string) {
  const lines = text.trim().split("\n");
  const result: CsvRow[] = [];
  error.value = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    try {
      // 简单的CSV解析，支持带引号的字段
      const row = parseCSVLine(line);

      if (row.length !== 3) {
        error.value = `第 ${i + 1} 行格式错误：应该有3列（chinese, english, soundmark）`;
        return;
      }

      const [chinese, english, soundmark] = row;

      if (!chinese || !english || !soundmark) {
        error.value = `第 ${i + 1} 行有空值`;
        return;
      }

      result.push({
        chinese: chinese.trim(),
        english: english.trim(),
        soundmark: soundmark.trim(),
      });
    } catch (err) {
      error.value = `第 ${i + 1} 行解析错误`;
      return;
    }
  }

  if (result.length === 0) {
    error.value = "CSV文件为空或格式不正确";
    return;
  }

  csvPreview.value = result;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

async function handleImport() {
  if (csvPreview.value.length === 0) return;

  isImporting.value = true;
  error.value = "";

  try {
    await importCourseFromCsv(props.coursePackId, csvPreview.value, courseName.value);
    emit("success");
    emit("close");
  } catch (err: any) {
    error.value = err.message || "导入失败，请重试";
  } finally {
    isImporting.value = false;
  }
}
</script>
