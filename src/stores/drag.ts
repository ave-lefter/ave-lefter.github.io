import {useStorage} from '@vueuse/core'
export const useDragStore = defineStore('drag', () => {
  const signalStore = useSignalStore()
  const monitorStore = useMonitorStore()
  const pumpStore = usePumpStore()
  const twitterTrackerStore = useTwitterTrackerStore()
  const positionStore = usePositionStore()

  const leftArr = useStorage<Array<'monitor' | 'pump' | 'signal' | 'twitter' |'position'>>('dragLeft', [])
  const rightArr = useStorage<Array<'monitor' | 'pump' | 'signal' | 'twitter' |'position'>>('dragRight', [])

  watch(() => monitorStore.placement,(val) => {
     console.log('monitorStore.placement', val)
     if(val==='left'){
       leftArr.value.push('monitor')
     } else if (val==='right'){
       rightArr.value.push('monitor')
     } else{ 
       leftArr.value = leftArr.value.filter(el => el !== 'monitor')
       rightArr.value = rightArr.value.filter(el => el !== 'monitor')
     }
    }
  )
  watch(() => pumpStore.placement,(val) => {
     console.log('pumpStore.placement', val)
    if(val==='left'){
       leftArr.value.push('pump')
     }else if (val==='right'){
       rightArr.value.push('pump')
     } else{
       leftArr.value = leftArr.value.filter(el => el !== 'pump')
       rightArr.value = rightArr.value.filter(el => el !== 'pump')
     }
    }
  )
  watch(() => signalStore.placement,(val) => {
     console.log('pumpStore.placement', val)
    if(val==='left'){
       leftArr.value.push('signal')
     }else if (val==='right'){
       rightArr.value.push('signal')
     } else{
       leftArr.value = leftArr.value.filter(el => el !== 'signal')
       rightArr.value = rightArr.value.filter(el => el !== 'signal')
     }
    }
  )

  watch(()=> twitterTrackerStore.placement,val=>{
    if(val==='left'){
      leftArr.value.push('twitter')
    }else if (val==='right'){
      rightArr.value.push('twitter')
    } else{
      leftArr.value = leftArr.value.filter(el => el !== 'twitter')
      rightArr.value = rightArr.value.filter(el => el !== 'twitter')
    }
  })

  watch(()=> positionStore.placement,val=>{
    if(val==='left'){
      leftArr.value.push('position')
    }else if (val==='right'){
      rightArr.value.push('position')
    } else{
      leftArr.value = leftArr.value.filter(el => el !== 'position')
      rightArr.value = rightArr.value.filter(el => el !== 'position')
    }
   })

  const fixedWidth = computed(() => {
    return {
      monitor: monitorStore.fixedWidth,
      pump: pumpStore.fixedWidth,
      signal: signalStore.fixedWidth,
      twitter:twitterTrackerStore.fixedWidth,
      position:positionStore.fixedWidth,
    }
  })
  const isRightFixed = computed(() => {
    return {
      monitor: monitorStore.isRightFixed,
      pump: pumpStore.isRightFixed,
      signal: signalStore.isRightFixed,
      twitter:twitterTrackerStore.isRightFixed,
      position:positionStore.isRightFixed,
    }
  })
  const isLeftFixed = computed(() => {
    return {
      monitor: monitorStore.isLeftFixed,
      pump: pumpStore.isLeftFixed,
      signal: signalStore.isLeftFixed,
      twitter:twitterTrackerStore.isLeftFixed,
      position:positionStore.isLeftFixed,
    }
  })
  const visible = computed(() => {
    return {
      monitor: monitorStore.visible,
      pump: pumpStore.visible,
      signal: signalStore.signalVisible,
      position: positionStore.visible,
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
    }
  })
  const leftWidth = computed(() => {
    const index1 =leftArr.value.findIndex(el => el === 'signal')
    const index2 =leftArr.value.findIndex(el => el === 'monitor')
    const index3 =leftArr.value.findIndex(el => el === 'pump')
    const index4 =leftArr.value.findIndex(el => el === 'twitter')
    const index5 =leftArr.value.findIndex(el => el === 'position')
    let monitor=0
    let pump=0
    let signal=0
    let twitter=0
    let position=0
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
    })
    console.log('leftWidth', monitor, pump, signal, twitter)
    return {
      monitor,
      pump,
      signal,
      twitter,
      position
    }
  })
  const rightWidth = computed(() => {
    const index1 = rightArr.value.findIndex(el => el === 'signal')
    const index2 =rightArr.value.findIndex(el => el === 'monitor')
    const index3 =rightArr.value.findIndex(el => el === 'pump')
    const index4 =rightArr.value.findIndex(el => el === 'twitter')
    const index5 =rightArr.value.findIndex(el => el === 'position')
    let monitor=0
    let pump=0
    let signal=0
    let twitter = 0
    let position = 0
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
    })
    console.log('rightWidth', monitor, pump, signal)
    return {
      monitor:monitorStore.winWidth-fixedWidth.value['monitor']-(Number(monitor)||0),
      pump:monitorStore.winWidth-fixedWidth.value['pump']-(Number(pump)||0),
      signal:monitorStore.winWidth-fixedWidth.value['signal']-(Number(signal)||0),
      twitter:monitorStore.winWidth-fixedWidth.value['twitter']-(Number(twitter)||0),
      position:monitorStore.winWidth-fixedWidth.value['position']-(Number(position)||0),
    }
  })

  const fixedCount = computed(()=>{
    let count = 0
    if(signalStore.signalVisible&&(signalStore.isLeftFixed || signalStore.isRightFixed)) count++
    if(monitorStore.visible&&(monitorStore.isLeftFixed || monitorStore.isRightFixed)) count++
    if(pumpStore.visible&&(pumpStore.isLeftFixed || pumpStore.isRightFixed)) count++
    if(twitterTrackerStore.visible&&(twitterTrackerStore.isLeftFixed || twitterTrackerStore.isRightFixed)) count++
    if(positionStore.visible&&(positionStore.isLeftFixed || positionStore.isRightFixed)) count++
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
