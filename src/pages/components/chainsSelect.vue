<script setup lang="ts">
import type {IGetTreasureConfig} from '~/api/market'

const props = defineProps<{
  list: IGetTreasureConfig[],
  activeChain: string
}>()
const searchKey = shallowRef('')
const searchResult = computed(() => {
  if (!searchKey.value) return props.list
  return props.list.filter(el => {
    return el.net_name.toUpperCase().includes(searchKey.value.toUpperCase())
  })
})
const configStore = useConfigStore()
const emit = defineEmits(['update:activeChain'])
const _activeChain = computed({
  get() {
    return props.activeChain
  },
  set(value: string) {
    emit('update:activeChain', value)
  }
})
</script>

<template>
  <el-select
    v-model="_activeChain"
    class="[&&]:w-120px"
  >
    <template #header>
      <el-input
        :placeholder="$t('searchChain')"
        v-model="searchKey"
      >
        <template #prefix>
          <Icon name="hugeicons:search-01"/>
        </template>
      </el-input>
    </template>
    <template #label>
      abc
    </template>
    <el-option
      v-for="(item,$index) in searchResult"
      :key="$index"
      :label="item.name"
      :value="item.chain_id"
    >
      <div class="flex items-center gap-4px">
        <template v-if="item.chain_id==='-1'">
          <Icon name="custom:chain" class="color-[--d-F5F5F5-l-333]"/>
          {{ $t('allChain') }}
        </template>
        <template v-else>
          <img
            :src="`${configStore.token_logo_url}chain/${item.net_name}.png`" alt=""
            class="rounded-full w-16px h-16px"
          >
          {{ item.name }}
        </template>
      </div>
    </el-option>
  </el-select>
</template>

<style scoped lang="scss">

</style>
