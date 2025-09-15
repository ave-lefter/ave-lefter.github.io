<template>
  <div v-show="botStore.userInfo?.evmAddress">
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
    <ul v-show="isAutoSellConfig">
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
const botStore = useBotStore()
const botSettingStore = useBotSettingStore()

const isAutoSellConfig = computed({
  get() {
    return botSettingStore?.autoSellConfigs?.isAutoSellConfig
  },
  set(val) {
    const setting = cloneDeep(botSettingStore.autoSellConfigs)
    if (setting) {
      setting.isAutoSellConfig = val as boolean
      if (!setting.autoSellConfig?.length && val) {
        setting.autoSellConfig = [
          {
            open: true,
            priceChange: 10000,
            sellRatio: 5000,
            type: 'default'
          }
        ]
      }
      botSettingStore.autoSellConfigs = {
        ...setting
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
    const setting = botSettingStore.autoSellConfigs
    const config = setting?.autoSellConfig
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
    const setting = cloneDeep(botSettingStore.autoSellConfigs)
    if (setting) {
      setting.autoSellConfig = val?.map?.(i => {
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
</style>
