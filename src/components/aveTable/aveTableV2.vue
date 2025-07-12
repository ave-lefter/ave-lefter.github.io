<script setup lang="ts">
import type { ElTableV2, TableV2Instance, TableV2Props } from 'element-plus'
import { useElementSize } from '@vueuse/core'
import type { Column } from 'element-plus/es/components/table-v2/index.mjs'

const { t } = useI18n()
defineProps<
  Partial<TableV2Props> & {
    showEmptyText?: boolean
    emptyText?: string
    loading: boolean
  }
>()

const slots = useSlots()
const attrs = useAttrs()
const themeStore = useThemeStore()
const tableRef = useTemplateRef<TableV2Instance>('tableRef')
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
})
const { width: elTableWidth } = useElementSize(tableRef)

// 只收集 el-table-v2 的官方默认插槽
const TABLE_V2_DEFAULT_SLOTS = ['empty', 'footer', 'overlay', 'row', 'cell', 'header-cell']

const defaultSlots = computed(() => {
  const s: Record<string, any> = {}
  for (const key of TABLE_V2_DEFAULT_SLOTS) {
    if (slots[key]) s[key] = slots[key]
  }
  return s
})

// 处理 columns，注入 cellRenderer/headerCellRenderer
const computedColumns = computed(() => {
  const defaultSlots = slots.default?.()
  if (defaultSlots) {
    const columns = defaultSlots.map((el) => {
      const { props, children } = el
      return {
        ...(props || {}),
        cellRenderer:
          typeof children?.default === 'function'
            ? ({ rowData, column, rowIndex, columnIndex }: any) =>
                children.default({ row: rowData, column, rowIndex, columnIndex })
            : null,
        headerCellRenderer:
          typeof children?.header === 'function'
            ? ({ column }: any) => children.header({ column })
            : null,
      }
    })
    const columnsWidthArr = calculateColumnWidths(columns)
    return columns.map((el, idx) => {
      return {
        ...el,
        width: columnsWidthArr[idx],
      }
    })
  }
  return []
})

function calculateColumnWidths(columns: Omit<Column, 'width'>[]) {
  const totalMinWidth = columns.reduce((sum, col) => sum + col.minWidth, 0)

  if (totalMinWidth >= elTableWidth.value) {
    return columns.map((col) => col.minWidth)
  }

  const remainingWidth = elTableWidth.value - 6 - totalMinWidth
  const averageWidth = remainingWidth / columns.length

  return columns.map((col) => col.minWidth + averageWidth)
}
</script>

<template>
  <el-auto-resizer>
    <template #default="{ height, width }">
      <!-- 透传所有 $attrs，支持 el-table-v2 的其它属性 -->
      <ElTableV2
        ref="tableRef"
        class="el-table"
        style="--el-table-border: 0; --el-bg-color: transparent; font-size: 12px"
        header-class="bg-[--d-222-l-F2F2F2]"
        :header-height="32"
        :columns="computedColumns"
        :data="data"
        :height="height"
        :width="width"
        :footer-height="footerHeight"
        v-bind="attrs"
        :fixed="fixed"
      >
        <template v-for="(slotFn, slotName) in defaultSlots" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps" />
        </template>
        <!--如果没有自定义空样式则使用默认值-->
        <template v-if="!defaultSlots.empty" #empty>
          <div v-if="!loading" class="h-full flex flex-col items-center justify-center pt-100px">
            <img v-if="themeStore.theme === 'light'" src="@/assets/images/empty-white.svg" alt="" >
            <img v-else src="@/assets/images/empty-black.svg" alt="" >
            <span v-if="showEmptyText" class="mt-10px">
              {{ emptyText || t('emptyNoData') }}
            </span>
          </div>
          <span v-else />
        </template>
      </ElTableV2>
    </template>
  </el-auto-resizer>
</template>

<style scoped></style>
