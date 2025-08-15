<template>
  <el-popover
    v-model:visible="visible"
    popper-class="new-popover"
    placement="bottom-start"
    :width="320"
    trigger="click"
    :teleported="false"
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
        <span class="text-12px color-[--d-8CA0C3-l-566275]">{{ $t('mc/vol') }}</span>
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

      <div class="mt-20px border-b border-##333333 pb-20px">
        <span class="text-12px color-[--d-8CA0C3-l-566275]">{{ $t('sell/buy') }}</span>
        <div class="tabs flex-wrap mt-10px">
          <button
            v-for="item in list_swap"
            :key="item.size"
            class="flex-1 small"
            :class="{ active: item.size === activeFontSize}"
            type="button"
            @click.stop="switchSwap(item)"
          >
            <div
              class="swap flex-start"
              :style="{ 'font-size': getSwapSize(item.size as Size)?.text }"
            >
              <Icon
                class="mr-4px"
                :style="{ 'font-size': getSwapSize(item.size as Size)?.flash }"
                name="mynaui:lightning-solid"
              />
              <el-image
                style="border-radius: 50%; margin-right: 5px"
                :style="{ width: getSwapSize(item.size as Size).amm }"
                :src="`${token_logo_url}chain/${props.chain}.png`"
              />
              0.01
            </div>

            <span class="block text-12px mt-8px">{{ item.name || '' }}</span>
          </button>

          <div class="slider-wrapper">
            <el-slider
              v-model="defineFontsize"
              :disabled="activeFontSize== 'small' || activeFontSize== 'medium'  ||  activeFontSize== 'large'"
              :min="14"
              :max="24"
              :step="1"
              :format-tooltip="formatTooltip"
            />
          </div>
        </div>
      </div>
      <ul class="item border-b border-##333333 pb-20px">
        <li @click="pumpSetting.show_search = !pumpSetting.show_search">
          <template v-if="pumpSetting.show_search">
            <Icon name="custom:show-search" class="text-12px mr-8px" />
            {{ $t('showSearch') }}
          </template>
          <template v-else>
            <Icon name="custom:search" class="text-12px mr-8px" />{{
              $t('hideSearch')
            }}</template
          >
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
            {{ $t('circleTokenImage') }}
          </template>
          <template v-else>
            <Icon name="custom:avatar-rect" class="text-12px mr-8px" />
            {{ $t('rectTokenImage') }}</template
          >
        </li>
        <li @click="pumpSetting.isGutter = !pumpSetting.isGutter">
          <template v-if="pumpSetting.isGutter">
            <Icon name="custom:gutter-big" class="text-12px mr-8px" />
            {{ $t('looseColumns') }}
          </template>
          <template v-else>
            <Icon name="custom:gutter-small" class="text-12px mr-8px" />{{
              $t('compactColumns')
            }}</template
          >
        </li>
        <li @click="pumpSetting.isRight = !pumpSetting.isRight">
          <Icon name="custom:right-key" class="text-12px mr-8px" />
          <template v-if="pumpSetting.isRight"> {{ $t('newTabRightClick') }} </template>
          <template v-else>{{ $t('noNewTabRightClick') }}</template>
        </li>
        <li @click="pumpSetting.isBlacklist = !pumpSetting.isBlacklist">
          <template v-if="pumpSetting.isBlacklist">
            <Icon name="custom:key-invisible" class="text-12px mr-8px" />
            {{ $t('hideBlackList') }}
          </template>
          <template v-else>
            <Icon name="custom:key-visible" class="text-8px mr-8px" />{{
              $t('showBlackList')
            }}</template
          >
        </li>
      </ul>
      <div>
        <span class="text-12px color-[--d-566275-l-8CA0C3]">{{ $t('defineCard') }}</span>
        <div class="tabs define mt-10px">
          <el-button
            v-for="(item, index) in defineList"
            :key="index"
            class="btn"
            :class="pumpSetting.define?.includes(item.id) ? 'active' : ''"
            @click="dealDefine(item)"
            >{{ item.name }}</el-button
          >
        </div>
      </div>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { getSwapSize } from '@/utils/index'
import { useLocalStorage } from '@vueuse/core'
import type { Size } from '~/api/types/pump'

const props = withDefaults(
  defineProps<{
    chain: string
  }>(),
  {}
)
const { t } = useI18n()
const visible = shallowRef(false)
const isRotate = shallowRef(false)
const globalStore = useGlobalStore()
const { pumpSetting, token_logo_url } = storeToRefs(globalStore)
const defineFontsize = useLocalStorage('defineFontsize', 14)
const activeFontSize = useLocalStorage('activeFontSize','medium')

const list_mc = computed(() => {
  return [
    {
      size: '14px',
      name: t('convention'),
    },
    {
      size: '18px',
      name: t('large'),
    },
  ]
})
const list_swap = computed(() => {
  return [
    {
      size: 'small',
      name: t('convention'),
      value: 10
    },
    {
      size: 'medium',
      name: t('large'),
      value: 14
    },
    {
      size: 'large',
      name: t('largest'),
      value: 16
    },
    {
      size: 'define',
      name: t('define'),
    },
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
    { name: t('cabal'), id: 'cabal' },
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


watch(defineFontsize, (newval) => {
  if (activeFontSize.value == 'define') {
    pumpSetting.value.size_swap =(newval + 'px')
  }
})
function switchProgress() {
  if (pumpSetting.value.Progress_isCircle == 'circle') {
    pumpSetting.value.Progress_isCircle = 'horizontal'
  } else {
    pumpSetting.value.Progress_isCircle = 'circle'
  }
}
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
function switchSwap(item: { size: string,value: number }) {
  activeFontSize.value = item.size
  if (item.size !== 'define') {
    pumpSetting.value.size_swap = item.value + 'px'
    defineFontsize.value = 14
  }
}
function formatTooltip(val: number) {
  return `${val}px`
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
      border: 1px solid var(--d-252E3C-l-E8F1FF);
      background: transparent;
      color: var(--d-566275-l-8CA0C3);
      margin-left: 0;
      padding: 4px;
      &.active {
      color: var(--d-8CA0C3-l-566275);
      background: var(--d-151A22-l-E8F1FF);
    }
    }
  }

  button {
    border: 1px solid var(--d-151A22-l-E8F1FF);
    // font-size: 14px;
    color: var(--d-8CA0C3-l-566275);
    letter-spacing: 0;
    font-weight: 400;
    cursor: pointer;
    border-radius: 4px;
    background: transparent;
    padding: 14px;
    text-align: center;
    &.small {
      padding: 8px;
      flex: 1 0 64px;
    }
    // & + button {
    //   margin-left: 8px;
    // }
    &.active {
      color: var(--d-F5F5F5-l-333);
      background: var(--d-151A22-l-E8F1FF);
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
  background: var(--d-151A22-l-E8F1FF);
  padding: 3px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 12px;
  font-weight: 500;
  color: var(--d-8CA0C3-l-566275);
  &.active,
  &:hover {
    color: var(--d-F5F5F5-l-333);
  }
}
.item {
  li {
    color: var(--d-F5F5F5-l-0B0D12);
    margin-top: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
}

/* 1. 控制整体宽度 */
.slider-wrapper {
  width: 60%; /* 改这里就是滑块长度 */
  margin-left: 20px;
  /* 2. 修改轨道已选部分颜色 */
  :deep(.el-slider__bar) {
    height: 2px;
    background-color: #3f80f7; /* 渐变可改成 linear-gradient */
  }

  /* 3. 修改轨道未选部分颜色 */
  :deep(.el-slider__runway) {
    height: 2px;
    background-color: var(--d-151A22-l-E8F1FF);
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
