<template>
  <!-- 表格 -->
  <div class="text-12px">
    <!-- 表格内容 -->
    <UseVirtualList
      :key="height"
      :list="filterTableList"
      :options="{ itemHeight: 24, overscan: 5 }"
      style="margin-right: -12px; padding-right: 12px"
      class="scrollbar-hide"
      :height="`${height}px`"
    >
      <!-- 表格内容 -->
      <template #default="{ data: row, index }">
        <div
          class="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-15px h-24px hover:bg-[rgba(255,255,255,.02)] relative z-10 overflow-hidden cursor-pointer mt-1px first:mt-0 text-12px"
        >
            <!-- 整行渐变背景 -->
            <div
              class="absolute inset-0 pointer-events-none"
            />

            <div class="text-left min-w-0">
              <div class="color-[--d-5A5E64-l-A9B0BC]">
                <span :class="row?.isBuyerMaker ? 'color-[--up-color]': 'color-[--down-color]'">
                  {{ Number(row?.price) >0 ? formatNumber(row?.price || 0) : '--' }}
                </span>
              </div>
            </div>

            <div class="text-right text-nowrap min-w-0">
              <div class="font-medium truncate">
                <span> {{ Number(row?.price) >0 ? formatNumber(row?.size || 0) : '--' }} </span>
              </div>
            </div>

            <div class="text-right text-nowrap min-w-0">
              <div class="font-medium truncate">
                <span> {{ Number(row?.price) >0?  formatDate(row.time,'HH:mm:ss') : '--' }} </span>
              </div>
            </div>

        </div>
      </template>
    </UseVirtualList>
  </div>
</template>

<script setup lang="ts">
import { UseVirtualList } from '@vueuse/components'
import { type Trade } from '@/api/types/perp'
const props = defineProps<{
  height?: number
  list: Array<Trade>
}>()
const { t } = useI18n()
const filterTableList = computed(() => {
  return  props.list?.length > 0? props.list :  Array.from({ length: 200 }, () => ({ price: '0', size: '0', sum: '0' }));
})
</script>

<style lang="scss" scoped>
/* 响应式表格布局 */
@media (max-width: 479px) {
  .grid.grid-cols-\[minmax\(50px\,1fr\)_minmax\(100px\,3fr\)_minmax\(80px\,2fr\)_minmax\(40px\,0\.8fr\)\] {
    grid-template-columns: minmax(40px, 0.8fr) minmax(100px, 3.5fr) minmax(60px, 1.5fr) minmax(
        30px,
        0.7fr
      );
  }
}

@media (min-width: 480px) and (max-width: 767px) {
  .grid.grid-cols-\[minmax\(50px\,1fr\)_minmax\(100px\,3fr\)_minmax\(80px\,2fr\)_minmax\(40px\,0\.8fr\)\] {
    grid-template-columns: minmax(45px, 0.8fr) minmax(100px, 3.2fr) minmax(80px, 1.8fr) minmax(
        35px,
        0.7fr
      );
  }
}

@media (min-width: 768px) and (max-width: 1199px) {
  .grid.grid-cols-\[minmax\(50px\,1fr\)_minmax\(100px\,3fr\)_minmax\(80px\,2fr\)_minmax\(40px\,0\.8fr\)\] {
    grid-template-columns: minmax(50px, 1fr) minmax(100px, 3fr) minmax(80px, 2fr) minmax(
        40px,
        0.8fr
      );
  }
}

@media (min-width: 1200px) {
  .grid.grid-cols-\[minmax\(50px\,1fr\)_minmax\(100px\,3fr\)_minmax\(80px\,2fr\)_minmax\(40px\,0\.8fr\)\] {
    grid-template-columns: minmax(60px, 1.2fr) minmax(120px, 3fr) minmax(100px, 2.5fr) minmax(
        45px,
        1fr
      );
  }
}

.grid {
  transition: grid-template-columns 0.3s ease;
  contain: layout style;
  will-change: grid-template-columns;
}

.relative.overflow-hidden.cursor-pointer {
  contain: layout;
  will-change: auto;
}

.text-nowrap {
  contain: layout;
}

@media (hover: none) and (max-width: 768px) {
  .relative.overflow-hidden.cursor-pointer {
    min-height: 44px;
  }

  .text-right .flex.items-center.justify-end {
    flex-wrap: wrap;
    gap: 2px;
  }
}

@media (max-width: 479px) {
  .text-12px {
    font-size: 11px;
  }

  .gap-20px {
    gap: 8px;
  }

  .py-4px {
    padding-top: 2px;
    padding-bottom: 2px;
  }
}

@media (min-width: 480px) and (max-width: 767px) {
  .truncate.min-w-0 {
    max-width: 60px;
  }

  .w-12px.h-12px {
    width: 11px;
    height: 11px;
  }
}
</style>
