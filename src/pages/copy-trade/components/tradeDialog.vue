<template>
  <el-drawer
    v-model="visible"
    class="[&&]:bg-[--dialog-bg] hidden-scrollbar draw-copy"
    :size="720"
    header-class="!mb-5 [&&]:color-[--main-text]"
    append-to-body
  >
    <template #header>
      <span class="color-[--main-text]">{{ $t('walletCopyTrade') }}</span>
    </template>
    <div class="px-20px">
      <el-divider class="!m-0 !mb-5 !border-t-[--dialog-divider]" />
      <el-form
        ref="formRef"
        class="mt-18px"
        :rules="rules"
        :model="form"
        label-width="auto"
        autocomplete="off"
        label-position="left"
        @submit.prevent="createFollowOrder"
      >
        <!-- <el-scrollbar class="filter-height hidden-scrollbar" ref="scrollRef"> -->
          <div class="text-14px flex-start">
            <Icon name="custom:new-trade" class="text-12px mr-4px" />
            <span>{{ $t('noviceOrderTemplate') }}</span>
          </div>
          <div class="flex-between gap-16px mt-8px mb-19px">
            <div
              class="item bg-[--border] px-12px py-12px rounded-8px hover:opacity-80"
              v-for="(item, $index) in strategyList"
              :key="$index"
            >
              <div class="flex-between text-14px">
                <span class="color-[--main-text]">{{ item.label }}</span>
                <a href="" class="!color-[--yellow]" @click.stop.prevent="apply(item.id)">{{ $t('oneClickApplication') }}</a>
              </div>
              <div class="color-[--secondary-text] text-12px mt-12px leading-[1.5]">
                {{ item.description }}
              </div>
            </div>
          </div>
          <el-form-item :label="$t('walletAddress')" label-position="top" prop="followAddress">
            <el-input v-model.trim="form.followAddress"  :placeholder="$t('enterAddress')" />
          </el-form-item>
          <el-form-item :label="$t('chain')" label-position="top">
            <el-select style="width: 100%" :suffix-icon="SuffixIcon" v-model="form.chain" :persistent="false">
              <template #prefix>
                <ChainToken :chain="form.chain" :width="16" />
              </template>
              <el-option
                v-for="{ chain: _chain } in smartChains"
                :key="_chain"
                :label="getChainInfo(_chain)?.name"
                :value="_chain"
              >
                <div class="flex-start" style="gap: 4px">
                  <ChainToken :chain="_chain" :width="16" />
                  {{ getChainInfo(_chain)?.name }}
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('copyTradeMethod')" label-position="top">
            <div class="tabs">
              <button
                v-for="item in tabs"
                :key="item.id"
                :class="{ active: item.id === form.buyType }"
                class="flex-start"
                type="button"
                @click.stop="form.buyType = item.id"
              >
                <span>{{ item.name || '' }}</span>
                <el-tooltip placement="top" :persistent="false">
                  <template #content> <div v-html="item.tip"></div></template>
                  <Icon
                    name="majesticons:question-mark-circle-line"
                    class="ml-4px text-12px color-[--third-text]"
                  />
                </el-tooltip>
              </button>
            </div>
          </el-form-item>
          <el-form-item prop="buyAmount">
            <template v-if="form.buyType === 2">
              <el-input
                v-model.trim.number="form.buyAmount"
                
                placeholder="0.00"
                @input="(val) => onValidateInput(val, 'buyAmount')"
              >
                <template #suffix>
                  <span>{{ getChainInfo(form.chain || '')?.main_name }}</span>
                </template>
              </el-input>
            </template>
            <template v-else-if="form.buyType === 3">
              <el-input
                v-model.trim="form.maxBuyRatio"
                
                :placeholder="$t('fixedRatio')"
                @input="(val) => onValidateInput(val, 'maxBuyRatio')"
              >
                <template #suffix>
                  <span>%</span>
                </template>
              </el-input>
              <el-input
                class="mt-10px"
                v-model.trim="form.buyAmount"
                
                :placeholder="$t('maxBuyAmount')"
                @input="(val) => onValidateInput(val, 'buyAmount')"
              >
                <template #suffix>
                  <span>{{ getChainInfo(form.chain || '')?.main_name }}</span>
                </template>
              </el-input>
            </template>
            <div class="flex-between w-full">
              <span class="text-12px color-[--main-text]"
                >≈$
                {{
                  formatNumber((currentUser?.price || 0) * Number(currentUser?.balance || 0), 1)
                }}</span
              >
              <span class="text-12px color-[--third-text]"
                >{{ $t('balance1') }}: {{ formatNumber(currentUser?.balance || 0, 5) }}
                {{ getChainInfo(currentUser?.chain || '')?.main_name }}</span
              >
            </div>
          </el-form-item>
          <el-form-item :label="$t('buyType')" label-position="top">
            <el-select style="width: 100%" :suffix-icon="SuffixIcon" v-model="form.sellType" :persistent="false">
              <el-option
                v-for="(item, $index) in sellTypeList"
                :key="$index"
                :label="item.name"
                :value="item.id"
              >
                {{ item.name }}
              </el-option>
            </el-select>
          </el-form-item>
          <template v-if="form.sellType === 2">
            <el-form-item prop="takeProfitRatio">
              <el-input
                class="mt-10px"
                v-model.trim="form.takeProfitRatio"
                
                :placeholder="$t('takeProfitRatio')"
                @input="(val) => onValidateInput(val, 'takeProfitRatio')"
              >
                <template #suffix>
                  <span>%</span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="stopLossRatio">
              <el-input
                class="mt-10px"
                v-model.trim="form.stopLossRatio"
                
                :placeholder="$t('stopLossRatio')"
                @input="(val) => onValidateInput(val, 'stopLossRatio')"
              >
                <template #suffix>
                  <span>%</span>
                </template>
              </el-input>
            </el-form-item>
          </template>
          <el-form-item :label="$t('ignoreHeld')" label-position="left">
            <el-switch
              v-model="form.ignoreHeld"
              class="ml-auto"
              style="--el-switch-on-color: #3c6cf6; zoom: 0.9; height: 14px"
            />
          </el-form-item>
          <el-form-item>
            <div class="w-full">
              <div class="flex-between">
                <span class="text-16px">{{ $t('advanced') }}</span>
                <div
                  @click="isExpanded = !isExpanded"
                  class="flex-center cursor-pointer text-12px color-[--primary-color] ml-8px"
                >
                  <span>{{ isExpanded ? $t('Collapse') : $t('Expand') }}</span>
                  <Icon
                    :name="isExpanded ? 'radix-icons:triangle-up' : 'radix-icons:triangle-down'"
                    class="text-16px"
                  />
                </div>
                <div class="flex-1"></div>
                <el-button class="reset" type="primary" @click.stop="reset">
                  <Icon
                    name="custom:refresh-left"
                    :class="resetLoading ? 'animate-spin' : ''"
                  />{{ $t('reset') }}
                </el-button>
              </div>
              <transition name="fade" v-if="isExpanded">
                <div>
                  <div class="flex-start item">
                    <span class="flex-1">{{ $t('buyAmount') }}</span>
                    <el-input
                      v-model.trim.number="advancedForm.minBuyValue"
                      class="flex-1"
                      :placeholder="$t('minor')"
                      
                      @blur="
                        (e) =>
                          handleBlur(
                            ['minBuyValue', 'maxBuyValue'] as (keyof FormType)[],
                            (e.target as HTMLInputElement).value,
                            0
                          )
                      "
                      @input="
                        (val) =>
                          handleInput(['minBuyValue', 'maxBuyValue'] as (keyof FormType)[], val, 0)
                      "
                    >
                      <template #suffix>
                        <span>$</span>
                      </template>
                    </el-input>
                    <span class="gap px-4px">~</span>
                    <el-input
                      v-model.trim.number="advancedForm.maxBuyValue"
                      class="flex-1"
                      :placeholder="$t('max1')"
                      
                      @blur="
                        (e) =>
                          handleBlur(
                            ['minBuyValue', 'maxBuyValue'] as (keyof FormType)[],
                            (e.target as HTMLInputElement).value,
                            1
                          )
                      "
                      @input="
                        (val) =>
                          handleInput(['minBuyValue', 'maxBuyValue'] as (keyof FormType)[], val, 1)
                      "
                    >
                      <template #suffix>
                        <span>$</span>
                      </template>
                    </el-input>
                  </div>
                  <div class="flex-start item mt-16px">
                    <span class="flex-1">{{ $t('tokenMCap') }}</span>
                    <el-input
                      v-model.trim.number="advancedForm.minMarketCap"
                      class="flex-1"
                      :placeholder="$t('minor')"
                      
                      @blur="
                        (e) =>
                          handleBlur(
                            ['minMarketCap', 'maxMarketCap'] as (keyof FormType)[],
                            (e.target as HTMLInputElement).value,
                            0
                          )
                      "
                      @input="
                        (val) =>
                          handleInput(
                            ['minMarketCap', 'maxMarketCap'] as (keyof FormType)[],
                            val,
                            0
                          )
                      "
                    >
                      <template #suffix>
                        <span>$</span>
                      </template>
                    </el-input>
                    <span class="gap px-4px">~</span>
                    <el-input
                      v-model.trim.number="advancedForm.maxMarketCap"
                      class="flex-1"
                      :placeholder="$t('max1')"
                      
                      @blur="
                        (e) =>
                          handleBlur(
                            ['minMarketCap', 'maxMarketCap'] as (keyof FormType)[],
                            (e.target as HTMLInputElement).value,
                            1
                          )
                      "
                      @input="
                        (val) =>
                          handleInput(
                            ['minMarketCap', 'maxMarketCap'] as (keyof FormType)[],
                            val,
                            1
                          )
                      "
                    >
                      <template #suffix>
                        <span>$</span>
                      </template>
                    </el-input>
                  </div>
                  <div class="flex-start item mt-16px">
                    <span class="flex-1">{{ $t('tokenCreationTime') }}</span>
                    <DateTime ref="dateTime_Ref" @change="onDateTimeChange" />
                  </div>
                  <div class="flex-start item mt-16px">
                    <span class="flex-1">{{ $t('effectiveCopyTrade') }}</span>
                    <ClockTime ref="clockTime_Ref" @change="onClockTimeChange" />
                  </div>
                  <div class="mt-16px">
                    <div class="flex-between">
                      <span class="text-14px">{{ $t('black') }}</span>
                      <div class="flex-1"></div>
                      <!-- <el-button class="reset !color-[--yellow]" type="primary">
                        查看全部
                        <Icon name="majesticons:arrow-right" />
                      </el-button> -->
                    </div>
                    <div class="flex-start mb-5px" v-for="(token, index) in blacklist" :key="index">
                      <el-input
                        v-model.trim="blacklist[index].value"
                        
                        :placeholder="$t('plsEnterAddress')"
                        @blur="validateAddress(index)"
                      ></el-input>
                      <Icon
                        class="text-18px text-[--third-text] cursor-pointer ml-30px hover:color-[--primary-color]"
                        name="ic:baseline-delete"
                        @click="removeRow(index)"
                      />
                    </div>
                    <div
                      class="bg-#3F80F71A flex items-center justify-center gap-8px rounded-8px mt-8px color-[--primary-color] px-12px py-12px cursor-pointer"
                      @click.stop.prevent="addItem"
                    >
                      <Icon name="majesticons:plus-circle-line"  class="text-18px"/>{{ $t('addBlack') }}
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="w-full">
              <span class="text-14px">{{ $t('cancelORPause') }}</span>
              <div class="color-[--third-text] text-12px leading-16px">
                {{ $t('cancelORPauseTip') }}
              </div>
              <template v-if="form.chain && isEvmChain(form.chain)">
                <span class="text-14px color-[--yellow] flex-start gap-4px mt-16px"
                  ><Icon name="majesticons:info-circle" />{{ $t('warning') }}</span
                >
                <div class="color-[--yellow] text-12px leading-16px">
                  {{ $t('sellOutTip') }}
                </div>
              </template>
              <Setting :chain="form.chain" :visible="visible"/>
            </div>
          </el-form-item>
        <!-- </el-scrollbar> -->
      </el-form>
    </div>
    <template #footer>
      <div class="form-footer w-full bg-[--dialog-bg]" >
        <el-button
          type="primary"
          size="large"
          class="w-full"
          :disabled="disabled"
          @click.stop.prevent="createFollowOrder"
          @keydown.enter.prevent="createFollowOrder"
          :loading="loading"
          >{{ $t('confirm') }}</el-button
        >
      </div>
  </template>
  </el-drawer>
</template>
<script setup lang="ts">
import SuffixIcon from '~/components/suffixIcon.vue'
import { getChainInfo } from '@/utils'
import Setting from './setting.vue'
import DateTime from './dateTime.vue'
import ClockTime from './clockTime.vue'
import { _createFollowOrder } from '~/api/copyTrade'
import BigNumber from 'bignumber.js'
import { ElMessage, type FormInstance } from 'element-plus'
import type { BotChain } from '~/utils/types'
type TimeUnit = 'second' | 'minute' | 'hour' | 'day'
const unitMs: Record<TimeUnit, number> = {
  second: 1000,
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
}
const route = useRoute()
const { t } = useI18n()
const botStore = useBotStore()
const { setting, settingCopyTrade, form, advancedForm, blacklist, activeCopyAddress,type } = storeToRefs(useCopyTradeStore())
const { getFollowingInfo } = useCopyTradeStore()
const props = defineProps({
  modelValue: Boolean,
})
const emit = defineEmits(['update:modelValue'])
interface FormType {
  minBuyValue: string
  maxBuyValue: string
  minMarketCap: string
  maxMarketCap: string
}
//新手跟单低频策略
const lowStrategy = ref({
  buyType: 2,
  buyAmount: 0.2,
  sellType: 2,
  takeProfitRatio: 100,
  stopLossRatio: 50,
  minBuyValue: '300',
  minMarketCap: '300000',
  minTokenAge: 0,
  maxTokenAge: 60 * 60,
})
//新手跟单高频策略
const highStrategy = ref({
  buyType: 2,
  buyAmount: 0.1,
  sellType: 2,
  takeProfitRatio: 100,
  stopLossRatio: 50,

  minBuyValue: '100',
  minMarketCap: '45000',
  minTokenAge: 0,
  maxTokenAge: 10 * 60,
})
const formRef = useTemplateRef<FormInstance>('formRef')
const loading = shallowRef(false)
const isExpanded = shallowRef(false)
const resetLoading = shallowRef(false)
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
const strategyList = computed(() => {
  return [
    {
    label: t('highStrategy'),
    id: 'high',
    description:t('highStrategyTip'),
  },
  {
    label: t('lowStrategy'),
    id: 'low',
    description:t('lowStrategyTip'),
  }
]
})
const chain = shallowRef('solana')
const clockTime_Ref = ref<InstanceType<typeof ClockTime> | null>(null)
const dateTime_Ref = ref<InstanceType<typeof DateTime> | null>(null)
const disabled = computed(() => {
  if (Number(currentUser.value?.balance) == 0 || !botStore.evmAddress) {
    return true
  }
  if (!form.value.followAddress) {
    return true
  }
  if (form.value.buyType === 2) {
    if (!form.value.buyAmount) {
      return true
    }
  }
  if (form.value.buyType === 3) {
    if (!form.value.buyAmount) {
      return true
    }
    if (!form.value.maxBuyRatio) {
      return true
    }
  }
  return false
})
function validateAddress(index: number) {
  const value = blacklist.value[index].value
  const isValid = isValidAddress(value, form.value.chain)

  const firstIndex = blacklist.value.findIndex((item, i) => item.value === value && i !== index)
  if (firstIndex !== -1) {
    blacklist.value.splice(index, 1)
  }
  if (!isValid) {
    ElMessage.error(t('pleaseEnterCorrectAddress'))
    blacklist.value?.splice(index, 1)
  }
}
const validateAddressRule = (rule: any, value: string, callback: (arg0?: Error) => void) => {
  if (value === '') {
    callback(new Error(t('cannotBeEmpty')))
  } else if (!isValidAddress(value, form.value.chain)) {
    callback(new Error(t('pleaseEnterCorrectAddress')))
  } else {
    callback()
  }
}
const validateRatioRule = (rule: any, value: string, callback: (arg0?: Error) => void) => {
  if (form.value.sellType === 2) {
    if (!form.value.takeProfitRatio) {
      callback(new Error(t('cannotBeEmpty')))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
const validateRatioRule1 = (rule: any, value: string, callback: (arg0?: Error) => void) => {
  if (form.value.sellType === 2) {
    if (!form.value.stopLossRatio) {
      callback(new Error(t('cannotBeEmpty')))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

const validateBuyAmountRule = (rule: any, value: string, callback: (arg0?: Error) => void) => {
  if (form.value.buyType == 1) {
    callback()
  } else {
    if (!form.value.buyAmount) {
      callback(new Error(t('cannotBeEmpty')))
    } else if (form.value?.buyAmount && Number(form.value?.buyAmount || 0) > Number(currentUser.value?.balance || 0)) {
      callback(new Error(t('insufficientBalance')))
    } else {
      callback()
    }
  }
}
const rules = computed(() => {
  return {
    followAddress: [{ validator: validateAddressRule, trigger: 'blur' }],
    takeProfitRatio: [{ validator: validateRatioRule, trigger: 'blur' }],
    stopLossRatio: [{ validator: validateRatioRule1, trigger: 'blur' }],
    buyAmount: [{ validator: validateBuyAmountRule, trigger: 'change' }],
  }
})

const smartChains = computed(() => {
  // 如果是自己的钱包地址且为 bot 钱包那么展示所有的链，链钱包后面再改
  if (botStore.evmAddress) {
    const botChains = botStore.userInfo?.addresses?.filter?.((el) =>
      SupportFullDataChain.includes(el.chain) && el.chain !=='xlayer'
    )
    console.log('botChains', botChains)
    if (botChains && botChains.length > 0) {
      return botChains
    }
  }
  return [
    {
      chain: chain.value,
    },
  ]
})
const currentUser = computed(() => {
  return botStore?.userInfo?.addresses?.find?.((el) => form.value?.chain == el.chain)
})
const tabs = computed(() => {
  return [
    {
      name: t('fixedAmount'),
      id: 2,
      tip: t('fixedAmountTip'),
    },
    {
      name: t('maxCopyTrade'),
      id: 3,
      tip: t('maxCopyTradeTip'),
    },
    {
      name: t('buyRatio'),
      id: 1,
      tip: t('buyRatioTip'),
    },
  ]
})
const sellTypeList = computed(() => {
  return [
    {
      name: t('sellManually'),
      id: 0,
    },
    {
      name: t('sellAutomatically'),
      id: 1,
    },
    {
      name: t('stopLimit'),
      id: 2,
    },
  ]
})
const tokenBlacklist = computed(() => {
  return blacklist?.value?.map?.((i) => i.value) || []
})
watch(() => visible.value, (val) => {
  if (type.value == 2) {
    const copy_setting_default = localStorage.getItem('copy_setting_add')
    if (copy_setting_default && JSON.parse(copy_setting_default)?.[form.value.chain]) {
      settingCopyTrade.value[form.value.chain] = JSON.parse(copy_setting_default)[form.value.chain]
      form.value.slippage = settingCopyTrade.value[form.value.chain]?.slippage || 9
      form.value.isPrivate = settingCopyTrade.value[form.value.chain]?.isPrivate || false
      form.value.priorityFee = settingCopyTrade.value[form.value.chain]?.priorityFee || form.value.chain == 'solana' ? '0.001' : '0.05'
    }
    const advancedForm_default = localStorage.getItem('copy-advancedForm')
    if (advancedForm_default && JSON.parse(advancedForm_default)) {
      advancedForm.value = JSON.parse(advancedForm_default)
    }
    const blacklist_default = localStorage.getItem('copy-blacklist')
    if (blacklist_default && JSON.parse(blacklist_default)) {
      blacklist.value = JSON.parse(blacklist_default)
    } else {
      blacklist.value = []
    }

  }
})
watch(
  () => form.value.chain,
  () => {
    formRef.value?.validateField('followAddress')
  }
)
function reset() {
  resetLoading.value = true
  setTimeout(() => {
    resetLoading.value = false
    if(advancedForm.value.maxBuyValue || advancedForm.value.minBuyValue) {
      advancedForm.value.maxBuyValue = ''
      advancedForm.value.minBuyValue = ''
    }
    if(advancedForm.value.maxMarketCap || advancedForm.value.minMarketCap) {
      advancedForm.value.maxMarketCap = ''
      advancedForm.value.minMarketCap = ''
    }
    if(advancedForm.value.enableAt || advancedForm.value.disableAt) {
      advancedForm.value.enableAt = 0
      advancedForm.value.disableAt = 0
      clockTime_Ref.value?.reset()
    }
    if(advancedForm.value.maxTokenAge || advancedForm.value.minTokenAge) {
      advancedForm.value.maxTokenAge = 0
      advancedForm.value.minTokenAge = 0
      dateTime_Ref.value?.reset()
    }
    if(blacklist.value?.length > 0) {
      blacklist.value = []
    }

    localStorage.removeItem('copy-blacklist')
    localStorage.setItem('copy-advancedForm', JSON.stringify({ ...advancedForm.value }))

  }, 500)
}

const onValidateInput = (val: string, type: string) => {
  // 1️⃣ 只允许数字和 .
  let value = val.replace(/[^\d.]/g, '')
  // 2️⃣ 只允许一个小数点
  const parts = value.split('.')
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('')
  }
  // 3️⃣ 小数点不能放在第一位（可选）
  if (value.startsWith('.')) {
    value = '0' + value
  }
  if (type === 'buyAmount') {
    if ( Number(value) > Number(currentUser?.value?.balance || '0')) {
      value = formatNumber(currentUser?.value?.balance || 0, 5)
    }
  }
  form.value[type] = value
}
function handleInput(props: (keyof FormType)[], val: string, index: number) {
  const key = props[index]
  if (!key) return
  advancedForm.value[key] = val.replace(/-|[^\d.]/g, '')
}
function handleBlur(props: (keyof FormType)[], val: string, index: number) {
  const key = props[index] || ''
  if (advancedForm.value[key]) {
    if (index == 1) {
      if (!advancedForm.value[props[0]]) return
      if (
        Number.parseFloat(advancedForm.value[key]) <=
        Number.parseFloat(advancedForm.value[props[0]])
      ) {
        advancedForm.value[key] = advancedForm.value[props[0]]
      }
    } else {
      if (!advancedForm.value[props[1]]) return
      if (
        Number.parseFloat(advancedForm.value[key]) >=
        Number.parseFloat(advancedForm.value[props[1]])
      ) {
        // if (this.form[key] >= this.form[props[1]]) {
        advancedForm.value[key] = advancedForm.value[props[1]]
      }
    }
  }
}

function createFollowOrder() {
  const filtered = Object.fromEntries(
    Object.entries(advancedForm.value).filter(
      ([key, v]) =>  v && v !== ''
    )
  )
  const priorityFee = form.value.priorityFee !== null ?form.value.priorityFee : form.value?.chain == 'solana' ? '0.001' : '0.05'
  let data = {
    ...filtered,
    tgUid: botStore?.userInfo?.tgUid || '',
    chain: form.value.chain,
    creatorAddress: currentUser.value?.address || '',
    followAddress: form.value.followAddress,
    buyType: form.value.buyType,
    buyAmount: new BigNumber(form.value.buyAmount || 0).multipliedBy(10 ** currentUser.value?.decimals!),
    maxBuyRatio: Number(form.value.maxBuyRatio) * 100,
    sellType: form.value.sellType,
    takeProfitRatio: Number(form.value.takeProfitRatio) * 100,
    stopLossRatio: Number(form.value.stopLossRatio) * 100,
    ignoreHeld: form.value.ignoreHeld,

    slippage: (form.value.slippage || 9) * 100, //滑点
    isPrivate: form.value.isPrivate, //防夹
    priorityFee: new BigNumber(priorityFee || 0).multipliedBy(10 ** 9!),
    tokenBlacklist: tokenBlacklist?.value?.filter(Boolean),
  }
  // ...(form.value?.id ? { id: form.value.id } : {}),
  formRef.value?.validate((valid) => {
    if (valid) {
      loading.value = true
      _createFollowOrder(data)
        .then((res) => {
          if (form.value.id) {
            ElMessage.success('修改跟单成功')
          } else {
            ElMessage.success('创建跟单成功')
            activeCopyAddress.value[data.chain].push(data.followAddress)
            if (type.value == 2) {
              localStorage.setItem('copy_setting_add', JSON.stringify({ ...settingCopyTrade.value }))
              localStorage.setItem('copy-advancedForm', JSON.stringify({ ...advancedForm.value }))
              localStorage.setItem('copy-blacklist', JSON.stringify({ ...blacklist.value }))
            }
          }
          visible.value = false
          getFollowingInfo()
        })
        .catch((err) => {
          console.log('创建跟单错误', err?.response?._data || err.message || err)
          ElMessage.error(err?.response?._data || err.message || err)
        })
        .finally(() => {
          loading.value = false
          console.log('创建跟单结束')
        })
    }
  })
}
function addItem() {
  blacklist.value.push({ id: blacklist.value?.length + 1, value: '' })
}
function removeRow(index: number) {
  blacklist.value.splice(index, 1)
}
function toUtcHour(time: string) {
  const [h, m] = time.split(':').map(Number)
  const local = new Date()
  local.setHours(h, m, 0, 0)
  return local.getUTCHours() // 0–23
}
const onClockTimeChange = ([start, end]: string[]) => {
  if (start) {
    advancedForm.value.enableAt = toUtcHour(start)
  } else {
    advancedForm.value.enableAt = 0
  }
  if (end) {
    advancedForm.value.disableAt = toUtcHour(end)
  } else {
    advancedForm.value.disableAt = 0
  }
}
const onDateTimeChange = ({ startTime, endTime }: { startTime: number, endTime: number}) => {
  if (startTime) {
    advancedForm.value.minTokenAge = startTime
  } else {
    advancedForm.value.minTokenAge = 0
  }
  if (endTime) {
    advancedForm.value.maxTokenAge = endTime
  }else {
    advancedForm.value.maxTokenAge = 0
  }
}
function apply(type: 'low' | 'high') {
  isExpanded.value = true
  if (type == 'low') {
    form.value.buyType = lowStrategy.value.buyType
    form.value.buyAmount = lowStrategy.value.buyAmount
    form.value.sellType = lowStrategy.value.sellType
    form.value.takeProfitRatio = lowStrategy.value.takeProfitRatio
    form.value.stopLossRatio = lowStrategy.value.stopLossRatio

    advancedForm.value.minBuyValue = lowStrategy.value.minBuyValue
    advancedForm.value.minMarketCap = lowStrategy.value.minMarketCap

    advancedForm.value.minTokenAge = lowStrategy.value.minTokenAge
    advancedForm.value.maxTokenAge = lowStrategy.value.maxTokenAge
  } else {
    form.value.buyType = highStrategy.value.buyType
    form.value.buyAmount = highStrategy.value.buyAmount
    form.value.sellType = highStrategy.value.sellType
    form.value.takeProfitRatio = highStrategy.value.takeProfitRatio
    form.value.stopLossRatio = highStrategy.value.stopLossRatio

    advancedForm.value.minBuyValue = highStrategy.value.minBuyValue
    advancedForm.value.minMarketCap = highStrategy.value.minMarketCap

    advancedForm.value.minTokenAge = highStrategy.value.minTokenAge
    advancedForm.value.maxTokenAge = highStrategy.value.maxTokenAge
  }
}
</script>
<style lang="scss" scoped>
:deep().el-input__wrapper {
  background: var(--border);
  padding: 0 12px;
  -el-input-inner-height: 48px;
  --el-input-inner-height: 48px;
}
:deep().el-select__wrapper {
  background: var(--border);
  min-height: 48px;
}
:deep() .small .el-select__wrapper {
  background: var(--border);
  min-height: 40px;
  min-width: 32px;
  padding: 4px 0px;

  &.is-focused{
    box-shadow: none;
  }

}
:deep() .input-number-date.el-input-number.is-without-controls .el-input__wrapper {
  padding-left: 10px;
  padding-right: 10px;
}
:deep() .el-time-panel__content::before{
  margin-left: 0;
  margin-right: 0;
}
.tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--border);
  padding: 4px;
  border-radius: 4px;
  font-size: 12px;
  height: 40px;
  width: 100%;

  button {
    border: none;
    font-size: 14px;
    color: var(--third-text);
    letter-spacing: 0;
    font-weight: 400;
    cursor: pointer;
    border-radius: 4px;
    border: 1ox solid var(--border);
    background: transparent;
    min-width: 36px;
    padding: 6px 6px;
    text-align: center;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    &.active {
      color: var(--main-text);
      background: var(--dialog-tab-active-bg);
    }
  }
}
.reset {
  font-size: 12px;
  background: transparent;
  border: none;
  box-shadow: none;
  color: var(--secondary-text);
  padding: 0;
}

</style>
