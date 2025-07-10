<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import { VueDraggableNext } from 'vue-draggable-next'
import { formatNumber2 } from '~/utils/formatNumber'
import { getChainDefaultIcon } from '~/utils'
import ArcProgress from '~/components/arcProgress.vue'
import { getNewFavoriteList, getUserFavoriteGroups, removeFavorite, removeFavoriteGroup, addFavoriteGroup, changeFavoriteGroupName, moveFavoriteGroup, editTokenFavRemark } from '~/api/fav'

const botStore = useBotStore()
const walletStore = useWalletStore()
const configStore = useConfigStore()
const router = useRouter()
const { t } = useI18n()
const activeTab = ref(0)
const tabsGroup = ref<any[]>([])
const allTabsGroup = computed(() => {
  return [
    { label: t('defaultGroup'), value: 0 },
    ...tabsGroup.value
  ]
})
const moveList = ref<any[]>([])
const moveValue = ref('')

const addGroupInputRef = ref()
const addGroupPopoverRef = ref()
const editGroupPopoverRef = ref()
const moveGroupPopoverRef = ref()
const groupValue = ref('')
const editId = ref<number | undefined>(undefined)

const remarkValue = ref('')
const visibleShow = ref(false)
const coords = ref({ x: 0, y: 0 })
const virtualRef = ref({
  getBoundingClientRect: () => ({
    width: 0,
    height: 0,
    top: coords.value.y,
    left: coords.value.x,
    bottom: coords.value.y,
    right: coords.value.x,
  }),
  get clientWidth() {
    return 0
  },
  get clientHeight() {
    return 0
  },
})
const rowData = ref<any>({})

const loading = ref(false)
const pageData = ref({
  total: 10,
  page: 1,
  pageSize: 50
})
const tableList = ref<any[]>([])
const { mode } = storeToRefs(useGlobalStore())

const addressValue = computed(() => {
  return botStore.evmAddress || walletStore.address
})

watch(() => walletStore.walletSignature[walletStore.address], (newValue) => {
  if (newValue) {
    getList()
    getGroupList()
  }
})

watch(() => botStore.evmAddress, (newVal) => {
  if (newVal) {
    getList()
    getGroupList()
  } else {
    tableList.value = []
    tabsGroup.value = []
  }
})

watch(() => walletStore.address, (newVal) => {
  if (newVal) {
    getList()
    getGroupList()
  } else {
    tableList.value = []
    tabsGroup.value = []
  }
})

const appendix = (row: any) => {
  if (row.value?.appendix && isJSON(row.value?.appendix)) {
    return JSON.parse(row.value?.appendix)
  }
  return {}
}

// 选择分组
const setActiveTab = (val: number) => {
  activeTab.value = val
  pageData.value.page = 1
  getList()
}

// 删除分组
const handleDeleteGroup = async (groupId: number) => {
  await ElMessageBox.confirm(t('removeFavGroupTips'), t('tips'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    dangerouslyUseHTMLString: true,
    customClass: '',
  })
  await removeFavoriteGroup(groupId, addressValue.value)
  ElMessage.success(t('success'))
  getGroupList()
  if (activeTab.value === groupId) {
    setActiveTab(0)
  }
}

// 添加分组
const handleAddGroup = async () => {
  if (!groupValue.value.trim()) return ElMessage.error(t('enterGroupName'))
  if (groupValue.value.length > 20) return ElMessage.error(t('maximum10characters'))
  if (tabsGroup.value.some(item => item.label === groupValue.value)) return ElMessage.error(t('groupExistT'))
  await addFavoriteGroup(groupValue.value, addressValue.value)
  ElMessage.success(t('success'))
  addGroupPopoverRef.value?.hide()
  getGroupList()
}

// 重命名分组
const handleUpdateGroup = (item: any) => {
  editId.value = item.value
  groupValue.value = item.label
}

const editHide = () => {
  editId.value = undefined
  groupValue.value = ''
}

// 确认编辑
const handleUpdateGroupConfirm = async (item: any, index: number) => {
  if (!groupValue.value.trim()) return ElMessage.error(t('enterGroupName'))
  if (groupValue.value.length > 20) return ElMessage.error(t('maximum10characters'))
  await changeFavoriteGroupName(groupValue.value, item.value, addressValue.value)
  ElMessage.success(t('success'))
  editGroupPopoverRef.value[index]?.hide()
  getGroupList()
}

// 处理移动分组
const handleMoveGroup = () => {
  moveList.value = cloneDeep(tabsGroup.value)
}

// 移动分组确认
const handleMoveGroupConfirm = () => {
  console.log(moveList.value)
  moveGroupPopoverRef.value?.hide()
  tabsGroup.value = cloneDeep(moveList.value)
  ElMessage.success(t('success'))
}

const handleRemarkShow = (row: any, event: any) => {
  const rect = event.currentTarget.getBoundingClientRect()
  coords.value = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  }
  visibleShow.value = true
  rowData.value = row
  remarkValue.value = row.remark || ''
}
// 备注
const handleRemarkGroup = async (row: any) => {
  // if (!remarkValue.value.trim()) return ElMessage.error(t('enterRemark'))
  if (remarkValue.value.length > 50) return ElMessage.error(t('remarkError'))
  const tokenId = row.token + '-' + row.chain
  await editTokenFavRemark(tokenId, remarkValue.value, addressValue.value)
  ElMessage.success(t('success'))
  visibleShow.value = false
  getList()
}

const tableRowClick = (row: any) => {
  const containsSpecialString = row?.token
    ? ['inscription', ':', '('].some(str => row.token.includes(str))
    : false

  if (
    row.chain === 'brc20' ||
    row.chain === 'runes' ||
    containsSpecialString
  ) {
    router.push(`/brc/${row.token}-${row.chain}?from=/follow/token`)
  } else {
    router.push(`/token/${row.token}-${row.chain}?from=/follow/token`)
  }
}

// 处理表格排序
const handleSortChange = ({ prop, order }: any) => {
  if (prop) {
    if (order === 'ascending') {
      tableList.value = tableList.value.toSorted((a, b) => a[prop] - b[prop])
    } else if (order === 'descending') {
      tableList.value = tableList.value.toSorted((a, b) => b[prop] - a[prop])
    }
  }
}

// 取消收藏
const collect = (row: any) => {
  loading.value = true
  removeFavorite(`${row.token}-${row.chain}`, addressValue.value)
    .then(() => {
      getList()
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      loading.value = false
    })
}

const getRowGroupChange = async (val: number, row: any) => {
  const tokenId = row.token + '-' + row.chain
  await moveFavoriteGroup(tokenId, val, addressValue.value)
  getList()
}

// 获取列表
const getList = async () => {
  const res = await getNewFavoriteList({
    address: addressValue.value,
    group: activeTab.value,
    pageNO: pageData.value.page,
    pageSize: pageData.value.pageSize
  })
  const tableData =
    (res &&
      res?.map(i => ({
        id: `${i.token}-${i.chain}`,
        ...i,
        price_change_24h:
          i?.chain == 'brc20' ? i.price_change_v2 || 0 : i.price_change || 0,
        pool_circulating_supply: (i.total - i.lock_amount - i.burn_amount - i.other_amount) * i.current_price_usd,
        group_id: activeTab.value,
      }))) ||
    []
  tableList.value = tableData
}

// 获取分组列表
const getGroupList = async () => {
  const res = await getUserFavoriteGroups(addressValue.value)
  tabsGroup.value = (res || []).filter(el => !!el.name).map((item) => ({
    ...item,
    label: item.name,
    value: item.group_id
  }))
}

onMounted(() => {
  if (!botStore.evmAddress && !walletStore.address) return
  getList()
  getGroupList()
})
</script>

<template>
  <div>
    <div v-if="botStore.evmAddress || walletStore.address"
      class="flex items-center px-12px mt-12px gap-8px overflow-x-auto scrollbar-hide">
      <div v-for="(item, index) in allTabsGroup" :key="item.value"
        class="cursor-pointer text-12px color-[--d-999-l-666] bg-[--d-15171c-l-f2f2f2] px-12px py-4px rounded-4px shrink-0 flex items-center"
        :class="[activeTab === item.value && 'bg-[--d-333-l-0A0B0C] color-[#F5F5F5]']"
        @click="setActiveTab(item.value)">
        {{ item.label }}
        <el-popover trigger="click" @hide="editHide" ref="editGroupPopoverRef" :width="editId ? 250 : 100"
          popper-style="min-width: 86px;">
          <template #reference>
            <Icon @click.stop v-if="item.value > 0" name="custom:set-up" class="text-12px ml-2px" />
          </template>
          <div>
            <div v-if="!editId">
              <div class="flex items-center cursor-pointer w-100px" @click.stop="handleUpdateGroup(item)">
                <Icon name="fe:edit" class="color-#666 text-14px" />
                <view class="ml-4px text-14px">{{ t('rename') }}</view>
              </div>
              <div class="flex items-center cursor-pointer w-100px mt-12px" @click.stop="handleDeleteGroup(item.value)">
                <Icon name="bx:bxs-trash-alt" class="text-15px color-#666" />
                <view class="ml-4px text-14px">{{ t('delete') }}</view>
              </div>
            </div>
            <div v-else>
              <div>{{ t('rename') }}</div>
              <el-input v-model="groupValue" :placeholder="t('enterGroupName')" class="mt-8px w-200px" />
              <div class="flex items-center justify-between mt-12px gap-12px">
                <div @click="editGroupPopoverRef[index]?.hide()"
                  class="flex-1 text-center cursor-pointer text-14px color-[#F5F5F5] bg-[--d-333-l-0A0B0C] px-12px py-8px rounded-4px">
                  {{ t('cancel') }}
                </div>
                <div @click="handleUpdateGroupConfirm(item, index)"
                  class="flex-1 text-center cursor-pointer text-14px color-[#F5F5F5] bg-[#3F80F7] px-12px py-8px rounded-4px">
                  {{ t('confirm') }}
                </div>
              </div>
            </div>
          </div>
        </el-popover>
      </div>

      <el-popover trigger="click" @show="addGroupInputRef.focus()" @hide="groupValue = ''" ref="addGroupPopoverRef"
        :width="250">
        <template #reference>
          <!-- 新增 -->
          <div style="background: rgba(63, 128, 247, 0.10);" @click="editId = undefined"
            class="cursor-pointer text-12px color-[#3F80F7] px-12px py-4px rounded-4px shrink-0 flex items-center">
            <Icon name="custom:add-icon" class="text-12px mr-2px" />
            {{ t('newGroup') }}
          </div>
        </template>
        <div>
          <div>{{ t('newGroup') }}</div>
          <el-input ref="addGroupInputRef" v-model="groupValue" :placeholder="t('enterGroupName')"
            class="mt-8px w-200px" />
          <div class="flex items-center justify-between mt-12px gap-12px">
            <div @click="addGroupPopoverRef?.hide()"
              class="flex-1 text-center cursor-pointer text-14px color-[#F5F5F5] bg-[--d-333-l-0A0B0C] px-12px py-8px rounded-4px">
              {{ t('cancel') }}
            </div>
            <div @click="handleAddGroup()"
              class="flex-1 text-center cursor-pointer text-14px color-[#F5F5F5] bg-[#3F80F7] px-12px py-8px rounded-4px">
              {{ t('confirm') }}
            </div>
          </div>
        </div>
      </el-popover>
      <el-popover trigger="click" @hide="moveValue = ''" ref="moveGroupPopoverRef" :width="250">
        <template #reference>
          <div style="background: rgba(63, 128, 247, 0.10);" @click="handleMoveGroup"
            class="cursor-pointer text-12px color-[#3F80F7] px-12px py-4px rounded-4px shrink-0 flex items-center">
            <Icon name="custom:list-icon" class="text-12px mr-2px" />
            {{ t('groupManage') }}
          </div>
        </template>
        <div>
          <div>{{ t('groupManage') }}</div>
          <el-input v-model="moveValue" class="mt-8px" :placeholder="t('enterGroupName')" />
          <VueDraggableNext v-model="moveList" :sort="true" ghost-class="ghost" :animation="300">
            <div class="py-12px px-8px flex justify-between items-center hover:bg-[--d-2A2A2A-l-F2F2F2] cursor-move"
              v-for="item in moveList.filter(item => item.label.includes(moveValue))" :key="item.value">
              {{ item.label }}
              <Icon name="custom:move-icon" class="text-16px" />
            </div>
          </VueDraggableNext>
          <div class="flex items-center justify-between mt-12px gap-12px">
            <div @click="moveGroupPopoverRef?.hide()"
              class="flex-1 text-center cursor-pointer text-14px color-[#F5F5F5] bg-[--d-333-l-0A0B0C] px-12px py-8px rounded-4px">
              {{ t('cancel') }}
            </div>
            <div @click="handleMoveGroupConfirm"
              class="flex-1 text-center cursor-pointer text-14px color-[#F5F5F5] bg-[#3F80F7] px-12px py-8px rounded-4px">
              {{ t('confirm') }}
            </div>
          </div>
        </div>
      </el-popover>
    </div>

    <el-table class='mt-12px' v-loading="loading" height="calc(100vh - 250px)" :data="tableList" fit
      @sort-change="handleSortChange" @row-click="tableRowClick">
      <template #empty>
        <div v-if="!loading" class="flex flex-col items-center justify-center py-30px">
          <img v-if="mode === 'light'" src="@/assets/images/empty-white.svg">
          <img v-if="mode === 'dark'" src="@/assets/images/empty-black.svg">
          <span>{{ t('emptyNoData') }}</span>
        </div>
        <span v-else />
      </template>

      <el-table-column :label="t('poolPair')" min-width="160" show-overflow-tooltip>
        <template #default="{ row, $index }">
          <NuxtLink :to="`/token/${row.token}-${row.chain}`" @click.stop.prevent>
            <div class="flex items-center">
              <span class="text-[#848E9C] text-12px mr-5px">
                #{{ (pageData.page - 1) * pageData.pageSize + $index + 1 }}
              </span>
              <Icon v-if="addressValue" name="material-symbols:kid-star"
                class="color-var(--d-999-l-666) h-16px w-16px clickable shrink-0 color-#ffbb19"
                @click.stop.prevent="collect(row)" />
              <div class="relative ml-3px">
                <el-image class="w-32px h-32px rounded-full" :src="getSymbolDefaultIcon({
                  chain: row?.chain,
                  symbol: row.symbol,
                  logo_url: row.logo_url
                })" lazy>
                  <template #error>
                    <img class="w-32px h-32px rounded-full" :src="getChainDefaultIcon(row?.chain, row.symbol)" />
                  </template>
                  <template #placeholder>
                    <img class="w-32px h-32px rounded-full" :src="getChainDefaultIcon(row?.chain, row.symbol)" />
                  </template>
                </el-image>
                <img v-if="row?.chain" class="w-12px h-12px absolute bottom-3px right-3px"
                  :src="`${configStore.token_logo_url}chain/${row?.chain}.png`" alt=""
                  onerror="this.src='/icon-default.png'" srcset="" />
              </div>
              <div class="ml-5px">
                <div class="flex items-center">
                  <span class="text-13px mr-3px">{{ row.symbol }}</span>
                  <span class="text-[--d-666-l-999]">({{ '*' + row.token?.slice(-4) }})</span>
                  <span
                    class="text-[#3f80f7] border-[0.5px] border-solid border-[#3f80f7] rounded-4px bg-transparent text-10px ml-2px px-4px max-w-[60px] truncate"
                    :title="row.remark" v-if="row.remark">{{ row.remark }}</span>
                  <!-- 备注 -->
                  <div ref="buttonRef" @click.stop.prevent='handleRemarkShow(row, $event)'>
                    <Icon class="text-[--d-666-l-999] w-12px h-12px ml-4px" name="custom:remark" />
                  </div>

                  <a class="ml-4px"
                    :href="`https://x.com/search?q=(${row?.symbol}OR${row?.token})&src=typed_query&f=live`"
                    target="_blank" @click.stop>
                    <Icon class="text-[--d-666-l-999] h-12px w-12px" name="custom:search"/>
                  </a>
                </div>
                <div class="flex items-center mt-2px">
                  <div class="text-8px text-[--d-666-l-999]">
                    {{ row?.token?.replace(new RegExp('(.{4})(.+)(.{4}$)'), '$1...$3') }}
                  </div>
                  <Icon @click.stop.prevent v-copy="row?.token" name="bxs:copy"
                    class="ml-5px clickable text-[--d-666-l-999]" />
                  <a class="flex items-center" v-tooltip="appendix(row)?.twitter" :href="appendix(row)?.twitter"
                    target="_blank" @click.stop>
                    <Icon :name="`custom:twitter`" class="text-[--d-666-l-999] h-14px w-14px" />
                  </a>
                  <a class="flex items-center" v-tooltip="appendix(row)?.telegram" :href="appendix(row)?.telegram"
                    target="_blank" @click.stop>
                    <Icon :name="`custom:tg`" class="text-[--d-666-l-999] h-14px w-14px" />
                  </a>
                </div>
              </div>
            </div>
          </NuxtLink>
        </template>
      </el-table-column>
      <el-table-column :label="t('holders')" sortable="custom" :sort-orders="['descending', 'ascending', null]"
        prop="holders" align="right">
        <template #default="{ row }">
          <span>
            {{ row.holders }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="t('price')" sortable="custom" :sort-orders="['descending', 'ascending', null]"
        prop="current_price_usd" align="right">
        <template #default="{ row }">
          <span v-html="'$' + formatNumber2(row.current_price_usd)"></span>
        </template>
      </el-table-column>
      <el-table-column label="24h%" sortable="custom" :sort-orders="['descending', 'ascending', null]"
        prop="price_change_24h" align="right">
        <template #default="{ row }">
          <span v-if="Number(row.price_change_24h || 0) > 0" class="text-[#12b886]">
            +{{ formatNumber2(row.price_change_24h || 0, 2) }}%
          </span>
          <span v-else-if="Number(row.price_change_24h || 0) == 0" class="text-[#848E9C]">
            0%
          </span>
          <span v-else class="text-[#ff646d]">{{ formatNumber2(row.price_change_24h || 0, 2) }}%</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('riskScore')" sortable="custom" :sort-orders="['descending', 'ascending', null]"
        prop="risk_score" align="right">
        <template #default="{ row }">
          <router-link :to="{ path: `/check/${row.token}-${row.chain}` }" @click.stop>
            <ArcProgress :progress="Number(row.risk_score / 100) || 0" :width="40" :thickness="2" :big="false"
              :height="20" :textHeight="15" :end="true" fontSize="12px"
              :colorList="['#eaecef', '#108D68', '#C26B03', '#BB3749']" class="arc-progress"></ArcProgress>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column :label="t('24Volume')" sortable="custom" :sort-orders="['descending', 'ascending', null]"
        prop="tx_volume_u_24h" align="right">
        <template #default="{ row }">
          ${{ formatNumber2(row?.tx_volume_u_24h || 0, 2, 4, 10 ** 4) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('24TxAddress')" sortable="custom" :sort-orders="['descending', 'ascending', null]"
        prop="tx_count_24h" align="right">
        <template #default="{ row }">
          {{ formatNumber2(row?.tx_count_24h || 0, 2, 4, 10 ** 4) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('tokenGroup')" align="right">
        <template #default="{ row }">
          <el-select v-model="row.group_id" @click.stop @change="(val) => getRowGroupChange(val, row)">
            <el-option v-for="item in allTabsGroup" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="mt-15px" v-model:current-page="pageData.page" v-model:page-size="pageData.pageSize"
      layout="prev, pager, next, ->" :total="pageData.total" :page-sizes="[10, 20, 30, 40, 50, 60]" />

    <el-popover :visible="visibleShow" :virtual-ref="virtualRef" virtual-triggering trigger="click" :width="250">
      <div>
        <div>{{ t('editRemark') }}</div>
        <el-input v-model="remarkValue" maxlength="50" show-word-limit :placeholder="t('enterRemark')"
          class="mt-8px w-200px" />
        <div class="flex items-center justify-between mt-12px gap-12px">
          <div @click="visibleShow = false"
            class="flex-1 text-center cursor-pointer text-14px color-[#F5F5F5] bg-[--d-333-l-0A0B0C] px-12px py-8px rounded-4px">
            {{ t('cancel') }}
          </div>
          <div @click="handleRemarkGroup(rowData)"
            class="flex-1 text-center cursor-pointer text-14px color-[#F5F5F5] bg-[#3F80F7] px-12px py-8px rounded-4px">
            {{ t('confirm') }}
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-pagination) {
  justify-content: center;

  button {
    border: 1px solid var(--d-333-l-00008);
    border-radius: 50%;
  }

  ul {
    margin: 0 16px;
  }
}

:deep(.el-pager li.is-active) {
  background: #3F80F7;
  color: #fff;
}

:deep(.el-pager li) {
  border-radius: 6px;
}

:deep(.el-table .caret-wrapper) {
  width: 16px;
}
</style>
