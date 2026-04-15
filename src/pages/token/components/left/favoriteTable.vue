<script setup lang="ts">
import FavDialog from './favDialog2.vue'
import {
  type GetUserFavoriteGroupsResponse,
  type GetFavListResponse,
  getFavoriteList,
  getUserFavoriteGroups,
  batchChangeFavoritesIndex,
} from '~/api/fav'
import TokenImg from '~/components/tokenImg.vue'
import { formatNumber } from '~/utils/formatNumber'
import THead from './tHead.vue'
import type { IPriceV2Response } from '~/api/types/ws'
import { useEventBus, useLocalStorage, useStorage } from '@vueuse/core'
import { BusEventType, type IFavDialogEventArgs } from '~/utils/constants'
import type { ScrollbarInstance } from 'element-plus'
const favTokenStore = useFavTokenStore()
const pumpRemarkEditEvent = useEventBus<IFavDialogEventArgs>(BusEventType.PUMP_REMARK_EDIT)
pumpRemarkEditEvent.on(handleFavDialogEvent)
import { VueDraggable } from 'vue-draggable-plus'
const topEventBus = useEventBus(BusEventType.TOP_FAV_CHANGE)
topEventBus.on(refresh)
const favDialogEvent = useEventBus<IFavDialogEventArgs>(BusEventType.FAV_DIALOG)
favDialogEvent.on(refresh)
const topAddGroupEvent = useEventBus(BusEventType.TOP_ADD_GROUP)
topAddGroupEvent.on(_getUserFavoriteGroups)

const otherListArea = ref<ScrollbarInstance>()
const {updateNum4,updateNum11,delTokenGroup} = storeToRefs(useFollowStore())
const isDragging = ref(false)

onUnmounted(() => {
  topEventBus.off(refresh)
  favDialogEvent.off(refresh)
  topAddGroupEvent.off(refresh)
  pumpRemarkEditEvent.off(handleFavDialogEvent)
})

function refresh(data:any) {
  console.log('refresh',data)
  if(data===-1){
    removeFavToken()
  }else{
    resetListStatus()
    loadMoreFavorites()
  }
}

const { t } = useI18n()
const wsStore = useWSStore()
const priceV2Store = usePriceV2Store()
const {token} = storeToRefs(useTokenStore())
const route = useRoute()
const {zone} = storeToRefs(useGlobalStore())
const addressAndChain = computed(() => {
  const id = route.params.id as string
  if (id) {
    return getAddressAndChainFromId(id)
  }
  return {
    address: token.value?.token || '',
    chain: token.value?.chain || ''
  }
})
watch(
  () => wsStore.wsResult[WSEventType.PRICEV2],
  (val: IPriceV2Response) => {
    favoritesList.value = favoritesList.value.map((i) => {
      const item = val.prices.find((j) => {
        return i.token === j.token && i.chain === j.chain
      })
      if (item) {
        return {
          ...i,
          current_price_usd: item.uprice,
          price_change: item.price_change,
          price_change_v2: item.price_change_v2,
          t_price_change_24h: item.tprice_change_24h,
          t_price_change_1d: item.tprice_change_1d,
          m_price_change_24h: i.support_aggr_kline == 1 ? item.tprice_change_24h : item.price_change_v2,
          m_price_change_1d: i.support_aggr_kline == 1 ? item.tprice_change_1d : item.price_change,
          pool_circulating_supply:
            (i.total - i.lock_amount - i.burn_amount - i.other_amount) * item.uprice
        }
      }
      return i
    })
    // 排序
    if(sort.value.sortBy === 'price_change'||sort.value.sortBy === 'price_change_v2'){
      favoritesList.value.sort((a: any, b: any) => {
        return ((b[sort.value.sortBy!] || 0) - (a[sort.value.sortBy!] || 0)) * sort.value.activeSort
      })
    }
    triggerRef(favoritesList)
  }
)
const props = defineProps({
  height: {
    type: [Number, String],
    default: 0,
  },
})
const scrollbarHeight = computed(() => {
  return Number(props.height) - 110
})
const botStore = useBotStore()
const walletStore = useWalletStore()
const walletAddress = computed(() => {
  return botStore.evmAddress || walletStore.address
})
const editVisible = shallowRef(false)
const loading = shallowRef(false)
const {userFavoriteGroups} = storeToRefs(useGlobalStore())
const activeTab = shallowRef(0)
const favoriteCondition = useStorage('favoriteCondition', { currentMode: 'mcap' })
const sort = shallowRef<{
  activeSort: number
  sortBy: 'symbol' | 'current_price_usd' | 'price_change' | 'price_change_v2' | 'm_price_change_24h' | 'm_price_change_1d' | null
}>({
  activeSort: 0,
  sortBy: null,
})

const sortParam={
  sort: '',
  sort_dir: '',
}



const listStatus = ref({
  finished: false,
  loading: false,
  pageNo: 1,
  error: false,
})
const favoritesList = shallowRef<
  (GetFavListResponse & {
    id: string
    pool_circulating_supply: number
  })[]
>([])

const userFavoriteGroups2=computed(()=>{
  return  [
      {
        group_id: 0,
        name: t('defaultGroup'),
      },
      ...(userFavoriteGroups.value||[])
    ]
})

const columns = computed(() => {
  return [
    {
      label: t('token'),
      value: 'symbol',
      flex: 'flex-1',
      sort: true,
    },
    {
      label:
        (favoriteCondition.value.currentMode === 'mcap' ? t('mCap') : t('price')) +
        '{currentMode}/' +
        t('Chg')+'%',
      value: zone.value === '24h' ? 'm_price_change_24h' : 'm_price_change_1d',
      currentMode: favoriteCondition.value.currentMode,
      flex: 'flex-1 justify-end',
      sort: true,
    },
    //   {
    //   label: '24H%',
    //   value: 'price_change',
    //   flex: 'flex-1 justify-end',
    //   sort: true
    // }
  ]
})
const sortedFavList = computed(() => {
  if (sort.value.activeSort === 0 || !sort.value.sortBy) {
    return favoritesList.value
  }
  if(sort.value.sortBy === 'symbol'){
    return favoritesList.value.toSorted((a: any, b: any) => {
      const symbolB = b.symbol?.[0]?.toLowerCase() || ''
      const symbolA = a.symbol?.[0]?.toLowerCase() || ''
      const codeB = symbolB.charCodeAt(0) || 0
      const codeA = symbolA.charCodeAt(0) || 0
      return (codeB - codeA) * sort.value.activeSort
    })
  }
  else if(sort.value.sortBy === 'm_price_change_24h'||sort.value.sortBy === 'm_price_change_1d'){
    return favoritesList.value.toSorted((a: any, b: any) => {
      return ((b[sort.value.sortBy!] || 0) - (a[sort.value.sortBy!] || 0)) * sort.value.activeSort
    })
  }
  else{
    return favoritesList.value
  }
})

onMounted(() => {
  if (walletAddress.value) {
    useGlobalStore().getUserFavoriteGroups(walletAddress.value)
  }else{
    userFavoriteGroups.value=[]
  }
})

onBeforeUnmount(() => {
  priceV2Store.setMultiPriceParams('favorite', [])
  priceV2Store.sendPriceWs()
})
watch(
  () => walletAddress.value,
  (val) => {
    if(val){
      useGlobalStore().getUserFavoriteGroups(walletAddress.value)
      setActiveTab(0, 0)
    }else{
      userFavoriteGroups.value=[]
    }
  }
)

watch(
  ()=>zone.value,
  (val2) => {
    if(sortParam.sort_dir&&(sortParam.sort==='m_price_change_24h' || sortParam.sort==='m_price_change_1d')){
      sortParam.sort=(val2==='24h'?'m_price_change_24h':'m_price_change_1d')
      sort.value.sortBy=(val2==='24h'?'m_price_change_24h':'m_price_change_1d')
      resetListStatus()
      loadMoreFavorites()
    }
  }
)

watch(
  () => sort.value,
  (val) => {
    console.log('sort changed', val)
    if(val.sortBy==='m_price_change_24h' || val.sortBy==='m_price_change_1d'){
        sortParam.sort_dir=['asc', '', 'desc'][(val.activeSort||0)+1]
        sortParam.sort=val.sortBy

    }else{
      sortParam.sort_dir=''
      sortParam.sort=''
    }

    // 当 activeSort 为 0 时，重置 sortBy 以启用拖拽
    if (val.activeSort === 0) {
      sort.value.sortBy = null
    }

    resetListStatus()
    loadMoreFavorites()
  }
)
watch(
  () => walletStore.walletSignature[walletStore.address],
  () => {
    resetListStatus()
    loadMoreFavorites()
  }
)

watch(
  () => updateNum11.value,
  () => {
    console.log('updateNum11.value', updateNum11.value)
    resetListStatus()
    loadMoreFavorites()
  }
)
watch(
  () => delTokenGroup.value,
  (val) => {
    if(val==activeTab.value){
      setActiveTab(0, 0)
    }
  }
)

const arrowVisible = ref(false)
async function _getUserFavoriteGroups() {
  try {
    loading.value = true
    useGlobalStore().getUserFavoriteGroups(walletAddress.value)
    // userFavoriteGroups.value = [
    //   {
    //     group_id: 0,
    //     name: t('defaultGroup'),
    //   },
    // ].concat((res || []).filter((el) => !!el.name))
    setTimeout(() => {
      arrowVisible.value = Number(tabsContainer.value?.offsetWidth) > 212
    })
  } catch (e) {
    console.log('=>(favoriteTable.vue:19) e', e)
  } finally {
    loading.value = false
  }
}

function onEdit() {
  editVisible.value = true
}

onMounted(() => {
  loadMoreFavorites()
})

const tabsContainer = ref<HTMLElement | null>(null)
// const arrowVisible = computed(()=>{
//   if(!tabsContainer.value) return false
//   const containerWidth = tabsContainer.value.offsetWidth
//   const childrenWidth = userFavoriteGroups.value.reduce((acc, _,index) => acc + (tabsContainer.value.children[index]).offsetWidth, 0)
//   console.log(tabsContainer.value.offsetWidth,'xxxxx',childrenWidth,tabsContainer.value.children.length)
//   return childrenWidth > containerWidth
// })

function removeFavToken() {
  const tokenId=addressAndChain.value.address + '-' + addressAndChain.value.chain
  const index = favoritesList.value.findIndex(item => item.token + '-' + item.chain === tokenId)
  if (index !== -1) {
    favoritesList.value.splice(index, 1)
  }
  triggerRef(favoritesList)
}


function setActiveTab(groupId: number, index: number) {
  activeTab.value = groupId
  resetListStatus()
  loadMoreFavorites()
  scrollTabToCenter(tabsContainer, index)
}

async function loadMoreFavorites() {
  try {
    listStatus.value.loading = true
    const pageNo = listStatus.value.pageNo
    const res = await getFavoriteList(activeTab.value, pageNo, walletAddress.value,sortParam.sort_dir,sortParam.sort)
    if (Array.isArray(res)) {
      const list = res
        .map((i) => ({
          ...i,
          id: i.token + '-' + i.chain,
          //TODO price_change_v2
          price_change: i.price_change,
          price_change_v2: i.price_change_v2,
          pool_circulating_supply:
            (i.total - i.lock_amount - i.burn_amount - i.other_amount) * i.current_price_usd,
        }))
        .filter(
          (i) =>
            i?.chain !== 'brc20' &&
            i?.chain !== 'runes' &&
            !i?.token?.includes('inscription:') &&
            !i?.token?.includes('(')
        )

      if (pageNo === 1) {
        favoritesList.value = list
      } else {
        favoritesList.value = favoritesList.value.concat(list)
      }
      priceV2Store.setMultiPriceParams(
        'favorite',
        favoritesList.value.map((el) => el.id)
      )
      priceV2Store.sendPriceWs()
      listStatus.value.finished = res?.length === 0
      if (!listStatus.value.finished) {
        listStatus.value.pageNo++
      }
    }
  } catch (e) {
    console.log('=>(favoriteTable.vue:106) (e)', e)
    listStatus.value.error = true
  } finally {
    listStatus.value.loading = false
  }
}

function resetListStatus() {
  otherListArea.value!.setScrollTop(0)
  listStatus.value.finished = false
  listStatus.value.pageNo = 1
}

async function handleDragEnd(evt: any) {
  isDragging.value = false

  // 获取被拖拽的 item 信息
  const draggedItem = favoritesList.value[evt.newIndex]
  if (!draggedItem) return

  const moves = [{
    token_id: draggedItem.token + '-' + draggedItem.chain,
    new_index: evt.newIndex + 1  // API 使用 1-based index
  }]

  // 更新排序
  try {
    await batchChangeFavoritesIndex(walletAddress.value, activeTab.value, moves)
    updateNum4.value++
    ElMessage.success(t('success'))
    favDialogEvent.emit({
      type: 'order',
    })
  } catch (e) {
    console.log('=>(favoriteTable.vue) drag error', e)
    ElMessage.error(t('fail'))
    // 出错时重新加载列表以恢复原顺序
    resetListStatus()
    loadMoreFavorites()
  }
}

function handleDragStart() {
  isDragging.value = true
}

function toggleMode(mode: string) {
  if (favoriteCondition.value.currentMode === 'mcap') {
    favoriteCondition.value.currentMode = 'price'
  } else {
    favoriteCondition.value.currentMode = 'mcap'
  }
  console.log('toggleMode', mode)
}
function handleFavDialogEvent({ type }: IFavDialogEventArgs) {
  if (type === 'pump_remark_edit' && favTokenStore.visible) {
    resetListStatus()
    loadMoreFavorites()
  }
}
</script>

<template>
  <div v-loading="listStatus.pageNo === 1 && listStatus.loading"  class="hide-scrollbar">
    <div class="flex items-center justify-between pr-15px pl-12px mt-10px">
      <div class="flex items-center min-w-0">
        <span
          v-show="arrowVisible"
          class="w-20px h-20px rounded-2px color-[--third-text] hover:color-[--secondary-text] bg-[--secondary-bg] flex items-center justify-center cursor-pointer"
          @click="scrollElement(tabsContainer, -200)"
        >
          <Icon name="material-symbols:arrow-back-ios-new-rounded" />
        </span>
        <div
          ref="tabsContainer"
          class="flex items-center gap-10px whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide"
        >
          <span
            :class="`decoration-none shrink-0 text-12px lh-16px text-center px-4px py-2px rounded-4px cursor-pointer ${activeTab === 0 ? 'bg-[--border] color-[--main-text]' : 'color-[--third-text]'}`"
            @click="setActiveTab(0, 0)"
          >
            {{ $t('defaultGroup') }}
          </span>
          <span
            v-for="(item, index) in userFavoriteGroups"
            :key="index"
            :class="`decoration-none shrink-0 text-12px lh-16px text-center px-4px py-2px rounded-4px cursor-pointer ${activeTab === item.group_id ? 'bg-[--border] color-[--main-text]' : 'color-[--third-text]'}`"
            @click="setActiveTab(item.group_id, index + 1)"
          >
            {{ item.name }}
          </span>
        </div>
        <span
          v-show="arrowVisible"
          class="mr-4px w-20px h-20px rounded-2px color-[--third-text] hover:color-[--secondary-text] bg-[--secondary-bg] flex items-center justify-center cursor-pointer"
          @click="scrollElement(tabsContainer, 200)"
        >
          <Icon name="material-symbols:arrow-forward-ios-rounded" />
        </span>
      </div>
      <Icon
        name="custom:remark"
        class="shrink-0 text-12px mr-0 cursor-pointer color-[--third-text] hover:color-#286DFF"
        @click.self="onEdit"
      />
    </div>
    <THead v-model:sort="sort" :columns="columns" :toggleMode="toggleMode" />
    <el-scrollbar ref="otherListArea" :height="scrollbarHeight">
      <div
        v-infinite-scroll="loadMoreFavorites"
        :infinite-scroll-disabled="listStatus.loading || listStatus.finished || isDragging"
        infinite-scroll-distance="200"
        :infinite-scroll-delay="10"
        :infinite-scroll-immediate="false"
      >
        <VueDraggable
          v-model="favoritesList"
          :animation="300"
          :disabled="sort.activeSort !== 0 || !!sort.sortBy"
          @start="handleDragStart"
          :force-fallback="true"
          @end="handleDragEnd"
        >
          <NuxtLink
            v-for="(row, $index) in (sort.activeSort === 0 && !sort.sortBy) ? favoritesList : sortedFavList"
            :key="`${row.token}-${row.chain}`"
            class="px-10px flex items-center h-40px cursor-pointer hover:bg-[--dialog-bg] group"
            :to="`/token/${row.token}-${row.chain}`"
          >
              <div class="flex items-center flex-1">
                <Icon
                  v-if="sort.activeSort === 0 && !sort.sortBy"
                  name="material-symbols:dehaze"
                  class="text-14px text-[--third-text] cursor-move drag-handle3 w-0 group-hover:w-14px mr-0 group-hover:mr-6px transition-all duration-200 overflow-hidden"
                />
              <TokenImg class="mr-8px" :row="{...row,issue_platform:''}" v-tooltip="{
                content:{
                  is:TokenImg,
                  props:{
                    'row':row,
                    'chain-class':'hidden',
                    'token-class':'w-240px h-240px [&&]:mr-0 rounded-16px'
                  }
                },
                props:{
                  'placement':'bottom-start',
                  'show-arrow':false,
                  'popper-class':'tooltip-pd-0'
                }
              }" />
              <div class="flex flex-col items-start">
                <span class="text-12px flex items-center">
                  <span class="ellipsis">{{ row.symbol }}</span>
                  <img
                    v-if="row.issue_platform"
                    v-tooltip="row.issue_platform"
                    class="ml-5px w-10px h-10px rounded-full"
                    :src="formatIconTag(row.issue_platform)"
                    alt=""
                  />
                </span>
                <span
                  v-if="row.remark"
                  class="mt-2px border-solid border-0.5px border-#286dff color-#286dff rounded-4px text-10px px-4px py-1px overflow-hidden text-ellipsis whitespace-nowrap max-w-100px"
                  >{{ row.remark }}</span
                >
              </div>
            </div>
            <div class="flex-1 text-12px text-right">
              <div v-if="favoriteCondition.currentMode !== 'mcap'">
                ${{ formatNumber(row.current_price_usd || 0, 4) }}
              </div>
              <div v-else>${{ formatNumber(row.pool_circulating_supply || 0, 2) }}</div>
              <div
                :class="`flex-1 text-right text-12px
                ${getColorClass((zone==='24h'? row.m_price_change_24h :row.m_price_change_1d) || 0)}`
            "
              >
                <template v-if="Number((zone==='24h'? row.m_price_change_24h :row.m_price_change_1d)) === 0">0%</template>
                <template v-else-if="!(zone==='24h'? row.m_price_change_24h :row.m_price_change_1d) || (zone==='24h'? row.m_price_change_24h :row.m_price_change_1d) === '--'">--</template>
                <template v-else>
                  {{ Number((zone==='24h'? row.m_price_change_24h :row.m_price_change_1d)) > 0 ? '+' : '-'
                  }}{{ formatNumber(Math.abs(Number((zone==='24h'? row.m_price_change_24h :row.m_price_change_1d))) || 0, 2) }}%
                </template>
              </div>
            </div>
          </NuxtLink>
          <AveEmpty v-if="((sort.activeSort === 0 && !sort.sortBy) ? favoritesList.length : sortedFavList.length) === 0 && !listStatus.loading" />
        </VueDraggable>
        <div
          v-if="listStatus.loading && listStatus.pageNo > 1"
          class="color-#959a9f text-12px text-center"
        >
          {{ $t('loading') }}
        </div>
      </div>
    </el-scrollbar>
    <FavDialog
      v-model:visible="editVisible"
      :loading="loading"
      :get-data="_getUserFavoriteGroups"
      :list="userFavoriteGroups2"
    />
  </div>
</template>

<style scoped>
:deep(.sortable-ghost) {
  opacity: 0.4;
}

:deep(.sortable-drag) {
  cursor: move;
}
</style>
