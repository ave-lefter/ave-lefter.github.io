<!-- components/RemarkForm.vue -->
<template>
  <el-form
    ref="formRef"
    class="remark-form"
    :model="form"
    :rules="rules"
    :labelWidth="0"
    size="large"
    autocomplete="off"
    @submit.prevent="onSubmit"

  >
    <el-form-item
      :label="labelText"
      prop="remark"
      :required="required"
    >
      <el-input
        class="[&&]:[--el-fill-color-blank:var(--d-666-l-F2F2F2)]"
        v-model="form.remark"
        type="text"
        clearable
        maxlength="20"
        show-word-limit
        :placeholder="placeholder"
      />
    </el-form-item>

    <el-form-item style="margin-top: 30px; margin-bottom: 0;">
      <div style="display: flex; justify-content: flex-end; width: 100%;gap:6px;">
        <el-button
          style="height: 32px; flex: 1; font-weight: 400"
          :color="buttonCancelColor"
          class="[&&]:[--el-color-black:#333]"
          @click="onCancel"
        >
          {{ t('cancel') }}
        </el-button>
        <el-button
          native-type="submit"
          type="primary"
          style="height: 32px; flex: 1; font-weight: 400"
          :color="buttonConfirmColor"
        >
          {{ t('confirm') }}
        </el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

interface Props {
  modelValue: string
  required?: boolean
  label?: string | null
  placeholder?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

const { t } = useI18n()
const themeStore = useThemeStore()

const formRef = useTemplateRef('formRef')
const form = reactive({
  remark: props.modelValue || ''
})

const labelText = computed(() => props.label ?? '')
const placeholder = computed(() => props.placeholder ?? t('placeholderPrefix') + t('remark'))
const required = computed(() => props.required ?? false)

// 动态按钮颜色，可根据主题决定
const buttonCancelColor = computed(() =>
  !themeStore.isDark ? '#f2f2f2' : '#333333'
)
const buttonConfirmColor = computed(() =>
  !themeStore.isDark ? '#3F80F7' : '#3F80F7'
) 

const rules = {
  remark: [
    { required: required.value, message: `${t('remark')}${t('cannotBeEmpty')}`, trigger: 'blur' },
    { pattern: /^(?!.*[!@#$%^&*(),?":{}|<>])(.{2,50})$/, message: t('remarkError'), trigger: 'blur' }
  ]
}

function onSubmit() {
  formRef.value?.validate?.((valid: boolean) => {
    if (valid) {
      emit('submit', {remark:form.remark})
      emit('update:modelValue', form.remark)
    }
  })
}

function onCancel() {
  emit('cancel')
}
</script>

<style scoped lang="scss">
:deep() .el-input {
  --el-input-border-color: #444444;
  --el-input-placeholder-color: var(--d-666-l-999);
  --el-text-color-placeholder: #999;
  --el-input-bg-color: var(--d-333-l-F2F2F2)
}
:deep() .el-button {
  --el-border:none;
}
:deep() .el-input__wrapper {
  border: none;
  border-radius: 6px;
  box-shadow: none;

  &:hover {
    box-shadow: 0 0 0 1px #3F80F7 inset;
  }
}
</style>
