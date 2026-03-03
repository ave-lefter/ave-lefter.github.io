<script setup lang="ts">
import type {TableV2Instance} from 'element-plus'
import {useElementSize} from '@vueuse/core'

const {t} = useI18n()
const props = withDefaults(defineProps<{
  columns:any[],
  data:any[],
  showEmptyText?:boolean,
  emptyText?:string,
  showFooter?:boolean,
  footText?:string,
  rowHeight?:number,
  headerHeight?:number,
  headerClass?:string,
  footerHeight?:number,
  loading?:boolean,
  fixed?:boolean,
  rowKey?:string,
  rowClass?:string | any,
}>(),{
  showFooter:false,
  footText:'',
  rowHeight:50,
  headerHeight:32,
  headerClass:'',
  footerHeight:0,
  rowKey:'id',
  rowClass:'',
  emptyText:''
})
const emits = defineEmits<{
  (e: 'endReached', value: number): void
}>()
const slots = useSlots()
const attrs = useAttrs()
const themeStore = useThemeStore()
const tableRef = useTemplateRef<TableV2Instance>('tableRef')
const _currentScrollTop = ref(0)
function onTableScroll({scrollTop}: {scrollTop: number}) {
  _currentScrollTop.value = scrollTop
}
defineExpose({
  scrollTo: (...args: Parameters<TableV2Instance['scrollTo']>) => {
    tableRef.value?.scrollTo?.(...args)
  },
  scrollToLeft: (...args: Parameters<TableV2Instance['scrollToLeft']>) => {
    tableRef.value?.scrollToLeft?.(...args)
  },
  scrollToTop: (...args: Parameters<TableV2Instance['scrollToTop']>) => {
    tableRef.value?.scrollToTop?.(...args)
  },
  scrollToRow: (...args: Parameters<TableV2Instance['scrollToRow']>) => {
    tableRef.value?.scrollToRow?.(...args)
  },
  getScrollTop: () => _currentScrollTop.value,
  scrollBy: (delta: number) => {
    const next = Math.max(0, _currentScrollTop.value + delta)
    tableRef.value?.scrollToTop?.(next)
  }
})
const {width: elTableWidth} = useElementSize(tableRef)

// 只收集 el-table-v2 的官方默认插槽
const TABLE_V2_DEFAULT_SLOTS = [
  'empty',
  'footer',
  'overlay',
  'row',
  'cell',
  'header-cell',
]

const defaultSlots = computed(() => {
  const s: Record<string, any> = {}
  for (const key of TABLE_V2_DEFAULT_SLOTS) {
    if (slots[key]) s[key] = slots[key]
  }
  return s
})

// 处理 columns，注入 cellRenderer/headerCellRenderer
const computedColumns = computed(() => {
  const columnsWidthArr = calculateColumnWidths()
  return props.columns.map((col: any, index) => {
    // 支持 key 或 dataKey
    const cellSlot = slots[`cell-${col.key}`] || slots[`cell-${col.dataKey}`]
    const headerSlot = slots[`header-${col.key}`] || slots[`header-${col.dataKey}`]
    return {
      ...col,
      cellRenderer: cellSlot
        ? ({rowData, column, rowIndex, columnIndex}: any) =>
          cellSlot({row: rowData, column, rowIndex, columnIndex})
        : col.cellRenderer,
      headerCellRenderer: headerSlot
        ? ({column}: any) => headerSlot({column})
        : col.headerCellRenderer,
      width: columnsWidthArr[index]
    }
  })
})

function calculateColumnWidths() {
  const totalMinWidth = props.columns.reduce((sum, col) => sum + col.minWidth, 0)

  if (totalMinWidth >= elTableWidth.value) {
    return props.columns.map(col => col.minWidth)
  }

  const remainingWidth = elTableWidth.value - 6 - totalMinWidth
  const averageWidth = remainingWidth / props.columns.length

  return props.columns.map(col => col.minWidth + averageWidth)
}
</script>

<template>
  <el-auto-resizer>
    <template #default="{ height, width }">
      <!-- 透传所有 $attrs，支持 el-table-v2 的其它属性 -->
      <ElTableV2
        ref="tableRef"
        :rowKey="rowKey"
        class="el-table"
        style="--el-table-border:0;--el-bg-color:transparent;font-size: 12px;"
        :header-class="`bg-[--main-list-header-bg] ${headerClass}`"
        :header-height="headerHeight"
        :columns="computedColumns"
        :data="data"
        :height="height"
        :width="width"
        :footer-height="footerHeight"
        v-bind="attrs"
        :fixed="fixed"
        :row-height='rowHeight'
        :row-class="rowClass"
        @end-reached="remainDistance=> emits('endReached', remainDistance)"
        @scroll="onTableScroll"
      >
        <template v-for="(slotFn, slotName) in defaultSlots" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps"/>
        </template>
        <!--如果没有自定义空样式则使用默认值-->
        <template v-if="!defaultSlots.empty" #empty>
          <div v-if="!loading" class="h-full flex flex-col items-center justify-center pt-100px">
            <img v-if="themeStore.theme==='light'" src="@/assets/images/empty-white.svg" alt="">
            <img v-else src="@/assets/images/empty-black.svg" alt="">
            <span
              v-if="showEmptyText"
              class="mt-10px"
            >
              {{ emptyText || t('emptyNoData') }}
            </span>
          </div>
          <span v-else/>
        </template>
        <template v-if="data.length >0 && showFooter" #footer>
          <div class="text-center px-0 pt-15px pb-10px text-12px text-[--third-text] absolute w-100%" :class="`top-${rowHeight}px`">
              {{ footText || t('loading') }}
          </div>
        </template>
      </ElTableV2>
    </template>
  </el-auto-resizer>
</template>

<style scoped lang="scss">
:deep() .el-table-v2__footer{
  overflow: visible;
}
</style>
