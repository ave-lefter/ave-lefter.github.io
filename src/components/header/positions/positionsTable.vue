<template>
  <el-dialog v-model="dialogVisible" class="dialog-position" :title="$t('myPosition1')" width="680" append-to-body>
    <slot/>
    <el-table
      class="table-position w-100%" :data="dataSource" :height="400" @row-click="tableRowClick" row-class-name="group">
      <template #empty>
        <div v-if="!paginationParams.loaded" class="flex flex-col items-center justify-center py-30px">
          <img v-if="mode === 'light'" src="@/assets/images/empty-white.svg">
          <img v-if="mode === 'dark'" src="@/assets/images/empty-black.svg">
          <span>{{ t('emptyNoData') }}</span>
        </div>
        <span v-else />
      </template>
      <el-table-column
        v-for="col in columns" :key="col.prop" :label="col.label" :width="col.width" :prop="col.prop" :min-width="col?.minWidth"
        :align="col.align" :show-overflow-tooltip="col?.showOverflowTooltip || false">
        <template #header="{ column }">
          <div v-if="column.property == 'total_profit_ratio'" class="flex items-center text-right justify-end">
            <span>{{ column.label }}</span>
            <el-tooltip :effect="mode" placement="top-end" :content="$t('PnLTips')" persistent>
              <el-icon style="cursor: pointer; font-size: 14px; margin-left: 2px;">
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </div>
          <div v-else>
            {{ column.label }}
          </div>
        </template>
        <template #default="{ row }">
          <div>
            <template v-if="col?.prop === 'token'">
              <div class="flex items-center clickable flex-nowrap relative">
                <Icon
                  v-if="walletStore.walletName!=='WatchWallet'"
                  name="bx:bxs-hide"
                  class=" bxs-hide cursor-pointer color-#959a9f overflow-hidden whitespace-nowrap max-w-0 group-hover:max-w-[100px] transition-all duration-500 ease-in-out"
                  @click.self.stop="hideToken(row)"
                />
                <TokenImg :row="row" class="w-24px h-24px mr-8px" />
                <div class="whitespace-nowrap text-ellipsis overflow-hidden max-w-90px mr-8px">{{ row?.symbol }}</div>
                <Icon
                    v-if="row.risk_score > 55 || row.risk_level < 0"
                    name="custom:danger"
                    class="font-14 ml-2px color-#F72121 w-14px h-14px mt-2px"/>
              </div>
            </template>
            <span v-else-if="row[col.prop] === '--'" :class="col?.getClassName ? col.getClassName(row) : ''">--</span>
            <span v-else-if="row[col.prop] === 0" :class="col?.getClassName ? col.getClassName(row) : ''">0</span>
            <span v-else :class="col?.getClassName ? col.getClassName(row) : ''">{{ col.formatter ? col.formatter(row) :row[col.prop] }}</span>
            <div  v-if="col?.prop === 'total_profit_ratio'" class="pr-10px inline-block" >
              <share :address="row.address" :statistics="row" :chain="row.chain" type="topHolder"/>
            </div>
          </div>
        </template>
      </el-table-column>
      <template #append>
        <div
          v-infinite-scroll="fetchTable"
          class="text-0 lh-0 h-0"
          :infinite-scroll-disabled="paginationParams.loaded || paginationParams.finished"
          :infinite-scroll-distance="20"
          :infinite-scroll-delay="200"
          :infinite-scroll-immediate="true"
        />
          <div v-if="paginationParams.loaded && dataSource?.length > 0"  class="text-center px-0 pt-15px pb-10px text-12px text-[#959a9f]">{{ $t('loading') }} </div>
          <div v-else-if="paginationParams.finished && dataSource?.length > 0" class="text-center px-0 pt-15px pb-10px text-12px text-[#959a9f]">{{ $t('noMore') }}</div>
      </template>
    </el-table>
    <HideTokenDialog
      v-model="hideTokenVisible"
      :row="currentHideToken"
      :self_address="self_address"
      @hideToken="()=>{}"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import HideTokenDialog from '../../../pages/address/[[userAddress]]/components/hideTokenDialog.vue'
import TokenImg from '@/components/tokenImg.vue'
import { defaultPaginationParams, downColor, upColor } from '@/utils/constants'
import { QuestionFilled } from '@element-plus/icons-vue'
import { getUserBalance, type GetUserBalanceResponse } from '~/api/swap'

const { mode } = storeToRefs(useGlobalStore())
const { t } = useI18n()
const $router = useRouter()

const botStore = useBotStore()
const walletStore = useWalletStore()
const {updateHolderNum}= storeToRefs(useUserStore())
const columns = computed(() => {
  return [
    {
      label: t('token'),
      prop: 'token',
      align: 'left',
      sortable: false,
      minWidth: 125,
      showOverflowTooltip: true
    },
    {
      label: t('balance1'),
      prop: 'balance_usd',
      align: 'right',
      sortable: false,
      formatter: (row: any) => {
        return `$${formatNumber(row.balance_usd, 4)}`
      }
    },
    {
      label: t('amount'),
      prop: 'balance',
      align: 'right',
      sortable: false,
      formatter: (row: any) => {
        return `${formatNumber(row.balance, 4)}`
      }
    },
    {
      label: t('costPrice'),
      prop: 'average_purchase_price_usd',
      align: 'right',
      sortable: false,
      formatter: (row: any) => {
        return `$${formatNumber(row.average_purchase_price_usd, 4)}`
      }
    },
    {
      label: t('currentPrice'),
      prop: 'current_price_usd',
      align: 'right',
      sortable: false,
      formatter: (row: any) => {
        return `$${formatNumber(row.current_price_usd, 4)}`
      }
    },
    {
      label: 'PnL',
      prop: 'total_profit_ratio',
      width: 100,
      align: 'right',
      sortable: false,
      getClassName: (row: any) => Number(row.total_profit_ratio) > 0 ? `color-${upColor[0]}` : `color-${downColor[0]}`,
      formatter: (row: any) => {
        return `${Number(row.total_profit_ratio) > 0 ? '+' : '-'}${formatNumber(Math.abs(Number(row.total_profit_ratio) * 100), 2)}%`
      }
    },
  ]
})
type rowProps = GetUserBalanceResponse & { index: string }
const dataSource = shallowRef<(rowProps)[]>([])

const props = defineProps({
  modelValue: Boolean,
  tableFilter: {
    type: Object,
    default: () => ({
      hide_risk: 1,
      hide_small: 0,
      user_ids: []
    })
  },
})
const emit = defineEmits(['update:modelValue','hideToken'])

const hideTokenVisible = ref(false)
const currentHideToken = ref({} as any)

const paginationParams = ref({...defaultPaginationParams})

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const self_address = computed(() => {
  if (currentHideToken.value?.chain !== 'solana') {
    return botStore.evmAddress || walletStore.address
  } else {
    return botStore.getWalletAddress('solana') || walletStore.address
  }
})

watch(()=>updateHolderNum.value, () => {
  paginationParams.value={...defaultPaginationParams}
  fetchTable()
})

function hideToken(row:any) {
  hideTokenVisible.value = true
  currentHideToken.value = row
}

function tableRowClick(row: rowProps) {
  $router.push({
    name: 'token-id',
    params: { id: row?.index },
  })
  dialogVisible.value=false
}
const fetchTable = async () => {
  if (paginationParams.value.loaded) return
  paginationParams.value.loaded = true
  const pageNO = paginationParams.value.pageNO
  const pageSize = paginationParams.value.pageSize
  console.log('fetchTable', {pageNO,pageSize})
  getUserBalance({pageNO, pageSize,...props.tableFilter}).then(res => {
    const data=res?.data||[]
    if (Array.isArray(data) && data?.length > 0) {
      if(pageNO === 1) {
        dataSource.value = data?.map(i => ({
          ...i, index: i.token === NATIVE_TOKEN
              ? getChainInfo(i.chain)?.wmain_wrapper + '-' + i.chain
              : `${i.token}-${i.chain}`
        }))
      }else{
        dataSource.value = [...dataSource.value].concat(data.filter?.(i => dataSource.value?.every?.(j => j.index !== `${i.token}-${i.chain}`))
            ?.map(i => ({
              ...i, index: i.token === NATIVE_TOKEN
                  ? getChainInfo(i.chain)?.wmain_wrapper + '-' + i.chain
                  : `${i.token}-${i.chain}`
            })))
      }
      paginationParams.value.finished = data?.length < pageSize
      if (!paginationParams.value.finished) {
        paginationParams.value.pageNO++
      }
    }else{
      if(pageNO === 1) {
        dataSource.value = []
      }
      paginationParams.value.finished = true
    }
  }).finally(() => {
   setTimeout(() => {
    paginationParams.value.loaded = false
    }, 200)
  })
}
watch(props.tableFilter, () => {
  paginationParams.value={...defaultPaginationParams}
  fetchTable()
})


watch(() => dialogVisible.value, (val) => {
  if(val){
     paginationParams.value={...defaultPaginationParams}
     fetchTable()
  }
}, { immediate: true })

onMounted(() => {
  // fetchTable()
  // console.log('mounted positionsTable')
})
</script>

<style lang="scss">
.dialog-position.el-dialog {
  --el-dialog-padding-primary: 20px;
}
</style>
<style scoped lang="scss">
.table-position.el-table{
  --el-table-tr-bg-color:transparent;
  --el-table-header-bg-color:transparent;
  --el-table-header-text-color:var(--d-999-l-666);
  --el-table-text-color:var(--d-F5F5F5-l-222);
  --el-table-row-hover-bg-color:var(--d-2A2A2A-l-F2F2F2);
  :deep() thead{
    font-size: 10px;
    tr{
      th{
        padding-top: 10px;
        padding-bottom: 10px;
        font-weight: 400;
        font-size: 12px;
        line-height: 14px;
      }
    }
  }
  :deep() .cell{
    padding: 0;
  }
}
.hover-row {
  .bxs-hide {
    display: block;
  }
}
</style>
