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
        <ul class="tg-wallet-list_footer flex flex-col gap-10px">
          <li class="flex justify-between h-40px px-20px clickable">
            <div class="color-[--d-F5F5F5-l-333] flex items-center gap-8px" @click.stop="showVisible = 1">
              <Icon name="custom:wallet2" class="text-16px"/>
              <span class="font-500 text-14px">{{ t('myWallet1') }}</span>
            </div>
            <div class="color-#999 flex items-center gap-4px">
              <span class="font-500 text-12px">
                {{ botStore?.userInfo?.name || '' }}
              </span>
              <Icon name="material-symbols:chevron-right-rounded" class="text-16px mr--5px"/>
            </div>
          </li>
          <li class="flex justify-between h-40px px-20px clickable" @click.stop="showVisible = 2">
            <div class="color-[--d-F5F5F5-l-333] flex items-center gap-8px">
              <Icon name="custom:download" class="text-16px"/>
              <span class="font-500 text-14px">{{ t('deposit2') }}</span>
            </div>
            <div class="color-#999 flex items-center gap-4px">
              <span class="font-500 text-12px">
              </span>
              <Icon name="material-symbols:chevron-right-rounded" class="text-16px mr--5px"/>
            </div>
          </li>
          <li class="flex justify-between h-40px px-20px clickable" @click.stop="showVisible = 3">
            <div class="color-[--d-F5F5F5-l-333] flex items-center gap-8px">
              <Icon name="custom:upload" class="text-16px"/>
              <span class="font-500 text-14px">{{ t('withdraw') }}</span>
            </div>
            <div class="color-#999 flex items-center gap-4px">
              <span class="font-500 text-12px">
              </span>
              <Icon name="material-symbols:chevron-right-rounded" class="text-16px mr--5px"/>
            </div>
          </li>
          <li class="flex justify-between h-40px px-20px clickable" @click="router.push('/safe');tgWalletVisible = false">
            <div class="color-[--d-F5F5F5-l-333] flex items-center gap-8px">
              <Icon name="custom:shield-check" class="text-16px"/>
              <span class="font-500 text-14px">{{ t('safe') }}</span>
            </div>
            <div class="color-#999 flex items-center gap-4px">
              <span class="font-500 text-12px flex items-center color-#FFBE3C gap-8px">
                <template v-if="authInfo?.emailAddress && authInfo?.authSetting">
                  <Icon name="mingcute:check-circle-fill" class="text-17px color-#12B886 mt-1px"/>
                   <!-- <Icon name="custom:check-circle" class="text-14px color-#12B886"/>  -->
                  <span class="color-#12B886">{{ t('bounded') }}</span>
                </template>
                <template v-else>
                  <Icon name="mingcute:warning-fill" class="text-17px mt-1px"/>
                  <!-- <Icon name="custom:exclamation-circle" class="text-14px"/>-->
                  <span>{{ t('notBound') }}</span>
                </template>
              </span>
              <Icon name="material-symbols:chevron-right-rounded" class="text-16px mr--5px"/>
            </div>
          </li>
          <li class="flex justify-between h-40px px-20px clickable" @click.stop="walletStore.disconnect(); tgWalletVisible = false">
            <div class="color-[--d-F5F5F5-l-333] flex items-center gap-8px">
              <Icon name="custom:log-out" class="text-16px"/>
              <span class="font-500 text-14px">{{ t('logout') }}</span>
            </div>
            <div class="color-#999 flex items-center gap-4px">
              <Icon name="material-symbols:chevron-right-rounded" class="text-16px mr--5px"/>
            </div>
          </li>
        </ul>
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
        <el-form v-if="authInfo?.emailAddress && authInfo?.authSetting && authInfo?.transferStatus"
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
                  <span class="color-[--d-F5F5F5-l-333]">{{ getChainInfo(withdrawForm.chain)?.main_name }}</span>
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
              type="primary" :loading="loadingWithdraw">{{ t('withdraw')
              }}</el-button>
          </div>
        </el-form>
        <div v-else-if="!(authInfo?.emailAddress && authInfo?.authSetting)" class="px-20px py-102px text-center">
          <Icon name="custom:shield-user-line" class="text-72px color-[--d-FCFDFF-l-999] mb-16px"/>
          <div class="font-500 text-14px lh-100% color-[--d-F5F5F5-l-333] mb-8px">{{ t('2faT1') }}</div>
          <div class="font-400 text-12px lh-16px color-#999 mb-30px">{{ t('2faP1') }}</div>
          <el-button type="primary" class="w-full" size="large" @click="router.push('/safe');tgWalletVisible = false">{{ t('bindNow') }}</el-button>
        </div>
        <div v-else-if="(authInfo?.emailAddress && authInfo?.authSetting) && !authInfo?.transferStatus" class="px-20px py-102px text-center">
          <Icon name="custom:shield-user-line2" class="text-72px color-[--d-FCFDFF-l-999] mb-16px"/>
          <div class="font-500 text-14px lh-100% color-[--d-F5F5F5-l-333] mb-8px">{{ t('2faT2') }}</div>
          <div class="font-400 text-12px lh-16px color-#999 mb-30px">{{ t('2faP1') }}</div>
          <el-button type="primary" class="w-full" size="large" disabled>{{ t('cooling') }}</el-button>
        </div>
      </div>
      <double-check
        v-if="showVisible === 4" v-model:showVisible="showVisible" :visible="tgWalletVisible"
        @action="handleWithdraw2" @update:emailCode="(code: string) => emailCode = code"
        @update:authCode="(code: string) => authCode = code" />
      <div v-show="showVisible === 5" class="tg-wallet-list">
        <div class="flex-start text-20px tg-wallet-list_title">
          <el-icon size="24" class="clickable" @click.stop="showVisible = 0">
            <Back />
          </el-icon>
          <span class="ml-5px">{{ t('withdraw') }}</span>
        </div>
        <div class="p-20px">
          <div>
            <div class="mb-8px h-48px w-48px rounded-[45%] bg-[--d-333-l-F2F2F2] flex-center mx-auto">
              <el-button v-if="withdrawStatus===0" type="primary" loading text class="[&&]:[--el-mask-color-extra-light:transparent] h-48px w-48px p-0"></el-button>
              <Icon v-else-if="withdrawStatus===1" name="custom:success"  class="text-16px"/>
              <Icon v-else name="custom:fail"  class="text-18px"/>
            </div>
            <div class="mb-8px font-500 text-14px lh-[100%] tracking-0px text-center">{{ withdrawResult }}</div>
            <div class="mb-24px font-500 text-20px lh-24px tracking-0px text-center"> 
              -{{ formatNumber(withdrawForm.amount, 5) }} {{ getChainInfo(withdrawForm.chain)?.main_name }}
            </div>
            <ul class="flex flex-col gap-20px mb-30px">
              <li class="flex-between">
                <div>{{ t('toAddress') }}</div>
                <div>{{ billObj.creatorAddress?billObj.creatorAddress?.slice(0, 13) + '...' + billObj.creatorAddress?.slice(-11):'--' }}<Icon v-copy="billObj.creatorAddress" name="bxs:copy" class="ml-5px mb--1px clickable" @click.stop /></div>
              </li>
              <li class="flex-between">
                <div>{{ t('fromAddress') }}</div>
                <div>{{ billObj.transferTo?billObj.transferTo?.slice(0, 13) + '...' + billObj.transferTo?.slice(-11):'--' }}<Icon v-copy="billObj.transferTo" name="bxs:copy" class="ml-5px mb--1px clickable" @click.stop /></div>
              </li>
              <li class="flex-between">
                <div>{{ t('gasFee') }}</div>
                <div>{{ gasFeeVal||'--' }} {{ getChainInfo(withdrawForm.chain)?.main_name }}</div>
              </li>
              <li class="flex-between">
                <div>{{ t('network') }}</div>
                <div class="flex-end"><img :src="`${token_logo_url}chain/${billObj.chain}.png`" class="rd-50% mr-4px" width="14" lazy alt="">{{ billObj.chain&&getChainInfo(billObj.chain)?.name }}</div>
              </li> 
              <li class="flex-between">
                <div>{{ t('txHash1') }}</div>
                <div>{{ billObj.txHash?billObj.txHash?.slice(0, 13) + '...' + billObj.txHash?.slice(-11):'--' }}<Icon v-copy="billObj.txHash" name="bxs:copy" class="ml-5px mb--1px clickable" @click.stop /></div>
              </li>
              <li class="flex-between">
                <div>{{ t('blockHeight') }}</div>
                <div>{{ billObj.blockNumber||'--' }}</div>
              </li>
              <li class="flex-between">
                <div>{{ t('time') }}</div>
                <div>{{ billObj.createTime?formatDate(billObj.createTime, 'YYYY-MM-DD HH:mm:ss'):'--' }}</div>
              </li>
            </ul>
            <el-button class="w-full" size="large" :color="isDark?'#333333':'#F2F2F2'" @click="showVisible = 0">{{ t('withdrawAgain') }}</el-button>
          </div>
        </div>
      </div>
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
// import { getTokensPrice } from '@/api/token'

const { authInfo } =storeToRefs(useUserStore())
const { mode, token_logo_url ,isDark} = storeToRefs(useGlobalStore())
const { t } = useI18n()
const botStore = useBotStore()
const walletStore = useWalletStore()
// const route = useRoute()
const router = useRouter()

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
  chain: BotChain
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
const gasFeeVal = ref(0)

const withdrawStatus = ref(0)

const withdrawResult = computed(() => {
  return [t('trading'),t('tradeSuccess'), t('tradeFail')][withdrawStatus.value]
})
const billObj=ref({} as {
  id?: number,
  createTime?: string,
  updateTime?: string,
  status?: string,
  batchId?: string,
  chain?: string,
  evmAddress?: string,
  creatorAddress?: string,
  transferTo?: string,
  tokenAddress?: string,
  tokenDecimals?: number,
  tokenName?: string,
  tokenSymbol?: string,
  tgUid?: string,
  txData?: string,
  txValue?: string,
  txGasFeeCap?: string,
  txGasTipCap?: string,
  txGasLimit?: number,
  txToAddress?: string,
  txNonce?: number,
  txExtraGas?: number,
  transferAmount?: string,
  txSubscriptionId?: string,
  txHash?: string,
  blockNumber?: number,
  blockTime?: number,
  errorLog?: string,
  botHost?: string,
  txGasUsed?: string,
  ipAddress?: string
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
  withdrawStatus.value = 0
  gasFeeVal.value = 0
  billObj.value = {}
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
      gasFeeVal.value = gasFee.toNumber()
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
            billObj.value = res?.[0]
            let Timer: ReturnType<typeof setTimeout> | null = setTimeout(() => {
              // ElNotify({ title: 'Success', type: 'success', message: t('withdrawSubmitted') })
              showVisible.value = 5
              withdrawStatus.value = 0
            }, 500)
            // tgWalletVisible.value = false
            loadingWithdraw.value = false
            const unwatch = watch(() => useWSStore().wsResult?.tgbot, (subscribeResult) => {
              const batchId = subscribeResult.batchId
              if (batchId === data.batchId) {
                if (Timer) {
                  clearTimeout(Timer)
                  Timer = null
                }
                if (subscribeResult?.success) {
                  billObj.value.txHash=subscribeResult.txHash
                  withdrawStatus.value = 1
                  // ElNotify({ title: 'Success', type: 'success', message: t('withdrawSuccess') })
                  unwatch()
                  setTimeout(() => {
                    botStore.getUserAllChainBalance()
                  }, 1000)
                } else {
                  withdrawStatus.value = 2
                  ElNotify({ title: 'Error', type: 'error', message: formatBotError(subscribeResult.failMessage) || 'Withdraw failed' })
                  unwatch()
                }
              }
            })
          }
        }).catch(err => {
          withdrawStatus.value = 2
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
    padding-top: 10px;
    padding-bottom: 24px;
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
