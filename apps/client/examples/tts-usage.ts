// TTS使用示例
// 在任何Vue组件中使用TTS功能

import { useTTS } from "~/composables/user/tts";

// 在setup函数中
const { playTTS, streamTTSWithMP3, fallbackTTS, ttsSettings } = useTTS();

// 播放文本的函数（推荐使用，自动选择最佳方法）
async function playText(text: string) {
  try {
    await playTTS(text);
  } catch (error) {
    console.error("播放失败:", error);
    // 处理错误，比如显示提示信息
  }
}

// 直接使用MP3格式（与curl示例相同的API）
async function playTextWithMP3(text: string) {
  try {
    await streamTTSWithMP3(text);
  } catch (error) {
    console.error("MP3播放失败:", error);
    // 备用方案
    fallbackTTS(text);
  }
}

// 使用示例
// playText("Hello, how are you today?");
// playTextWithMP3("This uses the MP3 API directly");

export default {
  playText,
  playTextWithMP3,
};
