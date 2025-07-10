<template>
  <ul class="w-tabs flex-1 flex-wrap">
    <li class="clickable" :class="{ active: props.modelValue === 0 }" @click.stop.prevent="emit('update:modelValue', 0)">
      <span>{{ $t('defaultGroup') }}</span>
    </li>
    <li 
      v-for="item in props.options" :key="item.group_id" class="clickable flex gap-2px"
      :class="{ active: props.modelValue === item.group_id, 'px-0px!': edits[item.group_id] }"
      @click.stop.prevent="emit('update:modelValue', item.group_id)">
      <el-input 
        v-if="edits[item.group_id]" v-model="groupName" style="width: 140px" size="default"
        class="name-input">
        <template #suffix>
          <Icon 
            name="mynaui:x-square-solid" class="text-18px color-[var(--d-F5F5F5-l-222)] clickable"
            @click.stop.prevent="handleCancelEdit"/>
          <!-- <Icon v-else name="mynaui:x-square" class="text-18px color-#666"/> -->
          <Icon 
            name="mynaui:check-square-solid" class="text-18px color-[var(--d-F5F5F5-l-222)] clickable"
            :class="{ 'cursor-not-allowed': !groupName }" @click.stop.prevent="groupName&&handleConfirmEdit()"/>
          <!-- <Icon v-else name="mynaui:check-square" class="text-18px color-#666"/> -->
        </template>
      </el-input>
      <template v-else>
        <span>{{ item.name }}</span>
        <Icon 
          :ref="(el: any) => $refs.buttonRefs[item.group_id] = el" 
          v-click-outside="() => visible = false"
          name="mdi:dots-vertical"
          class="text-14px"
          @click.stop.prevent="buttonRef = $refs.buttonRefs[item.group_id]; visible = true; currentEditGroup = item.group_id; groupName = item.name"
           />
      </template>
    </li>
    <li ref="addButtonRef" class="clickable color-#3F80F7! flex gap-2px">
      <Icon name="material-symbols:add-circle" class="text-12px" />
      <span>{{ $t('newGroup') }}</span>
    </li>
    <el-popover :width="293" trigger="click" ref="popoverRef2">
       <template #reference>
         <li class="clickable color-#3F80F7! flex gap-2px">
           <Icon name="material-symbols:format-list-bulleted" class="text-12px" />
           <span>{{ $t('groupManage') }}</span>
         </li>
       </template>
       <template #default>
        <div class="font-500 text-14px lh-[120%] tracking-0% text-[--d-FFF-l-000] ">
          <div class="mb-8px text-12px lh-16px">{{ $t('groupManage') }}</div>
         <VueDraggableNext
            class="flex flex-col mb-12px"
            tag="ul"
            v-model="sortOptions"
            v-bind="{ animation: 200}"
            @start="drag = true"
            @end="drag = false"
            item-key="show_index"
          >
            <transition-group type="transition" name="flip-list">
              <li v-for="item in sortOptions" :key="item.show_index" class="flex-between px-12px py-8px hover:bg-[--d-2A2A2A-l-F2F2F2] cursor-move"
              >
                <span>{{ item.name }}</span>
                <Icon name="material-symbols:dehaze"/>
              </li>
            </transition-group>
          </VueDraggableNext>
          <div class="flex-between w-100%">
            <el-button style="background: var(--d-333-l-F2F2F2);--el-border:none" class="flex-1" @click.stop.prevent="()=>popoverRef2?.hide?.()">{{ $t('cancel') }}</el-button>
            <el-button type="primary" class="flex-1" @click.stop.prevent="handleSort">{{ $t('confirm') }}</el-button>
          </div>
        </div>
       </template>
    </el-popover>
  </ul>
  <el-popover 
    ref="popoverRef" :visible="visible" :virtual-ref="buttonRef" trigger="click" title="" virtual-triggering
    popper-style="width: 86px;min-width: 86px;">
    <ul>
      <li 
        class="font-500 text-14px lh-[100%] tracking-0px  mb-20px flex-start gap-4px clickable"
        @click.stop.prevent="handleRenameGroup">
        <Icon name="fe:edit" class="color-#666 text-14px mt-3px" />
        <span>{{ $t('rename') }}</span>
      </li>
      <li 
        class="font-500 text-14px lh-[100%] tracking-0px clickable flex-start gap-4px"
        @click.stop.prevent="handleDelGroup">
        <Icon name="bx:bxs-trash-alt" class="text-15px color-#666 mt-3px" />
        <span>{{ $t('delete') }}</span>
      </li>
    </ul>
  </el-popover>
  <ProPopover ref="proPopoverRef" v-model="addGroupName" :button-ref="addButtonRef || {}" width="248" :label="$t('newGroup')" :placeholder="$t('groupPlaceholder')" prop="name" :title="$t('newGroup')" @onConfirm="handleAddGroup"/>
</template>

<script setup lang="ts">
import { ClickOutside as vClickOutside } from 'element-plus'
import ProPopover from './proPopover.vue'
import {VueDraggableNext} from 'vue-draggable-next'


const emit = defineEmits<{
  (e: 'onConfirm', groupId: number, name: string): void
  (e: 'onDelete' | 'onCancel' | 'update:modelValue', groupId: number): void
  (e: 'onChangeIndex', groupId: number, groupId2: number): void
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
const groupName = ref('')
const addGroupName = ref('')
const edits = ref<Record<number, boolean>>({})
const currentEditGroup = ref()
const visible = ref(false)
const buttonRef = ref()
const addButtonRef = ref()
const proPopoverRef = ref()
const popoverRef = ref()
const popoverRef2 = ref()

const drag=ref(false)
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
function handleConfirmEdit() {
  edits.value[currentEditGroup.value] = false
  emit('onConfirm', currentEditGroup.value, groupName.value)
}
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
  // emit('onChangeIndex',1,2)
}
function openSetting() {
  emit('onChangeIndex',1,2)
}
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
  font-weight: 500;
  font-size: 12px;

  /* border-bottom: 1px solid var(--d-222-l-EEE); */
  li {
    display: flex;
    padding: 0 8px;
    height: 24px;
    line-height: 24px;
    cursor: pointer;
    background-color: var(--d-1A1A1A-l-F2F2F2);
    justify-content: center;
    align-items: center;
    color: #666;
    border-radius: 4px;

    &.active {
      color: #f5f5f5;
      background-color: var(--d-333-l-0A0B0C);
    }
  }
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}

</style>

