<script setup lang="ts">
import BigNumber from 'bignumber.js'
import { cloneDeep } from 'lodash-es'
import AudioSettingsItem from './audioSettingsItem.vue'
import { useI18n } from 'vue-i18n'
import { h } from 'vue'
import { getPumpBgColor} from '@/utils/index'
import {formatBotGasTips} from '@/utils/bot'
import {isEvmChain, getRpcProvider} from '@/utils'
import type { MonitorChainType, BotSettingKey } from '~/utils/types'
import QuickBuyInput from '~/components/monitor/components/quickBuyInput.vue'

const { t } = useI18n()
const globalStore = useGlobalStore()
const pumpStore = usePumpStore()
const configStore = useConfigStore()

// <notice2.0>
const { mode, isDark } = storeToRefs(useGlobalStore())
const tokenStore = useTokenStore()
const botStore = useBotStore()
const botSettingStore = useBotSettingStore()
const botSwapStore = useBotSwapStore()

const gasPrice = shallowRef(0)
const visible = ref(false)
const selected = ref<BotSettingKey>('s1')
const btnRefs = ref<Record<string, HTMLElement | null>>({})
const currentBtnRef = ref<HTMLElement | null>(null)
// const botSettingChain=ref<BotChain>('solana')
// 当前暂存的配置
const botSettings = ref(cloneDeep(botSettingStore.botSettings) as typeof botSettingStore.botSettings) 
// </notice2.0>

// 当前暂存的配置
const audioSettings = ref(cloneDeep(globalStore.audioSettings))

// 获取pump配置
const pumpConfig = computed(() => pumpStore.pumpConfig)

// 链选项
const chainOptions = computed(() => {
  return pumpConfig.value.map((item: any) => ({
    label: item.chain_show,
    value: item.chain,
  }))
})

// 平台选项 - 根据选中的链动态显示对应的平台
const platformOptions = computed(() => {
  const selectedChains = audioSettings.value.notice.pumpChains || []

  // 如果没有选择任何链，返回空数组
  if (selectedChains.length === 0) {
    return []
  }

  const platforms: Array<{ label: string; value: string; icon: string }> = []

  // 只遍历选中的链
  pumpConfig.value.forEach((chain: any) => {
    if (selectedChains.includes(chain.chain)) {
      chain.platforms.forEach((platform: any) => {
        // 去重
        if (!platforms.find((p) => p.value === platform.platform)) {
          platforms.push({
            label: platform.platform_show,
            value: platform.platform,
            icon: platform.platform_icon,
          })
        }
      })
    }
  })

  return platforms
})
const toastPositions = [
  {
    label: 'topLeft',
    className: 'pl-6px pt-6px',
    parentClassName: 'pt-7px pl-7px',
    placement: 'top-left' as const,
  },
  {
    label: 'topMiddle',
    className: 'pt-6px flex justify-center',
    parentClassName: 'pt-7px',
    placement: 'top' as const,
  },
  {
    label: 'topRight',
    className: 'pt-6px pr-6px flex justify-end',
    parentClassName: 'pt-7px pr-7px',
    placement: 'top-right' as const,
  },
  {
    label: 'bottomLeft',
    className: 'pl-6px pb-6px flex items-end',
    parentClassName: 'pb-7px pl-7px',
    placement: 'bottom-left' as const,
  },
  {
    label: 'bottomMiddle',
    className: 'pb-6px flex items-end justify-center',
    parentClassName: 'pb-7px',
    placement: 'bottom' as const,
  },
  {
    label: 'bottomRight',
    className: 'pb-6px pr-6px flex justify-end items-end',
    parentClassName: 'pb-7px pr-7px',
    placement: 'bottom-right' as const,
  },
]
// <notice2.0>
const monitorTh=computed(()=>{
  return [
    {value:audioSettings.value.notice.monitorTh[0],label:t('walletAvatar')},
    {value:audioSettings.value.notice.monitorTh[1],label:t('walletName')},
    {value:audioSettings.value.notice.monitorTh[2],label:t('MC')},
    // {value:audioSettings.value.notice.monitorTh[3],label:t('tokenCreateTime')},
  ]
})

const quickBuyChainList = shallowRef<MonitorChainType[]>(['solana', 'bsc', 'xlayer'])
const botSettingChain =computed(()=>{
  return audioSettings.value.notice.quickBuyChain
})
const handleChangeMonitorTh=(index:number)=>{
  console.log('handleChangeMonitorTh',index)
  if (index === 1 && !audioSettings.value.notice.monitorTh[0] && audioSettings.value.notice.monitorTh[1]) {
    ElMessage.warning(t('monitorThTip'))
    return
  }
  if (index === 0 && !audioSettings.value.notice.monitorTh[1] && audioSettings.value.notice.monitorTh[0]) {
    ElMessage.warning(t('monitorThTip'))
    return
  }
  audioSettings.value.notice.monitorTh[index] = !audioSettings.value.notice.monitorTh[index]
}
// </notice2.0>
const dialogVisible = computed({
  get() {
    return !!globalStore.audioSettings.active
  },
  set(value: boolean) {
    if (!value) {
      globalStore.audioSettings.active = ''
    }
  },
})
const isNotice = computed(() => {
  return audioSettings.value.active === 'notice'
})
const audioRef = ref<HTMLAudioElement | null>(null)
function playAudio(settingKey: keyof typeof audioSettings.value.audio) {
  if (audioRef.value) {
    audioRef.value.src =
      audioNameToResource[audioSettings.value.audio[settingKey] as keyof typeof audioNameToResource]
    audioRef.value.play()
  }
}

watch(dialogVisible, () => {
  if (dialogVisible.value) {
    const settings = cloneDeep(globalStore.audioSettings)
    // 确保新字段存在
    if (!settings.notice.pumpNotice) {
      settings.notice.pumpNotice = false
    }
    if (!settings.notice.pumpChains) {
      settings.notice.pumpChains = []
    }
    if (!settings.notice.pumpPlatforms) {
      settings.notice.pumpPlatforms = []
    }
    audioSettings.value = settings
  }
})

function selectPosition(item: (typeof toastPositions)[number]) {
  audioSettings.value.notice.position = item.placement
  ElMessage.warning({
    placement: item.placement,
    message: h('span', { class: 'color-[--main-text] text-12px' }, t('example')),
  })
}
function getCheckboxBorderColor(platform: string) {
  return getPumpBgColor(platform).color
}

// 判断checkbox是否被选中
function isPlatformChecked(platform: string) {
  return audioSettings.value.notice.pumpPlatforms?.includes(platform)
}

// 获取checkbox的边框样式
function getCheckboxBorderStyle(platform: string) {
  const color = getCheckboxBorderColor(platform)
  if (isPlatformChecked(platform)) {
    // 选中时显示完整颜色
    return {
      borderColor: color
    }
  }
  // 未选中时显示淡色（30%透明度）
  return {
    borderColor: hexToRgba(color, 0.3)
  }
}

// 将hex颜色转换为rgba格式
function hexToRgba(hex: string, alpha: number = 1) {
  // 移除 # 号
  hex = hex.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function getSelectedClass(item: string) {
  if (audioSettings.value.notice.position === item) {
    return {
      parent: 'border-[--primary-color]',
      class: 'color-[--main-text]',
    }
  }
  return {
    class: 'color-[--secondary-text]',
  }
}

function onSave() {
  globalStore.audioSettings = cloneDeep(audioSettings.value)

  if(audioSettings.value.notice.quickBuy){
    // botSettings[botSettingChain.value]!.buy
    const setting = cloneDeep(botSettings.value?.[botSettingChain.value]) as typeof botSettingStore.botSettings['eth']
    const selectedB = setting?.buy?.selected as BotSettingKey
    const slippageValueB = setting?.buy?.[selectedB].slippage
    if (setting?.buy?.[selectedB]) {
      if (slippageValueB === undefined) {
        setting!.buy[selectedB].slippage = 'auto'
      } else {
        setting!.buy[selectedB].slippage = String(slippageValueB)
      }
      ;['s1', 's2', 's3'].forEach((s) => {
        Reflect.deleteProperty(setting!.buy![s as BotSettingKey], 'slippageValue')
        Reflect.deleteProperty(setting!.buy![s as BotSettingKey], 'customSlippage')
      })
    }
    console.log('setting', setting)
    if (setting) {
      if (botSettingChain.value) {
        botSettingStore.botSettings = {
          ...botSettingStore.botSettings,
          [botSettingChain.value]: { ...setting },
        }
      }
    }
  }
  dialogVisible.value = false
}

function toggleChain(chain: string) {
  const index = audioSettings.value.notice.pumpChains.indexOf(chain)
  if (index > -1) {
    audioSettings.value.notice.pumpChains.splice(index, 1)

    // 取消选中链时，移除该链下不在其他已选链中的平台
    const remainingPlatforms = new Set<string>()
    pumpConfig.value.forEach((c: any) => {
      if (audioSettings.value.notice.pumpChains.includes(c.chain)) {
        c.platforms.forEach((p: any) => {
          remainingPlatforms.add(p.platform)
        })
      }
    })

    audioSettings.value.notice.pumpPlatforms = audioSettings.value.notice.pumpPlatforms.filter(
      (platform: string) => remainingPlatforms.has(platform)
    )
  } else {
    audioSettings.value.notice.pumpChains.push(chain)
  }
}

// 全选/取消全选平台
const isAllPlatformsSelected = computed(() => {
  if (!audioSettings.value.notice.pumpPlatforms) return false
  return (
    platformOptions.value.length > 0 &&
    audioSettings.value.notice.pumpPlatforms.length === platformOptions.value.length
  )
})

const isIndeterminatePlatforms = computed(() => {
  const selected = audioSettings.value.notice.pumpPlatforms?.length || 0
  return selected > 0 && selected < platformOptions.value.length
})

function toggleAllPlatforms() {
  if (isAllPlatformsSelected.value) {
    audioSettings.value.notice.pumpPlatforms = []
  } else {
    audioSettings.value.notice.pumpPlatforms = platformOptions.value.map((p: any) => p.value)
  }
}



// <notice2.0>
function setBtnRef(el: HTMLElement | null) {
  if (el && el?.id) {
    btnRefs.value[el?.id] = el
  }
}

function showPopover(item: BotSettingKey) {
  selected.value = item
  currentBtnRef.value = btnRefs.value[item] || null
  visible.value = true
  getGasPrice()
}

function getGasPrice() {
  const chain = botSettingChain.value
  if (!isEvmChain(chain)) {
    return
  }
  getRpcProvider(chain)?.getFeeData().then(res => {
    if (res) {
      gasPrice.value = new BigNumber(res.gasPrice || 0).toNumber()
    }
  })
}

const botPriorityFee = computed(() => {
  const chain = botSettingChain.value
  if (!botStore.isSupportChains.includes(chain)) {
    return ''
  }
  const botSettings = botSettingStore.botSettings?.[chain]?.buy?.[selected.value]
  const mev = botSettings?.mev

  const {gasTip1List, gasTip2List} = formatBotGasTips(botSwapStore.gasTip, chain)
  const gasTips = mev ? gasTip1List : gasTip2List
  const gasIndex = mev ? 0 : 1
  const settings = botSettings?.gas[gasIndex]
  const priorityFee = settings?.customFee || gasTips?.[settings?.level as number]
  return priorityFee
})
function getEstimatedGas() {
  const chain = botSettingChain.value
  if (isEvmChain(chain) && botStore?.isSupportChains?.includes(chain)) {
    const botSettings = botSettingStore.botSettings?.[chain]?.buy?.[selected.value]
    const mev = botSettings?.mev
    const nativePrice = botSwapStore.mainTokensPrice?.find(item => item.chain === chain && item.token === getChainInfo(chain)?.wmain_wrapper)?.current_price_usd || tokenStore.swap.native.price || 0
    const {gasTip1List, gasTip2List} = formatBotGasTips(botSwapStore.gasTip, chain)
    const gasTips = mev ? gasTip1List : gasTip2List
    const settings = mev ? botSettings?.gas[0] : botSettings?.gas[1]
    const extraGasPrice = settings?.customFee || gasTips?.[settings?.level as number] || '3'
    const gasLimit = botSwapStore.gasTip?.find?.(i => i.chain === chain && i.mev === !!mev)?.gasLimit || 200000
    return formatNumber(new BigNumber(gasPrice.value).plus(new BigNumber(extraGasPrice).times(String(10 ** 9))).times(gasLimit).times(nativePrice).div(String(10 ** 18)).toFixed(), 2)
  }
  return 0
}
// </notice2.0>

</script>

<template>
  <el-dialog v-model="dialogVisible" :width="360">
    <template #header>
      <span
        :class="`text-20px font-500 mr-24px cursor-pointer ${isNotice ? 'color-[--main-text]' : 'color-[--third-text]'}`"
        @click="audioSettings.active = 'notice'"
        >{{ $t('noticeSettings') }}</span
      >
      <span
        :class="`text-20px font-500 cursor-pointer ${!isNotice ? 'color-[--main-text]' : 'color-[--third-text]'}`"
        @click="audioSettings.active = 'audio'"
        >{{ $t('audioSettings') }}</span
      >
    </template>
    <template #default>
      <div class="mx--20px border-t-solid border-t-1px border-t-[--dialog-divider] mb-20px" />
      <div v-if="isNotice" class="text-12px">
        <el-scrollbar max-height="537px" class="pr-10px" :always="false">
          <div class="h-full overflow-hidden">
            <div class="flex justify-between items-center mb-24px">
              <span>{{ $t('monitorGlobalPush') }}</span>
              <el-switch v-model="audioSettings.notice.monitor" class="[&&]:h-20px" />
            </div>
            <template v-if="audioSettings.notice.monitor">
              <div class="bg-[--dialog-list-hover] p-8px mb-24px rounded-[8px]">
                <div v-if="audioSettings.notice.monitorShow===1" class="relative p-[15px_8px] flex gap-8px items-center border-[1px] border-solid border-transparent" :class="audioSettings.notice.monitorBorder&&'border-[var(--up-color)]! rounded-[8px]'">
                  <img class="" src="@/assets/images/pump/symbol.svg" width="40" alt="">
                  <div class="flex h-40px items-start justify-between flex-col gap-4px">
                    <div class="flex items-center"><img v-if="audioSettings.notice.monitorTh[0]" class="w-16px h-16px rounded-[50%] mr-4px" src="@/assets/images/pump/user.svg" /><span v-if="audioSettings.notice.monitorTh[1]">Zoe&nbsp;</span><span class="color-[--up-color]">&nbsp;{{ $t('addPosition') }}</span>&nbsp;SENTIS</div>
                    <div class="flex items-center"><img class="w-16px h-16px rounded-[50%] mr-4px" :src="`${configStore.token_logo_url}chain/bsc.png`" alt="" onerror="this.src='/icon-default.png'" srcset="" />
                      <span><span class="color-[--up-color]">0.75 BNB</span><span v-if="audioSettings.notice.monitorTh[2]">&nbsp;{{ $t('bugMC',{n:'$34.6M'}) }}</span></span>
                    </div>
                  </div>
                  <div v-if="audioSettings.notice.quickBuy" class='quickBuyBtn flex items-center h-[24px] bg-#12B8861A text-#12B886 rounded-[4px] font-normal text-[14px] leading-[16px] px-8px clickable absolute right-8px top-32px'>
                    0.01 BNB
                  </div>
                  <Icon name="custom:close" class="text-16px color-[--third-text] absolute right-8px top-26px" :class="audioSettings.notice.quickBuy&&'top-8px!'"/>
                </div>
                <div v-else class="relative flex items-center p-[15px_8px] border-[1px] border-solid border-transparent" :class="'border-[--dialog-tab-active-bg]! rounded-[8px]'">
                  <img class="w-16px h-16px rounded-[50%] mr-4px" src="@/assets/images/pump/user.svg" />
                  <div class="flex items-center">
                    <span><span>Zoe&nbsp;</span>{{ $t('createPosition') }}</span> 
                    <span class="flex items-center">
                      <span class="color-[--up-color]">&nbsp;1BNB</span><img class="w-16px h-16px rounded-[50%] mx-4px" src="@/assets/images/pump/m-symbol.svg" />{{$t('of')}}&nbsp;SENTIS
                    </span>
                  </div>
                  <Icon name="custom:close" class="text-16px color-[--third-text] absolute right-8px top-14px"/>
                </div>
              </div>
              <div class="flex justify-between items-center mb-24px">
                <span>{{ $t('monitorShowType') }}</span>
                <el-radio-group v-model="audioSettings.notice.monitorShow" class="[&&]:[--el-border:none]" size="small" :fill="isDark?'#282D35':'#fff'" :text-color="isDark?'#F5F5F5':'#111'" @change="()=>{}">
                  <el-radio-button :label="t('classic')" :value="0" />
                  <el-radio-button :label="t('advance')" :value="1" />
                </el-radio-group>
                <!-- <el-switch v-model="audioSettings.notice.monitorShow" class="[&&]:h-20px" /> -->
              </div>
              <div v-if="audioSettings.notice.monitorShow===1" class="flex justify-between items-center mb-24px">
                <span>{{ $t('monitorCardBorder') }}</span>
                <el-radio-group v-model="audioSettings.notice.monitorBorder" class="[&&]:[--el-border:none]" size="small" :fill="isDark?'#282D35':'#fff'" :text-color="isDark?'#F5F5F5':'#111'" @change="()=>{}">
                  <el-radio-button :label="t('display2')" :value="1" />
                  <el-radio-button :label="t('hidden')" :value="0" />
                </el-radio-group>
              </div>
              <div v-if="audioSettings.notice.monitorShow===1" class="flex flex-col mb-24px flex2122 gap-[12px]">
                <span>{{ $t('monitorTh') }}</span>
                <div class="flex items-center gap-[8px] flex-wrap">
                  <div v-for="({value,label},index) in monitorTh" :key="index" class="h-24px clickable rounded-[4px] bg-[--border] flex items-center justify-center px-12px" :class="value?'color-[--main-text]':'color-[--third-text]'" @click="()=>handleChangeMonitorTh(index)">{{ label }}</div>
                </div>
              </div>
              <div v-if="audioSettings.notice.monitorShow===1" class="flex justify-between items-center mb-8px" :class="!audioSettings.notice.quickBuy&&'mb-24px!'">
                <div class="flex items-center gap-[4px]">
                  {{ $t('quick') }}
                  <div class='bg-[--border] rounded-[4px] h-28px p-[2px_8px] flex items-center gap-[4px]'>
                    <div v-for="item in quickBuyChainList" :key='item' class="w-24px h-24px items-center p-2px rounded-[4px] clickable" :class="(audioSettings.notice.quickBuyChain===item)&&'bg-[--dialog-tab-active-bg]'" @click="audioSettings.notice.quickBuyChain=item">
                      <img 
                          :src="`${configStore.token_logo_url}chain/${item}.png`"
                          alt=""
                          class="rounded-full w-20px h-20px"
                      >
                    </div>
                  </div>
                </div>
                <el-switch v-model="audioSettings.notice.quickBuy" class="[&&]:h-20px" />
              </div>
              <div v-if="(audioSettings.notice.monitorShow===1)&&audioSettings.notice.quickBuy" class="mb-24px flex justify-between items-center">
                <QuickBuyInput
                  v-model="(audioSettings.notice as any)[`quickBuyValue_${audioSettings.notice.quickBuyChain}`]"
                  :show-chain-icon="true"
                  :chain="botSettingChain"
                  input-style="width:192px"
                />
                <div class='bg-[--border] rounded-[4px] p-2px'>
                  <button
                    v-for="item in BotSettingsArr"
                    :id="item.value"
                    :key="item.value"
                    :ref="setBtnRef"
                    class="cursor-pointer border-none font-400 rounded-4px min-w-36px py-5px px-10px text-center h-28px"
                    :class="`${item.value === botSettings?.[botSettingChain]?.buy?.selected?'color-[--main-text] bg-[--dialog-tab-active-bg]':'color-[--secondary-text] bg-transparent'}`"
                    type="button"
                    @click.stop="botSettings[botSettingChain]!.buy!.selected = item.value"
                    @mouseenter="showPopover(item.value)"
                    @mouseleave="visible = false"
          
                  >
                    {{ item.label }}
                  </button>
                </div>
              </div>
              <div v-if="audioSettings.notice.monitorShow===1" class="flex justify-between items-center mb-24px">
                <span>{{ $t('afterBuyAction') }}</span>
                <el-radio-group v-model="audioSettings.notice.quickBuyAction" class="[&&]:[--el-border:none]" size="small" :fill="isDark?'#282D35':'#fff'" :text-color="isDark?'#F5F5F5':'#111'" @change="()=>{}">
                  <el-radio-button :label="t('open')" :value="0" />
                  <el-radio-button :label="t('jump2')" :value="1" />
                  <el-radio-button :label="t('noOpen')" :value="2" />
                </el-radio-group>
              </div>
            </template>

         
            <div class="flex justify-between items-center mb-24px">
              <span>{{ $t('signalGlobalPush') }}</span>
              <el-switch v-model="audioSettings.notice.signal" class="[&&]:h-20px" />
            </div>
            <!-- 内外盘提示 -->
            <div class="flex justify-between items-center mb-24px">
              <span>{{ $t('pumpNotice') }}</span>
              <el-switch v-model="audioSettings.notice.pumpNotice" class="[&&]:h-20px" />
            </div>
            <div v-show="audioSettings.notice.pumpNotice" class="mb-12px w-full">
              <div class="flex gap-8px flex-wrap p-1 rounded-1 bg-[--d-252E3C-l-D9E8FF]">
                <button
                  v-for="chain in chainOptions"
                  :key="chain.value"
                  class="lh-16px flex-1 py-4px px-8px border-none cursor-pointer rounded-1 text-14px"
                  :class="
                    audioSettings.notice.pumpChains?.includes(chain.value)
                      ? 'bg-[--secondary-bg] color-[--main-text]'
                      : 'bg-transparent color-[--third-text]'
                  "
                  @click="toggleChain(chain.value)"
                >
                  {{ chain.label }}
                </button>
              </div>
              <div>
                <el-checkbox
                  v-if="audioSettings.notice.pumpChains.length > 0"
                  :model-value="isAllPlatformsSelected"
                  :indeterminate="isIndeterminatePlatforms"
                  class="mb-2px mt-4px"
                  @change="toggleAllPlatforms"
                >
                  {{ $t('all') }}
                </el-checkbox>
    
                <el-checkbox-group
                  v-model="audioSettings.notice.pumpPlatforms"
                  class="grid grid-cols-2 gap-2px"
                >
                  <el-checkbox
                    v-for="platform in platformOptions"
                    :key="platform.value"
                    :value="platform.value"
                    class="m-0! !h-28px platform-checkbox"
                  >
                    <div
                      class="flex px-4px py-2px items-center border-1px border-solid border-[--border] rounded-4px platform-checkbox-content"
                      :style="getCheckboxBorderStyle(platform.value)"
                    >
                      <el-image
                        class="mr-6px w-14px h-14px rounded-2px"
                        :src="`${configStore.token_logo_url}${platform.icon?.replace('/signals/', 'signals/')}`"
                      />
                      <span>{{ platform.label }}</span>
                    </div>
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
    
            <div class="mb-24px">
              <div class="lh-14px mb-14px">{{ $t('ToastPosition') }}</div>
              <div class="flex gap-x-8px gap-y-16px flex-wrap">
                <div
                  v-for="item in toastPositions"
                  :key="item.label"
                  :class="`text-center cursor-pointer hover:color-[--main-text] group ${getSelectedClass(item.placement)?.class || ''}`"
                  @click="selectPosition(item)"
                >
                  <div
                    :class="`bg-[--secondary-bg] border-1px border-solid border-[--border] rounded-4px mb-9px group-hover:border-[--primary-color] transition-all duration-300 ${item.parentClassName} ${getSelectedClass(item.placement)?.parent || ''}`"
                  >
                    <div :class="`w-91px h-46px bg-[--dialog-bg] rounded-4px ${item.className}`">
                      <div
                        class="w-54px h-20px bg-[--secondary-bg] rounded-4px flex items-center justify-center"
                      >
                        <div class="w-6px h-6px bg-[--primary-color] rounded-full mr-3px" />
                        <div>
                          <div class="w-33px h-2px bg-[--main-input-button-bg]" />
                          <div class="mt-2px w-18px h-2px bg-[--main-input-button-bg]" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {{ $t(item.label) }}
                </div>
              </div>
            </div>
            <div class="h-74px mb-20px">
              <div class="flex justify-between items-center text-12px mt-24px mb-12px">
                {{ $t('noticeDuration') }}
                <el-input
                  v-model.number="audioSettings.notice.time"
                  class="w-60px [--el-input-height:28px] text-12px [--el-input-icon-color:--d-CCC-l-333] [--el-input-border-color:--d-333-l-F2F2F2]"
                >
                  <template #suffix><span class="color-[--third-text]">s</span></template>
                </el-input>
              </div>
              <div class="px-[4px]">
                <el-slider
                  v-model="audioSettings.notice.time"
                  :min="1"
                  :max="10"
                  :step="3"
                  :marks="{
                    1: '1s',
                    4: '4s',
                    7: '7s',
                    10: '10s',
                  }"
                  class="[&&]:[--el-slider-button-size:8px] [--el-color-white:--primary-color] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] [--el-color-info:--third-text]"
                />
              </div>
            </div>
          </div>
        </el-scrollbar>
        <el-button type="primary" class="w-full" @click="onSave">
          {{ $t('complete') }}
        </el-button>
      </div>
      <div v-else>
        <AudioSettingsItem
          v-model="audioSettings.audio.signal"
          :title="$t('signal')"
          @playAudio="playAudio('signal')"
        />
        <AudioSettingsItem
          v-model="audioSettings.audio.monitor"
          :title="$t('followMonitor')"
          @playAudio="playAudio('monitor')"
        />
        <div class="mb-21px text-12px">{{ $t('tradeSound') }}</div>
        <AudioSettingsItem
          v-model="audioSettings.audio.marketBuy"
          class="color-[--secondary-text]"
          :title="$t('buySound')"
          @playAudio="playAudio('marketBuy')"
        />
        <AudioSettingsItem
          v-model="audioSettings.audio.marketSell"
          class="color-[--secondary-text]"
          :title="$t('sellSound')"
          @playAudio="playAudio('marketSell')"
        />
        <AudioSettingsItem
          v-model="audioSettings.audio.limit"
          class="color-[--secondary-text]"
          :title="$t('limit')"
          @playAudio="playAudio('limit')"
        />
        <div class="flex justify-between items-center text-12px mt-24px mb-12px">
          {{ $t('volume2') }}
          <el-input
            v-model.number="audioSettings.audio.volume"
            class="w-60px [--el-input-height:28px] text-12px [--el-input-icon-color:--d-CCC-l-333] [--el-input-border-color:--d-333-l-F2F2F2]"
          >
            <template #suffix><span class="color-[--third-text]">%</span></template>
          </el-input>
        </div>
        <el-slider
          v-model="audioSettings.audio.volume"
          :min="0"
          :max="100"
          :step="1"
          :marks="{
            0: '0',
            25: '25',
            50: '50',
            75: '75',
            100: '100',
          }"
          class="[&&]:[--el-slider-button-size:8px] [--el-color-white:--primary-color] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] mx-4px [--el-color-info:--third-text]"
        />
        <el-button type="primary" class="w-full mt-70px" @click="onSave">{{
          $t('complete')
        }}</el-button>
      </div>
      <audio ref="audioRef" class="hidden" :volume="audioSettings.audio.volume / 100" />
    </template>
  </el-dialog>
  <el-popover
    v-model:visible="visible"
    popper-class="new-popover"
    :virtual-ref="currentBtnRef"
    virtual-triggering
    trigger="contextmenu"
    placement="bottom"
    popper-style="min-width: auto; width: auto;"
  >
    <ul>
      <li class="text-14px mt-4px mb-4px flex-start">
        <Icon v-tooltip="$t('slippage')" name="custom:slippage" class="text-14px color-[--third-text] ml-0 mr-6px cursor-pointer"/>
        <span class="mr-4px color-[--third-text] text-14px">{{ $t('slippage') }}</span>
        <span v-if="botSettings?.[botSettingChain]?.buy?.[selected]?.slippage !== 'auto'">
          {{
            botSettings?.[botSettingChain || '']?.buy?.[selected]?.slippage
          }}%</span>
        <span v-else>{{ $t('auto') }}</span>
      </li>
      <li v-if="isEvmChain(botSettingChain || '')" class="text-14px mt-4px mb-4px flex-start">
        <Icon v-tooltip="$t('estimatedGas')" name="custom:gas" class="text-14px color-[--third-text] ml-0 mr-6px cursor-pointer"/>
        <span class="mr-4px color-[--third-text] text-14px">{{ $t('estimatedGas') }}</span>
        ${{ getEstimatedGas() }}
      </li>
      <li v-if="botSettingChain === 'solana'" class="text-14px mt-4px mb-4px flex-start">
        <Icon v-tooltip="$t('priorityFee')" name="custom:gas" class="text-14px color-[--third-text] mr-6px cursor-pointer ml-0"/>
        <span class="mr-4px color-[--third-text] text-14px whitespace-nowrap block">{{ $t('priorityFee') }}</span>
        <span class="whitespace-nowrap">{{ botPriorityFee }} SOL</span>
      </li>
      <li class="text-14px mt-4px mb-4px flex-start">
        <Icon v-tooltip="$t('autoSellHalf')" :name="`custom:half-${globalStore.mode}`" class="text-18px color-[--third-text] ml-0 mr-6px cursor-pointer"/>
        <span class="mr-4px color-[--third-text] text-14px whitespace-nowrap">{{ $t('autoSellHalf') }}</span>
        {{  botSettingStore.autoSellConfigs?.autoSell ? $t('on') : $t('off') }}
      </li>

      <li class="text-14px mt-4px mb-4px flex-start">
        <Icon v-tooltip="$t('mev')" name="custom:mev" class="text-16px color-[--third-text] ml-0 mr-6px cursor-pointer"/>
        <span class="mr-4px color-[--third-text] text-14px">{{ $t('mev') }}</span>
        {{  botSettingStore.botSettings?.[botSettingChain]?.buy?.[selected]?.mev ? $t('on')  : $t('off') }}
      </li>

    </ul>
  </el-popover>
</template>
<style scoped lang="scss">
:deep {
  .el-select__wrapper {
    background-color: transparent;
    box-shadow: none;
    padding: 0;
    padding-left: 8px;
  }
}
:deep(.el-slider__marks-text) {
  margin-top: 7px;
}
:deep().el-radio-group{
  padding: 2px;
  background: var(--border);
  border-radius: 4px;
  .el-radio-button__inner{
    background: var(--border);
    border: none;
    color: var(--secondary-text);
    font-weight: 500;
  }
}
</style>
