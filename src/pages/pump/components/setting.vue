<template>
  <el-popover
    :visible="visible"
    @update:visible="updateVisible"
    popper-class="new-popover"
    placement="bottom"
    :width="488"
    trigger="click"
    :teleported="false"
    :persistent="false"
  >
    <template #reference>
      <slot :visible="visible">
        <el-button class="btn mr-8px h-28px" :class="{ active: isExit }">
          <Icon name="custom:customized" class="text-13px" />
          <Icon
            :name="visible ? 'radix-icons:triangle-up' : 'radix-icons:triangle-down'"
            class="text-16px ml-4px"
          />
        </el-button>
      </slot>
    </template>
    <template #default>
        <div class="">
          <div class="text-14px font-medium pb-12px border-b border-b-solid border-b-[--border] lh-16px">{{ $t('customSetting') }}</div>
          <div class="   border-b-1px border-b-solid border-b-[var(--border)]">
            <div class="tabs switchTabs">
              <button
                v-for="item in list_tabs"
                :key="item.id"
                :class="{ active: item.id === activeTab }"
                type="button"
                @click.stop="activeTab = item.id"
              >
                <span class="text-14px">{{ item.name || '' }}</span>
              </button>
            </div>
          </div>
        <el-scrollbar :height="scrollHeight"  class="hidden-scrollbar">
          <div class="mt-12px">
            <template v-if="activeTab == 1">
              <div class="border-b border-[--dialog-divider] pb-20px">
                <!-- <span class="text-12px color-[--secondary-text]">{{ $t('sell/buy') }}</span> -->
                <div class="tabs flex-wrap">
                  <!-- 普通尺寸按钮（排除 define） -->
                  <button
                    v-for="item in list_swap.filter(i => i.size !== 'define')"
                    :key="item.size"
                    class="flex-1 small"
                    :class="{ active: item.size === activeFontSize }"
                    type="button"
                    @click.stop="switchSwap(item)"
                  >
                    <div class="swap flex items-center justify-center">
                      <Icon
                        class="mr-4px"
                        :style="{ 'font-size': item.value + 'px' }"
                        name="mynaui:lightning-solid"
                      />
                      0.01
                    </div>
                    <span class="block text-12px mt-8px">{{ item.name || '' }}</span>
                  </button>
                  <!-- 常住 slider 行，点击激活自定义模式 -->
                  <div
                    v-if="activeFontSize !== 'large'"
                    class="define-slider-row w-full mt-10px"
                    :class="{ active: activeFontSize === 'define' }"
                    @click.stop="switchSwap({ size: 'define' })"
                  >
                    <span class="text-12px shrink-0 mr-12px define-label">{{ $t('define') }}</span>
                    <div class="slider-wrapper flex-1" @click.stop>
                      <el-slider
                        v-model.lazy="defineProgress"
                        :format-tooltip="formatTooltip"
                      />
                    </div>
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
              <div class="flex-start py-12px border-b border-b-solid border-b-[--border] lh-16px border-t border-t-solid border-t-[--border]">
                <span>{{ $t('swapButtonColor') }}</span>
                <span class="flex-1"></span>
                <div ref="el">
                  <el-color-picker
                    v-model="pumpSetting.swapColor"
                    persistent
                    append-to="body"
                    :teleported="true"
                    @blur="isColor = false"
                    @focus="isColor = true"
                  />
                </div>
                <Icon
                  name="custom:refresh"
                  class="color-[--third-text] text-12px ml-5px cursor-pointer"
                  @click.stop.prevent="pumpSetting.swapColor ='#12B886'"
                />
              </div>
              <ul class="item pb-20px border-b-0.5px border-b-solid border-b-[var(--border)] text-12px lh-16px">
                <li>
                  <Icon name="custom:vol" class="mr-8px" />
                  <span>{{ $t('mc/vol') }}</span>
                  <span class="flex-1"></span>
                  <div class="tabs pill-group">
                    <button
                      v-for="item in list_mc"
                      :key="item.size"
                      class="flex-1"
                      :class="{ active: item.size === pumpSetting.fontSize_mc }"
                      type="button"
                      @click.stop="pumpSetting.fontSize_mc = item.size"
                    >
                      <span>{{ item.name }}</span>
                    </button>
                  </div>
                </li>
                <li>
                  <template v-if="pumpSetting.show_search">
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
                  </template>
                  <Icon v-else name="custom:search1" class="mr-8px" />
                  <span>{{ $t('searchBar') }}</span>
                  <span class="flex-1"></span>
                  <div class="tabs pill-group">
                    <button
                      class="flex-1"
                      :class="{ active: pumpSetting.show_search }"
                      type="button"
                      @click.stop="pumpSetting.show_search = true"
                    >
                      <span>{{ $t('display') }}</span>
                    </button>
                    <button
                      class="flex-1"
                      :class="{ active: !pumpSetting.show_search }"
                      type="button"
                      @click.stop="pumpSetting.show_search = false"
                    >
                      <span>{{ $t('hidden') }}</span>
                    </button>
                  </div>
                </li>
                <li>
                  <Icon :name="`${pumpSetting.isLang ? 'custom:auto-translation' : 'custom:auto-translation-hide'}`"class="mr-8px" :class="pumpSetting.isLang ? 'text-12px' : 'text-11px'"/>
                  <span>{{ $t('autoTranslation') }}</span>
                  <span class="flex-1"></span>
                  <div class="tabs pill-group">
                    <button
                      class="flex-1"
                      :class="{ active: pumpSetting.isLang }"
                      type="button"
                      @click.stop="pumpSetting.isLang = true"
                    >
                      <span>{{ $t('on') }}</span>
                    </button>
                    <button
                      class="flex-1"
                      :class="{ active: !pumpSetting.isLang }"
                      type="button"
                      @click.stop="pumpSetting.isLang = false"
                    >
                      <span>{{ $t('off') }}</span>
                    </button>
                  </div>
                </li>
                <li>
                  <Icon :name="pumpSetting.Progress_isCircle === 'horizontal' ? 'custom:progress-horizontal' : 'custom:progress-circle'" class="mr-8px"  :class="pumpSetting.Progress_isCircle === 'horizontal' ? 'text-2px' : 'text-12px'"/>
                  <span>{{ $t('progress') }}</span>
                  <span class="flex-1"></span>
                  <div class="tabs pill-group">
                    <button
                      class="flex-1"
                      :class="{ active: pumpSetting.Progress_isCircle === 'horizontal' }"
                      type="button"
                      @click.stop="pumpSetting.Progress_isCircle = 'horizontal'"
                    >
                      <span>{{ $t('bar') }}</span>
                    </button>
                    <button
                      class="flex-1"
                      :class="{ active: pumpSetting.Progress_isCircle === 'circle' }"
                      type="button"
                      @click.stop="pumpSetting.Progress_isCircle = 'circle'"
                    >
                      <span>{{ $t('ring') }}</span>
                    </button>
                  </div>
                </li>

                <li>
                  <Icon :name="`${pumpSetting.avatar_isCircle == 'circle' ? 'custom:avatar-circle' : 'custom:avatar-rect'}`" class="mr-8px" />
                  <span>Logo</span>
                  <span class="flex-1"></span>
                  <div class="tabs pill-group">
                    <button
                      class="flex-1"
                      :class="{ active: pumpSetting.avatar_isCircle === 'circle' }"
                      type="button"
                      @click.stop="pumpSetting.avatar_isCircle = 'circle'"
                    >
                      <span>{{ $t('circle') }}</span>
                    </button>
                    <button
                      class="flex-1"
                      :class="{ active: pumpSetting.avatar_isCircle === 'rect' }"
                      type="button"
                      @click.stop="pumpSetting.avatar_isCircle = 'rect'"
                    >
                      <span>{{ $t('square') }}</span>
                    </button>
                  </div>
                </li>

                <li>
                  <Icon :name="`${pumpSetting.isInt? 'custom:int' : 'custom:dot'}`" class="mr-8px" />
                  <span>{{ $t('decimalsDisplay') }}</span>
                  <span class="flex-1"></span>
                  <div class="tabs pill-group">
                    <button
                      class="flex-1"
                      :class="{ active: !pumpSetting.isInt }"
                      type="button"
                      @click.stop="pumpSetting.isInt = false"
                    >
                      <span>{{ $t('display') }}</span>
                    </button>
                    <button
                      class="flex-1"
                      :class="{ active: pumpSetting.isInt }"
                      type="button"
                      @click.stop="pumpSetting.isInt = true"
                    >
                      <span>{{ $t('hidden') }}</span>
                    </button>
                  </div>
                </li>
                <li>
                  <Icon name="custom:gutter" class="mr-8px text-11px" />
                  <span>{{ $t('columns') }}</span>
                  <span class="flex-1"></span>
                  <div class="tabs pill-group">
                    <button
                      class="flex-1"
                      :class="{ active: pumpSetting.isGutter }"
                      type="button"
                      @click.stop="pumpSetting.isGutter = true"
                    >
                      <span>{{ $t('looseColumns') }}</span>
                    </button>
                    <button
                      class="flex-1"
                      :class="{ active: !pumpSetting.isGutter }"
                      type="button"
                      @click.stop="pumpSetting.isGutter = false"
                    >
                      <span>{{ $t('compactColumns') }}</span>
                    </button>
                  </div>
                </li>
                <li>
                  <Icon name="custom:right-key" class="mr-8px text-15px" />
                  <span>{{ $t('newTabRightClick') }}</span>
                  <span class="flex-1"></span>
                  <div class="tabs pill-group">
                    <button
                      class="flex-1"
                      :class="{ active: !pumpSetting.isRight }"
                      type="button"
                      @click.stop="pumpSetting.isRight = false"
                    >
                      <span>{{ $t('notOpen') }}</span>
                    </button>
                    <button
                      class="flex-1"
                      :class="{ active: pumpSetting.isRight }"
                      type="button"
                      @click.stop="pumpSetting.isRight = true"
                    >
                      <span>{{ $t('newTab') }}</span>
                    </button>
                  </div>
                </li>

                <li>
                  <Icon :name="`${pumpSetting.isBlacklist? 'custom:key-invisible' : 'custom:key-visible'}`" class="mr-8px" :class="`${pumpSetting.isBlacklist? 'text-12px' : 'text-10px'}`" />
                  <span>{{ $t('blockToken') }}</span>
                  <span class="flex-1"></span>
                  <div class="tabs pill-group">
                    <button
                      class="flex-1"
                      :class="{ active: !pumpSetting.isBlacklist }"
                      type="button"
                      @click.stop="pumpSetting.isBlacklist = false"
                    >
                      <span>{{ $t('display') }}</span>
                    </button>
                    <button
                      class="flex-1"
                      :class="{ active: pumpSetting.isBlacklist }"
                      type="button"
                      @click.stop="pumpSetting.isBlacklist = true"
                    >
                      <span>{{ $t('hidden') }}</span>
                    </button>
                  </div>
                </li>
                <li>
                  <Icon name="custom:copy-plain" class="mr-8px" />
                  <span>{{ $t('similarTokens') }}</span>
                  <span class="flex-1"></span>
                  <div class="tabs pill-group">
                    <button
                      class="flex-1"
                      :class="{ active: pumpSetting.isSimilarTokens }"
                      type="button"
                      @click.stop="pumpSetting.isSimilarTokens = true"
                    >
                      <span>{{ $t('display') }}</span>
                    </button>
                    <button
                      class="flex-1"
                      :class="{ active: !pumpSetting.isSimilarTokens }"
                      type="button"
                      @click.stop="pumpSetting.isSimilarTokens = false"
                    >
                      <span>{{ $t('hidden') }}</span>
                    </button>
                  </div>
                </li>
                <li>
                  <Icon name="custom:forward" class="mr-8px" />
                  <span>{{ $t('detailsAfterPurchase') }}</span>
                  <span class="flex-1"></span>
                  <div class="tabs pill-group">
                    <button
                      class="flex-1"
                      :class="{ active: pumpSetting.jump ==='open' }"
                      type="button"
                      @click.stop="pumpSetting.jump = 'open'"
                    >
                      <span>{{ $t('newTab') }}</span>
                    </button>
                    <button
                      class="flex-1"
                      :class="{ active: pumpSetting.jump === 'close' }"
                      type="button"
                      @click.stop="pumpSetting.jump = 'close'"
                    >
                      <span>{{ $t('notOpen') }}</span>
                    </button>
                    <button
                      class="flex-1"
                      :class="{ active: pumpSetting.jump === 'open_jump' }"
                      type="button"
                      @click.stop="pumpSetting.jump = 'open_jump'"
                    >
                      <span>{{ $t('jump') }}</span>
                    </button>
                  </div>
                </li>

              </ul>
            </template>
            <div v-if="activeTab == 2">
              <span class="text-12px color-[--main-text] mt-12px block">{{ $t('defineData') }}</span>
              <div class="tabs define mt-12px mb-12px" >
                <el-button
                  v-for="(item, index) in defineList"
                  :key="index"
                  class="btn"
                  :class="pumpSetting.define?.includes(item.id) ? 'active' : ''"
                  @click="dealDefine(item)"
                  >{{ item.name }}</el-button
                >
              </div>
              <Data @blur="isColor = false" @focus="isColor = true"/>
            </div>
            <div v-if="activeTab == 3">
              <Bg :pumpConfig="pumpConfig" :chain="chain" @blur="isColor = false" @focus="isColor = true"/>
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
import { getPumpBgColor } from '@/utils/index'

import Data from './data.vue'
import Bg from './bg.vue'
import Grid from './grid.vue'
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
const { width } = useWindowSize()
const isColor = shallowRef(false)
const { t } = useI18n()
const visible = shallowRef(false)
const globalStore = useGlobalStore()
const { pumpSetting, token_logo_url, isDark, mode } = storeToRefs(globalStore)
const defineFontsize = useLocalStorage('defineFontsize', 15)
const defineProgress = useLocalStorage('defineProgress', 0)
const activeFontSize = useLocalStorage('activeFontSize', 'medium')
const activeTab = shallowRef(1)
const scrollHeight = ref(Math.max(window.innerHeight * 0.7, 500))

const list_mc = computed(() => {
  return [
    {
      size: '12px',
      name: t('mini'),
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
watch(mode, (val) => {
  visible.value = false
})
function switchProgress() {
  if (pumpSetting.value.Progress_isCircle == 'circle') {
    pumpSetting.value.Progress_isCircle = 'horizontal'
  } else {
    pumpSetting.value.Progress_isCircle = 'circle'
  }
}
function updateScrollHeight() {
  if (width.value >= 1920) {
    scrollHeight.value = Math.max(window.innerHeight * 0.7, 500)
  } else if (width.value >= 1200) {
    scrollHeight.value = Math.max(window.innerHeight * 0.6, 300)
  } else if (width.value >= 768) {
    scrollHeight.value = Math.max(window.innerHeight * 0.5, 200)
  } else {
    scrollHeight.value = Math.max(window.innerHeight * 0.5, 200)
  }
}
onMounted(() => {
  updateScrollHeight()
  window.addEventListener('resize', updateScrollHeight)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateScrollHeight)
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
function switchSwap(item: { size: string; value?: number }) {
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
  &.pill-group {
    gap: 0;
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0;
    button {
      border: none;
      border-radius: 6px;
      padding: 5px 18px;
      background: transparent;
      color: var(--secondary-text);
      min-width: 62px;
      white-space: nowrap;
      display: flex;
      align-items: center;
      justify-content: center;
      &.active {
        background: var(--border);
        color: var(--main-text1);
        border-radius: 4px;
      }
      // 选中第一个：保留左侧圆角，右侧方角
      // &:first-child.active {
      //   border-radius: 4px 0 0 4px;
      // }
      // // 选中最后一个：保留右侧圆角，左侧方角
      // &:last-child.active {
      //   border-radius: 0 4px 4px 0;
      // }
    }
  }
  &.define {
    flex-wrap: wrap;
    gap: 8px;
    justify-content: flex-start;
    button {
      border: 1px solid var(--d-1E1F23-l-E0ECFF);
      border-radius: 4px;
      color: var(--secondary-text);
      margin-left: 0;
      padding: 3px 8px;
      height: 28px;
      &.active {
        color: var(--main-text1);
        border: 1px solid var(--d-E2EEFF-l-1F242C);
      }
    }
  }
  &.switchTabs{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    button{
      background: transparent;
      padding: 12px 0;
      border: none;
      border-bottom: transparent solid 2px;
      &.active {
        color: var(--main-text1);
        background: transparent;
        border-bottom: var(--main-text1) solid 2px;
        border-radius:0px;
      }
      &+button{
        margin-left: 16px;
      }
    }
  }

  button {
    border: 1px solid var(--border);
    // font-size: 14px;
    color: var(--secondary-text);
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
      &.active {
        border: 1px solid var(--up-color);
        background: transparent;
      }
    }
    // & + button {
    //   margin-left: 8px;
    // }
    &.active {
      color: var(--main-text1);
      background: var(--border);
    }
    .swap {
      background: #12b886;
      border-radius: 4px;
      padding: 5px;
      color: var(--main-bg);
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
    color: var(--main-text1);
  }
}
.item {
  &.border {
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  li {
    color: var(--main-text1);
    margin-top: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
}

/* 常住 slider 行 */
.define-slider-row {
  border-radius: 8px;
  border: 1px solid var(--border);
  padding: 10px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: border-color 0.2s;
  &.active {
    border-color: var(--up-color);
    .define-label {
      color: var(--main-text1);
    }
  }
  .define-label {
    color: var(--secondary-text);
  }
}

/* 1. 控制整体宽度 */
.slider-wrapper {
  width: 100%;

  // margin-left: 20px;
  /* 2. 修改轨道已选部分颜色 */
  :deep(.el-slider__bar) {
    height: 6px;
    background-color: var(--up-color); /* 渐变可改成 linear-gradient */
  }

  /* 3. 修改轨道未选部分颜色 */
  :deep(.el-slider__runway) {
    height: 6px;
    background-color: #3f80f733;
  }

  /* 4. 修改滑块（圆点）颜色和大小 */
  :deep(.el-slider__button) {
    background-color: var(--up-color);
    border: 6px solid var(--up-color);
    width: 6px;
    height: 6px;
  }
  :deep(.el-slider__button-wrapper) {
    top: 50%;
    transform: translate(-50%, -50%); /* 水平垂直都居中 */
  }
}

/* setting popover 背景色与主背景一致 */
:deep(.new-popover) {
  background: var(--main-bg) !important;
}
</style>
