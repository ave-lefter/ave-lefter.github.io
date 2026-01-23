<template>
    <div class="flex mt--12px">
        <div v-infinite-scroll="getRugPullList" class="pt-12px flex-1"
            :infinite-scroll-disabled="loadingRun || finished" :infinite-scroll-distance="20"
            :infinite-scroll-delay="200" :infinite-scroll-immediate="false">
            <el-table ref="table_ref" :height="tableHeight" :data="tableList" :default-sort="{
                prop: conditions.sort,
                order: conditions.sort_dir ? conditions.sort_dir + 'ending' : null,
            }" fit header-row-class-name="text-12px"
                row-class-name="cursor-pointer color-[--secondary-text] text-12px" @row-click="onRowClick"
                @sort-change="handleSortChange">
                <template #empty>
                    <AveEmpty v-if="!loadingRun" class="table-empty">
                        <span class="text-12px mt-10px color-[--third-text]">{{ $t('emptyNoData') }}</span>
                    </AveEmpty>
                </template>
                <TokenColumn :column-props="{
                    label: $t('walletToken'),
                    width: '150',
                    fixed: 'left',
                }" />
                <el-table-column align="right" :width="100" sortable="custom"
                    :sort-orders="['descending', 'ascending', null]" :label="$t('time')" prop="created_at">
                    <template #default="{ row }">
                        <span v-tooltip="dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')">{{
                            formatTimeFromNow(dayjs(row.created_at).unix())
                            }}</span>
                    </template>
                </el-table-column>
                <el-table-column :width="80" align="right" :label="$t('migrated1')">
                    <template #default="{ row }">
                        <img v-if="row.migrated" src="@/assets/images/select-box-circle-line.svg" alt="">
                        <img v-else src="@/assets/images/close-circle-line.svg" alt="">
                    </template>
                </el-table-column>
                <el-table-column align="right" sortable="custom" :sort-orders="['descending', 'ascending', null]"
                    :label="$t('walletMarketCap')" prop="market_cap">
                    <template #default="{ row }"> ${{ formatNumber(row.market_cap, 2) }}</template>
                </el-table-column>
                <el-table-column align="right" sortable="custom" :sort-orders="['descending', 'ascending', null]"
                    :label="$t('allTimeHigh')" prop="all_time_high">
                    <template #default="{ row }"> ${{ formatNumber(row.all_time_high, 2) }}</template>
                </el-table-column>
                <el-table-column align="right" :label="$t('holders')">
                    <template #default="{ row }">
                        {{ formatNumber(row.holders || 0, 2) }}
                    </template>
                </el-table-column>
                <el-table-column align="right" :label="$t('volumeOneHour')">
                    <template #default="{ row }">
                        {{ formatNumber(row.volume_u_1h || 0, 2) }}
                    </template>
                </el-table-column>
            </el-table>
            <div class="text-12px text-center color-[--third-text] pb-10px">
            <span v-if="loadingRun && pageNO > 1">{{ $t('loading') }}</span>
            <span v-if="showFinished && pageNO > 1 && tableList?.length > pageSize">{{
              $t('noMore')
            }}</span>
          </div>
        </div>
        <div class="border-l-1px border-l-solid border-l-[--main-divider] p-20px box-border w-298px">
            <div class="text-16px color-[--secondary-text] lh-16px mb-16px">
                {{ t('tokenStatistics') }}
            </div>
            <div class="flex items-center gap-6px color-[--secondary-text] text-12px mb-8px">
                <span class="color-[--third-text] text-12px">{{ t('dev3') }}:</span>
                {{ tokenObj.dev_address ? tokenObj.dev_address.slice(0, 4) + '...' + tokenObj.dev_address.slice(-4) :
                    '--'
                }}({{formatNumber(balance.balance,4)}}{{balance.name}})
                <Icon v-copy="tokenObj.dev_address" name="bxs:copy"
                    class="text-12px ml-2px cursor-pointer color-[--secondary-text]" />
                <Icon name="custom:search" class="text-[--third-text] text-16px cursor-pointer hover:text-[--main-text]"
                    @click="handleSearchDevAddress" />
                <Icon :name="token?.chain === 'solana' ? 'custom:sol' : 'custom:evm'"
                    class="text-[--third-text] text-16px cursor-pointer hover:text-[--main-text]"
                    @click="jumpBrowser" />
            </div>
            <div class="justify-between flex">
                <div>
                    <div class="color-[--secondary-text] text-12px mb-8px mr-6px">
                        <span class="color-[--third-text] text-12px">{{ t('totalTokens') }}:</span>
                        {{ tokenObj.total_tokens ?? 0 }}
                    </div>
                    <div class="flex gap-4px color-[--secondary-text] text-12px mb-8px">
                        <span class="w-12px h-12px rounded-2px bg-[--up-color]" />
                        <span class="color-[--third-text] text-12px">{{ t('migrated') }}:</span>
                        {{ tokenObj.total_migrated ?? 0 }}
                    </div>
                    <div class="flex gap-4px color-[--secondary-text] text-12px">
                        <span class="w-12px h-12px rounded-2px bg-[--down-color]" />
                        <span class="color-[--third-text] text-12px">{{ t('notMigrated') }}:</span>
                        {{ tokenObj.total_non_migrated ?? 0 }}
                    </div>
                </div>
                <el-progress :width="120" color="var(--up-color)" :stroke-width="10" type="circle"
                    :percentage="tokenObj.total_migrated / tokenObj.total_tokens * 100">
                    <template #default="{ percentage }">
                        <div class="font-bold text-24px lh-30px color-[--main-text] mb-4px">{{
                            formatNumber(percentage,1) }}%</div>
                        <div class="color-[--third-text] text-12px">{{ t('migrated') }}</div>
                    </template>
                </el-progress>
               
            </div>
            <div class="text-16px lh-16px color-[--secondary-text] mb-8px">
                    {{ t('highestRecord') }}
                </div>
                <div class="flex gap-4px color-[--secondary-text] text-12px mb-8px">
                    <span class="color-[--third-text] text-12px">{{ t('historyHighestMarketCap') }}:</span>
                    ${{ formatNumber(tokenStore.bestToken?.all_time_high || 0, 2) }}
                </div>
                <div class="flex gap-4px color-[--secondary-text] text-12px mb-8px">
                    <span class="color-[--third-text] text-12px">{{ t('latestToken') }}:</span>
                    <span v-tooltip="dayjs(tokenStore.bestToken?.created_at).format('YYYY-MM-DD HH:mm:ss')">{{ formatTimeFromNow(tokenStore.bestToken?.created_at) }} {{ t('ago') }}</span>
                </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { _getDevList } from '@/api/run'
import dayjs from 'dayjs'
import AveEmpty from '@/components/aveEmpty.vue'
import TokenColumn from '@/components/tokenColumn.vue'
import { useStorage } from '@vueuse/core'
import { bot_getTokenBalance } from '~/api/bot'
useConfigStore()
const { t } = useI18n()

const tokenStore = useTokenStore()
const tokenDetailSStore = useTokenDetailsStore()
const token = computed(() => tokenStore.token)

interface TokenObj {
    dev_address?: string
    total_migrated?: number
    total_non_migrated?: number
    total_tokens?: number
}
const tokenObj = ref<TokenObj>({})
const tableList = ref<any[]>([])
const pageNO = ref(1)
const pageSize = ref(20)
const loadingRun = ref(false)
const finished = ref(false)
const showFinished = ref(false)
const conditions = useStorage('conditions_dev_tokens', {
    sort: 'created_at',
    sort_dir: 'desc',
})
const balance = ref({})
let finishedTimer: NodeJS.Timeout | null = null

const route = useRoute()
const id = computed(() => route.params.id as string)
const tableHeight = computed(() => {
  return Math.max(tokenStore.commonHeight - 260, 450)
})

const resetPageNOAndLoading = () => {
    tableList.value = []
    pageNO.value = 1
    pageSize.value = 5
    loadingRun.value = false
    finished.value = false
    showFinished.value = false
}
watch(
    () => route.params.id,
    (val: any) => {
        if (val) {
            resetPageNOAndLoading()
            if (finishedTimer) clearTimeout(finishedTimer)
            getRugPullList()
        }
    }
)

const handleSortChange = ({ prop, order }) => {
    resetPageNOAndLoading()
    const sort_dir = order?.replace?.('ending', '')
    conditions.value.sort = prop
    conditions.value.sort_dir = sort_dir
    getRugPullList()
}

async function getRugPullList() {
    if (loadingRun.value) return
    loadingRun.value = true
    try {
        const data = {
            token_id: id.value,
            pageNO: pageNO.value,
            pageSize: pageSize.value,
        }
        const res = await _getDevList(data)
        
        const { dev_address, total_migrated, total_non_migrated, total_tokens } = res
        if (pageNO.value === 1) {
            tableList.value = []
            _getBalance(dev_address)
        }
        tokenObj.value = {
            dev_address,
            total_migrated,
            total_non_migrated,
            total_tokens
        }
        tokenStore.devTokenNum = total_tokens || 0
        const list =
            res?.infos?.map((i: any) => ({
                ...i,
                chain: token.value?.chain,
                createdAt:
                    i?.created_at !== '1970-01-01T00:00:00Z' && i?.created_at !== '0001-01-01T00:00:00Z'
                        ? new Date(i.created_at).getTime() / 1000
                        : 0,
            })) || []
        tableList.value.push(...list)
        if (list.length < pageSize.value) {
            finished.value = true
            showFinished.value = true
            // 3秒后自动隐藏
            if (finishedTimer) clearTimeout(finishedTimer)
            finishedTimer = setTimeout(() => {
                showFinished.value = false
            }, 3000)
        } else {
            pageNO.value++
        }
    } catch (err) {
        console.error(err)
        tableList.value = []
        finished.value = true
    } finally {
        // tableList.value=[]
        loadingRun.value = false
    }
}

async function _getBalance(dev_address: string) {
    const chain = tokenStore.token?.chain as string 
    const _balance = await bot_getTokenBalance({
        chain,
        walletAddress: dev_address,
        tokens: [getNativeToken(chain)]
    })
    balance.value = _balance[0] || {balance: 0}
}
getRugPullList()

function onRowClick(row) {
    tokenDetailSStore.$patch({
        drawerVisible: true,
        tokenInfo: {
            id: row.token + '-' + row.chain,
            symbol: row.symbol,
            logo_url: row.logo_url,
            chain: row.chain,
            address: row.token,
            remark: '',
        },
        pairInfo: {
            target_token: row.token,
            token0_address: row.token,
            token0_symbol: row.symbol,
            token1_symbol: '',
            pairAddress: '',
        },
        user_address: route.params.userAddress as string,
    })
}

function handleSearchDevAddress() {
    window.open(`https://x.com/search?q=${tokenObj.value.dev_address}`)
}

function jumpBrowser() {
    window.open(formatExplorerUrl(token.value?.chain as string, tokenObj.value.dev_address || '', 'address'))
}
</script>
<style scoped lang="scss">
:deep(.el-table .caret-wrapper){
    width:18px;
}
:deep(.el-scrollbar__bar.is-vertical){
    display: none;
}
</style>