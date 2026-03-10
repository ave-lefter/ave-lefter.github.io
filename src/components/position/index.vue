<template>
  <div class="w-monitor bg-[--secondary-bg] w-100% h-100% pl-12px pr-12px relative overflow-hidden"
    :class="{ 'pr-10px!': isLeftFixed, 'pl-10px!': isRightFixed }">
    <!-- <div class="w-100% h-40px absolute pointer-events-auto z-999 drag-handle left-0"/> -->
    <Icon name="custom:drag2" class="absolute top-3px left-50% ml--6px text-6px bg-[--dialog-list-hover] drag-handle" />
    <div
      class="flex items-center py-15.5px pr-6px justify-between mb-0px border-b-solid border-b-1px border-b-[--main-divider] cursor-move drag-handle">
      <span class="color-[--main-text] text-14px">{{ $t('holding') }}</span>
      <div class="flex items-center gap-12px">
        <Icon name="custom:close" class="text-14px shrink-0 cursor-pointer color-[--main-text]"
          @click.self="positionStore.visible = false" />
      </div>
    </div>
    <template v-if="botStore.evmAddress || walletStore.address">
      <PositionsTable :height="scrollHeight" class="ml--10px pr-6px mr--6px"/>
    </template>
    <AveEmpty
      v-else
      :style="{height:`${props.scrollHeight-50}px`}"
      class="overflow-hidden"
    >
      <span class="text-12px mt-10px">{{ $t('noWalletTip') }}</span>
      <el-button
        class="mt-10px"
        @click="botStore.$patch({
        connectVisible: true
      })"
      >
        {{ $t('connectWallet') }}
      </el-button>
    </AveEmpty>
  </div>
</template>

<script setup lang="ts">
import PositionsTable from '@/pages/token/components/left/positionsTable.vue'
const { t } = useI18n()
const botStore = useBotStore()
const walletStore = useWalletStore()
const { isLeftFixed, isRightFixed } = storeToRefs(usePositionStore())

const props = defineProps({
  scrollHeight: {
    type: Number,
    default: 0
  },
  isLarge: {
    type: Boolean,
    default: false
  }
})

const positionStore = usePositionStore()

</script>

<style scoped lang="scss">

</style>
