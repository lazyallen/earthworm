import { ref } from "vue";

/**
 * @deprecated 此文件已废弃，请使用 ~/composables/user/tts.ts
 *
 * 此文件保留用于向后兼容和数据迁移，但所有新功能应使用TTS系统。
 * 计划在未来版本中移除此文件。
 *
 * Migration: Use useTTS() instead of usePronunciation()
 */

/**
 * 语言配置
 * @deprecated 使用 TTS 系统替代
 */
export enum SupportedLanguage {
  English = "English",
  German = "German",
}

export const languageLabels: { [key in SupportedLanguage]: string } = {
  [SupportedLanguage.English]: "英语",
  [SupportedLanguage.German]: "德语",
};

/**
 * 英语口音配置
 */
export enum EnglishAccent {
  American = "American",
  British = "British",
}

export const englishAccentLabels: { [key in EnglishAccent]: string } = {
  [EnglishAccent.American]: "美音",
  [EnglishAccent.British]: "英音",
};

/**
 * 德语口音配置
 */
export enum GermanAccent {
  Standard = "Standard",
  Austrian = "Austrian",
  Swiss = "Swiss",
}

export const germanAccentLabels: { [key in GermanAccent]: string } = {
  [GermanAccent.Standard]: "标准德语",
  [GermanAccent.Austrian]: "奥地利德语",
  [GermanAccent.Swiss]: "瑞士德语",
};

/**
 * API配置接口
 */
export interface PronunciationAPIConfig {
  name: string;
  url: string;
  description: string;
}

/**
 * 英语API配置
 */
export const englishAPIConfigs: { [key in EnglishAccent]: PronunciationAPIConfig[] } = {
  [EnglishAccent.American]: [
    {
      name: "有道词典",
      url: "https://dict.youdao.com/dictvoice?type=2&audio={word}",
      description: "有道词典美式发音",
    },
    {
      name: "Google Translate",
      url: "https://translate.google.com/translate_tts?ie=UTF-8&tl=en-US&client=tw-ob&q={word}",
      description: "Google翻译美式发音",
    },
  ],
  [EnglishAccent.British]: [
    {
      name: "有道词典",
      url: "https://dict.youdao.com/dictvoice?type=1&audio={word}",
      description: "有道词典英式发音",
    },
    {
      name: "Google Translate",
      url: "https://translate.google.com/translate_tts?ie=UTF-8&tl=en-GB&client=tw-ob&q={word}",
      description: "Google翻译英式发音",
    },
  ],
};

/**
 * 德语API配置
 */
export const germanAPIConfigs: { [key in GermanAccent]: PronunciationAPIConfig[] } = {
  [GermanAccent.Standard]: [
    // TODO: 添加德语TTS服务
  ],
  [GermanAccent.Austrian]: [
    // TODO: 添加奥地利德语TTS服务
  ],
  [GermanAccent.Swiss]: [
    // TODO: 添加瑞士德语TTS服务
  ],
};

/**
 * 声音设置配置
 * @deprecated 使用 TTSSettings 替代
 */
export interface SoundSettings {
  language: SupportedLanguage;
  accent: EnglishAccent | GermanAccent;
  apiConfigIndex: number; // API配置索引
}

// 向后兼容的类型定义
/**
 * @deprecated 使用 TTS 系统替代
 */
export enum PronunciationType {
  American = "American",
  British = "British",
}

export const pronunciationLabels: { [key in PronunciationType]: string } = {
  [PronunciationType.American]: "美音",
  [PronunciationType.British]: "英音",
};

// 存储键名
const PRONUNCIATION_TYPE = "pronunciationType";
const SOUND_SETTINGS = "soundSettings";

// 向后兼容的发音类型
const pronunciation = ref<PronunciationType>(PronunciationType.American);

// 新的声音设置
const soundSettings = ref<SoundSettings>({
  language: SupportedLanguage.English,
  accent: EnglishAccent.American,
  apiConfigIndex: 0,
});

// 类型转换辅助函数
function isValidPronunciationType(value: string): value is PronunciationType {
  return Object.values(PronunciationType).includes(value as PronunciationType);
}

function isValidEnglishAccent(value: string): value is EnglishAccent {
  return Object.values(EnglishAccent).includes(value as EnglishAccent);
}

function pronunciationTypeToEnglishAccent(type: PronunciationType): EnglishAccent {
  switch (type) {
    case PronunciationType.American:
      return EnglishAccent.American;
    case PronunciationType.British:
      return EnglishAccent.British;
    default:
      return EnglishAccent.American;
  }
}

function englishAccentToPronunciationType(accent: EnglishAccent): PronunciationType {
  switch (accent) {
    case EnglishAccent.American:
      return PronunciationType.American;
    case EnglishAccent.British:
      return PronunciationType.British;
    default:
      return PronunciationType.American;
  }
}

/**
 * @deprecated 使用 useTTS() 替代此函数
 * 此函数仅保留用于向后兼容和数据迁移
 */
export function usePronunciation() {
  loadCache();

  function loadCache() {
    // 先尝试加载新的声音设置
    const settings = getSoundSettings();
    if (settings) {
      soundSettings.value = settings;
      // 为了向后兼容，同步更新旧的pronunciation值
      if (settings.language === SupportedLanguage.English) {
        const accent = settings.accent as EnglishAccent;
        pronunciation.value = englishAccentToPronunciationType(accent);
      }
    } else {
      // 如果没有新设置，尝试从旧的pronunciation加载
      const type = getStore() || pronunciation.value;
      pronunciation.value = type;
      // 转换为新的设置格式
      soundSettings.value = {
        language: SupportedLanguage.English,
        accent: pronunciationTypeToEnglishAccent(type),
        apiConfigIndex: 0,
      };
      setSoundSettings(soundSettings.value);
    }
  }

  function setStore(value: PronunciationType) {
    pronunciation.value = value;
    localStorage.setItem(PRONUNCIATION_TYPE, value);

    // 同步更新新的声音设置
    soundSettings.value = {
      language: SupportedLanguage.English,
      accent: pronunciationTypeToEnglishAccent(value),
      apiConfigIndex: soundSettings.value.apiConfigIndex,
    };
    setSoundSettings(soundSettings.value);
  }

  function getStore(): PronunciationType {
    return localStorage.getItem(PRONUNCIATION_TYPE) as PronunciationType;
  }

  function setSoundSettings(settings: SoundSettings) {
    soundSettings.value = settings;
    localStorage.setItem(SOUND_SETTINGS, JSON.stringify(settings));
  }

  function getSoundSettings(): SoundSettings | null {
    const settings = localStorage.getItem(SOUND_SETTINGS);
    return settings ? JSON.parse(settings) : null;
  }

  function getPronunciationType(): number {
    return pronunciation.value === PronunciationType.American ? 2 : 1;
  }

  function getPronunciationOptions() {
    return Object.entries(pronunciationLabels).map(([key, value]) => {
      return {
        label: value,
        value: key,
      };
    });
  }

  function getPronunciationUrl(word: string | undefined): string {
    if (!word) return "";

    const settings = soundSettings.value;
    let apiConfigs: PronunciationAPIConfig[];

    // 根据语言和口音获取API配置
    if (settings.language === SupportedLanguage.English) {
      apiConfigs = englishAPIConfigs[settings.accent as EnglishAccent];
    } else if (settings.language === SupportedLanguage.German) {
      apiConfigs = germanAPIConfigs[settings.accent as GermanAccent];
    } else {
      // 默认返回有道美音
      return `https://dict.youdao.com/dictvoice?type=2&audio=${word}`;
    }

    if (apiConfigs && apiConfigs[settings.apiConfigIndex]) {
      const apiConfig = apiConfigs[settings.apiConfigIndex];

      // 普通HTTP API
      return apiConfig.url.replace("{word}", encodeURIComponent(word));
    }

    // 默认返回有道美音
    return `https://dict.youdao.com/dictvoice?type=2&audio=${word}`;
  }

  // 切换发音 (向后兼容)
  function togglePronunciation(type: PronunciationType) {
    if (type !== pronunciation.value) setStore(type);
  }

  // 新的声音设置函数
  function getLanguageOptions() {
    return Object.entries(languageLabels).map(([key, value]) => ({
      label: value,
      value: key as SupportedLanguage,
    }));
  }

  function getAccentOptions(language: SupportedLanguage) {
    if (language === SupportedLanguage.English) {
      return Object.entries(englishAccentLabels).map(([key, value]) => ({
        label: value,
        value: key as EnglishAccent,
      }));
    } else if (language === SupportedLanguage.German) {
      return Object.entries(germanAccentLabels).map(([key, value]) => ({
        label: value,
        value: key as GermanAccent,
      }));
    }
    return [];
  }

  function getAPIOptions(language: SupportedLanguage, accent: EnglishAccent | GermanAccent) {
    let apiConfigs: PronunciationAPIConfig[];

    if (language === SupportedLanguage.English) {
      apiConfigs = englishAPIConfigs[accent as EnglishAccent];
    } else if (language === SupportedLanguage.German) {
      apiConfigs = germanAPIConfigs[accent as GermanAccent];
    } else {
      return [];
    }

    return apiConfigs.map((config, index) => ({
      label: `${config.name} - ${config.description}`,
      value: index,
    }));
  }

  function updateSoundSettings(newSettings: Partial<SoundSettings>) {
    const updatedSettings = { ...soundSettings.value, ...newSettings };

    // 如果改变了语言，设置默认口音
    if (newSettings.language && newSettings.language !== soundSettings.value.language) {
      if (newSettings.language === SupportedLanguage.English) {
        updatedSettings.accent = EnglishAccent.American; // 默认美音
      } else if (newSettings.language === SupportedLanguage.German) {
        updatedSettings.accent = GermanAccent.Standard; // 默认标准德语
      }
      updatedSettings.apiConfigIndex = 0; // 重置API索引
    } else if (newSettings.accent) {
      updatedSettings.apiConfigIndex = 0; // 如果只是改变口音，也重置API索引
    }

    setSoundSettings(updatedSettings);

    // 如果是英语，同步更新旧的pronunciation值以保持兼容性
    if (updatedSettings.language === SupportedLanguage.English) {
      const accent = updatedSettings.accent as EnglishAccent;
      pronunciation.value = englishAccentToPronunciationType(accent);
      localStorage.setItem(PRONUNCIATION_TYPE, pronunciation.value);
    }
  }

  return {
    // 向后兼容的API
    pronunciation,
    getPronunciationOptions,
    togglePronunciation,

    // 新的声音设置API
    soundSettings,
    getLanguageOptions,
    getAccentOptions,
    getAPIOptions,
    updateSoundSettings,
    getPronunciationUrl,
  };
}
