<template>
  <div class="flex w-full flex-col pt-2">
    <template v-if="isLoading">
      <Loading></Loading>
    </template>
    <template v-else>
      <MainTool />
      <MainGame />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { toast } from "vue-sonner";

import { useGameMode } from "~/composables/main/game";
import { useNavigation } from "~/composables/useNavigation";
import { isAuthenticated } from "~/services/auth";
import { useCourseStore } from "~/store/course";
import { useCoursePackStore } from "~/store/coursePack";
import { useMasteredElementsStore } from "~/store/masteredElements";

const isLoading = ref(true);
const route = useRoute();
const coursePackStore = useCoursePackStore();
const courseStore = useCourseStore();
const masteredElementsStore = useMasteredElementsStore();
const { gotoCourseList } = useNavigation();
const { showQuestion } = useGameMode();

showQuestion();

onMounted(async () => {
  try {
    const { coursePackId, id } = route.params;
    console.log("Game page mounting with params:", { coursePackId, id });

    if (isAuthenticated()) {
      await masteredElementsStore.setup();
    }

    console.log("About to setup course...");
    await courseStore.setup(coursePackId as string, id as string);
    console.log("Course setup completed");

    await coursePackStore.setupCoursePack(coursePackId as string);
    console.log("Course pack setup completed");

    console.log("Checking if all mastered:", courseStore.isAllMastered());
    if (courseStore.isAllMastered()) {
      console.log("All mastered, redirecting to course list");
      toast.info("你已经全部都掌握 自动帮你跳转到课程列表啦", {
        duration: 1500,
        onAutoClose: () => {
          gotoCourseList(coursePackId as string);
        },
      });
      return;
    }

    console.log("Setting isLoading to false");
    isLoading.value = false;
    console.log("Game page setup completed successfully");
  } catch (error) {
    console.error("Error setting up game page:", error);
    isLoading.value = false;
    toast.error("加载课程失败，请检查课程是否存在");
  }
});
</script>
