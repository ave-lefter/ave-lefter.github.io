<script setup lang="ts">
import {formatImgUrl} from '~/utils'

const emit = defineEmits(['update:userIds'])
defineProps({
  userIds: {
    type: Array,
    default: () => []
  }
})
const {userInfo} = storeToRefs(useBotStore())
const {isSupportChains} = useBotStore()
const visible = shallowRef(false)
const options = shallowRef(isSupportChains)
const selectedChains = shallowRef<string[]>([...isSupportChains])

const {isDark} = storeToRefs(useThemeStore())
const displayChains = computed(() => {
  return selectedChains.value.slice(0, 2)
})

function getDisabled(val: string) {
  return selectedChains.value.length <= 1 && selectedChains.value.includes(val)
}

function onConfirm() {
  if (userInfo.value && Array.isArray(userInfo.value.addresses)) {
    const arr: string[] = []
    userInfo.value.addresses.map(el => {
      if (selectedChains.value.includes(el.chain)) {
        arr.push(el.address + '-' + el.chain)
      }
    })
    emit('update:userIds', arr)
  }
  visible.value = false
}

function onCancel() {
  visible.value = false
}
</script>

<template>
  <div class="flex">
    <el-popover
      ref="popoverRef"
      v-model:visible="visible"
      placement="bottom"
      trigger="click"
      :popper-style="{ padding: '20px 16px',width: 'auto', minWidth: '164px' }"
    >
      <template
          #reference
      >
        <div>
          <el-button
            size="small"
            class="[&&]:px-3px [&&]:py-4px justify-between [--el-button-size:20px!important] [--el-button-font-weight: 400]"
          >
            <img
              v-for="(item, index) in displayChains"
              :key="item"
              height="14"
              :class="['rounded-50% mr--4px relative','z-'+(index+1), (index === displayChains.length - 1) && 'mr-0']"
              :src="formatImgUrl('chain',item)"
              alt="">
            <span class="inline-block bg-[#333] text-[#fff] min-w-14px h-14px lh-14px text-12px ml-4px border-rd-4px">{{ selectedChains.length }}</span>
          </el-button>
        </div>
      </template>
      <div
          class="pb-5px color-#f5f5f5 [--el-checkbox-checked-bg-color:#000] [--el-checkbox-checked-input-border-color:#000] checkbox-container"
      >
        <el-checkbox-group
          v-model="selectedChains"
        >
          <el-checkbox
            v-for="item in options" :key="item"
            :value="item"
            :disabled="getDisabled(item)"
            class="custom-checkbox"
          >
            {{ getChainInfo(item)?.name || item || '' }}
          </el-checkbox>
        </el-checkbox-group>
        <div class="mt-12px flex justify-between">
          <el-button
            size="small"
            class="h-30px min-w-60px [--el-button-font-weight: 400]"
            :color="isDark?'#333':'#f2f2f2'"
            @click="onCancel"
          >
            {{ $t('cancel') }}
          </el-button>
          <el-button
            size="small" type="primary"
            class="h-30px min-w-60px [--el-button-font-weight: 400]"
            :color="isDark?'#f5f5f5':'#222'"
            :disabled="selectedChains.length === 0"
            @click="onConfirm"
          >
            {{ $t('confirm') }}
          </el-button>
        </div>
      </div>
    </el-popover>
  </div>
</template>
<style lang="css" scoped>
.custom-checkbox {
  --at-apply: flex items-center h-32px m-0;
}
</style>
