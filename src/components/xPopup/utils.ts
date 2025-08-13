import XIndex from './xIndex.vue'
import { getXType, getXContent } from '@/api/x'

export function useXPopup() {
  const { $createTooltip } = useNuxtApp()

  const $tooltip = $createTooltip('x--tooltip')

  const contentProps = reactive<{
    type: 0 | 1 | 2 | 3
    info: Awaited<ReturnType<typeof getXContent>> | null,
    loading: boolean
  }>({
    type: 0,
    info: null,
    loading: false
  })

  function onEnter(tokenId: string, e: { target: any }, type?: 1 | 2 | 3, isGetData = true) {
    if (isGetData) {
      getXData(tokenId, type)
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
        'popper-class': 'x--tooltip',
        'onUpdate:visible': (v: boolean) => {
          if (v) return
          $tooltip.hide()
        }
      }
    })
  }


  async function getXData(tokenId: string, type?: 1 | 2 | 3) {
    if (!tokenId) {
      return
    }
    contentProps.loading = true
    if (type) {
      contentProps.type = type
    } else {
      try {
        contentProps.type  = (await getXType(tokenId)).type
      } catch (e) {
        console.log(e)
        contentProps.info = null
        contentProps.loading = false
        return
      }
    }
    if ([1, 2, 3].includes(contentProps.type)) {
      getXContent(tokenId, contentProps.type).then(res => {
        contentProps.info = res
      }).catch(() => {
        contentProps.info = null
      }).finally(() => {
        contentProps.loading = false
      })
    } else {
      contentProps.info = null
      contentProps.loading = false
    }
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
