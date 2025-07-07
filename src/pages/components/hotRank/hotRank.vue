<script setup lang="ts">
import {useStorage} from '@vueuse/core'
import {getDefaultColumns} from './columnRender/hotColumusService'

const {t} = useI18n()
const conditions = ref({
  sort: '',
  sort_dir: ''
})
const listData = shallowRef([])
const pageInfo = shallowRef({
  pageNO: 1,
  pgeSize: 100
})
const loading = shallowRef(false)
const columns = useStorage('hotUserTableColumns', getDefaultColumns(t))
const renderData = computed(() => {
  return {}
})

function tableRowClick(row) {
  navigateTo(`/token/${row.target_token}-${row.chain}`)
}

function handleSortChange() {

}
</script>

<template>
  <el-table
    fit stripe
    :default-sort="{
      prop: conditions.sort,
      order: conditions.sort_dir ? conditions.sort_dir + 'ending' : null
    }"
    @row-click="tableRowClick"
    @handleSortChange="handleSortChange"
  >
    <template #empty>
      <AveEmpty v-if="!loading&&listData.length===0"/>
      <span v-else/>
    </template>
    <template v-for="item in columns" :key="item.field">
      <component :is="renderData[item.render]" v-if="item.isHide"/>
    </template>
  </el-table>
</template>

<style scoped lang="scss">

</style>
