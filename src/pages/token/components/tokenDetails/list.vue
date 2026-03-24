<script setup lang="ts">
import type {CheckboxValueType} from 'element-plus'
import dayjs from 'dayjs'
import type {GetTokenDetailsListResponse} from '~/api/token'

const {t} = useI18n()
const tokenDetailsStore = useTokenDetailsStore()

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Array<number | string>,
    default: () => []
  },
  tableList: {
    type: Array<GetTokenDetailsListResponse>,
    default: () => []
  },
  loading:Boolean
})
const tokenStore = useTokenStore()
const isShowDate = ref(false)
const isPrice = ref(true)
const visible = ref(false)
const checkedTrend = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
const checkAll = ref(false)
const isIndeterminate = ref(false)

const list = computed(() => {
  return [
    {id: 'SWAP', name: t('swap_buy') + '/' + t('swap_sell')},
    {
      id: 'ADD_LIQUIDITY/REMOVE_LIQUIDITY',
      name: t('ADD_LIQUIDITY') + '/' + t('REMOVE_LIQUIDITY')
    },
    {id: 'TRANSFER', name: t('wallet_detail_transfer_in_out')},
    {id: 'BURN', name: t('BURN')},
    {id: 'MINT', name: t('mint1')}
  ]
})

function handleCheckAllChange(val: CheckboxValueType) {
  checkedTrend.value = val ? list.value.map(i => i.id) : []
  isIndeterminate.value = false
}

function handleCheckedChange(val: any[]) {
  const checkedCount = val.length
  checkAll.value = checkedCount === list.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < list.value.length
}

function filterType(type: 'swap_buy' | 'swap_sell' | 'AUTHORITY' | 'ADD_LIQUIDITY' | 'NEW_COIN' | 'MINT' | 'FREEZE' | 'transfer_in' | 'transfer_out' | 'BURN' | 'NEW_PAIR') {
  const o = {
    swap_buy: {
      name: t('swap_buy'),
      class: 'color-#12B886 bg-#12B886 bg-op-10'
    },
    swap_sell: {
      name: t('swap_sell'),
      class: 'color-#F6465D bg-#F6465D bg-op-10'
    },
    AUTHORITY: {
      name: t('AUTHORITY'),
      class: 'color-#F6465D bg-#F6465D bg-op-10'
    },
    ADD_LIQUIDITY: {
      name: t('ADD_LIQUIDITY'),
      class: 'color-#65C4ED bg-#65C4ED bg-op-10'
    },
    NEW_COIN: {
      name: t('NEW_COIN'),
      class: 'color-#12B886 bg-#12B886 bg-op-10'
    },
    MINT: {
      name: t('MINT'),
      class: 'color-#12B886 bg-#12B886 bg-op-10'
    },
    FREEZE: {
      name: t('FREEZE'),
      class: 'color-#F6465D bg-#F6465D bg-op-10'
    },
    transfer_in: {
      name: t('transfer_in'),
      class: 'color-#12B886 bg-#12B886 bg-op-10'
    },
    transfer_out: {
      name: t('transfer_out'),
      class: 'color-#F6465D bg-#F6465D bg-op-10'
    },
    BURN: {
      name: t('BURN'),
      class: 'color-#F6465D bg-#F6465D bg-op-10'
    },
    NEW_PAIR: {
      name: t('NEW_PAIR'),
      class: 'color-#F6465D bg-#F6465D bg-op-10'
    },
    THAW: {
      name: t('THAW'),
      class: 'color-#12B886 bg-#12B886 bg-op-10'
    },
    BALANCE_CHANGE: {
      name: t('BALANCE_CHANGE'),
      class: 'color-#F6465D bg-#F6465D bg-op-10'
    },
    REMOVE_LIQUIDITY: {
      name: t('REMOVE_LIQUIDITY'),
      class: 'color-#EF6DE2 bg-#EF6DE2 bg-op-10'
    }
  }
  return o[type]
}

function tableRowClick(row: GetTokenDetailsListResponse) {
  window.open(formatExplorerUrl(row.chain, row.tx_hash, 'tx'))
}

function goToExplorer() {
  const chain =  tokenDetailsStore.tokenInfo?.chain || ''
  const address = tokenDetailsStore.user_address || ''
  window.open(formatExplorerUrl(chain, address, 'address'))
}
</script>

<template>
  <div class="min-h-400px">
    <div
      class="flex justify-between items-center py-8px text-12px border-b-0.5px border-b-solid border-b-[--border] color-[--third-text] h-32px"
    >
      <div class="flex items-center w-120px gap-3px">
        <span>{{ $t('time') }}</span>
        <Icon
          :name="`${isShowDate?'custom:calendar':'custom:countdown'}`"
          class="color-[--third-text] cursor-pointer"
          @click.self="isShowDate=!isShowDate"
        />
      </div>
      <div class="flex items-center w-70px text-right gap-3px">
        <span>{{ $t('type') }}</span>
        <el-popover
v-model:visible="visible"
:persistent="false"
          placement="bottom"
          :width="200"
          trigger="click"
        >
          <template #reference>
            <Icon
              name="custom:filter"
              :class="`${checkedTrend.length>0?'color-[--secondary-text]':'color-[--third-text]'} cursor-pointer text-10px`"
            />
          </template>
          <template #default>
            <el-checkbox
              v-model="checkAll"
              class="width_100"
              size="large"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              {{ $t('all') }}
            </el-checkbox>
            <el-checkbox-group v-model="checkedTrend" @change="handleCheckedChange">
              <el-checkbox
                v-for="(item, $index) in list"
                :key="$index"
                class="w-full"
                :label="item.name"
                :value="item.id"
                size="large"
              >
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </template>
        </el-popover>
      </div>
      <div class="flex items-center flex-[2] justify-end">
        {{ $t('amountU') }}
      </div>
      <div class="flex items-center flex-[2] justify-end">
        {{ $t('amountB') }}
      </div>
      <div class="flex items-center flex-[2] justify-end gap-3px">
        <span>{{ isPrice? $t('swapPrice'): $t('mCap') }}</span>
        <Icon
          :name="isPrice? 'custom:price': 'custom:mcap'"
          class="color-[--secondary-text] cursor-pointer"
          @click.self="isPrice=!isPrice"
        />
      </div>
      <div class="flex items-center flex-[2] justify-end gap-3px">
        <span>{{ $t('gas') }}</span>
      </div>
      <!--<div class="flex items-center w-50px text-right"/>-->
    </div>
    <div
      v-for="(row, $index) in tableList" :key="$index"
      class="text-13px flex h-40px items-center border-b-solid border-b-0.5px border-b-[--border] hover:bg-[--dialog-list-hover] cursor-pointer"
      @click="tableRowClick(row)"
    >
      <div class="flex items-center w-120px">
        <TimerCount
          v-if="!isShowDate && row.block_time && Number(formatTimeFromNow(row.block_time,true)) < 60"
          :key="row.block_time"
          :timestamp="row.block_time"
          :end-time="60"
        >
          <template #default="{seconds}">
              <span class="color-[--secondary-text]">
                <template v-if="seconds<60">
                  {{ seconds }}{{ $t('ss') }}
                </template>
                <template v-else>
                  {{ dayjs(row.block_time * 1000).fromNow() }}
                </template>
              </span>
          </template>
        </TimerCount>
        <span v-else class="color-[--secondary-text]">
            {{
            isShowDate
              ? formatDate(row.block_time, 'MM/DD HH:mm:ss')
              : dayjs(row.block_time * 1000).fromNow()
          }}
          </span>
      </div>
      <div class="flex items-center w-70px">
         <span :class="filterType(row.event_type)?.class" class="px-8px h-20px flex items-center rounded-4px">
            {{ filterType(row.event_type)?.name }}
          </span>
      </div>
      <div class="flex items-center flex-[2] justify-end color-[--main-text1]">
        ${{ formatNumber(row.volume || 0, 2) }}
      </div>
      <div class="flex items-center flex-[2] justify-end text-right color-[--main-text1]">
        <div v-if="['ADD_LIQUIDITY','REMOVE_LIQUIDITY'].includes(row.event_type)">
          <div>
            {{ formatNumber(row.amount || 0, 2) }}
            <span class="color-[--secondary-text]">{{ row.symbol }}</span>
          </div>
          <div>
            {{ formatNumber(row.token1_amount || 0, 2) }}
            <span class="color-[--secondary-text]">{{ row.token1_symbol }}</span>
          </div>
        </div>
        <div v-else>
          {{ formatNumber(row.amount, 2) }}
        </div>
      </div>
      <div class="flex items-center flex-[2] justify-end color-[--main-text1]">
        <div v-if="['ADD_LIQUIDITY','REMOVE_LIQUIDITY'].includes(row.event_type)">
          --
        </div>
        <div v-else>
          <template v-if="isPrice">
            ${{ formatNumber(row.token_price_u || 0, 3) }}
          </template>
          <template v-else>
            {{ Number(row.main_token_price) === 0 ? '-' : formatNumber(Number(row.token_price_u) * Number(tokenStore.circulation) || 0, 2) }}
          </template>
        </div>
      </div>
      <div class="flex items-center flex-[2] justify-end color-[--main-text1]">
        ${{ formatNumber(row.gas || 0, 2) }}
      </div>
      <!--<div class="flex items-center w-50px text-right"/>-->
    </div>
    <AveEmpty
      v-if="!loading && tableList.length === 0"
      class="pt-10px text-12px"
    >
      <p class=" mt-16px">{{ $t('onlyShow30DaysTransactions') }}</p>
      <a class="block bg-[--primary-color] px-10px py-8px rounded text-[--white] cursor-pointer"  @click="goToExplorer">{{ $t('viewMoreTransactions') }}</a>
    </AveEmpty>
  </div>
</template>

<style scoped lang="scss">

</style>
