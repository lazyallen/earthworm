<template>
  <div
    :ref="isActiveCourse ? 'activeCourseRef' : undefined"
    :class="[
      'relative flex w-full cursor-pointer items-center border-b border-gray-200 p-4 transition-all duration-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800',
      {
        'border-l-4 border-l-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30':
          hasFinished,
        'border-l-4 border-l-purple-500 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30':
          isActiveCourse,
      },
    ]"
    @click="handleCardClick"
  >
    <!-- 主要内容区域 -->
    <div class="min-w-0 flex-1">
      <div class="flex items-start justify-between">
        <div class="min-w-0 flex-1">
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">
            {{ title }}
          </h3>
          <p
            class="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400"
            :title="description"
          >
            {{ description }}
          </p>
        </div>

        <!-- 完成状态标记 -->
        <div
          v-if="hasFinished"
          class="ml-4 flex-shrink-0"
        >
          <span
            :class="[
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
              {
                'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300':
                  hasFinished,
                'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300':
                  isActiveCourse,
              },
            ]"
          >
            <UTooltip :text="dataTip"> 完成 {{ count }} 次 </UTooltip>
          </span>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="ml-4 flex flex-shrink-0 items-center gap-1">
      <UTooltip text="课程详情">
        <UButton
          icon="i-heroicons-eye"
          size="xs"
          color="gray"
          variant="ghost"
          @click.stop="handleViewDetails"
        />
      </UTooltip>
      <UTooltip text="编辑课程">
        <UButton
          icon="i-heroicons-pencil"
          size="xs"
          color="blue"
          variant="ghost"
          @click.stop="handleEdit"
        />
      </UTooltip>
      <UTooltip text="导出课程">
        <UButton
          icon="i-heroicons-arrow-down-tray"
          size="xs"
          color="green"
          variant="ghost"
          @click.stop="handleExport"
        />
      </UTooltip>
      <UTooltip text="删除课程">
        <UButton
          icon="i-heroicons-trash"
          size="xs"
          color="red"
          variant="ghost"
          @click.stop="handleDelete"
        />
      </UTooltip>
    </div>
  </div>

  <!-- 编辑对话框 -->
  <UModal v-model="showEditDialog">
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">编辑课程</h3>
      </template>

      <div class="space-y-4">
        <div>
          <label class="mb-2 block text-sm font-medium">课程名称</label>
          <UInput
            v-model="editForm.title"
            placeholder="请输入课程名称"
            :error="!!editErrors.title"
          />
          <p
            v-if="editErrors.title"
            class="mt-1 text-xs text-red-500"
          >
            {{ editErrors.title }}
          </p>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">课程描述</label>
          <UTextarea
            v-model="editForm.description"
            placeholder="请输入课程描述"
            rows="3"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="gray"
            variant="ghost"
            @click="showEditDialog = false"
          >
            取消
          </UButton>
          <UButton
            @click="confirmEdit"
            :loading="isEditing"
          >
            保存
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { navigateTo } from "#app";
import { computed, onMounted, reactive, ref } from "vue";
import { toast } from "vue-sonner";

import { deleteCourse, exportCourse, updateCourse } from "~/api/course";
import { useActiveCourseMap } from "~/composables/courses/activeCourse";

const props = defineProps<{
  title: string;
  id: string;
  count: number | undefined;
  coursePackId: string;
  description: string;
}>();

const emit = defineEmits<{
  (e: "click", courseId: string): void;
  (e: "refresh"): void;
}>();

const { activeCourseMap } = useActiveCourseMap();

const activeCourseRef = ref<HTMLDivElement>();
const hasFinished = computed(() => !!props.count);
const isActiveCourse = computed(() => activeCourseMap.value[props.coursePackId] == props.id);
const dataTip = computed(() => `恭喜您，当前课程已完成 ${props.count} 次 🎉`);

// 编辑相关状态
const showEditDialog = ref(false);
const isEditing = ref(false);
const editForm = reactive({
  title: "",
  description: "",
});
const editErrors = reactive({
  title: "",
});

function handleCardClick() {
  // 触发父组件的点击事件
  console.log("Course list item clicked, courseId:", props.id);
  emit("click", props.id);
}

function handleViewDetails() {
  // 跳转到课程详情页面
  navigateTo(`/course-pack/${props.coursePackId}/course/${props.id}/details`);
}

function handleEdit() {
  editForm.title = props.title;
  editForm.description = props.description;
  editErrors.title = "";
  showEditDialog.value = true;
}

async function confirmEdit() {
  // 验证
  editErrors.title = "";
  if (!editForm.title.trim()) {
    editErrors.title = "课程名称不能为空";
    return;
  }

  isEditing.value = true;
  try {
    await updateCourse(props.coursePackId, props.id, {
      title: editForm.title.trim(),
      description: editForm.description.trim(),
    });

    toast.success("课程更新成功！");
    showEditDialog.value = false;
    emit("refresh");
  } catch (error) {
    console.error("更新课程失败:", error);
    toast.error("更新课程失败，请稍后重试");
  } finally {
    isEditing.value = false;
  }
}

async function handleDelete() {
  // 确认删除
  const confirmed = window.confirm(`确定要删除课程"${props.title}"吗？此操作不可撤销。`);
  if (!confirmed) return;

  try {
    await deleteCourse(props.coursePackId, props.id);
    toast.success("课程删除成功！");
    emit("refresh");
  } catch (error) {
    console.error("删除课程失败:", error);
    toast.error("删除课程失败，请稍后重试");
  }
}

async function handleExport() {
  try {
    toast.info("正在导出课程...");
    const exportData = await exportCourse(props.coursePackId, props.id);

    // 生成CSV格式的内容
    const csvContent = generateCSV(exportData);

    // 创建下载链接
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `${props.title}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("课程导出成功！");
  } catch (error) {
    console.error("导出课程失败:", error);
    toast.error("导出课程失败，请稍后重试");
  }
}

function generateCSV(exportData: any) {
  const headers = ["chinese", "english", "soundmark"];
  const csvRows = [headers.join(",")];

  exportData.statements.forEach((statement: any) => {
    const row = [
      `"${statement.chinese.replace(/"/g, '""')}"`,
      `"${statement.english.replace(/"/g, '""')}"`,
      `"${statement.soundmark.replace(/"/g, '""')}"`,
    ];
    csvRows.push(row.join(","));
  });

  return csvRows.join("\n");
}

onMounted(() => {
  activeCourseRef.value?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});
</script>

<style scoped></style>
