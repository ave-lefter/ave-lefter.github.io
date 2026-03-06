import XIndex from './xIndex.vue'

export function useXPopup() {
  const { $createTooltip } = useNuxtApp()
  const router = useRouter()

  const $tooltip = $createTooltip('x--tooltip')

  const contentProps = reactive<{
    score: number
    summary: string
  }>({
    score: 0,
    summary: ''
  })
  onBeforeRouteLeave(() => {
    $tooltip.hide()
  })
  function onEnter(
    e: { target: any },
    { summary: summary, score: score }: { summary?: string; score?: number}
  ) {
    contentProps.summary = summary || ''
    contentProps.score = score || 0
    $tooltip.show({
      content: {
        is: XIndex,
        props: contentProps,
      },
      target: e.target,
      props: {
        showArrow: false,
        placement: 'bottom',
        trigger: 'hover',
        offset: 5,
        'popper-class': 'x--tooltip',
        'onUpdate:visible': (v: boolean) => {
          if (v) return
          $tooltip.hide()
        },
      },
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