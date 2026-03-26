<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import {formatImgUrl} from '~/utils'

const emit = defineEmits(['update:userIds'])
defineProps({
  userIds: {
    type: Array,
    default: () => []
  }
})
const botStore = useBotStore()
const walletStore = useWalletStore()
const themeStore = useThemeStore()
const visible = shallowRef(false)
const options = computed(() => {
  return botStore.evmAddress?useBotStore().isSupportChains:botStore.isSupportEvmChains
})
const selectedChains = useLocalStorage<string[]>('positionsSelectedChains', [])

const selectedChainDisplay=shallowRef<string[]>([])
const displayChains = ref<string[]>([])
const displayLen=ref(0)
onMounted(() => {
  nextTick(() => {
    if(!selectedChains.value.length){
      selectedChains.value = botStore.evmAddress ? ['bsc', 'solana'] : ['bsc', 'base', 'eth']
    }
    displayChains.value=selectedChains.value.slice(0, 2)
    selectedChainDisplay.value=displayChains.value
    displayLen.value=selectedChains.value.length
  })
})
function getDisabled(val: string) {
  return selectedChainDisplay.value.length >= 6 && !selectedChainDisplay.value.includes(val)
}

function onConfirm() {
  let arr: string[] = []
  displayChains.value=[]
  if (botStore.userInfo && Array.isArray(botStore.userInfo.addresses)) {
    botStore.userInfo.addresses.map((el,index) => {
      if (selectedChainDisplay.value.includes(el.chain)) {
        arr.push(el.address + '-' + el.chain)
        if(displayChains.value.length<2) displayChains.value.push(el.chain)
      }
    })
    emit('update:userIds', arr)
  }else{
    arr =selectedChainDisplay.value.map(i => walletStore.address + '-' + i)
    displayChains.value=selectedChainDisplay.value.slice(0, 2)
    emit('update:userIds', arr)
  }
  selectedChains.value=selectedChainDisplay.value
  displayLen.value=arr.length||0
  visible.value = false
}

watch(
  () => visible.value,
  () => {
    if (visible.value) {
      selectedChainDisplay.value = selectedChains.value
    }
  }
)

/**
 * Cancel the net select popover.
 */
function onCancel() {
  visible.value = false
}
</script>

<template>
  <div class="flex">
    <el-popover
      ref="popoverRef"
      v-model:visible="visible"
:persistent="false"
      placement="bottom"
      trigger="click"
      :popper-style="{ padding: '15px',width: 'auto', minWidth: '164px' }"
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
            <span class="inline-block bg-[#333] text-[#fff] min-w-14px h-14px lh-14px text-12px ml-4px border-rd-4px">{{ displayLen }}</span>
          </el-button>
        </div>
      </template>
      <div
          class="color-#f5f5f5 [--el-checkbox-checked-bg-color:#000] [--el-checkbox-checked-input-border-color:#000] checkbox-container"
      >
        <el-scrollbar height="130px">
          <el-checkbox-group
            v-model="selectedChainDisplay"
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
        </el-scrollbar>
        <div class="mt-12px flex justify-between">
          <el-button
            :key="themeStore.theme"
            size="small"
            class="h-30px min-w-60px"
            color="var(--border)"
            @click="onCancel"
          >
            {{ $t('cancel') }}
          </el-button>
          <el-button
            size="small" type="primary"
            class="h-30px min-w-60px"
            :disabled="selectedChainDisplay.length === 0"
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
