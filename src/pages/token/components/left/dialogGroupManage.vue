<script setup lang="ts">
import {
  changeFavoriteGroupName,
  setTopFavoriteGroup, changeIndexFavoriteGroup,
  type GetUserFavoriteGroupsResponse, removeFavoriteGroup,
} from '~/api/fav'
import {confirmChangeName} from '~/composables/fav'
import {useEventBus} from "@vueuse/core";
import {BusEventType} from "~/utils/constants";

const {t} = useI18n()
const botStore = useBotStore()
const walletStore = useWalletStore()
const walletAddress = computed(() => {
  return botStore.evmAddress || walletStore.address
})
const favDialogEvent = useEventBus(BusEventType.FAV_DIALOG)
const props = defineProps({
  list: {
    type: Array<GetUserFavoriteGroupsResponse>,
    default: () => []
  },
  getData: {
    type: Function,
    default: () => {
    }
  },
  loading: Boolean
})
const currentList = computed(() => props.list.slice(1))

async function rename(item: GetUserFavoriteGroupsResponse) {
  const {value} = await ElMessageBox.prompt('', t('enterRemark'), {
    confirmButtonText: t('confirm1'),
    cancelButtonText: t('cancel'),
    inputValidator: val => {
      if (!val) {
        return t('cannotBeEmpty')
      }
      if (val?.length > 20) {
        return t('maximum10characters')
      }
      return true
    }
  })
  _changeFavoriteGroupName(value, item.group_id)
}

async function _changeFavoriteGroupName(name: string, id: number) {
  try {
    await changeFavoriteGroupName(name, id, walletAddress.value)
    ElMessage.success(t('success'))
    props.getData()
    favDialogEvent.emit({
      type: 'changeFavoriteGroupName'
    })
  } catch (e) {
    console.log('=>(dialogGroupManage.vue:31) e', e)
  }
}

async function _setTopFavoriteGroup(item: GetUserFavoriteGroupsResponse, index: number) {
  if (index === 0) {
    return
  }
  try {
    await setTopFavoriteGroup(
      item.group_id,
      walletAddress.value
    )
    ElMessage.success(t('success'))
    props.getData()
  } catch (e) {
    console.log('=>(dialogFavoriteManage.vue:94) e', e)
    ElMessage.error(t('fail'))
  }
}

async function _changeIndexFavoriteGroup(item: GetUserFavoriteGroupsResponse, index: number, direction: number) {
  const id = item.group_id
  const j = index + direction
  if (j < 0 || j + 1 > currentList.value.length) {
    return
  }
  const item1 = currentList.value[j]
  const id1 = item1.group_id
  try {
    await changeIndexFavoriteGroup(id, id1, walletAddress.value)
    ElMessage.success(t('success'))
    props.getData()
  } catch (e) {
    console.log('=>(dialogFavoriteManage.vue:114) e', e)
    ElMessage.error(t('fail'))
  }
}

async function _removeFavoriteGroup(item: GetUserFavoriteGroupsResponse) {
  await ElMessageBox.confirm(t('removeFavGroupTips'), t('tips'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    dangerouslyUseHTMLString: true,
    customClass: '',
  })
  try {
    await removeFavoriteGroup(item.group_id, walletAddress.value)
    ElMessage.success(t('success'))
    props.getData()
    favDialogEvent.emit({
      type: 'removeFavoriteGroup',
      groupId:item.group_id
    })
  } catch (e) {
    console.log('=>(dialogGroupManage.vue:92) e', e)

  }
}

async function _confirmChangeName() {
  await confirmChangeName()
  props.getData()
}

</script>

<template>
  <div class="w-full px-5px [&&]:text-12px">
    <el-table
      v-loading="loading"
      :data="currentList"
      height="325px"
      class="[--el-font-size-base:12px]"
    >
      <template #empty>
        <AveEmpty/>
      </template>
      <el-table-column :label="$t('groupName')" prop="name"/>
      <el-table-column :label="$t('rename')" align="center">
        <template #default="{ row }">
          <span
            class="cursor-pointer"
            @click.stop.prevent="rename(row)"
          >{{ $t('edit') }}
        </span></template>
      </el-table-column>
      <el-table-column
        prop="name" :label="$t('sort')" align="center">
        <template #default="{ row, $index }">
          <el-button
            size="large"
            link
            :disabled="$index === 0"
            @click.stop="_setTopFavoriteGroup(row, $index)"
          >
            {{ $t('top') }}
          </el-button>
          <el-button
            link
            size="large"
            :disabled="$index === 0"
            @click.stop="_changeIndexFavoriteGroup(row, $index, -1)"
          >
            {{ $t('up') }}
          </el-button>
          <el-button
            link
            size="large"
            :disabled="$index + 1 === currentList.length"
            @click.stop="_changeIndexFavoriteGroup(row, $index, 1)"
          >
            {{ $t('down') }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('operate')" align="center">
        <template #default="{ row }">
          <span class="cursor-pointer" @click.stop.prevent="_removeFavoriteGroup(row)">{{ $t('delete') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <span
      class="mt-20px cursor-pointer px-26px py-12px text-14px font-500 radius-6px block text-center
        color-[--d-F5F5F5-l-333] bg-[--d-3F80F7-l-EAECEF] hover:opacity-80
      "
      @click="_confirmChangeName">
      {{ t('newGroup') }}
    </span>
  </div>
</template>

<style scoped>

</style>
