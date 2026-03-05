import XIndex from './xIndex.vue'

import { getTagsRatioHover, type HolderRankItem } from '@/api/token'
type DevInfo = Awaited<ReturnType<typeof getTagsRatioHover>>

export function useDevPop() {
  const { $createTooltip } = useNuxtApp()
  const router = useRouter()
  const botStore = useBotStore()
  const walletStore = useWalletStore()

  const $tooltip = $createTooltip('x--tooltip')

  const contentProps = shallowRef<{
    tokenId: string
    loading: boolean
    tableList: HolderRankItem[]
    total_balance_ratio: number
  }>({
    tokenId: '',
    loading: false,
    tableList: [],
    total_balance_ratio: 0
  })
  onBeforeRouteLeave(() => {
    $tooltip.hide()
  })

const contentKey = ref(0)

  function onEnter(tokenId: string, e: { target: any },
    options?: {
    type: number
    ratio?: number
   },
 isGetData = true) {
    if (isGetData) {
    getHolderRank(tokenId, options?.type)
  }

  contentKey.value++

  $tooltip.show({
    content: {
      is: XIndex,
      key: contentKey.value, // ⭐⭐⭐ 核心
      props: {
        type: options?.type,
        ratio: options?.ratio,
        data: contentProps,
        onFetch: getHolderRank,
      },
    },
    target: e.target,
    props: {
      showArrow: false,
      placement: 'bottom',
      trigger: 'hover',
      offset: 10,
      'popper-class': 'x--tooltip',
      'onUpdate:visible': (v: boolean) => {
        if (v) return
        $tooltip.hide()
      },
    },
  })
}


async function getHolderRank(tokenId: string, tag_type = 0) {
  if (!tokenId) return
    contentProps.value.loading = true
    const selfAddress = botStore?.evmAddress || walletStore?.address
  const data = {
    token_id: tokenId,
    tag_type,
    page_size: 100,
    page_no: 1,
    ...(selfAddress ? { self_address: selfAddress } : {})
  }

  try {
    const res = await getTagsRatioHover(data)
   contentKey.value++
    contentProps.value = {
      tokenId,
      loading: false,
      tableList: Array.isArray(res?.holders)
        ? res.holders.map((i) => ({
            ...i,
          balance_radio: Number(i.balance_ratio * 100)?.toFixed(2) || '0',
          total_profit_ratio: Number(i.total_profit_ratio * 100)?.toFixed(2) || '0',
          }))
        : [],
      total_balance_ratio: Number(Number(res.total_balance_ratio * 100)?.toFixed(2)) || 0,
    }
  } catch {
    contentProps.value = {
      tokenId: '',
      loading: false,
      tableList: [],
      total_balance_ratio: 0
    }
  }
}

  return {
    onEnter,
    contentProps,
    getHolderRank
  }
}

export function convertTextToHtml(str: string) {
  // 先处理换行符，将\n转换为<br>
  let html = str.replace(/\n/g, '<br>')

  // 然后处理链接
  const urlRegex = /(https?:\/\/[^\s]+)/g
  html = html.replace(urlRegex, function(url: string) {
    return `<a href="${url}" class="color-#009EF7 clickable" target="_blank" rel="noopener noreferrer">${url}</a>`
  })

  return html
}


