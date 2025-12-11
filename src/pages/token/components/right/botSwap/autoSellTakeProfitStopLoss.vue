<template>
  <div>
    <div class="slippage-label mt-15px" :class="autoSellConfigs['isAutoSellConfig'+name]&&'color-[--main-text]!'">
      <span class="mr-5px">{{ title }}</span>
      <Icon v-tooltip="tooltipText" class="text-15px color-[--icon-color] clickable mr-auto"
        name="material-symbols:help-rounded" />
      <el-switch v-model="autoSellConfigs['isAutoSellConfig'+name]" size="small" class="ml-2px"
        style="--el-switch-on-color: #3c6cf6" />
    </div>
    <ul v-show="autoSellConfigs['isAutoSellConfig'+name]">
      <li v-for="(item, index) in autoSellConfigs['autoSellConfig'+name]" :key="index"
        class="mt-10px flex items-center gap-4px">
        <span v-if="item.isUp" class="color-#12B886 text-14px mr-10px">{{
          $t('takeProfit')
        }}</span>
        <span v-else class="color-#F6465D text-14px mr-10px">{{ $t('stopLoss') }}</span>
        <el-input-number v-model="item.priceChange" class="input-number-limit" :min="1" :controls="false" :disabled="!!name"
          placeholder="--">
          <template #prefix>
            <div class="flex items-center">
              <Icon v-if="item.isUp" name="ri:arrow-up-long-fill" class="color-#12B886" />
              <Icon v-else name="ri:arrow-down-long-fill" class="color-#F6465D" />
              <span class="text-12px color-[--third-text]">{{
                item.isUp ? $t('rise') : $t('fall')
              }}</span>
            </div>
          </template>
          <template #suffix>
            <span class="color-[--third-text]">%</span>
          </template>
        </el-input-number>
        <el-input-number v-model="item.sellRatio" class="input-number-limit" :min="1" :max="100" :controls="false" :disabled="!!name"
          placeholder="--">
          <template #prefix>
            <span class="text-12px color-[--third-text]">{{ $t('sell') }}</span>
          </template>
          <template #suffix>
            <span class="color-[--third-text]">%</span>
          </template>
        </el-input-number>
        <Icon v-if="!name" class="text-16px ml-5px clickable color-[--third-text]" name="bx:bxs-trash-alt"
          @click.stop="autoSellConfigs['autoSellConfig'+name].splice(index, 1)" />
      </li>
      <li v-if="!name" class="flex gap-8px items-center text-14px mt-20px">
        <button
          class="flex-1 h-44px flex items-center justify-center clickable bg-#12B8861A color-#12B886 border-none rd-8px disabled:op-50 disabled:cursor-not-allowed"
          type="button" :disabled="autoSellConfigs['autoSellConfig'+name]?.length >= 5" @click.stop="addStopProfit">
          <Icon class="text-16px" name="material-symbols:add-circle-outline-rounded" />
          <span class="ml-5px">{{ $t('addTakeProfit') }}</span>
        </button>
        <button
          class="flex-1 h-44px flex items-center justify-center clickable bg-#F6465D1A color-#F6465D border-none rd-8px disabled:op-50 disabled:cursor-not-allowed"
          type="button" :disabled="autoSellConfigs['autoSellConfig'+name]?.length >= 5" @click.stop="addStopLoss">
          <Icon class="text-16px" name="material-symbols:add-circle-outline-rounded" />
          <span class="ml-5px">{{ $t('addStopLoss') }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  autoSellConfigs: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
  }
})
const { t } = useI18n()
const botSettingStore = useBotSettingStore()
watch(
  () => props.autoSellConfigs['isAutoSellConfig'+props.name],
  (val) => {
    if(val){
      ['','1','2','3','4','5','6'].forEach((item) => {
        if(item!==props.name){
          if((props.autoSellConfigs as any)?.['isAutoSellConfig'+item]!==undefined){
            (props.autoSellConfigs as any)['isAutoSellConfig'+item] = false
          }
          // (botSettingStore.autoSellConfigs as any)['isAutoSellConfig'+item] = false
        }
      })
      console.log('botSettingStore.autoSellConfigs.autoSellConfigName',JSON.stringify(props.name))
      props.autoSellConfigs.autoSellConfigName = props.name||''
    }
  }
)

const tooltipText=computed(()=>{
  const texts={
    '':t('takeProfitAndStopLossTips'),
    '1':t('takeProfitAndStopLossTips1'),
    '2':t('takeProfitAndStopLossTips2'),
    '3':t('takeProfitAndStopLossTips3'),
    '4':t('takeProfitAndStopLossTips4'),
    '5':t('takeProfitAndStopLossTips5'),
    '6':t('takeProfitAndStopLossTips6'),
  }
  if(typeof props.name ==='string' && props.name in texts){
    return texts[props.name as keyof typeof texts]
  }else{
    return texts['']
  }
})


function addStopProfit() {
  props.autoSellConfigs?.['autoSellConfig'+props.name].push({
    open: true,
    priceChange: undefined,
    sellRatio: undefined,
    type: 'default',
    isUp: true,
  })
}

function addStopLoss() {
  props.autoSellConfigs?.['autoSellConfig'+props.name].push({
    open: true,
    priceChange: undefined,
    sellRatio: undefined,
    type: 'default',
    isUp: false,
  })
}
</script>

<style lang="scss" scoped>
.input-number-limit {
  width: auto;
  flex: 1;

  :deep(.el-input) {
    height: 36px;
    --el-input-bg-color: var(--border);
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

.slippage-label {
  font-size: 14px;
  color: var(--secondary-text);
  text-align: left;
  display: flex;
  align-items: center;
  line-height: 1;
}
</style>