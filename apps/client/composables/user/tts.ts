import { ref } from "vue";

import type { EdgeTTSVoice } from "./edgeTTSVoices";
import { edgeTTSService } from "~/services/edgeTTS";
import { allEdgeTTSVoices, getAllVoicesList, getVoiceDisplayName } from "./edgeTTSVoices";

/**
 * TTS引擎配置
 */
export enum TTSEngine {
  EdgeTTS = "edge-tts",
}

export const ttsEngineLabels: { [key in TTSEngine]: string } = {
  [TTSEngine.EdgeTTS]: "Edge TTS",
};

/**
 * TTS语音选项 (包含OpenAI格式和Edge TTS格式)
 */
export enum TTSVoice {
  // OpenAI 风格的语音
  Alloy = "alloy",
  Echo = "echo",
  Fable = "fable",
  Onyx = "onyx",
  Nova = "nova",
  Shimmer = "shimmer",
}

export const ttsVoiceLabels: { [key in TTSVoice]: string } = {
  [TTSVoice.Alloy]: "Alloy",
  [TTSVoice.Echo]: "Echo",
  [TTSVoice.Fable]: "Fable",
  [TTSVoice.Onyx]: "Onyx",
  [TTSVoice.Nova]: "Nova",
  [TTSVoice.Shimmer]: "Shimmer",
};

// 判断是否为OpenAI格式的语音
export function isOpenAIVoice(voice: string): boolean {
  return Object.values(TTSVoice).includes(voice as TTSVoice);
}

// 判断是否为Edge TTS格式的语音
export function isEdgeTTSVoice(voice: string): boolean {
  return voice.includes("-") && voice.includes("Neural");
}

/**
 * TTS设置接口
 */
export interface TTSSettings {
  engine: TTSEngine;
  voice: string; // 改为string以支持Edge TTS的shortName
  speed: number; // 0.25 to 4.0
}

// 存储键名
const TTS_SETTINGS = "ttsSettings";

// TTS设置
const ttsSettings = ref<TTSSettings>({
  engine: TTSEngine.EdgeTTS,
  voice: "en-US-AriaNeural", // 默认使用Edge TTS语音
  speed: 1.0,
});

export function useTTS() {
  loadCache();

  function loadCache() {
    const settings = getTTSSettings();
    if (settings) {
      ttsSettings.value = settings;
    }
  }

  function setTTSSettings(settings: TTSSettings) {
    ttsSettings.value = settings;
    localStorage.setItem(TTS_SETTINGS, JSON.stringify(settings));
  }

  function getTTSSettings(): TTSSettings | null {
    const settings = localStorage.getItem(TTS_SETTINGS);
    return settings ? JSON.parse(settings) : null;
  }

  function getTTSEngineOptions() {
    return Object.entries(ttsEngineLabels).map(([key, value]) => ({
      label: value,
      value: key as TTSEngine,
    }));
  }

  function getTTSVoiceOptions() {
    // 返回分组的语音选项：OpenAI语音 + Edge TTS语音
    const openAIGroup = {
      countryName: "OpenAI 语音",
      countryCode: "OPENAI",
      voices: Object.entries(ttsVoiceLabels).map(([key, value]) => ({
        name: value,
        shortName: key,
        gender: "Female" as const,
        locale: "en-US",
        displayName: value,
      })),
    };

    return [openAIGroup, ...allEdgeTTSVoices];
  }

  // 获取当前语音的显示名称
  function getCurrentVoiceDisplayName(): string {
    if (isOpenAIVoice(ttsSettings.value.voice)) {
      return ttsVoiceLabels[ttsSettings.value.voice as TTSVoice] || ttsSettings.value.voice;
    } else {
      return getVoiceDisplayName(ttsSettings.value.voice);
    }
  }

  function updateTTSSettings(newSettings: Partial<TTSSettings>) {
    const updatedSettings = { ...ttsSettings.value, ...newSettings };

    // 确保速度在有效范围内
    if (updatedSettings.speed < 0.25) {
      updatedSettings.speed = 0.25;
    } else if (updatedSettings.speed > 4.0) {
      updatedSettings.speed = 4.0;
    }

    setTTSSettings(updatedSettings);
  }

  /**
   * 使用统一的TTS API播放语音
   */
  async function playTTS(text: string): Promise<void> {
    if (!text.trim()) return;

    try {
      const response = await fetch("http://localhost:5050/v1/audio/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer your_api_key_here",
        },
        body: JSON.stringify({
          input: text,
          voice: ttsSettings.value.voice, // 可以是OpenAI格式(alloy)或Edge TTS格式(en-US-AriaNeural)
          response_format: "mp3",
          speed: ttsSettings.value.speed,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 直接获取音频数据
      const audioBuffer = await response.arrayBuffer();
      const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // 清理URL对象
      audio.addEventListener("ended", () => {
        URL.revokeObjectURL(audioUrl);
      });

      await audio.play();
    } catch (error) {
      console.error("TTS error:", error);
      fallbackTTS(text);
    }
  }

  /**
   * 使用浏览器内置的Web Speech API作为备用方案
   */
  function fallbackTTS(text: string): void {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = ttsSettings.value.speed;
      utterance.lang = "en-US";

      // 尝试设置语音
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        utterance.voice = voices[0];
      }

      speechSynthesis.speak(utterance);
    } else {
      console.warn("浏览器不支持语音合成");
    }
  }

  /**
   * 测试TTS功能
   */
  async function testTTS(): Promise<void> {
    const testText = "Hello, this is a test of the TTS system.";
    try {
      await playTTS(testText);
      console.log("TTS test successful!");
    } catch (error) {
      console.error("TTS test failed:", error);
      throw new Error(`TTS测试失败: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  return {
    ttsSettings,
    getTTSEngineOptions,
    getTTSVoiceOptions,
    getCurrentVoiceDisplayName,
    updateTTSSettings,
    playTTS,
    fallbackTTS,
    testTTS,
    allEdgeTTSVoices, // 导出语音数据用于UI组件
    isOpenAIVoice,
    isEdgeTTSVoice,
  };
}
