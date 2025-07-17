<template>
  <div>
    <div class="flex items-center">
      <span v-if="canSetAuto" class="mr-5px color-[--d-F5F5F5-l-333]">
        {{ slippage === 'auto' ? $t('autoSlippage') : $t('manualSlippage') }}({{ slippage === 'auto' ? autoSlippage : slippage }}%)
      </span>
      <span v-else style="color: var(--custom-text-1-color);">{{ slippage }}%</span>
      <Icon class="ml-5px clickable" name=tdesign:setting-1 @click.stop="show = true" />
    </div>
    <el-dialog v-model="show" width="500px" append-to-body>
      <template #header>
        <span class="text-18px color-#fff font-400">{{ $t('setSlippage') }}</span>
      </template>
      <el-form class="popup-content" @submit.prevent="confirmSubmit">
        <div class="slippage-label">
          <span>{{ $t('slippage') }}</span>
          <el-icon
            :size="15"
            color="#80838B"
            style="cursor: pointer; margin-left: 5px"
            @click.stop="openSlippageTips"
          >
            <QuestionFilled />
          </el-icon>

          <el-checkbox v-if="canSetAuto" v-model="isAuto" :label="$t('autoSlippage')" size="large" />
        </div>
        <div class="mt-10px">
          <el-row :gutter="10">
            <el-col v-for="(item, index) in slippageList" :key="index" :span="6" class="radio-group">
              <!-- <span v-if="index !== 0" style="flex: 1"></span> -->
              <input
                :id="`radio-${item}`"
                v-model="slippageValue"
                type="radio"
                :value="item"
                :disabled="isAuto"
                class="radio-input"
              >
              <label :for="`radio-${item}`" class="radio-item">{{ item }}%</label>
            </el-col>
            <el-col :span="6">
              <div class="slippage-input">
                <el-input-number
                  v-model="slippageValue"
                  class="select bg-#212847 w-full"
                  name="slippage"
                  type="number"
                  :min="0"
                  :max="49.99"
                  :step="0.01"
                  :disabled="isAuto"
                  controls-position="right"
                  clearable
                  :rules="[
                    { required: true, message: $t('enterSlippage') },
                    { validator, message: $t('slippageMaxTip') }
                  ]"
                  @blur="handleBlur"
                />
                <span class="color-fff">%</span>
              </div>
            </el-col>
          </el-row>
          <span v-if="slippageValue !== undefined && Number(slippageValue) <= 0.1" class="tip">{{ $t('slippageTip1') }}</span>
        </div>
        <div class="form-submit">
          <el-button
            class="swap-button w-full"
            block
            round
            native-type="submit"
            type="primary"
            :disabled="slippage == 0"
          >
            {{ $t('confirm1') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { QuestionFilled } from '@element-plus/icons-vue'
const props = defineProps({
  slippage: {
    type: [String, Number],
    default: '2'
  },
  autoSlippage: {
    type: String,
    default: '2'
  },
  canSetAuto: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['update:slippage'])
const { t } = useI18n()
const slippageList = [0.1, 0.5, 1]
const slippageValue = ref(props.slippage === 'auto' ? undefined : Number(props.slippage))
const show = ref(false)
const isAuto = ref(props.slippage === 'auto')

watch(show, (val) => {
  if (val) {
    slippageValue.value = props.slippage === 'auto' ? undefined : Number(props.slippage)
  }
})
watch(isAuto, (val) => {
  if (val) {
    slippageValue.value = undefined
  }
})

function confirmSubmit() {
  if (slippageValue.value === undefined) {
    emit('update:slippage', 'auto')
  } else {
    emit('update:slippage', String(slippageValue.value))
  }
  show.value = false
}

function openSlippageTips() {
  ElMessageBox.alert(t('slippageTips'), {
    title: t('slippage'),
    confirmButtonText: t('iKnown'),
  })
}

function handleBlur() {
  if (slippageValue.value && Number(slippageValue.value) > 49.99) {
    slippageValue.value = 49.99
  }
}

function validator(val: number | string) {
  return Number(val) <= 49.99
}

</script>

<style lang="scss" scoped>
.radio-group {
  display: flex;
  align-items: center;
  .radio-input {
    width: 0;
    height: 0;
    font-size: 0;
    opacity: 0;
    &:checked + .radio-item {
      background: var(--primary-color);
      color: #eaecef;
    }
    &:disabled + .radio-item {
      opacity: 0.5;
    }
  }
  .radio-item {
    background: var(--d-333-l-F5F5F5);
    border-radius: 8px;
    min-width: 86px;
    font-size: 14px;
    color: var(--d-F5F5F5-l-333);
    letter-spacing: 0;
    font-weight: 400;
    text-align: center;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
  }
}
.slippage-label {
  font-size: 14px;
  color: #80838b;
  letter-spacing: 0;
  text-align: center;
  font-weight: 400;
  text-align: left;
  display: flex;
  align-items: center;
}
.slippage-input {
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 16px;
  color: var(--d-F5F5F5-l-333);
  font-weight: 400;
  .is-disabled  {
    opacity: 0.5;
  }
  &:deep() .el-input__wrapper, &:deep() .el-input__inner {
    background-color: var(--d-333-l-F5F5F5);
  }
  &:deep() .el-input-number__decrease, &:deep() .el-input-number__increase {
    background-color: var(--d-333-l-F5F5F5);
  }
  .input {
    font-size: 14px;
    background: #ffffff;
    border: 1px solid #dcdee0;
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
.form-submit {
  margin-top: 40px;
  text-align: center;
  margin-bottom: 20px;
}
.tip {
  font-size: 14px;
  color: #f3841e;
  letter-spacing: 0;
  font-weight: 400;
  margin-top: 14px;
  display: block;
}
.swap-button.el-button--default {
  background-color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: 10px;
  color: #eaecef;
  &:hover {
    background-color: #545aea33;
    border: 1px solid #545aea33;
  }
  &.is-disabled {
    background-color: #545aea33;
    border: 1px solid #545aea33;
    &:hover {
      background-color: #545aea33;
      border: 1px solid #545aea33;
    }
  }
}
</style>
