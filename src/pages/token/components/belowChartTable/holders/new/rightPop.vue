<template>
  <el-drawer  v-model="visible" class="bg-[--d-222-l-FFF]! rounded-tl-10px rounded-bl-10px border-none" :size="480" append-to-body :with-header="false">
    <div class="h-70px flex items-center px-20px font-500 text-20px lh-30px tracking-0% color-[--d-F5F5F5-l-333] border-b-1px border-b-solid border-b-[--d-333-l-F5F5F5]">
      {{ $t('holdersAnalysis') }}
    </div>
    <div class="justify-between flex items-center h-80px px-20px">
      <div class="flex items-center">
        <Icon
          name="material-symbols:kid-star"
          class="color-[--d-999-l-666] h-16px w-16px clickable mr-12px"
          :class="collected ? 'color-#ffbb19' : ''"
          @click="collect"
        />
        <TokenImg
          tokenClass='w-40px h-40px' 
          chainClass="w-20px h-20px bottom--2px! right--2px!"
          :row="{
          logo_url:token?.logo_url || '',
          chain:addressAndChain?.chain || ''
        }"
        />
        <div class="flex flex-col justify-between ml-8px h-40px">
          <div class="flex items-center gap-8px h-20px">
            <span class="font-500 text-16px lh-20px tracking-0px">{{ token?.symbol }}</span>
            <span class="font-500 text-10px lh-20px tracking-0px color-[--d-666-l-999]">{{ addressAndChain?.address?.replace(new RegExp('(.{4})(.+)(.{4}$)'), '$1...$3')  }}</span>
            <Icon
              v-copy="addressAndChain?.address" name="bxs:copy"
              class="cursor-pointer text-10px color-[--d-666-l-999]"
            />
          </div>
          <div class="flex items-center gap-4px h-14px justify-start"> 
            <span class="font-500 text-10px lh-20px tracking-0px color-[--d-666-l-999]">{{ $t('holdersNumTotal') }}</span>
            <span class="font-400 text-12px lh-14px tracking-0px">{{ formatNumber(holdersNum,4) }}</span>
          </div>
        </div>
        <!-- <span v-if="symbol.source" class="text-12px color-[--d-999-l-666] mr-8px">/ {{ symbol.source }}</span> -->
      </div>
      <div
        class="flex items-center border-solid border-0.5px color-#999 border-[--d-333-l-F2F2F2] rounded-4px h-28px"
      >
        <span
          v-for="(item, index) in timeList"
          :key="index"
          :class="`px-14px py-4px text-12px hover:opacity-80 cursor-pointer ${item.id===activeTime? 'color-[--d-F5F5F5-l-333] bg-[--d-333-l-F2F2F2]':''}`"
          @click="switchTimeTab(item.id)"
        >
          {{ item.name }}
        </span>
      </div>
    </div>
    <div class="px-20px py-20px">
      <Line v-if="dataList1.length > 0||loading1" class="w-440px h-210px relative" :dataList="dataList1" :loading="loading1" :showSeries="[false]"  :showLeft="false"/>
      <Line2 v-if="dataList2.length > 0" class="w-440px h-210px relative" :dataList="dataList2" :loading="loading2" :showSeries="[true,true,true]"  :showLeft="showLeft"/>
    </div>
  </el-drawer>
</template>
<script setup lang="ts">

import {
  addFavorite,
  removeFavorite,
  getFavoriteCheck
} from '@/api/fav'
import {
  getHoldersTokenCountInterval,
  getHoldersTokenTopHoldersRatio,
} from '@/api/holders'
import { useEventBus } from '@vueuse/core'

import Line from './components/line.vue'
import Line2 from './components/line2.vue'
const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
const topEventBus = useEventBus(BusEventType.TOP_FAV_CHANGE)
const route = useRoute()
const {collected} = storeToRefs(useTokenStore())
const { t } = useI18n()
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  holdersNum: {
    type: Number,
    default: 0
  }
})
const showLeft= shallowRef<boolean>(false)

const timeList = computed(() => [
  {name: '1m', id: '1m'},
  {name: '5m', id: '5m'},
  {name: '1h', id: '1h'},
  {name: '4h', id: '4h'},
])
const activeTime = shallowRef<string>('1m')
const loading1= ref<boolean>(false)
const dataList1 = ref<any[]>([])
const loading2= ref<boolean>(false)
const dataList2 = ref<any[]>([])
const {token} = storeToRefs(useTokenStore())
const { evmAddress } = storeToRefs(useBotStore())
const walletStore = useWalletStore()
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

const visible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})
const walletAddress = computed(() => {
  return evmAddress.value || walletStore.address
})
function switchTimeTab(item: string) {
  activeTime.value = item
  init()
}
const init = () => {
  init1()
  // init2()
  // showLeft.value=!showLeft.value
  // setTimeout(() => {
  //   // init1()
  //   showLeft.value = true
  // },1000)
  // init2()
}

function init1() {
  loading1.value = true
  getHoldersTokenCountInterval(addressAndChain.value.address, addressAndChain.value.chain,activeTime.value).then(res => {
    console.log('getHoldersTokenCountInterval', res)
    loading1.value = false
    if(Array.isArray(res) && res.length){
      dataList1.value = res.map(i=>{
        return {
          ...i,
          value1: i.holders_count,
          time: formatDate(new Date(Number(i?.time)*1000).getTime() , 'MM-DD HH:mm'),
        }
      })
    }
  }).finally(() => {
      loading1.value = false
  }).catch((err: any) => {
    console.error(err)
    dataList1.value = []
  })
}
function init2() {
  loading2.value = true
  getHoldersTokenTopHoldersRatio(addressAndChain.value.address, addressAndChain.value.chain,activeTime.value).then(res => {
    console.log('getHoldersTokenTopHoldersRatio', res)
    // if(res.token_holder_ratio && res.token_holder_ratio.length){
    //   dataList2.value = res.token_holder_ratio.map(i=>{
    //     return {
    //       ...i,
    //       value1: i.top100_ratio
    //     }
    //   })
    // }
  }).finally(() => {
      loading2.value = false
    }).catch((err: any) => {
    console.error(err)
    dataList2.value = []
  })
}

function getTokenFavoriteCheck() {
  getFavoriteCheck(addressAndChain.value?.address+'-'+addressAndChain.value?.chain, walletAddress.value)
    .then((res) => {
      collected.value = res?.address ? true : false
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {})
}
async function collect() {
  if (walletAddress.value) {
    if (walletStore.address) {
      await walletStore.signMessageForFavorite()
    }
    if (collected.value) {
      removeTokenFavorite()
    } else {
      addTokenFavorite()
    }
  } else {
    verifyLogin()
  }
}
function addTokenFavorite() {
  // loading.value = true
  addFavorite(addressAndChain.value?.address+'-'+addressAndChain.value?.chain, walletAddress.value)
    .then(() => {
      ElMessage.success(t('collected'))
      collected.value = true
      topEventBus.emit()
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      // loading.value = false
    })
}
function removeTokenFavorite() {
  // loading.value = true
  removeFavorite(addressAndChain.value?.address+'-'+addressAndChain.value?.chain, walletAddress.value)
    .then(() => {
      ElMessage.success(t('cancelled1'))
      collected.value = false
      topEventBus.emit()
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      // loading.value = false
    })
}
// onMounted(() => {
//   getTokenFavoriteCheck()
//   init()
// })

watch(() => visible.value, (val) => {
  if (val) {
    getTokenFavoriteCheck()
    init()
  }
})

watch(()=>addressAndChain.value.address, (val) => {
  console.log('token changed', val)
  getTokenFavoriteCheck()
  init()
}, {immediate: true})
</script>
