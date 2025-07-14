<template>
  <el-popover ref="popoverRef" v-model:visible="visible" :width="props?.width" trigger="click" placement="right-end" :virtual-ref="props.buttonRef" virtual-triggering :title="props?.title" :persistent="false" :teleported="true" popper-class="w-favAddressPop" popper-style="--el-popover-title-font-size:14px;--el-popover-title-text-color:var(--d-FFF-l-000)" @before-leave="reset"  >
    <el-form ref="formRef" v-click-outside="()=>followStore.favAddressPopVisible=false" v-loading="loading" :model="form" :rules="rules" hide-required-asterisk @submit.prevent.stop="handleSubmit(formRef)">
      <el-form-item prop="group" required label-position="top" size="large" class="mb-20px!">
        <el-scrollbar max-height="274px">
          <el-radio-group v-model="form.group" class="flex flex-col items-start w-100%" style="align-items: flex-start; ">
              <el-radio :key="0" :value="0" class="w-100%">{{ t('defaultGroup') }}</el-radio>
              <el-radio v-for="item in followStore.addressGroups" :key="item.group_id" :value="item.group_id" class="w-100%">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-scrollbar>
      </el-form-item>
      <el-form-item>
        <el-button v-if="!isAdd" type="primary" class="w-100% text-12px" size="default" :icon="CirclePlusFilled" @click="isAdd = true"> {{ t('newGroup') }}</el-button>
        <el-input
          v-else v-model="addGroupName" style="width: 140px" size="default"
          class="name-input">
          <template #suffix>
            <Icon 
              name="mynaui:x-square-solid" class="text-18px color-[var(--d-F5F5F5-l-222)] clickable"
              @click.stop.prevent="handleCancelEdit()"/>
            <Icon 
              name="mynaui:check-square-solid" class="text-18px color-[var(--d-F5F5F5-l-222)] clickable"
              :class="{ 'cursor-not-allowed': !addGroupName }" @click.stop.prevent="addGroupName&&handleConfirmEdit(addGroupName)"/>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="is_monitored" required label-position="top" size="large" class="mb-20px!" :label="t('isMonitored')">
        <el-radio-group v-model="form.is_monitored" class="flex flex-row" style="align-items: flex-start;" :disabled="!botStore.evmAddress">
            <el-radio :key="1" :value="1">{{ t('yes') }}</el-radio>
            <el-radio :key="0" :value="0">{{ t('no') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="mb-0px!">
        <div class="flex-between w-100% ">
          <el-button style="background: var(--d-333-l-F2F2F2)" class="flex-1" @click.stop.prevent="handleCancel">{{ $t('cancel') }}</el-button>
          <el-button type="primary" class="flex-1" native-type="submit">{{ $t('confirm') }}</el-button>
        </div>
        <span v-if="!botStore.evmAddress" class="font-500 text-10px lh-[100%] tracking-0px color-#FFA622! mt-8px">
          {{ t('attentionTips') }}
          <a class="color-#3F80F7 ml-4px decoration-underline cursor-pointer"  @click="botStore.changeConnectVisible(true)">{{ t('login') }}</a>
        </span>
      </el-form-item>
    </el-form>
  </el-popover>
</template>
<script setup lang="ts">
/**
 * @description: 关注地址组件
 * @example:
 * <el-button ref="addButtonRef" @click="onclick" >关注地址</el-button>
 * function onclick() {
 *  followStore.confirmAttention(addButtonRef.value,(form)=>{
 *    console.log('confirmAttention', form)
 *     return Promise.resolve()
 *  })
 * }
 * 
 */
import { CirclePlusFilled } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { addFavoriteGroup2 } from '~/api/attention'
const { t } = useI18n()
const {lang} = storeToRefs(useGlobalStore())
const followStore = useFollowStore()
const props=defineProps({
  width:{
    type:String,
    default:'248'
  },
  formData:{
    type: Object as PropType<{ group: number|string ,is_monitored?:number|string}>,
    required: false,
    default:()=>{
      return {
        group: 0,
        is_monitored: 0
      }
    }
  }, 
  groupOptions: {
    type: Array as PropType<Array<{ group_id: number; name: string; show_index: number}>>,
    default: () => []
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
  (e: 'onConfirm', value?: object,resetFields?:()=>void,stopLoading?:()=>void): void
  (e: 'onCancel'): void
  (e: 'update:visible', value: boolean): void
}>()
const botStore=useBotStore()
const popoverRef=ref()
// const placeholder=computed(() => props.placeholder ?? t('placeholderPrefix') + props.label)
const rules = computed<FormRules>(() => {
  return {
    group: [
      { required: true, message: t('addrGroup') + (lang.value.indexOf('zh') > -1 ? '' : '&nbsp;') + t('cannotBeEmpty'), trigger: 'blur' }
    ],
    is_monitored: [
      { required: true, message: t('isMonitored') + (lang.value.indexOf('zh') > -1 ? '' : '&nbsp;') + t('cannotBeEmpty'), trigger: 'blur' }
    ]
  }
})
const loading=ref(false)
const formRef=ref<FormInstance|undefined>()
const form = ref({...props.formData})
const isAdd=ref(false)
const addGroupName=ref('')

const visible=computed({
  get: () => props.visible,
  set: (val) => {
    console.trace('set visible', val)
    emits('update:visible', val)
  }
})

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
      loading.value = true
      emits('onConfirm',form.value,formRef.value?.resetFields,()=>loading.value=false)
      // close()
    } else {
      console.log('error submit!', fields)
    }
  })
}
function handleCancel() {
  emits('onCancel')
  formRef.value?.resetFields()
}
function handleCancelEdit() {
  isAdd.value = false
}
function handleConfirmEdit(groupName:string) {
  if(followStore.addressGroups.map(i=>i.name).includes(groupName)){
    ElMessage.error(t('groupExistT'))
  }else{
    addFavoriteGroup2(groupName).then(() => {
      ElMessage.success(t('success'))
      followStore.getUserFavoriteGroups2()
    }).catch((e) => {
       ElMessage.error(String(e))
    }).finally(() => {
      isAdd.value = false
      addGroupName.value = ''
    })
  }
  // emit('onConfirm', currentEditGroup.value, groupName.value)
}
function reset() {
  console.log('reset')
  isAdd.value = false
  addGroupName.value = ''
  form.value={...props.formData}
}
// function close() {
//   unref(popoverRef)?.hide?.()
// }
// defineExpose({
//   close
// })
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
:deep() .el-scrollbar{
  width:100%
}
</style>
<style lang="scss">
.w-favAddressPop{
  .el-radio{
    color:var(--d-666-l-999)
  }
  .el-radio__input.is-checked + .el-radio__label{
    color:var(--d-F5F5F5-l-333)
  }
}
</style>

