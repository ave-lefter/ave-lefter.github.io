<template>
  <div
    class="bg-[--secondary-bg] flex-1 w-100% px-200px pt-40px overflow-y-auto bot-manage"
    style="height: calc(100vh - 150px)"
  >
    <div class="mb-8px flex-between items-center">
      <span class="text-16px font-500">{{ $t('walletList') }}</span>
      <span
        v-if="currentAddress"
        class="text-16px font-500 color-[--third-text] ml-40px"
        @click="getWalletOperationRecord"
        >{{ $t('archived') }}</span
      >
      <div class="flex-1"></div>
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
      :class="['dialog-connect', theme]"
      append-to-body
      :close-on-click-modal="false"
    >
      <span class="text-24px">{{ $t('mnemonic') }}</span>
      <div class="relative cursor-pointer min-h-160px" @click="hide = false">
        <div
          class="mask text-center color-[--main-text] absolute bg-[--border] top-0 right-0 left-0 bottom-0 flex items-center justify-center z-1 text-14px"
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
              class="color-[--third-text] rounded-4px text-10px px-4px py-1px overflow-hidden text-ellipsis whitespace-nowrap max-w-100px line-height-15px absolute  left-2px top-2px"
              >{{ $index + 1 }}</span
            >
            {{ item }}
          </div>
        </div>
      </div>
      <div class="text-center mt-30px">
        <el-button style="width: 30%" v-copy="mnemonic" @click.stop.prevent> 复制 </el-button>
        <el-button style="width: 30%" type="primary" @click.stop.prevent="goOn"> 继续 </el-button>
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
import { useStorage } from '@vueuse/core'
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
onMounted(() => {
  getMultiWalletsAllChain()
})
function getWalletOperationRecord() {
  loadingRecord.value = true
  _getWalletOperationRecord()
    .then((res) => {
      console.log('------getWalletOperationRecord------', res)
      recordList.value = res
      showBotRecord.value = true
    })
    .catch((err) => {
      ElMessage.error(String(err))
    })
    .finally(() => {
      loadingRecord.value = false
    })
}
function getMultiWalletsAllChain() {
  loading.value = true
  _getMultiWalletsAllChain()
    .then((res) => {
      tableData.value = Array.isArray(res)
        ? res?.map((item, index) => ({
            id: `parent-${index}`,
            address: item.tgUid,
            name: item.name,
            source: item.source,
            operate: 'delete',
            evmAddress: item.balancesInfo?.filter((i) => i.chain == 'bsc')?.[0]?.address || '',
            balance: item?.balancesInfo?.reduce((sum, item) => sum + Number(item.balance), 0),
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
    })
    .finally(() => {
      loading.value = false
    })
}
function generateWallet() {
  if (tableData.value?.length >= 10) {
    ElMessage.error(t('createTips'))
    return
  }
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
  botStore.getUserInfo()
}
const goOn = () => {
  ElMessageBox.confirm(t('lastChance'), t('tips'), {
    type: 'warning',
    confirmButtonText: t('saved'),
    cancelButtonText: t('cancel'),
    customClass: mode.value,
  })
    .then(() => {
      encryptedMnemonic.value = ''
      dialogVisible.value = false
    })
    .catch((err) => {})
}
</script>

<style lang="scss" scoped></style>
