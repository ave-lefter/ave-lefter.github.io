<script setup lang="ts">
const globalStore = useGlobalStore()
const dialogVisible = computed({
    get() {
        return !!globalStore.audioSettings.active
    },
    set(value: boolean) {
        if (!value) {
            globalStore.audioSettings.active = ''
        }
    }
})
const isNotice = computed(() => {
    return globalStore.audioSettings.active === 'notice'
})
</script>

<template>
    <el-dialog v-model="dialogVisible" :width="360">
        <template #header>
            <span
                :class="`text-20px font-500 mr-24px cursor-pointer ${isNotice ? 'color-[--d-F5F5F5-l-111]' : 'color-[--d-566275-l-8CA0C3]'}`"
                @click="globalStore.audioSettings.active = 'notice'">{{ $t('noticeSettings') }}</span>
            <span
                :class="`text-20px font-500 cursor-pointer ${!isNotice ? 'color-[--d-F5F5F5-l-111]' : 'color-[--d-566275-l-8CA0C3]'}`"
                @click="globalStore.audioSettings.active = 'audio'">{{ $t('audioSettings') }}</span>
        </template>
        <template #default>
            <div class="mx--20px border-t-solid border-t-1px border-t-[--d-252E3C-l-E8F1FF] mb-20px"/>
            <div v-if="isNotice">
<!-- @todos -->
            </div>
            <div v-else>
                @audio
            </div>
        </template>
    </el-dialog>
</template>