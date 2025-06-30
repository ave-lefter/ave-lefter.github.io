<template>
  <el-popover ref="popoverRef" v-model:visible="visible" :width="props?.width" trigger="click" placement="bottom" :virtual-ref="props.buttonRef" virtual-triggering :title="props?.title" :persistent="false" popper-class="" popper-style="--el-popover-title-font-size:14px;--el-popover-title-text-color:var(--d-FFF-l-000)" @before-leave="reset">
    <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent.stop="handleSubmit(formRef)">
      <el-form-item prop="user_chain" required label-position="top" size="large" class="mb-13px!">
        <div class="flex justify-between items-center w-100%">
          <h4 class="font-500 text-12px lh-[120%] color-[var(--d-FFF-l-000)]">{{ $t('addWallet') }}</h4>
          <el-select v-model="form.user_chain" :placeholder="t('placeholderPrefix1') + t('chain')" value-key="value" size="small" style="--el-text-color-regular:var(--d-FFF-l-000);--el-select-input-color:var(--d-FFF-l-000)" :persistent="true" :suffix-icon="CaretBottom" class="w-70px!">
            <template #prefix>
              <div class="h-12px inline-flex items-center">
                <img :src="`${token_logo_url}chain/${form.user_chain?.id}.png`" class="rd-50%" width="12" lazy alt="">
              </div>
            </template>
            <el-option v-for="item in chainOptions" :key="item.value" :label="item.label" :value="item" class="h-20px! flex! items-center! font-400! text-10px! lh-20px!">
              <img :src="`${token_logo_url}chain/${item?.id}.png`" class="rd-50% mr-4px" width="12" lazy alt="">
              <span>{{ item.label }}</span>
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item prop="address" required label-position="top" size="large" class="mb-20px!">
          <el-input v-model="form.address" :placeholder="t('placeholderPrefix') + t('walletAddress')" />
      </el-form-item>
      <el-form-item prop="remark" required label-position="top" size="large" class="mb-20px!">
          <el-input v-model="form.remark" :placeholder="t('placeholderPrefix') + t('remark')"/>
      </el-form-item>
      <el-form-item prop="group_id" required label-position="top" size="large" class="mb-20px!">
        <el-select v-model="form.group_id" :placeholder="t('placeholderPrefix1') + t('addrGroup')">
          <el-option :key="0" :value="0" :label="$t('defaultGroup')"/>
          <el-option v-for="item in addressGroups" :key="item.group_id" :label="item.name" :value="item.group_id" />
        </el-select>
      </el-form-item>
      <el-form-item class="mb-0px!">
        <div class="flex-between w-100% ">
          <el-button style="background: var(--d-333-l-F2F2F2)" class="flex-1" @click.stop.prevent="handleCancel">{{ $t('cancel') }}</el-button>
          <el-button type="primary" class="flex-1" native-type="submit">{{ $t('confirm') }}</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-popover>
</template>
<script setup lang="ts">

import type { FormInstance, FormRules } from 'element-plus'
import {CaretBottom} from '@element-plus/icons-vue'
// import { addFavoriteGroup2 } from '~/api/attention'
const { t } = useI18n()
const props=defineProps({
  width:{
    type:String,
    default:'248'
  },
  formData:{
    type: Object as PropType<{ address:string ,group_id?:number|string ,remark:string,user_chain?:{id:string,value:string,label:string}}>,
    required: false,
    default:()=>{
      return {
        group_id: 0,
        user_chain:  {label:'SOL',value:'solana',id:'solana'}
      }
    }
  }, 
  buttonRef:{
    type:Object,
    required:true
  },
  title: {
    type: String,
    default: ''
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits<{
  (e: 'onConfirm', value?: object): void
  (e: 'onCancel'): void
  (e: 'update:visible', value: boolean): void
}>()
const popoverRef=ref()
  const {addressGroups} = storeToRefs(useFollowStore())
const {lang,token_logo_url} = storeToRefs(useGlobalStore())

const formRef=ref<FormInstance|undefined>()
const form = ref({...props.formData})
const isAdd=ref(false)
const addGroupName=ref('')
// watch(() => form.value, (val) => {
//   console.log('watch form', val)
// }, { deep: true })

const visible=computed({
  get: () => props.visible,
  set: (val) => {
    console.trace('set visible', val)
    emits('update:visible', val)
  }
})
const validateAddress = (rule: any, value: string, callback: (arg0?: Error) => void) => {
  if (value === '') {
    callback(new Error(t('cannotBeEmpty')))
  } else if (!isValidAddress(value, form.value.user_chain?.id)) {
    callback(new Error(t('pleaseEnterCorrectAddress')))
  } else {
    callback()
  }
}
const validateAddress2 = (rule: any, value: string, callback: (arg0?: Error) => void) => {
  if (form.value.address) {
    formRef.value?.validateField('address')
  }
  callback()
}


const rules = computed<FormRules>(() => {
  return {
    user_chain: [{ validator: validateAddress2, trigger: 'change' }],
    address: [
      { required: true, message: (lang.value == "zh-cn" || lang.value == "zh-tw") ? `${t('watchAddress')}${t('cannotBeEmpty')}` : `${t('watchAddress')} ${t('cannotBeEmpty')}`, trigger: ['blur'] },
      { validator: validateAddress, trigger: "blur" },
    ],
    group: [
      { required: true, message: (lang.value == "zh-cn" || lang.value == "zh-tw") ? `${t('walletGroup')}${t('cannotBeEmpty')}` : `${t('walletGroup')} ${t('cannotBeEmpty')}`, trigger: ['blur','change'] },
    ],
    remark: [
      { required: true, message: (lang.value == "zh-cn" || lang.value == "zh-tw") ? `${t('remark')}${t('cannotBeEmpty')}` : `${t('remark')} ${t('cannotBeEmpty')}`, trigger: 'blur' },
      { pattern: /^(?!.*[!@#$%^&*(),.?":{}|<>])(.{2,50})$/, message: t('remarkError'), trigger: ['blur'] }
    ],
  }
})

const chainOptions=ref([
  {label:'SOL',value:'solana',id:'solana'},
  {label:'BSC',value:'56',id:'bsc'},
])

watch(()=>visible.value, (val) => {
  console.log('visible', val)
})
watch(() => props.visible, (val) => {
  console.log('props.visible', val)
})
function handleSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      emits('onConfirm',form.value)
      formRef.value?.resetFields()
      // close()
    } else {
      console.log('error submit!', fields)
    }
  })
}
function handleCancel() {
  emits('onConfirm')
  formRef.value?.resetFields()
}
function reset() {
  console.log('reset')
  isAdd.value = false
  addGroupName.value = ''
  form.value={...props.formData}
}
</script>

<style scoped lang="scss">
.el-popper{
  --el-popover-title-font-size:14px;
  --el-popover-title-text-color:var(--d-FFF-l-000);
}
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
:deep() .el-select--small .el-select__wrapper{
  font-size: 10px;
  font-weight: 400;
}
</style>

