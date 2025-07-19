import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { RemovableRef } from '@vueuse/core'
// import { useRouter, useRoute } from 'vue-router'

import dayjs from '@/utils/day/index'

type LocaleType = ReturnType<typeof useI18n>['locale']['value']
export const useLocaleStore = defineStore('locale', () => {
  const router = useRouter()
  const route = useRoute()
  const { language, ...restQuery } = route.query
  const locale = useLocalStorage('language','en') as RemovableRef<LocaleType>

  async function setLanguage(lang: LocaleType) {
    if (language) {
      router.replace({
        name: route.name as string,
        params: route.params,
        query: restQuery,
      })
    }
    const { loadLocaleMessages, getLocaleMessage } = useNuxtApp().$i18n
    const messages = getLocaleMessage(lang)
    const isLocaleLoaded = messages && Object.keys(messages).length > 0
    if (!isLocaleLoaded) {
      await loadLocaleMessages(lang)
    }
    locale.value = lang
  }

  watch(locale, (val) => {
    dayjs.locale(val === 'zh-cn' ? 'zh' : (val === 'zh-tw' ? 'zh-tw' : 'en'))
  })
  return { locale, setLanguage }
})
