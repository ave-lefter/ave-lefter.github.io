<template>
  <ul class="w-tabs flex-1 flex-wrap">
    <li class="clickable text-[--third-text]" :class="{ active: props.modelValue === 0 }" @click.stop.prevent="emit('update:modelValue', 0)">
      <span>{{ $t('defaultGroup') }}</span>
    </li>
    <template v-if="props.options.length > 0">
      <li
        v-for="item in props.options" :key="item.group_id" class="clickable flex gap-2px text-[--third-text]"
        :class="{ active: props.modelValue === item.group_id }"
        @click.stop.prevent="emit('update:modelValue', item.group_id)">
        <!-- <el-input
          v-if="edits[item.group_id]" v-model="groupName" style="width: 140px" size="default"
          class="name-input">
          <template #suffix>
            <Icon
              name="mynaui:x-square-solid" class="text-18px color-[var(--d-F5F5F5-l-222)] clickable"
              @click.stop.prevent="handleCancelEdit"/>
            <Icon v-else name="mynaui:x-square" class="text-18px color-#666"/>
            <Icon
              name="mynaui:check-square-solid" class="text-18px color-[var(--d-F5F5F5-l-222)] clickable"
              :class="{ 'cursor-not-allowed': !groupName }" @click.stop.prevent="groupName&&handleConfirmEdit()"/>
            <Icon v-else name="mynaui:check-square" class="text-18px color-#666"/>
          </template>
        </el-input> -->
          <!-- v-click-outside="() => visible = false" -->

        <span>{{ item.name }}</span>
        <Icon
          :ref="(el: any) => $refs.buttonRefs[item.group_id] = el"
          name="mdi:dots-vertical"
          class="text-14px"
          @click.stop.prevent="buttonRef = $refs.buttonRefs[item.group_id]; visible = true; currentEditGroup = item.group_id; form.groupName = item.name"
          />
      </li>
    </template>
    <li ref="addButtonRef" class="clickable color-[--secondary-text]! flex gap-2px bg-[--main-input-button-bg]!" @click.stop.prevent="proPopoverRef?.popoverRef?.show?.()">
      <Icon name="custom:add-icon" class="text-12px" />
      <span>{{ $t('newGroup') }}</span>
    </li>
    <el-popover v-if="props.options.length > 0" ref="popoverRef2" :width="320" trigger="click" @after-leave="handleSortClose">
       <template #reference>
         <li class="clickable color-[--secondary-text]! flex gap-2px bg-[--main-input-button-bg]!">
           <Icon name="custom:list-icon" class="text-12px" />
           <span>{{ $t('groupManage') }}</span>
         </li>
       </template>
       <template #default>
        <div class="font-500 text-14px lh-[120%] tracking-0% text-[--main-text]">
          <div class="mb-8px text-14px lh-[120%]">{{ $t('groupManage') }}</div>
          <el-scrollbar wrap-class="mb-12px max-h-[400px]">
              <VueDraggableNext
                 v-model="sortOptions"
                 class="flex flex-col"
                 tag="ul"
                 v-bind="{ animation: 300}"
                 item-key="show_index"
                 @start="drag = true"
                 @end="drag = false"
               >
               <li v-for="item in sortOptions" :key="item?.show_index" class="flex-between font-400 py-12px px-8px hover:bg-[--d-2A2A2A-l-F2F2F2] cursor-move"
               >
                 <span>{{ item?.name }}</span>
                 <Icon name="material-symbols:dehaze" class="text-16px text-[--third-text]"/>
               </li>
                 <!-- <transition-group type="transition" name="flip-list">
                 </transition-group> -->
               </VueDraggableNext>
          </el-scrollbar>
          <div class="flex-between w-100%">
            <el-button :color="!isDark?'#D9E8FF' : '#1F242C'"  class="flex-1" @click.stop.prevent="()=>popoverRef2?.hide?.()">{{ $t('cancel') }}</el-button>
            <el-button type="primary" class="flex-1" color="#3F80F7" @click.stop.prevent="handleSort">{{ $t('confirm') }}</el-button>
          </div>
        </div>
       </template>
    </el-popover>
  </ul>
  <!-- --el-popover-title-font-size:14px;--el-popover-title-text-color:var(--d-FFF-l-000) -->
  <el-popover
    :visible="visible" :virtual-ref="buttonRef" trigger="click" title="" virtual-triggering
    popper-style="width: 86px;min-width: 86px;">
    <ul v-click-outside="() => visible = false">
      <li
        class="font-400 text-12px lh-[100%] tracking-0px  mb-20px flex-start gap-4px clickable"
        @click.stop.prevent="handleRenameGroup">
        <Icon name="fe:edit" class="color-#666 text-14px mt-0px" />
        <span>{{ $t('rename') }}</span>
      </li>
      <li
        class="font-400 text-12px lh-[100%] tracking-0px clickable flex-start gap-4px"
        @click.stop.prevent="handleDelGroup">
        <Icon name="bx:bxs-trash-alt" class="text-15px color-#666 mt-0px" />
        <span>{{ $t('delete') }}</span>
      </li>
    </ul>
  </el-popover>
  <el-popover
    :visible="edits[currentEditGroup]" :virtual-ref="buttonRef" trigger="click" :title="$t('rename')" virtual-triggering
    popper-style="--el-popover-title-font-size:14px;--el-popover-title-text-color:var(--main-text)" width="248" :teleported="false">
      <el-form ref="formRef" v-click-outside="clickOutside" :model="form" :rules="rules" @submit.prevent.stop="handleConfirmEdit(formRef)">
        <el-form-item prop="groupName" label-position="top" size="large" class="mb-20px!">
          <el-input v-model.trim="form.groupName" class="[&&]:[--el-fill-color-blank:var(--d-666-l-F2F2F2)] [%%]:[el-input__count-inner:transparent]" :placeholder="t('enterGroupName')" :maxlength="50" show-word-limit  />
        </el-form-item>
        <el-form-item class="mb-0px!">
          <div class="flex-between w-100%">
            <el-button :color="!isDark?'#D9E8FF' : '#1F242C'" class="flex-1" @click.stop.prevent="handleCancelEdit">{{ $t('cancel') }}</el-button>
            <el-button type="primary" color="#3F80F7"  class="flex-1" native-type="submit">{{ $t('confirm') }}</el-button>
          </div>
        </el-form-item>
      </el-form>
  </el-popover>
  <ProPopover ref="proPopoverRef" v-model="addGroupName" :button-ref="addButtonRef || {}" width="248" :label="$t('newGroup')" :placeholder="$t('enterGroupName')" prop="name" :title="$t('newGroup')" @onConfirm="handleAddGroup"/>
</template>

<script setup lang="ts">
import ProPopover from '@/pages/follow/components/proPopover.vue'
import {VueDraggableNext} from 'vue-draggable-next'
import type { FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()
const {lang,isDark} = storeToRefs(useGlobalStore())
const emit = defineEmits<{
  (e: 'onConfirm', groupId: number, name: string): void
  (e: 'onDelete' | 'onCancel' | 'update:modelValue', groupId: number): void
  (e: 'onChangeIndex', groupIds: Array<number>): void
  (e: 'onAdd', name: string): void
  (e: 'update:options', options: Array<{ group_id: number; name: string; show_index: number }>): void
}>()
const props = defineProps({
  options: {
    type: Array as PropType<Array<{ group_id: number; name: string; show_index: number }>>,
    default: () => []
  },
  modelValue: {
    type: Number,
    default: 0
  }
})
const $refs = ref({
  buttonRefs: {} as Record<number, any>
})
// emit('update:options', val)
// const options = computed({
//   get: () => props.options,
//   set: (val) => emit('update:options', val)
// })
const sortOptions = ref(props.options)
watch(() => props.options, (val) => {
  sortOptions.value = val
})
const formRef=ref<FormInstance|undefined>()
const form = reactive({
  groupName: ''
})
const rules = computed<FormRules>(() => {
  return {
    groupName: [
      { required: true, message: t('groupName') + (lang.value.indexOf('zh') > -1 ? '' : '&nbsp;') + t('cannotBeEmpty'), trigger: 'change' },
    ]
  }
})
const addGroupName = ref('')
const edits = ref<Record<number, boolean>>({})
const currentEditGroup = ref()
const visible = ref(false)
const buttonRef = ref()
const addButtonRef = ref()
const proPopoverRef = ref()
const popoverRef2 = ref()

const drag=ref(false)

watch(() => edits.value, (val) => {
  console.log('edits changed', val)
},{deep:true})

function handleSortClose() {
  sortOptions.value = props.options
}
function clickOutside() {
  visible.value = false
  edits.value[currentEditGroup.value] = false
}
function handleRenameGroup() {
  edits.value[currentEditGroup.value] = true
  nextTick(() => {
    (document.querySelector('.name-input input') as HTMLInputElement | null)?.focus()
  })
}
function handleCancelEdit() {
  edits.value[currentEditGroup.value] = false
  emit('onCancel', currentEditGroup.value)
}
function handleConfirmEdit(formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      emit('onConfirm', currentEditGroup.value, form.groupName)
      formRef.value?.resetFields()
      edits.value[currentEditGroup.value] = false
    } else {
      console.log('error submit!', fields)
    }
  })
}
// function handleConfirmEdit() {
//   edits.value[currentEditGroup.value] = false
//   emit('onConfirm', currentEditGroup.value, form.groupName)
// }
function handleDelGroup() {
  emit('onDelete', currentEditGroup.value)
}
function handleAddGroup() {
  emit('onAdd',addGroupName.value)
  proPopoverRef.value?.close?.()
}
function handleSort() {
  // emit('onAdd',addGroupName.value)
  // proPopoverRef.value?.close?.()
  popoverRef2.value?.hide?.()
  console.log('handleSort',props.options,sortOptions.value)
  emit('onChangeIndex',sortOptions.value.map(i=>i.group_id))
}
// function openSetting() {
//   emit('onChangeIndex',1,2)
// }
watch(addGroupName, val => {
  console.log('addGroupName changed', val)
})
// defineExpose({
//   close:proPopoverRef.value?.close
// })
</script>

<style scoped lang="scss">
ul.w-tabs {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  // font-weight: 500;
  font-size: 12px;

  /* border-bottom: 1px solid var(--d-222-l-EEE); */
  li {
    display: flex;
    padding: 0 8px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    background-color: var(--main-input-button-bg);
    justify-content: center;
    align-items: center;
    border-radius: 4px;

    &.active {
      color: var(--white);
      background-color: #3F80F7;
      /* background-color: var(--d-333-l-0A0B0C); */
    }
  }
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
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
</style>

