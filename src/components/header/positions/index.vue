<template>
  <div class="flex-center text-12px clickable-btn tg-name-box" @click="visible = true">
    <span class="left-num">{{holderNum}}</span>
    <span>{{ $t('positions') }}</span>
  </div>
  <component :is="lazyComponent" v-model="visible" :tableFilter="tableFilter">
    <div class="flex justify-between items-center pt-0 pb-0 pl-0 pr-15px w-320px">
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
         v-if="botStore.evmAddress"
         v-model:userIds="tableFilter.user_ids"
        @update:user-ids="handleChange"
       />
   </div>
  </component>
</template>

<script setup lang='ts'>
import {getUserBalance} from '~/api/swap'

const botStore = useBotStore()
const walletStore = useWalletStore()
let userIds: string[] = []
const tableFilter = ref({
  hide_risk: 1,
  hide_small: 0,
  user_ids: userIds
})
const visible=ref(false)
const holderNum = ref(0)
const fetchHolderNum = async () => {
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

watch(tableFilter, () => {
  // console.log('tableFilter changed', val)
  fetchHolderNum()
}, { deep: true })

watch(() => visible.value, (newValue) => {
  if (newValue) {
    loadComponent()
  }
})
watch([() => botStore.userInfo, () => walletStore.address], () => {
  if (botStore.userInfo) {
    userIds = botStore.userInfo.addresses.map(({address, chain}) => address + '-' + chain)
    tableFilter.value.user_ids = userIds
    fetchHolderNum()
  } else if (walletStore.address) {
    userIds = [walletStore.address + '-' + walletStore.chain]
    tableFilter.value.user_ids = userIds
    fetchHolderNum()
  }
}, { immediate: true })

onMounted(() => {
})

</script>

<style scoped lang='scss'>
.tg-name-box {
  margin-left: 10px;
  color: var(--d-E9E9E9-l-222);
  height: 32px;
  cursor: pointer;
  background: var(--d-222-l-F2F2F2);
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
