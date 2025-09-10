<script lang="ts" setup>
import type { IGetTreasureConfig } from '~/api/market'

const props = defineProps<{
    ammList: IGetTreasureConfig['swaps']
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
const activeAmm = ref('')
const searchKey = ref('')
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
            <el-scrollbar :height="300"/>
        </template>
    </el-popover>
  </div>
</template>

<style scoped>

</style>