<template>
  <div class="voice-selector">
    <!-- 国家选择 -->
    <div class="country-selector">
      <label class="label-text">选择国家/地区:</label>
      <select
        v-model="selectedCountryIndex"
        class="select select-bordered select-sm w-full"
        @change="onCountryChange"
      >
        <option value="">请选择国家/地区</option>
        <option
          v-for="(country, index) in voiceGroups"
          :key="country.countryCode"
          :value="index"
        >
          {{ country.countryName }}
        </option>
      </select>
    </div>

    <!-- 语音选择 -->
    <div
      v-if="selectedCountryIndex !== ''"
      class="voice-selector-container mt-4"
    >
      <label class="label-text">选择语音:</label>
      <select
        v-model="selectedVoice"
        class="select select-bordered select-sm w-full"
        @change="onVoiceChange"
      >
        <option
          v-for="voice in availableVoices"
          :key="voice.shortName"
          :value="voice.shortName"
        >
          {{ voice.displayName }}
        </option>
      </select>
    </div>

    <!-- 语音信息显示 -->
    <div
      v-if="selectedVoice"
      class="voice-info mt-4"
    >
      <div class="voice-preview">
        <span class="text-sm text-gray-600"> 当前选择: {{ getCurrentVoiceInfo() }} </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import type { CountryVoices, EdgeTTSVoice } from "~/composables/user/edgeTTSVoices";
import { allEdgeTTSVoices } from "~/composables/user/edgeTTSVoices";
import { useTTS } from "~/composables/user/tts";

// Props
interface Props {
  modelValue: string;
  voiceGroups?: CountryVoices[];
}

const props = withDefaults(defineProps<Props>(), {
  voiceGroups: () => {
    const { getTTSVoiceOptions } = useTTS();
    return getTTSVoiceOptions();
  },
});

// Emits
const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [voice: EdgeTTSVoice | null];
}>();

// State
const selectedCountryIndex = ref<string>("");
const selectedVoice = ref<string>("");

// Computed
const availableVoices = computed(() => {
  if (selectedCountryIndex.value === "") return [];
  const countryIndex = parseInt(selectedCountryIndex.value);
  return props.voiceGroups[countryIndex]?.voices || [];
});

// Methods
function onCountryChange() {
  // 自动选择第一个语音
  if (availableVoices.value.length > 0) {
    selectedVoice.value = availableVoices.value[0].shortName;
    emit("update:modelValue", selectedVoice.value);
    emit("change", availableVoices.value[0]);
  } else {
    selectedVoice.value = "";
    emit("update:modelValue", "");
    emit("change", null);
  }
}

function onVoiceChange() {
  emit("update:modelValue", selectedVoice.value);
  const voice = availableVoices.value.find((v) => v.shortName === selectedVoice.value);
  emit("change", voice || null);
}

function getCurrentVoiceInfo(): string {
  const voice = availableVoices.value.find((v) => v.shortName === selectedVoice.value);
  if (!voice) return "";

  const country = props.voiceGroups[parseInt(selectedCountryIndex.value)];
  return `${country.countryName} - ${voice.displayName}`;
}

// 初始化选择
function initializeSelection() {
  if (props.modelValue) {
    // 查找对应的国家和语音
    for (let i = 0; i < props.voiceGroups.length; i++) {
      const country = props.voiceGroups[i];
      const voice = country.voices.find((v) => v.shortName === props.modelValue);
      if (voice) {
        selectedCountryIndex.value = i.toString();
        selectedVoice.value = props.modelValue;
        break;
      }
    }
  }
}

// Watch props.modelValue changes
watch(
  () => props.modelValue,
  () => {
    if (props.modelValue !== selectedVoice.value) {
      initializeSelection();
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.voice-selector {
  @apply space-y-2;
}

.country-selector,
.voice-selector-container {
  @apply flex flex-col space-y-1;
}

.voice-info {
  @apply rounded-lg border bg-gray-50 p-3 dark:bg-gray-800;
}

.label-text {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300;
}
</style>
