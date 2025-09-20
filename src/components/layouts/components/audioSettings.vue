<script setup lang="tsx">
import { cloneDeep } from 'lodash-es'
import AudioSettingsItem from './audioSettingsItem.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const globalStore = useGlobalStore()

// 当前暂存的配置
const audioSettings = ref(cloneDeep(globalStore.audioSettings))
const toastPositions = [
    {
        label:'topLeft',
        className:'pl-6px pt-6px',
        parentClassName:'pt-7px pl-7px',
        placement:'top-left' as const
    },
    {
        label:'topMiddle',
        className:'pt-6px flex justify-center',
        parentClassName:'pt-7px',
        placement:'top' as const
    },
    {
        label:'topRight',
        className:'pt-6px pr-6px flex justify-end',
        parentClassName:'pt-7px pr-7px',
        placement:'top-right' as const
    },
    {
        label:'bottomLeft',
        className:'pl-6px pb-6px flex items-end',
        parentClassName:'pb-7px pl-7px',
        placement:'bottom-left' as const
    },
    {
        label:'bottomMiddle',
        className:'pb-6px flex items-end justify-center',
        parentClassName:'pb-7px',
        placement:'bottom' as const
    },
    {
        label:'bottomRight',
        className:'pb-6px pr-6px flex justify-end items-end',
        parentClassName:'pb-7px pr-7px',
        placement:'bottom-right' as const
    }
]
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

watch(dialogVisible,()=>{
    if(dialogVisible.value){
        audioSettings.value = cloneDeep(globalStore.audioSettings)
    }
})

function selectPosition(item:typeof toastPositions[number]) {
    audioSettings.value.notice.position = item.placement
    ElMessage.warning({
        placement:item.placement,
        message:<span class="color-[--main-text] text-12px">{t('example')}</span>
    })
}

function getSelectedClass(item:string) {
    if(audioSettings.value.notice.position === item){
      return {
        parent:'border-[--primary-color]',
        class:'color-[--main-text]'
      }
    }
    return {
        class:'color-[--secondary-text]'
    }
}

function onSave() {
    globalStore.audioSettings = cloneDeep(audioSettings.value)
    dialogVisible.value = false
}
</script>

<template>
    <el-dialog v-model="dialogVisible" :width="360">
        <template #header>
            <span
                :class="`text-20px font-500 mr-24px cursor-pointer ${isNotice ? 'color-[--main-text]' : 'color-[--third-text]'}`"
                @click="audioSettings.active = 'notice'">{{ $t('noticeSettings') }}</span>
            <span
                :class="`text-20px font-500 cursor-pointer ${!isNotice ? 'color-[--main-text]' : 'color-[--third-text]'}`"
                @click="audioSettings.active = 'audio'">{{ $t('audioSettings') }}</span>
        </template>
        <template #default>
            <div class="mx--20px border-t-solid border-t-1px border-t-[--dialog-divider] mb-20px" />
            <div v-if="isNotice" class="text-12px">
                <div class="flex justify-between items-center mb-16px">
                   <span>{{ $t('monitorGlobalPush') }}</span>
                   <el-switch v-model="audioSettings.notice.monitor" class="[&&]:h-20px"/>
                </div>
                <div class="flex justify-between items-center mb-24px">
                   <span>{{ $t('signalGlobalPush') }}</span>
                   <el-switch v-model="audioSettings.notice.signal" class="[&&]:h-20px"/>
                </div>
                <div class="mb-40px">
                    <div class="lh-18px mb-16px">{{ $t('ToastPosition') }}</div>
                    <div class="flex gap-x-10px gap-y-16px flex-wrap">
                        <div
                            v-for="item in toastPositions" :key="item.label" 
                            :class="`text-center cursor-pointer hover:color-[--main-text] group ${getSelectedClass(item.placement)?.class || ''}`" @click="selectPosition(item)">
                            <div :class="`bg-[--secondary-bg] border-1px border-solid border-[--border] rounded-4px mb-9px group-hover:border-[--primary-color] transition-all duration-300 ${item.parentClassName} ${getSelectedClass(item.placement)?.parent || ''}`">
                                <div :class="`w-91px h-63px bg-[--dialog-bg] rounded-4px ${item.className}`">
                                    <div class="w-54px h-20px bg-[--secondary-bg] rounded-4px flex items-center justify-center">
                                        <div class="w-6px h-6px bg-[--primary-color] rounded-full mr-3px"/>
                                        <div>
                                            <div class="w-33px h-2px bg-[--main-input-button-bg]"/>
                                            <div class="mt-2px w-18px h-2px bg-[--main-input-button-bg]"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {{ $t(item.label) }}
                        </div>
                    </div>
                </div>
                <el-button type="primary" class="w-full" @click="onSave">
                    {{ $t('complete') }}
                </el-button>
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
                <el-button type="primary" class="w-full mt-70px" @click="onSave">{{ $t('complete') }}</el-button>
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