<script lang="ts" setup>
import type { IGetTreasureConfig } from '~/api/market'

const props = defineProps<{
    ammList: IGetTreasureConfig['swaps']
    setFilterForm(...args: [string, string][]): void
}>()

const {t} = useI18n()
const ammOptions = computed(()=>{
    return [
        {
            chain:'',
            name:'',
            swap_url:'',
            show_name:t('allDex'),
        }
    ].concat(props.ammList)
})
const globalStore = useGlobalStore()
const setupFilter = globalStore.rankConditions[globalStore.rankActiveTab]?.filter
const isFilterHighlight = ref(!!setupFilter.amm)
const popoverVisible = ref(false)
const searchKey = ref('')
const filteredAmmList = computed(()=>{
    return ammOptions.value.filter((el)=>{
        return el.show_name && el.show_name.includes(searchKey.value)
    })
})
</script>

<template>
  <div class="flex items-center gap-2px">
    DEX
    <el-popover v-model:visible="popoverVisible" trigger="click" :width="250" popper-class="[&&]:[--el-popover-padding:0]">
        <template #reference>
            <Icon name="custom:filter" class="text-10px cursor-pointer"  :class="isFilterHighlight ? 'color-[--secondary-text]' : ''"/>
        </template>
        <template #default>
            <div class="py-10px px-12px">
                <el-input
                    v-model="searchKey"
                    class="[--el-border-color:transparent]"
                    :placeholder="$t('search')"
                    clearable
                >
                    <template #prefix>
                    <Icon name="hugeicons:search-01" />
                    </template>
                </el-input>
            </div>
            <el-scrollbar v-if="filteredAmmList.length > 0" :height="300">
                <ul>
                    <li v-for="item in filteredAmmList" :key="item.name" class="flex items-center px-12px h-34px gap-4px cursor-pointer hover:bg-[--border]" :class="setupFilter.amm===item.name ? 'color-[--primary-color]':''" @click="setFilterForm(['amm',item.name]);popoverVisible = false;isFilterHighlight=!!item.name;">
                        <img v-if="item.chain" class="w-16px h-16px rounded-full" :src="`${globalStore.token_logo_url}swap/${item.name}.jpeg`" alt="">
                        <Icon v-else name="custom:switch" class="text-16px"/>
                        <span>{{ item.show_name }}</span>
                    </li>
                </ul>
                </el-scrollbar>
        </template>
    </el-popover>
  </div>
</template>

<style scoped>

</style>