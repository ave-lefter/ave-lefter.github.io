<template>
  <div class="">
    <div class="px-16px py-16px">
      <el-input
        ref="inputSearch"
        v-model.trim="query"
        class="search-input px-20px"
        placeholder="搜索币对"
        clearable
        autofocus
        size="large"
      >
        <template #prefix>
          <Icon class="text-12px text-[--third-text]" name="custom:search" />
        </template>
        <template #suffix>
          <Icon
            v-if="query"
            name="pajamas:clear"
            class="color-[--third-text] text-12px hover:opacity-70% cursor-pointer mr-10px"
            @click="query = ''"
          />
        </template>
      </el-input>
    </div>

    <SearchTable :tokens="filteredList || []" :loading="loading" @sortChange="sortChange" @close="emit('close')"/>
  </div>
</template>

<script lang="ts" setup>
import SearchTable from './searchTable.vue'
import type { PerpInfo } from '@/api/types/perp'
import { getPerpMetadata as _getPerpMetadata } from '@/api/perp'

const props = defineProps({
  list: {
    type: Array as () => PerpInfo[],
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['close'])
const query = ref('')
const sortBy = ref<string>('')
type SortValue = 0 | -1 | 1
const activeSort = shallowRef<SortValue>(0)

const filteredList = computed(() => {
  const result = props.list?.slice(0) || []
  let arr = result?.filter(i=> Number(i.lastPrice) > 0 && Number(i.value) > 0 && Number(i.openInterest) > 0 && i.enableDisplay == true )
  if (!query.value) {
    arr = arr
  } else {
    arr = arr.filter(
      (item) =>
        item.contractName.toLowerCase().includes(query.value.toLowerCase()) ||
        item.baseCoinIcon.toLowerCase().includes(query.value.toLowerCase()) ||
        item.quoteCoinIcon.toLowerCase().includes(query.value.toLowerCase())
    )
  }
  if (activeSort.value === 0 || sortBy.value === '') {
    return arr
  } else {
    return arr?.sort(
      (a, b) => ((b[sortBy.value] || 0) - (a[sortBy.value] || 0)) * activeSort.value
    )
  }
})

function sortChange({ prop, order }: { prop: string; order: 0 | -1 | 1 }) {
  console.log('sortChange', prop, order)
  sortBy.value = prop
  activeSort.value = order
}
</script>

<style lang="scss" scoped>
.search-input {
  background: var(--border);
  padding: 0;
  border-radius: 4px;
  :deep().el-input__wrapper {
    border-bottom: 1px solid var(--border);
    .el-input__inner::placeholder {
      color: var(--third-text);
    }
  }
}
</style>
