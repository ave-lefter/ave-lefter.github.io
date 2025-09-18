<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import AudioSettingsItem from './audioSettingsItem.vue'

const globalStore = useGlobalStore()
// 当前暂存的配置
const audioSettings = ref(cloneDeep(globalStore.audioSettings))
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
    return audioSettings.value.active === 'notice'
})
const audioRef = ref<HTMLAudioElement | null>(null)
function playAudio(settingKey: keyof typeof audioSettings.value.audio) {
    if(audioRef.value){
        audioRef.value.src = audioNameToResource[audioSettings.value.audio[settingKey] as keyof typeof audioNameToResource]
        audioRef.value.play()
    }
}

function save() {
    globalStore.audioSettings = cloneDeep(audioSettings.value)
}
</script>

<template>
    <el-dialog v-model="dialogVisible" :width="360">
        <template #header>
            <!-- <span
                :class="`text-20px font-500 mr-24px cursor-pointer ${isNotice ? 'color-[--main-text]' : 'color-[--third-text]'}`"
                @click="audioSettings.active = 'notice'">{{ $t('noticeSettings') }}</span> -->
            <span
                :class="`text-20px font-500 cursor-pointer ${!isNotice ? 'color-[--main-text]' : 'color-[--third-text]'}`"
                @click="audioSettings.active = 'audio'">{{ $t('audioSettings') }}</span>
        </template>
        <template #default>
            <div class="mx--20px border-t-solid border-t-1px border-t-[--dialog-divider] mb-20px" />
            <div v-if="isNotice">
                <!-- @todos -->
            </div>
            <div v-else>
                <AudioSettingsItem v-model="audioSettings.audio.signal" :title="$t('signal')" @playAudio="playAudio('signal')" />
                <AudioSettingsItem v-model="audioSettings.audio.monitor" :title="$t('followMonitor')" @playAudio="playAudio('monitor')"/>
                <div class="mb-21px text-12px">{{ $t('tradeSound') }}</div>
                <AudioSettingsItem v-model="audioSettings.audio.marketBuy" class="color-[--secondary-text]" :title="$t('buySound')" @playAudio="playAudio('marketBuy')"/>
                <AudioSettingsItem v-model="audioSettings.audio.marketSell" class="color-[--secondary-text]" :title="$t('sellSound')" @playAudio="playAudio('marketSell')"/>
                <AudioSettingsItem v-model="audioSettings.audio.limit" class="color-[--secondary-text]" :title="$t('limit')" @playAudio="playAudio('limit')"/>
                <div class="flex justify-between items-center text-12px mt-24px mb-12px">
                    {{ $t('volume2') }}
                    <el-input v-model.number="audioSettings.audio.volume" class="w-60px [--el-input-height:28px] text-12px [--el-input-icon-color:--d-CCC-l-333] [--el-input-border-color:--d-333-l-F2F2F2]">
                        <template #suffix><span class="color-[--third-text]">%</span></template>
                    </el-input>
                </div>
                <el-slider
v-model="audioSettings.audio.volume" :min="0" :max="100" :step="1"  :marks="{
                    0: '0',
                    25: '25',
                    50: '50',
                    75: '75',
                    100: '100',
                }"
                    class="[&&]:[--el-slider-button-size:8px] [--el-color-white:--primary-color] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] mx-4px [--el-color-info:--third-text]" />
                <el-button type="primary" class="w-full mt-70px" @click="save">{{ $t('complete') }}</el-button>
            </div>
            <audio ref="audioRef" class="hidden" :volume="audioSettings.audio.volume/100"/>
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