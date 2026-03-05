<template>
  <div v-if="['solana','bsc']?.includes(addressAndChain.chain)" class="w-lineLight h-52px w-100% px-10px border-b-1px border-b-solid border-b-[--main-divider] mb-12px" :class="isHidden && 'h-0px! border-b-0px p-0px!'">
    <ul v-if="!isHidden" class="flex gap-24px">
      <li class="flex gap-8px" @click.stop="popVisible = true">
        <div class="clickable">
          <div class="font-400 text-12px lh-16px tracking-0px color-[--third-text] mb-4px flex items-center">
            {{ t('holdersNum') }}{{ holders1M?'(1m)':'(1h)' }}
            <Icon name="material-symbols:chevron-right-rounded" class="ml-4px text-14px"/>
          </div>
          <div class="font-500 text-14px lh-16px tracking-0px color-[--main-text]">{{ formatNumber(holdersNum,4) }}</div>
        </div>
        <lineS  class="w-120px h-40px" :dataList="dataList1" :loading="loading1" :showSeries="[false, false]"  :showLeft="showLeft1" />
      </li>
      <li class="flex gap-8px"  @click.stop="popVisible = true">
        <div class="clickable">
          <div class="font-400 text-12px lh-16px tracking-0px color-[--third-text] mb-4px flex items-center">
            <span class="w-38px">
              Top{{topN}}
            </span>
            <Icon name="custom:exchange-horizontal" class="ml-4px color-[--third-text] text-10px clickable" @click.stop="dataType2++"/>
            <Icon name="material-symbols:chevron-right-rounded" class="ml-4px text-14px"/>
          </div>
          <div class="font-500 text-14px lh-16px tracking-0px color-[--main-text]">{{  `${formatNumber(Math.abs(Number(holdersAvg) * 100), 2)}%` }}</div>
        </div>
        <lineS  class="w-120px h-40px" :dataList="dataList2" :loading="loading2" :showSeries="[false, false]"  :showLeft="showLeft2" />
      </li>
      <li class="flex gap-8px"  @click.stop="popVisible = true">
        <div class="clickable">
          <div class="font-400 text-12px lh-16px tracking-0px color-[--third-text] mb-4px flex items-center">
            <span class="">
              &gt;10U
            </span>
            <!-- <Icon name="custom:exchange-horizontal" class="ml-4px color-[--third-text] text-10px clickable" @click.stop="dataType3++"/> -->
            <Icon name="material-symbols:chevron-right-rounded" class="ml-4px text-14px"/>
          </div>
          <div class="font-500 text-14px lh-16px tracking-0px color-[--main-text]">{{  HoldersAbove10Usd }}</div>
        </div>
        <lineS  class="w-120px h-40px" :dataList="dataList3" :loading="loading1" :showSeries="[false, false]"  :showLeft="showLeft3" />
      </li>
      <!-- <li class="flex-1"/>
      <li class="flex-1"/>
      <li class="flex-1"/> -->
    </ul>
    <div :class="['bg-[--main-list-hover] w-20px h-12px flex items-center justify-center mx-auto cursor-pointer transition-all duration-0.4s', isHidden && 'rotate-z-180 origin-center']" @click="isHidden = !isHidden">
      <Icon name="material-symbols:keyboard-arrow-up" class="color-[--main-text]"/>
    </div>
    <RightPop v-if="popVisible" v-model="popVisible" :holdersNum="Number(holdersNum)" :activeTime="holders1M?'1m':'1h'"/>
  </div>
  <div v-else/>
</template>

<script setup lang="ts">
import lineS from './components/lineS.vue'
import RightPop from './rightPop.vue'

import {
  getHoldersTokenCountLight,
  getHoldersTokenHoldersLight,
} from '@/api/holders'

import { replaceNegOne } from '../utils'

const { t } = useI18n()
const route = useRoute()
// const id = computed(() => route.params.id as string)
const {token} = storeToRefs(useTokenStore())


let timer:number
const { clickHolderCount, popVisible } = storeToRefs(useGlobalStore())
const holdersNum= shallowRef<number|string>(0)
const HoldersAbove10Usd= shallowRef<number|string>(0)
const holdersAvg= shallowRef<number|string|undefined>(0)
const holders1M= shallowRef<boolean>(true)
const showLeft1= shallowRef<boolean>(false)
const loading1= shallowRef<boolean>(false)
const dataList1 = shallowRef<any[]>([])
const showLeft2= shallowRef<boolean>(false)
const showLeft3= shallowRef<boolean>(false)
const loading2= shallowRef<boolean>(false)
const dataList2 = shallowRef<any[]>([])
const dataType2 = shallowRef(0)

const dataList3 = shallowRef<any[]>([])
const dataTypeArr2 = shallowRef(['100','10'])

const isHidden = shallowRef(false)

const topN=computed(()=>{
  return dataTypeArr2.value[dataType2.value%2]
})
const addressAndChain = computed(() => {
  const id = route.params.id as string
  if (id) {
    return getAddressAndChainFromId(id)
  }
  return {
    address: token.value?.token || '',
    chain: token.value?.chain || '',
  }
})

const isInitialized = shallowRef(false) // 用于控制初始化

function init1() {
  if(!['solana','bsc']?.includes(addressAndChain.value?.chain)) return
  _getHoldersTokenCountLight()
  if(!holders1M.value){
    if(timer){
      clearTimeout(timer)
    }
  }
  timer=setTimeout(() => {
    if(holders1M.value){
       init1()
    }
  },20000)
}

function _getHoldersTokenCountLight(){
  loading1.value = true
  getHoldersTokenCountLight(addressAndChain.value.address, addressAndChain.value.chain).then(res => {
    console.log('getHoldersTokenCountLight', res)
    const arr = res?.token_count_data || []
    if(arr.length){
      replaceNegOne(arr,'holders_count')
      replaceNegOne(arr,'HoldersAbove10Usd')
      holdersNum.value = arr[arr.length-1]?.holders_count === -1 ? 0 : arr[arr.length-1]?.holders_count
      HoldersAbove10Usd.value = arr[arr.length-1]?.HoldersAbove10Usd === -1 ? 0 : arr[arr.length-1]?.HoldersAbove10Usd
      holders1M.value = new Date().getTime() - res.create_time * 1000 <  12 * 60 * 60 * 1000
      dataList1.value = arr.map(i=>{
        return {
          ...i,
          value1: i.holders_count
        }
      })
      dataList3.value=arr.map(i=>{
        return {
          ...i,
          value1: i.HoldersAbove10Usd
        }
      })
    }else{
      holdersNum.value = 0
      holders1M.value = false
      dataList1.value = []
      dataList3.value = []
    }
  }).finally(() => {
    loading1.value = false
  }).catch((err: any) => {
    holdersNum.value = 0
    holders1M.value = false
    console.error(err)
    dataList1.value = []
  })
}
function init2() {
  if(!['solana','bsc']?.includes(addressAndChain.value?.chain)) return
  loading2.value = true
  getHoldersTokenHoldersLight(addressAndChain.value.address, addressAndChain.value.chain,topN.value).then(res => {
    // console.log('getHoldersTokenHoldersLight', res)
    const arr = res?.token_holder_ratio || []
    // top_n_ratio
    if(arr.length){
      replaceNegOne(arr,'top_n_ratio')
      console.log('getHoldersTokenHoldersLight', arr)
      holdersAvg.value =  arr[arr.length-1]?.top_n_ratio === -1 ? 0 : arr[arr.length-1]?.top_n_ratio
      dataList2.value = arr.map(i=>{
        return {
          ...i,
          value1: Number(i.top_n_ratio)*10**8
        }
      })
    }else{
      holdersAvg.value = 0
      dataList2.value = []
    }
  }).finally(() => {
      loading2.value = false
    }).catch((err: any) => {
    loading2.value = false
    holdersAvg.value = 0
    console.error(err)
    dataList2.value = []
  })
}

function init() {
  // initialize()
  if(isInitialized.value) return
  if(timer){
    clearTimeout(timer)
  }
  init1()
  init2()
  isInitialized.value = true
}
// onActivated(() => {
//   console.log('activated')
//   init()
// })

// onDeactivated(() => {
//   if(timer){
//     clearTimeout(timer)
//   }
//   isInitialized.value = false
// })
onUnmounted(() => {
  if(timer){
    clearTimeout(timer)
  }
  isInitialized.value = false
})
watch(() => clickHolderCount.value, (val) => {
  if (val) {
    nextTick(() => {
      setTimeout(() => {
        popVisible.value = true
      }, 200)
    })
  }
},
{ flush: 'post' }
)
watch(()=>addressAndChain.value.address, (val) => {
  console.log('token changed', val)
  isInitialized.value = false
  init()
}, {immediate: false})

watch(()=>topN.value, (val) => {
  console.log('topN changed', val)
  init2()
})
watch(()=>isHidden.value, (val) => {
  console.log('isHidden changed', val)
  // if(!val){
  //   if(!holders1M.value)return
  //   init1()
  // }else{
  //   clearTimeout(timer)
  // }
})
onMounted(() => {
  console.log('onMounted')
  init()
})
</script>


