import { defineStore } from 'pinia'
import { useLocalStorage, useSessionStorage } from '@vueuse/core'
import { bot_getGasTip } from '@/api/bot'
import { useBotStore } from './bot'

const defaultGasTips = [{'chain':'eth','mev':true,'high':'15000000000','average':'8000000000','low':'3000000000','gasLimit':200000},{'chain':'eth','mev':false,'high':'5000000000','average':'3000000000','low':'1000000000','gasLimit':200000},{'chain':'solana','mev':false,'high':'6000000','average':'4000000','low':'2000000','gasLimit':0},{'chain':'solana','mev':true,'high':'4200000','average':'4100000','low':'4000000','gasLimit':0},{'chain':'bsc','mev':true,'high':'3000000000','average':'1000000000','low':'500000000','gasLimit':200000},{'chain':'bsc','mev':false,'high':'3000000000','average':'1000000000','low':'500000000','gasLimit':200000},{'chain':'base','mev':true,'high':'3000000000','average':'1000000000','low':'500000000','gasLimit':200000},{'chain':'base','mev':false,'high':'3000000000','average':'1000000000','low':'500000000','gasLimit':200000}]


export const useBotSwapStore = defineStore('botSwap', () => {
  const gasTip = useLocalStorage('bot_gasTip_v1', defaultGasTips)

  const botStore = useBotStore()
  const tokenStore = useTokenStore()

  const wsStore = useWSStore()

  const priceLimit = shallowRef(0)


  const mainTokensPrice = shallowRef([
    {
      token: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
      chain: 'bsc',
      id: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c-bsc',
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
      token: '0x4200000000000000000000000000000000000006',
      chain: 'base',
      id: '0x4200000000000000000000000000000000000006-base',
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
      token: 'So11111111111111111111111111111111111111112',
      chain: 'solana',
      id: 'So11111111111111111111111111111111111111112-solana',
      current_price_usd: 0,
      price_change: 0
    },
    {
      token: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      chain: 'polygon',
      id: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270-polygon',
      current_price_usd: 0,
      price_change: 0
    },
  ])

  const botSwapBaseTokens = ref({
    bsc: [
      {
        chain: 'bsc',
        balance: '0',
        symbol: 'BNB',
        decimals: 18,
        address: NATIVE_TOKEN,
        price: 1,
        logo_url: 'token_icon/bsc/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png'
      },
      {
        chain: 'bsc',
        balance: '0',
        symbol: 'USDT',
        decimals: 18,
        address: '0x55d398326f99059ff775485246999027b3197955',
        price: 1,
        logo_url: 'token_icon/bsc/0x55d398326f99059ff775485246999027b3197955_1743508127.png'
      },
       {
        chain: 'bsc',
        balance: '0',
        symbol: 'USDC',
        decimals: 18,
        address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
        price: 1,
        logo_url: 'token_icon/bsc/0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d.png'
      },
    ],
    eth: [
      {
        chain: 'eth',
        balance: '0',
        symbol: 'ETH',
        decimals: 18,
        address: NATIVE_TOKEN,
        price: 1,
        logo_url: 'token_icon/eth/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2_1744610045.png'
      },
      {
        chain: 'eth',
        balance: '0',
        symbol: 'USDT',
        decimals: 6,
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        price: 1,
        logo_url: 'token_icon/eth/0xdac17f958d2ee523a2206206994597c13d831ec7.png'
      },
      {
        chain: 'eth',
        balance: '0',
        symbol: 'USDC',
        decimals: 6,
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        price: 1,
        logo_url: 'token_icon/eth/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png'
      },
    ],
    base: [
       {
        chain: 'base',
        balance: '0',
        symbol: 'ETH',
        decimals: 18,
        address: NATIVE_TOKEN,
        price: 1,
        logo_url: 'token_icon/base/0x4200000000000000000000000000000000000006_1690726006.png'
      },
      {
        chain: 'base',
        balance: '0',
        symbol: 'USDC',
        decimals: 6,
        address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
        price: 1,
        logo_url: 'token_icon/base/0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.png'
      },
    ],
    xlayer: [
      {
        chain: 'xlayer',
        balance: '0',
        symbol: 'OKB',
        decimals: 18,
        address: NATIVE_TOKEN,
        price: 1,
        logo_url: 'token_icon/xlayer/0xe538905cf8410324e03a5a23c1c177a474d59b2b.png'
      },
      {
        chain: 'xlayer',
        balance: '0',
        symbol: 'USDT',
        decimals: 6,
        address: '0x1e4a5963abfd975d8c9021ce480b42188849d41d',
        price: 1,
        logo_url: 'token_icon/xlayer/0x1e4a5963abfd975d8c9021ce480b42188849d41d.png'
      },
      {
        chain: 'xlayer',
        balance: '0',
        symbol: 'USDC',
        decimals: 6,
        address: '0x74b7f16337b8972027f6196a17a631ac6de26d22',
        price: 1,
        logo_url: 'token_icon/xlayer/0x74b7f16337b8972027f6196a17a631ac6de26d22.png'
      },
    ],
    solana: [
      {
        chain: 'solana',
        balance: '0',
        symbol: 'SOL',
        decimals: 9,
        address: 'sol',
        price: 1,
        logo_url: 'token_icon/solana/So11111111111111111111111111111111111111112.png'
      },
       {
        chain: 'solana',
        balance: '0',
        symbol: 'USDT',
        decimals: 6,
        address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
        price: 1,
        logo_url: 'token_icon/solana/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB.png'
      },
      {
        chain: 'solana',
        balance: '0',
        symbol: 'USDC',
        decimals: 6,
        address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        price: 1,
        logo_url: 'token_icon/solana/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v.png'
      },
    ],
    ton: [
      {
        chain: 'ton',
        balance: '0',
        symbol: 'TON',
        decimals: 9,
        address: 'TON',
        price: 1,
        logo_url: 'token_icon/ton/EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c.png'
      },
      // {
      //   chain: 'ton',
      //   balance: '0',
      //   symbol: 'USD₮',
      //   decimals: 6,
      //   address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      //   price: 1,
      //   logo_url: 'token_icon/ton/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs.png'
      // }
    ]
  })

  const wallets = botStore.evmAddress ? [botStore.evmAddress] : []

  const botSwapSelectedWallets = useSessionStorage<string[]>('botSwapSelectedWallets', wallets)

  watch(() => botStore.evmAddress, (val) => {
    if (val) {
      botSwapSelectedWallets.value = [val || '']
    } else {
      botSwapSelectedWallets.value = []
    }
  })

  function _bot_getGasTip() {
    if (botStore.accessToken && botStore.userInfo?.tgUid) {
      return bot_getGasTip().then(async res => {
        const chains: string[] = botStore.isSupportChains?.filter(i => res?.every?.((j) => j?.chain !== i))
        gasTip.value = [...res, ...(chains?.map?.(i => {
          return {
            chain: i,
            mev: false,
            high: '3000000000',
            average: '1000000000',
            low: '500000000',
            gasLimit: 200000
          }
        }) || [])]
        return res
      })
    }
  }

  function sendNativePriceWs() {
    const data = {
      jsonrpc: '2.0',
      method: 'subscribe',
      params: ['pricev2', mainTokensPrice.value?.map(i => i.id)],
      id: 1,
    }
    wsStore.send(data)
  }

  function onmessageNativePrice(data: any) {
    const prices = data?.prices as { token: string, chain: string, uprice: number, price_change: number }[]
    mainTokensPrice.value = mainTokensPrice.value?.map?.(
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

 const mainTokensPriceIds = computed(() => mainTokensPrice.value?.map(i => i.id))



  return {
    gasTip,
    priceLimit,
    mainTokensPrice,
    mainTokensPriceIds,
    botSwapBaseTokens,
    botSwapSelectedWallets,
    bot_getGasTip: _bot_getGasTip,
    sendNativePriceWs,
    onmessageNativePrice
  }
})
