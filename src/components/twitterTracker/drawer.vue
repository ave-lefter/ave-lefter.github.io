<template>
  <el-drawer
    v-model="visible"
    class="[--el-dialog-bg-color:--dialog-bg]"
    :title="t('twitterTracker')"
    :size="440"
  >
    <div class="px-20px">
      <div class="flex gap-16px mb-20px">
        <span
          v-for="el in tabs"
          :key="el.value"
          :class="[
            'text-16px cursor-pointer',
            activeTab === el.value ? 'color-[--main-text]' : 'color-[--secondary-text]',
          ]"
          @click="setActiveTab(el.value)"
        >
          {{ el.label }}
        </span>
      </div>
      <el-input
        v-model="query.keyword"
        class="[&&]:[--el-input-height:36px] [&&]:[--el-input-bg-color:--border] mb-20px"
        :placeholder="t('searchAccount')"
        clearable
        @input="debouncedConfirmInput"
      >
        <template #prefix>
          <Icon class="text-16px" name="custom:search" />
        </template>
      </el-input>
      <el-table
        v-infinite-scroll="getList"
        :data="list"
        header-cell-class-name="text-12px"
        style="width: 100%"
        :infinite-scroll-disabled="finished || loading"
        :infinite-scroll-distance="20"
        :infinite-scroll-delay="200"
      >
        <template #empty>
          <AveEmpty class="pt-40px">
            <span class="text-[--third-text] text-12px">{{ t('emptyNoData') }}</span>
          </AveEmpty>
        </template>
        <el-table-column type="index" label="#" />
        <el-table-column :label="t('account')" width="240">
          <template #default="{ row }">
            <div class="flex items-center gap-12px cursor-pointer" @click="clickAvatar(row)">
              <UserAvatar
                :wallet_logo="{
                  logo: row.profile_pic,
                  name: row.name,
                }"
                icon-size="32px"
              />
              <div>
                <div class="flex items-center gap-8px">
                  <span class="color-[--main-text] text-14px lh-20px">{{ row.name }}</span>
                  <div
                    v-if="row.tags.includes('Founder')"
                    class="w-14px h-14px bg-#000 rounded-full"
                  >
                    <img
                      class="w-full h-full rounded-full block"
                      :src="`${configStore.token_logo_url}chain/${row.chain}.png`"
                      alt=""
                    >
                  </div>
                </div>
                <div class="text-12px color-[--secondary-text] lh-14px">@{{ row.username }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="70" align="right" :label="t('tags')">
          <template #header>
            <div class="flex justify-end items-center gap-4px text-12px">
              <span>{{ $t('tags') }}</span>
              <el-popover
                v-model:visible="kolTagsVisible"
                placement="bottom"
                :width="164"
                trigger="click"
                popper-class="el-drawer-popover"
              >
                <template #reference>
                  <Icon
                    name="custom:filter"
                    :class="`${tempTags.length > 0 ? 'color-[--secondary-text]' : 'color-[--third-text]'} cursor-pointer text-10px shrink-0`"
                  />
                </template>
                <template #default>
                  <el-checkbox
                    v-model="checkAll"
                    class="width_100 [--el-checkbox-height:16px] mb-12px"
                    :indeterminate="isIndeterminate"
                    @change="handleCheckAllChange"
                  >
                    {{ $t('all') }}
                  </el-checkbox>
                  <el-checkbox-group v-model="tempTags" @change="handleCheckedChange">
                    <el-checkbox
                      v-for="(item, $index) in kolTags"
                      :key="$index"
                      class="w-full [--el-checkbox-height:16px] mb-12px"
                      :label="item.name"
                      :value="item.tag"
                    >
                      {{ item.name }}
                    </el-checkbox>
                  </el-checkbox-group>
                  <div class="flex items-center">
                    <el-button class="min-w-0 flex-1" @click="kolTagsVisible = false">
                      {{ t('cancel') }}
                    </el-button>
                    <el-button class="min-w-0 flex-1" type="primary" @click="confirmTags">
                      {{ t('confirm') }}
                    </el-button>
                  </div>
                </template>
              </el-popover>
            </div>
          </template>
          <template #default="{ row }">
            <span class="text-[--main-text]">{{ getTagsText(row.tags) }}</span>
          </template>
        </el-table-column>
        <el-table-column width="40" align="right" label="">
          <template #default="{ row, $index }">
            <Icon
              v-if="row.follow_status === 1 || activeTab === 2"
              class="cursor-pointer"
              name="custom:twitter-del"
              @click="_unfollowKol(row.author_id, $index)"
            />
            <Icon
              v-else
              class="cursor-pointer"
              name="custom:twitter-add"
              @click="_followKol(row.author_id, $index)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-drawer>
</template>
<script setup name="twitterTrackerDrawer">
import { useDebounceFn } from '@vueuse/core'
import {
  followKol,
  getFollowKolList,
  getHotKolList,
  getKolFilters,
  unfollowAll,
} from '~/api/twitter'

const { t } = useI18n()
const visible = defineModel('visible', {
  type: Boolean,
})
const localeStore = useLocaleStore()
const kolTags = ref([])
const kolTagsMap = ref({})
const kolTagsVisible = ref(false)
const checkAll = ref(false)
const isIndeterminate = ref(false)
const configStore = useConfigStore()
const tempTags = ref([])
const query = ref({
  keyword: '',
  cursor: '',
  tags: '',
})
const loading = ref(false)
const finished = ref(false)
const list = ref([])
const activeTab = ref(1)
const tabs = computed(() => [
  { label: t('hotSub'), value: 1 },
  { label: t('mine'), value: 2 },
])
function handleCheckAllChange(val) {
  tempTags.value = val ? kolTags.value.map((i) => i.tag) : []
  isIndeterminate.value = false
}

function handleCheckedChange(val) {
  const checkedCount = val.length
  checkAll.value = checkedCount === kolTags.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < kolTags.value.length
}
const setActiveTab = (value) => {
  activeTab.value = value
  reset()
  query.value.tags = ''
  tempTags.value = []
  getList()
}
const reset = () => {
  query.value.page_token = ''
  loading.value = false
  finished.value = false
  list.value = []
}
const confirmTags = () => {
  kolTagsVisible.value = false
  query.value.tags = tempTags.value.toString()
  reset()
  getList()
}

const confirmKeywords = () => {
  reset()
  getList()
}

const debouncedConfirmInput = useDebounceFn(confirmKeywords, 300)

const getList = async () => {
  loading.value = true
  try {
    let res = null
    if (activeTab.value === 1) {
      res = await getHotKolList(query.value)
    } else {
      res = await getFollowKolList(query.value)
    }
    if (res) {
      query.value.page_token = res.page_token || ''
      const newList = res.authors || []
      finished.value = res.page_token ? false : true
      if (query.value.page_token || finished.value) {
        list.value = [...list.value, ...newList]
      } else {
        list.value = newList
      }
    }
  } catch (error) {
    console.error('Error fetching Twitter tracker list:', error)
  } finally {
    loading.value = false
  }
}

getList()

const _followKol = async (author_id, index) => {
  try {
    await followKol(author_id)
    ElMessage.success(t('followed'))
    list.value[index].follow_status = 1
  } catch (error) {
    ElMessage.error(t('failed'))
    console.error('Error following KOL:', error)
  }
}

const _unfollowKol = async (author_id, index) => {
  try {
    await unfollowAll(author_id)
    ElMessage.success(t('cancelFollowed'))
    list.value[index].follow_status = 0
  } catch (error) {
    ElMessage.error(t('failed'))
    console.error('Error unfollowing KOL:', error)
  }
}

const _getKolFilters = async () => {
  try {
    const res = await getKolFilters()
    kolTags.value = res?.tag_configs || []
    kolTagsMap.value = (res?.tag_configs || []).reduce((pre, cur) => {
      pre[cur.tag] = cur.name
      return pre
    }, {})
  } catch (error) {
    console.error('Error fetching KOL filters:', error)
  }
}

watch(() => localeStore.locale, _getKolFilters)
_getKolFilters()

const getTagsText = (tags = []) => {
  return tags.map((el) => kolTagsMap.value[el]).join(',')
}

const clickAvatar = (row) => {
  window.open(row.twitter_url, '_blank')
}
</script>
<style scoped lang="scss">
:deep(.el-table.el-table) {
  --el-table-header-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-bg-color: transparent;
}
</style>
