<template>
  <el-dialog
    v-model="visible"
    width="400px"
    class="dialog-box dialog-max dialog-remind dialog"
    @close="visible = false"
    append-to-body
  >
    <template #header>
      <div class="flex-start items-center">
        <span class="text-20px font-500 cursor-pointer">确定以市价平仓以下仓位吗</span>
      </div>
    </template>
    <div class="content">
      <ul>
        <li class="mb-20px" v-for="(item, $index) in position" :key="$index">
          <div>
            <span>卖</span> <span class="ml-5px"> {{ typeDict[item.contractId] }}</span>
            <span class="ml-5px">
              {{ getLeverageFromContractId(item.contractId) || item.maxLeverage }}x</span
            >
          </div>
          <div class="flex-between">
            <span>数量</span>
            {{ formatNumber(item.openSize.replace('-', '')) }}
          </div>
        </li>
      </ul>

      <el-alert
        type="warning"
        title="您的市价平仓可能会造成价格波动，请确认后继续您的交易"
        :closable="false"
        show-icon
        :style="{
          backgroundColor: '#FFA6221A',
          color: '#FFA622',
          border: 'none',
          fontSize: '12px',
        }"
      />
      <div class="text-center mt-30px flex-between">
        <el-button class="flex-1" style="height: 48px" @click.stop.prevent="visible = false">
          {{ $t('cancel') }}
        </el-button>
        <el-button class="flex-1" style="height: 48px" type="primary" @click.stop.prevent="submit">
          {{ $t('confirm') }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { usePerpStore } from '~/stores/perp'
const props = defineProps({
  modelValue: Boolean,
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
const visible = computed({
  get: () => props.modelValue ?? false,
  set: (val) => emit('update:modelValue', val),
})
const { position, metadata } = storeToRefs(usePerpStore())
const { t } = useI18n()
const typeDict = computed(() => {
  const contractMap =
    metadata.value?.contractList?.reduce?.(
      (prev, cur) => {
        prev[cur.contractId] = cur.contractName
        return prev
      },
      {} as Record<string, string>
    ) || {}
  contractMap.ALL = t('all')
  return contractMap
})
function submit() {
    
 }
</script>

<style lang="scss" scoped></style>
