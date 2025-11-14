<template>
  <div class="pop-right color-[--main-text]">
    <div class="content" style="overflow-x: hidden; overflow-y: auto">
      <div class="text-12px color-[--third-text] my-2 mt-1">
        {{ $t('devTokenSummary') }}
      </div>
      <ol class="text-12px mb-2">
        <li class="flex justify-between mb-12px">
          <span class="color-[--third-text]">{{ $t('totalTokens') }}</span>
          <span class="color-[--secondary-text] max-w-75px">{{ tokenObj.total_tokens ?? 0 }}</span>
        </li>
        <li class="flex justify-between mb-12px">
          <span class="color-[--third-text]">{{ $t('migrated') }}</span>
          <span class="color-[--pump-green] max-w-75px">{{ tokenObj.total_migrated ?? 0 }}</span>
        </li>
        <li class="flex justify-between mb-12px">
          <span class="color-[--third-text]">{{ $t('notMigrated') }}</span>
          <span class="color-[--signal-red] max-w-75px">{{ tokenObj.total_non_migrated ?? 0 }}</span>
        </li>
        <li class="flex justify-between mb-12px">
          <span class="color-[--third-text]">{{ $t('migrationRate') }}</span>
          <span class="color-[--secondary-text]  max-w-185px"><span class="color-[--yellow]">{{ tokenObj.total_tokens ? ((tokenObj.total_migrated ?? 0) / tokenObj.total_tokens * 100).toFixed(2) : 0 }}%</span>({{ tokenObj.total_migrated ?? 0 }}/{{ tokenObj.total_tokens ?? 0 }})</span>
        </li>
        <li class="flex justify-between mb-12px">
          <span class="color-[--third-text]">{{ $t('dev') }}</span>
          <div class="flex items-center justify-end color-[--secondary-text]">
            <a
              class="clickable color-[--secondary-text] hover:color-[--main-text] text-decoration-none"
              :href="formatExplorerUrl(token?.chain as string, tokenObj.dev_address || '', 'address')"
              target="_blank"
            >
              {{ formatAddress(tokenObj.dev_address || '') }}</a
            >
            <Icon
              v-copy="tokenObj.dev_address"
              name="bxs:copy"
              class="ml-5px clickable color-[--third-text]"
            />
          </div>
        </li>
      </ol>
      <div class="right-container run">
        <div class="relative">
          <div v-if="tableList.length > 0" class="top mt-2" >
            <span class="flex-start">{{ $t('token') }}</span>
            <span>{{ $t('migration') }}</span>
            <span>{{$t('mcap')}}/{{ $t('pair') }}</span>
            <div class="flex items-center justify-end">
              <span>{{ $t('volumeOneHour') }}</span>
            </div>
          </div>
          <el-scrollbar class="list">
            <ul
              v-if="tableList.length > 0"
              v-infinite-scroll="getRugPullList"
              :infinite-scroll-disabled="loadingRun || finished"
              :infinite-scroll-distance="500"
              :infinite-scroll-delay="10"
              :infinite-scroll-immediate="true"
              class="content"
            >
              <li
                v-for="(row, $index) in tableList"
                :key="$index"
                class="flex"
                @click.stop="tableRowClick(row)"
              >
                <div
                  class="token-info table-item_d"
                  style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                  @click.stop.prevent="tableRowClick(row)"
                >
                  <div class="icon-token-container" style="margin-right: 10px">
                    <el-image
                      class="token-icon w-24px h-24px rounded-100%"
                      :src="getSymbolDefaultIcon(row)"
                    >
                      <template #error>
                        <div
                          class="token-icon"
                          style="line-height: 24px; text-align: center; font-size: 16px; color: #fff"
                          :style="{
                            background: getChainDefaultIconColor(row?.Chain),
                          }"
                        >
                          {{ row.symbol?.slice(0, 1)?.toUpperCase?.() || '' }}
                        </div>
                      </template>
                      <template #placeholder>
                        <div
                          class="token-icon"
                          style="line-height: 24px; text-align: center; font-size: 16px; color: #fff"
                          :style="{
                            background: getChainDefaultIconColor(row?.Chain),
                          }"
                        >
                          {{ row.symbol?.slice(0, 1)?.toUpperCase?.() || '' }}
                        </div>
                      </template>
                    </el-image>
                    <img
                      v-if="row?.network || row?.chain"
                      class="icon-svg icon-symbol"
                      :src="`${token_logo_url}chain/${row.chain}.png`"
                      :width="10"
                      alt=""
                      onerror="this.src='/icon-default.png'"
                      srcset=""
                    />
                  </div>
                  <div @click.stop>
                    <div class="flex-start">
                      <span class="token-symbol ellipsis color-[--main-text]">
                        {{ row.symbol }}

                      </span>
                      <Icon
                        v-copy="row.token"
                        name="bxs:copy"
                        class="text-12px ml-2px cursor-pointer color-[--third-text]"
                        @click.stop.prevent
                      />
                    </div>
                    <div class="font-1 mt-2px flex-start">
                      <span class="mini font-10">
                        {{ dayjs(row?.createdAt * 1000).fromNow() }}
                      </span>
                    </div>
                  </div>
                </div>
                <span>
                  <Icon v-if="row.migrated" name="material-symbols:check-circle-outline" class="text-[14px] text-[--signal-green]" />
                  <Icon v-else name="material-symbols:x-circle-outline" class="text-[14px] text-[--signal-red]" />
                </span>
                <span>
                  ${{ formatNumber(row.market_cap || 0, 2) }}
                  <span class="block color-[--third-text]">${{ formatNumber(row.tvl || 0, 2) }}</span>
                </span>
                <span>
                  ${{ formatNumber(row.volume_u_1h || 0, 2) }}
                </span>
              </li>
            </ul>
          </el-scrollbar>
          <div class="text-12px loadingMore width100 text-center color-[--third-text]">
            <span v-if="loadingRun && pageNO > 1">{{ $t('loading') }}</span>
            <span v-if="showFinished && pageNO > 1 && tableList?.length > pageSize">{{
              $t('noMore')
            }}</span>
          </div>
          <el-empty
            v-if="(!tableList || tableList?.length === 0) && !loadingRun"
            :image-size="100"
            :image="themeStore.theme === 'light' ? emptyWhite : emptyDark"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import emptyWhite from '@/assets/images/empty-white.svg'
import emptyDark from '@/assets/images/empty-black.svg'
import { _getDevList } from '@/api/run'
import dayjs from 'dayjs'
const { token_logo_url } = useConfigStore()

const tokenStore = useTokenStore()
const themeStore = useThemeStore()
const token = computed(() => tokenStore.token)

interface TokenObj {
  dev_address?: string
  total_migrated?: number
  total_non_migrated?: number
  total_tokens?: number
}
const tokenObj = ref<TokenObj>({})
const tableList = ref<any[]>([{}])
const pageNO = ref(1)
const pageSize = ref(5)
const loadingRun = ref(false)
const finished = ref(false)
const showFinished = ref(false)
let finishedTimer: NodeJS.Timeout | null = null

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id as string)

watch(
  () => route.params.id,
  (val: any) => {
    if (val) {
      tableList.value = []
      pageNO.value = 1
      pageSize.value = 5
      loadingRun.value = false
      finished.value = false
      showFinished.value = false
      if (finishedTimer) clearTimeout(finishedTimer)
      getRugPullList()
    }
  }
)

function tableRowClick(item: any) {
  router.push({ name: 'Token', params: { id: `${item.Token}-${item.chain}` } })
}


function formatAddress(address: string) {
  return address.slice(0, 4) + '...' + address.slice(-4)
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
    if (pageNO.value === 1) tableList.value = []
    const {dev_address, total_migrated, total_non_migrated, total_tokens} = res
    tokenObj.value = {
      dev_address,
      total_migrated,
      total_non_migrated,
      total_tokens
    }
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
    finished.value = true
  } finally {
    loadingRun.value = false
  }
}
</script>
<style lang="scss" scoped>
.run {
  .loadingMore{
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .top {
    // background: var(--custom-table-th-bg-color);
    color: var(--third-text);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0px 0px;
    font-size: 12px;
    > :nth-child(n) {
      padding: 0 0px;
      &:first-child {
        padding-left: 0;
        // align-items: flex-start;
      }
      &:last-child {
        padding-right: 0;
      }
    }
    > :nth-child(1) {
      flex: 2;
      white-space: nowrap;
    }
    > :nth-child(2) {
      flex: 0.5;
      text-align: right;
      white-space: nowrap;
    }
    > :nth-child(3) {
      flex: 1.5;
      text-align: right;
    }
    > :nth-child(4) {
      flex: 1;
      text-align: right;
    }
  }
  .list {
    height: calc(100vh - 600px);
    overflow: auto;
  }
  // color: var(--custom-font-1-color);
  font-family: PingFang SC;
  .content {
    color: var(--secondary-text);
    // font-weight: 400;
    font-size: 11px;
    > .flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      > :nth-child(n) {
        // display: flex;
        // flex-direction: column;
        // align-items: flex-end;
        // justify-content: center;
        // color: var(--custom-text-2-color);
        padding: 12px 0px;
        &:last-child {
          padding-right: 0px;
        }
      }
      > :nth-child(1) {
        flex: 2;
      }
      > :nth-child(2) {
        flex: 0.5;
        text-align: right;
      }
      > :nth-child(3) {
        flex: 1.5;
        text-align: right;
      }
      > :nth-child(4) {
        flex: 1;
        text-align: right;
      }
      &:hover {
        background-color: var(--custom-table-hover-bg-color);
      }
    }
    .unit {
      margin-left: 5px;
      color: var(--custom-text-2-1-color);
    }
  }
  .text-underline {
    text-decoration: underline;
  }
}
.token-info {
  display: flex;
  .icon-token-container {
    position: relative;
    margin-right: 4px;
    .icon-symbol {
      position: absolute;
      left: 15px;
      top: 15px;
    }
  }
}
.pop-right {
  ol {
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
    & > :nth-child(1),
    & > :nth-child(2),
    & > :nth-child(3) {
      grid-column: span 2;
    }
    & > :nth-child(4) {
      grid-column: span 3;
    }
    & > :nth-child(5) {
      grid-column: span 3;
    }
    li {
      background: var(--main-input-button-bg);
      border-radius: 4px;
      padding: 8px;
      flex-direction: column-reverse;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0;
      & > :first-child {
        margin-top: 6px;
      }
    }
  }
  .right-container {
    padding-top: 0;
    border-radius: 0;
    // background: var(--d-222-l-FFF);
    min-height: auto;
    // overflow-y: scroll;
    // overflow-x: hidden;
  }
}
.ellipsis {
  max-width: 60px;
}
.sticky {
  position: sticky;
  top: 0px;
  padding-top: 20px;
  background: var(--dialog-bg);
  z-index: 2;
}
.run-progress-bar {
  :deep() .el-progress-bar__outer {
    --el-border-color-lighter: var(--dialog-divider);
  }
}
</style>
