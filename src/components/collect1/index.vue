<script setup lang="ts">
import type { GetUserFavoriteGroupsResponse } from '~/api/fav'
import CollectForm from './collectForm.vue'

const props = defineProps<{
    iconClass?: string
    isCollected?: boolean
    userFavoriteGroups: GetUserFavoriteGroupsResponse[]
}>()

const emit = defineEmits<{
    (e: 'collect',groupId?:number): void
    (e: 'newGroupAndCollect',newGroupName:string): void
}>()

const { $popover } = useNuxtApp()
const target = ref<HTMLElement | null>(null)

const {t} = useI18n()
const userFavoriteGroupsWithDefault = computed(()=>{
    return [{
        name:t('defaultGroup'),
        group_id:0
    }].concat(props.userFavoriteGroups)
})

const popoverVisible = ref(false)

const hide = () => {
  $popover?.hide()
}

const onEnter = (e: MouseEvent) => {
  const el = e.target as HTMLElement
  if (target.value !== el) {
    hide()
    target.value = el
  }

  $popover?.show({
    target: el,
    content: {
      is: CollectForm,
      props: {
        userFavoriteGroupsWithDefault: userFavoriteGroupsWithDefault.value,
        onNewGroupAndCollect: (groupName: string) => {
          emit('newGroupAndCollect', groupName)
        },
        onCollect: (groupId: number) => {
          emit('collect', groupId)
        },
        onHide: hide
      }
    },
    props: {
      placement: 'right',
      width: '250',
      trigger: 'click',
      persistent: false,
      'popper-class': '[&&]:[--el-popover-padding:0]',
      visible: popoverVisible.value,
      'onUpdate:visible': (value: boolean) => {
        if (value) {
          if(!verifyLogin()){
            return
          }
          if(props.isCollected){
            emit('collect')
            return
          }
        }
      }
    }
  })
}

</script>

<template>
    <Icon
      name="custom:star"
      :class="`${iconClass} ${isCollected ? 'color-[--yellow]' : 'color-[--icon-color]'}`"
      @click.stop.prevent @mouseover.stop="onEnter"
  />
    <!-- <el-popover :persistent="false" popper-class="[&&]:[--el-popover-padding:0]" :visible="popoverVisible"
        trigger="click" width="248px">
        <template #reference>
            <Icon
                name="custom:star"
                :class="`${iconClass} ${isCollected ? 'color-[--yellow]' : 'color-[--icon-color]'}`"
                @click.self.stop="clickStar"
            />
        </template>
        <template #default>
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
    </el-popover> -->
</template>
