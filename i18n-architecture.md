# Qwerty Learner i18n 多语言架构设计

## 1. 架构概述

基于 react-i18next + i18next + i18next-browser-languagedetector 实现多语言支持，优先级：英文 > 繁體中文 > 簡體中文

## 2. 技术栈

- **react-i18next**: React 集成
- **i18next**: 核心国际化库
- **i18next-browser-languagedetector**: 浏览器语言检测
- **Jotai**: 状态管理（与现有系统集成）

## 3. 文件结构

```bash
src/
├── locales/
│   ├── i18n.ts          # i18n初始化配置
│   ├── en.json          # 英文翻译
│   ├── zh-TW.json       # 繁體中文翻译
│   ├── zh-CN.json       # 簡體中文翻译
│   └── atoms.ts         # 语言状态管理
├── components/
│   └── LanguageSwitcher/ # 语言切换组件
└── hooks/
    └── useTranslation.ts # 翻译Hook封装
```

## 4. 语言优先级配置

```typescript
// 浏览器语言检测配置
const detectionOptions = {
  order: ['localStorage', 'navigator', 'htmlTag'],
  lookupLocalStorage: 'i18nextLng',
  caches: ['localStorage'],
  fallbackLng: 'en', // 默认英文
}

// 支持语言列表（按优先级排序）
const supportedLngs = ['en', 'zh-TW', 'zh-CN']
```

## 5. 翻译键命名规范

采用模块化命名，使用点号分隔：

```json
{
  // 页面级别
  "typing": {
    "title": "Typing Practice",
    "startButton": "Start Practice",
    "settings": "Settings"
}

// 组件级别
"wordPanel": {
  "correct": "Correct!",
  "incorrect": "Try Again"
}

// 通用级别
"common": {
  "save": "Save",
  "cancel": "Cancel",
  "loading": "Loading..."
}
```

## 6. 状态管理集成

```typescript
// 使用Jotai管理当前语言状态
export const currentLanguageAtom = atom<string>('en')

// 监听语言变化
export const useLanguageChange = () => {
  const { i18n } = useTranslation()
  const [, setCurrentLanguage] = useAtom(currentLanguageAtom)

  useEffect(() => {
    setCurrentLanguage(i18n.language)
  }, [i18n.language])
}
```

## 7. 语言切换组件

```typescript
const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
    { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  ]

  return (
    <select value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)}>
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  )
}
```

## 8. 迁移策略

### 第一阶段：基础架构

1. 安装依赖包
2. 创建 i18n 初始化配置
3. 创建翻译资源文件（空文件）

### 第二阶段：核心翻译

1. 提取主要页面中文文本
2. 实现英文翻译
3. 实现繁體中文翻译
4. 实现簡體中文翻译

### 第三阶段：组件集成

1. 创建语言切换组件
2. 集成到主界面
3. 测试语言切换功能

### 第四阶段：优化完善

1. 更新依赖包
2. 评估包管理器迁移
3. 更新文档

## 9. 关键中文文本位置

基于分析，主要需要翻译的中文文本分布在：

- **src/pages/Typing/**: 主练习界面（标题、按钮、提示）
- **src/pages/Typing/components/**: 组件文本（设置、统计、错误提示）
- **src/pages/Mobile/**: 移动端界面
- **src/components/**: 通用组件（工具提示、警告等）

## 10. 实施步骤

1. 切换到 Code 模式
2. 安装 i18next 相关依赖
3. 创建 i18n 配置和翻译文件
4. 逐步替换中文文本
5. 集成语言切换功能
6. 测试和优化
