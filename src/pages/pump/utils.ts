import ImageLarge from './imageLarge.vue'

export function useSimilarTokenPopup() {
    const { $createTooltip } = useNuxtApp()
  
    const $tooltip = $createTooltip('similar-tooltip')
  
    function onEnter(e: { target: any },row,type) {
      $tooltip.show({
        content: {
          is:ImageLarge,
          props: {
            row: row,
            type: type
          }
        },
        target: e.target,
        props: {
          showArrow: false,
          trigger: 'hover',
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