<!-- 单输入框pop -->
<template>
  <el-popover ref="popoverRef" :width="props?.width" trigger="click"  :virtual-ref="props.buttonRef"
    virtual-triggering :title="props?.title" :persistent="false" :teleported="false" popper-class="w-batchRemarkPop"
    popper-style="--el-popover-title-font-size:14px;--el-popover-title-text-color:var(--main-text)" @before-enter="handleBeforeEnter">
    <el-form ref="formRef" :model="batchRemarkFormData" :rules="rules" @submit.prevent.stop="handleSubmit(formRef)">
      <el-form-item prop="type" :required="true" label-position="top" class="mb-12px!" size="large" >
        <el-select popper-class="w-selectAutoSell" v-model="batchRemarkFormData.type" :placeholder="t('pleaseSelect')"
          style="" @change="changeAutoSellConfig"  :persistent="true":teleported="false" size="large">
          <!-- @vue-ignore -->
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <template #error>
          <div class="el-form-item__error">
            {{ t('cannotBeEmpty') }}
          </div>
        </template>
      </el-form-item>
      <div v-if="previewList.length" class="font-normal text-sm leading-[16px] flex gap-8px flex-col p-14px bg-[--border] mb-8px">
        <div class="text-[--third-text]">{{ t('preview') }}</div>
        <div v-for="value in previewList" class="text-[--main-text]" :key="value">
          {{ value }}
        </div>
        <div v-if="Array.isArray(modelValue?.list) && modelValue?.list.length>3">...</div>
      </div>
      <el-form-item prop="needAmount" class="mb-12px!" size="small">
        <el-checkbox v-model="batchRemarkFormData.needAmount" :label="t('profitAmount')" :style="!batchRemarkFormData.needAmount?'--el-checkbox-checked-text-color:var(--third-text)':''"/>
      </el-form-item>
      <el-form-item prop="isUpdateExist" class="mb-12px!" size="small">
        <el-checkbox v-model="batchRemarkFormData.isUpdateExist" :label="t('notUpdateExistRemark')" :style="!batchRemarkFormData.isUpdateExist?'--el-checkbox-checked-text-color:var(--third-text)':''"/>
        <div v-if="!batchRemarkFormData.isUpdateExist" class="text-[--third-text] font-medium text-xs leading-[100%] mt-5px">{{t('notUpdateExistRemarkTip')}}</div>
      </el-form-item>
      <el-form-item class="mb-0px!">
        <div class="flex-between w-100%">
          <el-button class="flex-1" :color="!isDark ? '#D9E8FF' : '#1F242C'" @click.stop.prevent="handleCancel">{{
            $t('cancel') }}</el-button>
          <el-button type="primary" class="flex-1" native-type="submit" color="#3F80F7">{{ $t('confirm') }}</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-popover>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'

import { batchUpdateWhaleRemark } from '~/api/attention'

const { t } = useI18n()
const { lang } = storeToRefs(useGlobalStore())


type ModelValueType = {
  list: any[],
  symbol: string
}

const props = withDefaults(
  defineProps<{
    width?: string
    modelValue?: ModelValueType
    buttonRef: object
    title?: string
  }>(),
  {
    width: '320',
    modelValue: () => ({
      list: [],
      symbol: ''
    }),
    title: ''
  }
)

const emits = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'beforeEnter' ): void
  (e: 'onConfirm', value?: string): void
  (e: 'onCancel'): void
}>()
const { isDark,batchRemarkFormData } = storeToRefs(useGlobalStore())
const popoverRef = ref()
const previewList=shallowRef([] as string[])
const rules = {}
// const rules = computed<FormRules>(() => {
//   return {
//     [props.prop]: [
//       { required: props.required, message: props.label + (lang.value.indexOf('zh') > -1 ? '' : '&nbsp;') + t('cannotBeEmpty'), trigger: 'blur' }
//     ]
//   }
// })
const formRef = ref<FormInstance | undefined>()



// const form = reactive({
//   [props.prop]: props.modelValue
// })
const typeOptions = computed(() => {
  return lang.value.indexOf('zh') > -1 ?[
    {
      value: 1,
      label: 'TOP'
    },
    {
      value: 2,
      label: t('rank')
    },
    {
      value: 3,
      label: t('profit5')
    },
  ]:[
    {
      value: 1,
      label: 'TOP'
    },
    {
      value: 3,
      label: t('profit5')
    },
  ]
})

const typeLabel=computed(()=>{
  return typeOptions.value.find(item=>item.value==batchRemarkFormData.value.type)?.label
})
function setPreviewList(){
 if(props.modelValue?.list?.length){
    previewList.value=props.modelValue?.list?.map((item: any,index: number) => `${props.modelValue.symbol}_${typeLabel.value}${index+1}${batchRemarkFormData.value.needAmount?('_'+item.total_profit):''}`).slice(0,3)
  }else{
    previewList.value=[]
  }
}

watch(batchRemarkFormData.value, (val) => {
  setPreviewList()
  console.log('previewList1',previewList.value,props.modelValue)
})

const handleBeforeEnter=()=>{
  if(lang.value.indexOf('zh') <= -1){
    if(batchRemarkFormData.value.type<=2){
      batchRemarkFormData.value.type=1
    }
  }
  emits('beforeEnter')
  setPreviewList()
  console.log('previewList2',previewList.value,props.modelValue)
}
const changeAutoSellConfig=(value:any)=>{
  
}

// watch(() => form[props.prop], (newValue) => {
//   emits('update:modelValue', newValue)
// })

function handleSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      const remarks=props.modelValue.list.map((item: any, index: number) => {
        return {
          address:item.address,
          user_chain:item.user_chain,
          user_address:item.user_address,
          remark:`${props.modelValue.symbol}_${typeLabel.value}${index+1}${batchRemarkFormData.value.needAmount?('_'+item.total_profit):''}`
        }
      })
      console.log('handleSubmitdata',remarks,props.modelValue.list)
      // formRef.value?.resetFields()
      batchUpdateWhaleRemark({
        update:!batchRemarkFormData.value.isUpdateExist,
        remarks
      }).then((res: any) => {
        emits('onConfirm')
        ElMessage({
          message: t('success'),
          type: 'success'
        })
      })
      close()
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
  --el-border: none;
}

:deep() .el-input__wrapper {
  border: none;
  border-radius: 6px;
  box-shadow: none;

  &:hover {
    box-shadow: 0 0 0 1px #3F80F7 inset;
  }
}
:deep() .el-checkbox.el-checkbox--small{
  height: 18px;
}
:deep() .el-checkbox__label{
  display: inline-block;
  white-space: break-spaces;
}
</style>
