// src/middleware/router.global.ts
const redirectToOldUrls = ['/address']
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
  const needRedirectToOld = redirectToOldUrls.find((url) => to.fullPath.includes(url))
  const isBtcOrSolana = ['bsc', 'solana'].includes(to.params.chain as string)
  if(needRedirectToOld && !isBtcOrSolana) {
    let query = ''
    const botStore = useBotStore()
    if (botStore.accessToken &&  botStore.refreshToken) {
      query = `?act=${botStore.accessToken}&ret=${botStore.refreshToken}`
    }
    if (to.params.chain) {
      navigateTo('https://ave.ai'+ to.path + query,{
        open:{
          target:'_blank'
        }
      })
      return abortNavigation()
    } else {
      if (botStore.accessToken && botStore.evmAddress) {
        const path = `/address/${botStore.getWalletAddress('solana')}/solana`
        return navigateTo(path)
      }
    }

  }
  if (!to.fullPath?.includes('/token')) {
    useHead({ title: 'Ave.ai' })
    console.log('to',to)
  } else if (to.fullPath?.includes(NATIVE_TOKEN)) {
    const {chain} = getAddressAndChainFromId(to.params.id as string)
    const mainUrl = getChainInfo(chain)?.wmain_wrapper
    if (mainUrl) {
      return navigateTo(`/token/${mainUrl}-${chain}`, {replace: true})
    }
  }
})
