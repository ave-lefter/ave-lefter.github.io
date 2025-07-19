<template>
  <section class="home-content">
    <div class="tableBox card relative">
      <el-table
        :key="tableIndex"
        ref="tableRef"
        v-loading="isLoading"
        :data="tableDataFilter"
        fit
        style="width: 100%;font-size: 12px"
        class="table-container"
        :height="tableHeight"
        cell-class-name="color-[--d-999-l-959A9F] text-12px"
        :default-sort="defaultSort"
        @row-click="tableRowClick"
        @sort-change="sortChange"
      >
        <template #empty>
          <div
            v-if="!loading"
            class="flex flex-col items-center justify-center py-30px"
          >
            <img
              v-if="mode === 'light'"
              src="@/assets/images/empty-white.svg"
            >
            <img v-if="mode === 'dark'" src="@/assets/images/empty-black.svg" >
            <span>{{ t('emptyNoData') }}</span>
          </div>
          <span v-else />
        </template>

        <!-- 时间列 -->
        <el-table-column
          :label="$t('time')"
          prop="time"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
          align="left"
        >
          <template #default="{ row }">
            <span class="color-text-2">
              {{ formatDate(row.time) }}
            </span>
          </template>
        </el-table-column>

        <!-- 类型列 -->
        <el-table-column
          :label="$t('type')"
          column-key="op"
          :filters="typeFilters"
          :filter-method="filterHandler"
          :filtered-value="defaultSelectedFilters"
          align="right"
        >
          <template #default="{ row }">
            <span :style="{ color: getColor(row?.type) }">
              {{ filterType(row?.type) }}
            </span>
          </template>
        </el-table-column>

        <!-- 金额列 -->
        <el-table-column
          :label="$t('amount')"
          prop="base_token_amount"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
          align="right"
        >
          <template #default="{ row }">
            <template v-if="row?.type === 'ADD' || row?.type === 'REMOVE'">
              {{ formatNumber(row?.base_token_amount, 0) }}
              <span class="color-text-2">{{ row?.base_token_symbol }}</span>
              <span class="block">
                {{ formatNumber(row?.quote_token_amount, 0) }}
                <span class="color-text-2">{{ row?.quote_token_symbol }}</span>
              </span>
            </template>
            <template v-else>
              {{ formatNumber(row?.base_token_amount, 0) }}
              <span class="color-text-2">{{ row?.base_token_symbol }}</span>
            </template>
          </template>
        </el-table-column>

        <!-- 价值列 -->
        <el-table-column
          :label="$t('value') + '($)'"
          prop="volume"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
          align="right"
        >
          <template #default="{ row }">
            <span :style="{ color: getColor(row?.type) }">
              {{ formatNumber(row?.volume, 2) }}
            </span>
          </template>
        </el-table-column>

        <!-- 地址列 -->
        <el-table-column
          :label="$t('address')"
          prop="address"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
          align="right"
        >
          <template #default="{ row , $index}">
            <div class="flex-end gap-3px">
              <span class="color-text-2"
                >{{ row.wallet_address?.slice(0, 2) }}...{{
                  row.wallet_address?.slice(-4)
                }}</span
              >
                <!-- :key="`${row.wallet_address}`" -->
              <!-- <Icon
                :ref="(el: any) => $refs.buttonRefs[$index] = el" name="custom:attention"
                :class="row.is_wallet_address_fav === 1 ? 'color-[#F45469]' : 'color-[#999]'" class="color-var(--d-999-l-666) text-14px clickable shrink-0" @click.stop.prevent="collect(row,$index)" /> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { formatNumber } from '@/utils/formatNumber'
import { deleteAttention, addAttention2 } from '~/api/attention'
import {
  formatExplorerUrl,
  getAddressAndChainFromId,
  formatDate,
} from '@/utils/index'
import { upColor, downColor } from '@/utils/constants'
const props = defineProps<{
  tableList: any[]
  loading?: boolean
}>()

const $refs = ref({
  buttonRefs: {} as Record<number, any>
})
const tokenStore = useTokenStore()
const route = useRoute()
const { mode } = storeToRefs(useGlobalStore())
const { t } = useI18n()
const { token } = storeToRefs(useTokenStore())
const tableRef = ref()
const tableIndex = ref(0)
const tableDataFilter = ref<any[]>([])
const isLoading = computed(() => props.loading ?? false)

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
const tableHeight = computed(() => {
  return Math.max(tokenStore.commonHeight - 400, 450)
})
watch(
  () => props.tableList,
  (val) => {
    tableDataFilter.value = val
  },
  { immediate: true }
)

const collect = async (row: any,index:number) => {
  if(!useFollowStore().currentAddress){
    useBotStore().changeConnectVisible(true)
  }
  if (useWalletStore().address && !useWalletStore().walletSignature[useWalletStore().address]) {
    await useWalletStore().signMessageForFavorite()
  }

  console.log('collect',row,index)
  if(row.is_wallet_address_fav !== 1){
    useFollowStore().confirmAttention($refs.value.buttonRefs[index],row.chain, (form) => {
      return addAttention2({
        address: useFollowStore().currentAddress,
        user_address: row.wallet_address,
        user_chain: addressAndChain.value.chain,
        group: form.group,
        is_monitored: form.is_monitored,
      }).then((res) => {
        (tableDataFilter.value as Array<any>)[index].is_wallet_address_fav = 1
        // getList()
        return Promise.resolve(res)
      }).catch((err) => {
        return Promise.reject(err)
      }).finally(() => {
      })
    })
    return 
  }
  // loading.value = true
  deleteAttention({
    address: useFollowStore().currentAddress,
    user_address: row.wallet_address,
    user_chain: addressAndChain.value.chain
  }).then(() => {
    ElMessage.success(t('attention1Canceled'));
    (tableDataFilter.value as Array<any>)[index].is_wallet_address_fav = 0
    // getList()
  }).catch((err) => {
    console.log(err)
  }).finally(() => {
  })
}
const filterHandler = (value: string, row: any) => {
  return value === row?.type
}

const tableRowClick = (item: any) => {
  const url = formatExplorerUrl(addressAndChain.value.chain, item.txhash, 'tx')
  window.open(url)
}

const filterType = (type: string) => {
  const types: Record<string, string> = {
    BUY: t('buy').toUpperCase(),
    SELL: t('sell').toUpperCase(),
    ADD: t('addPool'),
    REMOVE: t('removePool'),
    TRANSFER_IN: t('transferIn1'),
    TRANSFER_OUT: t('transferOut1'),
  }
  return types[type] || ''
}

const getColor = (type: string) => {
  const upTypes = ['BUY', 'TRANSFER_IN', 'ADD']
  return upTypes.includes(type) ? upColor[0] : downColor[0]
}

const defaultSort = computed(() => {
  const dir = conditions.value.direction
  return {
    prop: conditions.value.sort,
    order:
      dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : undefined,
  } as {
    prop: string
    order?: 'ascending' | 'descending'
  }
})

const conditions = ref({
  page: 1,
  page_size: 300,
  sort: '',
  direction: undefined as 'asc' | 'desc' | undefined,
})

const sortChange = ({
  prop,
  order,
}: {
  prop: string
  order: 'ascending' | 'descending' | null
}) => {
  if (!prop) return
  const list = [...props.tableList]
  if (order === 'ascending') {
    tableDataFilter.value = list.sort((a, b) => a[prop] - b[prop])
  } else if (order === 'descending') {
    tableDataFilter.value = list.sort((a, b) => b[prop] - a[prop])
  } else {
    tableDataFilter.value = list
  }
}

const typeFilters = computed(() => [
  { text: t('buy').toUpperCase(), value: 'BUY' },
  { text: t('sell').toUpperCase(), value: 'SELL' },
  { text: t('addPool'), value: 'ADD' },
  { text: t('removePool'), value: 'REMOVE' },
  { text: t('transferIn1'), value: 'TRANSFER_IN' },
  { text: t('transferOut1'), value: 'TRANSFER_OUT' },
])
const defaultSelectedFilters = computed(() => {
   return typeFilters.value.map(item => item.value)
})
</script>

<style scoped lang="scss">
// .table-empty {
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   padding: 80px 0;
// }
/* 省略其它样式，与原始版本相同 */
</style>
