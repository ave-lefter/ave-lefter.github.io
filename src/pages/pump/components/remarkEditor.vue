<template>
  <div v-if="walletAddress" class="remark-wrapper flex items-center justify-center mr-4px relative z-14" @click.stop>
    <span
      v-if="props.remark && !editable"
      v-tooltip="props.remark"
      class="border-solid border-0.5px border-#286dff color-#286dff rounded-4px  py-0px px-4px mr-4px text-12px ellipsis max-w-100px"
    >
      {{ props.remark }}
    </span>
    <div v-if="editable" class="remark-box" ref="boxRef">
      <input
        ref="inputRef"
        v-model.trim="remark"
        class="remark-input"
        @keydown.enter="handleSave"
        @keydown.esc="cancelEdit"
      />

      <div class="remark-actions">
        <Icon
          name="material-symbols:cancel-outline-rounded"
          class="remark-action"
          @click.stop="cancelEdit"
        />
        <Icon
          :name="loading ? 'line-md:loading-twotone-loop' : 'material-symbols:check-circle-outline-rounded'"
          class="remark-action"
          :class="{ disabled: loading }"
          @click.stop="handleSave"
        />
      </div>
    </div>

    <Icon v-else name="custom:remark" class="icon-remark" @click.stop="edit" />
  </div>
</template>

<script setup lang="ts">
import { verifyLogin, formatRemark } from '@/utils'
import { editPumpTokenRemark } from '@/api/pump'
import { BusEventType, type IFavDialogEventArgs } from '@/utils/constants'
import { useEventBus } from '@vueuse/core'
const props = defineProps({
  chain: {
    type: String,
    default: '',
  },
  token: {
    type: String,
    default: '',
  },
  remark: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:remark'])
const pumpRemarkEditEvent = useEventBus<IFavDialogEventArgs>(BusEventType.PUMP_REMARK_EDIT)
//pumpRemarkEditEvent.on(handlePumpRemarkEditEvent)

const remark = ref('')
const editable = ref(false)
const loading = ref(false)

const inputRef = ref<HTMLInputElement>()
const { evmAddress } = storeToRefs(useBotStore())
// const walletStore = useWalletStore()
const { t } = useI18n()
const walletAddress = computed(() => {
  return evmAddress.value
})

function edit() {
  if (!verifyLogin()) return
  remark.value = props.remark
  editable.value = true
  nextTick(() => {
    const input = inputRef.value
    input?.focus()
    const len = remark.value.length
    input?.setSelectionRange(len, len)
  })
}

async function handleSave() {
  if (loading.value) return
  loading.value = true

  remark.value = formatRemark(remark.value)
  if (remark.value?.length > 50) {
    return ElMessage.error(t('maximum10characters'))
  }
  editPumpTokenRemark(props.token, props.chain, remark.value, walletAddress.value)
    .then(() => {
      ElMessage.success(t('success'))
      editable.value = false
      emit('update:remark', remark.value)
      pumpRemarkEditEvent.emit({ type: 'pump_remark_edit' })
    })
    .catch((err) => {
      console.log(err)
      ElMessage.error(err.message || err || t('fail'))
    })
    .finally(() => {
      loading.value = false
    })
}
function cancelEdit() {
  editable.value = false
}
</script>

<style lang="scss" scoped>
.remark-box {
  position: relative;
}
/* 🌌 输入框 */
.remark-input {
  max-width: 150px;
  padding: 1px 35px 1px 4px;
  border-radius: 4px;
  border: 1px solid var(--secondary-text);
  background: var(--border);
  color: var(--main-text);
  outline: none;
  transition: all 0.25s ease;
  font-size: 12px;
}

/* hover */
.remark-input:hover {
}

/* focus：核心质感 */
.remark-box:focus-within .remark-input {
  border: 1px solid var(--x-blue);
}
/* 👉 按钮区 */
.remark-actions {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  padding-left: 8px;
}

/* 🎯 按钮 */
.remark-action {
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  color: var(--main-text);
  transition: all 0.2s ease;
}

/* hover */
.remark-action:hover {
  transform: scale(1.08);
  opacity: 0.8;
}

/* active */
.remark-action:active {
  transform: scale(0.95);
}

/* disabled */
.remark-action.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 间距 */
.remark-action + .remark-action {
  margin-left: 4px;
}

/* 外部 icon */
.icon-remark {
  font-size: 12px;
  cursor: pointer;
  color: var(--third-text1);
  transition: opacity 0.2s;
}
</style>
