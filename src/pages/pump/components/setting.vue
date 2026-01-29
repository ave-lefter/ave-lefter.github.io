<template>
  <el-popover
    :visible="visible"
    @update:visible="updateVisible"
    popper-class="new-popover"
    placement="bottom"
    :width="320"
    trigger="click"
    :teleported="false"
    persistent
  >
    <template #reference>
      <slot :visible="visible">
        <el-button class="btn mr-8px h-28px" :class="{ active: isExit }">
          <Icon name="custom:customized" class="text-13px mr-4px" /> {{ $t('customize') }}
          <Icon
            :name="isRotate ? 'radix-icons:triangle-up' : 'radix-icons:triangle-down'"
            class="text-16px ml-4px"
          />
        </el-button>
      </slot>
    </template>
    <template #default>
        <div>
          <span class="text-12px color-[--secondary-text]">{{ $t('mc/vol') }}</span>
          <div class="tabs mt-10px">
            <button
              v-for="item in list_mc"
              :key="item.size"
              class="flex-1"
              :class="{ active: item.size === pumpSetting.fontSize_mc }"
              type="button"
              @click.stop="pumpSetting.fontSize_mc = item.size"
            >
              <span :style="{ 'font-size': item.size }">Mc $99K</span>
              <span class="block text-12px mt-8px">{{ item.name || '' }}</span>
            </button>
          </div>
        </div>

        <div class="mt-20px border-b border-[--dialog-divider] pb-20px">
          <span class="text-12px color-[--secondary-text]">{{ $t('sell/buy') }}</span>
          <div class="tabs flex-wrap mt-10px">
            <button
              v-for="item in list_swap"
              :key="item.size"
              class="flex-1 small"
              :class="{ active: item.size === activeFontSize }"
              type="button"
              @click.stop="switchSwap(item)"
            >
              <div
                class="swap flex items-center justify-center"
              >
                <Icon
                  class="mr-4px"
                  :style="{ 'font-size': item.value}"
                  name="mynaui:lightning-solid"
                />
                0.01
              </div>
              <span class="block text-12px mt-8px">{{ item.name || '' }}</span>
            </button>
            <div class="slider-wrapper" v-show="activeFontSize !== 'large'">
              <el-slider
                v-model.lazy="defineProgress"
                :format-tooltip="formatTooltip"
              />
            </div>
          </div>
          <div class="tabs mt-10px" v-if="activeFontSize == 'large'">
            <button
              v-for="item in list_border"
              :key="item.id"
              class="flex-1"
              :class="{ active: item.id === pumpSetting.border }"
              type="button"
              style="padding: 7px"
              @click.stop="pumpSetting.border = item.id"
            >
              <span class="text-12px">{{ item.name || '' }}</span>
            </button>
          </div>
        </div>
        <div class="">
          <div class="tabs pb-10px border-b-0.5px border-b-solid border-b-[var(--border)]">
            <button
              v-for="item in list_tabs"
              :key="item.id"
              class="flex-1 switchTab"
              :class="{ active: item.id === activeTab }"
              type="button"
              @click.stop="activeTab = item.id"
            >
              <span class="text-14px">{{ item.name || '' }}</span>
            </button>
          </div>
        <el-scrollbar :height="scrollHeight"  class="hidden-scrollbar">
          <div class="mt-10px">
            <template v-if="activeTab == 1">
              <ul class="item pb-20px border-b-0.5px border-b-solid border-b-[var(--border)]">
                <li @click="pumpSetting.show_search = !pumpSetting.show_search">
                  <template v-if="pumpSetting.show_search">
                    <!-- <Icon name="custom:show-search" class="text-12px mr-8px" /> -->
                    <img
                      v-if="isDark"
                      src="@/assets/icons/show-search-dark.svg"
                      alt=""
                      class="mr-8px"
                      :width="12"
                    />
                    <img
                      v-else
                      src="@/assets/icons/show-search-light.svg"
                      alt=""
                      class="mr-8px"
                      :width="12"
                    />
                    {{ $t('hideSearch') }}
                  </template>
                  <template v-else>
                    <Icon name="custom:search" class="text-12px mr-8px" />
                    {{ $t('showSearch') }}
                  </template>
                </li>
                <li @click="switchProgress">
                  <Icon
                    v-if="pumpSetting.Progress_isCircle == 'horizontal'"
                    name="custom:progress-horizontal"
                    class="text-4px mr-8px"
                  /><Icon v-else name="custom:progress-circle" class="text-12px mr-8px" />
                  {{ $t('progress') }}
                </li>
                <li @click="switchAvatar">
                  <template v-if="pumpSetting.avatar_isCircle == 'circle'">
                    <Icon name="custom:progress-circle" class="text-12px mr-8px" />
                    {{ $t('rectTokenImage') }}
                  </template>
                  <template v-else>
                    <Icon name="custom:avatar-rect" class="text-12px mr-8px" />
                    {{ $t('circleTokenImage') }}
                  </template>
                </li>
                <li @click="pumpSetting.isGutter = !pumpSetting.isGutter">
                  <template v-if="pumpSetting.isGutter">
                    <Icon name="custom:gutter-big" class="text-12px mr-8px" />
                    {{ $t('compactColumns') }}
                  </template>
                  <template v-else>
                    <Icon name="custom:gutter-small" class="text-12px mr-8px" />
                    {{ $t('looseColumns') }}
                  </template>
                </li>
                <li @click="pumpSetting.isRight = !pumpSetting.isRight">
                  <Icon name="custom:right-key" class="text-12px mr-8px" />
                  <template v-if="pumpSetting.isRight">{{ $t('noNewTabRightClick') }}</template>
                  <template v-else>{{ $t('newTabRightClick') }}</template>
                </li>
                <li @click="pumpSetting.isBlacklist = !pumpSetting.isBlacklist">
                  <template v-if="pumpSetting.isBlacklist">
                    <Icon name="custom:key-invisible" class="text-12px mr-8px" />
                    {{ $t('showBlackList') }}
                  </template>
                  <template v-else>
                    <Icon name="custom:key-visible" class="text-8px mr-8px" />
                    {{ $t('hideBlackList') }}
                  </template>
                </li>
                <li @click="pumpSetting.isInt = !pumpSetting.isInt">
                  <template v-if="pumpSetting.isInt">
                    <Icon name="custom:int" class="text-12px mr-8px" />
                    {{ $t('roundUpDisplay') }}
                  </template>
                  <template v-else>
                    <Icon name="custom:dot" class="text-12px mr-8px" />
                    {{ $t('decimalsDisplay') }}
                  </template>
                </li>
              </ul>
              <span class="text-12px color-[--secondary-text] mt-16px block">{{ $t('define') }}</span>
              <div class="tabs define mt-16px" >
                <el-button
                  v-for="(item, index) in defineList"
                  :key="index"
                  class="btn"
                  :class="pumpSetting.define?.includes(item.id) ? 'active' : ''"
                  @click="dealDefine(item)"
                  >{{ item.name }}</el-button
                >
              </div>
            </template>
            <div v-if="activeTab == 2">

              <Data @blur="isColor = false" @focus="isColor = true"/>
            </div>
            <div v-if="activeTab == 3">
              <Bg :pumpConfig="pumpConfig" :chain="chain" @blur="isColor = false" @focus="isColor = true"/>
            </div>
            <div v-if="activeTab == 4">
              <Grid :isFloat="isFloat" />
            </div>
          </div>
        </el-scrollbar>
        </div>

    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { useLocalStorage, useWindowSize } from '@vueuse/core'
import type { Size } from '~/api/types/pump'
import type { PumpConfig } from '@/api/types/pump'

import Data from './data.vue'
import Bg from './bg.vue'
import Grid from './grid.vue'
const { width } = useWindowSize()
const props = withDefaults(
  defineProps<{
    chain: string
    pumpConfig?: PumpConfig[],
    isFloat?: boolean
  }>(),
  {
    isFloat: false
  }
)
const isColor = shallowRef(false)
const { t } = useI18n()
const visible = shallowRef(false)
const isRotate = shallowRef(false)
const globalStore = useGlobalStore()
const { pumpSetting, token_logo_url, isDark } = storeToRefs(globalStore)
const defineFontsize = useLocalStorage('defineFontsize', 15)
const defineProgress = useLocalStorage('defineProgress', 0)
const activeFontSize = useLocalStorage('activeFontSize', 'medium')
const activeTab = shallowRef(1)

const scrollHeight = ref(300)

const list_mc = computed(() => {
  return [
    {
      size: '12px',
      name: t('convention'),
    },
    {
      size: '16px',
      name: t('large'),
    },
  ]
})
const list_border = computed(() => {
  return [
    {
      id: 'border_hight',
      name: t('highlightBorder'),
    },
    {
      id: 'border',
      name: t('displayBorder'),
    },
  ]
})
const list_tabs = computed(() => {
  return [
    {
      id: 1,
      name: t('display'),
    },
    {
      id: 2,
      name: t('data'),
    },
    {
      id: 3,
      name: t('background'),
    },
    {
      id: 4,
      name: t('layout'),
    },
  ]
})
const list_swap = computed(() => {
  return [
    {
      size: 'mini',
      name: t('mini'),
      value: 10,
    },
    {
      size: 'small',
      name: t('convention'),
      value: 12,
    },
    {
      size: 'medium',
      name: t('large'),
      value: 14,
    },
    {
      size: 'large',
      name: t('largest'),
      value: 16,
    },
    ...(activeFontSize.value !== 'large' ? [{ size: 'define', name: t('define') }] : []),
  ]
})
const defineList = computed(() => {
  return [
    { name: t('tokenName1'), id: 'name' },
    { name: t('Txs'), id: 'txs' },
    { name: t('volume'), id: 'vol' },
    { name: t('holders'), id: 'holder' },
    { name: t('mcap'), id: 'mcap' },
    { name: t('media'), id: 'media' },
    { name: t('smarter'), id: 'smart' },
    { name: 'KOL', id: 'kol' },
    { name: 'Top 10', id: 'top' },
    { name: 'DEV', id: 'dev' },
    { name: t('runPull'), id: 'rug' },
    { name: t('insiders'), id: 'insider' },
    { name: t('sniper'), id: 'sniper' },
    // { name: t('cabal'), id: 'cabal' },
    { name: t('markers'), id: 'markers' },
    // { name: t('migraged'), id: 'migraged' },
  ]
})

function switchAvatar() {
  if (pumpSetting.value.avatar_isCircle == 'circle') {
    pumpSetting.value.avatar_isCircle = 'rect'
  } else {
    pumpSetting.value.avatar_isCircle = 'circle'
  }
}
const isExit = computed(() => {
  return localStorage.getItem('pumpSetting') !== undefined || false
})
watch(defineProgress, (newval) => {
  if (newval) {
    activeFontSize.value = 'define'
  }
  if (activeFontSize.value == 'define') {
    pumpSetting.value.size_swap = formatNumber(newval * defineFontsize.value /100 || 0, 0)+ 'px'
  }
})
function switchProgress() {
  if (pumpSetting.value.Progress_isCircle == 'circle') {
    pumpSetting.value.Progress_isCircle = 'horizontal'
  } else {
    pumpSetting.value.Progress_isCircle = 'circle'
  }
}
onMounted(() => {
  if (width.value >= 1920) {
    scrollHeight.value = 500
  } else if (width.value >= 1200) {
    scrollHeight.value = 270
  } else if (width.value >= 768) {
    scrollHeight.value = 270
  } else {
    scrollHeight.value = 300
  }
})
function dealDefine(item: { id: string }) {
  if (pumpSetting.value.define) {
    const findIndex = pumpSetting.value.define?.findIndex((i) => item.id == i)
    if (findIndex !== -1) {
      pumpSetting.value.define?.splice(findIndex, 1)
    } else {
      pumpSetting.value.define?.push(item.id)
    }
  } else {
    pumpSetting.value.define = [item.id]
  }
  console.log(pumpSetting.value)
}
function switchSwap(item: { size: string; value: number }) {
  activeFontSize.value = item.size
  if (item.size !== 'define') {
    pumpSetting.value.size_swap = item.value + 'px'
    defineFontsize.value = 16
    defineProgress.value = 0
  }
}
function formatTooltip(val: number) {
  return `${formatNumber(val * defineFontsize.value /100 || 0, 0) }px`
}
function updateVisible(value: boolean) {
  if (!value) {
    if(!isColor.value){
      visible.value = false
    }
  } else {
    visible.value = value
  }

}
</script>

<style scoped lang="scss">
.tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  &.define {
    flex-wrap: wrap;
    gap: 8px;
    justify-content: flex-start;
    button {
      border: 1px solid var(--border);
      background: transparent;
      color: var(--third-text);
      margin-left: 0;
      padding: 4px;
      &.active {
        color: var(--secondary-text);
        background: var(--border);
      }
    }
  }

  button {
    border: 1px solid var(--border);
    // font-size: 14px;
    color: var(--third-text);
    letter-spacing: 0;
    font-weight: 400;
    cursor: pointer;
    border-radius: 4px;
    background: transparent;
    padding: 14px;
    text-align: center;
    &.switchTab {
      padding: 6px 12px;
      border: none;
    }
    &.small {
      padding: 8px;
      // flex: 0 0 64px;
      // flex: 0 0 25%;
      width: 64px;
    }
    // & + button {
    //   margin-left: 8px;
    // }
    &.active {
      color: var(--main-text);
      background: var(--border);
    }
    .swap {
      background: #12b8861a;
      border-radius: 4px;
      padding: 5px;
      color: #12b886;
      .el-image {
        width: 14px;
      }
    }
  }
}
.btn {
  border: none;
  background: var(--main-input-button-bg);
  padding: 3px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 12px;
  font-weight: 500;
  color: var(--secondary-text);
  &.active,
  &:hover {
    color: var(--main-text);
  }
}
.item {
  &.border {
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  li {
    color: var(--main-text);
    margin-top: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
}

/* 1. 控制整体宽度 */
.slider-wrapper {
  width: 75%; /* 改这里就是滑块长度 */
  // margin-left: 20px;
  /* 2. 修改轨道已选部分颜色 */
  :deep(.el-slider__bar) {
    height: 2px;
    background-color: #3f80f7; /* 渐变可改成 linear-gradient */
  }

  /* 3. 修改轨道未选部分颜色 */
  :deep(.el-slider__runway) {
    height: 2px;
    background-color: #3f80f733;
  }

  /* 4. 修改滑块（圆点）颜色和大小 */
  :deep(.el-slider__button) {
    background-color: #3f80f7;
    border: 2px solid #3f80f7;
    width: 6px;
    height: 6px;
  }
  :deep(.el-slider__button-wrapper) {
    top: 50%;
    transform: translate(-50%, -50%); /* 水平垂直都居中 */
  }
}
</style>
