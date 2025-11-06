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

    <SearchTable :tokens="contractList || []" :loading="loadingPerpMetadata" />
  </div>
</template>

<script lang="ts" setup>
import SearchTable from './searchTable'
import { usePerpStore } from '@/stores/perp'

const query = ref('')
const { metadata, loadingPerpMetadata } = storeToRefs(usePerpStore())


const contractList = computed(() => {
  return metadata.value.contractList || []
})


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
