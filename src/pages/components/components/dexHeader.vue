<script lang="ts" setup>
import type { IGetTreasureConfig } from '~/api/market'
import type { ElScrollbar } from 'element-plus'

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
const amm = ref(setupFilter.amm)
const isFilterHighlight = ref(!!setupFilter.amm)
const popoverVisible = ref(false)
const searchKey = ref('')
const filteredAmmList = computed(()=>{
    return ammOptions.value.filter((el)=>{
        return el.show_name && el.show_name.toLowerCase().includes(searchKey.value.toLowerCase())
    })
})
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

function confirm(newAmm:string){
    if(!newAmm){
        amm.value = ''
    }
    props.setFilterForm(['amm',amm.value])
    popoverVisible.value = false
    isFilterHighlight.value = !!amm.value
}

watch(popoverVisible,()=>{
    if(popoverVisible.value && amm.value){
        // 将 scrollbar 滚动到选中的 amm 位置
        const index = filteredAmmList.value.findIndex((el)=>el.name===amm.value)
        if(index!==-1){
            queueMicrotask(()=>{
                scrollbarRef.value?.setScrollTop?.(index*34)
            })
        }
    }
})
</script>

<template>
  <div class="flex items-center gap-2px">
    DEX
    <el-popover v-model:visible="popoverVisible" trigger="click" :width="250" popper-class="[&&]:[--el-popover-padding:0]">
        <template #reference>
            <Icon name="custom:filter" class="text-10px cursor-pointer"  :class="isFilterHighlight ? 'color-[--primary-color]' : ''"/>
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
            <el-scrollbar ref="scrollbarRef" v-if="filteredAmmList.length > 0" :height="300">
                <ul>
                    <li v-for="item in filteredAmmList" :key="item.name" class="flex items-center justify-between px-12px h-34px gap-4px cursor-pointer hover:bg-[--border]" :class="amm===item.name ? 'bg-[--border]':''" @click="amm=item.name">
                       <div class="flex items-center gap-4px">
                            <img v-if="item.chain" class="w-16px h-16px rounded-full" :src="`${globalStore.token_logo_url}swap/${item.name}.jpeg`" alt="">
                            <Icon v-else name="custom:switch" class="text-16px"/>
                            <span>{{ item.show_name }}</span>
                       </div>
                        <Icon v-if="amm===item.name" name="custom:select" class="color-[--main-text]"/>
                    </li>
                </ul>
                </el-scrollbar>
                <div class="my-10px flex px-12px">
                    <el-button
                    class="h-30px flex-1 m-l-auto"
                    @click="confirm('')"
                    >
                    {{ $t('reset') }}
                    </el-button>
                    <el-button type="primary" class="h-30px flex-1 m-l-auto" @click="confirm(amm)">
                    {{ $t('confirm') }}
                    </el-button>
      </div>
        </template>
    </el-popover>
  </div>
</template>

<style scoped>

</style>