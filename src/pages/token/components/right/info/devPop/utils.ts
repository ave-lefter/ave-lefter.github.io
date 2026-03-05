import XIndex from './xIndex.vue'

import { _getDevInfo } from '@/api/pump'
type DevInfo = Awaited<ReturnType<typeof _getDevInfo>>

export function useDevPop() {
  const { $createTooltip } = useNuxtApp()
  const router = useRouter()

  const $tooltip = $createTooltip('x--tooltip')

  const contentProps = reactive<{
    info: DevInfo | null,
    tokenId: string
    loading: boolean
  }>({
    info: null,
    tokenId: '',
    loading: false
  })
  onBeforeRouteLeave(() => {
    $tooltip.hide()
  })
  function onEnter(tokenId: string, e: { target: any }, isGetData = true) {
    if (isGetData) {
      getDevInfo(tokenId)
    }
    $tooltip.show({
      content: {
        is: XIndex,
        props: contentProps
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
        }
      }
    })
  }


  async function getDevInfo(tokenId: string) {
    if (!tokenId) {
      return
    }
    contentProps.loading = true
    _getDevInfo(tokenId).then(res => {
      // contentProps.info = {...res, video_uri: `https://pump.fun/coin/${res.token}?include-nsfw=true`}
      contentProps.info = {
        ...res,
        first_deposit_at:
          res?.first_deposit_at !== '1970-01-01T00:00:00Z' &&
          res?.first_deposit_at !== '0001-01-01T00:00:00Z'
            ? res?.first_deposit_at
            : '0',
      }
      contentProps.tokenId = tokenId
    }).catch(() => {
      contentProps.info = null
      contentProps.tokenId = ''
    }).finally(() => {
      contentProps.loading = false
    })
  }

  return {
    onEnter,
    contentProps
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


