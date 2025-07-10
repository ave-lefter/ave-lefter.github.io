<template>
  <div 
    v-for="(column, idx) in data"
    :key="column.prop || idx"
    :class="column?.customClassName ? (typeof column?.customClassName === 'function' ? column?.customClassName(props.row) : column?.customClassName) : ''"
  >
    <span
      v-if="column?.prefix"
      class="prefix"
    >{{ typeof column?.prefix === 'function' ? column?.prefix(props.row) : column?.prefix }}</span>
    <slot
      v-if="slots.default && (props.customKeys.indexOf(column.prop) > -1)"
      :row="props.row"
    />
    <template v-else>
      <span v-if="props.row[column?.prop] === '--'">--</span>
      <span v-else-if="props.row[column?.prop] === 0">0</span>
      <span v-else-if="column?.customFormatter">{{ typeof column?.customFormatter === 'function' ? column?.customFormatter(props.row) : column?.customFormatter }}</span>
      <span v-else>{{ props.row[column?.prop] }}</span>
    </template>
    <span
      v-if="column?.suffix"
      class="suffix"
    >{{ typeof column?.suffix === 'function' ? column?.suffix(props.row) : column?.suffix }}</span>
  </div>
</template>

<script setup lang="ts">
import type { TableColumnCtx } from 'element-plus'

type customType = string | ((row: any) => string )
export interface IColumn extends TableColumnCtx<any> {
  //单元格是否展示多个值
  multiple?: false | [{prop: string, prefix?: customType, suffix?: customType,customClassName?: customType,customStyle?: customType,customFormatter?: (row: any) => string|number|null}],
  prefix?: customType,
  suffix?: customType,
  customClassName?: customType,
  customStyle?: customType,
  customFormatter?: (row: any) => string|number|null
}
interface Props {
  col: any,
  row: any,
  customKeys?: string[]
}
const props = withDefaults(defineProps<Props>(), {
  customKeys: () => []
})
const data=ref(props.col.multiple||[props.col])

const slots = useSlots()
</script>

<style scoped>

</style>

