<template>
  <div v-show="botStore.userInfo?.evmAddress">
    <div class="flex-between h-24px my--2px ">
      <div class="flex items-center">
        <el-checkbox v-model="isAutoSellConfig" class="auto-sell-checkbox"><span class="font-400 color-#3F80F7 text-14px">{{ $t('advancedTrading') }}</span></el-checkbox>
        <Icon
          v-tooltip.raw="{
          content: $t('advancedTradingTips'),
          props: {
            'popper-class': 'max-w-500px'
          }
        }" name="material-symbols:help-rounded" class="text-14px color-[--icon-color] cursor-pointer ml-3px" />
      </div>
      <!-- <div class="flex items-center gap-5px" v-show="isAutoSellConfig" > -->
      <div class="flex items-center gap-5px">
        <el-select popper-class="w-selectAutoSell" v-model="autoSellConfigName" :placeholder="t('defaultPolicy')" style="width: 110px" @change="changeAutoSellConfig" placement="bottom-end" :persistent="false" size="small" :disabled="!isAutoSellConfig" v-tooltip="autoSellConfigNameStr">
          <li class="el-select-dropdown__item text-[--third-text]!">{{ t('defaultPolicy') }}</li>
          <el-option
            v-for="item in autoSellConfigOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <SlippageSet :canSetAuto="true" :isAutoSell="true" :showAutoSell="true" :chain="(tokenStore.tokenInfo?.token?.chain as BotChain)" :setting="botSettingStore?.botSettings[chain]"  />
      </div>
    </div>
    <ul v-show="botSettingStore.autoSellConfigs.isAutoSellConfig">
      <li v-for="(item, index) in autoSellConfig" :key="index" class="mt-8px flex items-center gap-4px">
        <el-input-number v-model="item.priceChange" class="input-number-limit" :min="1" :controls="false" placeholder="--" @update:model-value="triggerAutoSellConfig">
          <template #prefix>
            <div class="flex items-center">
              <Icon v-if="item.isUp" name="ri:arrow-up-long-fill" class="color-#12B886" />
              <Icon v-else name="ri:arrow-down-long-fill" class="color-#F6465D" />
              <span class="text-12px color-[--third-text]">{{ item.isUp ? $t('rise') : $t('fall') }}</span>
            </div>
          </template>
          <template #suffix>
            <span class="color-[--third-text]">%</span>
          </template>
        </el-input-number>
        <el-input-number v-model="item.sellRatio" class="input-number-limit" :min="1" :max="100" :controls="false" placeholder="--" @update:model-value="triggerAutoSellConfig">
          <template #prefix>
            <span class="text-12px color-[--third-text]">{{ $t('sell') }}</span>
          </template>
          <template #suffix>
            <span class="color-[--third-text]">%</span>
          </template>
        </el-input-number>
        <Icon class="text-16px ml-5px clickable color-[--third-text]" name="bx:bxs-trash-alt" @click.stop="deleteAutoSellConfig(index)" />
      </li>
      <li class="flex gap-8px items-center text-12px mt-8px">
        <button class="flex-1 h-24px flex items-center justify-center clickable bg-#12B8861A color-#12B886 border-none rd-4px disabled:op-50 disabled:cursor-not-allowed" :disabled="autoSellConfig?.length >= 5" @click.stop="addStopProfit">{{ $t('addTakeProfit') }}</button>
        <button class="flex-1 h-24px flex items-center justify-center clickable bg-#F6465D1A color-#F6465D border-none rd-4px disabled:op-50 disabled:cursor-not-allowed" :disabled="autoSellConfig?.length >= 5" @click.stop="addStopLoss">{{ $t('addStopLoss') }}</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang='ts'>

import { cloneDeep } from 'lodash-es'
import SlippageSet from '~/pages/token/components/right/botSwap/slippageSet.vue'
const botStore = useBotStore()
const botSettingStore = useBotSettingStore()
const route = useRoute()
const tokenStore = useTokenStore()
const { t } = useI18n()
const { autoSellConfigs, loadAutoSellConfigs, saveAutoSellConfigs } = useAutoSellConfig()
const isAutoSellConfig = computed({
  get() {
    return (botSettingStore?.autoSellConfigs as any)?.['isAutoSellConfig'+botSettingStore.autoSellConfigs.autoSellConfigName]
    // return botSettingStore?.autoSellConfigs?.isAutoSellConfig
  },
  set(val) {
    const setting = cloneDeep(botSettingStore.autoSellConfigs) as any
    if (setting) {
      setting['isAutoSellConfig'+botSettingStore.autoSellConfigs.autoSellConfigName] = val as boolean
      if (!setting['autoSellConfig'+botSettingStore.autoSellConfigs.autoSellConfigName]?.length && val) {
        setting.autoSellConfig = [
          {
            open: true,
            priceChange: 10000,
            sellRatio: 5000,
            type: 'default'
          }
        ]
      }
      // if(!val){
      //   setting.selectedAutoSellConfig=[]
      // }
      botSettingStore.autoSellConfigs = {
        ...setting
      }
      if(val){
        loadAutoSellConfigs()
        saveAutoSellConfigs()
      }
    }
  }
})

const autoSellConfig = computed<Array<{
  open: boolean,
  priceChange?: number,
  sellRatio?: number,
  type: 'default',
  isUp: boolean
}>>({
  get() {
    const setting:any = botSettingStore.autoSellConfigs
    const config = setting?.['autoSellConfig'+botSettingStore.autoSellConfigs.autoSellConfigName]
    // const config = setting?.autoSellConfig
    if (Number(config?.length) > 0) {
      return config?.map?.(i => {
        return {
          open: i.open,
          priceChange: Math.floor(Math.abs(i.priceChange || 0) / 100) || undefined,
          sellRatio: Math.floor((i.sellRatio || 0) / 100) || undefined,
          type: i.type,
          isUp: !i.priceChange ? (i.isUp || false) : i.priceChange > 0
        }
      }) || []
    }
    return []
  },
  set(val) {
    const setting = cloneDeep(botSettingStore.autoSellConfigs) as any
    if (setting) {
      setting['autoSellConfig'+botSettingStore.autoSellConfigs.autoSellConfigName] = val?.map?.(i => {
        return {
          open: i.open,
          priceChange: i.isUp ? Number(i?.priceChange || 0) * 100 : Number(i?.priceChange || 0) * -100,
          sellRatio: Number(i.sellRatio || 0) * 100,
          type: i.type,
          isUp: i.isUp
        }
      }) || []
      botSettingStore.autoSellConfigs = {
        ...setting
      }
    }
  }
})

const autoSellConfigNameStr=computed(() => {
  return {
    '0': t('takeProfitAndStopLoss0'),
    '1': t('takeProfitAndStopLoss1'),
    '2': t('takeProfitAndStopLoss2'),
    '3': t('takeProfitAndStopLoss3'),
    '4': t('takeProfitAndStopLoss4'),
    '5': t('takeProfitAndStopLoss5'),
    '6': t('takeProfitAndStopLoss6')
  }?.[autoSellConfigName.value]
})

const autoSellConfigName=computed({
  get() {
    return botSettingStore.autoSellConfigs.autoSellConfigName || '0'
  },
  set(val) {
   botSettingStore.autoSellConfigs.autoSellConfigName = val ==='0' ? '' : val
  }
})

const changeAutoSellConfig = (value:any) => {
  ['0','1','2','3','4','5','6'].forEach((item) => {
    if(item!==value){
      if((botSettingStore.autoSellConfigs as any)?.['isAutoSellConfig'+(item==='0'?'':item)]!==undefined){
        (botSettingStore.autoSellConfigs as any)['isAutoSellConfig'+(item==='0'?'':item)] = false
      }
      // (botSettingStore.autoSellConfigs as any)['isAutoSellConfig'+item] = false
    }else{
      (botSettingStore.autoSellConfigs as any)['isAutoSellConfig'+(item==='0'?'':item)] = true
    }
  })
  loadAutoSellConfigs()
  saveAutoSellConfigs()
  console.log('changeAutoSellConfig',value)
}
const autoSellConfigOption=computed(() => {
  return [
      {
        value: '0',
        label: t('takeProfitAndStopLoss0')
      },
      {
        value: '1',
        label: t('takeProfitAndStopLoss1')
      },
      {
        value: '2',
        label: t('takeProfitAndStopLoss2')
      },
      {
        value: '3',
        label: t('takeProfitAndStopLoss3')
      },
      {
        value: '4',
        label: t('takeProfitAndStopLoss4')
      },
      {
        value: '5',
        label: t('takeProfitAndStopLoss5')
      },
      {
        value: '6',
        label: t('takeProfitAndStopLoss6')
      },
  ]
})

const chain = computed(() => {
  return (getAddressAndChainFromId(route.params?.id as string)?.chain || tokenStore.token?.chain) as BotChain
})

// 自动卖出 type -> "default"(一般限价单), "trailing"(移动止盈止损)，"migrated"(上外盘),"devsell"(开发者卖出跟卖)
// 自动卖出系数 -> priceChange 10000: 100%, 100: 1%, sellRatio 10000: 100%, 100: 1%
function addStopProfit() {
  autoSellConfig.value.push({
    open: true,
    priceChange: undefined,
    sellRatio: undefined,
    type: 'default',
    isUp: true
  })
  triggerAutoSellConfig()
}

function addStopLoss() {
  autoSellConfig.value.push({
    open: true,
    priceChange: undefined,
    sellRatio: undefined,
    type: 'default',
    isUp: false
  })
  triggerAutoSellConfig()
}

function deleteAutoSellConfig(index: number) {
  autoSellConfig.value = autoSellConfig.value.filter((_, i) => i !== index)
}

function triggerAutoSellConfig() {
  autoSellConfig.value = [...autoSellConfig.value]
  loadAutoSellConfigs()
  saveAutoSellConfigs()
}

</script>

<style scoped lang='scss'>
.auto-sell-checkbox :deep() {
  --el-checkbox-height: 20px;
  .el-checkbox__input {
    align-items: center;
  }
  .el-checkbox__label {
    display: inline-flex;
    align-items: center;
    padding-left: 5px;
  }
}
.input-number-limit {
  width: auto;
  flex: 1;
  :deep(.el-input) {
    --el-input-border-color: transparent;
    --el-input-hover-border-color: transparent;
    --el-input-focus-border-color: transparent;
    .el-input__inner {
      text-align: right;
    }
  }
}
:deep() .el-select--small .el-select__wrapper.el-select__wrapper{
  padding: 5px 8px !important;
  font-weight: 500;
  font-size: 10px;
  line-height: 14px;
  letter-spacing: 0px;
}
</style>

<style lang="scss">
.w-selectAutoSell{
  .el-select-dropdown__wrap{
    .el-select__wrapper{
    }
    /* max-height: 300px !important; */
  }
  .el-select-dropdown__item{
    font-weight: 400;
    font-size: 12px;
    line-height: 24px;
    height: 24px;
  }

}
</style>
