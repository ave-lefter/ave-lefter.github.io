// src/middleware/router.global.ts
// const redirectToOldUrls = ['/address']
export default defineNuxtRouteMiddleware((to) => {
  // console.log('to', from, to)
  if (to.fullPath?.includes('/login')) {
    const query = to.query
    if (query.redirectUrl) {
      const botStore = useBotStore()
      console.log('login ----', query)
      botStore.login(query as any)
      const redirectUrl = query.redirectUrl?.includes('/') ? (query.redirectUrl as string)?.replace(/^(.*?)(\/.*)$/, '$2') : '/'
      return navigateTo(redirectUrl, { replace: true })
    }
  }
  // const needRedirectToOld = redirectToOldUrls.find((url) => to.fullPath.includes(url))
  // if (needRedirectToOld) {
  //   const chain = to.params.chain as string
  //   const botStore = useBotStore()
  //   if (!chain) {
  //     const walletStore = useWalletStore()
  //     if (botStore.accessToken && botStore.evmAddress) {
  //       const path = `/address/${botStore.getWalletAddress('solana')}/solana`
  //       return navigateTo(path)
  //     } else if (walletStore.address && walletStore.chain) {
  //       const path = `/address/${walletStore.address}/${walletStore.chain}`
  //       return navigateTo(path)
  //     }
  //   }
  // }
  if (!to.fullPath?.includes('/token')) {
    useHead({ title: 'Ave.ai' })
  } else if (to.fullPath?.includes(NATIVE_TOKEN)) {
    const {chain} = getAddressAndChainFromId(to.params.id as string)
    const mainUrl = getChainInfo(chain)?.wmain_wrapper
    if (mainUrl) {
      return navigateTo(`/token/${mainUrl}-${chain}`, {replace: true})
    }
  }

  const isDirty = useState('is_memory_dirty')

  // 如果環境已污染，則攔截 SPA 跳轉，改用物理跳轉
  if (isDirty.value === true) {
    console.warn('【跳轉清理】正在物理重載跳轉至新路由...')

    isDirty.value = false

    // 強制瀏覽器重置所有上下文、Worker 和 VNode
    window.location.href = to.fullPath

    return abortNavigation()
  }
})
