<template>
  <div class="flex-center text-12px clickable-btn tg-name-box" @click="visible = true">
    <span class="left-num">{{holderNum}}</span>
    <span>{{ $t('positions') }}</span>
  </div>
  <component :is="lazyComponent" v-model="visible" :tableFilter="tableFilter">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-30px pt-0 pb-0 pl-0 pr-15px">
        <el-checkbox
          v-model="tableFilter['hide_risk']"
          class="h-24px"
          :style="{
            marginRight:0
          }"
          size="small" :true-value="1" :false-value="0"
        >
          {{ $t('hideRiskTokenShort') }}
        </el-checkbox>
        <el-checkbox
          v-model="tableFilter['hide_small']"
          size="small" :true-value="1" :false-value="0"
        >
          {{ $t('hideSmallAssets1') + '<1USD' }}
        </el-checkbox>
        <NetSelect
          v-if="botStore.evmAddress||(walletStore.address && isEvmChainWallet && (walletStore.walletName!=='WatchWallet'))"
          v-model:userIds="tableFilter.user_ids"
        @update:user-ids="handleChange"
        />
      </div>
      <BlackList
        :userIds="tableFilter.user_ids"
        @addWhite="()=>{}"
      />
    </div>
  </component>
</template>

<script setup lang='ts'>
import {getUserBalance} from '~/api/swap'
import BlackList from './blackList.vue'
const botStore = useBotStore()
const walletStore = useWalletStore()
const {hide_small,hide_risk} = storeToRefs(useGlobalStore())
const {updateHolderNum}= storeToRefs(useUserStore())
let userIds: string[] = []


const tableFilter = ref({
  hide_risk,
  hide_small,
  user_ids: userIds
})
const visible=ref(false)
const holderNum = ref(0)
const fetchHolderNum = async () => {
  console.log('fetchHolderNum', tableFilter.value)
  try {
    const res = await getUserBalance({pageNO: 1, pageSize: 1, ...tableFilter.value})
    holderNum.value = res.total
  } catch (e) {
    console.error('Error fetching user balance:', e)
    holderNum.value = 0
  }
}
const lazyComponent = shallowRef<Component | null>(null)
const loadComponent = async () => {
  const component = await import('./positionsTable.vue')
  lazyComponent.value = component.default
}

// Add handleChange method to handle user-ids update
function handleChange(newUserIds: string[]) {
  console.log('handleChange userIds', newUserIds)
  tableFilter.value.user_ids = newUserIds
}

const isEvmChainWallet = computed(() => {
  return getChainInfo(walletStore.chain)?.vm_type === 'evm'
})

watch(()=>updateHolderNum.value, () => {
  fetchHolderNum()
})
watch(tableFilter, () => {
  fetchHolderNum()
}, { deep: true })

watch(() => visible.value, (newValue) => {
  if (newValue) {
    loadComponent()
  }
})
watch([() => botStore.userInfo, () => walletStore.address, () => walletStore.chain], () => {
  console.log('userInfo changed', botStore.userInfo)
  if (botStore.userInfo) {
    userIds = botStore.userInfo.addresses.map(({address, chain}) => address + '-' + chain)
    tableFilter.value.user_ids = userIds
  } else{
    if (walletStore.address && isEvmChainWallet.value && (walletStore.walletName!=='WatchWallet')) {
      userIds = [walletStore.address + '-' + 'bsc', walletStore.address + '-' + 'base', walletStore.address + '-' + 'eth']
      tableFilter.value.user_ids = userIds
    }
    else {
      userIds = [walletStore.address + '-' + walletStore.chain]
      tableFilter.value.user_ids = userIds
    }
    fetchHolderNum()
  }
}, { immediate: true })

onMounted(() => {
})

</script>

<style scoped lang='scss'>
.tg-name-box {
  margin-left: 8px;
  color: var(--main-text);
  height: 32px;
  cursor: pointer;
  background: var(--main-input-button-bg);
  border-radius: 4px;
  padding: 0 10px;
  min-width: 60px;
  .left-num {
    background: transparent;
    border: 1px solid;
    border-radius: 4px;
    height: 20px;
    line-height: 20px;
    min-width: 20px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 5px;
  }
}
.bot-position {
  --custom-bg-1-color: transparent;
}
.clickable-btn {
  cursor: pointer;
  &:active {
    opacity: 0.5;
  }
  &:hover {
    opacity: 0.8;
  }
}
</style>
