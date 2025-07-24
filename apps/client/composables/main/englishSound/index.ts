import type { PlayOptions } from "./audio";
import { useToolbar } from "~/composables/main/dictation";
import { useGamePlayMode } from "~/composables/user/gamePlayMode";
import { useTTS } from "~/composables/user/tts";
import { useCourseStore } from "~/store/course";

const { playTTS, fallbackTTS } = useTTS();

export function useCurrentStatementEnglishSound() {
  const courseStore = useCourseStore();
  const { toolBarData } = useToolbar();
  const { isDictationMode } = useGamePlayMode();

  return {
    playSound: async (options?: PlayOptions) => {
      const english = courseStore.currentStatement?.english;
      if (!english) return;

      try {
        // 优先使用TTS引擎播放整句
        await playTTS(english);
      } catch (error) {
        console.warn("TTS failed for sentence, using browser speech synthesis:", error);
        // 直接使用浏览器内置语音合成
        fallbackTTS(english);
      }
    },
  };
}

// 朗读每日一句
export async function readOneSentencePerDayAloud(str: string) {
  try {
    // 优先使用TTS引擎
    await playTTS(str);
  } catch (error) {
    console.warn("TTS failed for daily sentence, using browser speech synthesis:", error);
    // 直接使用浏览器内置语音合成
    fallbackTTS(str);
  }
}

export async function playEnglish(english: string) {
  try {
    // 优先使用TTS引擎
    await playTTS(english);
  } catch (error) {
    console.warn("TTS failed for English text, using browser speech synthesis:", error);
    // 直接使用浏览器内置语音合成
    fallbackTTS(english);
  }
}
