<template>
  <el-popover ref="popoverRef" :visible="monitorVisible" :width="720" placement="top" :persistent="true" :teleported="true" popper-class="" popper-style="">
    <div class="w-content">
      <div class="m-op flex-start gap-8px">
        <FilterType v-model="txType" :options="txTypeList" />
        <Icon name="icon-park-solid:volume-notice"/>
        <el-switch
          v-model="hasRing"
          size="small"
          active-value="1"
          inactive-value="0"/>
        <pro-tag size="small" class="cursor-pointer" @click="toggleMc=!toggleMc">Vol/MC <Icon name="lsicon:switch-filled" class="ml-4px text-12px"/></pro-tag>
        <el-button size="small" style="height: 20px;color: var(--d-999-l-222) !important;" :color="isDark?'#333':'#F2F2F2'" :dark="isDark" >
          <Icon name="ic:baseline-person-add-alt-1" class="text-12px  mr-5px"/>
          {{ $t('addWallet') }}
        </el-button>
        <el-button size="small" @click.stop.prevent="showBatchAddressDetails=true" style="height: 20px;color: var(--d-999-l-222) !important;" :color="isDark?'#333':'#F2F2F2'" :dark="isDark" >
          <Icon name="mingcute:new-folder-fill" class="text-12px  mr-5px"/>
          {{ $t('bulkImport') }}
        </el-button>
      </div>
      <div
      v-loading="loading" class="text-12px" element-loading-background="transparent">
      <AveTable
        ref="aveTableRef"
        rowKey="id"
        :data="dataSource"
        :columns="columns"
        fixed
        :style="{
          height:'365px'
        }"
        row-class='cursor-pointer'
        :rowEventHandlers="{
        onClick: (row:any)=>jumpToken(row)
      }">
        <template #header-wallet>
          <span>{{ $t('wallet') }}</span>
        </template>
        <template #cell-wallet="{ row }">
            <UserRemark
              :key="row._marker.maker_address" :address="row._marker.maker_address" :chain="row.chain" :remark="row.maker_alias || ''" :showIcon="true" :teleported="true" :wallet_logo="row.wallet_logo" iconSize="24px" :formatAddress="
                  (address) =>
                    address?.slice(0, 4) + '...' + address?.slice(-4)
              "
              @updateRemark="init"
              @click="(e) => jumpBalance(row, e)" />
        </template>
         <template #header-type>
          <span>{{ $t('type') }}</span>
        </template>
        <template #cell-type="{ row }">
          <pro-tag :type="row._marker.isBuy?'success':'danger'"> {{ getTxType(row) }}</pro-tag>
        </template>
        <template #header-amount>
          <span>{{ $t('value') }}</span>
        </template>
        <template #cell-amount="{ row }">
          <span :class="getIsBuy(row)?`color-${upColor[0]}`:`color-${downColor[0]}`">
            {{ toggleMc? row?._main_Token?.amount+row?._main_Token?.symbol: row?._main_Token.total}}
          </span>
        </template>
        <template #header-mc>
          <span>{{ $t('mcap') }}</span>
        </template>
        <template #cell-mc="{ row }">
          <span>{{ row?._mc }}</span>
        </template>
        <template #header-time>
          <span>{{ $t('time') }}</span>
        </template>
        <template #cell-time="{ row }">
          <TimerCount
              v-if="row?.time && Number(formatTimeFromNow(row?.time, true)) < 60"
              :key="row?.time" :timestamp="row?.time" :end-time="60">
              <template #default="{ seconds }">
            <span v-if="seconds < 60" class="color-#FFA622 text-12px">
              {{ seconds }}s
            </span>
                <span v-else class="color-[--d-999-l-666] text-12px">
              {{ formatTimeFromNow(row?.time) }}
            </span>
              </template>
            </TimerCount>
            <div v-else class="color-[--d-999-l-666] text-12px">
              {{ formatTimeFromNow(row?.time) }}
            </div>
        </template>
        <template #header-symbol>
          <span>{{ $t('token') }}</span>
        </template>
        <template #cell-symbol="{ row }">
          <TokenImg
          :row="{
            logo_url: row?._target_Token?.logo_url,
            chain: row?.chain
          }" token-class="w-16px h-16px [&&]:mr-4px" />
            <span>{{ row?._target_Token?.symbol }}</span>
            <img v-if="row?.amm=='pump'"  src="https://www.iconaves.com/signals/pump_king.png" style="width:12px;height:12px">
        </template>
        <template #header-operate>
          <span/>
        </template>
        <template #cell-operate="{ row }">
          <span>操作</span>
        </template>
      </AveTable>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { throttle } from 'lodash-es'
import BigNumber from 'bignumber.js'
import { getHistoryMonitor} from '~/api/attention'
import FilterType from './components/filterType.vue'
import { defaultPaginationParams, downColor, upColor } from '@/utils/constants'
import type {AveTable} from '#components'
const { t } = useI18n()
const hasRing=ref(false)
const {monitorVisible,currentAddress ,showBatchAddressDetails} = storeToRefs(useFollowStore())
const { isDark } = storeToRefs(useGlobalStore())
const dataSource = ref<any[]>([])
const dataSourceCache = ref<any[]>([])
const loading=ref(false)
const botStore = useBotStore()
const wsStore = useWSStore()
const aveTableRef = ref<InstanceType<typeof AveTable> | null>(null)
const firstActivated = ref(true)
const txType = ref([1,2])
const toggleMc = ref(false)
const txTypeList=computed(() => {
  return [
    // { label: t('all'), value: 0 },
    { label: t('buy'), value: 1 },
    { label: t('sell'), value: 2 },
  ]
})
onMounted(async () => {
  console.log('monitor mounted')
  init()
})
watch(() => monitorVisible.value, (val) => {
  if(!val) return
  updateDateSource()
  nextTick(() => {
    if (!firstActivated.value && aveTableRef.value) {
      aveTableRef.value.scrollToTop(0)
    }
    firstActivated.value = false
  })
})
const columns = computed(() => {
  return [
    {
      title: t('wallet'),
      dataKey: 'wallet',
      key: 'wallet',
      align: 'left',
      minWidth: 125,
    },
    {
      title: t('type'),
      dataKey: 'type',
      key: 'type',
      minWidth: 110,
      align: 'right',
    },
    {
      title: t('value'),
      dataKey: 'amount',
      key: 'amount',
      align: 'right',
      minWidth: 80,
    },
    {
      title: t('token'),
      dataKey: 'symbol',
      key: 'symbol',
      align: 'right',
      minWidth: 150,
    },
    {
      title: t('mcap'),
      dataKey: 'mc',
      key: 'mc',
      align: 'right',
      minWidth: 70,
    },
    {
      title: t('time'),
      dataKey: 'time',
      key: 'time',
      align: 'right',
      minWidth: 40,
    },
    {
      title: '',
      dataKey: 'operate',
      key: 'operate',
      align: 'right',
      minWidth: 100,
    }
  ]
})
watch(() => wsStore.wsResult[WSEventType.MONITOR], (val) => {
  console.log('ws monitor', val)
  mergeDataSource(val)
})

const mergeDataSource = (msg:any) => {
  if(msg?.length>0){
    const data = dataSourceCache?.value || []
    const wsData = msg?.filter?.((i: { id: any }) => {
      return !data.some(j => j.id === i.id)
    })?.map?.(i => {
      return {
        ...i,
        ...formateTxInfo(i)
      }
    }) || []
    const list = [...wsData, ...data]
    if (list.length > 100) {
      list?.splice?.(50)
    }
    dataSourceCache.value.splice(0, dataSourceCache.value?.length, ...list)
    updateDateSource()
  }
}

const updateDateSource = throttle(function() {
  if(!monitorVisible.value) return
  dataSource.value.splice(0, dataSource.value?.length, ...dataSourceCache.value)
}, 500)

    // watch(()=>props.data, (val) => {
    // })

watch(()=>botStore.evmAddress, (val) => {
  if(!val){
    dataSource.value=[]
  }else{
    init()
  }
})
function init() {
  if(!botStore.evmAddress) return
  loading.value = true
  getHistoryMonitor({}).then((res) => {
    let result = res || res?.data|| []
    const list: any[]=[]
    const listObj: Record<string, boolean> = {}
    result=Array.isArray(result)?result:[]
    result?.forEach?.((i: { msg_content: string }) => {
      const j = JSON.parse(i.msg_content)
      if (!listObj[j.id]) {
        list.push({
          ...j,
          ...formateTxInfo(j)
        })
        listObj[j.id] = true
      }
    })
    console.log('list', list)
    dataSourceCache.value = list
    updateDateSource()
  }).catch((err) => {
    console.error(err)
  }).finally(() => {
    loading.value = false
  })
}
function getIsBuy(item) {
  // console.log('item', item)
  if (item.position_type !== undefined) {
    return item.position_type === 0 || item.position_type === 1
  } else {
    return item.tx_type === 0
  }
}
function getTxType(item) {
  if (item.position_type !== undefined) {
    const types = [t('createPosition'), t('addPosition'), t('reducePosition'), t('closePosition')]
    return types?.[item?.position_type] || ''
  } else {
    const types = [t('buy'), t('sell')]
    return types?.[item.tx_type] || ''
  }
}

const formateTxInfo = function(item)  {
  // const {
    // from_address = '',
    // from_symbol = '',
    // from_logo = '',
    // from_amount = '',
    // from_price_usd = '',
    // from_tags = [{ "label": "", "icon": "" }], // token的标签, 只有当时target token才会有
    // from_signals = [{ "label": "", "icon": "" }], // token 信号, 只有当时target token才会有

    // to_address = '',
    // to_symbol = '',
    // to_logo = '',
    // to_amount = '',
    // to_price_usd = '',
    // to_tags = [{ "label": "", "icon": "" }], // token的标签, 只有当时target token才会有
    // to_signals = [{ "label": "", "icon": "" }], // token 信号, 只有当时target token才会有

    // target_address = '',
    // position_type,// 0-建仓，1-加仓，2-减仓，3-清仓。注意 该字段可能没有时，就只显示 tx_type
    // tx_type, // 0-买入，1-卖出
    // maker_address = "", // 交易用户地址
    // maker_alias = "", // 用户地址的别名, 找 @Ethan 问表
    // maker_logo = "", // 用户的图像
    // maker_tags = [{ "key": "", "label": "", "icon": "" }], // 用户地址标签 @Ethan kol
    // avg_price_usd = '', // 平均成本价，用usd计价
    // pnl_ratio = '', // pnl 百分比
    // pnl_usd = '', // pnl 值
    // position_usd = '', // 当前持仓金额,
    // target_mcap='', // 主币市值，
  // } = item
  const isBuy = getIsBuy(item)
  const data = {
    ...item,
    _marker: {
      maker_address: item?.maker_address || item?.wallet_address,
      maker_alias: item?.maker_alias,
      maker_logo: item?.maker_logo,
      maker_tags: item?.maker_tags,
      isBuy
    },
    _profit: item?.pnl_usd=='--'?'--':'$' + formatNumber2(Math.abs(item?.pnl_usd || 0) || 0, 2),
    _profit_ratio: item?.pnl_usd=='--'?'--':formatNumber2((item?.pnl_ratio || 0) * 100 || 0 ,2, 4, 4)+'%',
    _mc: '$'+formatNumberS(item?.target_mcap || 0,{
      decimals:0,
      limit:3
    }),
    _type: getTxType(item),
    _rise: item?.pnl_usd=='--'? true: item?.pnl_usd >= 0
  }
  data['_main_Token'] = {
    amount: formatNumber2(item[isBuy ? 'from_amount' : 'to_amount'] || 0, 1),
    price: '$'+formatNumber2(item[isBuy ? 'from_price_usd' : 'to_price_usd'] || 0) ,
    symbol: item[isBuy ? 'from_symbol' : 'to_symbol'],
    total: '$'+formatNumber2(new BigNumber( item[isBuy ? 'from_amount' : 'to_amount']||0).times(item[isBuy ? 'from_price_usd' : 'to_price_usd'] || 0).toFixed(0)||0, 2,4,4) ,
    address: item[isBuy ? 'from_address' : 'to_address'],
    tags: item[isBuy ? 'from_tags' : 'to_tags'],
    signals:item[isBuy ? 'from_signals' : 'to_signals'],
  }
  data['_target_Token'] = {
    amount: formatNumber2(item[!isBuy ? 'from_amount' : 'to_amount'] || 0, 1),
    price: '$'+formatNumber2(item[!isBuy ? 'from_price_usd' : 'to_price_usd'] || 0) ,
    total:'',
    symbol: item[!isBuy ? 'from_symbol' : 'to_symbol'],
    address: item[!isBuy ? 'from_address' : 'to_address'],
    tags: item[!isBuy ? 'from_tags' : 'to_tags'],
    signals:item[!isBuy ? 'from_signals' : 'to_signals'],
    logo_url: item[!isBuy ? 'from_logo' : 'to_logo'],
  }
  return data
}
function jumpBalance(item, e) {
  if (e) {
    e.stopPropagation()
  }
  const chain = item?.chain || 'eth'
  const address = item?._marker?.maker_address || item?.wallet_address
  if (address) {
    navigateTo(`/address/${address}/${chain}`)
  }
}
function jumpToken(row) {
  // if (e) {
  //   e.stopPropagation()
  // }
  const addr = row?._target_Token?.address + '-' + row.chain
  navigateTo(`/token/${addr}`, {replace: true})
}
</script>

<style scoped lang="scss">
.m-table {
  .el-table.el-table{
    --el-table-header-bg-color: var(--d-222-l-F2F2F2);
    --el-table-tr-bg-color: transparent;
  }
  :deep() .cell{
    padding-top: 0;
    padding-bottom: 0;
  }
  :deep() .el-table__expand-icon {
    display: none;
  }
  :deep() th {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0px;
    color: var(--d-666-l-999);
    background: transparent;
  }

  :deep() td {
    font-weight: 400;
    font-size: 12px;
    letter-spacing: 0px;
    color: var(--d-F5F5F5-l-333);
    .cell{
      /* line-height: 1.5; */
    }
  }
}
</style>
