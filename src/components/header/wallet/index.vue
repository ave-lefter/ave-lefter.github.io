<template>
  <el-popover
    v-model:visible="tgWalletVisible" placement="bottom-end" :width="360" trigger="click"
    :popper-style="`--el-popover-padding: 0; --el-bg-color-overlay: ${mode === 'dark' ? '#222222' : '#ffffff'}`">
    <template #reference>
      <div
        class="flex text-12px clickable-btn text-[--d-E9E9E9-l-222] h-32px cursor-pointer flex items-center bg-[--d-222-l-F2F2F2] border-rd-4px px-10px py-0 min-w-80px  ml-8px">
        <img
          class="border-rd-[50%] mr-5px" height="16" :src="generateAvatarIcon(botStore?.userInfo?.name || '')"
          alt="">
        <span>{{ botStore?.userInfo?.name || '' }}</span>
        <Icon
          name="mdi:menu-down"
          :class="['font-size-28px cursor-pointer ml--5px transition-all duration-0.4s', !!tgWalletVisible && 'rotate-z-180 origin-center']" />
      </div>
    </template>
    <div class="tg-wallet-container">
      <div v-show="showVisible === 0" class="tg-wallet-list">
        <div class="flex-start text-16px tg-wallet-list_title" @click.stop="showVisible = 1">
          <div class="flex-start clickable">
            <img
              style="border-radius: 50%;margin-right: 5px;" height="40"
              :src="generateAvatarIcon(botStore?.userInfo?.name || '')" alt="">
            <span style="margin-right: 8px;">{{ botStore?.userInfo?.name || '' }}</span>
            <Icon
              name="mdi:menu-down"
              :class="['font-size-28px cursor-pointer ml--5px transition-all duration-0.4s']" />
          </div>
        </div>
        <ul class="tg-wallet-list_content">
          <el-scrollbar :max-height="300">
            <li
              v-for="(item, index) in botStore?.userInfo?.addresses || []"
              :key="index" class="clickable"
              @click.stop="navigateToWallet(item.address, item.chain)">
              <img :src="`${token_logo_url}chain/${item.chain}.png`" class="mr-5px border-rd-[50%]" height="32" alt="">
              <div>
                <div class="text-16px">{{ getChainInfo(item.chain)?.name }}</div>
                <div class="text-12px color-[--d-999-l-959A9F] mt-5px">
                  <span>{{ item.address?.replace?.(new RegExp('(.{6})(.+)(.{4})'), '$1...$3') }}</span>
                  <Icon v-copy="item.address" name="bxs:copy" class="ml-5px mb--1px clickable" @click.stop />
                </div>
              </div>
              <div class="text-right" style="margin-left: auto;">
                <div class="text-14px">{{ formatNumber(item?.balance || 0, 5) }} {{
                  getChainInfo(item.chain)?.main_name }}</div>
                <div class="text-12px color-[--d-999-l-959A9F] mt-5px ">$ {{ formatNumber((item?.price || 0) *
                  Number(item?.balance
                    ||
                  0), 1) }}</div>
              </div>
            </li>
          </el-scrollbar>
        </ul>
        <div style="flex: 1;" />
        <div class="tg-wallet-list_footer">
          <div style="display: flex;">
            <el-button style="flex: 1;" size="large" color="#333333" @click.stop="showVisible = 2">{{ t('deposit')
            }}</el-button>
            <el-button style="flex: 1; margin-left: 8px;" size="large" color="#333333" @click.stop="showVisible = 3">{{
              t('withdraw') }}</el-button>
          </div>
          <el-button
            style="width: 100%;margin-top: 8px; color: #959A9F;" size="large" color="#333333"
            @click.stop="botStore.logout(); tgWalletVisible = false">{{ t('logout') }}</el-button>
        </div>
      </div>
      <div v-show="showVisible === 1" class="tg-wallet-list">
        <div class="flex-start text-16px tg-wallet-list_title">
          <el-icon size="24" class="clickable" @click.stop="showVisible = 0">
            <Back />
          </el-icon>
          <span class="ml-5px">{{ t('allAccounts') }}</span>
        </div>
        <ul class="tg-wallet-list_content">
          <el-scrollbar :max-height="300">
            <!-- $store.dispatch('bot_switchWallet', item); -->
            <li
              v-for="(item, index) in botStore.walletList" :key="index"
              :class="{ active: item.name === botStore?.userInfo?.name }"
              @click.stop="switchWallet(item)">
              <img
                style="border-radius: 50%;margin-right: 5px;" height="32" :src="generateAvatarIcon(item?.name || '')"
                alt="">
              <span style="margin-right: auto;">{{ item.name || '' }}</span>
            </li>
          </el-scrollbar>
        </ul>
      </div>
      <div v-show="showVisible === 2" class="tg-wallet-list">
        <div class="flex-start text-20px tg-wallet-list_title">
          <el-icon size="24" class="clickable" @click.stop="showVisible = 0">
            <Back />
          </el-icon>
          <span class="ml-5px">{{ t('deposit') }}</span>
        </div>
        <div class="tg-wallet-list_content">
          <div style="padding: 15px 20px;">
            <el-select
              v-model="depositChain" class="chains-select" placeholder="Select" size="large"
              style="width: 100%" :teleported="false" :suffix-icon="ArrowDownBold">
              <template #prefix>
                <img
                  v-if="depositChain" height="24" class="mr-5px border-rd-[50%]"
                  :src="`${token_logo_url}chain/${depositChain}.png`" style="" alt="" srcset="">
              </template>
              <el-option
                v-for="item in botStore?.userInfo?.addresses || []" :key="item.chain"
                :label="getChainInfo(item.chain)?.name" :value="item.chain">
                <div class="flex-start">
                  <img
                    v-if="item.chain" height="24" class="mr-5px border-rd-[50%]"
                    :src="`${token_logo_url}chain/${item.chain}.png`" style="" alt="" srcset="">
                  <span>{{ getChainInfo(item.chain)?.name || '' }}</span>
                </div>
              </el-option>
            </el-select>
            <div class="flex-center mt-30px flex-col">
              <canvas id="qr-chain-canvas" />
              <div
                class="text-12px"
                style="display: flex; align-items: center; word-break: break-all; line-height: 1.2; padding: 20px 20px 40px; color: var(--d-999-l-222);">
                <span>{{ depositChainInfo?.address || '' }}</span>
                <Icon
                  v-if="depositChainInfo?.address" v-copy="depositChainInfo?.address" name="bxs:copy"
                  class="ml-5px mb--1px clickable" @click.stop />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="showVisible === 3" class="tg-wallet-list">
        <div class="flex-start text-20px tg-wallet-list_title">
          <el-icon size="24" class="clickable" @click.stop="showVisible = 0">
            <Back />
          </el-icon>
          <span class="ml-5px">{{ t('withdraw') }}</span>
        </div>
        <el-form
          ref="withdrawFormRef" :model="withdrawForm" :rules="rules" hide-required-asterisk
          class="tg-wallet-list_content" size="large" @submit.prevent="handleWithdraw">
          <div style="padding: 15px 20px 20px;">
            <el-form-item label="" label-position="top">
              <el-select
                v-model="withdrawForm.chain" class="chains-select" placeholder="Select" size="large"
                style="width: 100%" :teleported="false" :suffix-icon="ArrowDownBold"
                @change="handleWithdrawChainChange">
                <template #prefix>
                  <img
                    v-if="withdrawForm.chain" height="24" class="mr-5px border-rd-[50%]"
                    :src="`${token_logo_url}chain/${withdrawForm.chain}.png`" style="" alt="" srcset="">
                </template>
                <el-option
                  v-for="item in botStore?.userInfo?.addresses || []" :key="item.chain"
                  :label="getChainInfo(item.chain)?.name" :value="item.chain">
                  <div class="flex-start">
                    <img
                      v-if="item.chain" height="24" class="mr-5px border-rd-[50%]"
                      :src="`${token_logo_url}chain/${item.chain}.png`" style="" alt="" srcset="">
                    <span>{{ getChainInfo(item.chain)?.name || '' }}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="t('plsEnterAddress')" label-position="top" prop="address">
              <el-input
                v-model="withdrawForm.address"
                style="background: var( --d-333-l-F2F2F2); --el-input-bg-color: var( --d-333-l-F2F2F2); --el-input-border-color: var( --d-333-l-F2F2F2); border-radius: 4px;--el-input-height:48px;"
                clearable placeholder="" />
            </el-form-item>
            <el-form-item :label="t('plsEnterAmount')" label-position="top" prop="amount">
              <el-input
                v-model="withdrawForm.amount"
                style="background: var( --d-333-l-F2F2F2); --el-input-bg-color: var( --d-333-l-F2F2F2); --el-input-border-color: var( --d-333-l-F2F2F2); border-radius: 4px;--el-input-height:48px;"
                inputmode="decimal" clearable placeholder="0.00"
                @input="value => withdrawForm.amount = value.replace(/\-|[^\d.]/g, '')">
                <template #suffix>
                  <span class="color-text-1">{{ getChainInfo(withdrawForm.chain)?.main_name }}</span>
                </template>
              </el-input>
              <div
                class="text-12px color-[--d-999-l-959A9F] text-right"
                style="width: 100%; line-height: 1; margin-top: 5px;position: absolute; right: 0; top: 100%;">
                <span class="clickable" @click.stop="handleMax">{{ t('balance1') }}: {{
                  formatNumber(withdrawChainInfo?.balance || 0, 5) }} {{
                    getChainInfo(withdrawForm.chain)?.main_name
                  }}</span>
              </div>
            </el-form-item>
            <el-button
              native-type="submit" style="width: 100%; margin-top: 25px" size="large"
              :color="mode === 'dark' ? '#f5f5f5' : '#333333'" :loading="loadingWithdraw">{{ t('withdraw')
              }}</el-button>
          </div>
        </el-form>

      </div>
      <double-check
        v-if="showVisible === 4" v-model:showVisible="showVisible" :visible="tgWalletVisible"
        @action="handleWithdraw2" @update:emailCode="(code: string) => emailCode = code"
        @update:authCode="(code: string) => authCode = code" />
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { bot_createSafeTransferTx, bot_getTransferGasFee } from '@/api/bot'
import { generateAvatarIcon, getChainInfo, isValidAddress, evm_utils as utils } from '@/utils'
import { formatBotError, handleBotError } from '@/utils/bot'
import { NATIVE_TOKEN } from '@/utils/constants'
import { formatNumber } from '@/utils/formatNumber'
import { ArrowDownBold, Back } from '@element-plus/icons-vue'
import { useEventBus } from '@vueuse/core'
import BigNumber from 'bignumber.js'
import { ElMessage, ElMessageBox, ElNotification as ElNotify, type FormInstance } from 'element-plus'
import { throttle } from 'lodash-es'
import QrCodeWithLogo from 'qr-code-with-logo'
import doubleCheck from './doubleCheck.vue'

const { mode, token_logo_url } = storeToRefs(useGlobalStore())
const { t } = useI18n()
const botStore = useBotStore()
// const route = useRoute()
// const router = useRouter()

const tgWalletVisible = ref(false)
const showVisible = ref(0)
const depositChain = ref('solana')

useEventBus<string>('botTopUp').on((val) => {
  tgWalletVisible.value = true
  nextTick(() => {
    showVisible.value = 2
    depositChain.value = val
  })
})
interface WithdrawFormData {
  amount: string
  address: string
  chain: 'solana' | 'eth' | 'bsc' | 'base'
  memo?: string
}
const withdrawForm = reactive<WithdrawFormData>({
  amount: '',
  address: '',
  chain: 'solana',
  memo: ''
})
const loadingWithdraw = ref(false)
const emailCode = ref('')
const authCode = ref('')
const withdrawFormRef = ref<FormInstance>()

const gasFeeObj = ref<{ [key: string]: number }>({
  solana: 1000000,
  eth: 599999906814000,
  bsc: 21000000000000,
  base: 452549454000
})

const depositChainInfo = computed(() => {
  return botStore?.userInfo?.addresses?.find?.(i => i?.chain === depositChain.value)
})

const withdrawChainInfo = computed(() => {
  return botStore?.userInfo?.addresses?.find?.(i => i?.chain === withdrawForm?.chain)
})

const checkAddress = (chain: string | undefined) => (rule: any, value: string, callback: (arg0?: Error | undefined) => void) => {
  if (!value) {
    return callback(new Error(t('plsEnterAddress')))
  } else if (!isValidAddress(value, chain)) {
    return callback(new Error(t('pleaseEnterCorrectAddress')))
  } else {
    callback()
  }
}

const checkAmount = (balance: BigNumber.Value) => (rule: any, value: BigNumber.Value, callback: (arg0?: Error | undefined) => void) => {
  if (!value) {
    return callback(new Error(t('plsEnterAmount')))
  } else if (new BigNumber(value).gt(balance)) {
    return callback(new Error(t('insufficientBalance2')))
  } else {
    callback()
  }
}

const rules = computed(() => ({
  amount: [
    { required: true, message: t('plsEnterAmount'), trigger: 'blur' },
    { validator: checkAmount(withdrawChainInfo.value?.balance || 0), trigger: 'blur' }
  ],
  address: [
    { required: true, message: t('plsEnterAddress'), trigger: 'blur' },
    { validator: checkAddress(withdrawForm?.chain), trigger: 'blur' }
  ]
}))

watch(tgWalletVisible, () => {
  showVisible.value = 0
  emailCode.value = ''
  authCode.value = ''
})

watch(() => depositChainInfo.value?.chain, () => {
  if (depositChainInfo.value?.address) {
    setChainQr()
  }
})

watch(showVisible, (val) => {
  if (val === 2) {
    setChainQr()
  } else if (val === 3) {
    withdrawFormRef.value?.resetFields?.()
  }
})

// watch(() => store.state.bot.topUp.key, (val) => {
//   if (route.name === 'Token') {
//     tgWalletVisible.value = true
//     depositChain.value = store.state.bot.topUp.chain
//     setTimeout(() => {
//       showVisible.value = 2
//     }, 100)
//   }
// })

watch(() => withdrawForm.chain, (val) => {
  if (val) {
    withdrawFormRef.value?.resetFields?.()
    getTransferGasFee()
  }
})

onMounted(() => {
  preLoadShareImg()
  getTransferGasFee()
})

function navigateToWallet (path: string, chain:string) {
  // if(chain === 'solana' || chain === 'bsc') {
    path = `/address/${path}/${chain}`
    navigateTo(path)
  // } else {
  //   window.open(`https://ave.ai/address/${path}/${chain}`, '_blank')
  // }
}
function switchWallet(item: any) {
  // Implement wallet switching logic here, for example:
  botStore.switchWallet(item.evmAddress)
  tgWalletVisible.value = false
}

function handleWithdrawChainChange(val: any) {
  if (val && !withdrawForm.amount && !withdrawForm.address) {
    withdrawFormRef.value?.resetFields?.()
    nextTick(() => {
      withdrawFormRef.value?.resetFields?.()
    })
  }
}

async function setChainQr() {
  const address = botStore?.userInfo?.addresses?.find?.(i => i?.chain === depositChain.value)?.address
  if (!address) {
    return
  }
  const canvas = document.getElementById('qr-chain-canvas')
  if (!canvas) {
    return
  }
  QrCodeWithLogo.toCanvas({
    canvas: canvas,
    content: address,
    width: 200,
    nodeQrCodeOptions: {
      margin: 2,
    },
    logo: {
      src: `${token_logo_url.value}chain/${depositChain.value}.png`,
      logoRadius: 8
    }
  }).catch((err: any) => {
    console.log('QrCodeWithLogo error', err)
  })
}

function handleWithdraw() {
  withdrawFormRef?.value?.validate((valid) => {
    if (valid) {
      const decimals = withdrawChainInfo.value?.decimals || 18
      let gasFee = new BigNumber(gasFeeObj.value[withdrawForm.chain] || 0).div(10 ** decimals).plus(withdrawForm.amount || 0)
      if (withdrawForm?.chain === 'solana') {
        gasFee = gasFee.plus('0.002')
      }

      const balance = new BigNumber(withdrawChainInfo.value?.balance || 0)
      if (balance.lt(gasFee)) {
        ElMessage.error(t('transferInsufficientBalance', { s: getChainInfo(withdrawForm.chain)?.main_name }))
        return
      }
      showVisible.value = 4
    }
  })
}

function handleWithdraw2() {
  withdrawFormRef?.value?.validate((valid) => {
    if (valid) {
      const chainMainToken: { [key: string]: string } = {
        solana: 'sol',
        ton: 'TON',
      }
      const amount = ((new BigNumber(withdrawForm.amount || 0)).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${withdrawChainInfo.value?.decimals || 18}})?`)) || [''])[0]
      if ((Number(amount) || 0) <= 0) {
        ElNotify({ title: 'Error', type: 'error', message: t('withdrawAmountTooSmall') })
        return
      }
      if (withdrawChainInfo.value?.address?.toLowerCase?.() === withdrawForm?.address?.toLowerCase?.()) {
        ElNotify({ title: 'Error', type: 'error', message: t('withdrawToSelf') })
        return
      }

      const data = {
        batchId: Date.now().toString(),
        chain: withdrawForm.chain,
        creatorAddress: withdrawChainInfo?.value?.address || '',
        tokenAddress: chainMainToken[withdrawForm.chain] || NATIVE_TOKEN,
        tgUid: botStore?.userInfo?.tgUid,
        amount: utils.parseUnits(amount || 0, withdrawChainInfo.value?.decimals || 18).toString(),
        transferTo: withdrawForm.address,
        memo: '',
        emailCode: emailCode.value,
        authCode: authCode.value,
        gasTip: 0,
        source: 'web' as const
      }

      ElMessageBox.confirm(
        t('confirmWithdraw', {
          amount: amount,
          address: withdrawForm.address,
          symbol: getChainInfo(withdrawForm.chain)?.main_name
        }),
        t('tips'),
        {
          confirmButtonText: t('confirm'),
          cancelButtonText: t('cancel'),
          appendTo: '.tg-wallet-container',
        }
      ).then(() => {
        loadingWithdraw.value = true
        bot_createSafeTransferTx(data).then(res => {
          if (res) {
            let Timer: ReturnType<typeof setTimeout> | null = setTimeout(() => {
              ElNotify({ title: 'Success', type: 'success', message: t('withdrawSubmitted') })
            }, 500)
            tgWalletVisible.value = false
            loadingWithdraw.value = false
            const unwatch = watch(() => useWSStore().wsResult?.tgbot, (subscribeResult) => {
              const batchId = subscribeResult.batchId
              if (batchId === data.batchId) {
                if (Timer) {
                  clearTimeout(Timer)
                  Timer = null
                }
                if (subscribeResult?.success) {
                  ElNotify({ title: 'Success', type: 'success', message: t('withdrawSuccess') })
                  unwatch()
                  setTimeout(() => {
                    botStore.getUserAllChainBalance()
                  }, 1000)
                } else {
                  ElNotify({ title: 'Error', type: 'error', message: formatBotError(subscribeResult.failMessage) || 'Withdraw failed' })
                  unwatch()
                }
              }
            })
          }
        }).catch(err => {
          emailCode.value = ''
          authCode.value = ''
          handleBotError(err || 'Withdraw failed')
          loadingWithdraw.value = false
        })
      })
    }
  })
}

function preLoadShareImg() {
  const globalConfig = useConfigStore().globalConfig
  const shareImg = globalConfig?.pc_share_image?.replace('|', ',')
  const shareImgs = shareImg?.split?.(',') || []
  shareImgs.forEach(img => {
    if (img) {
      const imgUrl = token_logo_url.value + 'pc_share/' + img
      new Image().src = imgUrl
    }
  })
}

const getTransferGasFee = throttle(function () {
  const chain = withdrawForm.chain
  console.log('getTransferGasFee', chain)
  return bot_getTransferGasFee({ chain }).then(res => {
    gasFeeObj.value[chain] = res
    return res
  })
}, 500, { leading: true, trailing: true })

function handleMax() {
  const decimals = withdrawChainInfo.value?.decimals || 18
  if (!gasFeeObj.value[withdrawForm.chain] || 0) {
    getTransferGasFee().catch(console.log)
  }
  let gasFee = new BigNumber(gasFeeObj.value[withdrawForm.chain] || 0).div(10 ** decimals)
  if (withdrawForm?.chain === 'solana') {
    gasFee = gasFee.plus('0.002')
  }
  const balance = new BigNumber(withdrawChainInfo.value?.balance || 0)
  if (balance.lt(gasFee)) {
    ElMessage.error(t('transferInsufficientBalance', { s: getChainInfo(withdrawForm.chain)?.main_name }))
    return
  }
  const matchResult = balance.minus(gasFee).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${withdrawChainInfo.value?.decimals || 18}})?`))
  const amount = matchResult ? matchResult[0] : ''
  withdrawForm.amount = amount
  withdrawFormRef.value?.validateField?.('amount')
}
</script>

<style lang='scss' scoped>
/* .tg-name-box {
  color: var(--custom-text-1-color);
  height: 32px;
  cursor: pointer;
  background: var(--custom-bg-6-color);
  border-radius: 4px;
  padding: 0 10px;
  min-width: 80px;
  .arrow-up {
    font-size: 8px;
    margin-left: 5px;
    transition: all 0.4s;
    zoom: 0.8;
    &.active {
      transform: rotateZ(180deg);
      transform-origin: center;
    }
  }
} */

.tg-wallet-list {
  min-height: 400px;
  color: var(--d-E9E9E9-l-222);
  display: flex;
  flex-direction: column;

  .tg-wallet-list_title {
    padding: 20px;
    border-bottom: 0.5px solid var(--d-33353D-l-F5F5F5);
  }

  .tg-wallet-list_content {
    li {
      padding: 15px 20px;
      display: flex;
      align-items: center;
      line-height: 1;
      cursor: pointer;

      &:hover {
        background: var(--d-333-l-F2F2F2);
      }

      &.active {
        background: var(--d-333-l-F2F2F2);
      }
    }
  }

  .tg-wallet-list_footer {
    padding: 20px;
  }

  .chains-select {
    --el-select-border-color-hover: transparent;

    :deep() {
      .el-select__wrapper.el-select__wrapper {
        box-shadow: none;
        background: var(--d-333-l-F2F2F2);
        min-height: 48px;
      }

      .el-select-dropdown__item {
        padding: 0 32px 0 15px;
        height: 48px;
        --el-fill-color-lighter: var(--d-333-l-F2F2F2);
      }
    }
  }

  .go-wallet-route {
    margin-left: auto;
    font-size: 14px;
    color: #999999;

    &:hover {
      color: var(--d-FFF-l-000);  }
  }
}
</style>
