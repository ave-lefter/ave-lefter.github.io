import ImageLarge from './components/imageLarge.vue'

export function useSimilarTokenPopup() {
    const { $createTooltip } = useNuxtApp()

    const $tooltip = $createTooltip('similar-tooltip')

    function onEnter(e: { target: any },row,type,getDataColor, hideImage = false) {
      $tooltip.show({
        content: {
          is:ImageLarge,
          props: {
            row: row,
            type: type,
            getDataColor,
            hideImage
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

  export function getFilterNumber(form:Record<string, any>, allPlatformsValue?: string, allBaseTokensValue?: string,debug = false) {
      let filterList = Object.keys(form).filter((key) => form[key] !== null && form[key] !== undefined && form[key] !== '' && form[key] !== 0 && (form[key]?.length > 0 || form[key] == 1 || form[key] === 2))
      filterList = Array.from(new Set(filterList.map(key => key.replace(/_min|_max$/g, ''))))
      // platforms 全选则不统计
      // 将 platforms 转为数组，判断数组是否相等，如果相等则不统计
      if (allPlatformsValue !== undefined && filterList.includes('platforms') && form.platforms.split(',').sort().join(',') === allPlatformsValue.split(',').sort().join(',')) {
        filterList = filterList.filter(i => i !== 'platforms')
      } else if(!form.platforms){
        filterList.push('platforms')
      }
      // 报价代币全选则不统计
      // 将 base_tokens 转为数组，判断数组是否相等，如果相等则不统计
      if (allBaseTokensValue !== undefined && filterList.includes('base_tokens') && form.base_tokens.split(',').sort().join(',') === allBaseTokensValue.split(',').sort().join(',')) {
        filterList = filterList.filter(i => i !== 'base_tokens')
      } else if(!form.base_tokens){
        filterList.push('base_tokens')
      }

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

      if (filterList.includes('lsniper_ratio') && filterList.includes('rsniper_ratio')) {
        const index = filterList.indexOf('rsniper_ratio')
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

      // if (filterList.includes('lrug') && filterList.includes('rrug')) {
      //   const index = filterList.indexOf('rrug')
      //   if (index !== -1) {
      //     filterList.splice(index, 1)
      //   }
      // }
      if (filterList.includes('ltvl') && filterList.includes('rtvl')) {
        const index = filterList.indexOf('rtvl')
        if (index !== -1) {
          filterList.splice(index, 1)
        }
      }

      if (filterList.includes('ldtc') && filterList.includes('rdtc')) {
        const index = filterList.indexOf('rdtc')
        if (index !== -1) {
          filterList.splice(index, 1)
        }
      }

      if (filterList.includes('ldmc') && filterList.includes('rdmc')) {
        const index = filterList.indexOf('rdmc')
        if (index !== -1) {
          filterList.splice(index, 1)
        }
      }
      if (filterList.includes('ldmr') && filterList.includes('rdmr')) {
        const index = filterList.indexOf('rdmr')
        if (index !== -1) {
          filterList.splice(index, 1)
        }
      }
      if (filterList.includes('lbdr') && filterList.includes('rbdr')) {
        const index = filterList.indexOf('rbdr')
        if (index !== -1) {
          filterList.splice(index, 1)
        }
      }

      if (filterList.includes('lfsr') && filterList.includes('rfsr')) {
        const index = filterList.indexOf('rfsr')
        if (index !== -1) {
          filterList.splice(index, 1)
        }
      }
      if (filterList.includes('lccr') && filterList.includes('rccr')) {
        const index = filterList.indexOf('rccr')
        if (index !== -1) {
          filterList.splice(index, 1)
        }
      }
      if (filterList.includes('lfans') && filterList.includes('rfans')) {
        const index = filterList.indexOf('rfans')
        if (index !== -1) {
          filterList.splice(index, 1)
        }
      }
      return filterList?.length || 0
  }