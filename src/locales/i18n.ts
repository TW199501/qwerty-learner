import enTranslations from './en.json'
import zhCNTranslations from './zh_CN.json'
import zhTWTranslations from './zh_TW.json'
import i18n, { InitOptions } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { atom } from 'jotai'
import { initReactI18next } from 'react-i18next'

// 语言优先级配置
export const LANGUAGE_PRIORITY = {
  EN: 'en',
  ZH_TW: 'zh-TW',
  ZH_CN: 'zh-CN',
} as const

export type LanguagePriority = (typeof LANGUAGE_PRIORITY)[keyof typeof LANGUAGE_PRIORITY]

// 创建语言状态原子
export const languageAtom = atom<LanguagePriority>(LANGUAGE_PRIORITY.EN)

// 翻译资源
const resources = {
  en: {
    translation: enTranslations,
  },
  'zh-TW': {
    translation: zhTWTranslations,
  },
  'zh-CN': {
    translation: zhCNTranslations,
  },
  zh: {
    translation: zhCNTranslations, // zh 回退到简体中文
  },
}

// 調試：檢查翻譯資源是否正確載入
console.log('Translation resources loaded:')
console.log('zh-TW start:', zhTWTranslations.typing.start)
console.log('zh-CN start:', zhCNTranslations.typing.start)

// i18next配置
const i18nConfig: InitOptions = {
  resources,
  debug: process.env.NODE_ENV === 'development',

  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    lookupLocalStorage: 'i18nextLng',
    caches: ['localStorage'],
    // 語言映射配置
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,
  },

  interpolation: {
    escapeValue: false, // React already escapes
  },

  // 语言优先级配置
  load: 'all', // 載入完整的語言代碼，不只是語言部分
  supportedLngs: [LANGUAGE_PRIORITY.EN, LANGUAGE_PRIORITY.ZH_TW, LANGUAGE_PRIORITY.ZH_CN, 'zh'],

  // 語言映射
  nonExplicitSupportedLngs: false, // 禁用非明確語言映射

  // 語言回退配置
  fallbackLng: {
    'zh-TW': ['zh-TW'],
    'zh-CN': ['zh-CN'],
    zh: ['zh-CN'],
    default: ['en'],
  },

  react: {
    useSuspense: false,
  },
}

// 初始化 i18n
const initI18n = async () => {
  await i18n.use(LanguageDetector).use(initReactI18next).init(i18nConfig)

  // 在開發模式下強制重新載入所有翻譯資源
  if (process.env.NODE_ENV === 'development') {
    await i18n.reloadResources()
  }

  // 同步語言狀態到 languageAtom
  if (typeof window !== 'undefined') {
    const { languageAtom } = await import('@/store/index')
    const { getDefaultStore } = await import('jotai')
    const store = getDefaultStore()

    // 設置 atom 的值為當前 i18n 語言
    store.set(languageAtom, i18n.language as any)
  }
}

initI18n()

// 調試：檢查翻譯資源是否正確載入
if (process.env.NODE_ENV === 'development') {
  console.log('i18n initialized with languages:', Object.keys(resources))
  console.log('zh-TW pressAnyKeyStart:', resources['zh-TW']?.translation?.typing?.pressAnyKeyStart)
  console.log('zh-CN pressAnyKeyStart:', resources['zh-CN']?.translation?.typing?.pressAnyKeyStart)

  // 清除可能的緩存語言設置
  if (typeof window !== 'undefined') {
    console.log('Current localStorage i18nextLng:', localStorage.getItem('i18nextLng'))
    // 在開發模式下清除緩存的語言設置，強制重新檢測
    localStorage.removeItem('i18nextLng')
  }
}

// 语言切换函数
export const changeLanguage = async (lng: LanguagePriority) => {
  try {
    console.log('Changing language to:', lng)
    console.log('Available languages:', Object.keys(resources))

    // 強制設置語言，不依賴自動檢測
    await i18n.changeLanguage(lng)

    console.log('Language changed successfully to:', i18n.language)
    console.log('Resolved language:', i18n.resolvedLanguage)

    // 測試翻譯是否正常工作
    const testStart = i18n.getResource(lng, 'translation', 'typing.start')
    const testTime = i18n.getResource(lng, 'translation', 'typing.time')
    const testPressKey = i18n.getResource(lng, 'translation', 'typing.pressAnyKeyStart')
    console.log(`Test translations for ${lng}:`)
    console.log('- typing.start:', testStart)
    console.log('- typing.time:', testTime)
    console.log('- typing.pressAnyKeyStart:', testPressKey)

    return true
  } catch (error) {
    console.error('Failed to change language:', error)
    return false
  }
}

// 获取当前语言
export const getCurrentLanguage = (): LanguagePriority => {
  return i18n.language as LanguagePriority
}

// 获取语言显示名称
export const getLanguageDisplayName = (lng: LanguagePriority): string => {
  const names = {
    [LANGUAGE_PRIORITY.EN]: 'English',
    [LANGUAGE_PRIORITY.ZH_TW]: '繁體中文',
    [LANGUAGE_PRIORITY.ZH_CN]: '简体中文',
  }
  return names[lng]
}

export default i18n
