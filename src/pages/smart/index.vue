<script setup lang="ts">
import SignalContainer from './components/signal/signalContainer.vue'
import {getTopSignal, type ITopSignal} from '~/api/signal'
import {useStorage} from '@vueuse/core'

const configStore = useConfigStore()
const smartChains = computed(() => {
  return ['solana', 'bsc'].map(value => {
    return {
      label: getChainInfo(value)?.name,
      value
    }
  })
})
const activeChain = shallowRef('solana')

const dialogValues = ref<{
  visible: boolean
  loading: boolean
  list: ITopSignal[]
}>({
  visible: false,
  loading: false,
  list: []
})

async function setDialogVisible() {
  dialogValues.value.visible = true
  dialogValues.value.loading = true
  try {
    const res = await getTopSignal()
    dialogValues.value.list = res || []
  } finally {
    dialogValues.value.loading = false
  }
}

const quickBuyValue = useStorage('quickBuyValue', '0.01')
</script>

<template>
  <div class="w-full">
    <div class="p-12px flex justify-between">
      <div class="flex gap-8px">
        <span class="py-8px text-14px px-12px rounded-4px bg-[--d-333-l-CCC] flex items-center justify-center">
          {{ $t('signal2') }}
        </span>
      </div>
      <div class="flex">
        <div class="flex items-center mr-24px">
          <span
            class="transition-all transition-duration-300 px-8px py-6px  rounded-4px bg-#FFA6221A text-12px color-#FFA622 cursor-pointer hover:bg-#FFA622 hover:color-#333"
            @click="setDialogVisible"
          >{{
              $t('SignalTopList')
            }}</span>
          <QuickSwapSet
            v-model:quickBuyValue="quickBuyValue"
            :chain="activeChain"
            style="margin-left: 20px;"
            :showQuickAmount="false"
          />
        </div>
        <div class="p-2px rounded-4px bg-[--d-333-l-F2F2F2] flex">
          <div
            v-for="({label,value}) in smartChains"
            :key="value"
            class="flex items-center justify-center gap-4px px-8px py-6px text-12px rounded-4px cursor-pointer"
            :class="`${activeChain===value?'bg-[--d-111-l-FFF]':''}`"
            @click="activeChain=value"
          >
            <img class="w-16px h-16px rounded-full" :src="`${configStore.token_logo_url}chain/${value}.png`" alt="">
            {{ label }}
          </div>
        </div>
      </div>
    </div>
    <SignalContainer
      :activeChain="activeChain"
      :quickBuyValue="quickBuyValue"
    />

    <el-dialog
      v-model="dialogValues.visible"
      :title="$t('SignalTopList')"
      append-to-body
      width="540px"
      :class="`[--el-message-close-size:24px]`"
    >
      <el-table row-class-name="[--el-table-tr-bg-color:--d-222-l-FFF]" :data="dialogValues.list" :height="400">
        <el-table-column
          type="index"
          :label="$t('ranking')"
          label-class-name="text-12px color-[--d-666-l-999]"
        >
          <template #default="{$index}">
            <img v-if="$index+1===1" src="@/assets/images/111.svg">
            <img v-else-if="$index+1===2" src="@/assets/images/222.svg">
            <img v-else-if="$index+1===3" src="@/assets/images/333.svg">
            <div v-else class="text-12px color-[--d-666-l-999] text-center">{{ $index + 1 }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('token')"
          label-class-name="text-12px color-[--d-666-l-999]"
        >
          <template #default="{row}">
            <div
              class="flex items-center text-12px gap-8px cursor-pointer"
              @click="navigateTo(`/token/${row.token}-${row.chain}`)"
            >
              <TokenImg
                chain-class="hidden"
                :row="{
                     chain:row.chain,
                     symbol:row.symbol,
                     logo_url:row.logo_url,
                  }"
              />
              <span class="shrink-0 whitespace-nowrap text-ellipsis overflow-hidden max-w-80px">{{ row.symbol }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="80"
          :label="$t('firstSignal')"
          label-class-name="text-12px color-[--d-666-l-999]"
        >
          <template #default="{row}">
            <span class="color-[--d-FFF-l-222] text-12px">{{ formatDate(row.first_signal_time, 'HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="110"
          :label="$t('firstMarketCap')"
          label-class-name="text-12px color-[--d-666-l-999]"
        >
          <template #default="{row}">
            <span class="color-[--d-FFF-l-222] text-12px"> ${{ formatNumber(row.first_signal_mc, 2) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="130"
          align="right"
          :label="$t('MaximumIncrease')"
          label-class-name="text-12px color-[--d-666-l-999]"
        >
          <template #default="{row}">
            <div class="text-20px text-right color-#12B886">{{ parseInt(row.max_price_change) }}x</div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">

</style>
