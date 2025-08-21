<script setup lang="ts">
import SuffixIcon from '~/components/suffixIcon.vue'
import AudioSettingsItem from './audioSettingsItem.vue'

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
    <el-dialog v-model="dialogVisible" style="--el-bg-color:var(--d-151A22-l-FFF)" :width="360">
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
                <AudioSettingsItem item-key="signal" :title="$t('signal')"/>
                <AudioSettingsItem item-key="monitor" :title="$t('followMonitor')"/>
                <div class="mb-21px text-12px">{{ $t('tradeSound') }}</div>
                <AudioSettingsItem item-key="marketBuy" :title="$t('buySound')"/>
                <AudioSettingsItem item-key="marketSell" :title="$t('sellSound')"/>
                <AudioSettingsItem item-key="limit" :title="$t('limit')"/>
                <div class="flex justify-between items-center">
{{ $t('volume2') }}
                </div>
            </div>
        </template>
    </el-dialog>
</template>
<style scoped lang="scss">
:deep{
    .el-select__wrapper{
        background-color: transparent;
        box-shadow: none;
        padding: 0;
        padding-left: 8px;
    }
}
</style>