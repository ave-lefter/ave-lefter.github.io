<template>
  <div v-if="(result?.total<=0) && (walletStore.walletName === 'WatchWallet')"/>
  <div v-else>
    <span
      class="flex items-center text-14px cursor-pointer color-[--main-text]"
      @click="showBlackList"
    >
      <Icon name="custom:black2" class="mr-4px" />
      {{ t('BlackList') }}
    </span>
    <el-dialog
      v-model="visible"
      :title="t('blackManage')"
      width="540px"
      append-to-body
      destroy-on-close
      @close="closeDialog"

    >
      <div class="flex flex-col gap-10px pt-0">
        <el-input
          v-model="query.q"
          class="!text-12px"
          :placeholder="t('searchContractORName')"

          @clear="getBlackList"
          @keyup.enter="getBlackList"
        >
          <template #prefix>
            <Icon class="text-16px text-[--secondary-text]" name="ep:search" />
          </template>
        </el-input>

        <div class="relative">
          <el-table v-loading="result.loading" :data="result.list"  row-class-name="!bg-[var(--el-bg-color)]" style="height: 283px;">
            <template #empty>
              <div v-if="!result.loading" class="text-12px flex flex-col items-center justify-center h-250px">
                <img v-if="mode === 'light'" src="@/assets/images/empty-white.svg">
                <img v-if="mode === 'dark'" src="@/assets/images/empty-black.svg">
                <span>{{ t('emptyNoData') }}</span>
              </div>
              <div v-else class="text-12px"/>
            </template>
            <el-table-column :label="t('name')">
              <template #default="{ row }">
                <div class="flex items-center" @click="jumpToTokenDetail(row)">
                  <TokenImg
                    :row="{
                      logo_url: `${row?.logo_url?(s3BaseUrl+row?.logo_url):''}`,
                      symbol: row.symbol,
                      chain: row.chain,
                    }"
                    token-class="w-28px h-28px"
                  />
                  <div class="ml-6px">{{ row.symbol }}</div>
                </div>
              </template>
            </el-table-column>

            <el-table-column :min-width="210" :label="t('address')">
              <template #default="{ row }">
                <div v-copy="row.token" class="text-12px ellipsis-auto">
                  {{ row.token }}
                </div>
              </template>
            </el-table-column>

            <el-table-column min-width="70" :label="t('operation')">
              <template #default="{ row }">
                <div class="">
                  <el-button
                    class="recover-btn"
                    size="small"
                    :loading="row.loading"
                    @click="addWhiteList(row)"
                  >
                    {{ t('Recover') }}
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-pagination
          v-if="result.total"
          v-model:current-page="query.pageNo"
          v-model:page-size="query.pageSize"
          class="mx-auto border-t-none!"
          layout="total, prev, pager, next"
          :total="result.total"
          hide-on-single-page
          background
          :page-sizes="[20, 50, 100, 200, 300, 400]"
          @size-change="getBlackList"
          @current-change="getBlackList"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useThrottleFn } from '@vueuse/core'
import { getTokenFilterList, setUserTokenStatus } from '@/api/wallet'

const { t } = useI18n()

const {updateHolderNum}= storeToRefs(useUserStore())
const router = useRouter()
const route = useRoute()
const walletStore = useWalletStore()
const {mode} = useGlobalStore()
const configStore = useConfigStore()
const s3BaseUrl = configStore.token_logo_url

// Props
const props = defineProps({
  chain: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
})

// Emits
const emit = defineEmits(['addWhite'])

// Refs
const visible = ref(false)
const query = ref({
  q: '',
  type: 'blacklist',
  pageNo: 1,
  pageSize: 5,
})

const result = ref({
  loading: false,
  list: [],
  total: 0,
})

// Methods
const showBlackList = () => {
  visible.value = true
  getBlackList()
}

onMounted(() => {
  if(walletStore.walletName==='WatchWallet'){
    getBlackList()
  }
})
const getBlackList = useThrottleFn(async () => {
  try {
    result.value.loading = true
    const res = await getTokenFilterList({
      ...query.value,
      chain: props.chain,
      address: props.address,
    })
    result.value.list = res?.data || []
    result.value.total = res?.total || 0
  } catch (error) {
    console.error('Error fetching blacklist:', error)
    result.value.list = []
  } finally {
    result.value.loading = false
  }
}, 500)

const closeDialog = () => {
  result.value.list = []
  query.value = {
    q: '',
    type: 'blacklist',
    pageNo: 1,
    pageSize: 5,
  }
}

const jumpToTokenDetail = ({ token, chain }) => {
  router.push({
    name: 'token-id',
    params: { id: `${token}-${chain}` },
    query: { from: route.name },
  })
}

const addWhiteList = async ({ token, chain }) => {
  try {
    updateRowLoading(token, true)
    await setUserTokenStatus(
      {
        token,
        type: 'whitelist',
      },
      props.address,
      chain
    )
    await getBlackList()
    emit('addWhite')
    updateHolderNum.value++
    ElMessage.success(t('success'))
  } catch (error) {
    console.error('Error adding to whitelist:', error)
    ElMessage.error(t('error'))
  } finally {
    updateRowLoading(token, false)
  }
}

const updateRowLoading = (token, isLoading) => {
  const index = result.value.list.findIndex((el) => el.token === token)
  if (index > -1) {
    result.value.list[index].loading = isLoading
  }
}
</script>

<style scoped>

</style>
