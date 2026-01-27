import ImageLarge from './imageLarge.vue'

export function useSimilarTokenPopup() {
    const { $createTooltip } = useNuxtApp()
  
    const $tooltip = $createTooltip('similar-tooltip')
  
    function onEnter(e: { target: any },row,type,getDataColor) {
      $tooltip.show({
        content: {
          is:ImageLarge,
          props: {
            row: row,
            type: type,
            getDataColor
          }
        },
        target: e.target,
        props: {
          showArrow: false,
          trigger: 'hover',
          placement:'right',
          'popper-class': 'similar-tooltip scrollbar-hide',
          'onUpdate:visible': (v: boolean) => {
            if (v) return
            $tooltip.hide()
          }
        }
      })
    }
  
    return onEnter
  }