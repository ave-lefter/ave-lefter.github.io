<template>
  <el-dialog
    v-model="visible"
    width="640px"
    class="dialog-box dialog-max dialog-remind dialog"
    @close="visible = false"
    append-to-body
  >
    <template #header>
      <div class="flex-start items-center">
        <span class="text-20px font-500 cursor-pointer" @click.stop="switchTab(0)">
          {{ $t('alerts') }}</span
        >
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
      <template v-if="activeTab == 0">
        <el-alert
          type="warning"
          :title="
            form.direction == 'up' ? '当市值高于您的目标时获得提醒' : '当市值低于您的目标时获得提醒'
          "
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
          <span class="title block">提醒频次</span>
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
                  <span class="mr-4px">重复</span>
                </template>
                <template v-else>
                  <span class="mr-4px">仅一次</span>
                </template>
                <Icon
                  :name="!showRepeatPop ? 'radix-icons:triangle-up' : 'radix-icons:triangle-down'"
                  class="text-16px color-[--main-text]"
                />
              </div>
            </template>
            <template #default>
              <div class="py-4px [&&]:m--12px flex flex-col">
                <div
                  class="flex-start items-center text-12px py-4px px-8px color-[--main-text] hover:bg-[--dialog-tab-active] cursor-pointer"
                  @click.stop="toggleRepeat(1)"
                >
                  <span class="ml-4px mr-4px">重复</span>
                </div>
                <div
                  class="flex-start items-center text-12px py-4px px-8px color hover:bg-[--dialog-tab-active] cursor-pointer"
                  @click.stop="toggleRepeat(0)"
                >
                  <span class="ml-4px mr-4px">仅一次</span>
                </div>
              </div>
            </template>
          </el-popover>
        </div>
        <div class="flex-between mt-16px">
          <span class="text-14px">触发条件</span>
          <div class="flex-1"></div>
          <span class="text-12px color-[--third-text]">{{ token?.symbol }}&nbsp;当前价格</span>
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
                  <Icon class="text-16px" name="custom:arrow-up" />
                  <span class="ml-4px mr-4px">高于价格</span>
                </template>
                <template v-else>
                  <Icon class="text-16px" name="custom:arrow-down" />
                  <span class="ml-4px mr-4px">低于价格</span>
                </template>
                <Icon
                  :name="
                    !showDirectionPop ? 'radix-icons:triangle-up' : 'radix-icons:triangle-down'
                  "
                  class="text-16px color-[--main-text]"
                />
              </div>
            </template>
            <template #default>
              <div class="py-4px [&&]:m--12px flex flex-col">
                <div
                  class="flex-start items-center text-12px py-4px px-8px color-[--main-text] hover:bg-[--dialog-tab-active] cursor-pointer"
                  @click.stop="toggleDirection('up')"
                >
                  <Icon class="text-16px" name="custom:arrow-up" />
                  <span class="ml-4px mr-4px">高于价格</span>
                </div>
                <div
                  class="flex-start items-center text-12px py-4px px-8px color hover:bg-[--dialog-tab-active] cursor-pointer"
                  @click.stop="toggleDirection('down')"
                >
                  <Icon class="text-16px" name="custom:arrow-down" />
                  <span class="ml-4px mr-4px">低于价格</span>
                </div>
              </div>
            </template>
          </el-popover>
          <el-input
            class="ml-8px mr-8px flex-1 h-32px"
            v-model="form.warning_price"
            placeholder="输入价格"
          ></el-input>
          <el-button
            type="primary"
            v-if="currentAddress"
            @click.stop.prevent="onSubmit"
            :loading="crateLoading"
            >设置预警</el-button
          >
          <el-button type="primary" v-else>{{ $t('connectWallet') }}</el-button>
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
              >{{ item }}%</label
            >
          </div>
          <div class="slippage-input flex-1">
            <el-input-number
              v-model="customRatio"
              class="bg-[--border] rounded-4px"
              name="slippage"
              type="number"
              :placeholder="$t('custom')"
              :min="0"
              :max="100"
              :step="0.01"
              controls-position="right"
              :controls="false"
              clearable
              @change="changeCustomRatio"
            />
            <span class="color-fff">%</span>
          </div>
        </div>

        <el-scrollbar class="hidden-scrollbar" height="600px" v-loading="loadingRemind">
          <div class="list mt-32px">
            <div
              class="item"
              v-for="(item, $index) in remindList"
              :keys="$index"
              @click.stop.prevent="removeNotify(item.ids)"
            >
              <div class="flex-between parent cursor-pointer">
                <token-img :row="item" tokenClass="w-32px h-32px" />
                <span class="text-16px font-500 ml-8px">{{ item.symbol }}</span>
                <div class="flex-1"></div>
                <Icon class="delete text-16px cursor-pointer" name="ic:baseline-delete" />
              </div>
              <ul class="py-4px flex flex-col mt-16px" v-if="item.children?.length > 0">
                <li
                  class="flex-start items-center text-14px py-8px px-8px color-[--main-text] hover:bg-[--dialog-list-hover] cursor-pointer"
                  v-for="(i, index) in item?.children"
                  :key="index"
                  @click.stop.prevent="removeNotify([i.id])"
                >
                  <Icon
                    class="text-16px"
                    :name="`custom:${i.direction == 'up' ? 'arrow-up' : 'arrow-down'}`"
                  />
                  <span class="ml-4px color-[--secondary-text]">{{
                    i.direction == 'up' ? '高于' : '低于'
                  }}</span>
                  <span class="ml-4px mr-4px"
                    >${{ formatNumber(i.warning_price || 0, { decimals: 4, limit: 6 }) }}</span
                  >
                  <span class="color-[--secondary-text]">价格</span>
                  <span class="text-12px color-[--down-color] ml-5px"
                    >({{ i.is_repeatable == 0 ? '仅一次' : '重复' }})</span
                  >
                  <div class="flex-1"></div>
                  <Icon
                    class="delete-children text-14px cursor-pointer"
                    name="ic:baseline-delete"
                  />
                </li>
              </ul>
            </div>
            <div
              v-if="remindList?.length == 0 && !loadingRemind"
              class="empty text-14px color-[--icon-color] flex items-center justify-center flex-col mt-200px"
            >
              <Icon class="text-40px" name="custom:bell" />
              <span class="mt-10px">暂未设置提醒</span>
            </div>
          </div>
        </el-scrollbar>
        <div class="text-14px color-[--third-text] mt-20px">
          <span class="color-[--main-text]">{{ len }}</span
          >/100个提醒
        </div>
      </template>
      <template v-else>
        <el-scrollbar class="hidden-scrollbar" height="600px">
          <div class="item" v-for="(item, $index) in remindHistoryList" :keys="$index">
            <div class="flex-between items-center parent cursor-pointer">
              <token-img :row="item" tokenClass="w-32px h-32px" />
              <span class="text-16px font-500 ml-8px">{{ item.symbol }}</span>
              <Icon
                class="text-16px"
                :name="`custom:${item.direction == 'up' ? 'arrow-up' : 'arrow-down'}`"
              />
              <span class="ml-4px color-[--secondary-text]">{{
                item.direction == 'up' ? '高于' : '低于'
              }}</span>
              <span class="ml-4px mr-4px"
                >${{ formatNumber(item.warning_price || 0, { decimals: 4, limit: 6 }) }}</span
              >
              <span class="color-[--secondary-text]">价格</span>
              <span class="text-12px color-[--down-color] ml-5px"
                >({{ item.is_repeatable == 0 ? '仅一次' : '重复' }})</span
              >
              <div class="flex-1"></div>
              <span class="color-[--third-text]">{{ formatTimeFromNow(item.CreateTime) }}</span>
            </div>
          </div>
        </el-scrollbar>
      </template>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { _addNotify, _removeNotify } from '@/api/remind'
import { Warning } from '@element-plus/icons-vue'
const props = defineProps({
  modelValue: Boolean,
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
const { t } = useI18n()
const { mode } = storeToRefs(useGlobalStore())
const remindStore = useRemindStore()
const { remindList, loadingRemind, len, remindHistoryList } = storeToRefs(remindStore)
const { getNotifyList, getNotifyHistoryList } = remindStore
const route = useRoute()
const visible = computed({
  get: () => props.modelValue ?? false,
  set: (val) => emit('update:modelValue', val),
})
const tokenStore = useTokenStore()
const deny = shallowRef(false)
const ratioList = [-25, 25, 50, 100]
const ratio = shallowRef(0)
const customRatio = shallowRef(0)

const followStore = useFollowStore()
const form = reactive({
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
watch(
  () => visible.value,
  (val) => {
    if (val) {
      form.warning_price = tokenStore?.price || 0
      form.direction = 'up'
      form.is_repeatable = 0
      activeTab.value = 0
      getNotifyList()
    }
  }
)
onMounted(() => {
  init()
})
function init() {
  if (window.Notification && Notification.permission == 'granted') {
    if (deny.value === false && currentAddress) {
      //this.$store.dispatch('getNotifyList')
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
  if (remindList.value?.length >= 100) {
    ElMessage.error('最多只能添加100个价格提醒!')
    return
  }
  let data = {
    ...form,
    user_address: currentAddress.value,
    token: token?.value?.token,
    symbol: token?.value?.symbol,
    chain: token?.value?.chain,
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
function removeNotify(ids: number[]) {
  ElMessageBox.confirm('删除当前价格提醒', t('tips'), {
    type: 'warning',
    icon: Warning,
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
}
function toggleRepeat(num: 1 | 0) {
  form.is_repeatable = num
  showRepeatPop.value = false
}
function switchTab(num: 1 | 0) {
  activeTab.value = num
  if (num == 1) {
    getNotifyHistoryList()
  } else {
    getNotifyList()
  }
}
function changeRatio() {
  if (ratio.value) {
    if (ratio.value < 0) {
      form.warning_price = (1 - ratio.value / 100) * Number(tokenStore?.price || 0)
    } else {
      form.warning_price = (ratio.value * Number(tokenStore?.price || 0)) / 100
    }
  } else {
    form.warning_price = Number(tokenStore?.price || 0)
  }
}
function changeCustomRatio() {
  if (customRatio.value) {
    form.warning_price = (customRatio.value * Number(tokenStore?.price || 0)) / 100
  } else {
    form.warning_price = Number(tokenStore?.price || 0)
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
        color: var(--third-text);
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
