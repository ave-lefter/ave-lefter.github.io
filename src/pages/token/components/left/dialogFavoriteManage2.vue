<script setup lang="ts">
import {
  changeFavoritesTop,
  type GetFavListResponse,
  getFavoriteList,
  type GetUserFavoriteGroupsResponse,
  moveFavoriteGroup,
  changeFavoritesIndex, editTokenFavRemark,getGroupChangeIndex,changeFavoriteGroupName,removeFavoriteGroup,batchDeleteFavorite,removeFavorite
} from '~/api/fav'
import {confirmChangeName} from '~/composables/fav'
import TokenImg from '~/components/tokenImg.vue'
import {useEventBus} from '@vueuse/core'
import {BusEventType} from '~/utils/constants'
import {VueDraggableNext} from 'vue-draggable-next'
import type { CheckboxValueType } from 'element-plus'

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
  visible: Boolean
})

const sortOptions = ref(props.list)
watch(() => props.list, (val) => {
  sortOptions.value = val
})
const favDialogEvent = useEventBus(BusEventType.FAV_DIALOG)
const {t} = useI18n()
const botStore = useBotStore()
const walletStore = useWalletStore()
const walletAddress = computed(() => {
  return botStore.evmAddress || walletStore.address
})
const tokenStore = useTokenStore()
const activeTab = shallowRef(0)
const favoritesList = shallowRef<GetFavListResponse[]>([])
const listStatus = shallowRef({
  loading: false,
  finished: false,
  pageNo: 1,
})
const drag=ref(false)

const checkAll=shallowRef(false)
const isIndeterminate = ref(true)
const checkedList=ref(<any[]>[])
watch([checkedList,favoritesList], (val) => {
  console.log('checkedList,favoritesList', val,checkedList.value, favoritesList.value)
  const newVal1=val[0]
  const newVal2=val[1]
  newVal1.length === newVal2.length && newVal2.length>0
    ? (checkAll.value = true)
    : (checkAll.value = false)
  isIndeterminate.value = newVal1.length > 0 && newVal1.length < newVal2.length
})
onMounted(() => {
  _getFavoriteList()
})

function setActiveTab(val: number) {
  activeTab.value = val
  resetAndGet()
  checkedList.value=[]
  checkAll.value=false
  isIndeterminate.value=false
}

watch(() => [walletAddress.value, props.visible], () => {
  resetAndGet()
  checkedList.value=[]
  checkAll.value=false
  isIndeterminate.value=false
})

async function _getFavoriteList() {
  console.log('_getFavoriteList', listStatus.value.loading)
  if (listStatus.value.loading) {
    return
  }
  try {
    listStatus.value.loading = true
    const res = await getFavoriteList(activeTab.value, listStatus.value.pageNo, walletAddress.value)
    const newItems = (res || []).map(i => ({
      ...i,
      id: i.token + '-' + i.chain,
      address: i.token,
      network: i.chain,
      priceChange24h: i?.price_change ? Number(i?.price_change) / 100 : 0,
      priceUSD: i?.current_price_usd || 0,
      activeGroup: activeTab.value
    }))
    if (listStatus.value.pageNo === 1) {
      favoritesList.value = newItems
    } else {
      favoritesList.value = [...favoritesList.value, ...newItems]
    }
    console.log('_getFavoriteList', res)
    if (res?.length === 0) {
      listStatus.value.finished = true
    }
    if (!listStatus.value.finished) {
      listStatus.value.pageNo++
    }
  } catch (e) {
    console.log('=>(dialogFavoriteManage.vue:52) (e)', (e))
  } finally {
    listStatus.value.loading = false
  }
}

async function confirmSwitchGroup(row: GetFavListResponse, id: number) {
  try {
    const tokenId = row.token + '-' + row.chain
    await moveFavoriteGroup(
      tokenId, id, walletAddress.value
    )
    ElMessage.success(t('success'))
    resetAndGet()
    favDialogEvent.emit({
        type: 'confirmSwitchGroup',
        tokenId
    })
  } catch (e) {
    console.log('=>(dialogFavoriteManage.vue:76) e', e)
    ElMessage.error(t('fail'))
  }
}

async function tokenSetTop(item: GetFavListResponse, index: number) {
  if (index === 0) {
    return
  }
  try {
    const tokenId = item.token + '-' + item.chain
    await changeFavoritesTop(
      tokenId,
      activeTab.value,
      walletAddress.value
    )
    ElMessage.success(t('success'))
    resetAndGet()
    favDialogEvent.emit({
      type: 'order',
      tokenId
    })
  } catch (e) {
    console.log('=>(dialogFavoriteManage.vue:94) e', e)
    ElMessage.error(t('fail'))
  }
}

async function _changeFavoritesIndex(item: GetFavListResponse, index: number, direction: number) {
  const id = item.token + '-' + item.chain
  const j = index + direction
  if (j < 0 || j + 1 > favoritesList.value.length) {
    return
  }
  const item1 = favoritesList.value[j]
  const id1 = item1.token + '-' + item1.chain
  try {
    await changeFavoritesIndex(id, id1, activeTab.value, walletAddress.value)
    ElMessage.success(t('success'))
    resetAndGet()
    favDialogEvent.emit({
      type: 'order',
      tokenId: id
    })
  } catch (e) {
    console.log('=>(dialogFavoriteManage.vue:114) e', e)
    ElMessage.error(t('fail'))
  }
}

function resetAndGet() {
  listStatus.value.pageNo = 1
  listStatus.value.finished = false
  _getFavoriteList()
}

async function handleEditRemark(item: GetFavListResponse) {
  const tokenId = item.token + '-' + item.chain
  const {value} = await ElMessageBox.prompt('', t('enterRemark'), {
    confirmButtonText: t('confirm1'),
    cancelButtonText: t('cancel'),
    customClass:'w-320px p-16px inputPop',
    cancelButtonClass:'w-140px h-30px',
    confirmButtonClass:'w-140px h-30px ml-8px!',
    inputValidator: val => {
      if (val?.length > 50) {
        return t('maximum10characters')
      }
      return true
    }
  })
  confirmEditRemark(value, tokenId, item)
}

async function confirmEditRemark(remark: string, tokenId: string, item: GetFavListResponse) {
  try {
    await editTokenFavRemark(tokenId, remark, walletAddress.value)
    item.remark = remark
    triggerRef(favoritesList)
    ElMessage.success(t('success'))
    favDialogEvent.emit({
      type: 'remark',
      tokenId,
    })
  } catch (e) {
    console.log('=>(dialogFavoriteManage.vue:149) e', e)
  }
}
function handleChangeIndex(groupIds: number[]) {
  // visible.value = false
  // 处理修改排序逻辑
  // return console.log('修改分组排序', groupIds)
  
  getGroupChangeIndex({
      address: walletAddress.value,
      group: groupIds
  }).then(() => {
    ElMessage.success(t('success'))
    props.getData()
    // followStore.getUserFavoriteGroups2()
  }).catch((e) => {
     ElMessage.error(String(e))
  })
}
function dragEnd() {
  // sortOptions.value.forEach((item, index) => {
  //   item.show_index = index + 1
  // })
  const groupIds = sortOptions.value.map(item => item.group_id)
  handleChangeIndex(groupIds)
  console.log('=>(dialogFavoriteManage.vue) sortOptions.value', sortOptions.value)
}

async function _confirmChangeName() {
  await confirmChangeName()
  props.getData()
  favDialogEvent.emit({
    type:'changeFavoriteGroupName',
  })
}

async function _changeFavoriteGroupName(name: string, id: number) {
  try {
    await changeFavoriteGroupName(name, id, walletAddress.value)
    ElMessage.success(t('success'))
    props.getData()
    favDialogEvent.emit({
      type: 'changeFavoriteGroupName'
    })
  } catch (e:any) {
    ElMessage.error(e+'' || t('fail'))
    console.log('=>(dialogGroupManage.vue:31) e', e)
  }
}

async function rename(item: GetUserFavoriteGroupsResponse) {
  const {value} = await ElMessageBox.prompt('', t('enterGroupName'), {
    confirmButtonText: t('confirm1'),
    cancelButtonText: t('cancel'),
    customClass:'w-320px p-16px inputPop',
    cancelButtonClass:'w-140px h-30px',
    confirmButtonClass:'w-140px h-30px ml-8px!',
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

async function _removeFavoriteGroup(item: GetUserFavoriteGroupsResponse) {
  await ElMessageBox.confirm(t('removeFavGroupTips'), t('tips'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    customClass:'w-320px p-16px inputPop',
    cancelButtonClass:'w-140px h-30px',
    confirmButtonClass:'w-140px h-30px ml-8px!',
    dangerouslyUseHTMLString: true,
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

function batchDelete() {
  batchDeleteFavorite({
    address: walletAddress.value,
    token_ids: checkedList.value
  }).then(() => {
    ElMessage.success(t('success'))
    resetAndGet()
    checkedList.value = []
    checkAll.value = false
    isIndeterminate.value = false
    favDialogEvent.emit({
      type: 'delete',
    })
  }).catch((e) => {
     ElMessage.error(String(e))
  })
}

const handleCheckAllChange = (val: CheckboxValueType) => {
  checkedList.value = val ? favoritesList.value.map(i => i.token+'-' + i.chain  ) : []
  isIndeterminate.value = false
}

function removeTokenFavorite(row:any) {
  removeFavorite(`${row.token}-${row.chain}`, walletAddress.value)
    .then(() => {
      favDialogEvent.emit({
        type: 'delete',
      })
      resetAndGet()
      // TODO: 
      ElMessage.success(t('cancelled1'))
      props.getData()
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>
   <!-- @start="drag = true"
              @end="drag = false" -->
<template>
  <div class="flex h-420px">
    <div class="w-240px h-full py-20px">
      <div class="font-500 text-20px lh-[100%] mb-10px px-20px">{{ t('favoritesGroup') }}</div>
    <!-- listStatus:{{ JSON.stringify(listStatus) }} -->
      <div class="h-[310px]">
        <el-scrollbar wrap-class="mb-0px">
            <VueDraggableNext
                v-model="sortOptions"
                class="flex flex-col"
                tag="ul"
                v-bind="{ animation: 300}"
                item-key="show_index"
                handle=".handle1"
                @end="dragEnd"
              >
              <li v-for="item in sortOptions" :key="item?.show_index" :class="`dragItem flex-between font-400 py-12px px-20px hover:bg-[--d-2A2A2A-l-F2F2F2] cursor-pointer ${activeTab===item.group_id && 'bg-[--dialog-list-hover]'}`"
              @click="setActiveTab(item.group_id)"
              >
                <span>{{ item?.name }}</span>
                <div class="flex items-center gap-8px dragItemIcons invisible">
                  <Icon v-if="item?.group_id" name="material-symbols:dehaze" class="text-16px text-[--third-text] cursor-move handle1"/>
                  <Icon v-if="item?.group_id" name="bxs:edit-alt" class="text-13px clickable color-[--third-text]"
                  @click.stop.prevent="rename(item)" />
                  <Icon v-if="item?.group_id" name="bx:bxs-trash-alt" class="text-13px clickable color-[--third-text]"
                  @click.stop.prevent="_removeFavoriteGroup(item)" />
                </div>
              </li>
                <!-- <transition-group type="transition" name="flip-list">
                </transition-group> -->
              </VueDraggableNext>
        </el-scrollbar>
      </div>
      <div class="flex items-center px-20px">
        <el-button type="primary" color="#3F80F7" class="w-100% h-40px" @click="_confirmChangeName">{{ t('newGroup') }}</el-button>
      </div>
    </div>
    <div class="w-480px h-full py-20px bg-[--secondary-bg]">
      <div class="font-500 text-20px lh-[100%] mb-20px">{{ t('groupDetails') }}</div>
      <!-- <div class="flex items-center whitespace-nowrap overflow-x-auto scrollbar-hide mb-12px">
        <a
          v-for="(item,index) in list"
          :key="index" href="javascript:;"
          :class="`decoration-none shrink-0 text-12px lh-16px text-center px-12px py-4px rounded-4px
           ${activeTab===item.group_id ? 'bg-[--border] color-[--main-text]':'color-[--third-text]'}`"
          @click="setActiveTab(item.group_id)"
        >
          {{ item.name }}
        </a>
      </div> -->
       <el-checkbox-group v-model="checkedList">
            <!-- v-loading="listStatus.loading"
        v-infinite-scroll="_getFavoriteList"
        :infinite-scroll-disabled="listStatus.loading || listStatus.finished"
        infinite-scroll-distance="200"
        :infinite-scroll-delay="10"
        :infinite-scroll-immediate="false" -->
      <el-table
        id="table_fav"
        ref="table_ref"
    
        :data="favoritesList"
        height="280px"
        class="w-full table-container [&&]:text-12px"
        highlight-current-row
      >
        <template #empty>
          <AveEmpty/>
        </template>
        <el-table-column
          :label="$t('token')"
        >
          <template #default="{ row }">
            <div class="flex items-center">
              <el-checkbox :value="row?.token+'-'+row?.chain" size="large" />
              <TokenImg
                class="mr-8px"
                :row="row"
              />
              <div class="flex flex-col items-start">
                <span class="[&&]:color-[--main-text] text-12px flex lh-[1.15]">{{ row.symbol }}</span>
                <span v-if="row.remark" class="mt-2px border-solid border-0.5px border-#286dff color-#286dff rounded-4px text-10px px-4px py-1px overflow-hidden text-ellipsis whitespace-nowrap max-w-100px lh-[1.15]">
                  {{row.remark || '-' }}
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('changeGroup')" align="right">
          <template #default="{ row }">
            <el-select
              v-model="row.activeGroup"
              class="[&&]:[--el-fill-color-blank:--border]"
              :placeholder="$t('pleaseSelectGroup')"
              @change="confirmSwitchGroup(row, $event)"
            >
              <el-option
                v-for="item in list"
                :key="item.group_id"
                :label="item.name"
                :value="item.group_id"
                :disabled="activeTab === item.group_id"
              />
            </el-select>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="name" :label="$t('sort')" align="center">
          <template #default="{ row, $index }">
            <el-button
              link
              size="small"
              :disabled="$index === 0"
              @click.stop="tokenSetTop(row, $index)"
            >
              {{ $t('top') }}
            </el-button>
            <el-button
              link
              size="large"
              :disabled="$index === 0"
              @click.stop="_changeFavoritesIndex(row, $index, -1)"
            >
              {{ $t('up') }}
            </el-button>
            <el-button
              link
              size="large"
              :disabled="$index + 1 === favoritesList.length"
              @click.stop="_changeFavoritesIndex(row, $index, 1)"
            >
              {{ $t('down') }}
            </el-button>
          </template>
        </el-table-column> -->
        <!-- <el-table-column :label="$t('remark')" show-overflow-tooltip align="center">
          <template #default="{ row }">
            <span>{{ row.remark || '-' }}</span>
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('operate')" align="right">
          <template #default="{ row,$index }">
            <div class="flex items-center gap-8px justify-end">
              <Icon name="bx:arrow-to-top" :class="`text-16px clickable ${$index === 0 ? 'color-[--third-text] cursor-not-allowed' : 'color-[--main-text]'}`"
                @click.stop="tokenSetTop(row, $index)" />
              <Icon name="material-symbols:arrow-upward" :class="`text-16px clickable ${$index === 0 ? 'color-[--third-text] cursor-not-allowed' : 'color-[--main-text]'}`"
                @click.stop="_changeFavoritesIndex(row, $index, -1)" />
              <Icon name="material-symbols:arrow-downward" :class="`text-16px clickable ${$index + 1 === favoritesList.length ? 'color-[--third-text] cursor-not-allowed' : 'color-[--main-text]'}`"
                @click.stop="_changeFavoritesIndex(row, $index, 1)" />
              <Icon name="bxs:edit-alt" class="text-13px clickable color-[--main-text]"
                @click.stop.prevent="handleEditRemark(row)" />
              <Icon name="bx:bxs-trash-alt" class="text-13px clickable color-[--main-text]"
                  @click.stop.prevent="removeTokenFavorite(row)" />
            </div>
            <!-- <el-button
              link
              size="small"
              :disabled="$index === 0"
              @click.stop="tokenSetTop(row, $index)"
            >
              {{ $t('top') }}
            </el-button> -->
            <!-- <el-button
              link
              size="large"
              :disabled="$index === 0"
              @click.stop="_changeFavoritesIndex(row, $index, -1)"
            >
              {{ $t('up') }}
            </el-button> -->
            <!-- <el-button
              link
              size="large"
              :disabled="$index + 1 === favoritesList.length"
              @click.stop="_changeFavoritesIndex(row, $index, 1)"
            >
              {{ $t('down') }}
            </el-button> -->
          
            <!-- <span
              class="cursor-pointer color-[--main-text]"
              @click.stop.prevent="handleEditRemark(row)">
              {{ $t('edit') }}
            </span> -->
          </template>
        </el-table-column>
        <template #append>
          <div
            v-infinite-scroll="_getFavoriteList"
            class="text-0 lh-0 h-0"
            :infinite-scroll-disabled="listStatus.loading || listStatus.finished"
            :infinite-scroll-distance="20"
            :infinite-scroll-delay="200"
            :infinite-scroll-immediate="true"
          />
          <div v-if="listStatus.loading && favoritesList?.length > 0"  class="text-center px-0 pt-15px pb-10px text-12px color-[--third-text]">{{ $t('loading') }} </div>
          <div v-else-if="listStatus.finished && favoritesList?.length > 0" class="text-center px-0 pt-15px pb-10px text-12px color-[--third-text]">{{ $t('noMore') }}</div>
        </template>
      </el-table>
      </el-checkbox-group>
      <!-- <div
        v-if="listStatus.pageNo!==1 && listStatus.loading"
        class="flex justify-center items-center py-15px text-12px">
        <span>{{ $t('loading') }}</span>
      </div> -->
    
      <div class="flex-between h-80px px-20px">
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate"
    @change="handleCheckAllChange" :label="t('selectAll')" size="large" />
        <el-button type="primary" color="#3F80F7" class="h-40px" @click="batchDelete" :disabled="!checkedList.length">批量删除</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#table_fav {
  --el-table-header-bg-color: transparent;
  --el-table-tr-bg-color:transparent;
  --el-table-border: 1px solid var(--dialog-divider);
  --el-table-text-color: var(--main-text);
  --el-table-row-hover-bg-color:var(--dialog-list-hover);
  --el-table-bg-color: transparent;
  :deep() .el-table__header-wrapper {
    font-size: 12px;
  }
  :deep() .el-table__cell,.el-table__row {
    padding-left: 20px;
    padding-right: 20px;
    .cell{
      &:first-child {
        padding-left: 0px;
      }
      &:last-child {
        padding-right: 10px;
      }
    }
  }
}
.dragItem:hover{
  .dragItemIcons{
    visibility: visible;
  }
}
</style>
