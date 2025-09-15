<script setup lang="ts">
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
    <el-dialog v-model="dialogVisible" :width="360">
        <template #header>
            <span
                :class="`text-20px font-500 mr-24px cursor-pointer ${isNotice ? 'color-[--main-text]' : 'color-[--third-text]'}`"
                @click="globalStore.audioSettings.active = 'notice'">{{ $t('noticeSettings') }}</span>
            <span
                :class="`text-20px font-500 cursor-pointer ${!isNotice ? 'color-[--main-text]' : 'color-[--third-text]'}`"
                @click="globalStore.audioSettings.active = 'audio'">{{ $t('audioSettings') }}</span>
        </template>
        <template #default>
            <div class="mx--20px border-t-solid border-t-1px border-t-[--dialog-divider] mb-20px" />
            <div v-if="isNotice">
                <!-- @todos -->
            </div>
            <div v-else>
                <AudioSettingsItem item-key="signal" :title="$t('signal')" />
                <AudioSettingsItem item-key="monitor" :title="$t('followMonitor')" />
                <div class="mb-21px text-12px">{{ $t('tradeSound') }}</div>
                <AudioSettingsItem class="color-[--secondary-text]" item-key="marketBuy" :title="$t('buySound')" />
                <AudioSettingsItem class="color-[--secondary-text]" item-key="marketSell" :title="$t('sellSound')" />
                <AudioSettingsItem class="color-[--secondary-text]" item-key="limit" :title="$t('limit')" />
                <div class="flex justify-between items-center text-12px mt-24px mb-12px">
                    {{ $t('volume2') }}
                    <el-input
v-model.number="globalStore.audioSettings.audio.volume"
                        class="w-54px [--el-input-height:28px] text-12px [--el-input-icon-color:--d-CCC-l-333] [--el-input-border-color:--d-333-l-F2F2F2]">
                        <template #suffix><span class="color-[--third-text]">%</span></template>
                    </el-input>
                </div>
                <el-slider
v-model="globalStore.audioSettings.audio.volume" :min="0" :max="100" :step="1" :marks="{
                    0: '0',
                    25: '25',
                    50: '50',
                    75: '75',
                    100: '100',
                }"
                    class="[&&]:[--el-slider-button-size:8px] [--el-color-white:--primary-color] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] mx-4px [--el-color-info:--third-text]" />
                <el-button type="primary" class="w-full mt-70px">{{ $t('complete') }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<style scoped lang="scss">
:deep {
    .el-select__wrapper {
        background-color: transparent;
        box-shadow: none;
        padding: 0;
        padding-left: 8px;
    }
}
:deep(.el-slider__marks-text){
    margin-top: 7px;
}
</style>