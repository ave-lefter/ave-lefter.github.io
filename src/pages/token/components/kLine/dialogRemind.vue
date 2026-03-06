<template>
  <el-dialog
    v-if="visible"
    v-model="visible"
    width="640px"
    class="dialog-box dialog-max dialog-remind dialog"
    @close="visible = false"
    destroy-on-close
    append-to-body
  >
    <template #header>
      <div class="flex-start items-center">
        <span class="text-20px font-500 cursor-pointer"> {{ $t('alerts') }}</span>
      </div>
    </template>
    <div class="content text-center" v-if="deny">
      <Icon class="text-30px" name="custom:bell-close" />
      <div class="mt-25px text-center">
        {{ $t('notifyDenyTipBefore') }}
        <a class="set" href="" @click.stop.prevent="allowNotify">{{ $t('notifyDenyTip') }}</a>
        {{ $t('notifyDenyTipAfter') }}
      </div>
    </div>
    <div v-else>
      <el-alert
        type="warning"
        :title="$t('remindTip')"
        :closable="false"
        show-icon
        :style="{
          backgroundColor: '#FFA6221A',
          color: '#FFA622',
          border: 'none',
          fontSize: '12px',
        }"
      />
      <div class="flex-between mt-16px">
        <span class="title block">{{ $t('alertFrequency') }}</span>
        <el-popover
          popper-class="[--el-popover-bg-color:--border]"
          placement="bottom-end"
          trigger="click"
          :visible="showRepeatPop"
        >
          <template #reference>
            <div
              class="flex-start items-center cursor-pointer text-12px bg-[--border] px-8px py-8px"
              @click.stop="showRepeatPop = !showRepeatPop"
            >
              <template v-if="form.is_repeatable == 1">
                <span class="mr-4px">{{ $t('duplicate') }}</span>
              </template>
              <template v-else>
                <span class="mr-4px">{{ $t('once') }}</span>
              </template>
              <Icon
                :name="!showRepeatPop ? 'radix-icons:triangle-down': 'radix-icons:triangle-up'"
                class="text-16px color-[--main-text]"
              />
            </div>
          </template>
          <template #default>
            <div class="py-4px [&&]:m--12px flex flex-col">
              <div
                class="flex-start items-center text-12px py-4px px-8px color-[--main-text] hover:bg-[--dialog-list-hover] cursor-pointer"
                @click.stop="toggleRepeat(1)"
              >
                <span class="ml-4px mr-4px">{{ $t('duplicate') }}</span>
              </div>
              <div
                class="flex-start items-center text-12px py-4px px-8px color hover:bg-[--dialog-list-hover] cursor-pointer"
                @click.stop="toggleRepeat(0)"
              >
                <span class="ml-4px mr-4px">{{ $t('once') }}</span>
              </div>
            </div>
          </template>
        </el-popover>
      </div>
      <div class="flex-between mt-24px">
        <span class="text-14px">{{ $t('triggerCondition') }}</span>
        <div class="flex-1"></div>
        <span class="text-12px color-[--third-text]"
          >{{ token?.symbol }}&nbsp;{{ $t('currentPrice') }}</span
        >
        <span class="ml-5px text-12px"
          >${{ formatNumber(tokenStore?.price || 0, { decimals: 4, limit: 6 }) }}</span
        >
      </div>
      <div class="flex mt-20px">
        <el-popover
          popper-class="[--el-popover-bg-color:--border]"
          placement="bottom-start"
          trigger="click"
          :visible="showDirectionPop"
        >
          <template #reference>
            <div
              class="flex-start items-center cursor-pointer text-12px bg-[--border] px-8px"
              @click.stop="showDirectionPop = !showDirectionPop"
            >
              <template v-if="form.direction == 'up'">
                <Icon class="text-16px color-[--up-color]" name="custom:arrow-up" />
                <span class="ml-4px mr-4px">{{ $t('gtPrice') }}</span>
              </template>
              <template v-else>
                <Icon class="text-16px color-[--down-color]" name="custom:arrow-down" />
                <span class="ml-4px mr-4px">{{ $t('ltPrice') }}</span>
              </template>
              <Icon
                :name="!showDirectionPop ? 'radix-icons:triangle-down': 'radix-icons:triangle-up'"
                class="text-16px color-[--main-text]"
              />
            </div>
          </template>
          <template #default>
            <div class="py-4px [&&]:m--12px flex flex-col">
              <div
                class="flex-start items-center text-12px py-4px px-8px color-[--main-text] hover:bg-[--dialog-list-hover] cursor-pointer"
                @click.stop="toggleDirection('up')"
              >
                <Icon class="text-16px" name="custom:arrow-up" />
                <span class="ml-4px mr-4px">{{ $t('gtPrice') }}</span>
              </div>
              <div
                class="flex-start items-center text-12px py-4px px-8px color hover:bg-[--dialog-list-hover] cursor-pointer"
                @click.stop="toggleDirection('down')"
              >
                <Icon class="text-16px" name="custom:arrow-down" />
                <span class="ml-4px mr-4px">{{ $t('ltPrice') }}</span>
              </div>
            </div>
          </template>
        </el-popover>
        <el-input
          class="ml-8px mr-8px flex-1 h-32px"
          v-model="form.warning_price"
          :placeholder="$t('placeholderNotify')"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
        ></el-input>
        <el-button
          type="primary"
          v-if="currentAddress"
          @click.stop.prevent="onSubmit"
          :loading="crateLoading"
          >{{ $t('createNotify') }}</el-button
        >
        <el-button type="primary" v-else @click="openConnect">{{ $t('connectWallet') }}</el-button>
      </div>
      <div class="flex items-center justify-center mt-10px gap-10px">
        <div v-for="(item, index) in ratioList" :key="index" class="radio-group flex-1">
          <input
            :id="`radio-buy-${item}`"
            v-model="ratio"
            type="radio"
            :value="item"
            class="radio-input"
            @change.stop="changeRatio"
          />
          <label
            :for="`radio-buy-${item}`"
            class="radio-item"
            :class="{ 'no-checked': customRatio }"
            style="border-radius: 4px"
            >{{ form.direction == 'up' ? '+' : '-' }}{{ item }}%</label
          >
        </div>
        <div class="slippage-input flex-1">
          <span class="color-[--main-text] mr-5px">{{ form.direction == 'up' ? '+' : '-' }}</span>
          <el-input-number
            v-model="customRatio"
            class="bg-[--border] rounded-4px"
            name="slippage"
            type="number"
            :placeholder="$t('custom')"
            :max="form.direction == 'up' ? Infinity : 99"
            :min="0"
            :step="0.01"
            controls-position="right"
            :controls="false"
            
            @focus="onFocus1"
            @change="changeCustomRatio"
          />
          <span class="color-[--main-text]">%</span>
        </div>
      </div>
      <div class="flex-between mt-24px" v-if="remindList.length > 0">
        <span class="title block">{{ $t('createRecord') }}</span>
        <el-checkbox v-model="selected" :label="$t('currentToken')" />
      </div>
      <el-scrollbar class="hidden-scrollbar" height="600px" v-loading="loadingRemind">
        <div class="list mt-32px">
          <div
            class="item"
            v-for="(item, $index) in filterRemindList"
            :keys="$index"
            @click.stop.prevent="removeNotify(item.ids, 1)"
          >
            <div class="flex-between parent cursor-pointer">
            <NuxtLink
                :to="`/token/${item.token}-${item.chain}`"
                class="flex no-underline items-center"
                @click.stop.prevent="visible = false"
              >
              <token-img :row="item" tokenClass="w-32px h-32px" />
              <span class="text-16px font-500 ml-8px">{{ item.symbol }}</span>
            </NuxtLink>
              <div class="flex-1"></div>
              <Icon class="delete text-16px cursor-pointer" name="ic:baseline-delete" />
            </div>
            <ul class="py-4px flex flex-col mt-16px" v-if="item.children?.length > 0">
              <li
                class="flex-start items-center text-14px py-8px px-8px color-[--main-text] hover:bg-[--dialog-list-hover] cursor-pointer"
                v-for="(i, index) in item?.children"
                :key="index"
                @click.stop.prevent="removeNotify([i.id], 0)"
              >
                <Icon
                  class="text-16px"
                  :name="`custom:${i.direction == 'up' ? 'arrow-up' : 'arrow-down'}`"
                />
                <span class="ml-4px color-[--secondary-text]"
                  >({{ i.direction == 'up' ? $t('gtPrice') : $t('ltPrice') }})</span
                >
                <span class="ml-4px"
                  >${{ formatNumber(i.warning_price || 0, { decimals: 4, limit: 6 }) }}</span
                >
                <span
                  class="color-[--third-text] ml-4px"
                  v-if="i.is_repeatable == 0 && i?.notified_times >= 1"
                >
                  {{ $t('expired2') }}
                </span>
                <span class="color-[--down-color] ml-4px" v-else>
                  {{ i.is_repeatable == 0 ? $t('once') : $t('duplicate') }}
                </span>

                <div class="flex-1"></div>
                <Icon class="delete-children text-14px cursor-pointer" name="ic:baseline-delete" />
              </li>
            </ul>
          </div>
          <div
            v-if="filterRemindList?.length == 0 && !loadingRemind"
            class="empty text-14px color-[--icon-color] flex items-center justify-center flex-col mt-200px"
          >
            <Icon class="text-40px" name="custom:bell" />
            <span class="mt-10px">{{ $t('emptyAlert') }}</span>
          </div>
        </div>
      </el-scrollbar>
      <div class="text-14px color-[--third-text] mt-20px">
        <span class="color-[--main-text]">{{ len }}</span
        >/100 {{ $t('alerts1') }}
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { markRaw } from 'vue'
import { _addNotify, _removeNotify, type Item } from '@/api/remind'
import { Warning } from '@element-plus/icons-vue'
const props = defineProps({
  modelValue: Boolean,
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
const botStore = useBotStore()
const { t } = useI18n()
const { mode } = storeToRefs(useGlobalStore())
const remindStore = useRemindStore()
const { remindList, loadingRemind, len, remindCount} = storeToRefs(remindStore)
const { getNotifyList } = remindStore
const route = useRoute()
const visible = computed({
  get: () => props.modelValue ?? false,
  set: (val) => emit('update:modelValue', val),
})
const tokenStore = useTokenStore()
const deny = shallowRef(false)
const ratio = shallowRef(0)
const customRatio = shallowRef<number | null>(null)
const selected = shallowRef(false)

const followStore = useFollowStore()
const form = reactive<{
  direction: 'up' | 'down'
  is_repeatable: 0 | 1
  warning_price: string | number
}>({
  direction: 'up',
  is_repeatable: 0,
  warning_price: 0,
})
const showDirectionPop = shallowRef(false)
const showRepeatPop = shallowRef(false)
const activeTab = shallowRef(0)
const crateLoading = shallowRef(false)
const currentAddress = computed(() => {
  return followStore.currentAddress || ''
})
const ratioList = computed(() => {
  if (form.direction == 'up') {
    return [25, 50, 100]
  } else {
    return [50, 30, 15]
  }
})
const tokenInfo = computed(() => {
  return tokenStore?.tokenInfo
})
const token = computed(() => {
  return tokenStore?.token
})
const id = computed(() => route.params.id as string)
const chain = computed(() => {
  const { chain } = getAddressAndChainFromId(id.value, 0)
  return chain
})
const filterRemindList = computed(() => {
  if (selected.value) {
    return remindList.value?.filter((i) => i.token == token.value?.token)
  } else {
    return remindList.value || []
  }
})
watch(remindCount, (val) => {
  if (val && visible.value) {
    init()
  }
})
watch(
  () => visible.value,
  (val) => {
    if (val) {
      init()
    } else {
      showRepeatPop.value = false
      showDirectionPop.value = false
    }
  }
)
watch(
  () => currentAddress.value,
  (val) => {
    if (val && !deny.value) {
      init()
    } else {
      remindList.value = []
    }
  }
)

watch(
  () => deny.value,
  (val) => {
    if (!val) {
      init()
    } else {
      remindList.value = []
    }
  }
)

onMounted(() => {})
function init() {
  form.warning_price = formatDec(tokenStore?.price || 0, 4)
  form.direction = 'up'
  form.is_repeatable = 0
  if (window.Notification && Notification.permission == 'granted') {
    if (deny.value === false && currentAddress.value) {
      getNotifyList()
    }
  } else {
    deny.value = true
  }
}
function allowNotify() {
  if (window.Notification && Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        deny.value = false
      }
    })
  } else if (window.Notification && Notification.permission == 'denied') {
    window.open(
      'https://support.google.com/chrome/answer/3220216?hl=en&co=GENIE.Platform%3DDesktop'
    )
  } else if (!window.location.href.startsWith('https')) {
    ElMessage.error(t('domainSafe'))
  } else {
    ElMessage.error(t('unSupportNotify'))
  }
}
function onSubmit() {
  if (len.value >= 100) {
    ElMessage.error(t('alertTip2'))
    return
  }
  if (!form.warning_price) {
    ElMessage.error(t('alertTip1'))
    return
  }
  let data = {
    ...form,
    user_address: currentAddress.value,
    token: token?.value?.token || '',
    symbol: token?.value?.symbol || '',
    chain: token?.value?.chain || '',
    current_price: Number(tokenStore?.price),
    warning_price: Number(form.warning_price || 0),
  }
  crateLoading.value = true
  _addNotify(data, currentAddress.value)
    .then((res) => {
      ElMessage.success(t('success'))
      getNotifyList()
    })
    .catch((err) => {
      ElMessage.error(t('fail'))
      console.log(err)
    })
    .finally(() => {
      crateLoading.value = false
    })
}
function removeNotify(ids: number[], type = 0) {
  ElMessageBox.confirm(type == 1 ? t('deleteGroupAlert') : t('deleteAlert'), t('tips'), {
    type: 'warning',
    icon: markRaw(Warning),
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    customClass: `${mode.value} delete_confirm`,
  })
    .then(() => {
      _removeNotify(ids, currentAddress.value)
        .then((res) => {
          ElMessage.success(t('success'))
          getNotifyList()
        })
        .catch((err) => {
          console.log(err)
          ElMessage.error(t('fail'))
        })
        .finally(() => {})
    })
    .catch((err) => {
      console.log('--------err-------', err)
    })
}
function toggleDirection(dir: 'up' | 'down') {
  form.direction = dir
  showDirectionPop.value = false
  customRatio.value = 0
  ratio.value = 0
}
function toggleRepeat(num: 1 | 0) {
  form.is_repeatable = num
  showRepeatPop.value = false
}
function changeRatio() {
  let price = 0
  if (ratio.value) {
    if (form.direction == 'up') {
      price = (1 + ratio.value / 100) * Number(tokenStore?.price || 0)
    } else {
      price = (1 - ratio.value / 100) * Number(tokenStore?.price || 0)
    }
  } else {
    price = Number(tokenStore?.price || 0)
  }
  form.warning_price = formatDec(price || 0, 4)
}
function changeCustomRatio() {
  if (customRatio.value) {
    if (form.direction == 'up') {
      form.warning_price = (1 + customRatio.value / 100) * Number(tokenStore?.price || 0)
    } else {
      form.warning_price = (1 - customRatio.value / 100) * Number(tokenStore?.price || 0)
    }
  } else {
    form.warning_price = Number(tokenStore?.price || 0)
  }
  form.warning_price = formatDec(form.warning_price || 0, 4)
}

const onInput = (val: string) => {
  // 允许一个小数点，允许小数点后输入 0
  const cleaned = val
    .replace(/[^0-9.]/g, '') // 去掉非数字和小数点
    .replace(/^0+(\d)/, '$1') // 去掉多余的前导0（但保留单个0）
    .replace(/(\..*?)\..*/g, '$1') // 只保留第一个小数点

  form.warning_price = cleaned
  // form.warning_price = Number(val.replace(/[^0-9.]/g, '') || 0)
}
const onBlur = () => {
  const num = Number(form.warning_price)
  form.warning_price = isNaN(num) ? 0 : num
}
const openConnect = () => {
  botStore.changeConnectVisible(true)
}
const onFocus = () => {
  if (Number(form.warning_price) == 0) {
    form.warning_price = ''
  }
}
const onFocus1 = () => {
  if (customRatio.value === 0 || customRatio.value === null) {
    customRatio.value = null // 不显示 0
  }
}
</script>

<style lang="scss" scoped>
.set {
  color: #3f80f7;
  text-decoration: underline;
}
.item {
  border-bottom: 1px solid var(--border);
  padding-bottom: 12px;
  margin-top: 12px;
  .parent {
    &:hover {
      .delete {
        color: var(--down-color);
      }
    }
  }
  ul li {
    &:hover {
      .delete-children {
        display: block;
        color: var(--down-color);
      }
    }
  }

  .delete {
    color: var(--third-text);
  }
  .delete-children {
    display: none;
  }
}

.radio-group {
  display: flex;
  align-items: center;
  .radio-input {
    width: 0;
    height: 0;
    font-size: 0;
    opacity: 0;
    &:checked + .radio-item:not(.no-checked) {
      // background: var(--custom-primary-color);
      border: 1px solid var(--primary-color);
      color: var(--main-text);
      background: rgba($color: #3f80f7, $alpha: 0.08);
    }
    &:disabled + .radio-item {
      opacity: 0.5;
    }
  }
  .radio-item {
    border: 1px solid var(--border);
    background: var(--border);
    border-radius: 8px;
    min-width: 86px;
    font-size: 14px;
    color: var(--secondary-text);
    letter-spacing: 0;
    font-weight: 400;
    text-align: center;
    min-height: 32px;
    line-height: 1;
    cursor: pointer;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 8px 0;
  }
}
.slippage-label {
  font-size: 14px;
  color: var(--secondary-text);
  letter-spacing: 0;
  text-align: center;
  font-weight: 400;
  text-align: left;
  display: flex;
  align-items: center;
  line-height: 1;
  .iconfont {
    &:active {
      opacity: 0.5;
    }
  }
}
.slippage-input {
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 16px;
  color: var(--custom-text-1-color);
  font-weight: 400;
  .is-disabled {
    opacity: 0.5;
  }
  &:deep() .el-input__wrapper,
  &:deep() .el-input__inner {
    background-color: var(--border);
    color: var(--main-text);
  }
  &:deep() .el-input-number__decrease,
  &:deep() .el-input-number__increase {
    background-color: var(--border);
    color: var(--main-text);
  }
  .input {
    font-size: 14px;
    background: #ffffff;
    border: 1px solid #dcdee0;
    color: var(--main-text);
    border-radius: 8px;
    height: 36px;
    padding: 0 14px;
    flex: 1;
    &:focus-within {
      border-color: #558bed;
    }
    :deep() .van-field__body {
      height: 100%;
    }
  }
  span {
    margin-left: 5px;
  }
}
</style>
