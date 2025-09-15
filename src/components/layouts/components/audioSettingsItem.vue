<script setup lang="ts">
import SuffixIcon from '~/components/suffixIcon.vue'

const globalStore = useGlobalStore()
defineProps<{
    title: string
    itemKey: keyof typeof globalStore.audioSettings.audio
}>()
</script>

<template>
    <div class="flex justify-between items-center text-12px mb-24px">
        {{ title }}
        <div class="flex items-center w-180px rounded-4px bg-[--dialog-divider] px-8px">
            <Icon
:name="globalStore.audioSettings.audio[itemKey] ? 'custom:audio-on' : 'custom:audio-off'"
                class="text-16px shrink-0 color-[--secondary-text]" />
            <el-select
v-model="globalStore.audioSettings.audio[itemKey]" class="new-select"
                popper-class="[--el-font-size-base:12px] new-select-popper" :suffix-icon="SuffixIcon"
                :empty-values="[null, undefined]">
                <el-option v-for="item in audioList" :key="item" :label="item ? item : $t('close')" :value="item" />
            </el-select>
            <div class="w-1px h-8px bg-[--icon-color] mx-4px shrink-0" />
            <Icon
name="custom:play-circle-line"
                class="text-16px shrink-0 color-[--secondary-text] cursor-pointer" />
        </div>
    </div>
</template>