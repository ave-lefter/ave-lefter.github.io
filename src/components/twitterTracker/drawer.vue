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
      >
        <template #prefix>
          <Icon class="text-16px" name="custom:search" />
        </template>
      </el-input>
      <el-table
        v-infinite-scroll="getList"
        :data="list"
        style="width: 100%"
        :infinite-scroll-disabled="finished || loading"
        :infinite-scroll-distance="20"
        :infinite-scroll-delay="200"
      >
        <el-table-column type="index" label="#" />
        <el-table-column :label="t('account')" width="240">
          <template #default="{ row }">
            <div class="flex items-center gap-12px">
              <UserAvatar
                :chain="row.chain"
                :wallet_logo="{
                  logo: row.profile_pic,
                  name: row.name,
                }"
                icon-size="32px"
              />
              <div>
                <div class="flex items-center gap-8px">
                  <span class="color-[--main-text] text-14px lh-20px">{{ row.name }}</span>
                  <div class="w-14px h-14px bg-#000 rounded-full">
                    <img
                      class="w-full h-full rounded-full block"
                      :src="`${configStore.token_logo_url}chain/${row.chain}.png`"
                      alt=""
                    />
                  </div>
                </div>
                <div class="text-12px color-[--secondary-text] lh-14px">@SOLANA</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="60" align="right" :label="t('tags')">
          <template #default="{ row }"> 政治 </template>
        </el-table-column>
        <el-table-column width="40" align="right" label="">
          <template #default="{ row }">
            <Icon
              v-if="row.follow_status === 1"
              class="cursor-pointer"
              name="custom:twitter-del"
              @click="_unfollowKol(row.author_id)"
            />
            <Icon
              v-else
              class="cursor-pointer"
              name="custom:twitter-add"
              @click="_followKol(row.author_id)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-drawer>
</template>
<script setup name="twitterTrackerDrawer">
import { followKol, getFollowList, getHotTwitterList, unfollowAll } from '~/api/twitter'

const { t } = useI18n()
const visible = defineModel('visible', {
  type: Boolean,
})
const configStore = useConfigStore()
const query = ref({
  keyword: '',
  cursor: '',
  tags: [],
})
const loading = ref(false)
const finished = ref(false)
const list = ref([])
const activeTab = ref(1)
const tabs = computed(() => [
  { label: t('hotSub'), value: 1 },
  { label: t('mine'), value: 2 },
])
const setActiveTab = (value) => {
  activeTab.value = value
}
const getList = async () => {
  loading.value = true
  try {
    const params = {
      ...query.value,
      tags: query.value.tags.join(','),
    }
    let res = null
    if (activeTab.value === 1) {
      res = await getHotTwitterList(params)
    } else {
      res = await getFollowList(params)
    }
    if (res) {
      query.value.cursor = res.cursor || ''
      const newList = res.authors || []
      finished.value = res.cursor ? false : true
      if (query.value.cursor || finished.value) {
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

const _followKol = async (author_id) => {
  try {
    await followKol(author_id)
    ElMessage.success(t('followed'))
  } catch (error) {
    ElMessage.error(t('failed'))
    console.error('Error following KOL:', error)
  }
}

const _unfollowKol = async (author_id) => {
  try {
    await unfollowAll(author_id)
    ElMessage.success(t('cancelFollowed'))
  } catch (error) {
    ElMessage.error(t('failed'))
    console.error('Error unfollowing KOL:', error)
  }
}
</script>
<style scoped lang="scss">
:deep(.el-table.el-table) {
  --el-table-header-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-bg-color: transparent;
}
</style>
