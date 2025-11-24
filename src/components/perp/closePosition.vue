<script setup lang="ts">
const props = defineProps<{
  row: any
  token?: string
}>()
const themeStore = useThemeStore()
const visible = defineModel<boolean>('visible')
const { t } = useI18n()
const formData = ref({})
const closePercent = ref(0)
const isLimit = computed(() => {
  return props.row.operation === 'limit'
})
const title = computed(() => {
  return isLimit.value ? t('limitClose') : t('marketClose')
})
</script>

<template>
  <el-dialog append-to-body v-model="visible" :title="title" width="450px">
    <div class="flex items-center font-bold h-21px mb-16px">
      {{ props.token }} · {{ t('all2')
      }}<span class="ml-4px font-normal" :class="getColorClass(props.row.openValue)">
        {{ props.row.openValue > 0 ? t('long') : t('short') }} · {{ props.row.maxLeverage }}x
      </span>
    </div>
    <div class="flex items-center justify-between mb-16px">
      <span class="color-[--third-text]">{{ t('latestPrice') }}</span>
      <span class="color-[--main-text]"
        >{{
          formatNumber(props.row.oraclePrice, {
            limit: 20,
            decimals: 2,
          })
        }}
        USD</span
      >
    </div>
    <template v-if="isLimit">
      <div class="color-[--third-text] mb-8px">
        {{ t('closePrice') }}
      </div>
      <el-input v-model="formData.closePrice" class="mb-16px">
        <template #suffix>
          <span class="color-[--third-text] mx-4px">|</span>
          <span class="color-[--up-color]">{{ t('midPrice') }}</span>
        </template>
      </el-input>
    </template>
    <div class="color-[--third-text] justify-between mb-8px">
      {{ t('closeSize') }}
    </div>
    <el-input v-model="formData.closeSize" class="mb-12px" />
    <el-slider
      v-model="closePercent"
      :min="0"
      :max="200"
      :step="1"
      :marks="{
        0: '0%',
        50: '50%',
        100: '100%',
        150: '150%',
        200: '200%',
      }"
      class="[&&]:[--el-slider-button-size:8px] [--el-color-white:--icon-color] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] [--el-border-color-light:var(--dialog-divider)] [&&]:[--el-slider-main-bg-color:--white] ml-4px [&&]:w-406px"
    />
    <div class="color-[--third-text] flex justify-between mt-38px mb-8px">
      {{ t('profit1') }}
      <span>- 0.98 USD</span>
    </div>
    <div class="flex mt-20px text-16px">
      <el-button class="h-48px flex-1 m-l-auto" :color="themeStore.isDark ? '#333' : '#F2F2F2'">
        {{ $t('reset') }}
      </el-button>
      <el-button type="primary" class="h-48px flex-1 m-l-auto">
        {{ $t('confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>
