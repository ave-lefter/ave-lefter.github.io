<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import GridInfo from './gridInfo.vue'
import Overview from '~/pages/token/components/right/overview.vue'
const Mode = {
    grid:'grid',
    list:'list'
}
const mode = useStorage('tokenPageMode',Mode.grid)
const modeList = [
    {icon:'custom:qrcode',value:Mode.grid,class:'mr-2px'},
    {icon:'custom:bread',value:Mode.list,class:'text-12px'}
]
</script>
<template>
  <div class="w-334px borer-left-solid border-left-1px border-left-[--d-1A1A1A-l-F2F2F2] p-12px">
    <div class="flex items-center justify-between text-16px font-500 color-[--d-8CA0C3-l-566275] pb-12px border-b-solid border-b-1px border-b-[--d-151A22-l-E8F1FF]">
        {{$t('tokenInfo')}}
        <div class="flex items-stretch justify-center bg-[--d-151A22-l-E8F1FF] p-2px rounded-4px">
            <div v-for="item in modeList" :key="item.value" class="flex items-center justify-center p-3px  rounded-2px" :class="{'bg-[--d-0B0D12-l-FFF] color-[--d-FFF-l-111]':mode === item.value,[item.class]:true}" @click="mode = item.value">
                <Icon :name="item.icon"/>
            </div>
        </div>
    </div>
    <GridInfo v-if="mode === Mode.grid"/>
    <Overview v-if="mode === Mode.list" isRank/>
  </div>
</template>