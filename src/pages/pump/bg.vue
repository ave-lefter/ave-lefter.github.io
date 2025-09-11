<template>
  <div v-if="Object.keys(pumpSetting.bg)?.length > 0">

    <el-checkbox-group v-model="pumpSetting.bgList" class="checkbox-group">
      <el-checkbox
        v-for="i in platforms"
        :key="i.platform"
        :label="i.platform_show"
        :value="i.platform"
      >
        <div class="flex-start flex-1" @click.stop.prevent>
          <div ref="el">
            <el-color-picker
              v-model="pumpSetting.bg[i.platform]['bg']"
              persistent
              append-to="body"
              :teleported="true"
              @blur="emit('blur')"
              @focus="emit('focus')"
            />
          </div>
          <div
            class="flex-start border-1px border-solid rounded-4px px-4px py-2px text-10px"
            :style="{ 'border-color': pumpSetting.bg[i.platform]?.['color'], 'background': pumpSetting.bg[i.platform]?.['bg'] }"
          >
            <el-image
              class="mr-5px rounded w-12px"
              :src="`${token_logo_url}${i.platform_icon?.replace('/signals/', 'signals/')}`"
            />
            {{ i.platform_show }}
          </div>
          <div class="flex-1"></div>
          <Icon
            name="custom:refresh"
            class="color-[--third-text] text-8px ml-6px cursor-pointer font-bold"
            @click.stop.prevent="reset(i.platform)"
          />
        </div>
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script lang="ts" setup>
import type { PumpConfig } from '@/api/types/pump'
import { getBgColor, getPumpBgColor,  getLightDarkValue, pumpMap, type PlatformsType} from '@/utils/index'
const emit = defineEmits(['blur', 'focus'])
const props = withDefaults(
  defineProps<{
    chain: string
    pumpConfig?: PumpConfig[]
  }>(),
  {}
)
const globalStore = useGlobalStore()
const { pumpSetting, token_logo_url, mode , isDark} = storeToRefs(globalStore)
const platforms = computed(() => {
  const obj = props.pumpConfig?.find((i) => i.chain == props.chain)
  return obj?.platforms || []
})
watch(mode, (val) => {
  // if (Object.keys(pumpSetting.value.bg)?.length > 0) {
  //   const list = props.pumpConfig?.flatMap((i) => i.platforms) || []
  //   list.forEach((i) => {
  //     const platform = pumpMap[i.platform as PlatformsType]
  //     if (platform) {
  //     const defaultVars =  platform['bg']
  //       const defaultObj = getLightDarkValue(defaultVars)
  //       console.log('------isDark.value-----', isDark.value,pumpSetting.value.bg[i.platform].bg, defaultObj)
  //       if (isDark.value && pumpSetting.value.bg[i.platform].bg == defaultObj?.light || !isDark.value && pumpSetting.value.bg[i.platform].bg == defaultObj?.dark) {
  //           pumpSetting.value.bg[i.platform] = getPumpBgColor(i.platform)
  //       }
  //      }
  //   })
  // }
    const list = props.pumpConfig?.flatMap((i) => i.platforms) || []
    list.forEach((i) => {
      pumpSetting.value.bg[i.platform]= getPumpBgColor(i.platform)
    })
})
onMounted(() => {
  init()
})
function init() {
  if (Object.keys(pumpSetting.value.bg)?.length == 0) {
  const list = props.pumpConfig?.flatMap((i) => i.platforms) || []
    list.forEach((i) => {
      pumpSetting.value.bg[i.platform]= getPumpBgColor(i.platform)
    })
   }
}
function reset(platform: string) {
  pumpSetting.value.bg[platform] = getPumpBgColor(platform)
}
</script>

<style lang="scss" scoped>
.checkbox-group {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  overflow: hidden;
  :deep().el-checkbox {
    margin-right: 0;
    &.is-checked {
      .el-checkbox__label {
        opacity: 1;
      }
    }
    .el-checkbox__label{
      color: var(--main-text);
      opacity: 0.7;
    }
  }
}
:deep(.el-color-dropdown) {
  background-color: var(--el-bg-color-overlay, #fff) !important;
  border-radius: 6px;
}

:deep(.el-color-dropdown__main-wrapper) {
  background-color: var(--el-bg-color-overlay, #fff) !important;
}
</style>
