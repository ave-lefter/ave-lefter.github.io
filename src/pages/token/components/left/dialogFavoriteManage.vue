<script setup lang="ts">
import {
  changeFavoritesTop,
  type GetFavListResponse,
  getFavoriteList,
  type GetUserFavoriteGroupsResponse,
  moveFavoriteGroup,
  changeFavoritesIndex, editTokenFavRemark
} from '~/api/fav'
import TokenImg from '~/components/tokenImg.vue'
import {useEventBus} from '@vueuse/core'
import {BusEventType} from '~/utils/constants'

const props = defineProps({
  list: {
    type: Array<GetUserFavoriteGroupsResponse>,
    default: () => []
  },
  visible: Boolean
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

onMounted(() => {
  _getFavoriteList()
})

function setActiveTab(val: number) {
  activeTab.value = val
  resetAndGet()
}

watch(() => [walletAddress.value, props.visible], () => {
  resetAndGet()
})

async function _getFavoriteList() {
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
</script>

<template>
  <div>
    <div class="flex items-center whitespace-nowrap overflow-x-auto scrollbar-hide mb-12px">
      <a
        v-for="(item,index) in list"
        :key="index" href="javascript:;"
        :class="`decoration-none shrink-0 text-12px lh-16px text-center color-[--d-999-l-666] px-12px py-4px rounded-4px
         ${activeTab===item.group_id ? 'bg-[--d-333-l-F2F2F2] color-[--d-F5F5F5-l-333]':''}`"
        @click="setActiveTab(item.group_id)"
      >
        {{ item.name }}
      </a>
    </div>
    <el-table
      id="table_fav"
      ref="table_ref"
      v-loading="listStatus.loading"
      v-infinite-scroll="_getFavoriteList"
      :infinite-scroll-disabled="listStatus.loading || listStatus.finished"
      infinite-scroll-distance="200"
      :infinite-scroll-delay="10"
      :infinite-scroll-immediate="false"
      :data="favoritesList"
      height="350px"
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
            <TokenImg
              class="mr-8px"
              :row="row"
            />
            <span class="[&&]:color-[--d-F5F5F5-l-333]">{{ row.symbol }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('changeGroup')" align="center">
        <template #default="{ row }">
          <el-select
            v-model="row.activeGroup"
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
      <el-table-column prop="name" :label="$t('sort')" align="center">
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
      </el-table-column>
      <el-table-column :label="$t('remark')" show-overflow-tooltip align="center">
        <template #default="{ row }">
          <span>{{ row.remark || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('operate')" align="left">
        <template #default="{ row }">
          <span
            class="cursor-pointer color-[var(--d-F5F5F5-l-333)]"
            @click.stop.prevent="handleEditRemark(row)">
            {{ $t('edit') }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div
      v-if="listStatus.pageNo!==1 && listStatus.loading"
      class="flex justify-center items-center py-15px text-12px">
      <span>{{ $t('loading') }}</span>
    </div>
  </div>
</template>

<style scoped>

</style>
