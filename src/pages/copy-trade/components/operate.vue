<template>
  <div>
    <el-button
      v-if="status === 'watching'"
      class="hover:opacity-80"
      size="small"
      :style="{
        '--el-button-bg-color': '#3F80F71A',
      }"
      :loading="toggleLoading"
      @click.stop.prevent="toggleFollowOrder"
    >
      <Icon name="custom:pause" class="color-[--main-text] text-12px mr-4px" />
      {{ $t('pauseCopyTrade') }}
    </el-button>
    <el-button
      v-if="status === 'pause'"
      class="hover:opacity-80"
      size="small"
      :style="{
        '--el-button-bg-color': '#12B8861A',
        '--el-button-text-color': '#12B886',
      }"
      :loading="toggleLoading"
      @click.stop.prevent="toggleFollowOrder"
    >
      <Icon name="custom:open" class="text-12px mr-4px" />
      {{ $t('watchingCopyTrade') }}
    </el-button>
    <el-button
      v-if="status === 'watching' || status === 'pause'"
      class="hover:opacity-80"
      size="small"
      :style="{
        '--el-button-bg-color': '#3F80F71A',
      }"
      :loading="updateLoading"
      @click.stop.prevent="getFollowSwapOrder"
    >
      <Icon name="custom:editor" class="text-10px mr-4px" />
      {{ $t('parameterModification') }}
    </el-button>
    <el-button
      v-if="status === 'watching' || status === 'pause'"
      class="hover:opacity-80"
      size="small"
      :style="{
        '--el-button-bg-color': '#3F80F71A',
      }"
      @click.stop.prevent="cancelFollowOrder"
    >
      <Icon name="custom:close-bolder" class="text-7px mr-4px" />
      {{ $t('close') }}
    </el-button>
    <el-button
      v-else
      class="color-[--down-color] hover:opacity-80"
      size="small"
      :style="{
        '--el-button-bg-color': '#3F80F71A',
      }"
    >
      <Icon name="custom:close-bolder" class="text-7px mr-4px" />
      {{ $t('cancelled1') }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { _toggleFollowOrder, _cancelFollowOrder, _getFollowSwapOrder } from '@/api/copyTrade'
import { Warning } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import BigNumber from 'bignumber.js'
import { getChainInfo } from '@/utils'
const botStore = useBotStore()
const emit = defineEmits(['updataRow'])
const { copyTradeVisible, form,settingCopyTrade, advancedForm, blacklist , type} = storeToRefs(useCopyTradeStore())
const { getFollowingInfo } =  useCopyTradeStore()
const props = defineProps({
  id: {
    type: Number,
    default: 0,
  },
  chain: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: '',
  },
})
const { id, chain, status } = toRefs(props)
const route = useRoute()
const { mode } = storeToRefs(useGlobalStore())
const { t } = useI18n()
const toggleLoading = shallowRef(false)
const updateLoading = shallowRef(false)
const currentUser = computed(() => {
  return botStore?.userInfo?.addresses?.find?.((el) => chain.value == el.chain)
})

function toggleFollowOrder() {
  if (!botStore.evmAddress) {
    return
  }
  toggleLoading.value = true
  const data = {
    chain: chain.value,
    followId: id.value,
  }
  _toggleFollowOrder(data)
    .then((res) => {
      console.log('----res-----', res)
      emit('updataRow', res.status)
      if (route.name == 'copy-trade') {
        getFollowingInfo()
      }
    })
    .finally(() => {
      toggleLoading.value = false
    })
}

function cancelFollowOrder() {
  if (!botStore.evmAddress) {
    return
  }
  toggleLoading.value = true
  const data = {
    chain: chain.value,
    id: id.value,
  }
  ElMessageBox.confirm('关闭后不再继续跟单，确认关闭？', '关闭跟单', {
    type: 'warning',
    icon: markRaw(Warning),
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    customClass: `${mode.value} delete_confirm`,
  }).then(() => {
    _cancelFollowOrder(data)
      .then((res) => {
        ElMessage.success(t('success'))
        emit('updataRow', 'cancelled')
        if (route.name == 'copy-trade') {
          getFollowingInfo()
        }
      })
      .finally(() => {
        toggleLoading.value = false
      })
  })
}
function getFollowSwapOrder() {
  if (!botStore.evmAddress) {
    return
  }
  const data = {
    chain: chain.value,
    id: id.value
  }
  updateLoading.value = true
  _getFollowSwapOrder(data).then(res => {
    copyTradeVisible.value = true
    type.value =1
    form.value = {
      ...Object.fromEntries(
        Object.entries(res).filter(([key]) => key in form.value)
      ),
    }
    const decimals = currentUser.value?.decimals || getChainInfo(chain.value)?.decimals
    form.value.takeProfitRatio = String(res?.takeProfitRatio / 100)
    form.value.stopLossRatio = String(res?.stopLossRatio / 100)
    form.value.maxBuyRatio = String(res?.maxBuyRatio / 100)
    console.log('--------form.value.buyAmount----',form.value.buyAmount,currentUser.value)
    form.value.buyAmount = decimals ? new BigNumber(form.value.buyAmount || 0).div(
      10 ** decimals) : ''

    if (form.value.buyType === 2) {
      form.value.maxBuyRatio = ''
    }
  form.value.slippage = res.slippage /100
  form.value.isPrivate = res.isPrivate
  form.value.isFastModel = res.isFastModel ?? false
  // form.value.priorityFee = res?.priorityFee
  form.value.priorityFee = decimals ? new BigNumber(res?.priorityFee || 0).div(
      10 ** decimals) : ''
  settingCopyTrade.value[res.chain] = {
    slippage: form.value.slippage,
    isPrivate: form.value.isPrivate,
    priorityFee: form.value.priorityFee
  }

    advancedForm.value = {
      minBuyValue: res.minBuyValue == '0'? '': res.minBuyValue,
      maxBuyValue: res.maxBuyValue == '0'? '': res.maxBuyValue,
      minMarketCap: res.minMarketCap == '0'? '': res.minMarketCap,
      maxMarketCap: res.maxMarketCap == '0' ? '' : res.maxMarketCap,
      minLiquidity: res.minLiquidity == '0' ? '' : res.minLiquidity,
      maxLiquidity: res.maxLiquidity == '0' ? '' : res.maxLiquidity,
      minTokenAge: res.minTokenAge,
      maxTokenAge: res.maxTokenAge,
      enableAt: res.enableAt,
      disableAt: res.disableAt,
    }
    blacklist.value = res?.tokenBlacklist?.map((i, index) => ({ id: index + 1, value: i }))


  }).finally(() => {
    updateLoading.value = false
  })
}
</script>

<style lang="scss" scoped></style>
