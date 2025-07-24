/**
 * Edge-TTS语音数据，按国家/地区分组
 */

export interface EdgeTTSVoice {
  name: string;
  shortName: string;
  gender: "Male" | "Female";
  locale: string;
  displayName: string;
}

export interface CountryVoices {
  countryName: string;
  countryCode: string;
  voices: EdgeTTSVoice[];
}

// 英语国家和地区的语音
const englishVoices: CountryVoices[] = [
  {
    countryName: "美国",
    countryCode: "US",
    voices: [
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-US, AriaNeural)",
        shortName: "en-US-AriaNeural",
        gender: "Female",
        locale: "en-US",
        displayName: "Aria (女声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-US, AnaNeural)",
        shortName: "en-US-AnaNeural",
        gender: "Female",
        locale: "en-US",
        displayName: "Ana (女声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-US, ChristopherNeural)",
        shortName: "en-US-ChristopherNeural",
        gender: "Male",
        locale: "en-US",
        displayName: "Christopher (男声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-US, EricNeural)",
        shortName: "en-US-EricNeural",
        gender: "Male",
        locale: "en-US",
        displayName: "Eric (男声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-US, GuyNeural)",
        shortName: "en-US-GuyNeural",
        gender: "Male",
        locale: "en-US",
        displayName: "Guy (男声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-US, JennyNeural)",
        shortName: "en-US-JennyNeural",
        gender: "Female",
        locale: "en-US",
        displayName: "Jenny (女声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-US, MichelleNeural)",
        shortName: "en-US-MichelleNeural",
        gender: "Female",
        locale: "en-US",
        displayName: "Michelle (女声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-US, RogerNeural)",
        shortName: "en-US-RogerNeural",
        gender: "Male",
        locale: "en-US",
        displayName: "Roger (男声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-US, SteffanNeural)",
        shortName: "en-US-SteffanNeural",
        gender: "Male",
        locale: "en-US",
        displayName: "Steffan (男声)",
      },
    ],
  },
  {
    countryName: "英国",
    countryCode: "GB",
    voices: [
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-GB, LibbyNeural)",
        shortName: "en-GB-LibbyNeural",
        gender: "Female",
        locale: "en-GB",
        displayName: "Libby (女声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-GB, MaisieNeural)",
        shortName: "en-GB-MaisieNeural",
        gender: "Female",
        locale: "en-GB",
        displayName: "Maisie (女声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-GB, RyanNeural)",
        shortName: "en-GB-RyanNeural",
        gender: "Male",
        locale: "en-GB",
        displayName: "Ryan (男声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-GB, SoniaNeural)",
        shortName: "en-GB-SoniaNeural",
        gender: "Female",
        locale: "en-GB",
        displayName: "Sonia (女声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-GB, ThomasNeural)",
        shortName: "en-GB-ThomasNeural",
        gender: "Male",
        locale: "en-GB",
        displayName: "Thomas (男声)",
      },
    ],
  },
  {
    countryName: "澳大利亚",
    countryCode: "AU",
    voices: [
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-AU, NatashaNeural)",
        shortName: "en-AU-NatashaNeural",
        gender: "Female",
        locale: "en-AU",
        displayName: "Natasha (女声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-AU, WilliamNeural)",
        shortName: "en-AU-WilliamNeural",
        gender: "Male",
        locale: "en-AU",
        displayName: "William (男声)",
      },
    ],
  },
  {
    countryName: "加拿大",
    countryCode: "CA",
    voices: [
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-CA, ClaraNeural)",
        shortName: "en-CA-ClaraNeural",
        gender: "Female",
        locale: "en-CA",
        displayName: "Clara (女声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-CA, LiamNeural)",
        shortName: "en-CA-LiamNeural",
        gender: "Male",
        locale: "en-CA",
        displayName: "Liam (男声)",
      },
    ],
  },
  {
    countryName: "印度",
    countryCode: "IN",
    voices: [
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-IN, NeerjaNeural)",
        shortName: "en-IN-NeerjaNeural",
        gender: "Female",
        locale: "en-IN",
        displayName: "Neerja (女声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-IN, PrabhatNeural)",
        shortName: "en-IN-PrabhatNeural",
        gender: "Male",
        locale: "en-IN",
        displayName: "Prabhat (男声)",
      },
    ],
  },
  {
    countryName: "爱尔兰",
    countryCode: "IE",
    voices: [
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-IE, ConnorNeural)",
        shortName: "en-IE-ConnorNeural",
        gender: "Male",
        locale: "en-IE",
        displayName: "Connor (男声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-IE, EmilyNeural)",
        shortName: "en-IE-EmilyNeural",
        gender: "Female",
        locale: "en-IE",
        displayName: "Emily (女声)",
      },
    ],
  },
  {
    countryName: "新西兰",
    countryCode: "NZ",
    voices: [
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-NZ, MitchellNeural)",
        shortName: "en-NZ-MitchellNeural",
        gender: "Male",
        locale: "en-NZ",
        displayName: "Mitchell (男声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-NZ, MollyNeural)",
        shortName: "en-NZ-MollyNeural",
        gender: "Female",
        locale: "en-NZ",
        displayName: "Molly (女声)",
      },
    ],
  },
  {
    countryName: "南非",
    countryCode: "ZA",
    voices: [
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-ZA, LeahNeural)",
        shortName: "en-ZA-LeahNeural",
        gender: "Female",
        locale: "en-ZA",
        displayName: "Leah (女声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (en-ZA, LukeNeural)",
        shortName: "en-ZA-LukeNeural",
        gender: "Male",
        locale: "en-ZA",
        displayName: "Luke (男声)",
      },
    ],
  },
];

// 中文语音
const chineseVoices: CountryVoices[] = [
  {
    countryName: "中国大陆",
    countryCode: "CN",
    voices: [
      {
        name: "Microsoft Server Speech Text to Speech Voice (zh-CN, XiaoxiaoNeural)",
        shortName: "zh-CN-XiaoxiaoNeural",
        gender: "Female",
        locale: "zh-CN",
        displayName: "晓晓 (女声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (zh-CN, XiaoyiNeural)",
        shortName: "zh-CN-XiaoyiNeural",
        gender: "Female",
        locale: "zh-CN",
        displayName: "晓伊 (女声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (zh-CN, YunjianNeural)",
        shortName: "zh-CN-YunjianNeural",
        gender: "Male",
        locale: "zh-CN",
        displayName: "云健 (男声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (zh-CN, YunxiNeural)",
        shortName: "zh-CN-YunxiNeural",
        gender: "Male",
        locale: "zh-CN",
        displayName: "云希 (男声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (zh-CN, YunxiaNeural)",
        shortName: "zh-CN-YunxiaNeural",
        gender: "Male",
        locale: "zh-CN",
        displayName: "云夏 (男声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (zh-CN, YunyangNeural)",
        shortName: "zh-CN-YunyangNeural",
        gender: "Male",
        locale: "zh-CN",
        displayName: "云扬 (男声)",
      },
    ],
  },
  {
    countryName: "中国香港",
    countryCode: "HK",
    voices: [
      {
        name: "Microsoft Server Speech Text to Speech Voice (zh-HK, HiuGaaiNeural)",
        shortName: "zh-HK-HiuGaaiNeural",
        gender: "Female",
        locale: "zh-HK",
        displayName: "曉佳 (女声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (zh-HK, HiuMaanNeural)",
        shortName: "zh-HK-HiuMaanNeural",
        gender: "Female",
        locale: "zh-HK",
        displayName: "曉曼 (女声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (zh-HK, WanLungNeural)",
        shortName: "zh-HK-WanLungNeural",
        gender: "Male",
        locale: "zh-HK",
        displayName: "雲龍 (男声)",
      },
    ],
  },
  {
    countryName: "中国台湾",
    countryCode: "TW",
    voices: [
      {
        name: "Microsoft Server Speech Text to Speech Voice (zh-TW, HsiaoChenNeural)",
        shortName: "zh-TW-HsiaoChenNeural",
        gender: "Female",
        locale: "zh-TW",
        displayName: "曉臻 (女声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (zh-TW, YunJheNeural)",
        shortName: "zh-TW-YunJheNeural",
        gender: "Male",
        locale: "zh-TW",
        displayName: "雲哲 (男声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (zh-TW, HsiaoYuNeural)",
        shortName: "zh-TW-HsiaoYuNeural",
        gender: "Female",
        locale: "zh-TW",
        displayName: "曉雨 (女声)",
      },
    ],
  },
];

// 其他主要语言
const otherLanguageVoices: CountryVoices[] = [
  {
    countryName: "日本",
    countryCode: "JP",
    voices: [
      {
        name: "Microsoft Server Speech Text to Speech Voice (ja-JP, KeitaNeural)",
        shortName: "ja-JP-KeitaNeural",
        gender: "Male",
        locale: "ja-JP",
        displayName: "圭太 (男声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (ja-JP, NanamiNeural)",
        shortName: "ja-JP-NanamiNeural",
        gender: "Female",
        locale: "ja-JP",
        displayName: "七海 (女声)",
      },
    ],
  },
  {
    countryName: "韩国",
    countryCode: "KR",
    voices: [
      {
        name: "Microsoft Server Speech Text to Speech Voice (ko-KR, InJoonNeural)",
        shortName: "ko-KR-InJoonNeural",
        gender: "Male",
        locale: "ko-KR",
        displayName: "인준 (男声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (ko-KR, SunHiNeural)",
        shortName: "ko-KR-SunHiNeural",
        gender: "Female",
        locale: "ko-KR",
        displayName: "선희 (女声)",
      },
    ],
  },
  {
    countryName: "法国",
    countryCode: "FR",
    voices: [
      {
        name: "Microsoft Server Speech Text to Speech Voice (fr-FR, DeniseNeural)",
        shortName: "fr-FR-DeniseNeural",
        gender: "Female",
        locale: "fr-FR",
        displayName: "Denise (女声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (fr-FR, EloiseNeural)",
        shortName: "fr-FR-EloiseNeural",
        gender: "Female",
        locale: "fr-FR",
        displayName: "Eloise (女声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (fr-FR, HenriNeural)",
        shortName: "fr-FR-HenriNeural",
        gender: "Male",
        locale: "fr-FR",
        displayName: "Henri (男声)",
      },
    ],
  },
  {
    countryName: "德国",
    countryCode: "DE",
    voices: [
      {
        name: "Microsoft Server Speech Text to Speech Voice (de-DE, AmalaNeural)",
        shortName: "de-DE-AmalaNeural",
        gender: "Female",
        locale: "de-DE",
        displayName: "Amala (女声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (de-DE, ConradNeural)",
        shortName: "de-DE-ConradNeural",
        gender: "Male",
        locale: "de-DE",
        displayName: "Conrad (男声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (de-DE, KatjaNeural)",
        shortName: "de-DE-KatjaNeural",
        gender: "Female",
        locale: "de-DE",
        displayName: "Katja (女声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (de-DE, SeraphinaMultilingualNeural)",
        shortName: "de-DE-SeraphinaMultilingualNeural",
        gender: "Female",
        locale: "de-DE",
        displayName: "Seraphina (女声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (de-DE, FlorianMultilingualNeural)",
        shortName: "de-DE-FlorianMultilingualNeural",
        gender: "Male",
        locale: "de-DE",
        displayName: "Florian (男声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (de-DE, KillianNeural)",
        shortName: "de-DE-KillianNeural",
        gender: "Male",
        locale: "de-DE",
        displayName: "Killian (男声)",
      },
    ],
  },
  {
    countryName: "西班牙",
    countryCode: "ES",
    voices: [
      {
        name: "Microsoft Server Speech Text to Speech Voice (es-ES, AlvaroNeural)",
        shortName: "es-ES-AlvaroNeural",
        gender: "Male",
        locale: "es-ES",
        displayName: "Alvaro (男声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (es-ES, ElviraNeural)",
        shortName: "es-ES-ElviraNeural",
        gender: "Female",
        locale: "es-ES",
        displayName: "Elvira (女声)",
      },
    ],
  },
  {
    countryName: "意大利",
    countryCode: "IT",
    voices: [
      {
        name: "Microsoft Server Speech Text to Speech Voice (it-IT, DiegoNeural)",
        shortName: "it-IT-DiegoNeural",
        gender: "Male",
        locale: "it-IT",
        displayName: "Diego (男声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (it-IT, ElsaNeural)",
        shortName: "it-IT-ElsaNeural",
        gender: "Female",
        locale: "it-IT",
        displayName: "Elsa (女声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (it-IT, IsabellaNeural)",
        shortName: "it-IT-IsabellaNeural",
        gender: "Female",
        locale: "it-IT",
        displayName: "Isabella (女声)",
      },
    ],
  },
  {
    countryName: "俄罗斯",
    countryCode: "RU",
    voices: [
      {
        name: "Microsoft Server Speech Text to Speech Voice (ru-RU, DmitryNeural)",
        shortName: "ru-RU-DmitryNeural",
        gender: "Male",
        locale: "ru-RU",
        displayName: "Dmitry (男声)",
      },
      {
        name: "Microsoft Server Speech Text to Speech Voice (ru-RU, SvetlanaNeural)",
        shortName: "ru-RU-SvetlanaNeural",
        gender: "Female",
        locale: "ru-RU",
        displayName: "Svetlana (女声)",
      },
    ],
  },
];

// 合并所有语音数据
export const allEdgeTTSVoices: CountryVoices[] = [
  ...englishVoices,
  ...chineseVoices,
  ...otherLanguageVoices,
];

// 获取所有语音的扁平列表
export function getAllVoicesList(): EdgeTTSVoice[] {
  return allEdgeTTSVoices.flatMap((country) => country.voices);
}

// 根据shortName查找语音
export function findVoiceByShortName(shortName: string): EdgeTTSVoice | undefined {
  return getAllVoicesList().find((voice) => voice.shortName === shortName);
}

// 获取语音的显示名称
export function getVoiceDisplayName(shortName: string): string {
  const voice = findVoiceByShortName(shortName);
  return voice ? voice.displayName : shortName;
}
