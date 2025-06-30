<template>
  <el-popover
    v-model:visible="visible"
    placement="bottom-start"
    :width="320"
    trigger="click"
    :teleported="false"
  >
    <template #reference>
      <el-button class="btn mr-8px h-28px" :class="{active: isExit}">
        <Icon name="custom:customized" class="text-13px mr-4px" /> 定制
        <Icon
          :name="
            isRotate ? 'radix-icons:triangle-up' : 'radix-icons:triangle-down'
          "
          class="text-16px ml-4px"
        />
      </el-button>
    </template>
    <template #default>
      <div>
        <span class="text-12px color-[--d-999-l-666]">市值/成交额大小</span>
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
        <span class="text-12px color-[--d-999-l-666]">买卖按钮</span>
        <div class="tabs mt-10px">
          <button
            v-for="item in list_swap"
            :key="item.size"
            class="flex-1 small"
            :class="{ active: item.size === pumpSetting.size_swap }"
            type="button"
            @click.stop="switchSwap(item)"
          >
            <div class="swap flex-start" :style="{ 'font-size': getSwapSize(item.size as Size).text }"  >
              <Icon
                class="mr-4px "
                :style="{ 'font-size': getSwapSize(item.size as Size).flash }"
                name="mynaui:lightning-solid"
              />
              <el-image
                style="
                  border-radius: 50%;
                  margin-right: 5px;
                "
                :style="{width: getSwapSize(item.size as Size).amm }"
                :src="`${token_logo_url}chain/${props.chain}.png`"
              />
              0.01
            </div>

            <span class="block text-12px mt-8px">{{ item.name || '' }}</span>
          </button>
        </div>
      </div>
      <ul class="item border-b border-##333333 pb-20px">
        <li @click="switchProgress">
          <Icon
            v-if="pumpSetting.Progress_isCircle == 'horizontal'"
            name="custom:progress-horizontal"
            class="text-4px mr-8px"
          /><Icon
            v-else
            name="custom:progress-circle"
            class="text-12px mr-8px"
          />
          进度条
        </li>
        <li @click="switchAvatar">
          <template v-if="pumpSetting.avatar_isCircle == 'circle'">
            <Icon name="custom:progress-circle" class="text-12px mr-8px" />
            圆行代币图像
          </template>
          <template v-else>
            <Icon name="custom:avatar-rect" class="text-12px mr-8px" />
            方形代币图像</template
          >
        </li>
        <li @click="pumpSetting.isGutter = !pumpSetting.isGutter">
          <template v-if="pumpSetting.isGutter">
            <Icon name="custom:gutter-big" class="text-12px mr-8px" />
            分栏宽松
          </template>
          <template v-else>
            <Icon
              name="custom:gutter-small"
              class="text-12px mr-8px"
            />分栏紧凑</template
          >
        </li>
        <li @click="pumpSetting.isRight = !pumpSetting.isRight">
          <Icon name="custom:right-key" class="text-12px mr-8px" />
          <template v-if="pumpSetting.isRight"> 右键打开新标签 </template>
          <template v-else>右键不打开新标签</template>
        </li>
        <li @click="pumpSetting.isBlacklist = !pumpSetting.isBlacklist">
          <template v-if="pumpSetting.isBlacklist">
            <Icon name="custom:key-invisible" class="text-12px mr-8px" />
            隐藏拉黑代币
          </template>
          <template v-else>
            <Icon
              name="custom:key-visible"
              class="text-8px mr-8px"
            />展示拉黑代币</template
          >
        </li>
      </ul>
      <div>
        <span class="text-12px color-[--d-999-l-666]">自定义卡片</span>
        <div class="tabs define mt-10px">
          <el-button
            v-for="(item, index) in defineList"
            :key="index"
            class="btn"
            :class="pumpSetting.define?.includes(item.id) ? 'active': ''"
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
import type { Size } from '~/api/types/pump'
const props = withDefaults(defineProps<{
  chain: string
}>(), {

})

const visible = shallowRef(false)
const isRotate = shallowRef(false)
const globalStore = useGlobalStore()
const { pumpSetting, token_logo_url } = storeToRefs(globalStore)
const list_mc = computed(() => {
  return [
    {
      size: '12px',
      name: '常规',
    },
    {
      size: '14px',
      name: '大号',
    },
  ]
})
const list_swap = computed(() => {
  return [
    {
      size: 'small',
      name: '常规',
    },
    {
      size: 'medium',
      name: '大号',
    },
    {
      size: 'large',
      name: '超大号',
    },
  ]
})
const defineList = computed(() => {
  return [
    { name: '代币全称', id: 'name' },
    { name: '交易数', id: 'txs' },
    { name: '交易量', id: 'vol' },
    { name: '持有者', id: 'holder' },
    { name: '市值', id: 'mcap' },
    { name: '社交媒体', id: 'media' },
    { name: '聪明钱包', id: 'smart' },
    { name: 'KOL', id: 'kol' },
    { name: 'Top 10', id: 'top' },
    { name: 'DEV', id: 'dev' },
    { name: '迁移次数', id: '11' },
    { name: '跑路', id: 'rug' },
    { name: '捆绑', id: '22' },
    { name: '老鼠仓', id: '33' },
    { name: '狙击', id: 'sniper' },
    { name: '阴谋', id: '44' },
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
  console.log('------111--------------',localStorage.getItem('pumpSetting'))
  return localStorage.getItem('pumpSetting') !== undefined  || false
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
    const findIndex = pumpSetting.value.define?.findIndex(i => item.id == i)
    if (findIndex !== -1) {
      pumpSetting.value.define?.splice(findIndex,1)
    } else {
      pumpSetting.value.define?.push(item.id)
    }
  } else {
    pumpSetting.value.define = [item.id]
  }
  console.log(pumpSetting.value)
}
function switchSwap(item: { size: string }) {
  pumpSetting.value.size_swap = item.size
}

</script>

<style scoped lang="scss">
.tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  &.define {
    flex-wrap: wrap;
    gap: 8px;
    justify-content: flex-start;
    button {
      border: none;
      background: #333333;
      color: var(--d-666-l-FFFF);
      margin-left: 0;
      padding: 4px;
    }
  }

  button {
    border: 1px solid var(--d-333333-l-F2F2F2);
    // font-size: 14px;
    color: var(--d-999-l-666);
    letter-spacing: 0;
    font-weight: 400;
    cursor: pointer;
    border-radius: 4px;
    background: transparent;
    padding: 14px;
    text-align: center;
    &.small{
      padding: 8px;
    }
    & + button {
      margin-left: 8px;
    }
    &.active {
      color: var(--d-F5F5F5-l-333);
      background: var(--d-333333-l-DDDDDD);
    }
    .swap {
      background: #12b8861a;
      border-radius: 4px;
      padding: 5px;
      color: #12b886;
    }
  }
}
.btn {
  border: none;
  background: var(--d-222-l-F2F2F2);
  padding: 3px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 12px;
  font-weight: 500;
  color: var(--d-999-l-666);
  &.active,&:hover {
    color: var(--d-F5F5F5-l-333);
  }
}
.item {
  li {
    color: var(--d-FFF-l-0000);
    margin-top: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
}
</style>
