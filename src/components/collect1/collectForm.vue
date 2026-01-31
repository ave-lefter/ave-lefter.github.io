<template>
    <div class="flex flex-col gap-8px p-12px" @click.stop>
      <div v-for="item in userFavoriteGroupsWithDefault" :key="item.group_id">
      <el-checkbox class="[--el-checkbox-height:14px]"  :label="item.name" :modelValue="activeGroupId === item.group_id" @change="changeActiveGroupId(item.group_id)"/>
      </div>
      <el-input v-if="inputVisible" v-model.trim="newGroupName" clearable :placeholder="$t('enterGroupName')" :maxlength="20"/>
      <el-button :disabled="inputVisible" class="w-full" @click="inputVisible = true">
          <Icon name="material-symbols:add-circle" class="mr-4px"/>{{ $t('newGroup') }}
      </el-button>
      <div class="flex mt-4px">
          <el-button class="flex-1" @click="hidePopover">
              {{ $t('cancel') }}
          </el-button>
          <el-button :loading="confirmLoading" class="flex-1" type="primary" @click="onConfirm">
              {{ $t('confirm') }}
          </el-button>
      </div>
  </div>
</template>

<script setup lang='ts'>
const props = defineProps({
  userFavoriteGroupsWithDefault: {
    type: Array as () => Array<{ group_id: number; name: string }>,
    required: true
  },
})

const emit = defineEmits<{
  (e: 'collect', groupId: number): void
  (e: 'newGroupAndCollect', groupName: string): void
  (e: 'hide'): void
}>()

const {t} = useI18n()
const activeGroupId = ref(0)
const newGroupName = ref('')
const inputVisible = ref(false)
const confirmLoading = ref(false)

function hidePopover() {
  newGroupName.value = ''
  inputVisible.value = false
  emit('hide')
}

function changeActiveGroupId(groupId:number) {
  activeGroupId.value = groupId
  newGroupName.value = ''
}

const onConfirm = () => {
  // 如果未关注，则关注
  if(newGroupName.value){
      const hasNewGroup = props.userFavoriteGroupsWithDefault.find(item => item.name === newGroupName.value)
      if(hasNewGroup){
          ElMessage.error(t('groupNameAlreadyExists'))
          return
      }
      // 新建分组并关注
      emit('newGroupAndCollect', newGroupName.value)
  } else {
      emit('collect', activeGroupId.value)
  }
  hidePopover()
}


</script>

<style>

</style>
