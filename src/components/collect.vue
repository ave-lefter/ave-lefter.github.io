<script setup lang="ts">
import type { GetUserFavoriteGroupsResponse } from '~/api/fav'

const props = defineProps<{
    iconClass?: string
    isCollected?: boolean
    userFavoriteGroups: GetUserFavoriteGroupsResponse[]
}>()

const emit = defineEmits<{
    (e: 'collect',groupId?:number): void
    (e: 'newGroupAndCollect',newGroupName:string): void
}>()

const activeGroupId = ref(0)
const newGroupName = ref('')
const inputVisible = ref(false)
const popoverVisible = ref(false)
const confirmLoading = ref(false)
const {t} = useI18n()
const userFavoriteGroupsWithDefault = computed(()=>{
    return [{
        name:t('defaultGroup'),
        group_id:0
    }].concat(props.userFavoriteGroups)
})

function changeVisible(value:boolean) {
  if (value) {
    if(!verifyLogin()){
        return
    }
    if(props.isCollected){
        emit('collect')
    } else {
        popoverVisible.value = true
    }
  } else {
    popoverVisible.value = false
  }
}

// function clickStar() {
//     if(!verifyLogin()){
//         return
//     }
//     if(props.isCollected){
//         emit('collect')
//     } else {
//         popoverVisible.value = true
//     }
// }

const onConfirm = () => {
    // 如果未关注，则关注
    if(newGroupName.value){
        const hasNewGroup = userFavoriteGroupsWithDefault.value.find(item => item.name === newGroupName.value)
        if(hasNewGroup){
            ElMessage.error(t('groupNameAlreadyExists'))
            return
        }
        // 新建分组并关注
        emit('newGroupAndCollect',newGroupName.value)
    } else {
        emit('collect',activeGroupId.value)
    }
    hidePopover()
}

const isMounted = ref(false)

onMounted(()=>{
    isMounted.value = true
})

onUnmounted(()=>{
    isMounted.value = false
})

function hidePopover() {
    popoverVisible.value = false
    newGroupName.value = ''
    inputVisible.value = false
}

function changeActiveGroupId(groupId:number) {
    activeGroupId.value = groupId
    newGroupName.value = ''
}
</script>

<template>
    <el-popover v-if="isMounted" :visible="popoverVisible" @update:visible="e => changeVisible(e)" :teleported="true" :persistent="false" popper-class="[&&]:[--el-popover-padding:0]"
        trigger="click" width="248px">
        <template #reference>
            <Icon
                name="custom:star"
                :class="`${iconClass} ${isCollected ? 'color-[--yellow]' : 'color-[--icon-color]'}`"
                @click.stop
            />
        </template>
        <template #default>
            <div class="flex flex-col gap-8px p-12px" @click.stop>
                <div v-for="item in userFavoriteGroupsWithDefault" :key="item.group_id">
                <el-checkbox class="[--el-checkbox-height:14px]"  :label="item.name" :modelValue="activeGroupId === item.group_id" @change="changeActiveGroupId(item.group_id)"/>
                </div>
                <el-input v-if="inputVisible" v-model.trim="newGroupName"  :placeholder="$t('enterGroupName')" :maxlength="20"/>
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
    </el-popover>
</template>
