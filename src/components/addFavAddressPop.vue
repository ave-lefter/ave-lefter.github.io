<template>
  <el-popover ref="popoverRef" :width="props?.width" trigger="click" placement="bottom" :virtual-ref="props.buttonRef" virtual-triggering :title="props?.title" :persistent="false" popper-style="--el-popover-title-font-size:14px;--el-popover-title-text-color:var(--main-text)" @before-leave="reset">
    <el-form ref="formRef" v-loading="loading" :model="form" :rules="rules" @submit.prevent.stop="handleSubmit(formRef)" >
      <el-form-item prop="user_chain" required label-position="top" size="large" class="mb-13px!">
        <div class="flex justify-between items-center w-100%">
          <h4 class="font-500 text-12px lh-[120%] color-[--main-text]">{{ $t('addWallet') }}</h4>
          <el-select v-model="form.user_chain" :placeholder="t('placeholderPrefix1') + t('chain')" value-key="value" size="small" style="--el-fill-color-blank:var(--border);" :suffix-icon="CaretBottom" class="w-70px!" :teleported="false" popper-class="w-103px">
            <template #prefix>
              <div class="h-12px inline-flex items-center">
                <img :src="`${token_logo_url}chain/${form.user_chain?.id}.png`" class="rd-50%" width="12" lazy alt="">
              </div>
            </template>
            <el-option v-for="item in chainOptions" :key="item.value" :label="item.label" :value="item" class="h-26px! flex! items-center! font-500! text-14px! lh-none!">
              <img :src="`${token_logo_url}chain/${item?.id}.png`" class="rd-50% mr-4px" width="16" lazy alt="">
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
        <el-select v-model="form.group_id" :placeholder="t('placeholderPrefix1') + t('addrGroup')" :teleported="false" style="--el-fill-color-blank:var(--border)">
          <el-option :key="0" :value="0" :label="$t('defaultGroup')" />
          <el-option v-for="item in addressGroups" :key="item.group_id" :label="item.name" :value="item.group_id" />
        </el-select>
      </el-form-item>
      <el-form-item class="mb-0px!">
        <div class="flex-between w-100% ">
          <el-button class="flex-1" @click.stop.prevent="handleCancel">{{ $t('cancel') }}</el-button>
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
const props = defineProps({
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
  buttonRef: {
    type: Object,
    required:true
  },
  title: {
    type: String,
    default: ''
  },
})

const emits = defineEmits<{
  (e: 'onConfirm', value?: object, resetFields?: () => void,stopLoading?:()=>void): void
  (e: 'onCancel'): void
}>()
const popoverRef=ref()
  const {addressGroups} = storeToRefs(useFollowStore())
const {lang,token_logo_url} = storeToRefs(useGlobalStore())

const formRef=ref<FormInstance|undefined>()
const form = ref({...props.formData})
const isAdd=ref(false)
const loading=ref(false)
const addGroupName=ref('')

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
      { required: true, message: (lang.value == 'zh-cn' || lang.value == 'zh-tw') ? `${t('watchAddress')}${t('cannotBeEmpty')}` : `${t('watchAddress')} ${t('cannotBeEmpty')}`, trigger: ['blur'] },
      { validator: validateAddress, trigger: 'blur' },
    ],
    group: [
      { required: true, message: (lang.value == 'zh-cn' || lang.value == 'zh-tw') ? `${t('walletGroup')}${t('cannotBeEmpty')}` : `${t('walletGroup')} ${t('cannotBeEmpty')}`, trigger: ['blur','change'] },
    ],
    remark: [
      { required: true, message: (lang.value == 'zh-cn' || lang.value == 'zh-tw') ? `${t('remark')}${t('cannotBeEmpty')}` : `${t('remark')} ${t('cannotBeEmpty')}`, trigger: 'blur' },
      { pattern: /^(?!.*[!@#$%^&*(),.?":{}|<>])(.{2,50})$/, message: t('remarkError'), trigger: ['blur'] }
    ],
  }
})

const chainOptions=computed(()=>{
 return SupportFullDataChain.map(el=>{
    const chainInfo = getChainInfo(el)
    return {
      label:el==='solana' ? 'SOL' : chainInfo.net_name.toUpperCase(),
      value:chainInfo.chain_id,
      id:chainInfo.net_name
    }
  })
})

function handleSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      loading.value = true
      emits('onConfirm',form.value,formRef.value?.resetFields,stopLoading)
      // formRef.value?.resetFields()
      // close()
    } else {
      console.log('error submit!', fields)
    }
  })
}
function stopLoading() {
   loading.value = false
}
function handleCancel() {
  emits('onCancel')
  formRef.value?.resetFields()
  close()
}
function reset() {
  console.log('reset')
  isAdd.value = false
  addGroupName.value = ''
  form.value={...props.formData}
}
function close() {
  unref(popoverRef)?.hide?.()
}
defineExpose({
  close
})
</script>

<style scoped lang="scss">
.el-popper{
  --el-popover-title-font-size:14px;
  // --el-popover-title-text-color:var(--d-FFF-l-000);
}
.el-popover__reference {
  margin-bottom: 10px;
}
:deep() .el-input {
  --el-input-border-color: var(--border);
  --el-input-placeholder-color: var(--third-text);
  --el-text-color-placeholder: var(--third-text);
  --el-input-bg-color: var(--border)
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
  font-weight: 500;
}
:deep() .el-select-dropdown__list{
  padding: 12px 0;
}
</style>

