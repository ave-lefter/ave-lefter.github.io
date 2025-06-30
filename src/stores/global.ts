import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { pumpBlack } from '@/api/types/pump'
export const useGlobalStore = defineStore('global', () => {
  const wsStore = useWSStore()
  const localeStore = useLocaleStore()
  const themeStore = useThemeStore()
  const configStore = useConfigStore()
  const showLeft = shallowRef(true)
  const footerTokensPrice = shallowRef([
    {
      token: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
      chain: 'bsc',
      id: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c-bsc',
      current_price_usd: 0,
      price_change: 0
    },
    {
      token: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      chain: 'eth',
      id: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2-eth',
      current_price_usd: 0,
      price_change: 0
    },
    {
      token: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
      chain: 'bsc',
      id: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c-bsc',
      current_price_usd: 0,
      price_change: 0
    },
    {
      token: 'So11111111111111111111111111111111111111112',
      chain: 'solana',
      id: 'So11111111111111111111111111111111111111112-solana',
      current_price_usd: 0,
      price_change: 0
    }
  ])
  const pumpSetting = useStorage<{
    fontSize_mc: string
    size_swap: string
    Progress_isCircle: string
    avatar_isCircle: string
    isGutter: boolean
    isRight: boolean
    isBlacklist: boolean
    define: string[]
  }>('pumpSetting', {
    fontSize_mc: '12px',
    size_swap: '12px',
    Progress_isCircle: 'circle',
    avatar_isCircle: 'circle',
    isGutter: false,
    isRight: false,
    isBlacklist: false,
    define: [],
  })


  const pumpBlackList = useStorage<Array<pumpBlack>>('pumpBlackList', [])
   function sendFooterPriceWs() {
    const data = {
      jsonrpc: '2.0',
      method: 'unsubscribe',
      params: ['pricev2', footerTokensPrice.value?.map(i => i.id)],
      id: 1,
    }
    wsStore.send(data)
    const data1 = {
      jsonrpc: '2.0',
      method: 'subscribe',
      params: ['pricev2', footerTokensPrice.value?.map(i => i.id)],
      id: 1,
    }
    wsStore.send(data1)
  }

  function onmessageFooterPrice(data: any) {
    const prices = data?.prices as { token: string, chain: string, uprice: number, price_change: number }[]
    footerTokensPrice.value = footerTokensPrice.value?.map?.(
      (i) => {
        const item = prices.find(
          (j) => j.token + '-' + j.chain === i?.id
        )
        if (item) {
          return {
            ...i,
            current_price_usd: item.uprice,
            price_change: item.price_change,
          }
        } else {
          return {
            ...i,
          }
        }
      }
    )
  }
   const footerTokensPriceIds = computed(() => footerTokensPrice.value?.map(i => i.id))
  return {
    lang: computed(() => localeStore.locale),
    token_logo_url: computed(() => configStore.token_logo_url),
    mode: computed(() => (themeStore.isDark ? 'dark' : 'light')),
    isDark: computed(() => themeStore.isDark),
    sendFooterPriceWs,
    onmessageFooterPrice,
    footerTokensPrice,
    footerTokensPriceIds,
    showLeft,
    pumpSetting,
    pumpBlackList
  }
})
