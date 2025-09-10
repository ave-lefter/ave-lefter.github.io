<script setup lang="ts">
import type { IGetTreasureConfig } from '~/api/market'
import SuffixIcon from '~/components/suffixIcon.vue'

const props = defineProps<{
  list: IGetTreasureConfig[]
  activeChain: string
}>()
const searchKey = shallowRef('')
const searchResult = computed(() => {
  if (!searchKey.value) return props.list
  return props.list.filter((el) => {
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
  },
})
const currentChain = computed(() => {
  return (
    props.list.find((el) => el.net_name === props.activeChain) || {
      chain_id: '-1',
      net_name: 'AllChains',
      name: '',
    }
  )
})
</script>

<template>
  <el-select
    v-model="_activeChain"
    :suffix-icon="SuffixIcon"
    class="[&&]:w-120px shrink-0"
  >
    <template #header>
      <el-input
        v-model="searchKey"
        :placeholder="$t('searchChain')"
        clearable
      >
        <template #prefix>
          <Icon name="hugeicons:search-01" />
        </template>
      </el-input>
    </template>
    <template #label>
      <div class="flex items-center gap-4px">
        <template v-if="currentChain.chain_id === '-1'">
          <Icon name="custom:chain" class="color-[--main-text]" />
          {{ $t('allChain') }}
        </template>
        <template v-else>
          <img
            :src="`${configStore.token_logo_url}chain/${currentChain.net_name}.png`"
            alt=""
            class="rounded-full w-16px h-16px"
          >
          {{ currentChain.name }}
        </template>
      </div>
    </template>
    <el-option
      v-for="(item, $index) in searchResult"
      :key="$index"
      :label="item.net_name"
      :value="item.net_name"
    >
      <div class="flex items-center gap-4px">
        <template v-if="item.chain_id === '-1'">
          <Icon name="custom:chain" class="color-[--main-text]" />
          {{ $t('allChain') }}
        </template>
        <template v-else>
          <img
            :src="`${configStore.token_logo_url}chain/${item.net_name}.png`"
            alt=""
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
