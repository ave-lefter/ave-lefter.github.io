<template>
  <div
    class="bg-[--secondary-bg] flex-1 w-100% px-200px pt-40px overflow-y-auto bot-manage"
    style="height: calc(100vh - 150px)"
  >
    <div class="mb-8px flex-between items-center">
      <span class="text-16px font-500">{{ $t('walletList') }}</span>
      <span
        v-if="currentAddress"
        class="text-16px font-500 color-[--third-text] ml-40px cursor-pointer"
        @click="getWalletOperationRecord"
        >{{ $t('operateHistory') }}</span
      >
      <div class="flex-1"></div>

      <el-button
        v-if="currentAddress"
        class="text-12px"
        size="small"
        @click.stop.prevent="handleClick"
        :disabled="isDisabled"
      >
        <span v-if="countdown > 0">{{ countdown }}S</span>
        <Icon v-else name="material-symbols:sync-outline" class="text-12px" />
      </el-button>
      <el-button
        v-if="currentAddress"
        class="text-12px"
        size="small"
        type="primary"
        @click.stop.prevent="generateWallet"
        :loading="loadingCreate"
        ><Icon name="custom:wallet-fill" class="text-12px mr-4px" />{{
          $t('createWallet')
        }}</el-button
      >
      <el-button
        v-if="currentAddress"
        class="text-12px"
        size="small"
        @click.stop.prevent="showImport = true"
        ><Icon name="mingcute:new-folder-fill" class="text-102x mr-4px" />{{
          $t('importWallet')
        }}</el-button
      >
    </div>
    <List :tableData="tableData" :loading="loading" @refresh="refresh" />
    <Import @refresh="refresh" />
    <Record :tableData="recordList" :loading="loadingRecord" />
    <!-- 创建完成展示助记词 -->

    <el-dialog
      v-model="dialogVisible"
      width="500"
      height="630"
      :class="['dialog-connect1', theme]"
      append-to-body
      :close-on-click-modal="false"
      :show-close="false"
    >
      <template #header>
        <div class="flex-between">
        <span class="text-24px">{{ $t('mnemonic') }}</span>
        <Icon name="material-symbols-light:close" class="text-30px cursor-pointer" @click.stop.prevent="dialogVisible = false"></Icon>
        </div>
      </template>
      <div class="relative min-h-160px" @click="hide = false">
        <div
          class="mask text-center color-[--main-text] absolute bg-[--border] top-0 right-0 left-0 bottom-0 flex items-center justify-center z-1 text-14px cursor-pointer"
          v-if="hide"
        >
          <Icon name="custom:show-code" class="text-16px mr-4px color-[--main-text]" />
          {{ $t('clickMnemonic') }}
        </div>
        <div class="grid grid-cols-3 gap-2 mt-30px">
          <div
            class="mnemonic-item block border border-solid border-[--dialog-divider] py-8px text-center relative"
            v-for="(item, $index) in mnemonic"
            :key="$index"
          >
            <span
              class="color-[--third-text] rounded-4px text-10px px-4px py-1px overflow-hidden text-ellipsis whitespace-nowrap max-w-100px line-height-15px absolute left-2px top-2px"
              >{{ $index + 1 }}</span
            >
            {{ item }}
          </div>
        </div>
      </div>
      <div class="text-center mt-30px flex-between">
        <el-button class="flex-1" style="height: 48px" v-copy="mnemonic?.join(' ')" @click.stop.prevent >
          {{ $t('copyMnemonic') }}
        </el-button>
        <el-button class="flex-1" style="height: 48px" type="primary" @click.stop.prevent="goOn">
          {{ $t('continue') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import List from './list.vue'
import Import from './import.vue'
import Record from './record.vue'
import {
  _getMultiWalletsAllChain,
  _generateWallet,
  _getWalletOperationRecord,
  type Wallet,
  type Records,
} from '@/api/botManage'
import { ElMessage } from 'element-plus'
import { decryptMsg } from '@/utils/index'
import { useStorage, useThrottleFn, useDebounceFn } from '@vueuse/core'
import { Warning } from '@element-plus/icons-vue'
import { markRaw } from 'vue'
defineExpose({
  getMultiWalletsAllChain,
})
const { t } = useI18n()
const { showImport, mode, showBotRecord } = storeToRefs(useGlobalStore())
const { theme, isDark } = storeToRefs(useThemeStore())
const botStore = useBotStore()
const loadingCreate = shallowRef(false)
const dialogVisible = shallowRef(false)
const hide = shallowRef(true)
const encryptedMnemonic = useStorage('encryptedMnemonic', '', sessionStorage)
const loading = shallowRef(false)
const tableData = ref<Wallet[]>([])
const recordList = ref<Records[]>([])
const loadingRecord = shallowRef(false)
const loadingThrottledFn = shallowRef(false)
const countdown = ref(0)
const isDisabled = ref(false)
let timer: ReturnType<typeof setInterval> | null = null
const mnemonic = computed(() => {
  const msg = encryptedMnemonic.value || ''
  const guid = botStore?.userInfo?.tgUid || ''
  if (msg && guid) {
    const str = decryptMsg(msg, guid)
    return str.split(' ') || []
  } else {
    return []
  }
})
const currentAddress = computed(() => botStore?.evmAddress || '')
watch(
  () => currentAddress.value,
  (val) => {
    if (val) {
      getMultiWalletsAllChain()
    } else {
      tableData.value = []
      recordList.value = []
    }
  }
)
// const mergeTableData = computed(() => {
//   return tableData.value.map((item) => {
//     const addrList = item.balancesInfo || []
//     const matchGroup = botStore?.walletList?.find((w) => w.evmAddress === item.evmAddress)
//     if (!matchGroup) return item
//     const updatedList = addrList.map((addr) => {
//       const match = matchGroup.addresses.find(
//         (a) => a.chain === addr.chain && a.address === addr.address
//       )
//       return match
//         ? { ...addr, balance: Number(match.balance) * Number(match.price) } // balance 替换
//         : addr
//     })
//     return {
//       ...item,
//       balance: updatedList?.reduce((sum, item) => sum + Number(item.balance), 0),
//       balancesInfo: updatedList,
//     }
//   })
// })

onMounted(() => {
  getMultiWalletsAllChain()
  if (timer) clearInterval(timer)
})
// const throttledFn = useThrottleFn(() => {
// loadingThrottledFn.value = true
//   getMultiWalletsAllChain()
// }, 60000)
// const debouncedFetch = useDebounceFn(()=>getMultiWalletsAllChain(), 60000)

function handleClick() {
  if (isDisabled.value) return
  getMultiWalletsAllChain()
  // 启动倒计时
  startCountdown(10)
}
const startCountdown = (seconds: number) => {
  countdown.value = seconds
  isDisabled.value = true

  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer!)
      timer = null
      isDisabled.value = false
    }
  }, 1000)
}

function getWalletOperationRecord() {
  loadingRecord.value = true
  _getWalletOperationRecord()
    .then((res) => {
      recordList.value = res
      showBotRecord.value = true
    })
    .catch((err) => {
      ElMessage.error(err)
    })
    .finally(() => {
      loadingRecord.value = false
    })
}
function getMultiWalletsAllChain() {
  return new Promise((resolve, reject) => {
    loading.value = true
    const isSupportChains = botStore.isSupportChains
    _getMultiWalletsAllChain(isSupportChains?.join(','))
      .then((res) => {
        console.log('------111--------')
        tableData.value = Array.isArray(res)
          ? res?.map((item, index) => ({
              id: `parent-${index}`,
              tgUid: item.tgUid,
              address: item.tgUid,
              name: item.name,
              source: item.source,
              operate: 'delete',
              genSource: item.genSource,
              evmAddress: item.balancesInfo?.filter((i) => i.chain == 'bsc')?.[0]?.address || '',
              balance: item?.balancesInfo?.reduce((sum, item) => sum + Number(item.balance), 0),
              mainTokenBalance: item?.balancesInfo?.reduce(
                (sum, item) => sum + Number(item.mainTokenBalance),
                0
              ),
              usdcTokenBalance: item?.balancesInfo?.reduce(
                (sum, item) => sum + Number(item.usdcTokenBalance),
                0
              ),
              usdtTokenBalance: item?.balancesInfo?.reduce(
                (sum, item) => sum + Number(item.usdtTokenBalance),
                0
              ),
              balancesInfo: item.balancesInfo?.map((addr, i) => {
                return {
                  ...addr,
                  id: `child-${index}-${i}`,
                  name: addr.address,
                  operate: 'deposit',
                  isChildren: true,
                }
              }),
            }))
          : []
        resolve(tableData.value)
      })
      .catch((err) => {
        ElMessage.error(err)
        reject([])
      })
      .finally(() => {
        loading.value = false
        loadingThrottledFn.value = false
      })
  })
}
function generateWallet() {
  // if (tableData.value?.length >= 10) {
  //   ElMessage.error(t('createTips'))
  //   return
  // }
  loadingCreate.value = true
  _generateWallet()
    .then((res) => {
      encryptedMnemonic.value = res?.Mnemonic
      ElMessage.success(t('success'))
      hide.value = true
      dialogVisible.value = true
      refresh()
    })
    .catch((err) => {
      ElMessage.error(String(err))
    })
    .finally(() => {
      loadingCreate.value = false
    })
}

function refresh() {
  //刷新列表
  getMultiWalletsAllChain()
  // botStore.getUserInfo()
}
const goOn = () => {
  ElMessageBox.confirm(t('lastChance'), t('tips'), {
    type: 'warning',
    icon: markRaw(Warning),
    confirmButtonText: t('saved'),
    cancelButtonText: t('cancel'),
    customClass: `${mode.value} delete_confirm`,
  })
    .then(() => {
      encryptedMnemonic.value = ''
      dialogVisible.value = false
    })
    .catch((err) => {})
}
</script>

<style lang="scss" scoped>
</style>
