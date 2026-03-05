<script setup lang="ts">
import type { IGetTreasureConfig } from '~/api/market'
import SuffixIcon from '~/components/suffixIcon.vue'

const props = defineProps<{
  list: IGetTreasureConfig[]
  activeChain: string
}>()
const searchKey = shallowRef('')
const quickOptions = computed(() => {
  const chainList = ['solana','bsc','xlayer']
  if(!chainList.includes(_activeChain.value) && _activeChain.value !== 'AllChains'){
    chainList.push(_activeChain.value)
  }
  return chainList.map(el=>{
    return props.list.find(item=>item.net_name===el) || {net_name:el}
  })
})
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
    :persistent="false"
    class="[&&]:[--el-select-width:auto] shrink-0"
  >
    <template #header>
      <el-input
        v-model="searchKey"
        :placeholder="$t('searchChain')"
        
      >
        <template #prefix>
          <Icon name="hugeicons:search-01" />
        </template>
      </el-input>
    </template>
    <template #prefix>
      <div class="flex items-center gap-4px" @click.stop>
        <div class="px-2px rounded-4px text-12px color-[--main-text] lh-16px" :class="_activeChain === 'AllChains' ? 'bg-[--tab-active-bg]' : ''" @click="_activeChain='AllChains'">
          {{ $t('all') }}
        </div>
        <div v-for="item in quickOptions" :key="item.net_name" v-tooltip="item.name||item.net_name"
        class="flex items-center p-2px rounded-4px" :class="item.net_name === _activeChain ? 'bg-[--tab-active-bg]' : ''" @click="_activeChain=item.net_name">
          <img
            :src="`${configStore.token_logo_url}chain/${item.net_name}.png`"
            alt=""
            class="rounded-full w-16px h-16px"
          >
        </div>
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
