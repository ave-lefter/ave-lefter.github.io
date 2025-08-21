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
            <div class="mx--20px border-t-solid border-t-1px border-t-[--d-252E3C-l-E8F1FF] mb-20px" />
            <div v-if="isNotice">
                <!-- @todos -->
            </div>
            <div v-else>
                <AudioSettingsItem item-key="signal" :title="$t('signal')" />
                <AudioSettingsItem item-key="monitor" :title="$t('followMonitor')" />
                <div class="mb-21px text-12px">{{ $t('tradeSound') }}</div>
                <AudioSettingsItem item-key="marketBuy" :title="$t('buySound')" />
                <AudioSettingsItem item-key="marketSell" :title="$t('sellSound')" />
                <AudioSettingsItem item-key="limit" :title="$t('limit')" />
                <div class="flex justify-between items-center text-12px mt-24px mb-12px">
                    {{ $t('volume2') }}
                    <el-input
v-model.number="globalStore.audioSettings.audio.volume"
                        class="w-54px [--el-input-height:28px] text-12px [--el-input-icon-color:--d-CCC-l-333] [--el-input-border-color:--d-333-l-F2F2F2]">
                        <template #suffix>%</template>
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
                    class="[&&]:[--el-slider-button-size:8px] [--el-color-white:#3F80F7] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] mx-4px" />
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
</style>