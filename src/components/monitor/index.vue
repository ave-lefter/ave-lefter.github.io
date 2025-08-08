<template>
  <div class="w-monitor w-100% h-100% bg-[--d-111-l-FFF] pl-12px pr-6px relative overflow-hidden">
    <!-- <div class="w-100% h-40px absolute pointer-events-auto z-999 drag-handle left-0"/> -->
    <Icon
        name="custom:drag2"
        class="absolute top-3px left-50% ml--6px text-6px bg-[--d-333-l-F2F2F2] drag-handle"
    />
    <el-tabs v-model="activeName" style="" class="m-tabs" @tab-change="handleClick">
      <el-tab-pane :label="$t('walletManage')" :name="0" lazy>
        <WalletManage v-if="botStore.evmAddress" v-bind="walletManageProps"/>
        <AveEmpty
          v-else
          :style="{height:`${props.scrollHeight-50}px`}"
          class="overflow-hidden"
        >
          <span class="text-12px mt-10px">{{ $t('noBotWalletTip') }}</span>
          <el-button
            class="mt-10px"
            @click="botStore.$patch({
            connectVisible: true
          })"
          >
            {{ $t('connectWallet') }}
          </el-button>
        </AveEmpty>
      </el-tab-pane>
      <el-tab-pane :label="$t('monitored')" :name="1" lazy>
        <template v-if="botStore.evmAddress" >
          <div
            v-if="props.isLarge"
            v-loading="loading" class="text-12px m-table" element-loading-background="transparent">
            <AveTable
              ref="aveTableRef"
              rowKey="id"
              :data="dataSource"
              :columns="columns"
              fixed
              :style="{
                height:props.scrollHeight+'px',
                '--el-table-border':'1px solid #333'
                // height:'500px',
              }"
              headerClass="bg-transparent"
              row-class='cursor-pointer'
              :rowEventHandlers="{
              onClick: (row:any)=>jumpToken(row)
            }">
              <template #header-wallet>
                <span>{{ $t('wallet') }}</span>
              </template>
              <template #cell-wallet="{ row }">
                  <UserRemark
                    :key="row._marker.maker_address" :address="row._marker.maker_address" :chain="row.chain" :remark="row.maker_alias || ''" :showIcon="true" :teleported="true" :wallet_logo="row.maker_logo?{logo:row.maker_logo,vip_logo:'https://www.iconaves.com/address_portrait/KOL_V.png'}:{}" iconSize="24px" :formatAddress="
                        (address) =>
                          address?.slice(0, 4) + '...' + address?.slice(-4)
                    "
                    @updateRemark="init2"
                    @click="(e: any) => jumpBalance(row, e)" />
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
                  {{ !toggleMc? row?._main_Token?.amount+row?._main_Token?.symbol: row?._main_Token.total}}
                </span>
              </template>
              <template #header-mc>
                <span>{{ toggleMc? $t('price') : $t('mcap') }}</span>
              </template>
              <template #cell-mc="{ row }">
                <span>{{ toggleMc? row?._target_Token?.price: row?._mc }}</span>
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
                <QuickSwap
                  :quickBuyValue="quickBuyValue"
                  :row="{...row,...{target_token:row?.target_address,token0_address:row?.from_address,token1_address:row?.to_address,symbol:row?._target_Token?.symbol}}"
                  classNames="min-w-70px h-24px!"
                  mainNameVisible
                />
              </template>
            </AveTable>
          </div>
          <div
            v-else
            v-loading="loading" class="text-12px m-table" element-loading-background="transparent">
            <AveTable
              ref="aveTableRef"
              rowKey="id"
              fixed
              :data="dataSource"
              :columns="columns"
              :headerHeight="54"
              :rowHeight="70"
              headerClass="bg-transparent"
              :style="{
                height:props.scrollHeight+'px',
                // height:'500px',
                '--el-table-border':'1px solid #333'
              }"
              row-class='cursor-pointer'
              :rowEventHandlers="{
              onClick: (row:any)=>jumpToken(row)
            }">
              <template #header-wallet>
                  <div class="flex-between w-100%">
                    <div class="flex-start gap-8px">
                      <FilterType v-model="txType" :options="txTypeList" />
                      <Icon name="icon-park-solid:volume-notice" :style="`color:var(--d-F5F5F5-l-333)`"/>
                      <el-switch
                        v-model="hasRing"
                        size="small"
                       />
                      <pro-tag size="small" class="cursor-pointer w-55px" @click="toggleMc=!toggleMc">{{ !toggleMc?'U/Pri':'C/MC' }}<Icon name="lsicon:switch-filled" class="ml-4px text-12px"/></pro-tag>
                    </div>
                    <QuickBuyInput
                      v-model="quickBuyValue"
                      size="small"
                    />
                  </div>
              </template>
              <template #cell-wallet="{ row }">
                <div class="flex flex-col w-100% gap-8px">
                  <div class="flex-between">
                    <UserRemark
                      :key="row._marker.maker_address" :address="row._marker.maker_address" :chain="row.chain" :remark="row.maker_alias || ''" :showIcon="true" :teleported="true" :wallet_logo="row.maker_logo?{logo:row.maker_logo,vip_logo:'https://www.iconaves.com/address_portrait/KOL_V.png'}:{}" iconSize="24px" :formatAddress="
                          (address) =>
                            address?.slice(0, 4) + '...' + address?.slice(-4)
                      "
                      @updateRemark="init2"
                      @click="(e: any) => jumpBalance(row, e)" />
                      <QuickSwap
                        :quickBuyValue="quickBuyValue"
                        :row="{...row,...{target_token:row?.target_address,token0_address:row?.from_address,token1_address:row?.to_address,symbol:row?._target_Token?.symbol}}"
                        classNames="min-w-70px h-24px!"
                        mainNameVisible
                      />
                  </div>
                  <div class="flex-between">
                    <div class="flex-start gap-4px">
                      <div>{{ getTxType(row) }}</div>
                      <span :class="getIsBuy(row)?`color-${upColor[0]}`:`color-${downColor[0]}`">
                        {{ !toggleMc? row?._main_Token?.amount+row?._main_Token?.symbol: row?._main_Token.total}}
                      </span>
                      <TokenImg
                        :row="{
                          logo_url: row?._target_Token?.logo_url,
                          chain: row?.chain
                        }" token-class="w-16px h-16px [&&]:mr-4px" />
                          <span>{{ row?._target_Token?.symbol }}</span>
                          <img v-if="row?.amm=='pump'"  src="https://www.iconaves.com/signals/pump_king.png" style="width:12px;height:12px">
                      <span class="color-[var(--d-666-l-999)]">{{ toggleMc? $t('price') : $t('mcap') }}</span>
                      <span>{{ toggleMc? row?._target_Token?.price: row?._mc }}</span>
                    </div>
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
                  </div>
                </div>
              </template>
            </AveTable>
          </div>
        </template>
        <AveEmpty
          v-else
          :style="{height:`${props.scrollHeight-50}px`}"
          class="overflow-hidden"
        >
          <span class="text-12px mt-10px">{{ $t('noBotWalletTip') }}</span>
          <el-button
            class="mt-10px"
            @click="botStore.$patch({
            connectVisible: true
          })"
          >
            {{ $t('connectWallet') }}
          </el-button>
        </AveEmpty>
      </el-tab-pane>
      <el-tab-pane :name="activeName">
         <template #label>
            <div class="cursor-move w-100% h-100% drag-handle" />
         </template>
      </el-tab-pane>
      <el-tab-pane :name="activeName">
        <template #label>
          <div class="m-op flex-end gap-8px w-100% h-100%">
            <template v-if="activeName===1 && props.isLarge">
              <FilterType v-model="txType" :options="txTypeList" />
              <Icon name="icon-park-solid:volume-notice"/>
              <el-switch
                v-model="hasRing"
                class="[&&]:[--el-switch-on-color:#3F80F7]"
                size="small"
                />
              <pro-tag size="small" class="cursor-pointer w-55px" @click="toggleMc=!toggleMc">{{ !toggleMc?'U/Pri':'C/MC' }}<Icon name="lsicon:switch-filled" class="ml-4px text-12px"/></pro-tag>
            </template>
            <el-button v-if="(activeName===1) && botStore.evmAddress" :ref="(ref)=>addButtonRef=ref" size="small" style="height: 20px;color: var(--d-999-l-666) !important;" :color="isDark?'#333':'#F2F2F2'" :dark="isDark" >
              <Icon name="ic:baseline-person-add-alt-1" class="text-12px  mr-5px"/>
              {{ $t('addWallet') }}
            </el-button>

            <QuickBuyInput
              v-if="(activeName===1)&&isLarge"
              v-model="quickBuyValue"
              size="small"
            />
            <Icon class="text-14px color-[var(--d-999-l-666)] hover:color-[--d-F5F5F5-l-333] cursor-pointer" name="custom:pump-setting" @click.stop.prevent="navigateTo('/follow/addr', {replace: true})"/>
            <Icon
              name="custom:close"
              class="text-14px shrink-0 cursor-pointer color-[--d-FFF-l-333]"
              @click.self="visible=false"
            />
        </div>
        </template>
      </el-tab-pane>
    </el-tabs>
    <AddFavAddressPop v-if="addButtonRef" ref="addFavAddressPopRef" :buttonRef="addButtonRef" @onConfirm="handleConfirmAdd" />
  </div>
</template>

<script setup lang="ts">
import WalletManage from './walletManage.vue'
import {throttle} from 'lodash-es'
import {useStorage} from '@vueuse/core'
import BigNumber from 'bignumber.js'
import { getHistoryMonitor,batchPauseMonitor,addAttention2} from '~/api/attention'
import QuickBuyInput from './components/quickBuyInput.vue'
import FilterType from './components/filterType.vue'
import { downColor, upColor } from '@/utils/constants'
import type {AveTable} from '#components'
const { t } = useI18n()

const { hasRing ,monitorList2:dataSourceCache,visible,activeName,txType} = storeToRefs(useMonitorStore())

const {updateNum3} = storeToRefs(useFollowStore())
const { isDark } = storeToRefs(useGlobalStore())
const props = defineProps({
  scrollHeight: {
    type: Number,
    default: 0
  },
  isLarge: {
    type: Boolean,
    default: false
  }
})

const dataSource = ref<any[]>([])
// const dataSourceCache = monitorList2
const loading=ref(false)
const botStore = useBotStore()
const wsStore = useWSStore()
const aveTableRef = ref<InstanceType<typeof AveTable> | null>(null)
const firstActivated = ref(true)
// const txType = ref([0,1])
const addButtonRef = ref()
const toggleMc = ref(false)
const addFavAddressPopRef = ref()
// const activeName.value=ref(0)
const quickBuyValue = useStorage('quickBuyValue', '0.01')
const txTypeList=computed(() => {
  return [
    // { label: t('all'), value: 0 },
    { label: t('buy'), value: 0 },
    { label: t('sell'), value: 1 },
  ]
})

const walletManageProps=computed(() => {
  return {
    scrollHeight: props.scrollHeight,
  }
})
onMounted(async () => {
  // console.log('monitor mounted')
  nextTick(() => {
    // const el = document.querySelector('.m-tabs .el-tabs__header.is-top')
    // if (el) el.className = 'el-tabs__header is-top drag-handle'
    // console.log('monitor visible', el)
  })
  init()
})
watch(() => txType.value, (val) => {
  const monitor_type:Array<'sell' | 'buy'>=[]
  if(val.includes(0)){
    monitor_type.push('buy')
  }
  if(val.includes(1)){
    monitor_type.push('sell')
  }
  batchPauseMonitor(monitor_type).then(() => {
    init2()
  })
})
watch(() => visible.value, (val) => {
  if(!val) return
  if(activeName.value===1){
    updateDateSource()
    nextTick(() => {
      if (!firstActivated.value && aveTableRef.value) {
        aveTableRef.value.scrollToTop(0)
      }
      firstActivated.value = false
    })
  }
})

function handleClick(name: number|string) {
  if(name===1){
    updateDateSource()
  }
}
function handleConfirmAdd(formData?: any, resetFields?: () => void, stopLoading?: () => void) {
  addAttention2({ address:botStore.evmAddress, user_chain: formData?.user_chain?.id ,user_address:formData?.address,remark:formData?.remark,group:formData?.group_id,is_monitored:0}).then(() => {
    // init2()
    resetFields?.()
    stopLoading?.()
    addFavAddressPopRef.value?.close?.()
    updateNum3.value++
  }).catch((err) => {
    console.error(err)
  })
}
const columns = computed(() => {
  return props.isLarge?[
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
  ]:[
    {
      title: t('wallet'),
      dataKey: 'wallet',
      key: 'wallet',
      align: 'left',
      minWidth: 240,
    },
  ]
})
watch(() => wsStore.wsResult[WSEventType.MONITOR], (val) => {
  mergeDataSource(val)
  if(visible.value&&(activeName.value===1)){
    updateDateSource()
  }
})

const mergeDataSource = (msg:any) => {
  if(msg?.length>0){
    const data = dataSourceCache?.value || []
    const wsData = msg?.filter?.((i: { id: any }) => {
      return !data.some(j => j.id === i.id)
    })?.map?.((i: any) => {
      return {
        ...i,
        ...formateTxInfo(i)
      }
    }) || []
    const list = [...wsData, ...data]
    if (list.length > 200) {
      list?.splice?.(100)
    }
    dataSourceCache.value.splice(0, dataSourceCache.value?.length, ...list)
    // console.log('dataSourceCache', dataSourceCache.value?.length)
  }
}

const updateDateSource = throttle(function() {
  if(!visible.value||(activeName.value!==1)) return
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
  init2()
}
function init2() {
  if(!botStore.evmAddress) return
  loading.value = true
  let filtered_type=''
  if(txType.value.length!==txTypeList.value.length){
    filtered_type=txType.value.join(',')
  }
  getHistoryMonitor(filtered_type?{filtered_type}:{}).then((res) => {
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
    dataSourceCache.value = list.filter(i => {
      return txType.value.includes(i.tx_type)
    })  
    updateDateSource()
  }).catch((err) => {
    console.error(err)
  }).finally(() => {
    loading.value = false
  })

}
function getIsBuy(item: { position_type?: string | number; tx_type?: string | number }) {
  // console.log('item', item)
  if (item.position_type !== undefined) {
    return item.position_type === 0 || item.position_type === 1
  } else {
    return item.tx_type === 0
  }
}
function getTxType(item: { position_type?: string | number; tx_type?: string | number }) {
  if (item.position_type !== undefined) {
    const types = [t('createPosition'), t('addPosition'), t('reducePosition'), t('closePosition')]
    return types?.[Number(item?.position_type)] || ''
  } else {
    const types = [t('buy'), t('sell')]
    return types?.[Number(item.tx_type)] || ''
  }
}

const formateTxInfo = function(item: { [x: string]: any; maker_address?: any; wallet_address?: any; maker_alias?: any; maker_logo?: any; maker_tags?: any; pnl_usd?: any; pnl_ratio?: any; target_mcap?: any; position_type?: string | number | undefined; tx_type?: string | number })  {
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
  const data: any = {
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
    _mc: Number(item?.target_mcap)?('$'+formatNumberS(item?.target_mcap || 0,{
      decimals:0,
      limit:3
    })):'--',
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
function jumpBalance(row: { chain: string; _marker: { maker_address: any }; wallet_address: any }, e: { stopPropagation: () => void }) {
  if (e) {
    e.stopPropagation()
  }
  const chain = row?.chain || 'eth'
  const address = row?._marker?.maker_address || row?.wallet_address
  if (address) {
    navigateTo(`/address/${address}/${chain}`)
  }
}
function jumpToken({ e,rowData }: { e: Event; rowData: any }) {
  if (e) {
    e.stopPropagation()
  }
  const addr = rowData?._target_Token?.address + '-' + rowData.chain
  navigateTo(`/token/${addr}`, {replace: true})
}
</script>

<style scoped lang="scss">
.m-table {
  :deep() .el-table.el-table-v2{
    --el-table-header-bg-color: transparent;
    --el-table-tr-bg-color: transparent;
    /* .el-table-v2__table{
      --el-table-border:1px solid;
    } */
  }
}
.m-tabs{
  :deep() .el-tabs__header{
    --el-border-color-light:var(--d-333-l-F2F2F2);
    --el-color-primary:var(--d-F5F5F5-l-333);
    --el-text-color-primary:var(--d-666-l-999);
  }
  --el-tabs-header-height:44px;
  :deep() .el-tabs__item{
    font-weight: 400;
    &:hover{
      color:var(--d-666-l-999);
      &.is-active{
        color:var(--d-F5F5F5-l-333);
      }
    }
  }
  :deep() .el-tabs__header{
    margin-bottom: 0;
  }
  :deep() .el-tabs__nav-wrap::after,:deep() .el-tabs__active-bar{
    height: 1px;
  }
  :deep() .el-tabs__nav.is-top{
    width:100%;
    .el-tabs__item{
      padding: 0 12px;
      &:nth-child(2),&:nth-child(3),&:nth-child(5){
        flex-shrink: 0;
        flex-grow: 0;
        flex-basis: auto;
      }
      &:nth-child(4){
        flex:1;
        padding: 0;
      }
      &:last-child{
        padding: 0;
        justify-content: flex-end;
        color:inherit;
      }
    }
  }
}
:deep() .el-button--small{
  padding-left: 8px !important;
  padding-right: 8px !important;
}
</style>
