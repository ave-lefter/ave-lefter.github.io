<template>
  <div v-if="showImport" class="pop-right" @click="showImport = false">
    <div
      v-show="showImport"
      class="content"
      style="flex: 1; max-width: 450px; overflow-y: auto; overflow-x: hidden"
      @click.stop.prevent
    >
      <div class="tabs">
        <div>{{ $t('importWallet') }}</div>
        <Icon
          name="line-md:close"
          class="text-20px color-[--main-text]"
          @click="showImport = false"
        />
      </div>
      <div>
        <span class="text-14px color-[--main-text]"
          >{{ $t('allChain') }} {{ $t('automaticRecognition') }}</span
        >
        <div class="text-12px color-[--third-text] mt-8px">
          {{ $t('importBotTip') }}
        </div>
      </div>
      <div class="import part mt-24px">
        <span class="text-12px color-[--secondary-text] mb-10px block">{{ $t('mnemonic') }}</span>
        <div class="grid grid-cols-3 gap-2">
          <el-input
            ref="inputs"
            v-for="(word, i) in words"
            :key="i"
            v-model="words[i]"
            class="input"
            :placeholder="`${i + 1}`"
            @input="handleInput($event, i)"
            @keydown.enter="handleKeydown($event as KeyboardEvent, i)"
            @paste="handlePaste($event, i)"
          />
        </div>
        <div class="error-message">
          <span v-if="errorMsg">{{ errorMsg }}</span>
        </div>
        <div class="flex-between">
          <el-button class="width100 button" size="small" @click.stop.prevent="reset">
            {{ $t('reset') }}
          </el-button>
          <el-button
            class="width100 button"
            block
            size="small"
            type="primary"
            :loading="loading"
            @click.stop="handleBulkImportAttention"
          >
            {{ $t('confirm') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { _importWallet } from '@/api/botManage'
import { ElMessage } from 'element-plus'
import CryptoJS from 'crypto-js'
import { nextTick } from 'vue'
const emit = defineEmits(['refresh'])
const { showImport } = storeToRefs(useGlobalStore())
const botStore = useBotStore()
const { t } = useI18n()
const loading = ref(false)

const words = ref<string[]>(Array(12).fill(''))
const inputs = ref<HTMLInputElement[]>([])
const errorMsg = ref('')
const mnemonic = computed(() => words.value.join(' ').trim())

const isValidMnemonic = computed(() => words.value.every((word) => word.trim() !== ''))

const handleInput = (value: string, index: number) => {
  let targetValue = value.replace(/[^a-zA-Z]/g, '').toLowerCase()
  words.value[index] = targetValue
  value = targetValue
  console.log('--words?.value.------', words?.value)
  if (words?.value.length == 12) {
    errorMsg.value = ''
  }
}
// 空格或回车 -> 跳到下一个
const handleKeydown = (e: KeyboardEvent, index: number) => {
  if (e.key === ' ' || e?.key === 'Enter') {
    e.preventDefault()
    nextTick(() => inputs.value[index + 1]?.focus())
  }
}
// 处理粘贴事件
const handlePaste = (e: KeyboardEvent, index: number) => {
  const pasteData = e.clipboardData.getData('text')?.trim()?.toLowerCase()

  const arr = pasteData?.replace(/\s+/g, ' ')?.split(' ')
  if (arr?.length == 12) {
    e.preventDefault() // 阻止默认粘贴行为
    if (/^[a-zA-Z\s]+$/.test(pasteData)) {
      arr.forEach((item: string, $index: number) => {
        words.value[$index] = item
      })
    } else {
      ElMessage.error(t('importTip1eTips'))
    }
  }
}
function encryptMsg(plainText: string, guid: string): string {
  // 1. 明文 → Base64 编码（因为解密时有两层 Base64）
  const base64Plain = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(plainText))

  // 2. 生成 key (SHA256(guid))
  const key = CryptoJS.SHA256(guid)

  // 3. IV = key 前 16 字节
  const iv = CryptoJS.lib.WordArray.create(key.words.slice(0, 4))

  // 4. AES-CBC 加密
  const encrypted = CryptoJS.AES.encrypt(base64Plain, key, {
    mode: CryptoJS.mode.CBC,
    iv,
    padding: CryptoJS.pad.Pkcs7,
  })
  // 5. 输出 Base64 字符串
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64)
}
const handleBulkImportAttention = () => {
  if (words.value.some((w) => !w.trim())) {
    errorMsg.value = t('importTip1eTips2')
    return
  }
  loading.value = true
  const guid = botStore?.userInfo?.tgUid || ''
  const encryptedMnemonic = encryptMsg(mnemonic.value, guid)
  _importWallet(encryptedMnemonic)
    .then((res) => {
      ElMessage.success(t('success'))
      emit('refresh')
      showImport.value = false
      reset()
    })
    .catch((err) => {
      ElMessage.error(String(err))
    })
    .finally(() => {
      loading.value = false
    })
}
function reset() {
  words.value = Array(12).fill('')
  errorMsg.value = ''
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
      .input {
        outline: none;
        width: 100%;

        color: var(--third-text);
        border: 1px solid var(--dialog-divider);
        border-radius: 4px;
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
