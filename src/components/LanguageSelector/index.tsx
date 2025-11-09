import { LANGUAGE_PRIORITY, changeLanguage } from '@/locales/i18n'
import { languageAtom } from '@/store/index'
import { useAtom } from 'jotai'
import React from 'react'
import { useTranslation } from 'react-i18next'

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation()
  const [language, setLanguage] = useAtom(languageAtom)

  // 同步 i18n 語言和 atom 狀態
  React.useEffect(() => {
    if (i18n.language !== language) {
      setLanguage(i18n.language as any)
    }
  }, [i18n.language, language, setLanguage])

  const languages = [
    { code: LANGUAGE_PRIORITY.EN, name: 'English', flag: '🇺🇸' },
    { code: LANGUAGE_PRIORITY.ZH_TW, name: '繁體', flag: '🇹🇼' },
    { code: LANGUAGE_PRIORITY.ZH_CN, name: '简体', flag: '🇨🇳' },
  ]

  const handleLanguageChange = async (code: string) => {
    const success = await changeLanguage(code as any)
    if (success) {
      setLanguage(code as any)
    }
  }

  return (
    <div className="group relative">
      <button className="flex min-w-[120px] items-center justify-center space-x-1 rounded-lg bg-gray-100 px-3 py-2 transition-colors duration-200 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
        <span className="text-sm">{languages.find((lang) => lang.code === language)?.flag}</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {languages.find((lang) => lang.code === language)?.name}
        </span>
        <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className="invisible absolute right-0 top-full z-50 mt-1 w-32 rounded-lg border border-gray-200 bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-800">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex w-full items-center space-x-2 px-3 py-2 text-left first:rounded-t-lg last:rounded-b-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
              language === lang.code
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className="text-sm">{lang.flag}</span>
            <span className="text-sm font-medium">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default LanguageSelector
