<template>
  <div class="w-lineLight h-64px w-100% px-10px pt-12px border-b-1px border-b-solid border-b-[--d-FFFFFF08-l-33333308]" :class="isHidden && 'h-0px! border-b-0px p-0px!'">
    <ul v-if="!isHidden" class="flex gap-24px">
      <li class="flex gap-8px">
        <div>
          <div class="font-400 text-12px lh-16px tracking-0px color-[--d-666-l-999] mb-4px flex items-center">
            {{ t('holdersNum') }}{{ holders1M?'(1m)':'(1h)' }}
            <Icon name="material-symbols:chevron-right-rounded" class="ml-4px text-14px" @click.stop="popVisible = true"/>
          </div>
          <div class="font-500 text-14px lh-16px tracking-0px color-[--d-FFF-l-333]">{{ formatNumber(holdersNum,4) }}</div>
        </div>
        <lineS  class="w-120px h-40px" :dataList="dataList1" :loading="loading1" :showSeries="[false, false]"  :showLeft="showLeft1" />
      </li>
      <li class="flex gap-8px">
        <div>
          <div class="font-400 text-12px lh-16px tracking-0px color-[--d-666-l-999] mb-4px flex items-center">
            <span class="w-38px">
              Top{{topN}}
            </span>
            <Icon name="custom:exchange-horizontal" class="ml-4px color-[--d-666-l-999] text-10px clickable" @click.stop="dataType2++"/>
            <Icon name="material-symbols:chevron-right-rounded" class="ml-4px text-14px" @click.stop="popVisible = true"/>
          </div>
          <div class="font-500 text-14px lh-16px tracking-0px color-[--d-FFF-l-333]">{{  `${formatNumber(Math.abs(Number(holdersAvg) * 100), 2)}%` }}</div>
        </div>
        <lineS  class="w-120px h-40px" :dataList="dataList2" :loading="loading2" :showSeries="[false, false]"  :showLeft="showLeft2" />
      </li>
      <!-- <li class="flex-1"/>
      <li class="flex-1"/>
      <li class="flex-1"/> -->
    </ul>
    <div :class="['bg-[--d-222-l-F2F2F2] w-20px h-12px flex items-center justify-center mx-auto cursor-pointer transition-all duration-0.4s', isHidden && 'rotate-z-180 origin-center']" @click="isHidden = !isHidden">
      <Icon name="material-symbols:keyboard-arrow-up" class="color-[--d-CCC-l-333]"/>
    </div>
    <RightPop v-model="popVisible" :holdersNum="Number(holdersNum)"/>
  </div>
</template>

<script setup lang="ts">
import lineS from './components/lineS.vue'
import RightPop from './rightPop.vue'

import {
  getHoldersTokenCountLight,
  getHoldersTokenHoldersLight,
} from '@/api/holders'

const { t } = useI18n()
const route = useRoute()
// const id = computed(() => route.params.id as string)
const {token} = storeToRefs(useTokenStore())


let timer:number

const popVisible=ref<boolean>(false)
const holdersNum= ref<number|string>(0)
const holdersAvg= ref<number|string|undefined>(0)
const holders1M= ref<boolean>(true)
const showLeft1= ref<boolean>(false)
const loading1= ref<boolean>(false)
const dataList1 = ref<any[]>([])
const showLeft2= ref<boolean>(false)
const loading2= ref<boolean>(false)
const dataList2 = ref<any[]>([])
const dataType2 = ref(0)
const dataTypeArr2 = ref(['100','10'])

const isHidden = ref(false)

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

function init1() {
  _getHoldersTokenCountLight()
  if(!holders1M.value){
    clearTimeout(timer)
  }
  timer=setTimeout(() => {
    if(holders1M.value){
       init1()
    }
  },6000)
}

function _getHoldersTokenCountLight(){
  loading1.value = true
  getHoldersTokenCountLight(addressAndChain.value.address, addressAndChain.value.chain).then(res => {
    console.log('getHoldersTokenCountLight', res)
    loading1.value = false
    if(res.token_count_data && res.token_count_data.length){
      holdersNum.value = res.token_count_data[res.token_count_data.length-1]?.holders_count
      holders1M.value = new Date().getTime() - res.create_time * 1000 <  12 * 60 * 60 * 1000
      dataList1.value = res.token_count_data.map(i=>{
        return {
          ...i,
          value1: i.holders_count
        }
      })
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
  loading2.value = true
  getHoldersTokenHoldersLight(addressAndChain.value.address, addressAndChain.value.chain,topN.value).then(res => {
    console.log('getHoldersTokenHoldersLight', res)
    if(res.token_holder_ratio && res.token_holder_ratio.length){
      holdersAvg.value = res.token_holder_ratio[res.token_holder_ratio.length-1]?.top100_ratio
      dataList2.value = res.token_holder_ratio.map(i=>{
        return {
          ...i,
          value1: i.top100_ratio
        }
      })
    }
  }).finally(() => {
      loading2.value = false
    }).catch((err: any) => {
    holdersAvg.value = 0
    console.error(err)
    dataList2.value = []
  })
}

function init() {
  init1()
  init2()
}
onActivated(() => {
  init()
})

onDeactivated(() => {
  clearTimeout(timer)
})
onUnmounted(() => {
  clearTimeout(timer)
})
watch(()=>addressAndChain.value.address, (val) => {
  console.log('token changed', val)
  init()
}, {immediate: false})

watch(()=>topN.value, (val) => {
  console.log('topN changed', val)
  init2()
})
watch(()=>isHidden.value, (val) => {
  console.log('isHidden changed', val)
  if(!val){
    if(!holders1M.value)return 
    init1()
  }else{
    clearTimeout(timer)
  }
})
// onMounted(() => {
//   init()
// })
</script>


