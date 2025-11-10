# Qwerty Learner 多语言支持文档

## 简介

Qwerty Learner 现在支持多语言界面，包括：

- 英语 (English)
- 繁体中文 (Traditional Chinese)
- 简体中文 (Simplified Chinese)

本文档将介绍如何使用和维护多语言功能。

## 技术架构

多语言功能基于以下技术实现：

- [i18next](https://www.i18next.com/) - 国际化框架
- [react-i18next](https://react.i18next.com/) - React 集成
- [i18next-browser-languagedetector](https://github.com/i18next/i18next-browser-languageDetector) - 浏览器语言检测

### 语言优先级

语言检测优先级：

1. 本地存储 (localStorage)
2. 浏览器语言设置
3. 默认语言 (英语)

## 文件结构

```
src/
├── locales/
│   ├── i18n.ts          # i18n 初始化配置
│   ├── en.json          # 英语翻译资源
│   ├── zh-TW.json       # 繁体中文翻译资源
│   └── zh-CN.json       # 简体中文翻译资源
├── components/
│   └── LanguageSelector/ # 语言切换组件
```

## 使用翻译

在组件中使用翻译：

```typescript
import { useTranslation } from 'react-i18next'

const MyComponent = () => {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('common.title')}</h1>
      <p>{t('common.description')}</p>
    </div>
  )
}
```

## 翻译键命名规范

采用模块化命名，使用点号分隔：

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  },
  "typing": {
    "start": "Start",
    "pause": "Pause"
  }
}
```

## 添加新语言

1. 在 `src/locales/` 目录下创建新的翻译文件，如 `fr.json`
2. 在 `src/locales/i18n.ts` 中添加语言配置：

```typescript
// 添加到 resources 对象
'fr': {
  translation: frTranslations,
},

// 添加到 supportedLngs 数组
supportedLngs: [LANGUAGE_PRIORITY.EN, LANGUAGE_PRIORITY.ZH_TW, LANGUAGE_PRIORITY.ZH_CN, 'fr'],

// 添加到 fallbackLng 配置
fallbackLng: {
  'fr': ['fr'],
  // ... 其他语言
  default: ['en'],
},
```

3. 在 `LanguageSelector` 组件中添加新语言选项：

```typescript
const languages = [
  { code: LANGUAGE_PRIORITY.EN, name: 'English', flag: '🇺🇸' },
  { code: LANGUAGE_PRIORITY.ZH_TW, name: '繁體', flag: '🇹🇼' },
  { code: LANGUAGE_PRIORITY.ZH_CN, name: '简体', flag: '🇨🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }, // 新语言
]
```

## 维护翻译

### 更新现有翻译

直接编辑对应的 JSON 文件：

- `src/locales/en.json` - 英语
- `src/locales/zh-TW.json` - 繁体中文
- `src/locales/zh-CN.json` - 简体中文

### 添加新的翻译键

确保在所有语言文件中都添加相同的键，保持一致性。

## 语言切换组件

语言切换组件位于页面右上角，用户可以点击选择所需的语言。

## 浏览器语言检测

系统会自动检测用户的浏览器语言设置，并优先显示对应的界面语言。

## 开发注意事项

1. 所有用户界面文本都应使用翻译键，而不是硬编码文本
2. 确保所有语言文件中的键保持一致
3. 在添加新功能时，记得为所有支持的语言添加相应的翻译
4. 使用 `t('key')` 函数来获取翻译文本

## 测试多语言支持

1. 启动开发服务器：`yarn dev`
2. 访问 <http://localhost:5173>
3. 点击右上角的语言切换器
4. 选择不同的语言测试界面显示

## 常见问题

### 翻译不显示

检查以下几点：

1. 确保翻译键在所有语言文件中都存在
2. 确保 `useTranslation` hook 正确导入和使用
3. 检查控制台是否有错误信息

### 语言切换不生效

1. 检查浏览器控制台是否有错误
2. 确保 `changeLanguage` 函数正确调用
3. 检查 localStorage 中的 `i18nextLng` 值

## 未来改进

- 添加更多语言支持
- 实现翻译管理工具
- 支持语言特定的日期和数字格式
