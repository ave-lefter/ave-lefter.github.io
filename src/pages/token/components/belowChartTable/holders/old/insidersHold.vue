<template>
  <section class="home-content">
    <div class="tableBox card relative">
      <el-table
        :key="tableIndex"
        ref="tableRef"
        v-loading="isLoading"
        :data="tableDataFilter"
        fit
        :height="tableHeight"
        style="width: 100%;font-size: 12px"
        class="table-container"
        cell-class-name="color-[--d-999-l-959A9F] text-12px"
        :default-sort="{
          prop: conditions.sort,
          order: conditions.direction ? conditions.direction + 'ending' : undefined
        }"
        @row-click="tableRowClick"
        @sort-change="sortChange"
      >
      <template #empty>
        <div
          v-if="!loading"
          class="flex flex-col items-center justify-center py-30px"
        >
          <img v-if="mode === 'light'" src="@/assets/images/empty-white.svg" >
          <img v-if="mode === 'dark'" src="@/assets/images/empty-black.svg" >
          <span>{{ t('emptyNoData') }}</span>
        </div>
        <span v-else />
      </template>

        <el-table-column type="index" label="#" width="40" />
        <el-table-column
          :label="t('insidersOwned')"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
          prop="total_value"
          min-width="100"
          align="right"
        >
          <template #default="{ row }">
            <span
              v-if="
                (row?.balance_ratio > 0 && row?.balance > 0) ||
                type !== 'snipers'
              "
            >
              {{ formatNumber(row.total_value || 0, 2) }} ({{
                formatNumber(row.balance_ratio * 100 || 0, 2)
              }}%)
            </span>
            <span v-else style="color: #f6465d">{{ t('clearance') }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="t('buy') + '($)'"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
          prop="cumulative_purchase"
          align="right"
        >
          <template #default="{ row }">
            <span :style="{ color: upColor[0] }">{{
                formatNumber(row.cumulative_purchase || 0, 2)
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="t('sell') + '($)'"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
          prop="cumulative_sold"
          align="right"
        >
          <template #default="{ row }">
            <span :style="{ color: downColor[0] }">{{
                formatNumber(row.cumulative_sold || 0, 2)
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="t('insidersBalance1') + '($)'"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
          prop="balance"
          align="right"
        >
          <template #default="{ row }">
            {{ formatNumber(row.balance || 0, 2) }}
          </template>
        </el-table-column>

        <el-table-column
          :label="t('address')"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
          prop="address"
          min-width="100"
          align="right"
        >
          <template #default="{ row , $index}">
            <div class="flex-end gap-3px">
              <span
                >{{ row.address?.slice(0, 2) }}...{{
                  row.address?.slice(-4)
                }}</span
              >
              <a
                v-if="chain === 'solana'"
                class="ml-5 a-gray"
                @click.stop.prevent="jumpBalance(row)"
              >
                <i class="iconfont icon-wallet1 font-12" />
              </a>
              <Icon
                :ref="(el: any) => $refs.buttonRefs[$index] = el" name="custom:attention"
                :class="row.is_wallet_address_fav ? 'color-[#F45469]' : 'color-[#999]'" class="color-var(--d-999-l-666) text-14px clickable shrink-0" @click.stop.prevent="collect(row,$index)" />
              <Icon
                name="custom:filter"
                class="color-[--d-666-l-999] cursor-pointer text-10px"
                @click="handlerDialogProfitLoss(row)"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <ProfitLoss ref="profitLossRef" v-model="dialogProfitLoss"/>
  </section>
</template>

<script setup lang="ts">
import { getAddressAndChainFromId } from '@/utils/index'
import { formatNumber } from '@/utils/formatNumber'
import { upColor, downColor } from '@/utils/constants'
import ProfitLoss from './profitLoss.vue'
import { deleteAttention, addAttention2 } from '~/api/attention'
const tokenStore = useTokenStore()

const props = defineProps<{
  tableList: any[]
  loading: boolean
  type: string
}>()

// const emit = defineEmits(['getAllTagsHoldList'])

const route = useRoute()
const { t } = useI18n()
const { mode } = storeToRefs(useGlobalStore())

const tableDataFilter = ref<any[]>([])
const tableIndex = ref(0)
const dialogProfitLoss = ref(false)
const profitLossRef = ref()
const tableRef = ref()
const $refs = ref({
  buttonRefs: {} as Record<number, any>
})

const isLoading = computed(() => props.loading)
const chain = computed(
  () => getAddressAndChainFromId(route.params.id as string)?.chain
)
const tableHeight = computed(() => {
  return Math.max(tokenStore.commonHeight - 400, 450)
})
const conditions = ref({
  page: 1,
  page_size: 300,
  sort: '',
  direction: '',
})

watch(
  () => props.tableList,
  (val) => {
    tableDataFilter.value = val
  },
  { immediate: true }
)

function jumpBalance() {

}

function handlerDialogProfitLoss(row: { address: string }) {
  dialogProfitLoss.value = true
  profitLossRef.value?.getUserTxs(row.address)
}
const collect = async (row: any,index:number) => {
  if(!useFollowStore().currentAddress){
    useBotStore().changeConnectVisible(true)
  }
  if (useWalletStore().address && !useWalletStore().walletSignature[useWalletStore().address]) {
    await useWalletStore().signMessageForFavorite()
  }
  console.log('collect',row,index)
  if(row.is_wallet_address_fav !== true){
    useFollowStore().confirmAttention($refs.value.buttonRefs[index], (form) => {
      console.log('confirmAttention', form)
      return addAttention2({
        address: useFollowStore().currentAddress,
        user_address: row.address,
        user_chain: chain.value,
        group: form.group,
        is_monitored: form.is_monitored,
      }).then(() => {
        ElMessage.success(t('attention1Success'));
        (tableDataFilter.value as Array<any>)[index].is_wallet_address_fav = true
        // getList()
        return Promise.resolve()
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
    user_address: row.address,
    user_chain: chain.value
  }).then(() => {
    ElMessage.success(t('attention1Canceled'));
    (tableDataFilter.value as Array<any>)[index].is_wallet_address_fav = false
    // getList()
  }).catch((err) => {
    console.log(err)
  }).finally(() => {
  })
}
function sortChange({
  prop,
  order,
}: {
  prop: string
  order: 'ascending' | 'descending' | null
}) {
  const list = [...props.tableList]
  if (!prop) return
  if (order === 'ascending') {
    tableDataFilter.value = list.sort((a, b) => a[prop] - b[prop])
  } else if (order === 'descending') {
    tableDataFilter.value = list.sort((a, b) => b[prop] - a[prop])
  } else {
    tableDataFilter.value = list
  }
}

function tableRowClick(row: any) {
}
</script>

<style scoped lang="scss">
/* 保留原样式，略 */
</style>
