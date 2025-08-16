<script setup lang="ts">
const rankKlineStore = useRankKlineStore()
const token = computed(()=>rankKlineStore.tokenInfo?.token)
const appendix = computed(() => {
  if (token.value?.appendix && isJSON(token.value?.appendix)) {
    return JSON.parse(token.value?.appendix)
  }
  return {}
})
</script>

<template>
   <div class="flex items-center color-[--d-666-l-999]">
    <el-tooltip popper-class="tooltip-pd-0" placement="bottom-start" :show-arrow="false">
        <template #default>
          <TokenImg
            chain-class="w-20px h-20px"
            :token-class="`w-40px h-40px`"
            :row="{
              chain: token?.chain || 'solana',
              symbol: token?.symbol || '',
              logo_url: token?.logo_url||'',
            }"
          />
        </template>
        <template #content>
          <TokenImg
            chain-class="hidden"
            :token-class="`w-240px h-240px [&&]:mr-0 rounded-16px`"
            :row="{
              chain: token?.chain || 'solana',
              symbol: token?.symbol || '',
              logo_url: token?.logo_url||'',
            }"
          />
        </template>
      </el-tooltip>
      <div class="ml-8px">
        <div class="flex items-center">
          <span
            class="text-16px leading-[1.25] color-[--d-F5F5F5-l-333] font-500"
            >{{ token?.symbol }}</span
          >
          <span class="ml-8px text-12px font-500 mr-8px">{{
            token?.name
          }}</span>
          <div class="flex items-center justify-start">
            <img v-if="(token?.risk_level??0) < 0" class="bg-btn" src="@/assets/images/fengxian.png" :width="12">
            <div v-if="medias?.length > 0" class="flex text-20px">
              <div v-for="(item, index) in medias" :key="index" class="tag-btn">
                <template v-if="item.url">
                  <span
                    v-if="item.name === 'QQ'"
                    v-tooltip="item.url"
                    class="bg-btn"
                  >
                    <Icon
                      :name="`custom:${item.icon}`"
                      class="text-[--d-666-l-999] text-12px"
                    />
                  </span>
                  <a
                    v-else
                    v-tooltip="item.url"
                    :href="item.url"
                    target="_blank"
                    class="bg-btn"
                    @click.stop
                  >
                    <Icon
                      :name="`custom:${item.icon}`"
                      class="text-[--d-666-l-999] text-12px"
                    />
                  </a>
                </template>
              </div>
            </div>
            <a
              class="media-item bg-btn"
              :href="`https://x.com/search?q=($${token?.symbol} OR ${token?.token})&src=typed_query&f=live`"
              target="_blank"
            >
              <Icon
                class="text-[--d-666-l-999] h-16px w-10px"
                name="custom:search"
              />
            </a>
            <template v-if="pair && getTags(pair)?.normal_tag?.length > 0">
              <div
                v-for="(i, index) in getTags(pair)?.normal_tag"
                :key="index"
                class="bg-btn flex h-16px tag-btn"
              >
                <el-image
                  v-tooltip="$t(`${i.tag}`)"
                  class="token-icon-tag cursor-pointer h-100%"
                  :src="formatIconTag(i.tag)"
                  lazy
                >
                  <template #error>
                    <img
                      class="token-icon-tag h-16px"
                      src="/icon-default.png"
                    >
                  </template>
                  <template #placeholder>
                    <img
                      class="token-icon-tag h-16px"
                      src="/icon-default.png"
                    >
                  </template>
                </el-image>
                <span
                  v-if="i?.showText"
                  :style="{
                    color: i?.color == 'green' ? upColor[0] : downColor[0],
                  }"
                  class="text-10px mr-4px"
                >
                  {{ $t(i?.tag) }}
                </span>
              </div>
            </template>
            <div v-if="medias?.length > 0" class="flex text-20px">
              <div v-for="(item, index) in medias" :key="index" class="tag-btn">
                <template v-if="item.url">
                  <span
                    v-if="item.name === 'QQ'"
                    v-tooltip="item.url"
                    class="bg-btn"
                  >
                    <Icon
                      :name="`custom:${item.icon}`"
                      class="text-[--d-666-l-999] text-12px"
                    />
                  </span>
                  <XPopup v-else-if="item.icon === 'twitter'" :tokenId="(route.params.id as string)" :type="tokenStore.twitterType">
                    <a
                      :href="item.url"
                      target="_blank"
                      class="bg-btn"
                      @click.stop
                    >
                      <XIcon
                        v-if="[1, 2, 3].includes(tokenStore.twitterType)"
                        :type="tokenStore.twitterType"
                        class="text-12px"
                      />
                      <Icon
                        v-else
                        :name="`custom:${item.icon}`"
                        class="text-[--d-666-l-999] text-12px"
                      />
                    </a>
                  </XPopup>

                  <a
                    v-else
                    v-tooltip="item.url"
                    :href="item.url"
                    target="_blank"
                    class="bg-btn"
                    @click.stop
                  >
                    <Icon
                      :name="`custom:${item.icon}`"
                      class="text-[--d-666-l-999] text-12px"
                    />
                  </a>
                </template>
              </div>
            </div>
            <img
              v-if="token?.launchpad"
              v-tooltip="token.launchpad"
              class="rounded-100% bg-btn cursor-pointer"
              :src="formatIconTag(token.launchpad)"
              alt=""
              :width="12"
              style="border-radius: 100%"
            >
            <a
              v-if="aiSummary?.headline || aiSummary?.summary"
              v-tooltip.raw="{
                content: `<div class='max-w-[400px]'>${aiSummary.headline || aiSummary.summary}</div>`,
                props:{
                  placement:'top-start'
                }
              }"
              class="media-item bg-btn clickable">
              <Icon name="custom:ai" class="text-14px"/>
            </a>
          </div>
          <DeBox/>
          <el-popover
            v-if="collected"
            v-model:visible="editableGroup"
            placement="bottom"
            popper-class="chains-table-filter"
            title=""
            :width="200"
            trigger="click"
          >
            <template #reference>
              <a class="w-zu flex-start bg-btn" href="" @click.stop.prevent>
                <Icon
                  class="text-[--d-666-l-999] text-12px"
                  name="custom:groups"
                />
                <span class="ml-2px ellipsis block" style="max-width: 140px">
                  {{ currentGroup }}
                </span>
              </a>
            </template>
            <template #default>
              <div class="filter-box">
                <span>{{ $t('editGroup') }}</span>
                <div class="flex mt-10px">
                  <el-select
                    v-model="selectedGroup"
                    class="select3"
                    :placeholder="$t('pleaseSelectGroup')"
                    :teleported="false"
                  >
                    <el-option :label="$t('defaultGroup')" :value="0" />
                    <el-option
                      v-for="item in userFavoriteGroups"
                      :key="item.group_id"
                      :label="item.name"
                      :value="item.group_id"
                    />
                  </el-select>
                </div>
                <div class="mt-20px flex-center">
                  <el-button
                    class="flex-1"
                    size="default"
                    style="
                      height: 30px;
                      min-width: 70px;
                      --el-button-font-weight: 400;
                    "
                    :color="theme !== 'dark' ? '#f2f2f2' : '#333333'"
                    @click.stop="handleReset()"
                  >
                    {{ $t('cancel') }}
                  </el-button>
                  <el-button
                    v-loading="loadingGroupEdit"
                    class="flex-1"
                    size="default"
                    style="
                      height: 30px;
                      min-width: 70px;
                      --el-button-font-weight: 400;
                    "
                    :color="theme !== 'dark' ? '#222222' : '#f5f5f5'"
                    @click.stop="
                      confirmSwitchGroup(id, selectedGroup, walletAddress)
                    "
                  >
                    {{ $t('confirm') }}
                  </el-button>
                </div>
              </div>
            </template>
          </el-popover>
          <el-popover
            v-if="collected"
            v-model:visible="editableRemark"
            placement="bottom"
            popper-class="chains-table-filter"
            title=""
            :width="200"
            trigger="click"
          >
            <template #reference>
              <a class="w-zu flex-start bg-btn" href="" @click.stop.prevent>
                <Icon
                  class="text-[--d-666-l-999] text-12px"
                  name="custom:remark"
                />
                <span class="ml-2px ellipsis block" style="max-width: 140px">{{
                  remark
                }}</span>
              </a>
            </template>
            <template #default>
              <div class="filter-box">
                <span>{{ $t('editRemark') }}</span>
                <div class="flex mt-10px">
                  <el-input
                    v-model.trim="remark2"
                    :placeholder="remark"
                    clearable
                  />
                </div>
                <div class="mt-20px flex-center">
                  <el-button
                    class="flex-1"
                    size="default"
                    style="
                      height: 30px;
                      min-width: 70px;
                      margin-left: auto;
                      --el-button-font-weight: 400;
                    "
                    :color="theme !== 'dark' ? '#f2f2f2' : '#333333'"
                    @click.stop="handleReset()"
                  >
                    {{ $t('cancel') }}
                  </el-button>
                  <el-button
                    class="flex-1"
                    size="default"
                    :color="theme !== 'dark' ? '#222222' : '#f5f5f5'"
                    style="
                      height: 30px;
                      min-width: 70px;
                      --el-button-font-weight: 400;
                    "
                    @click.stop="confirmEditRemark(id, remark2)"
                  >
                    {{ $t('confirm') }}
                  </el-button>
                </div>
              </div>
            </template>
          </el-popover>
        </div>
        <div class="text-12px flex items-center mt-4px">
          <a
            v-if="token?.token !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'"
            class="hover:color-[--d-F5F5F5-l-333] leading-12px font-500"
            :href="formatExplorerUrl(token?.chain as string, token?.token as string)"
            target="_blank"
          >
            {{
              token?.token?.replace(new RegExp('(.{4})(.+)(.{4}$)'), '$1...$3')
            }}
          </a>
          <Icon
            v-copy="token?.token"
            name="bxs:copy"
            class="ml-5px clickable"
          />
          <span
            v-if="pair"
            v-tooltip="formatDate(pair?.created_at)"
            class="ml-5px hover:color-[--d-F5F5F5-l-333] leading-12px font-400 mr-8px"
            >
            {{ formatTimeFromNow(pair?.created_at) }}
            </span>
          <div
            v-if="(tokenInfoExtra?.buy_tax??0) > 0 || (tokenInfoExtra?.sell_tax??0) > 0"
            class="flex-start bg-btn"
          >
            <span>{{ $t('tax') }}:</span>
            <span
            v-if="(tokenInfoExtra?.buy_tax??0) > 0"
              class="text-12px tax-text"
              :style="{ color: upColor[0] }"
            >
              {{ formatNumber(tokenInfoExtra?.buy_tax ||0, 1) }}%
            </span>
            <span
              v-if="(tokenInfoExtra?.sell_tax??0) > 0"
              class="text-12px tax-text ml-4px"
              :style="{ color: downColor[0] }"
            >
              {{ formatNumber(tokenInfoExtra?.sell_tax ||0, 1) }}%
            </span>
          </div>
          <template v-if="pair && getTags(pair)?.signal_arr?.length > 0">
            <div
              v-for="(i, index) in getTags(pair)?.signal_arr?.slice(0, 3)"
              :key="index"
              v-tooltip="
                getTagTooltip(i) +
                (i.tag == 'smarter_buy' || i.tag == 'smarter_sell'
                  ? `（${$t('amountU')}>$10)`
                  : '')
              "
              class="flex bg-btn signal pointer mr-4px text-10px"
            >
              <el-image
                class="token-icon-signal-tag h-10px"
                :src="formatIconTag(i.tag)"
                lazy
              >
                <template #error>
                  <img
                    class="token-icon-signal-tag h-16px"
                    src="/icon-default.png"
                  >
                </template>
                <template #placeholder>
                  <img
                    class="token-icon-signal-tag h-16px"
                    src="/icon-default.png"
                  >
                </template>
              </el-image>
              <div
                v-if="
                  (i?.tag == 'smarter_buy' || i?.tag == 'smarter_sell') &&
                  ((pair?.smart_money_buy_count_24h ?? 0) > 0 ||
                    (pair?.smart_money_sell_count_24h ?? 0 > 0))
                "
                class="ml-2px"
                style="color: #959a9f"
              >
                <span
                  :style="{
                    color:
                      (pair?.smart_money_buy_count_24h ?? 0) > 0
                        ? upColor[0]
                        : '',
                  }"
                >
                  {{
                    formatNumber(pair?.smart_money_buy_count_24h || 0, 0)
                  }} </span
                >/<span
                  :style="{
                    color:
                      (pair?.smart_money_sell_count_24h ?? 0) > 0
                        ? downColor[0]
                        : '',
                  }"
                >
                  {{ formatNumber(pair?.smart_money_sell_count_24h || 0, 0) }}
                </span>
              </div>
              <span
                class="ml-2px"
                :style="{
                  color: i.color == 'green' ? upColor[0] : downColor[0],
                }"
              >
                <template v-if="i.tag">
                  <template v-if="new RegExp('_buy.*$', 'gi').test(i.tag)">
                    {{ $t('buy') }}
                  </template>
                  <template
                    v-else-if="new RegExp('_sell.*$', 'gi').test(i.tag)"
                  >
                    {{ $t('sell') }}
                  </template>
                  <template v-else>
                    {{ $t(i.tag) }}
                  </template>
                </template>
              </span>
            </div>
          </template>
          <div
            v-if="
              pair &&
              getTags(pair)?.signal_arr?.findIndex(
                (i) => i?.tag === 'smarter_buy'
              ) == -1 &&
              getTags(pair)?.signal_arr?.findIndex(
                (i) => i?.tag == 'smarter_sell'
              ) == -1 &&
              ((pair?.smart_money_buy_count_24h ?? 0) > 0 ||
                (pair?.smart_money_sell_count_24h ?? 0) > 0)
            "
            v-tooltip="
              getTagTooltip({
                smart_money_buy_count_24h: pair?.smart_money_buy_count_24h || 0,
                smart_money_sell_count_24h:
                  pair?.smart_money_sell_count_24h || 0,
              })
            "
            class="minor flex-end color-text-2 tag-btn signal cursor-pointer mr-4px bg-btn text-10px"
          >
            <Icon
              class="text-[--d-666-l-999] h-12px w-12px mr-2px"
              name="custom:smart"
            />
            <span class="mr-2px text-10px">{{ $t('smarter') }}</span>
            <span
              :style="{
                color:
                  (pair?.smart_money_buy_count_24h ?? 0) > 0
                    ? upColor[0]
                    : 'var(--custom-text-3-color)',
              }"
            >
              {{ formatNumber(pair?.smart_money_buy_count_24h || 0, 0) }} </span
            >/<span
              :style="{
                color:
                  (pair?.smart_money_sell_count_24h ?? 0) > 0
                    ? downColor[0]
                    : 'var(--custom-text-3-color)',
              }"
            >
              {{ formatNumber(pair?.smart_money_sell_count_24h || 0, 0) }}
            </span>
          </div>
          <top50 />
        </div>
      </div>
   </div>
</template>