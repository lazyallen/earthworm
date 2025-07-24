import { readonly, ref } from "vue";

export type LayoutType = "grid" | "list";

const layoutType = ref<LayoutType>("grid");

export function useCourseLayout() {
  const setLayoutType = (type: LayoutType) => {
    layoutType.value = type;
    // 保存到本地存储
    if (process.client) {
      localStorage.setItem("course-layout", type);
    }
  };

  const toggleLayout = () => {
    const newType = layoutType.value === "grid" ? "list" : "grid";
    setLayoutType(newType);
  };

  const initializeLayout = () => {
    if (process.client) {
      const savedLayout = localStorage.getItem("course-layout") as LayoutType;
      if (savedLayout && ["grid", "list"].includes(savedLayout)) {
        layoutType.value = savedLayout;
      }
    }
  };

  return {
    layoutType: readonly(layoutType),
    setLayoutType,
    toggleLayout,
    initializeLayout,
  };
}
