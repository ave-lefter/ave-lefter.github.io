import ImageLarge from './components/imageLarge.vue'

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
          transition:'',
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
  
    return {onEnter,hide:()=>$tooltip.hide()}
  }

  export function getFilterNumber(form:Record<string, any>) {
      let filterList = Object.keys(form).filter((key) => form[key] !== null && form[key] !== undefined && form[key] !== '' && form[key] !== 0 && (form[key]?.length > 0 || form[key] == 1 || form[key] === 2))
      filterList = Array.from(new Set(filterList.map(key => key.replace(/_min|_max$/g, ''))))
      
      if (filterList.includes('has_sm') && filterList.includes('sm_list')) {
        const index = filterList.indexOf('sm_list')
        if (index !== -1) {
          filterList.splice(index, 1)
        }
      }
    
      if (filterList.includes('lage') && filterList.includes('rage')) {
        const index = filterList.indexOf('rage')
        if (index !== -1) {
          filterList.splice(index, 1)
        }
      }
    
      if (filterList.includes('lsnip') && filterList.includes('rsnip')) {
        const index = filterList.indexOf('rsnip')
        if (index !== -1) {
          filterList.splice(index, 1)
        }
      }
    
      if (filterList.includes('lins') && filterList.includes('rins')) {
        const index = filterList.indexOf('rins')
        if (index !== -1) {
          filterList.splice(index, 1)
        }
      }
    
      if (filterList.includes('lkol') && filterList.includes('rkol')) {
        const index = filterList.indexOf('rkol')
        if (index !== -1) {
          filterList.splice(index, 1)
        }
      }
      
      if (filterList.includes('lbtx') && filterList.includes('rbtx')) {
        const index = filterList.indexOf('lbtx')
        if (index !== -1) {
          filterList.splice(index, 1)
        }
      }
      
      if (filterList.includes('lstx') && filterList.includes('rstx')) {
        const index = filterList.indexOf('rstx')
        if (index !== -1) {
          filterList.splice(index, 1)
        }
      }
      
      if (filterList.includes('lmks') && filterList.includes('rmks')) {
        const index = filterList.indexOf('lmks')
        if (index !== -1) {
          filterList.splice(index, 1)
        }
      }
    
      if (filterList.includes('lrug') && filterList.includes('rrug')) {
        const index = filterList.indexOf('rrug')
        if (index !== -1) {
          filterList.splice(index, 1)
        }
      }
    
      // filterList = filterList?.filter(i => i !== 'platforms')
      return filterList?.length || 0
  }