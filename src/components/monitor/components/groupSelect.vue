<template>
  <el-popover
    :visible="visible"
    :virtual-ref="triggerRef"
    trigger="click"
    placement="left-start"
    virtual-triggering
    :teleported="true"
    :popper-style="{ minWidth: '100px', width: 'auto' }"
    popper-class="group-select-popover"
    @before-enter="handleBeforeEnter"
  >
    <div class="group-select-content" v-click-outside="handleClose">
      <el-scrollbar wrap-class="max-h-[400px]">
        <div class="group-radio-list">
          <el-radio 
            :value="0" 
            class="group-radio-item"
            @click.stop="handleSelect(0)"
          >
            {{ $t('defaultGroup') }}
          </el-radio>
          <el-radio
            v-for="item in addressGroups"
            :key="item.group_id"
            :value="item.group_id"
            class="group-radio-item"
            @click.stop="handleSelect(item.group_id)"
          >
            {{ item.name }}
          </el-radio>
        </div>
      </el-scrollbar>
      <div class="group-actions">
        <el-input 
          v-if="inputVisible" 
          v-model.trim="newGroupName" 
          :placeholder="$t('enterGroupName')" 
          :maxlength="20"
          class="mb-8px w-full"
        />
        <el-button 
          :disabled="inputVisible" 
          class="w-full new-group-btn " 
          size="small" 
          @click="inputVisible = true"
        >
          <Icon name="material-symbols:add-circle" class="mr-4px"/>
          {{ $t('newGroup') }}
        </el-button>
        <div v-if="inputVisible" class="flex gap-8px mt-8px">
          <el-button class="flex-1"  @click="cancelNewGroup">
            {{ $t('cancel') }}
          </el-button>
          <el-button 
            class="flex-1" 
            type="primary" 
            :loading="confirmLoading"
            :disabled="!newGroupName"
            @click="confirmNewGroup"
          >
            {{ $t('confirm') }}
          </el-button>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ClickOutside as vClickOutside } from 'element-plus'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Number,
    default: 0
  },
  triggerRef: {
    type: Object,
    required: true
  },
  addressGroups: {
    type: Array as PropType<Array<{ group_id: number; name: string }>>,
    default: () => []
  }
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'update:visible', value: boolean): void
  (e: 'newGroup', name: string): void
}>()

const { t } = useI18n()
const selectedGroup = ref(props.modelValue)
const inputVisible = ref(false)
const newGroupName = ref('')
const confirmLoading = ref(false)

// Popover 打开前同步当前选中值
const handleBeforeEnter = () => {
  selectedGroup.value = props.modelValue
  inputVisible.value = false
  newGroupName.value = ''
  confirmLoading.value = false
}

// 选择分组
const handleSelect = (groupId: number) => {
  if (selectedGroup.value === groupId) {
    handleClose()
    return
  }
  selectedGroup.value = groupId
  emit('update:modelValue', groupId)
  handleClose()
}

// 关闭 Popover
const handleClose = () => {
  emit('update:visible', false)
}

// 取消新建分组
const cancelNewGroup = () => {
  inputVisible.value = false
  newGroupName.value = ''
}

// 确认新建分组
const confirmNewGroup = async () => {
  if (!newGroupName.value || confirmLoading.value) return
  
  confirmLoading.value = true
  try {
    emit('newGroup', newGroupName.value)
    // 等待父组件处理完成（如果需要）
    await nextTick()
    inputVisible.value = false
    newGroupName.value = ''
    handleClose()
  } finally {
    confirmLoading.value = false
  }
}

// 监听外部值变化，保持同步
watch(() => props.modelValue, (val) => {
  if (!props.visible) {
    selectedGroup.value = val
  }
})
</script>

<style lang="scss" scoped>
.group-select-content {
  padding: 12px 0;
  display: inline-block;
  width: auto;
}

.group-radio-list {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  width: auto;
  align-items: flex-start;
}

.group-radio-item {
  margin: 0 !important;
  padding: 6px 12px;
  height: 28px;
  width: 100%;
  &:hover {
    // background-color: var(--dialog-list-hover);
  }
  
  :deep(.el-radio__label) {
    color: var(--d-E0E0E0-l-333);
    font-size: 12px;
  }
  
  :deep(.el-radio__input.is-checked + .el-radio__label) {
    color: var(--d-E0E0E0-l-333);
  }
}

.group-actions {
  padding: 16px 12px 0px 12px;
  // border-top: 1px solid var(--dialog-list-hover);
}

.new-group-btn {
  width: 100%;
  height: 28px;
  font-size: 12px;
  color: var(--d-E0E0E0-l-333);
  // border-color: var(--third-text);
  background-color:  var(--dialog-list-hover);
  
  &:hover:not(:disabled) {
    color: var(--d-E0E0E0-l-333);
    // border-color: var(--d-E0E0E0-l-333);
    background-color: var(--dialog-list-hover);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

:deep(.el-input) {
  --el-input-border-color: var(--third-text);
  --el-input-bg-color: var(--dialog-list-hover);
  
  .el-input__wrapper {
    box-shadow: none;
    padding: 0 8px;
    
    &:hover, &.is-focus {
      box-shadow: 0 0 0 1px var(--primary-color) inset;
    }
  }
}
</style>

<style lang="scss">
.group-select-popover {
  // background-color: var(--secondary-bg) !important;
  // border: 1px solid var(--dialog-list-hover) !important;
  padding: 0 !important;
  
  // .el-popper__arrow {
  //   display: none;
  // }
}
</style>