<template>
  <div
    v-if="showBatchAddressDetails"
    class="pop-right"
    @click="showBatchAddressDetails = false"
  >
    <div
      v-show="showBatchAddressDetails"
      class="content"
      style="flex: 1; max-width: 450px; overflow-y: auto; overflow-x: hidden"
      @click.stop.prevent
    >
      <div class="tabs">
        <div :class="tabActive !== 0 ? 'tab' : 'tab active'" @click="tabActive = 0">
          {{ $t('bulkImport') }}
        </div>
        <div
          :class="tabActive !== 1 ? 'tab' : 'tab active'"
          @click="
            () => {
              tabActive = 1
              handleBulkExportAttention()
            }
          "
        >
          {{ $t('bulkExport') }}
        </div>
        <div :class="tabActive !== 2 ? 'tab' : 'tab active'" @click="tabActive = 2">
          {{ $t('bulkDelete') }}
        </div>
        <Icon
          name="line-md:close"
          class="text-20px color-[--main-text]"
          @click="showBatchAddressDetails = false"
        />
      </div>
      <div v-if="tabActive === 0" class="import part">
        <p>{{ $t('bulkDesc1') }}</p>
        <div class="example">
          <!-- <div class="mr-5px">{{ $t('bulkExample') }}:</div> -->
          <!-- <div>
            <div>5meiN***8vGB:{{ $t('remark') }}1,</div>
            <div>G8oaP***eLgf:{{ $t('remark') }}2</div>
          </div> -->
        </div>
        <el-select
          v-model="activeChain"
          class="chains-select [&&]:[--el-fill-color-blank:--border]"
          placeholder="Select"
          size="large"
          style="width: 100%"
          :teleported="false"
          :suffix-icon="SuffixIcon"
        >
          <template #prefix>
            <img
              v-if="activeChain"
              height="24"
              class="mr-5px border-rd-[50%]"
              :src="`${token_logo_url}chain/${activeChain}.png`"
              style=""
              alt=""
              srcset=""
            />
          </template>
          <el-option
            v-for="item in SupportFullDataChain"
            :key="item"
            :label="getChainInfo(item)?.name"
            :value="item"
          >
            <div class="flex-start">
              <img
                v-if="item"
                height="24"
                class="mr-5px border-rd-[50%]"
                style="border-radius: 45%"
                :src="`${token_logo_url}chain/${item}.png`"
                alt=""
                srcset=""
              />
              <span>{{ getChainInfo(item)?.name || '' }}</span>
            </div>
          </el-option>
        </el-select>
        <textarea
          v-model="importStr"
          class="textarea"
          :placeholder="
            $t('bulkExample')+':\n'+
            '[\n'+
            '&nbsp;&nbsp; {\n'+
            '&nbsp;&nbsp;&nbsp;&nbsp; address:5meiN***8vGB \n'+
            '&nbsp;&nbsp;&nbsp;&nbsp; name: name2\n'+
            '&nbsp;&nbsp; },\n'+
            '&nbsp;&nbsp; {\n'+
            '&nbsp;&nbsp;&nbsp;&nbsp; address:G8oaP***eLgf \n'+
            '&nbsp;&nbsp;&nbsp;&nbsp; name: name2\n'+
            '&nbsp;&nbsp; }\n'+
            ']\n\n'+
            $t('or')+':\n'+
            '5meiN***8vGB: name1 \n'+
            'G8oaP***6vGA: name2 \n\n'
          "
          @input="validateInput"
        />
        <div class="error-message"><span v-if="!isValid">{{ errorMessage }}</span></div>
        <div class="button black" @click="getClipboardContent">{{ $t('paste') }}</div>
        <el-button
          class="width100 button"
          block
          size="large"
          type="primary"
          :disabled="!isValid"
          :loading="loading"
          @click.stop="handleBulkImportAttention"
        >
          {{ $t('confirm') }}
        </el-button>
      </div>
      <div v-else-if="tabActive === 1" class="export part">
        <el-select
          v-model="activeChain"
          class="chains-select [&&]:[--el-fill-color-blank:--border]"
          placeholder="Select"
          size="large"
          style="width: 100%"
          :teleported="false"
          :suffix-icon="SuffixIcon"
        >
          <template #prefix>
            <img
              v-if="activeChain"
              height="24"
              class="mr-5px border-rd-[50%]"
              :src="`${token_logo_url}chain/${activeChain}.png`"
              style=""
              alt=""
              srcset=""
            />
          </template>
          <el-option
            v-for="item in SupportFullDataChain"
            :key="item"
            :label="getChainInfo(item)?.name"
            :value="item"
          >
            <div class="flex-start">
              <img
                v-if="item"
                height="24"
                class="mr-5px border-rd-[50%]"
                :src="`${token_logo_url}chain/${item}.png`"
                style=""
                alt=""
                srcset=""
              />
              <span>{{ getChainInfo(item)?.name || '' }}</span>
            </div>
          </el-option>
        </el-select>
        <textarea v-model="exportStr" class="textarea" disabled />
        <div class="button copy" @click="copyToClipboard">
          {{ $t('copy') }}
          <span v-if="exportNumber > 0">({{ exportNumber }})</span>
        </div>
      </div>
      <div v-else-if="tabActive === 2" class="delete part">
        <p>{{ $t('bulkDeleteDesc') }}</p>
        <p class="mb-20px!">{{ $t('bulkDeleteExample') }}</p>
        <el-select
          v-model="activeChain"
          class="chains-select [&&]:[--el-fill-color-blank:--border]"
          placeholder="Select"
          size="large"
          style="width: 100%"
          :teleported="false"
          :suffix-icon="SuffixIcon"
        >
          <template #prefix>
            <img
              v-if="activeChain"
              height="24"
              class="mr-5px border-rd-[50%]"
              :src="`${token_logo_url}chain/${activeChain}.png`"
              style=""
              alt=""
              srcset=""
            />
          </template>
          <el-option
            v-for="item in SupportFullDataChain"
            :key="item"
            :label="getChainInfo(item)?.name"
            :value="item"
          >
            <div class="flex-start">
              <img
                v-if="item"
                height="24"
                class="mr-5px border-rd-[50%]"
                :src="`${token_logo_url}chain/${item}.png`"
                style=""
                alt=""
                srcset=""
              />
              <span>{{ getChainInfo(item)?.name || '' }}</span>
            </div>
          </el-option>
        </el-select>
        <textarea v-model="zeroBalanceAddresses" class="textarea" disabled :placeholder="$t('batchPlaceHolder')"/>
        <el-button
          class="width100 button mt-30px"
          block
          size="large"
          color="#3F80F7"
          :loading="loadingDelete"
          @click.stop="confirmBulkDelete"
        >
          {{ $t('confirmDelete') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  batchDeleteAddresses,
  bulkExportAttention,
  bulkImportAttention,
  getZeroBalanceAddresses,
} from '~/api/attention'
import { ElMessage } from 'element-plus'
import { generateAvatarIcon, getChainInfo, isValidAddress, evm_utils as utils } from '@/utils'
import { ArrowDownBold } from '@element-plus/icons-vue'
import SuffixIcon from './suffixIcon.vue'
const { mode, token_logo_url } = storeToRefs(useGlobalStore())
const { currentAddress, showBatchAddressDetails } = storeToRefs(useFollowStore())

const { updateNum3 } = storeToRefs(useFollowStore())
const botStore = useBotStore()
const { t } = useI18n()
const tabActive = ref(0)
const importStr = ref('')
const exportStr = ref('')
const isValid = ref(true)
const errorMessage = ref('')
const activeChain = ref('solana')
const loading = ref(false)
const loadingDelete = ref(false)
const zeroBalanceAddresses = ref('')
const zeroBalanceList = ref([])

const emit = defineEmits(['refresh'])
const exportNumber = computed(() => {
  const entries = exportStr.value.split(/\s*,\s*|\n/).filter(Boolean)
  return entries.length || 0
})

watch(()=>showBatchAddressDetails.value, (val) => {
  if (!val) {
    tabActive.value = 0
    importStr.value = ''
    exportStr.value = ''
    zeroBalanceAddresses.value = ''
    zeroBalanceList.value = []
  }
})

watch(activeChain, (val) => {
  if (val && tabActive.value === 1) {
    handleBulkExportAttention()
  }
  if (val && tabActive.value === 0 && importStr.value) {
    validateInput()
  }
  if (val && tabActive.value === 2) {
    fetchZeroBalAddresses()
  }
})

watch(tabActive, (val) => {
  if (val === 2) {
    fetchZeroBalAddresses()
  }
})

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(exportStr.value)
    ElMessage.success(t('copy') + ' ' + t('success'))
  } catch (err) {
    console.error('copy failed:', err)
  }
}

const getClipboardContent = async () => {
  try {
    const text = await navigator.clipboard.readText()
    importStr.value = text
    ElMessage.success(t('paste')+' '+t('success'))
    validateInput()
  } catch (err) {
    console.error('paste failed:', err)
  }
}

const isJSON = (str) => {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

const validateInput = () => {
  isValid.value = true
  errorMessage.value = ''
  if (isJSON(importStr.value)) {
    const entries = JSON.parse(importStr.value)
    // if (entries.length > 100) {
    //   errorMessage.value = t('batchErrorMsg3', { n: 100 })
    //   isValid.value = false
    //   return
    // }
    for (const entry of entries) {
      const address = entry.address || entry.trackedWalletAddress
      if (!isValidAddress(address, activeChain.value)) {
        errorMessage.value = t('batchErrorMsg1', { address: address })
        isValid.value = false
        return
      }
      if (entry?.name?.length > 30) {
        errorMessage.value = t('batchErrorMsg2', { n: 30 }) + `:${entry.name}`
        isValid.value = false
        return
      }
    }
  } else {
    const entries = importStr.value.split(/\s*,\s*|\n/).filter(Boolean)
    if (entries.length > 100) {
      errorMessage.value = t('batchErrorMsg3', { n: 100 })
      isValid.value = false
      return
    }
    for (const entry of entries) {
      const [userAddress, remark = ''] = entry.split(':')
      const trimmedUserAddress = userAddress.trim()
      const trimmedRemark = remark.trim()
      if (!isValidAddress(trimmedUserAddress, activeChain.value)) {
        errorMessage.value = t('batchErrorMsg1', { address: trimmedUserAddress })
        isValid.value = false
        return
      }
      if (trimmedRemark.length > 30) {
        errorMessage.value = t('batchErrorMsg2', { n: 30 }) + `:${trimmedRemark}`
        isValid.value = false
        return
      }
    }
  }
}

const handleBulkImportAttention = () => {
  if (!currentAddress.value) {
    botStore.changeConnectVisible(true)
    return
  }
  if (!isValid.value) {
    return
  }
  const arr = parseInputToJson(importStr.value, activeChain.value)
  if (arr.length < 1) {
    return
  }
  loading.value = true
  bulkImportAttention(arr)
    .then((res) => {
      console.log(res)
      ElMessage.success(t('success'))
      updateNum3.value++
      emit('refresh')
      showBatchAddressDetails.value = false
    })
    .catch((err) => {
      ElMessage.error(String(err))
    })
    .finally(() => {
      loading.value = false
    })
}

const parseInputToJson = (input, chain) => {
  const result = []
  let isValid = true
  if (!isJSON(input)) {
    const entries = input.split(/\s*,\s*|\n/).filter(Boolean)
    entries.forEach((entry) => {
      const [userAddress, remark = ''] = entry.split(':')
      const trimmedUserAddress = userAddress.trim()
      const trimmedRemark = remark.trim()
      if (isValidAddress(trimmedUserAddress, chain)) {
        const obj = {
          address: '',
          user_address: trimmedUserAddress,
          user_chain: chain,
          remark: trimmedRemark,
        }
        result.push(obj)
      } else {
        isValid = false
        console.warn(`Invalid address skipped: ${trimmedUserAddress}`)
      }
    })
  } else {
    const entries = JSON.parse(input);
    entries.forEach((entry) => {
      const user_address = entry.address || entry.trackedWalletAddress
      if (isValidAddress(user_address, chain)) {
        const obj = {
          address: '',
          user_address,
          user_chain: chain,
          remark: entry.name,
        }
        result.push(obj)
      } else {
        isValid = false
        console.warn(`Invalid address skipped: ${trimmedUserAddress}`)
      }
    })
  }
  if (isValid) {
    return result
  } else {
    return []
  }
}

const handleBulkExportAttention = () => {
  if (!currentAddress.value) {
    botStore.changeConnectVisible(true)
    return
  }
  loading.value = true
  bulkExportAttention(activeChain.value)
    .then((res) => {
      console.log('bulkExportAttention', res)
      exportStr.value = convertJsonToString(res)
    })
    .catch((err) => {
      ElMessage.error(String(err))
    })
    .finally(() => {
      loading.value = false
    })
}

const convertJsonToString = (jsonData) => {
  const data = jsonData.map((item) => {
    return {
      name: item.remark ? item.remark : '',
      address: item.user_address,
    }
  })
  return JSON.stringify(data, null, 2)
}

const fetchZeroBalAddresses = () => {
  if (!currentAddress.value) {
    botStore.changeConnectVisible(true)
    return
  }

  loadingDelete.value = true
  zeroBalanceAddresses.value = t('zeroBalanceLoading')

  // const walletAddress = store.state.currentAccount || store.state.bot?.userInfo?.evmAddress

  getZeroBalanceAddresses({
    user_chain: activeChain.value,
    address: currentAddress.value,
  })
    .then((res) => {
      const zeroBalAddresses = res || []
      zeroBalanceList.value = zeroBalAddresses

      if (zeroBalAddresses.length === 0) {
        zeroBalanceAddresses.value = t('noZeroBalanceAddresses')
        loadingDelete.value = false
        return
      }

      zeroBalanceAddresses.value = t('foundZeroBalanceAddresses', { count: zeroBalAddresses.length }) + '\n\n' +
      zeroBalAddresses.map((addr) => addr.user_address).join('\n')
    })
    .catch((err) => {
      console.error('获取零余额地址失败:', err)
      zeroBalanceAddresses.value = t('fetchFailed')
      loadingDelete.value = false
    })
    .finally(() => {
      loadingDelete.value = false
    })
}

const confirmBulkDelete = () => {
  if (zeroBalanceList.value.length === 0) {
    fetchZeroBalAddresses()
    return
  }

  loadingDelete.value = true
  console.log('zeroBalanceList', zeroBalanceList.value)
  batchDeleteAddresses(zeroBalanceList.value)
    .then(() => {
      ElMessage.success(t('deleteSuccess', { count: zeroBalanceList.value.length }))
      zeroBalanceAddresses.value = t('deleteSuccess', { count: zeroBalanceList.value.length })
      emit('refresh')
      updateNum3.value++
    })
    .catch((err) => {
      console.error('批量删除失败:', err)
      zeroBalanceAddresses.value = t('deleteFailed')
    })
    .finally(() => {
      loadingDelete.value = false
    })
}
</script>

<style lang="scss" scoped>
.pop-right {
  position: absolute;
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
  z-index: 3012;
  background: #00000099;
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: flex-end;
  .right-container {
    background: var(--d-222-l-FFF);
    border-radius: 10px 0 0 10px;
    padding: 24px 20px;
    min-height: 100vh;
  }
}
.pop-right {
  position: fixed;
  .content {
    background-color: var(--dialog-bg);
    padding: 20px 20px;
    .tabs {
      position: relative;
      margin-bottom: 20px;
      display: flex;
      .tab {
        cursor: pointer;
        margin-right: 32px;
        color: var(--third-text);
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        &.active {
          color: var(--main-text);
        }
      }
      .iconify {
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .part {
      p {
        margin-bottom: 10px;
        font-size: 12px;
        color: var(--secondary-text);
      }
      .example {
        font-size: 12px;
        color: var(--secondary-text);
        display: flex;
        align-items: top;
        margin-bottom: 20px;
      }
      .chain {
        cursor: not-allowed;
        display: flex;
        width: 100%;
        height: 40px;
        padding: 10px 12px;
        align-items: center;
        margin: 20px 0;
        border: 1px solid var(--d-333-l-999);
        border-radius: 8px;
        img {
          height: 20px;
          margin-right: 6px;
        }
        span {
          color: var(--d-FFF-l-222);
          font-size: 14px;
          line-height: 16px;
        }
      }
      .textarea {
        outline: none;
        width: 100%;
        height: 328px;
        padding: 16px 12px;
        color: var(--third-text);
        border: 1px solid var(--dialog-divider);
        border-radius: 8px;
        overflow-y: auto;
        margin-bottom: 5px;
        background-color: transparent;
        &::placeholder {
          color: var(--third-text);
        }
      }
      .error-message {
        height: 25px;
        color: var(--down-color);
        font-size: 12px;
      }
      .button {
        cursor: pointer;
        width: 100%;
        height: 48px;
        /* background-color: var(--d-FFF-l-222);
        color: var(--d-222-l-FAFAFA); */
        font-size: 16px;
        border-radius: 8px;
        text-align: center;
        &.black {
          border: 1px solid var(--border);
          background-color: var(--border);
          color: var(--main-text);
          margin-bottom: 20px;
          line-height: 48px;
          &:hover {
            border-color: var(--gray-button-hover);
            background-color: var(--gray-button-hover);
          }
        }
        &.copy {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
          color: var(--main-text);
          margin-top: 30px;
          line-height: 48px;
          &:hover {
            background-color: var(--primary-button-hover);
            border-color: var(--primary-button-hover);
          }
        }
      }
    }
  }
}
textarea::-webkit-resizer {
  display: none;
}

textarea::-moz-resizer {
  display: none;
}
textarea::placeholder {
  font-size: 14px; /* 修改为你想要的字体大小 */
}
textarea {
  font-size: 14px;
  line-height: 18px;
  font-weight: 300;
}
.chains-select {
  margin-bottom: 20px;
  // border: 1px solid var(--a-bg-3-color);
  // --el-select-border-color-hover: transparent;
  :deep() {
    .el-select__wrapper.el-select__wrapper {
      // box-shadow: none;
      // background: var(--a-bg-7-color);
      min-height: 40px;
    }
    .el-select-dropdown__item {
      padding: 0 32px 0 15px;
      height: 40px;
      display: flex;
      align-items: center;
      // --el-fill-color-lighter: var(--a-bg-7-color);
    }
  }
}
</style>
