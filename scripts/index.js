import { createI18n } from 'vue-i18n'
import enLocale from './en.json'
import zhLocale from './zh-cn.json'
import zhTWLocale from './zh-tw.json'
import esLocale from './es.json'
import zhCnElement from 'element-plus/es/locale/lang/zh-cn'
import zhTWElement from 'element-plus/es/locale/lang/zh-tw'
import enElement from 'element-plus/es/locale/lang/en'
import esElement from 'element-plus/es/locale/lang/es'
import ptBrElement from "element-plus/es/locale/lang/pt-br"
import ptBrLocale from "./pt.json"
import trLocale from "./tr.json"
import ruLocale from './ru.json'
import viLocale from './vi.json'
import trElement from "element-plus/es/locale/lang/tr"
import ruElement from 'element-plus/es/locale/lang/ru'
import viElement from 'element-plus/es/locale/lang/vi'
import Cookies from 'js-cookie'

// import { getLocale } from '@/utils/utils.js'

const i18n = createI18n({
  locale: localStorage.language || Cookies.get("language") || "en",
  legacy: false,
  fallbackLocale: "en",
  messages: {
    en: {
      ...enElement,
      ...enLocale,
    },
    "zh-cn": {
      ...zhCnElement,
      ...zhLocale,
    },
    "zh-tw": {
      ...zhTWElement,
      ...zhTWLocale,
    },
    es: {
      ...esElement,
      ...esLocale,
    },
    pt: {
      ...ptBrElement,
      ...ptBrLocale,
    },
    tr: {
      ...trElement,
      ...trLocale,
    },
    ru: {
      ...ruElement,
      ...ruLocale,
    },
    vi: {
      ...viElement,
      ...viLocale,
    },
  },
});
export default i18n
