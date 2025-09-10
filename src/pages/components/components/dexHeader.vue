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
            name:t('allDex'),
            swap_url:'',
            show_name:t('allDex'),
        }
    ].concat(props.ammList)
})
const globalStore = useGlobalStore()
const setupFilter = globalStore.rankConditions[globalStore.rankActiveTab]?.filter
const isFilterHighlight = ref(!!setupFilter.amm)
const searchKey = ref('')
const filteredAmmList = computed(()=>{
    return ammOptions.value.filter((el)=>{
        return el.name.includes(searchKey.value)
    })
})
</script>

<template>
  <div class="flex items-center gap-2px">
    DEX
    <el-popover trigger="click" :width="250">
        <template #reference>
            <Icon name="custom:filter" class="text-10px cursor-pointer"/>
        </template>
        <template #default>
            <el-input
                v-model="searchKey"
                class="[--el-border-color:transparent] mb-10px"
                :placeholder="$t('search')"
                clearable
            >
                <template #prefix>
                <Icon name="hugeicons:search-01" />
                </template>
            </el-input>
            <el-scrollbar v-if="filteredAmmList.length > 0" :height="300">
                <ul>
                    <li v-for="item in filteredAmmList" :key="item.name">
                        <div class="flex items-center gap-2px">
                            <div class="w-10px h-10px rounded-full" :style="{background:item.chain}"/>
                            <span>{{ item.show_name }}</span>
                        </div>
                    </li>
                </ul>
                </el-scrollbar>
        </template>
    </el-popover>
  </div>
</template>

<style scoped>

</style>