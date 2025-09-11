<template>
  <div class="histrory">
    <div class="top">
      <span>{{ $t('address') }}</span>
      <span>{{ $t('remark') }}</span>
      <span>{{ $t('buy') }}</span>
      <span>{{ $t('sell') }}</span>
      <span>{{ $t('Txs') }} ({{ $t('buy1') }})</span>
      <span>{{ $t('Txs') }} ({{ $t('sell1') }})</span>
      <span>{{ $t('currentPosition') }}</span>
      <span>{{ $t('balance') }}</span>
      <span>{{ $t('profit') }}</span>
    </div>
    <el-scrollbar v-loading="loadingAttention" :height="tableHeight">
      <ul v-if="attentionList.length > 0" class="content">
        <li
          v-for="(row, $index) in attentionList"
          :key="$index"
          class="flex"
          @click.stop="handlerDialogProfitLoss({address: row.user_address})"
        >
          <span>
            <Icon
              ref="attentionTriggerRef" name="custom:attention"
              class="h-16px w-16px clickable shrink-0 color-[#F45469] align-middle"
              @click.stop.prevent="_deleteAttention(row, $index)" />
            *{{ row.user_address?.slice(-6) }}
          </span>
          <div class="flex-end" @click.stop.prevent>
            <UserRemark addressClass="token-symbol ellipsis" addressStyle="max-width: 70px" showAddressTitle :address="row.user_address" :chain="chain" :remark="row.remark"   @updateRemark="({remark}) => row.remark = remark" />
          </div>

          <div>{{ formatNumber(row.bug_amount || 0, 2) }}</div>
          <div>{{ formatNumber(row.sell_amount || 0, 2) }}</div>
          <span>{{ formatNumber(row.bug_count || 0, 0) }}</span>
          <span>{{ formatNumber(row.sell_count || 0, 0) }}</span>
          <span>{{ formatNumber(row.current_position || 0, 2) }}</span>
          <span>${{ formatNumber(row.position_value || 0, 2) }}</span>
          <div>
            <span
              class="value"
              :style="{
                color: row.profit >= 0 ? upColor[0] : downColor[0],
              }"
            >
              ${{ formatNumber(row.profit || 0, 2) }}
            </span>
          </div>
        </li>
      </ul>

      <ave-empty v-if="(!attentionList || attentionList?.length === 0) && !loadingAttention" class="mt-200px" />
    </el-scrollbar>
    <ProfitLoss ref="profitLossRef1" v-model="dialogProfitLoss"/>
  </div>
</template>

<script setup lang="ts">
import { _getAttentionListOld, type AddAttentionOld } from '@/api/follow'
import { upColor, downColor } from '@/utils/constants'
import { deleteAttention } from '@/api/attention'
import ProfitLoss from '../../holders/old/profitLoss.vue'
const props = defineProps({
  currentActiveTab: {
    type: String,
    default: 'Transactions'
  }
})
const tokenStore = useTokenStore()
const { t } = useI18n()
const route = useRoute()
const loadingAttention = shallowRef(false)
const attentionList = ref<AddAttentionOld[]>([])
const id = computed(() => {
  return route.params?.id as string
})
const globalStore = useGlobalStore()
const dialogProfitLoss = shallowRef<boolean>(false)
const profitLossRef1 = ref()
const tokenInfo = computed(() => tokenStore.token)
const chain = computed(() => {
  const routeParams = getAddressAndChainFromId(route.params.id as string)
  return routeParams?.chain || tokenInfo.value?.chain || ''
})
const tableHeight = computed(() => {
  return Math.max(tokenStore.commonHeight - 150, 450)
})
watch(() => globalStore.headFollowsNum.all, () => {
  if (props.currentActiveTab == 'Attention') {
    getAttentionListOld()
  }
})
watch(id, () => {
  if (props.currentActiveTab == 'Attention') {
    getAttentionListOld()
  }
})
watch(() => useFollowStore().currentAddress, (val) => {
  if (val) {
    if (props.currentActiveTab == 'Attention') {
      getAttentionListOld()
    }
  } else {
    attentionList.value = []
  }
})

onActivated(() => {
  if (props.currentActiveTab == 'Attention') {
    getAttentionListOld()
  }
})

function getAttentionListOld() {
  if (!useFollowStore().currentAddress) {
    return
  }
  const params = {
    token_id: id.value,
    address: useFollowStore().currentAddress,
  }
  loadingAttention.value = true
  _getAttentionListOld(params)
    .then((res) => {
      console.log('-------getAttentionListOld------', res)
      attentionList.value = res || []
    })
    .finally(() => {
      loadingAttention.value = false
    })
}
function handlerDialogProfitLoss(row: { address: string }) {
  dialogProfitLoss.value = true
  profitLossRef1.value?.getUserTxs(row.address)
}
function _deleteAttention(row: AddAttentionOld, index: number) {
  const params = {
    address: useFollowStore().currentAddress,
    user_address: row.user_address,
    user_chain: chain.value,
  }
  deleteAttention(params)
    .then(() => {
      globalStore.getFollowsNum()
      ElMessage.success(t('attention1Canceled'))
      attentionList.value?.splice(index, 1)
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {})
}
</script>

<style lang="scss" scoped>
.histrory {
  padding-bottom: 10px;
  .top {
    color: var(--third-text);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 5px;
    font-size: 12px;
    background: var(--table-title-bg);
    > :nth-child(1) {
      flex: 1;
    }
    > :nth-child(2) {
      flex: 1;
      text-align: right;
    }
    > :nth-child(3) {
      flex: 1;
      text-align: right;
    }
    > :nth-child(4) {
      flex: 1;
      text-align: right;
    }
    > :nth-child(5) {
      flex: 1;
      text-align: right;
    }
    > :nth-child(6) {
      flex: 1;
      text-align: right;
    }
    > :nth-child(7) {
      flex: 1;
      text-align: right;
    }
    > :nth-child(8) {
      flex: 1.5;
      text-align: right;
    }
    > :nth-child(9) {
      flex: 1.5;
      text-align: right;
    }
  }
  .content {
    padding-bottom: 20px;
    .flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      > :nth-child(1) {
        flex: 1;
      }
      > :nth-child(2) {
        flex: 1;
        text-align: right;
      }
      > :nth-child(3) {
        flex: 1;
        text-align: right;
      }
      > :nth-child(4) {
        flex: 1;
        text-align: right;
      }
      > :nth-child(5) {
        flex: 1;
        text-align: right;
      }
      > :nth-child(6) {
        flex: 1;
        text-align: right;
      }
      > :nth-child(7) {
        flex: 1;
        text-align: right;
      }
      > :nth-child(8) {
        flex: 1.5;
        text-align: right;
      }
      > :nth-child(9) {
        flex: 1.5;
        text-align: right;
      }
      div {
        padding: 5px 0;
      }
      cursor: pointer;
      &:hover {
        background-color: var(--dialog-bg);
      }
    }
    color: var(--secondary-text);
    .green {
      color: #12b886;
    }
    .red {
      color: #ff646d;
    }
    i.edit {
      color: var(--third-text);
      vertical-align: middle;
      &:hover {
        color: var(--primary-color);
      }
    }
    // a {
    //   color: var(--custom-text-2-color);
    //   &:hover {
    //     text-decoration: none;
    //     color: var(--custom-primary-color);
    //   }
    // }
  }
}
</style>
