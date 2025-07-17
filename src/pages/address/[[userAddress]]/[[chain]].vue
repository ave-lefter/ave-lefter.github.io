<template>
  <div
    v-if="userAddress && chain "
    className="w-full h-full bg-[--d-000-l-fff] pb-0"
  >
    <div
      v-if="['bsc', 'solana'].includes(chain)"
      className="flex flex-col w-full gap-3 p-[20px] pt-[10px] pb-0"
    >
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
            v-for="{ chain: _chain } in smartChains"
            :key="_chain"
            :label="getChainInfo(_chain)?.name"
            :value="_chain"
          >
            <div class="flex-center" style="gap: 4px">
              <ChainToken :chain="_chain" :width="16" />
              {{ getChainInfo(_chain)?.name }}
            </div>
          </el-option>
        </el-select>
        <!-- <el-radio-group
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
        </el-radio-group> -->
        <ButtonGroup
          v-model:active-value="interval"
          class="mt--5px"
          :options="options"
        />
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
      <ActivityCharts :interval="interval" :address="userAddress" :chain="chain" />
      <StatisticsTable
        ref="statisticsTable"
        :address="userAddress"
        :chain="chain"
        :isSelfAddress="isSelfAddress"
      />
    </div>
    <PageOther
      v-else
      :address="userAddress"
      :chain="chain"
    />
  </div>
  <PageBlank v-else />
</template>
<script setup>
import Statistic from './components/statistic.vue'
import TradeData from './components/tradeData.vue'
import StatisticsTable from './components/statisticsTable.vue'
import ActivityCharts from './components/activityCharts.vue'
import PageBlank from './components/pageBlank.vue'
import PageOther from './components/pageOther.vue'
import { getChainInfo } from '@/utils'

const interval = ref('7D')
const route = useRoute()
const botStore = useBotStore()
const walletStore = useWalletStore()
const chain = computed(() => {
  if (route.params.chain) {
    return route.params.chain
  }
  if (botStore?.userInfo?.evmAddress) {
    return 'solana'
  }
  return walletStore.chain || ''
})
const userAddress = computed(() => {
  if (route.params.userAddress) {
    return route.params.userAddress
  }
  if (botStore?.userInfo?.evmAddress) {
    return botStore.getWalletAddress('solana')
  }
  return walletStore.address || ''
})
const { t } = useI18n()
const statisticRef = ref(null)
const statisticsTable = ref(null)
const options = [
  {
    name: `24${t('H')}`,
    id: '24H',
  },
  {
    name: `7${t('D')}`,
    id: '7D',
  },
  {
    name: `30${t('D')}`,
    id: '30D',
  },
]

const isSelfAddress = computed(() => {
  return userAddress.value === botStore.getWalletAddress(chain.value) || walletStore.address === userAddress.value
})
const intervalText = computed(() => {
  return options.find((item) => interval.value === item.id)?.name
})
const smartChains = computed(() => {
  const chainIds = ['solana', 'bsc']
  // 如果是自己的钱包地址且为 bot 钱包那么展示所有的链，链钱包后面再改
  if (botStore.evmAddress && isSelfAddress.value) {
    const botChains = botStore.userInfo?.addresses?.filter?.((el) => chainIds.includes(el.chain))
    if (botChains && botChains.length > 0) {
      return botChains
    }
  }
  return [
    {
      chain: chain.value,
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
  }
)

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
