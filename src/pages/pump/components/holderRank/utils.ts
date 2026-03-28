import XIndex from './xIndex.vue'

import { _getHolderRank, type HolderRankItem } from '@/api/pump'
type DevInfo = Awaited<ReturnType<typeof _getHolderRank>>

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
  }>({
    tokenId: '',
    loading: false,
    tableList: [],
  })
  onBeforeRouteLeave(() => {
    $tooltip.hide()
  })

const contentKey = ref(0)

  function onEnter(tokenId: string, e: { target: any },
    options?: {
    type?: string
    ratio?: number
    symbol?: string
    logo_url: string
  },
 isGetData = true) {
    if (isGetData) {
    getHolderRank(tokenId, options?.type || 0)
  }

  contentKey.value++

  $tooltip.show({
    content: {
      is: XIndex,
      key: contentKey.value, // ⭐⭐⭐ 核心
      props: {
        type: options?.type,
        ratio: options?.ratio,
        symbol: options?.symbol,
        logo_url: options?.logo_url,
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
  const data = {
    token_id: tokenId,
    self_address: botStore?.evmAddress || walletStore?.address || '',
    tag_type ,
  }
    if (tag_type == -100 && !data.self_address) {
      contentProps.value = {
        tokenId: '',
        loading: false,
        tableList: [],
      }
      return
    }
    try {
      const res = await _getHolderRank(data)
      contentKey.value++
      contentProps.value = {
        tokenId,
        loading: false,
        tableList: Array.isArray(res?.items)
          ? res.items.map((i) => ({
              ...i,
              balance_radio: Number(i.balance_radio)?.toFixed(2) || '0',
            }))
          : [],
      }
    } catch {
      contentProps.value = {
        tokenId: '',
        loading: false,
        tableList: [],
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


