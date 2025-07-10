<template>
  <el-popover ref="popoverRef" :width="props?.width" trigger="click" placement="bottom" :virtual-ref="props.buttonRef" virtual-triggering :title="props?.title" :persistent="false" :teleported="true" popper-class="" popper-style="--el-popover-title-font-size:12px;--el-popover-title-text-color:var(--d-FFF-l-000)">
    <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent.stop="handleSubmit(formRef)">
      <el-form-item :prop="props.prop" :required="props.required" label-position="top" size="large" class="mb-12px!">
        <el-input v-model="form[props.prop]" :placeholder="placeholder" :maxlength="props.maxlength"/>
      </el-form-item>
      <el-form-item class="mb-0px!">
        <div class="flex-between w-100%">
          <el-button style="background: var(--d-333-l-F2F2F2)" class="flex-1" @click.stop.prevent="handleCancel">{{ $t('cancel') }}</el-button>
          <el-button type="primary" class="flex-1" native-type="submit">{{ $t('confirm') }}</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-popover>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
const { t } = useI18n()
const {lang} = storeToRefs(useGlobalStore())
const props=defineProps({
  width:{
    type:String,
    default:'248'
  },
  required:{
    type:Boolean,
    default:true
  },
  label:{
    type:String,
    default:''
  },
  prop:{
    type:String,
    default:''
  },
  placeholder:{
    type:String,
    default:''
  },
  modelValue:{
    type:String,
    default:''
  },
  rule:{
    type:Function,
    default:()=>{}
  },
  buttonRef:{
    type:Object,
    required:true
  },
  maxlength:{
    type:Number,
    default:20
  },
  title: {
    type: String,
    default: ''
  }
})
const emits = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'update:modelValue', value: string): void
  (e: 'onConfirm', value?: string): void
  (e: 'onCancel'): void
}>()

const popoverRef=ref()
const placeholder=computed(() => props.placeholder ?? t('placeholderPrefix') + props.label)

const rules = computed<FormRules>(() => {
  return {
    [props.prop]: [
      { required: props.required, message: props.label + (lang.value.indexOf('zh') > -1 ? '' : '&nbsp;') + t('cannotBeEmpty'), trigger: 'blur' }
    ]
  }
})
const formRef=ref<FormInstance|undefined>()

const form = reactive({
  [props.prop]: props.modelValue
})
watch(() => form[props.prop], (newValue) => {
  emits('update:modelValue', newValue)
})

function handleSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      emits('onConfirm',form[props.prop])
      formRef.value?.resetFields()
    } else {
      console.log('error submit!', fields)
    }
  })
}
function handleCancel() {
  formRef.value?.resetFields()
  close()
}
function close() {
  unref(popoverRef)?.hide?.()
}
defineExpose({
  close
})
</script>

<style scoped lang="scss">
.el-popover__reference {
  margin-bottom: 10px;
}
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

