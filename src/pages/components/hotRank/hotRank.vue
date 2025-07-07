<script setup lang="ts">
import {useStorage} from '@vueuse/core'
import {getDefaultColumns} from './columnRender/hotColumusService'
import {getTreasureList} from '~/api/market'

const {t} = useI18n()
const conditions = ref({
  sort: '',
  sort_dir: ''
})
const listData = shallowRef([])
const pageInfo = ref({
  pageNO: 1,
  pageSize: 100,
  total: 0
})
const loading = shallowRef(false)
const columns = useStorage('hotUserTableColumns', getDefaultColumns(t))
const renderData = computed(() => {
  return {}
})

function tableRowClick(row) {
  navigateTo(`/token/${row.target_token}-${row.chain}`)
}

onMounted(() => {
  _getTreasureList()
})

async function _getTreasureList() {
  try {
    loading.value = true
    const {total: _, ...rest} = pageInfo.value
    const res = await getTreasureList({
      category: 'hot',
      ...rest
    })
    pageInfo.value.total = res.total
    listData.value = res.data || []
  } finally {
    loading.value = false
  }
}

function handleSortChange() {

}
</script>

<template>
  <el-table
    :data="listData"
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
  <el-pagination
    v-model:current-page="pageInfo.pageNO"
    v-model:page-size="pageInfo.pageSize"
    class="mt-5px flex justify-center"
    layout="total, prev, pager, next"
    :total="pageInfo.total || 0"
    :small="false"
    :page-sizes="[20, 50, 100, 200, 300, 400]"
    @size-change="pageInfo.pageNO=1;_getTreasureList()"
    @current-change="_getTreasureList"
  />
</template>

<style scoped lang="scss">

</style>
