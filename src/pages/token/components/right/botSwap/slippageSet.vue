<template>
  <div class="flex">
    <span class="clickable flex" @click.stop="show = true">
      <slot name="icon">
        <Icon class="text-14px color-[--d-8CA0C3-l-566275] hover:color-[--d-F5F5F5-l-333] icon-bot-setting" name="custom:pump-setting" />
      </slot>
    </span>
    <el-dialog class="new-dialog" v-model="show" width="500px" append-to-body>
      <template #header>
        <div class="text-20px mb-10px font-400">
          <button class="border-none bg-transparent clickable color-[--d-566275-l-8CA0C3] px-0" :class="{'color-[--d-F5F5F5-l-333]!': settingTab === 0}" @click.stop="settingTab = 0">{{ $t('basicSetting') }}</button>
          <button class="border-none bg-transparent clickable color-[--d-566275-l-8CA0C3] px-0 ml-24px" :class="{'color-[--d-F5F5F5-l-333]!': settingTab === 1}" @click.stop="settingTab = 1">{{ $t('autoSellSetting') }}</button>
        </div>
      </template>
      <el-form class="popup-content" @submit.prevent="confirmSubmit">
        <div v-show="settingTab === 0">
          <div v-if="showClipboardSet" class="mb-20px pb-20px b-b-solid b-b-[--d-252E3C-l-E8F1FF] b-b-1">
            <div class="flex items-center mb-15px">
              <Icon v-if="themeStore.isDark" name="custom:flash-d" class="text-14px" />
              <Icon v-else name="custom:flash-l" class="text-14px" />
              <span class="ml-5px mr-auto">{{ $t('quickBuyclipboard') }}</span>
              <div class="flex items-center justify-end text-12px color-[--d-566275-l-8CA0C3] clickable" @click.stop="clipboardQuickInput[chain] = ''">
                <Icon
                  name="custom:refresh-left"
                  class="ml-5px clickable text-14px mr-3px"
                />
                <span>{{ $t('reset') }}</span>
              </div>
            </div>
            <div class="flex items-center">
              <img v-if="chain" class="w-16px h-16x mr-5px rd-50%" :src="`${configStore.token_logo_url}chain/${chain}.png`" alt="" srcset="">
              <span class="mr-auto font-500">{{  getChainInfo(chain)?.name || ''  }}</span>
              <el-input v-model="clipboardQuickInput[chain]" class="input-swap input-number flex-auto! max-w-150px clipped-input rd-8px!" inputmode="decimal" clearable placeholder="0.0" @update:model-value="value => {clipboardQuickInput[chain] = value?.replace?.(/\-|[^\d.]/g, '')}" @blur="handleBlurBuyValue1(clipboardQuickInput[chain] || '')">
                <template #append><span class="color-[--d-566275-l-8CA0C3]">{{ getChainInfo(chain)?.main_name }}</span></template>
              </el-input>
            </div>
          </div>
          <div class="setting-list mb-10px rounded-4px">
            <button v-for="item in BotSettingsArr" :key="item.value" :class="{'active': item.value === botSetting.selected}" type="button" @click.stop="botSetting.selected = item.value">{{ item.label }}</button>
          </div>
          <div class="color-[--d-566275-l-8CA0C3]">
            {{$t('setTips')}}
          </div>
          <div class="flex items-center justify-between color-[--d-8CA0C3-l-566275]">
            <span>{{ $t('slippage') }}</span>
            <Icon class="text-15px color-#80838B ml-5px clickable mr-auto" name="material-symbols:help-rounded" @click.stop="openSlippageTips" />
            <el-checkbox v-if="canSetAuto" v-model="isAuto" :label="$t('autoSlippage')" size="large" style="--el-checkbox-text-color: var(--d-566275-l-8CA0C3)" />
          </div>
          <div class="mt-10px">
            <el-row :gutter="10">
              <el-col v-for="(item, index) in slippageList" :key="index" :span="6" class="radio-group">
                <!-- <span v-if="index !== 0" style="flex: 1"></span> -->
                <input
                  :id="`radio-${item}-${key}`"
                  v-model="botSetting[selected].slippageValue"
                  type="radio"
                  :value="item"
                  :disabled="isAuto"
                  class="radio-input"
                  @change.stop="changeSlippage"
                >
                <label :for="`radio-${item}-${key}`" class="radio-item" style="border-radius: 4px">{{ item }}%</label>
              </el-col>
              <el-col :span="6">
                <div class="slippage-input">
                  <el-input-number
                    v-model="botSetting[selected].customSlippage"
                    class="bg-[--d-252E3C-l-E8F1FF] rounded-4px"
                    name="slippage"
                    type="number"
                    :placeholder="$t('custom')"
                    :min="0"
                    :max="100"
                    :step="0.01"
                    :disabled="isAuto"
                    controls-position="right"
                    :controls="false"
                    clearable
                    :rules="[
                      { required: true, message: $t('enterSlippage') },
                      { validator: (val: string) => Number(val) <= 100, message: $t('slippageMaxTip') }
                    ]"
                    @change="val => handleCustomSlippage(val)"
                  />
                  <span class="color-fff">%</span>
                </div>
              </el-col>
            </el-row>
            <span v-if="botSetting[selected].slippageValue !== undefined && Number(botSetting[selected].slippageValue) <= 0.1" class="tip">{{ $t('slippageTip1') }}</span>
          </div>
          <div v-if="isCanMev" class="slippage-label mt-15px">
            <span class="mr-auto color-[--d-8CA0C3-l-566275]">{{ $t('protection') }}</span>
            <el-switch
              v-model="botSetting[selected].mev"
              size="small"
              :before-change="solanaMevBeforeChange"
              class="ml-2px"
              style="--el-switch-on-color: #3c6cf6;"
              @change="onProtectionChange"
            />
          </div>
          <div class="slippage-label mt-15px color-[--d-8CA0C3-l-566275]">
            <span>{{ chain === 'solana' ? $t('priorityFee') : $t('extraGas') }}</span>
          </div>
          <div :key="botSetting[selected].mev" class="mt-10px">
            <el-row :gutter="10">
              <el-col v-for="(item, index) in priorityList" :key="index" :span="8" class="radio-group">
                <!-- <span v-if="index !== 0" style="flex: 1"></span> -->
                <input
                  :id="`radio-fee-${index}`"
                  v-model="botSetting[selected].gas[botSetting[selected].mev ? 0 : 1].level"
                  type="radio"
                  :value="index"
                  class="radio-input"
                  @change.stop="changePriorityFee"
                >
                <label :for="`radio-fee-${index}`" class="radio-item" style="min-height: 60px;" :class="{'no-checked': botSetting?.[selected]?.gas?.[botSetting?.[selected].mev ? 0 : 1]?.customFee}" @click.stop="changePriorityFee">
                  <div class="text-12px">{{ priorityText[index] }}</div>
                  <span class="mt-10px text-14px" style="color: var(--a-text-1-color)">{{ item }} {{ chain === 'solana' ? 'SOL' : 'GWEI' }}</span>
                </label>
              </el-col>
            </el-row>
          </div>
          <div class="input-swap mt-10px">
            <el-input v-model="botSetting[selected].gas[botSetting[selected].mev ? 0 : 1].customFee" class="input-number" inputmode="decimal" clearable :placeholder="chain === 'solana' ? $t('customFee1') : $t('customEvmFee1')" @update:model-value="watchCusTomPriorityFee"  @blur="handleBlurFee" >
              <template #append><span class="color-[--d-566275-l-8CA0C3]">{{ chain === 'solana' ? 'SOL' : 'GWEI' }}</span></template>
            </el-input>
          </div>
          <div v-if="showQuickAmount" class="mt-20px">
            <div class="mb-10px" style="color: #12B886;">{{ $t('setOneClickBuyAmount') }}({{ getChainInfo(chain)?.main_name }})</div>
            <el-row :gutter="10">
              <el-col v-for="(item, index) in botSetting[selected].buyValueList" :key="index" :span="6" class="click-setting">
                <el-input v-model="botSetting[selected].buyValueList[index]" class="input-number" inputmode="decimal" placeholder="0.0" @input="value => handleBuyValue(value, index)" @blur="handleBlurBuyValue(index)"/>
              </el-col>
            </el-row>
          </div>
          <div v-if="showQuickAmount" class="mt-20px">
            <div class="mb-10px" style="color: #F6465D;">{{ $t('setOneClickSellAmount') }}</div>
            <el-row :gutter="10">
              <el-col v-for="(item, index) in botSetting[selected].sellPerList" :key="index" :span="6" class="click-setting">
                <el-input v-model="botSetting[selected].sellPerList[index]"  class="input-number" inputmode="decimal" placeholder="0" @input="value => handlePer(value, index)">
                  <template #suffix>
                    <span class="color-text-1">%</span>
                  </template>
                </el-input>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-show="settingTab === 1">
          <div class="flex items-center bg-#FFBE3C1A p-10px rd-4px text-12px mb-20px">
            <Icon class="color-#FFBE3C text-14px" name="mdi:alert-circle" />
            <span class="ml-4px">
              {{ $t('autoSellTips') }}
            </span>
          </div>
          <div class="slippage-label">
            <span class="mr-5px">{{ $t('autoSellHalf') }}</span>
            <Icon v-tooltip="$t('autoSellHalfTips')" class="text-15px color-[--d-666-l-CCC] clickable mr-auto" name="material-symbols:help-rounded" />
            <el-switch
              v-model="autoSellConfigs.autoSell"
              size="small"
              class="ml-2px"
              style="--el-switch-on-color: #3c6cf6;"
            />
          </div>
          <div class="slippage-label mt-15px">
            <span class="mr-5px">{{ $t('DEVSEll') }}</span>
            <Icon v-tooltip="$t('devSellTips')" class="text-15px color-[--d-666-l-CCC] clickable mr-auto" name="material-symbols:help-rounded" />
            <el-switch
              v-model="autoSellConfigs.isAutoSellConfig_devsell"
              size="small"
              class="ml-2px"
              style="--el-switch-on-color: #3c6cf6;"
            />
          </div>
          <div v-show="autoSellConfigs.isAutoSellConfig_devsell" class="flex items-center gap-20px mt-5px">
            <el-select v-model="autoSellConfigs.autoSellConfig_devsell!.priceChange" placeholder="--" class="input-number-limit" size="default">
              <template #prefix>
                <div class="inline-flex items-center text-12px color-[--d-566275-l-8CA0C3]"><span>{{ $t('DEVSEll') }}</span><span class="text-18px mt--3px">≥</span></div>
              </template>
              <el-option
                v-for="item in [0, 25, 50]"
                :key="item"
                :label="item + '%'"
                :value="item"
              />
            </el-select>
            <el-input-number v-model="autoSellConfigs.autoSellConfig_devsell!.sellRatio" class="input-number-limit" :min="1" :max="100" :controls="false" placeholder="--">
              <template #prefix>
                <span class="text-12px color-[--d-566275-l-8CA0C3]">{{ $t('sellRatio') }}</span>
              </template>
              <template #suffix>
                <span class="color-[--d-566275-l-8CA0C3]">%</span>
              </template>
            </el-input-number>
          </div>
          <div class="slippage-label mt-15px">
            <span class="mr-5px">{{ $t('trailingStop') }}</span>
            <Icon v-tooltip="$t('trailingStopTips')" class="text-15px color-[--d-666-l-CCC] clickable mr-auto" name="material-symbols:help-rounded" />
            <el-switch
              v-model="autoSellConfigs.isAutoSellConfig_trailing"
              size="small"
              class="ml-2px"
              style="--el-switch-on-color: #3c6cf6;"
            />
          </div>
          <div v-show="autoSellConfigs.isAutoSellConfig_trailing" class="flex items-center gap-20px mt-5px">
            <el-input-number v-model="autoSellConfigs.autoSellConfig_trailing!.priceChange" class="input-number-limit" :min="1" :controls="false" placeholder="--">
              <template #prefix>
                <span class="text-12px color-[--d-566275-l-8CA0C3]">{{ $t('pullback') }}</span>
              </template>
              <template #suffix>
                <span class="color-[--d-566275-l-8CA0C3]">%</span>
              </template>
            </el-input-number>
            <el-input-number v-model="autoSellConfigs.autoSellConfig_trailing!.sellRatio" class="input-number-limit" :min="1" :max="100" :controls="false" placeholder="--">
              <template #prefix>
                <span class="text-12px color-[--d-566275-l-8CA0C3]">{{ $t('sellRatio') }}</span>
              </template>
              <template #suffix>
                <span class="color-[--d-566275-l-8CA0C3]">%</span>
              </template>
            </el-input-number>
          </div>
          <div class="slippage-label mt-15px">
            <span class="mr-5px">{{ $t('listingOnDex') }}</span>
            <Icon v-tooltip="$t('listingOnDexTips')" class="text-15px color-[--d-666-l-CCC] clickable mr-auto" name="material-symbols:help-rounded" />
            <el-switch
              v-model="autoSellConfigs.isAutoSellConfig_migrated"
              size="small"
              class="ml-2px"
              style="--el-switch-on-color: #3c6cf6;"
            />
          </div>
          <div v-show="autoSellConfigs.isAutoSellConfig_migrated" class="flex items-center gap-20px mt-5px">
            <el-input-number v-model="autoSellConfigs.autoSellConfig_migrated!.sellRatio" class="input-number-limit" :min="1" :max="100" :controls="false" placeholder="--">
              <template #prefix>
                <span class="text-12px color-[--d-566275-l-8CA0C3]">{{ $t('sellRatio') }}</span>
              </template>
              <template #suffix>
                <span class="color-[--d-566275-l-8CA0C3]">%</span>
              </template>
            </el-input-number>
          </div>
          <div class="slippage-label mt-15px">
            <span class="mr-5px">{{ $t('takeProfitAndStopLoss') }}</span>
            <Icon v-tooltip="$t('takeProfitAndStopLossTips')" class="text-15px color-[--d-666-l-CCC] clickable mr-auto" name="material-symbols:help-rounded" />
            <el-switch
              v-model="autoSellConfigs.isAutoSellConfig"
              size="small"
              class="ml-2px"
              style="--el-switch-on-color: #3c6cf6;"
            />
          </div>
          <ul v-show="autoSellConfigs.isAutoSellConfig">
            <li v-for="(item, index) in autoSellConfigs.autoSellConfig" :key="index" class="mt-10px flex items-center gap-4px">
              <span v-if="item.isUp" class="color-#12B886 text-14px mr-10px">{{ $t('takeProfit') }}</span>
              <span v-else class="color-#F6465D text-14px mr-10px">{{ $t('stopLoss') }}</span>
              <el-input-number v-model="item.priceChange" class="input-number-limit" :min="1" :controls="false" placeholder="--">
                <template #prefix>
                  <div class="flex items-center">
                    <Icon v-if="item.isUp" name="ri:arrow-up-long-fill" class="color-#12B886" />
                    <Icon v-else name="ri:arrow-down-long-fill" class="color-#F6465D" />
                    <span class="text-12px color-[--d-566275-l-8CA0C3]">{{ item.isUp ? $t('rise') : $t('fall') }}</span>
                  </div>
                </template>
                <template #suffix>
                  <span class="color-[--d-566275-l-8CA0C3]">%</span>
                </template>
              </el-input-number>
              <el-input-number v-model="item.sellRatio" class="input-number-limit" :min="1" :max="100" :controls="false" placeholder="--">
                <template #prefix>
                  <span class="text-12px color-[--d-566275-l-8CA0C3]">{{ $t('sell') }}</span>
                </template>
                <template #suffix>
                  <span class="color-[--d-566275-l-8CA0C3]">%</span>
                </template>
              </el-input-number>
              <Icon class="text-16px ml-5px clickable color-[--d-566275-l-8CA0C3]" name="bx:bxs-trash-alt" @click.stop="autoSellConfigs.autoSellConfig.splice(index, 1)" />
            </li>
            <li class="flex gap-8px items-center text-14px mt-20px">
              <button class="flex-1 h-44px flex items-center justify-center clickable bg-#12B8861A color-#12B886 border-none rd-8px disabled:op-50 disabled:cursor-not-allowed" type="button" :disabled="autoSellConfigs.autoSellConfig?.length >= 5" @click.stop="addStopProfit">
                <Icon class="text-16px" name="material-symbols:add-circle-outline-rounded" />
                <span class="ml-5px">{{ $t('addTakeProfit') }}</span>
              </button>
              <button class="flex-1 h-44px flex items-center justify-center clickable bg-#F6465D1A color-#F6465D border-none rd-8px disabled:op-50 disabled:cursor-not-allowed" type="button" :disabled="autoSellConfigs.autoSellConfig?.length >= 5" @click.stop="addStopLoss">
                <Icon class="text-16px" name="material-symbols:add-circle-outline-rounded" />
                <span class="ml-5px">{{ $t('addStopLoss') }}</span>
              </button>
            </li>
          </ul>
        </div>

        <div class="form-submit">
          <el-button
            class="w-full"
            block
            size="large"
            type="primary"
            native-type="submit"
            :disabled="botSetting[selected].slippageValue == 0"
          >
            {{ $t('save') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import BigNumber from 'bignumber.js'
import { formatBotGasTips } from '@/utils/bot'
import { cloneDeep } from 'lodash-es'
import { ElMessageBox } from 'element-plus'
import type { BotChain, BotSettingKey } from '~/utils/types'

const props = defineProps({
  canSetAuto: { type: Boolean, default: true },
  chain: { type: String as PropType<BotChain>, default: '' },
  setting: { type: Object, default: () => ({}) },
  isAutoSell: { type: Boolean, default: true },
  showQuickAmount: { type: Boolean, default: true },
  showClipboardSet: { type: Boolean, default: false }
})

const emit = defineEmits(['update:slippage', 'onSubmit'])

const { t } = useI18n()
const botSwapStore = useBotSwapStore()
const themeStore = useThemeStore()
const configStore = useConfigStore()

const slippageList = [5, 9, 20]
// 获取 uuid
const key = Math.random().toString(36).slice(-8)
const show = ref(false)
const isAuto = ref(false)
const botSettingStore = useBotSettingStore()

const botSetting = ref(cloneDeep(props.setting ?? {}))

const { autoSellConfigs, loadAutoSellConfigs, saveAutoSellConfigs } = useAutoSellConfig()

const selected = computed(() => botSetting.value.selected)

const settingTab = ref(0)
const clipboardQuickInput = ref(cloneDeep(botSettingStore.clipboardQuickInput))

// const slippageValue = ref<number | undefined>()
// const customSlippage = ref<number | undefined>()

watch(show, (val) => {
  if (val) {
    const selected = botSetting.value.selected
    botSetting.value = cloneDeep(props.setting ?? {})
    const s = botSetting.value[selected]?.slippage ?? 9
    isAuto.value = s === 'auto'
    botSetting.value[selected].slippageValue = s === 'auto' ? undefined : Number(s)
    botSetting.value[selected].customSlippage = s === 'auto' || slippageList.includes(Number(s)) ? undefined : Number(s)
    loadAutoSellConfigs()
    clipboardQuickInput.value = cloneDeep(botSettingStore.clipboardQuickInput)
  }
})

watch(() => botSetting.value.selected, (val) => {
  if (show.value) {
    if (!botSetting.value[val].slippageValue && !botSetting.value[val].customSlippage) {
      const s = botSetting.value[val]?.slippage ?? 9
      isAuto.value = s === 'auto'
      botSetting.value[val].slippageValue = s === 'auto' ? undefined : Number(s)
      botSetting.value[val].customSlippage = s === 'auto' || slippageList.includes(Number(s)) ? undefined : Number(s)
    }
  }
})

watch(isAuto, (val) => {
  if (val) {
    const selected = botSetting.value.selected
    botSetting.value[selected].slippageValue = undefined
  } else {
    const selected = botSetting.value.selected
    const s = botSetting.value[selected]?.slippage ?? 9
    console.log(s)
    botSetting.value[selected].slippageValue = s === 'auto' ? undefined : Number(s)
    botSetting.value[selected].customSlippage = s === 'auto' || slippageList.includes(Number(s)) ? undefined : Number(s)
  }
})


const priorityText = computed(() => [`🐢 ${t('slow')}`, `🚗 ${t('normal')}`, `🚄 ${t('fast')}`])

const priorityList = computed(() => {
  const selected = botSetting.value.selected
  const { gasTip1List, gasTip2List } = formatBotGasTips(botSwapStore?.gasTip, props.chain)
  return botSetting.value[selected]?.mev ? gasTip1List : gasTip2List
})

const isCanMev = computed(() => {
  const { gasTip1List } = formatBotGasTips(botSwapStore?.gasTip, props.chain)
  return gasTip1List?.length > 1
})

// other methods
function changeSlippage() {
  if (!show.value) return
  const selected = botSetting.value.selected
  botSetting.value[selected].customSlippage = undefined
}

function handleCustomSlippage(val: number | undefined) {
  if (val) {
    const selected = botSetting.value.selected
    botSetting.value[selected].slippageValue = botSetting.value[selected].customSlippage
  }
}


function confirmSubmit() {
  const setting = cloneDeep(botSetting.value as typeof botSettingStore.botSettings['eth'])
  const selected = botSetting.value.selected as BotSettingKey
  const slippageValue = botSetting.value[selected].slippageValue

  if (setting?.[selected]) {
    if (slippageValue === undefined) {
      setting[selected].slippage = 'auto'
    } else {
      setting[selected].slippage = String(slippageValue)
    };
    ['s1', 's2', 's3'].forEach((s) => {
      Reflect.deleteProperty(setting[s as BotSettingKey], 'slippageValue')
      Reflect.deleteProperty(setting[s as BotSettingKey], 'customSlippage')
    })
  }

  if (setting?.selected) {
    if (props.chain === 'solana') {
      botSettingStore.botSettings = {
        ...botSettingStore.botSettings,
        solana: {...setting}
      }
    } else {
      botSettingStore.botSettings = {
        ...botSettingStore.botSettings,
        [props.chain]: {...setting}
      }
    }
  }
  botSettingStore.clipboardQuickInput = cloneDeep(clipboardQuickInput.value)
  emit('onSubmit', setting)
  saveAutoSellConfigs()
  show.value = false
}

function changePriorityFee() {
  // 如果切换等级，同时取消自定义费
  const selected = botSetting.value.selected
  const gas = botSetting.value[selected]?.gas?.[botSetting.value[selected].mev ? 0 : 1]
  if (gas) gas.customFee = ''
}

function watchCusTomPriorityFee(val: string) {
  const selected = botSetting.value.selected
  const gas = botSetting.value[selected]?.gas?.[botSetting.value[selected].mev ? 0 : 1]
  if (gas) gas.customFee = val
}

function handleBlurFee() {
  const selected = botSetting.value.selected
  const gas = botSetting.value[selected]?.gas?.[botSetting.value[selected].mev ? 0 : 1]
  if (gas && new BigNumber(gas.customFee).lt(0)) {
    gas.customFee = ''
  }
}

function handleBuyValue(value: string, index: number) {
  const v = value.replace(/-|[^\d.]/g, '')
  const selected = botSetting.value.selected
  botSetting.value[selected].buyValueList[index] = v
}

function handleBlurBuyValue(index: number) {
  // 限制合法性，可添加逻辑
  const decimals = 4
  const selected = botSetting.value.selected
  const v = botSetting.value[selected].buyValueList[index]
  const v1 = (new BigNumber(v || 0)).toFixed()?.match?.(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals || 18}})?`))?.[0]
  if (String(v) !== String(v1)) {
    if (Number(v1) === 0) {
      botSetting.value[selected].buyValueList[index] = '0'
    } else {
      botSetting.value[selected].buyValueList[index] = v1
    }
  }
}

function handleBlurBuyValue1(value: string) {
  const decimals = 4
  const v = value
  const v1 = new BigNumber(v || 0)?.toFixed?.().match(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals || 18}})?`))?.[0] || ''
  if (String(v) !== String(v1)) {
    if (v === '') {
      clipboardQuickInput.value[props.chain] = ''
    } else if (Number(v1) === 0) {
      clipboardQuickInput.value[props.chain] = '0'
    } else {
      clipboardQuickInput.value[props.chain] = v1
    }
  }
}

function handlePer(value: string, index: number) {
  let v = value.replace(/-|[^\d.]/g, '')
  if (Number(v) > 100) {
    v = '100'
  } else if (Number(v) < 0) {
    v = '0'
  }
  const selected = botSetting.value.selected
  botSetting.value[selected].sellPerList[index] = v
}


function openSlippageTips() {
  // 提示逻辑，可扩展
  ElMessageBox
  .alert(t('slippageTips'), {
    title: t('slippage'),
    confirmButtonText: t('iKnown'),
  })
  .then(() => {
    // on close
  })
}

function solanaMevBeforeChange() {
  return true // 可做权限判断
}

function onProtectionChange() {
  nextTick(() => changePriorityFee())
}

function addStopProfit() {
  autoSellConfigs.value.autoSellConfig.push({
    open: true,
    priceChange: undefined,
    sellRatio: undefined,
    type: 'default',
    isUp: true
  })
}

function addStopLoss() {
  autoSellConfigs.value.autoSellConfig.push({
    open: true,
    priceChange: undefined,
    sellRatio: undefined,
    type: 'default',
    isUp: false
  })
}
</script>

<style lang="scss" scoped>
.popup-content {
  --van-cell-background-color: #eaecef;
}
.radio-group {
  display: flex;
  align-items: center;
  .radio-input {
    width: 0;
    height: 0;
    font-size: 0;
    opacity: 0;
    &:checked + .radio-item:not(.no-checked) {
      // background: var(--custom-primary-color);
      border: 1px solid var(--primary-color);
      color: var(--d-F5F5F5-l-333);
      background: rgba($color: #3F80F7, $alpha: 0.08);
    }
    &:disabled + .radio-item {
      opacity: 0.5;
    }
  }
  .radio-item {
    border: 1px solid var(--d-252E3C-l-E8F1FF);
    background: var(--d-252E3C-l-E8F1FF);
    border-radius: 8px;
    min-width: 86px;
    font-size: 14px;
    color: var(--d-566275-l-8CA0C3);
    letter-spacing: 0;
    font-weight: 400;
    text-align: center;
    min-height: 32px;
    line-height: 1;
    cursor: pointer;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 8px 0;
  }
}
.slippage-label {
  font-size: 14px;
  color: var(--d-8CA0C3-l-566275);
  letter-spacing: 0;
  text-align: center;
  font-weight: 400;
  text-align: left;
  display: flex;
  align-items: center;
  line-height: 1;
  .iconfont {
    &:active {
      opacity: 0.5;
    }
  }
}
.slippage-input {
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 16px;
  color: var(--custom-text-1-color);
  font-weight: 400;
  .is-disabled  {
    opacity: 0.5;
  }
  &:deep() .el-input__wrapper, &:deep() .el-input__inner {
    background-color: var(--d-252E3C-l-E8F1FF);
  }
  &:deep() .el-input-number__decrease, &:deep() .el-input-number__increase {
    background-color: var(--d-252E3C-l-E8F1FF);
  }
  .input {
    font-size: 14px;
    background: #ffffff;
    border: 1px solid #dcdee0;
    border-radius: 8px;
    height: 36px;
    padding: 0 14px;
    flex: 1;
    &:focus-within {
      border-color: #558bed;
    }
    :deep() .van-field__body {
      height: 100%;
    }
  }
  span {
    margin-left: 5px;
  }
}
.form-submit {
  margin-top: 20px;
  text-align: center;
}

.input-swap {
  display: flex;
  align-items: center;
  background: var(--d-252E3C-l-E8F1FF);
  border-radius: 4px;
  height: 32px;
  --el-fill-color-light: var(--d-252E3C-l-E8F1FF);
}
.input-number {
  flex: 1;
  background: var(--d-252E3C-l-E8F1FF);
  --el-input-bg-color: var(--d-252E3C-l-E8F1FF);
  --el-input-border-color: var(--d-252E3C-l-E8F1FF);
  border-radius: 4px;
}
.slippage-input {
  --el-input-border-color: transparent;
  --el-border-color: transparent;
  :deep() .el-input__wrapper {
    color: var(--a-text-1-color);
  }
}
.click-setting {
  :deep() .el-input__inner {
    text-align: center;
  }
}
.setting-list {
  display: flex;
  justify-content: space-between;
  background: var(--d-252E3C-l-E8F1FF);
  // color: var(--d-566275-l-8CA0C3);
  padding: 2px;
  button {
    color: var(--d-566275-l-8CA0C3);
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;
    border: none;
    cursor: pointer;
    flex: 1;
    border-radius: 4px;
    height: 28px;
    font-size: 14px;
    background: transparent;
    &.active {
      background: var(--d-111-l-FFF);
      color: var(--d-F5F5F5-l-333);
    }
  }
}
.input-number-limit {
  width: auto;
  flex: 1;
  :deep(.el-input) {
    height: 36px;
    --el-input-bg-color: var(--d-252E3C-l-E8F1FF);
    --el-input-border-color: transparent;
    --el-input-hover-border-color: transparent;
    --el-input-focus-border-color: transparent;
    .el-input__inner {
      text-align: right;
    }
  }
  :deep(.el-select__wrapper) {
    height: 36px;
    font-size: 14px;
    .el-select__selected-item {
      text-align: right;
    }
  }
}
.clipped-input {
  :deep(.el-input-group__append) {
    padding: 0 8px;
  }
}
:deep(.el-input__inner::placeholder) {
  color: var(--d-566275-l-8CA0C3);
}
:deep(.el-checkbox__inner){
  border-color: var(--d-252E3C-l-E8F1FF);
}
</style>
