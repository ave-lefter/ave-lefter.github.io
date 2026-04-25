import XIndex from './xIndex.vue'
import { getXType, getXContent } from '@/api/x'

export function useXPopup() {
  const { $createTooltip } = useNuxtApp()

  const $tooltip = $createTooltip('x--tooltip--t')

  const contentProps = reactive<{
    type: 0 | 1 | 2 | 3
    info: Awaited<ReturnType<typeof getXContent>> | null | '',
    loading: boolean
  }>({
    type: 0,
    info: null,
    loading: false
  })

  function onEnter(tokenId: string, e: { target: any }, type?: 1 | 2 | 3, isGetData = true) {
    if (isGetData || !contentProps?.info) {
      getXData(tokenId, type)
    }
    const targetEl = (e.target as HTMLElement) || null
    const containerEl = targetEl?.closest('.el-table') || targetEl?.parentElement?.parentElement?.parentElement || targetEl?.parentElement?.parentElement || targetEl?.parentElement || undefined
    $tooltip.show({
      content: {
        is: XIndex,
        props: contentProps
      },
      target: targetEl,
      props: {
        showArrow: false,
        placement: 'bottom',
        trigger: 'hover',
        'popper-class': 'x--tooltip',
        'append-to': containerEl,
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
        contentProps.info = res || null
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


export function needsTranslation(text: string): boolean {
  if (!text || text.trim().length === 0) {
    return false
  }
  // Remove whitespace
  const trimmedText = text.trim()
  // strip @mentions like @username so they don't affect translation detection
  const withoutMentions = trimmedText.replace(/@[A-Za-z0-9_]{1,15}/g, '').trim()
  let withoutLinks = withoutMentions
  // remove Markdown links [text](url)
  withoutLinks = withoutLinks.replace(/\[.*?\]\((?:https?:\/\/\S+|www\.\S+)\)/gi, '').trim()
  // remove emails
  withoutLinks = withoutLinks.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '').trim()
  // remove explicit URLs and common short domains (t.co, bit.ly, etc.)
  withoutLinks = withoutLinks.replace(/https?:\/\/\S+|www\.\S+|\b(?:t\.co|bit\.ly|goo\.gl|lnkd\.in|tinyurl\.com|ow\.ly)\b/gi, '').trim()
  // remove bare domain-like tokens (e.g. example.com)
  withoutLinks = withoutLinks.replace(/\b\S+\.[a-z]{2,}\b/gi, '').trim()

  const noTranslationRegex = /^[\d\s\p{P}\p{S}\uFE0F\u200D\u20E3]*$/u


  // Check if text without mentions/links matches the "no translation needed" pattern
  if (noTranslationRegex.test(withoutLinks)) {
    return false
  }
  // If there are letters or other language characters, translation is needed
  return true
}

