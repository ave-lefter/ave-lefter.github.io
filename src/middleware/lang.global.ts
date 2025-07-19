export default defineNuxtRouteMiddleware((to) => {
  const i18n = useNuxtApp().$i18n
  const lang = to.query?.lang as string
  if (lang && i18n.availableLocales.includes(lang as any)) {
    i18n.locale.value = lang as typeof i18n.locale.value
  }
})
