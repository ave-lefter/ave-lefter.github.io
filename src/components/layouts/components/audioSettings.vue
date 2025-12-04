<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import AudioSettingsItem from './audioSettingsItem.vue'
import { useI18n } from 'vue-i18n'
import { h } from 'vue'
import { getPumpBgColor} from '@/utils/index'

const { t } = useI18n()
const globalStore = useGlobalStore()
const pumpStore = usePumpStore()
const configStore = useConfigStore()

// 当前暂存的配置
const audioSettings = ref(cloneDeep(globalStore.audioSettings))

// 获取pump配置
const pumpConfig = computed(() => pumpStore.pumpConfig)

// 链选项
const chainOptions = computed(() => {
  return pumpConfig.value.map((item: any) => ({
    label: item.chain_show,
    value: item.chain,
  }))
})

// 平台选项 - 根据选中的链动态显示对应的平台
const platformOptions = computed(() => {
  const selectedChains = audioSettings.value.notice.pumpChains || []

  // 如果没有选择任何链，返回空数组
  if (selectedChains.length === 0) {
    return []
  }

  const platforms: Array<{ label: string; value: string; icon: string }> = []

  // 只遍历选中的链
  pumpConfig.value.forEach((chain: any) => {
    if (selectedChains.includes(chain.chain)) {
      chain.platforms.forEach((platform: any) => {
        // 去重
        if (!platforms.find((p) => p.value === platform.platform)) {
          platforms.push({
            label: platform.platform_show,
            value: platform.platform,
            icon: platform.platform_icon,
          })
        }
      })
    }
  })

  return platforms
})
const toastPositions = [
  {
    label: 'topLeft',
    className: 'pl-6px pt-6px',
    parentClassName: 'pt-7px pl-7px',
    placement: 'top-left' as const,
  },
  {
    label: 'topMiddle',
    className: 'pt-6px flex justify-center',
    parentClassName: 'pt-7px',
    placement: 'top' as const,
  },
  {
    label: 'topRight',
    className: 'pt-6px pr-6px flex justify-end',
    parentClassName: 'pt-7px pr-7px',
    placement: 'top-right' as const,
  },
  {
    label: 'bottomLeft',
    className: 'pl-6px pb-6px flex items-end',
    parentClassName: 'pb-7px pl-7px',
    placement: 'bottom-left' as const,
  },
  {
    label: 'bottomMiddle',
    className: 'pb-6px flex items-end justify-center',
    parentClassName: 'pb-7px',
    placement: 'bottom' as const,
  },
  {
    label: 'bottomRight',
    className: 'pb-6px pr-6px flex justify-end items-end',
    parentClassName: 'pb-7px pr-7px',
    placement: 'bottom-right' as const,
  },
]
const dialogVisible = computed({
  get() {
    return !!globalStore.audioSettings.active
  },
  set(value: boolean) {
    if (!value) {
      globalStore.audioSettings.active = ''
    }
  },
})
const isNotice = computed(() => {
  return audioSettings.value.active === 'notice'
})
const audioRef = ref<HTMLAudioElement | null>(null)
function playAudio(settingKey: keyof typeof audioSettings.value.audio) {
  if (audioRef.value) {
    audioRef.value.src =
      audioNameToResource[audioSettings.value.audio[settingKey] as keyof typeof audioNameToResource]
    audioRef.value.play()
  }
}

watch(dialogVisible, () => {
  if (dialogVisible.value) {
    const settings = cloneDeep(globalStore.audioSettings)
    // 确保新字段存在
    if (!settings.notice.pumpNotice) {
      settings.notice.pumpNotice = false
    }
    if (!settings.notice.pumpChains) {
      settings.notice.pumpChains = []
    }
    if (!settings.notice.pumpPlatforms) {
      settings.notice.pumpPlatforms = []
    }
    audioSettings.value = settings
  }
})

function selectPosition(item: (typeof toastPositions)[number]) {
  audioSettings.value.notice.position = item.placement
  ElMessage.warning({
    placement: item.placement,
    message: h('span', { class: 'color-[--main-text] text-12px' }, t('example')),
  })
}
function getCheckboxBorderColor(platform: string) {
  return getPumpBgColor(platform).color
}

// 判断checkbox是否被选中
function isPlatformChecked(platform: string) {
  return audioSettings.value.notice.pumpPlatforms?.includes(platform)
}

// 获取checkbox的边框样式
function getCheckboxBorderStyle(platform: string) {
  const color = getCheckboxBorderColor(platform)
  if (isPlatformChecked(platform)) {
    // 选中时显示完整颜色
    return {
      borderColor: color
    }
  }
  // 未选中时显示淡色（30%透明度）
  return {
    borderColor: hexToRgba(color, 0.3)
  }
}

// 将hex颜色转换为rgba格式
function hexToRgba(hex: string, alpha: number = 1) {
  // 移除 # 号
  hex = hex.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function getSelectedClass(item: string) {
  if (audioSettings.value.notice.position === item) {
    return {
      parent: 'border-[--primary-color]',
      class: 'color-[--main-text]',
    }
  }
  return {
    class: 'color-[--secondary-text]',
  }
}

function onSave() {
  globalStore.audioSettings = cloneDeep(audioSettings.value)
  dialogVisible.value = false
}

function toggleChain(chain: string) {
  const index = audioSettings.value.notice.pumpChains.indexOf(chain)
  if (index > -1) {
    audioSettings.value.notice.pumpChains.splice(index, 1)

    // 取消选中链时，移除该链下不在其他已选链中的平台
    const remainingPlatforms = new Set<string>()
    pumpConfig.value.forEach((c: any) => {
      if (audioSettings.value.notice.pumpChains.includes(c.chain)) {
        c.platforms.forEach((p: any) => {
          remainingPlatforms.add(p.platform)
        })
      }
    })

    audioSettings.value.notice.pumpPlatforms = audioSettings.value.notice.pumpPlatforms.filter(
      (platform: string) => remainingPlatforms.has(platform)
    )
  } else {
    audioSettings.value.notice.pumpChains.push(chain)
  }
}

// 全选/取消全选平台
const isAllPlatformsSelected = computed(() => {
  if (!audioSettings.value.notice.pumpPlatforms) return false
  return (
    platformOptions.value.length > 0 &&
    audioSettings.value.notice.pumpPlatforms.length === platformOptions.value.length
  )
})

const isIndeterminatePlatforms = computed(() => {
  const selected = audioSettings.value.notice.pumpPlatforms?.length || 0
  return selected > 0 && selected < platformOptions.value.length
})

function toggleAllPlatforms() {
  if (isAllPlatformsSelected.value) {
    audioSettings.value.notice.pumpPlatforms = []
  } else {
    audioSettings.value.notice.pumpPlatforms = platformOptions.value.map((p: any) => p.value)
  }
}
</script>

<template>
  <el-dialog v-model="dialogVisible" :width="360">
    <template #header>
      <span
        :class="`text-20px font-500 mr-24px cursor-pointer ${isNotice ? 'color-[--main-text]' : 'color-[--third-text]'}`"
        @click="audioSettings.active = 'notice'"
        >{{ $t('noticeSettings') }}</span
      >
      <span
        :class="`text-20px font-500 cursor-pointer ${!isNotice ? 'color-[--main-text]' : 'color-[--third-text]'}`"
        @click="audioSettings.active = 'audio'"
        >{{ $t('audioSettings') }}</span
      >
    </template>
    <template #default>
      <div class="mx--20px border-t-solid border-t-1px border-t-[--dialog-divider] mb-20px" />
      <div v-if="isNotice" class="text-12px">
        <div class="flex justify-between items-center mb-16px">
          <span>{{ $t('monitorGlobalPush') }}</span>
          <el-switch v-model="audioSettings.notice.monitor" class="[&&]:h-20px" />
        </div>
        <div class="flex justify-between items-center mb-16px">
          <span>{{ $t('signalGlobalPush') }}</span>
          <el-switch v-model="audioSettings.notice.signal" class="[&&]:h-20px" />
        </div>
        <!-- 内外盘提示 -->
        <div class="flex justify-between items-center mb-16px">
          <span>{{ $t('pumpNotice') }}</span>
          <el-switch v-model="audioSettings.notice.pumpNotice" class="[&&]:h-20px" />
        </div>
        <div v-show="audioSettings.notice.pumpNotice" class="mb-12px w-full">
          <div class="flex gap-8px flex-wrap p-1 rounded-1 bg-[--d-252E3C-l-D9E8FF]">
            <button
              v-for="chain in chainOptions"
              :key="chain.value"
              class="lh-16px flex-1 py-4px px-8px border-none cursor-pointer rounded-1 text-14px"
              :class="
                audioSettings.notice.pumpChains?.includes(chain.value)
                  ? 'bg-[--secondary-bg] color-[--main-text]'
                  : 'bg-transparent color-[--third-text]'
              "
              @click="toggleChain(chain.value)"
            >
              {{ chain.label }}
            </button>
          </div>
          <div>
            <el-checkbox
              :model-value="isAllPlatformsSelected"
              :indeterminate="isIndeterminatePlatforms"
              class="mb-2px mt-4px"
              @change="toggleAllPlatforms"
            >
              {{ $t('all') }}
            </el-checkbox>

            <el-checkbox-group
              v-model="audioSettings.notice.pumpPlatforms"
              class="grid grid-cols-2 gap-2px"
            >
              <el-checkbox
                v-for="platform in platformOptions"
                :key="platform.value"
                :value="platform.value"
                class="m-0! !h-28px platform-checkbox"
              >
                <div
                  class="flex px-4px py-2px items-center border-1px border-solid border-[--border] rounded-4px platform-checkbox-content"
                  :style="getCheckboxBorderStyle(platform.value)"
                >
                  <el-image
                    class="mr-6px w-14px h-14px rounded-2px"
                    :src="`${configStore.token_logo_url}${platform.icon?.replace('/signals/', 'signals/')}`"
                  />
                  <span>{{ platform.label }}</span>
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>

        <div class="mb-20px">
          <div class="lh-14px mb-14px">{{ $t('ToastPosition') }}</div>
          <div class="flex gap-x-10px gap-y-16px flex-wrap">
            <div
              v-for="item in toastPositions"
              :key="item.label"
              :class="`text-center cursor-pointer hover:color-[--main-text] group ${getSelectedClass(item.placement)?.class || ''}`"
              @click="selectPosition(item)"
            >
              <div
                :class="`bg-[--secondary-bg] border-1px border-solid border-[--border] rounded-4px mb-9px group-hover:border-[--primary-color] transition-all duration-300 ${item.parentClassName} ${getSelectedClass(item.placement)?.parent || ''}`"
              >
                <div :class="`w-91px h-46px bg-[--dialog-bg] rounded-4px ${item.className}`">
                  <div
                    class="w-54px h-20px bg-[--secondary-bg] rounded-4px flex items-center justify-center"
                  >
                    <div class="w-6px h-6px bg-[--primary-color] rounded-full mr-3px" />
                    <div>
                      <div class="w-33px h-2px bg-[--main-input-button-bg]" />
                      <div class="mt-2px w-18px h-2px bg-[--main-input-button-bg]" />
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
        <AudioSettingsItem
          v-model="audioSettings.audio.signal"
          :title="$t('signal')"
          @playAudio="playAudio('signal')"
        />
        <AudioSettingsItem
          v-model="audioSettings.audio.monitor"
          :title="$t('followMonitor')"
          @playAudio="playAudio('monitor')"
        />
        <div class="mb-21px text-12px">{{ $t('tradeSound') }}</div>
        <AudioSettingsItem
          v-model="audioSettings.audio.marketBuy"
          class="color-[--secondary-text]"
          :title="$t('buySound')"
          @playAudio="playAudio('marketBuy')"
        />
        <AudioSettingsItem
          v-model="audioSettings.audio.marketSell"
          class="color-[--secondary-text]"
          :title="$t('sellSound')"
          @playAudio="playAudio('marketSell')"
        />
        <AudioSettingsItem
          v-model="audioSettings.audio.limit"
          class="color-[--secondary-text]"
          :title="$t('limit')"
          @playAudio="playAudio('limit')"
        />
        <div class="flex justify-between items-center text-12px mt-24px mb-12px">
          {{ $t('volume2') }}
          <el-input
            v-model.number="audioSettings.audio.volume"
            class="w-60px [--el-input-height:28px] text-12px [--el-input-icon-color:--d-CCC-l-333] [--el-input-border-color:--d-333-l-F2F2F2]"
          >
            <template #suffix><span class="color-[--third-text]">%</span></template>
          </el-input>
        </div>
        <el-slider
          v-model="audioSettings.audio.volume"
          :min="0"
          :max="100"
          :step="1"
          :marks="{
            0: '0',
            25: '25',
            50: '50',
            75: '75',
            100: '100',
          }"
          class="[&&]:[--el-slider-button-size:8px] [--el-color-white:--primary-color] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] mx-4px [--el-color-info:--third-text]"
        />
        <el-button type="primary" class="w-full mt-70px" @click="onSave">{{
          $t('complete')
        }}</el-button>
      </div>
      <audio ref="audioRef" class="hidden" :volume="audioSettings.audio.volume / 100" />
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
:deep(.el-slider__marks-text) {
  margin-top: 7px;
}
</style>
