import {useStorage} from '@vueuse/core'
export const useDragStore = defineStore('drag', () => {
  const signalStore = useSignalStore()
  const monitorStore = useMonitorStore()
  const pumpStore = usePumpStore()
  const twitterTrackerStore = useTwitterTrackerStore()
  const positionStore = usePositionStore()
  const favTokenStore = useFavTokenStore()

  const leftArr = useStorage<Array<'monitor' | 'pump' | 'signal' | 'twitter' |'position'|'favToken'>>('dragLeft', [])
  const rightArr = useStorage<Array<'monitor' | 'pump' | 'signal' | 'twitter' |'position'|'favToken'>>('dragRight', [])

  // 通用的 placement 变化处理函数
  const handlePlacementChange = (panelKey: 'monitor' | 'pump' | 'signal' | 'twitter' | 'position' | 'favToken', val: string) => {
    // 先从两个数组中都移除该面板
    leftArr.value = leftArr.value.filter(el => el !== panelKey)
    rightArr.value = rightArr.value.filter(el => el !== panelKey)
    
    // 然后根据新的 placement 添加到对应数组
    if (val === 'left') {
      leftArr.value.push(panelKey)
    } else if (val === 'right') {
      rightArr.value.push(panelKey)
    }
  }

  watch(() => monitorStore.placement, (val) => {
    console.log('monitorStore.placement', val)
    handlePlacementChange('monitor', val)
  })
  
  watch(() => pumpStore.placement, (val) => {
    console.log('pumpStore.placement', val)
    handlePlacementChange('pump', val)
  })
  
  watch(() => signalStore.placement, (val) => {
    console.log('signalStore.placement', val)
    handlePlacementChange('signal', val)
  })

  watch(() => twitterTrackerStore.placement, (val) => {
    handlePlacementChange('twitter', val)
  })

  watch(() => positionStore.placement, (val) => {
    handlePlacementChange('position', val)
  })
  
  watch(() => favTokenStore.placement, (val) => {
    handlePlacementChange('favToken', val)
  })

  const fixedWidth = computed(() => {
    return {
      monitor: monitorStore.fixedWidth,
      pump: pumpStore.fixedWidth,
      signal: signalStore.fixedWidth,
      twitter:twitterTrackerStore.fixedWidth,
      position:positionStore.fixedWidth,
      favToken:favTokenStore.fixedWidth,
    }
  })
  const isRightFixed = computed(() => {
    return {
      monitor: monitorStore.isRightFixed,
      pump: pumpStore.isRightFixed,
      signal: signalStore.isRightFixed,
      twitter:twitterTrackerStore.isRightFixed,
      position:positionStore.isRightFixed,
      favToken:favTokenStore.isRightFixed,
    }
  })
  const isLeftFixed = computed(() => {
    return {
      monitor: monitorStore.isLeftFixed,
      pump: pumpStore.isLeftFixed,
      signal: signalStore.isLeftFixed,
      twitter:twitterTrackerStore.isLeftFixed,
      position:positionStore.isLeftFixed,
      favToken:favTokenStore.isLeftFixed,
    }
  })
  const visible = computed(() => {
    return {
      monitor: monitorStore.visible,
      pump: pumpStore.visible,
      signal: signalStore.signalVisible,
      position: positionStore.visible,
      favToken: favTokenStore.visible,
      twitter:twitterTrackerStore.visible
    }
  })
  // (!('shouldHide' in storeItem) || !storeItem.shouldHide)
  const shouldHide = computed(() => {
    return {
      monitor: false,
      pump: pumpStore.shouldHide,
      signal: signalStore.shouldHide,
      twitter:false,
      position:false,
      favToken:false,
    }
  })
  const leftWidth = computed(() => {
    const index1 =leftArr.value.findIndex(el => el === 'signal')
    const index2 =leftArr.value.findIndex(el => el === 'monitor')
    const index3 =leftArr.value.findIndex(el => el === 'pump')
    const index4 =leftArr.value.findIndex(el => el === 'twitter')
    const index5 =leftArr.value.findIndex(el => el === 'position')
    const index6 =leftArr.value.findIndex(el => el === 'favToken')
    let monitor=0
    let pump=0
    let signal=0
    let twitter=0
    let position=0
    let favToken=0
    leftArr.value.forEach((el, index) => {
      if(index<index1){
        signal += (visible.value[el]&&isLeftFixed.value[el]&&!shouldHide.value[el]) ? fixedWidth.value[el]+1 : 0
      }
      if(index<index2){
        monitor += (visible.value[el]&&isLeftFixed.value[el]&&!shouldHide.value[el]) ? fixedWidth.value[el]+1 : 0
      }
      if(index<index3){
        pump += (visible.value[el]&&isLeftFixed.value[el]&&!shouldHide.value[el]) ? fixedWidth.value[el]+1 :0
      }
      if(index<index4){
        twitter+=(visible.value[el]&&isLeftFixed.value[el]&&!shouldHide.value[el]) ? fixedWidth.value[el]+1 :0
      }
      if(index<index5){
        position+=(visible.value[el]&&isLeftFixed.value[el]&&!shouldHide.value[el]) ? fixedWidth.value[el]+1 :0
      }
      if(index<index6){
        favToken+=(visible.value[el]&&isLeftFixed.value[el]&&!shouldHide.value[el]) ? fixedWidth.value[el]+1 :0
      }
    })
    console.log('leftWidth', monitor, pump, signal, twitter)
    return {
      monitor,
      pump,
      signal,
      twitter,
      position,
      favToken
    }
  })
  const rightWidth = computed(() => {
    const index1 = rightArr.value.findIndex(el => el === 'signal')
    const index2 =rightArr.value.findIndex(el => el === 'monitor')
    const index3 =rightArr.value.findIndex(el => el === 'pump')
    const index4 =rightArr.value.findIndex(el => el === 'twitter')
    const index5 =rightArr.value.findIndex(el => el === 'position')
    const index6 =rightArr.value.findIndex(el => el === 'favToken')
    let monitor=0
    let pump=0
    let signal=0
    let twitter = 0
    let position = 0
    let favToken = 0
    rightArr.value.forEach((el, index) => {
      if(index<index1){
        signal += (visible.value[el]&&isRightFixed.value[el]&&!shouldHide.value[el]) ? fixedWidth.value[el]+1 : 0
      }
      if(index<index2){
        monitor += (visible.value[el]&&isRightFixed.value[el]&&!shouldHide.value[el]) ? fixedWidth.value[el]+1 : 0
      }
      if(index<index3){
        pump += (visible.value[el]&&isRightFixed.value[el]&&!shouldHide.value[el]) ? fixedWidth.value[el]+1 : 0
      }
      if(index<index4){
        twitter += (visible.value[el]&&isRightFixed.value[el]&&!shouldHide.value[el]) ? fixedWidth.value[el]+1 : 0
      }
      if(index<index5){
        position += (visible.value[el]&&isRightFixed.value[el]&&!shouldHide.value[el]) ? fixedWidth.value[el]+1 : 0
      }
      if(index<index6){
        favToken += (visible.value[el]&&isRightFixed.value[el]&&!shouldHide.value[el]) ? fixedWidth.value[el]+1 : 0
      }
    })
    console.log('rightWidth', monitor, pump, signal)
    return {
      monitor:monitorStore.winWidth-fixedWidth.value['monitor']-(Number(monitor)||0),
      pump:monitorStore.winWidth-fixedWidth.value['pump']-(Number(pump)||0),
      signal:monitorStore.winWidth-fixedWidth.value['signal']-(Number(signal)||0),
      twitter:monitorStore.winWidth-fixedWidth.value['twitter']-(Number(twitter)||0),
      position:monitorStore.winWidth-fixedWidth.value['position']-(Number(position)||0),
      favToken:monitorStore.winWidth-fixedWidth.value['favToken']-(Number(favToken)||0),
    }
  })

  const fixedCount = computed(()=>{
    let count = 0
    if(signalStore.signalVisible&&(signalStore.isLeftFixed || signalStore.isRightFixed)) count++
    if(monitorStore.visible&&(monitorStore.isLeftFixed || monitorStore.isRightFixed)) count++
    if(pumpStore.visible&&(pumpStore.isLeftFixed || pumpStore.isRightFixed)) count++
    if(twitterTrackerStore.visible&&(twitterTrackerStore.isLeftFixed || twitterTrackerStore.isRightFixed)) count++
    if(positionStore.visible&&(positionStore.isLeftFixed || positionStore.isRightFixed)) count++
    if(favTokenStore.visible&&(favTokenStore.isLeftFixed || favTokenStore.isRightFixed)) count++
    return count
  })

  return {
    leftWidth,
    rightWidth,
    fixedCount,
    // monitorBoundingRect,
    // isLeftFixed,
    // isRightFixed,
    // fixedWidth,
    // winHeight,
    // winWidth,
    // onDragStop,
    // onLeftDragStop,
    // onRightDragStop,
    // onResizing,
    // onFixedResizing,
    // onDrag,
    // translateStyle,
    // placement,
  }
})
