type DirectiveHTMLElement = HTMLElement & {
  handler: (e: Event) => void
  $value: any
}
// 更新滑块默认选中颜色
const updateStopStyle = (dom: HTMLElement) => {
  const percent = Number((dom.querySelector<HTMLElement>('.el-slider__bar')?.style?.width || '0').replace('%', ''))
  const stops = dom.querySelectorAll<HTMLElement>('.el-slider__stop')
  stops.forEach((stop: HTMLElement) => {
    const left = parseFloat(stop.style.left)
    if (left <= percent) {
      stop.style.backgroundColor = 'var(--main-text)'
    } else {
      stop.style.backgroundColor = ''
    }
  })
  const stops_text = dom.querySelectorAll<HTMLElement>('.el-slider__marks-text')
  stops_text.forEach((stop: HTMLElement) => {
    const left = parseFloat(stop.style.left)
    if (left <= percent) {
      stop.style.color = 'var(--main-text)'
    } else {
      stop.style.color = ''
    }
  })
}

const sliderDirective = {
  mounted(el: DirectiveHTMLElement) {
    // 为 DOM 元素存储绑定的值
    updateStopStyle(el)
  },

  updated(el: DirectiveHTMLElement) {
    // 当指令的值更新时，更新 $value
    updateStopStyle(el)
  },
}

export default sliderDirective
