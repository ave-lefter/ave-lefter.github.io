import {useStorage} from '@vueuse/core'
export const useDragStore = defineStore('drag', () => {
  const signalStore = useSignalStore()
  const monitorStore = useMonitorStore()
  const pumpStore = usePumpStore()

  const leftArr = useStorage<Array<'monitor' | 'pump' | 'signal'>>('dragLeft', [])
  const rightArr = useStorage<Array<'monitor' | 'pump' | 'signal'>>('dragRight', [])

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

  const fixedWidth = computed(() => {
    return {
      monitor: monitorStore.fixedWidth,
      pump: pumpStore.fixedWidth,
      signal: signalStore.fixedWidth
    }
  })
  const isRightFixed = computed(() => {
    return {
      monitor: monitorStore.isRightFixed,
      pump: pumpStore.isRightFixed,
      signal: signalStore.isRightFixed
    }
  })
  const isLeftFixed = computed(() => {
    return {
      monitor: monitorStore.isLeftFixed,
      pump: pumpStore.isLeftFixed,
      signal: signalStore.isLeftFixed
    }
  })
  const visible = computed(() => {
    return {
      monitor: monitorStore.visible,
      pump: pumpStore.visible,
      signal: signalStore.signalVisible
    }
  })
  // (!('shouldHide' in storeItem) || !storeItem.shouldHide)
  const shouldHide = computed(() => {
    return {
      monitor: false,
      pump: pumpStore.shouldHide,
      signal: signalStore.shouldHide
    }
  })
  const leftWidth = computed(() => {
    const index1 =leftArr.value.findIndex(el => el === 'signal')
    const index2 =leftArr.value.findIndex(el => el === 'monitor')
    const index3 =leftArr.value.findIndex(el => el === 'pump')
    let monitor=0
    let pump=0
    let signal=0
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
    })
    return {
      monitor,
      pump,
      signal
    }
  })
  const rightWidth = computed(() => {
    const index1 = rightArr.value.findIndex(el => el === 'signal')
    const index2 =rightArr.value.findIndex(el => el === 'monitor')
    const index3 =rightArr.value.findIndex(el => el === 'pump')
    let monitor=0
    let pump=0
    let signal=0
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
    })
    console.log('rightWidth', monitor, pump, signal)
    return {
      monitor:monitorStore.winWidth-fixedWidth.value['monitor']-(Number(monitor)||0),
      pump:monitorStore.winWidth-fixedWidth.value['pump']-(Number(pump)||0),
      signal:monitorStore.winWidth-fixedWidth.value['signal']-(Number(signal)||0)
    }
  })
  return {
    leftWidth,
    rightWidth
    // visible,
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
