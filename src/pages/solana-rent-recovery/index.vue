<template>
  <div class="bg-[--secondary-bg] w-full flex justify-center h-[calc(100vh-92px)] overflow-y-auto">
    <div class="py-40px">
      <h3 class="text-24px color-[--main-text] font-500">Solana {{ $t('rentRecovery') }}</h3>
      <div class="mt-6px color-#999 text-12px">{{ $t('rentRecoveryDesc') }}</div>
      <div class="flex justify-center mt-20px pb-20px">
        <div class="w-678px max-w-50vw mr-42px">
          <div class="flex items-center gap-8px">
            <div class="text-14px b b-solid b-[--d-222-l-F2F2F2] h-44px px-12px flex items-center rd-8px flex-1">
              <span>SOL {{ $t('balance1') }}: {{ formatNumber2(SOLBalance, 3) }} SOL</span>
            </div>
            <div class="text-14px b b-solid b-[--d-222-l-F2F2F2] h-44px px-12px flex items-center rd-8px flex-1">
              <span>{{ $t('recyclableTokens') }}: {{ list?.length || 0 }}</span>
            </div>
          </div>
          <div class="mt-20px mb-10px color-#999 text-14px">{{ $t('selectClosedTokenAccount') }}</div>
          <div class="text-14px b b-solid b-[--d-222-l-F2F2F2] p-12px rd-8px min-h-400px h-[calc(100vh-492px)] max-h-600px overflow-y-auto relative">
            <div class="color-#9CA3AF flex items-center absolute top-12px left-12px">
              <span class="color-[--main-text]">{{ $t('selectedToken') }}</span>
              <span :class="checkedResult?.length > 0 ? 'color-#3F80F7' : ''">{{ checkedResult?.length || 0 }}</span>/<span>{{ list?.length || 0 }}</span><span class="text-12px ml-2px">({{ t('limitRent') }})</span>
            </div>
            <div class="h-16px mb-15px" />
            <div>
              <el-checkbox v-model="isCheckAll" :indeterminate="isIndeterminate" @change="checkAllChange">
                {{ $t('selectAll') }}
              </el-checkbox>
              <el-checkbox-group v-model="checkedResult" @change="checkedResultChange">
                <el-checkbox
                  v-for="item in list" :key="item.tokenAccount" :value="item.tokenAccount" shape="square" class="mt-10px flex!"
                  :disabled="checkedResult.length >= 20 && !checkedResult.includes(item.tokenAccount)">
                  {{ item.symbol || 'UNKNOWN' }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="text-14px color-#999 mt-20px mb-10px mt-20px">{{ $t('availableRent') }}</div>
          <div class="b b-solid b-[--d-222-l-F2F2F2] h-44px px-12px flex items-center rd-8px">
            <img class="w-24px mr-8px" src="../../assets/images/solana.png" alt="" srcset="">
            <span>{{ formatNumber2(checkedSolCloseRefund, 3) }} SOL</span>
          </div>
          <div class="flex items-center mt-20px">
            <el-button :color="themeStore.isDark ? '#222222' : '#f2f2f2'" class="flex-1 mr-15px! max-h-40px rd-8px!" size="large" @click.stop="checkedResult = []">{{
              $t('reset') }}</el-button>
            <el-button
              type="primary" class="flex-1 max-h-40px rd-8px!"  size="large"  :loading="loading" :disabled="!checkedResult.length || !walletAddress"
              @click.stop="_createSolCloseAccountsTx">{{ $t('submit') }}</el-button>
          </div>
        </div>
        <div class="w-500px pl-42px b-l b-l-solid b-l-[--d-222-l-F2F2F2] lh-20px">
          <h2 class="text-20px font-500 mb-10px">{{ $t('question') }}</h2>
          <h3 class="text-14px font-500 mb-8px">{{ $t('question1Title') }}</h3>
          <div class="text-14px font-400 color-#666 mb-20px">{{ $t('question1Content') }}</div>
          <h3 class="text-14px font-500 mb-8px">{{ $t('question2Title') }}</h3>
          <div class="text-14px font-400 color-#666 mb-20px">{{ $t('question2Content') }}</div>
          <h3 class="text-14px font-500 mb-8px">{{ $t('question3Title') }}</h3>
          <div class="text-14px font-400 color-#666">{{ $t('question3Content') }} <a
              href="https://solana.com/zh/docs/core/accounts" target="_blank" class="underline clickable">{{
                $t('question3Content2') }}</a></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { getSolClosableAccounts, getSolCloseRefund} from '~/api/solana-rent'
import BigNumber from 'bignumber.js'
import { useI18n } from 'vue-i18n'
import { useBotStore } from '~/stores/bot'
import type { CheckboxValueType } from 'element-plus'
import { signAndSendCloseAccountsTx, getSOLBalance } from '~/utils/wallet/solana'
import VLoading from '~/components/vLoading.vue'
const walletStore = useWalletStore()
const botStore = useBotStore()
const themeStore = useThemeStore()
const walletAddress = computed(() => {
  return botStore?.userInfo?.addresses?.find?.(i => i?.chain === 'solana')?.address || walletStore.address || ''
})
const list = ref<{ mint: string; tokenAccount: string, symbol: string }[]>([])
const SOLBalance = ref('0')
const solCloseRefund = ref('0')
const loading = ref(false)
const loading1 = ref(false)
const { t } = useI18n()



const checkedSolCloseRefund = computed(() => {
  return new BigNumber(solCloseRefund.value).times(checkedResult.value.length || 0).toFixed()
})

const totalSolCloseRefund = computed(() => {
  return new BigNumber(solCloseRefund.value).times(list.value.length || 0).toFixed()
})

const isCheckAll = ref(false)
const checkedResult = shallowRef<string[]>([])
const isIndeterminate = ref(true)

const checkAllChange = (val: CheckboxValueType) => {
  checkedResult.value = val ? list?.value?.slice(0, 20)?.map(item => item.tokenAccount) : []
  const checkedCount = checkedResult.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < list.value.length
}

const checkedResultChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length
  isCheckAll.value = checkedCount === list.value.length || checkedResult.value.length >= 20
  isIndeterminate.value = checkedCount > 0 && checkedCount < list.value.length
}

function _getSolClosableAccounts() {
  if (walletStore?.address && walletStore?.chain !== 'solana') {
    list.value = []
    return
  }
  getSolClosableAccounts(walletAddress.value).then(res => {
    console.log('getSolClosableAccounts', res)
    list.value = res
  })
}

function _getSOLBalance() {
  getSOLBalance?.(walletAddress.value).then(res => {
    SOLBalance.value = res?.balance || '0'
  })
}

function _getSolCloseRefund() {
  getSolCloseRefund().then(res => {
    console.log('getSolCloseRefund', res)
    solCloseRefund.value = new BigNumber(res).shiftedBy(-9).toFixed()
  })
}

function _createSolCloseAccountsTx() {
  const closeAccounts = checkedResult.value.map(item => {
    const mint = list.value.find(i => i.tokenAccount === item)?.mint
    return {
      mint: mint || '',
      tokenAccount: item
    }
  })
  loading.value = true
  let loadingMessage: any = null
  signAndSendCloseAccountsTx({
    // creatorAddress: walletAddress.value,
    closeAccounts: closeAccounts
  }).then(res => {
    loading1.value = true
    loadingMessage = ElMessage({
      message: t('loadingCloseAccount'),
      plain: true,
      icon: h(VLoading, { color: 'var(--d-F5F5F5-l-666)', strokeWidth: 5 }),
      customClass: 'loading-close-account',
    })
    return res.wait()
  }).then(() => {
    loading.value = false
    loading1.value = false
    // showSuccessToast(t('closeAccountsSuccess'))

    // ElMessage.success(t('closeAccountsSuccess'))
    ElMessage({
      message: t('closeAccountsSuccess'),
      type: 'success',
      plain: true
    })
    if (loadingMessage) {
      loadingMessage?.close?.()
    }
    refresh()
    useUserStore().updateHolderNum++
    checkedResult.value = []
  }).catch((error) => {
    console.log('error', error)
    loading.value = false
    loading1.value = false
    if (loadingMessage) {
      loadingMessage?.close?.()
    }
    if (botStore.accessToken && botStore?.userInfo?.addresses?.find?.(i => i?.chain === 'solana')?.address) {
      const msg = typeof error === 'string' ? error : error?.data?.message || error?.message || error?.msg
      ElMessage({
        message: formatBotError(msg) ,
        type: 'error',
        plain: true
      })
      // handleBotError(error)
    } else {
      handleError(error, 'solana')
    }
  })
}


function refresh() {
  _getSolClosableAccounts()
  _getSOLBalance()
}

// function init() {
//   _getSolCloseRefund()
//   refresh()
// }

watch(walletAddress, (val) => {
  if (val) {
    refresh()
  }
}, { immediate: true })

onMounted(() => {
  // init()
  _getSolCloseRefund()
})
</script>

<style lang="scss" scoped>
:deep() {
  --el-checkbox-text-color: var(--main-text);
  --el-checkbox-checked-text-color: var(--main-text);
  --el-checkbox-font-weight: 400;
}
</style>
<style lang="scss">
.loading-close-account.el-message.el-message--info {
  // border-width: 0;
  // --el-message-bg-color: #333;
  --el-message-text-color: var(--d-999-l-666);
}
</style>
