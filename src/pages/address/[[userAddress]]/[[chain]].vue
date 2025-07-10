<template>
  <div v-if="userAddress && chain" className="flex flex-col w-full gap-3 p-[20px] pt-[10px] bg-[var(--d-111-l-FFF)] pb-0">
    <div class="flex-between">
      <el-select
        :style="{ width: '120px' }"
        :model-value="chain"
        @update:model-value="
          (val) => {
            navigateTo(`/address/${botStore.getWalletAddress(val)}/${val}`)
          }
        "
      >
        <template #prefix>
          <ChainToken :chain="chain" :width="16" />
        </template>
        <el-option
          v-for="{ chain:_chain } in smartChains"
          :key="_chain"
          :label="getChainInfo(_chain)?.name"
          :value="_chain"
        >
          <div class="flex-center" style="gap: 4px">
            <ChainToken :chain="_chain" :width="16"/>
            {{ getChainInfo(_chain)?.name }}
          </div>
        </el-option>
      </el-select>
      <el-radio-group
        v-model="interval"
        class="m-radio-group"
        size="small"
        :fill="themeStore.isDark ? '#333' : '#ccc'"
        :text-color="themeStore.isDark ? '#F5F5F5' : '#FFF'"
        @change="(v) => console.log('v', v)"
      >
        <el-radio-button
          v-for="option in options"
          :key="option.id"
          v-model="interval"
          :label="option.name"
          :value="option.id"
        />
      </el-radio-group>
    </div>

    <div class="flex align-stretch">
      <Statistic
        ref="statisticRef"
        :isSelfAddress="isSelfAddress"
        :address="userAddress"
        :chain="chain"
        :interval="interval"
        :intervalText="intervalText"
      />
      <TradeData
        :interval="interval"
        :intervalText="intervalText"
        :address="userAddress"
        :chain="chain"
        @txAnalysisChange="txAnalysisChange"
      />
    </div>
    <ActivityCharts
      :interval="interval"
      :address="userAddress"
      :chain="chain"
    />
    <StatisticsTable
      ref="statisticsTable"
      :address="userAddress"
      :chain="chain"
      :isSelfAddress="isSelfAddress"
    />
  </div>

  <div v-else class="flex flex-col w-full h-full p-[10%] bg-[var(--d-111-l-FFF)] items-center pb-0">
    <div
      :class="`color-[var(--d-F5F5F5-l-333)] bg-[--d-111-l-FFF] rounded-2px text-14px overflow-hidden`"
    >
      <AveEmpty  class="overflow-hidden">
        <span class="text-12px mt-10px">{{ $t('noWalletTip') }}</span>
        <el-button
          class="mt-10px"
          @click="
            botStore.$patch({
              connectVisible: true,
            })
          "
        >
          {{ $t('connectWallet') }}
        </el-button>
      </AveEmpty>
    </div>
  </div>
</template>
<script setup>
import Statistic from './components/statistic.vue'
import TradeData from './components/tradeData.vue'
import StatisticsTable from './components/statisticsTable.vue'
import ActivityCharts from './components/activityCharts.vue'
import { getChainInfo } from '@/utils'

const interval = ref('7D')
const route = useRoute()
const botStore = useBotStore()
const chain = computed(() => route.params.chain)
const userAddress = computed(() => route.params.userAddress)
const $t = getGlobalT()
const statisticRef = ref(null)
const statisticsTable = ref(null)
const themeStore = useThemeStore()

const options = [
  {
    name: `24${$t('H')}`,
    id: '24H',
  },
  {
    name: `7${$t('D')}`,
    id: '7D',
  },
  {
    name: `30${$t('D')}`,
    id: '30D',
  },
]

const isSelfAddress = computed(() => {
  return userAddress.value === botStore.getWalletAddress(chain.value)
})
const intervalText = computed(() => {
  return options.find((item) => interval.value === item.id)?.name
})
const smartChains = computed(() => {
  const chainIds = ['solana', 'bsc']
  // 如果是自己的钱包地址且为 bot 钱包那么展示所有的链，链钱包后面再改
  if (botStore.evmAddress && isSelfAddress.value) {
    const botChains = botStore.userInfo?.addresses?.filter?.(el => chainIds.includes(el.chain))
    if (botChains && botChains.length > 0) {
      return botChains
    }
  }
  return [
    {
      chain:chain.value,
    },
  ]
})

function txAnalysisChange(data) {
  if (statisticRef.value) {
    statisticRef.value.mergeStatistics(data) // 调用子组件方法
  }
}

const router = useRouter()
watch(() => botStore.getWalletAddress('solana'), (address, old) => {
  if (!old && address) {
    router.replace('/address/' + address + '/solana')
  }
})

// Watchers
// watch(
//   route,
//   (to) => {
//     if (to.name === 'Balance') {
//       if (to.params?.chain && to.params?.userAddress) {
//         address = to.params.userAddress
//         chain = to.params.chain
//       } else if (currentAccount.value) {
//         address = currentAccount.value
//         chain.value = netId.value
//       }
//       statisticsTable.value?.onRouteChange()
//     }
//   },
//   { deep: true }
// )
//
// watch(currentAccount, (val) => {
//   if (val) {
//     address.value = val
//     chain.value = netId.value
//     statisticsTable.value?.onRouteChange()
//   } else {
//     address.value = ''
//     chain.value = ''
//     statisticsTable.value?.resetData()
//   }
// })

// watch(chain, () => {
//   address.value = add || currentBot.value.address || currentAccount.value
// })

// watch(() => bot.value?.userInfo?.evmAddress, () => {
//   address.value = paramsAddress.value || currentBot.value.address || currentAccount.value
// })
</script>

<style scoped lang="scss">
.m-radio-group {
  :deep()
    .el-radio-button
    .el-radio-button__original-radio:not(:disabled)
    + .el-radio-button__inner {
    border-color: var(--d-333-l-666);
  }
}
</style>
