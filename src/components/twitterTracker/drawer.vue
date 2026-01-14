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
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="#" width="36" />
        <el-table-column :label="t('account')" width="240">
          <template #default="{ row }">
            <div class="flex items-center gap-12px">
              <UserAvatar icon-size="32px" />
              <div>
                <div class="flex items-center gap-8px">
                  <span class="color-[--main-text] text-14px lh-20px">SOLLAN</span>
                  <div class="w-14px h-14px bg-#000 rounded-full">
                    <img
                      class="w-full h-full rounded-full block"
                      :src="`${configStore.token_logo_url}chain/bsc.png`"
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
        <el-table-column width="60" align="right" label="">
          <template #default="{ row }">
            <Icon class="cursor-pointer" name="custom:twitter-del" />
            <!-- <Icon class="cursor-pointer" name="custom:twitter-add" /> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-drawer>
</template>
<script setup name="twitterTrackerDrawer">
const { t } = useI18n()
const visible = defineModel('visible', {
  type: Boolean,
})
const configStore = useConfigStore()
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
const query = ref({
  keyword: '',
})
const activeTab = ref(1)
const tabs = computed(() => [
  { label: t('hotSub'), value: 1 },
  { label: t('mine'), value: 2 },
])
const setActiveTab = (value) => {
  activeTab.value = value
}
</script>
<style scoped lang="scss">
:deep(.el-table.el-table) {
  --el-table-header-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-bg-color: transparent;
}
</style>
