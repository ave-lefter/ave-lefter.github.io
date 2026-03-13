<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div class="relative">
    <el-alert
      v-if="(tokenStore?.token?.risk_level ?? 0) < 0"
      class="myTxs-notice"
      type="warning"
      :title="$t('riskWarning') + ': ' + $t('riskWarningContent1')"
      show-icon
      :style="{
        backgroundColor: mode === 'light' ? '#ffa94d0d' : '#36131C',
        color: '#f00',
        border: 'none',
        fontSize: '12px'
      }"
      :closable="false"
    />
    <el-alert
      v-else-if="tokenStore.warningStatus"
      class="myTxs-notice"
      type="warning"
      :title="t('alertNotice')"
      show-icon
      closable
      :style="{
        backgroundColor: mode === 'light' ? '#ffa94d0d' : '#3b1e0c',
        color: '#ED6A0C',
        border: 'none',
        fontSize: '12px'
      }"
      @close="handleNoticeClose"
    />
    <div
      class="info flex items-center bg-[--secondary-bg] mb-.5px h-64px p-x-16px text-12px color-[--third-text]"
    >
      <!-- <Icon
        name="material-symbols:kid-star"
        class="h-16px w-16px clickable"
        :class="collected ? 'color-#ffbb19' : 'color-[--icon-color]'"
        @click="collect"
      /> -->
      <Collect iconClass="text-16px cursor-pointer" :isCollected="collected" :userFavoriteGroups="userFavoriteGroups" @confirmSwitchGroup="confirmSwitchGroup" @collect="collect" @newGroupAndCollect="newGroupAndCollect"/>
      <div class="pump-item_item token-info ml-16px flex items-center color-[--third-text] ">
        <div class="black-container">
          <span
            v-tooltip="pumpBlackList?.findIndex(i => (i.address == token?.token && i.type == 'ca') || (i.address == token?.symbol && i.type == 'keyword')) !== -1 ? $t('cancel') + $t('BlackListToken') : $t('BlackListToken')"
            class="bg-[--d-000-l-FFF] cursor-pointer px-2px py-2px color-[--third-text1] block rounded-2px hover:color-[--secondary-text] w-14px h-14px flex items-center justify-center"
          >
            <Icon
              v-if="
                pumpBlackList?.findIndex(
                  (i) =>
                    (i.address == token?.token && i.type == 'ca') ||
                    (i.address == token?.symbol && i.type == 'keyword')
                ) !== -1
              "
              name="custom:key-visible"
              class="text-12px"
              @click.stop="addOrRemoveBlaclList('ca')"
            />
            <Icon
              v-else
              name="custom:key-invisible"
              class="text-12px"
              @click.stop="addOrRemoveBlaclList('ca')"
            />
          </span>
          <span
            v-tooltip="pumpBlackList?.findIndex(i => i.address == token?.token && i.type == 'dev') !== -1 ? $t('cancel') + $t('BlackListDev') : $t('BlackListDev')"
            class="bg-[--d-000-l-FFF] cursor-pointer px-2px py-2px color-[--third-text1] block rounded-2px mt-2px hover:color-[--secondary-text] w-14px h-14px flex items-center justify-center"
          >
            <Icon
              v-if="
                pumpBlackList?.findIndex(
                  (i) => i.address == token?.token && i.type == 'dev'
                ) !== -1
              "
              name="custom:dev"
              class="text-12px"
              @click.stop="addOrRemoveBlaclList('dev')"
            />
            <Icon
              v-else
              name="custom:dev-invisible"
              class="text-12px"
              @click.stop="addOrRemoveBlaclList('dev')"
            />
          </span>
          <span
            v-if="medias?.filter?.(i => i.icon === 'twitter')?.length > 0 && medias?.filter?.(i => i.icon === 'twitter')?.[0] && formatXUser(medias?.filter?.(i => i.icon === 'twitter')?.[0]?.url)"
            v-tooltip="pumpBlackList?.findIndex(i => i.address == formatXUser(medias?.filter?.(m => m.icon === 'twitter')?.[0]?.url) && i.type == 'twitter') !== -1 ? $t('cancel') + $t('BlackListTwitter') : $t('BlackListTwitter')"
            class="bg-[--d-000-l-FFF] cursor-pointer px-2px py-2px color-[--third-text1] block rounded-2px mt-2px hover:color-[--secondary-text] w-14px h-14px flex items-center justify-center"
          >
            <Icon
              v-if="
                pumpBlackList?.findIndex(
                  (i) => i.address == formatXUser(medias?.filter?.(m => m.icon === 'twitter')?.[0]?.url) && i.type == 'twitter'
                ) !== -1
              "
              name="custom:twitter-visible"
              class="text-12px text-[--third-text]"
              @click.stop="addOrRemoveBlaclList('twitter')"
            />
            <Icon
              v-else
              name="custom:twitter-unvisible"
              class="text-12px text-[--third-text]"
              @click.stop="addOrRemoveBlaclList('twitter')"
            />
          </span>
        </div>
        <el-tooltip  v-if="getSymbolDefaultIcon(token)" popper-class="tooltip-pd-0" placement="bottom-start" :show-arrow="false" :persistent="false">
          <template #content>
            <el-image
              class="token-icon  h-228px w-228px items-center"
              :src="getSymbolDefaultIcon(token)"
              lazy
            >
              <template #error>
                <img
                  class="token-icon h-228px w-228px"
                  :src="getChainDefaultIcon(token?.chain, token?.symbol)"
                >
              </template>
              <template #placeholder>
                <img
                  class="token-icon h-228px w-228px"
                  :src="getChainDefaultIcon(token?.chain, token?.symbol)"
                >
              </template>
            </el-image>
          </template>
            <div
              v-if="getSymbolDefaultIcon(token)"
              class="icon-token-container relative"
            >
            <el-image
                class="token-icon rounded-100%"
                :src="getSymbolDefaultIcon(token)"
                lazy
              >
                <template #error>
                  <img
                    class="token-icon"
                    :src="getChainDefaultIcon(token?.chain, token?.symbol)"
                  >
                </template>
                <template #placeholder>
                  <img
                    class="token-icon"
                    :src="getChainDefaultIcon(token?.chain, token?.symbol)"
                  >
                </template>
              </el-image>
              <img
                v-if="token?.chain"
                class="icon-symbol rounded-100%"
                :src="`${token_logo_url}chain/${token?.chain}.png`"
              >
            </div>
        </el-tooltip>
        <div class="ml-8px">
          <div class="flex items-center">
            <span class="text-16px leading-[1.25] color-[--main-text1] font-500 ellipsis max-w-260px tokenName1">{{ token?.symbol }}
            </span>
            <span class="text-16px leading-[1.25] color-[--main-text1] font-500 ellipsis max-w-260px tokenName2" v-tooltip="token?.symbol">{{ token?.symbol }}
            </span>
            <span class="ml-8px text-12px font-500 mr-8px ellipsis" style="max-width: 60px" v-tooltip="token?.name">{{
              token?.name
            }}</span>
            <div class="flex items-center justify-start">
              <img v-if="(token?.risk_level??0) < 0" class="bg-btn" src="@/assets/images/fengxian.png" :width="12">
              <!-- <div v-if="medias?.length > 0" class="flex text-20px">
                <div v-for="(item, index) in medias" :key="index" class="tag-btn">
                  <template v-if="item.url">
                    <span
                      v-if="item.name === 'QQ'"
                      v-tooltip="item.url"
                      class="bg-btn"
                    >
                      <Icon
                        :name="`custom:${item.icon}`"
                        class="text-[--third-text] text-12px"
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
                        class="text-[--third-text] text-12px"
                      />
                    </a>
                  </template>
                </div>
              </div> -->
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
                        class="text-[--third-text] text-12px"
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
                          class="text-[--third-text] text-12px"
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
                        class="text-[--third-text] text-12px"
                      />
                    </a>
                  </template>
                </div>
              </div>
              <PumpLive v-if="token?.is_streaming" :tokenId="(route.params.id as string)" />
              <el-popover popper-class="[--el-popover-bg-color:--border]" :persistent="false">
                <template #reference>
                  <span
                    class="media-item bg-btn cursor-pointer"
                  >
                    <Icon
                      class="text-[--third-text] h-16px w-10px"
                      name="custom:search"
                    />
                </span>
                </template>
                <template #default>
                  <div class="py-4px [&&]:m--12px flex flex-col">
                    <a :href="`https://x.com/search?q=${token?.token}`" target="_blank" class="text-12px py-4px px-8px color-[--main-text] hover:bg-[--dialog-tab-active]">
                      {{ $t('tweetSearchContractAddress') }}
                    </a>
                    <a :href="`https://x.com/search?q=$${token?.symbol}`" target="_blank" class="text-12px py-4px px-8px color-[--main-text] hover:bg-[--dialog-tab-active]">
                      {{ $t('tweetSearchContractAddress2') }}
                    </a>
                    <!-- <a :href="`https://www.google.com/search?q=${token?.symbol}&tbm=nws`" target="_blank" class="text-12px py-4px px-8px color-[--main-text] hover:bg-[--dialog-tab-active]">
                      {{ $t('tweetSearchContractAddress3') }}
                    </a> -->
                    <a :href="`https://www.tiktok.com/search?q=${token?.symbol}`" target="_blank" class="text-12px py-4px px-8px color-[--main-text] hover:bg-[--dialog-tab-active]">
                      {{ $t('TikTokSearchName') }}
                    </a>
                    <a :href="`https://www.google.com/search?q=${token?.symbol}&tbm=nws`" target="_blank" class="text-12px py-4px px-8px color-[--main-text] hover:bg-[--dialog-tab-active]">
                      {{ $t('GoogleSearchName') }}
                    </a>
                    <span class="text-12px py-4px px-8px color-[--main-text] hover:bg-[--dialog-tab-active] cursor-pointer" @click="handleSearchTokenName">{{ $t('tweetSearchContractAddress4') }}</span>
                  </div>
                </template>
              </el-popover>

              <!-- <template v-if="pair && getTags(pair)?.normal_tag?.length > 0">
                <div
                  v-for="(i, index) in getTags(pair)?.normal_tag"
                  :key="index"
                  class="bg-btn flex h-16px tag-btn"
                >
                  <el-image
                    v-tooltip="$t(`${i.tag}`)"
                    class="token-icon-tag cursor-pointer h-100% max-w-16px"
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
              </template> -->
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
              :persistent="false"
              trigger="click"
            >
              <template #reference>
                <a class="w-zu flex-start bg-btn" href="" @click.stop.prevent>
                  <Icon
                    class="text-[--third-text] text-12px"
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
                      :persistent="false"
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
                      :key="themeStore.theme"
                      class="flex-1"
                      size="default"
                      style="
                        height: 30px;
                        min-width: 70px;
                        --el-button-font-weight: 400;
                      "
                      color="var(--border)"
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
                      type="primary"
                      @click.stop="
                        confirmSwitchGroup(selectedGroup)
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
              :persistent="false"
              :width="200"
              trigger="click"
            >
              <template #reference>
                <a class="w-zu flex-start bg-btn" href="" @click.stop.prevent>
                  <Icon
                    class="text-[--third-text] text-12px"
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
                    />
                  </div>
                  <div class="mt-20px flex-center">
                    <el-button
                      :key="themeStore.theme"
                      class="flex-1"
                      size="default"
                      style="
                        height: 30px;
                        min-width: 70px;
                        margin-left: auto;
                        --el-button-font-weight: 400;
                      "
                     color="var(--border)"
                      @click.stop="handleReset()"
                    >
                      {{ $t('cancel') }}
                    </el-button>
                    <el-button
                      class="flex-1"
                      size="default"
                      type="primary"
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
              class="hover:color-[--main-text] leading-12px font-500"
              :href="formatExplorerUrl(token?.chain as string, token?.token as string)"
              target="_blank"
            >
              {{
                token?.token?.replace(new RegExp('(.{4})(.+)(.{4}$)'), '$1...$3')
              }}
            </a>
            <span
              class="media-item bg-btn cursor-pointer"
            >
              <Icon
                v-copy="token?.token"
                name="bxs:copy"
                class="ml-5px clickable"
              />
            </span>
            <span
              v-if="pair"
              v-tooltip.raw="pairTooltipContent"
              class="ml-5px hover:color-[--main-text] leading-12px font-400 mr-8px"
            >
              {{ formatTimeFromNow(pair?.created_at, false, true) }}
              </span>
            <!-- <template v-if="pair && getTags(pair)?.signal_arr?.length > 0">
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
            </template> -->
            <!-- <div
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
                class="text-[--third-text] h-12px w-12px mr-2px"
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
            </div> -->
            <top50 />
            <el-popover width="120px" popper-class="[--el-popover-bg-color:--border] !min-w-[120px]" :persistent="false">
              <template #reference>
                <span
                  class="media-item bg-btn cursor-pointer"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path :fill="devToken?.total_tokens ? '#F6465D' : '#5A5E64'" d="M8.04273 10H1.94948C1.80865 10 1.69463 9.87378 1.69463 9.71787V8.05005H8.29757V9.71914C8.29648 9.87378 8.18246 10 8.04273 10ZM1.69463 7.43178V6.31448C0.714308 6.05962 0 5.07978 0 3.94159C0 2.59556 0.988135 1.50067 2.20322 1.50067C2.44801 1.50067 2.69172 1.54645 2.91975 1.63308C3.22493 0.669309 4.05656 1.3726e-10 4.99999 1.3726e-10C5.94342 -1.10678e-05 6.77507 0.66932 7.08025 1.63308C7.30942 1.54645 7.55198 1.50067 7.79678 1.50067C9.01187 1.50067 10 2.59556 10 3.94159C10 5.07978 9.2857 6.05842 8.30536 6.31448V7.43178H1.69463Z" />
                  </svg>
                  <span class="text-[--main-text] text-10px ml-2px mt-1px">{{devToken?.total_tokens}}</span>
              </span>
              </template>
              <template #default>
                <div class="py-4px [&&]:m--12px flex flex-col">
                  <span class="flex items-center justify-between text-12px py-4px px-8px color-[--third-text]">
                    <span>Dev{{ $t('migrated') }}</span>
                    <span class="text-[--main-text]">{{ devToken.total_migrated }}</span>
                  </span>
                  <span class="flex items-center justify-between text-12px py-4px px-8px color-[--third-text]">
                    <span>Dev{{ $t('totalTokens') }}</span>
                    <span class="text-[--main-text]">{{ devToken.total_tokens }}</span>
                  </span>
                  <div class="flex items-center justify-between text-12px py-4px px-8px color-[--third-text]">
                    <span>{{ $t('migrationRate') }}</span>
                    <span class="text-[--main-text]">
                      {{ devToken?.total_tokens ? ((devToken.total_migrated ?? 0) / devToken.total_tokens * 100).toFixed(2) : 0 }}%
                    </span>
                  </div>
                  <span v-if="tokenStore.tokenInfoExtra?.dev_count" class="flex items-center justify-between clickable text-12px py-4px px-8px color-[--third-text] hover:bg-[--dialog-tab-active]" @click="handleViewDevTokens">
                    <span>{{ $t('viewDevTokens') }}</span>
                  </span>
                </div>
              </template>
            </el-popover>
            <HolderRank
              v-if="tagsRatio?.kol_count"
              :tokenId="address + '-' + chain"
              :type="31"
              :ratio="Number(tagsRatio?.kol_ratio || 0)"
            >
            <div
              class="minor color-text-2 tag-btn signal cursor-pointer mr-4px bg-btn text-10px lh-none"
              :style="{ color: tagsRatio?.kol_count > 0 ? 'var(--yellow)' : 'var(--third-text1)' }"
            >
              <Icon class="iconfont icon-rug mr-2px vertical-middle text-10px" name="custom:kol2" />
              <span>{{ formatNumber(tagsRatio?.kol_count || 0, 2) }}</span>
            </div>
            </HolderRank>
            <HolderRank
              v-if="tagsRatio?.smart_wallet_count"
              :tokenId="address + '-' + chain"
              :type="30"
              :ratio="Number(tagsRatio?.smart_wallet_ratio || 0)"
            >
            <div
              class="minor color-text-2 tag-btn signal cursor-pointer mr-4px bg-btn text-10px lh-none"
              :style="{ color: tagsRatio?.smart_wallet_count > 0 ? 'var(--yellow)' : 'var(--third-text1)' }"
            >
              <Icon class="iconfont icon-rug mr-2px vertical-middle text-10px" name="custom:smart-plain" />
              <span>{{ formatNumber(tagsRatio?.smart_wallet_count || 0, 2) }}</span>
            </div>
            </HolderRank>
          </div>
        </div>
      </div>

      <div class="flex-1" />
      <div
        v-if="(pair?.progress ?? 0) > 0 && (pair?.progress ?? 0) < 100"
        class="item"
      >
        <div class="flex items-center min-w-90px justify-between">
          <span>{{ $t('progress') }}</span
          ><span class="ml-5px">{{ formatNumber(pair?.progress || 0, 2) }}%</span>
          <!-- <Icon
            v-if="pair?.amm === 'unknown'"
            v-tooltip="pair?.amm"
            name="tdesign:help-circle-filled"
            class="ml-5px"
          />
          <a
            v-else
            v-tooltip="
              getSwapInfo(pair?.chain || '', pair?.amm || '')?.show_name ||
              pair?.amm ||
              ''
            "
            :href="pair?.swap_url || '' + pair?.target_token || ''"
            target="_blank"
            class="ml-5px"
          >
            <img
              class="rd-50% h-16px w-16px"
              :src="formatIconSwap(pair?.amm)"
              onerror="this.src='/icon-default.png'"
              height="16"
            >
          </a> -->
        </div>
        <el-progress
          class="mt-10px"
          :percentage="pair?.progress"
          :stroke-width="4"
          color="#1CC982"
          :show-text="false"
          style="width: 90px"
        />
      </div>
      <div class="item ml-24px items-end!">
        <span class="text-20px color-[--main-text1]">
          ${{ showMarket? formatNumber(marketCap, 2) : formatNumber(price || 0, { decimals: 4, limit: 6 }) }}</span
        >
        <span
          class="block mt-4px"
          :class="
            priceChange > 0 ? `color-${upColor[0]}` : `color-${downColor[0]}`
          "
          >{{ priceChange > 0 ? '+' : ''
          }}{{ formatNumber(priceChange, {
            decimals: 2,
            limit: 10,
          }) }}%</span
        >
      </div>
      <div v-if="!showMarket" class="item ml-24px ">
        <span>{{ $t('mcap') }}</span>
        <span class="block mt-8px color-[--main-text1]"
          >${{ formatNumber(marketCap, 2) }}</span
        >
      </div>
      <div v-else class="item ml-24px ">
        <span>{{ $t('price') }}</span>
        <span class="block mt-8px color-[--main-text1]"
          >${{ formatNumber(price || 0, { decimals: 4, limit: 6 }) }}</span
        >
      </div>
      <el-popover popper-style="padding: 0;border-radius: 8px;" width="250" placement="top" :teleported="false" trigger="hover">
        <template #reference>
          <div class="ml-24px cursor-pointer">
            <span class="border-dotted border-0 border-b-1 inline-block leading-none">{{ $t('liquidity3') }}</span>
            <span class="block mt-8px color-[--main-text1]">
              ${{ formatNumber(tokenStore.token?.main_pair_tvl || 0, 1) }}
            </span>
          </div>
        </template>
        <div class="bg-[--secondary-bg]">
          <div
            class="flex p-10px justify-between pb-8px text-12px"
          >
            <span class="text-12px color-[--third-text]">{{ $t('availableLiquidity') }}</span>
            <span class="color-[--main-text]">${{ formatNumber(tokenStore.token?.main_pair_tvl || 0, 1) }}</span>
          </div>
          <!--流动性-->
          <div class="max-h-300px px-10px overflow-auto v-scroller-container">
            <div
              v-for="item in pairs"
              :key="item.pair"
              class="flex justify-between mb-4px cursor-pointer"
              @click.stop="tokenStore.switchPair(item.pair)"
            >
              <div class="flex justify-between">
                <div class="flex items-center">
                  <div class="relative">
                    <Icon v-if="item.amm === 'unknown'" v-tooltip="item.amm" name="tdesign:help-circle-filled" class="mr-5px color-#848E9C text-24px" />
                    <a v-else v-tooltip="item.ammName" :href="item.swap_url + item.target_token" target="_blank" class="inline-flex">
                      <img
                        class="rounded-50% mr-5px h-30px w-30px"
                        :src="formatIconSwap(item.amm)"
                        onerror="this.src='/icon-default.png'"
                      >
                    </a>
                    <img
                      class="rounded-50% absolute right-6px bottom-6px h-10px w-10px"
                      :src="`${token_logo_url}chain/${item.chain}.png`"
                      onerror="this.src='/icon-default.png'"
                    >
                  </div>
                </div>
                <div>
                  <div class="mb-[-5px]">{{item.amm}}</div>
                  <span class="token-address text-[10px] color-[--third-text]">
                    {{ $t('poolPair') }}: {{parseToken(item)?.tokenShow}}
                    <Icon v-copy="parseToken(item)?.token" name="bxs:copy" class="text-2.5 color-[--third-text] clickable" />
                  </span>
                </div>
              </div>
              <div class="flex items-center text-12px">
                <span class="color-[--secondary-text]" v-if="item.target_token === item.token0_address">${{formatNumber(item.reserve1 * item.token1_price_usd * 2 || 0, 2)}}</span>
                <span class="color-[--secondary-text]" v-else>${{formatNumber(item.reserve0 * item.token0_price_usd * 2 || 0, 2)}}</span>
              </div>
            </div>
          </div>
        </div>
      </el-popover>

      <!-- <div v-if="(pair?.progress ?? 0) > 0 && (pair?.progress ?? 0) < 100" class="item ml-24px">
        <span>{{ $t('progress') }}</span>
        <span class="block mt-8px color-[--main-text]"
          >{{ formatNumber(pair?.progress || 0, 2) }}%</span
        >
      </div> -->
      <div class="item ml-24px">
        <span>{{ $t('24Volume') }}</span>
        <span class="block mt-8px color-[--main-text1]"
          >${{ formatNumber(volume24, 2) }}</span
        >
      </div>
      <div class="item ml-24px">
        <span class="border-b border-b-dashed" :class="isNew ? 'cursor-pointer' : ''" @click="openHoler">{{ $t('holders') }}</span>
        <span class="block mt-8px color-[--main-text1]">{{
          formatNumber(token?.holders || 0, { limit: 10 })
        }}</span>
      </div>
      <div v-if="(tokenInfoExtra?.buy_tax??0) > 0 || (tokenInfoExtra?.sell_tax??0) > 0" class="item ml-24px">
        <span v-tooltip="$t('taxTip')" class="border-b border-b-dashed cursor-pointer">{{ $t('totalTax') }}</span>
        <div class="block mt-8px color-[--third-text]">
          <span
            v-if="(tokenInfoExtra?.buy_tax??0) > 0"
            :style="{ color: upColor[0] }"
          >
            {{ formatNumber(tokenInfoExtra?.buy_tax ||0, 1) }}%
          </span>
          <span >/</span>
          <span
            v-if="(tokenInfoExtra?.sell_tax??0) > 0"
            :style="{ color: downColor[0] }"
          >
            {{ formatNumber(tokenInfoExtra?.sell_tax ||0, 1) }}%
          </span>
        </div>

      </div>
      <!-- <div class="item ml-24px">
        <span>DEV</span>
        <span
          class="block mt-8px color-[--main-text1]"
          :style="{
            color:
              Number(token?.dev_balance_ratio_cur || 0) * 100 < 0.1
                ? 'var(--third-text)'
                : (token?.dev_balance_ratio_cur ?? 0) * 100 > 10
                ? '#FFA622'
                : '',
          }"
          >{{
            (token?.dev_balance_ratio_cur ?? 0) > 0 &&
            (token?.dev_balance_ratio_cur ?? 0) * 100 < 0.1
              ? '<0.1'
              : formatNumber((token?.dev_balance_ratio_cur ?? 0) * 100, 2)
          }}%</span
        >
      </div> -->
      <div class="item ml-24px cursor-pointer" @click="showCheck = !showCheck">
        <span class="flex-start">
          {{ $t('audit1') }}
          <Icon
            name="material-symbols:arrow-forward-ios-rounded"
            class="text-12px"
          />
        </span>
        <div class="color-text-1 mt-8px font-500 text-14px flex-start">
          <img
            v-if="
              token?.risk_level == -1 ||
              (token?.risk_score ?? 0) >= 60 ||
              statistics_risk_store > 0
            "
            :width="12"
            class="icon-svg1"
            src="@/assets/images/risk-gaoliang.svg"
          >
          <img
            v-else-if="statistics_warning_store > 0"
            :width="12"
            class="icon-svg1"
            src="@/assets/images/yichang1-gaoliang.svg"
          >
          <img
            v-else-if="
              !statistics_risk_store &&
              !statistics_warning_store &&
              !statistics_unknown_store
            "
            :width="12"
            class="icon-svg1"
            src="@/assets/images/安全.svg"
          >

          <img
            v-else
            class="icon-svg1"
            :width="12"
            src="@/assets/images/zhuyi1.svg"
          >
          <span
            v-if="
              statistics_risk_store ||
              statistics_warning_store ||
              statistics_unknown_store
            "
            class="ml-5px"
            style="font-weight: 600"
            :style="{ color: getRiskColor(token) }"
          >
            {{
              statistics_risk_store ||
              statistics_warning_store ||
              statistics_unknown_store ||
              ''
            }}
          </span>
        </div>
        <Check v-model="showCheck" />
      </div>
      <!-- <div
        v-if="chain === 'solana'"
        class="item ml-24px cursor-pointer"
        @click="showRun = !showRun"
      >
        <span class="flex-start"
          >{{ t('flag_rug_pull') }}
          <Icon
            v-if="
              (rugPull?.rates?.rugged_rate ?? 0) > 0 ||
              (rugPull?.rates?.rugged_rate ?? 0) == -1
            "
            name="material-symbols:arrow-forward-ios-rounded"
            class="text-12px"
          />
        </span>
        <div
          class="mt-8px font-500 flex-start text-12px"
          :style="{
            color:
              (rugPull?.rates?.rugged_rate ?? 0) > 60
                ? '#F6465D'
                : 'var(--third-text)',
          }"
        >
          <Icon name="custom:rug" class="text-12px mr-2px" />
          {{
            rugPull?.rates?.rugged_rate == -1
              ? t('unKnown1')
              : formatNumber(rugPull?.rates?.rugged_rate || 0, 2) + '%'
          }}
        </div>
        <Run v-model="showRun" :obj="rugPull" />
      </div> -->
    </div>
    <div
      v-show="globalStore.showRight"
      class="absolute bg-[--main-list-hover] w-10px h-32px z-1 cursor-pointer flex items-center justify-center top-0px right--11px hover:w-30px hover:right--31px hover:h-36px  transition-all rounded-tr-4px rounded-br-4px color-[--third-text] hover:color-[--main-text]"
      @click="globalStore.$patch({ showRight: false })"
    >
      <Icon name="material-symbols:arrow-forward-ios" class="text-12px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BigNumber from 'bignumber.js'
import Top50 from './top50.vue'
import HolderRank from '@/pages/token/components/right/info/holderRank/index.vue'
// import Run from './run.vue'
import Check from './check.vue'
import DeBox from './deBox.vue'
import XPopup from '~/components/xPopup/index.vue'
import XIcon from '~/components/xPopup/xIcon.vue'
import Collect from '~/components/collect.vue'
import {
  getSymbolDefaultIcon,
  getChainDefaultIcon,
  formatExplorerUrl,
  formatDate,
  formatIconSwap,
  isJSON,
  formatIconTag,
  getAddressAndChainFromId,
  getTagTooltip,
} from '@/utils/index'
import {
  type GetUserFavoriteGroupsResponse,
  getFavoriteCheck,
  addFavorite,
  removeFavorite,
  getUserFavoriteGroups,
  moveFavoriteGroup,
  editTokenFavRemark,
  addFavoriteGroup,
} from '@/api/fav'
import { _getRugPull, _getDevList, type ResultRugPull } from '@/api/run'
import type { Token, Pair } from '@/api/types/token'
import {
  upColor,
  downColor,
  BusEventType,
  type IFavDialogEventArgs,
} from '@/utils/constants'
import { formatNumber } from '@/utils/formatNumber'
import { ElMessage } from 'element-plus'
import { useEventBus } from '@vueuse/core'
import { verifyLogin } from '@/utils'
const { token_logo_url } = useConfigStore()
const tokenStore = useTokenStore()
const globalStore = useGlobalStore()
const {collected} = storeToRefs(useTokenStore())
const { evmAddress } = storeToRefs(useBotStore())
const themeStore = useThemeStore()
const { t } = useI18n()
const route = useRoute()
const { mode, dialogVisible_search, dialogSearchText, showMarket, clickHolderCount, popVisible, tagsRatio, pumpBlackList } = storeToRefs(useGlobalStore())

const editableGroup = shallowRef(false)
const groupId = shallowRef(0)
const selectedGroup = shallowRef(0)
const loadingGroup = shallowRef(false)
const loadingGroupEdit = shallowRef(false)
const userFavoriteGroups = shallowRef<GetUserFavoriteGroupsResponse[]>([])

const editableRemark = shallowRef(false)
const remark = shallowRef('')
const aiSummary = inject<{summary: string, headline: string }>('aiSummary')
const remark2 = shallowRef('')
const showCheck = shallowRef(false)

const rugPull = ref<ResultRugPull>({
  all_tag_rate: 0,
  rates: {
    rugged_rate: 0,
  },
})


const loadingRun = shallowRef(false)
const favDialogEvent = useEventBus<IFavDialogEventArgs>(BusEventType.FAV_DIALOG)
favDialogEvent.on(handleFavDialogEvent)
// 开发者代币
const devToken = shallowRef<any>({total_tokens: 0, total_migrated: 0})
const topEventBus = useEventBus(BusEventType.TOP_FAV_CHANGE)
const topAddGroupEvent = useEventBus(BusEventType.TOP_ADD_GROUP)
const devTokensEvent = useEventBus(BusEventType.DEV_TOKENS_TAB)
const isNew = computed(() => {
  const { chain } = getAddressAndChainFromId(id.value, 0)
  return SupportFullDataChain.includes(chain)
})
function openHoler() {
  clickHolderCount.value++
  if (isNew.value) {
    popVisible.value = true
  }
}
function handleViewDevTokens() {
  devTokensEvent.emit()
  ElMessage.success(t('devTokensDisplayed'))
}
// async function getRugPullList() {
//   const data = {
//     token_id: id.value,
//     pageNO: 1,
//     pageSize: 1,
//   }
//   const res = await _getDevList(data)
//   devToken.value = res
// }

async function getRugPullList() {
  try {
    const data = {
      token_id: id.value,
      pageNO: 1,
      pageSize: 1,
    }

    const res = await _getDevList(data)
    devToken.value = res ?? []
  } catch (err) {
    console.log('-------_getDevList-------', err)
    devToken.value = []
  }
}

const parseToken = (item) => {
  const row = item.target_token === item.token0_address ? item.token1_address : item.token0_address
  if (row) {
    return {
      tokenShow: row.slice(0, 4) + '...' + row.slice(-6),
      token: row,
    }
  }
}

const pairs = computed(() => {
  const list = tokenStore.pairs?.map((i:any) => ({
    ...i,
    ammName: i.amm === 'unknown' ? i.amm : getSwapInfo(i.chain, i.amm)?.show_name || i.amm,
    isUp: i.target_token === i.token0_address ? new BigNumber(i.reserve1).gt(i.init_reserve1) : new BigNumber(i.reserve0).gt(i.init_reserve0),
  })).filter((i) => {
    return true
  })
  // console.log('pairslist=>', list)
  return list
})

watch(
  () => showCheck.value,
  (val) => {
    if (val) {
      useCheckStore().getContractCheckResult(route.params.id as string, walletAddress.value)
    }
  }
)
watch(
  () => route.params.id,
  () => {
    if (route.params.id) {
      getRugPullList()
    }
  }
)

onUnmounted(() => {
  topEventBus.off(handleViewDevTokens)
  favDialogEvent.off(handleFavDialogEvent)
})

function handleFavDialogEvent({ tokenId, type, groupId }: IFavDialogEventArgs) {
  if (type === 'changeFavoriteGroupName' || type === 'removeFavoriteGroup'|| type === 'delete') {
    getTokenUserFavoriteGroups()
  } else if (tokenId === id.value) {
    getTokenFavoriteCheck()
  }
  if (groupId && Number(groupId) === selectedGroup.value) {
    selectedGroup.value = 0
  }
}

function addOrRemoveBlaclList(type: 'ca' | 'dev' | 'keyword'| 'twitter') {
  const item = { token: token.value?.token, medias:medias.value}
  console.log('item', item)
  if (pumpBlackList.value?.length > 499) {
    ElMessage.error(t('blacklistLimit'))
    return
  }
  if (pumpBlackList.value) {
    if (type == 'twitter') {
      const twitter = item?.medias?.filter?.(i => i.icon === 'twitter')?.[0]
      const twitterAccount = formatXUser(twitter?.url)
      if (twitterAccount) {
        const findIndex = pumpBlackList.value?.findIndex(
        (i) => twitterAccount == i.address && i.type == type
        )
        if (findIndex !== -1) {
          pumpBlackList.value.splice(findIndex, 1)
        } else {
          pumpBlackList.value.push({ address: twitterAccount, type: type })
        }
      }
    } else {
      const findIndex = pumpBlackList.value?.findIndex(
        (i) => item.token == i.address && i.type == type
      )
      if (findIndex !== -1) {
        pumpBlackList.value.splice(findIndex, 1)
      } else {
        pumpBlackList.value.push({ address: item.token, type: type })
      }
    }

  } else {
    pumpBlackList.value = [{ address: item.token, type: type }]
  }
}

const walletStore = useWalletStore()
const owner = computed(() => {
  const owner = useCheckStore().checkResult?.owner || token.value?.owner || ''
  return owner
})
const walletAddress = computed(() => {
  return evmAddress.value || walletStore.address
})
const {
  statistics_risk_store,
  statistics_warning_store,
  statistics_unknown_store,
} = storeToRefs(useCheckStore())
// const id = route.params?.id as string
const id = computed(() => route.params.id as string)
const address = computed(() => {
  const { address } = getAddressAndChainFromId(id.value, 0)
  return address
})
const token = computed(() => {
  return tokenStore.token
})
const pair = computed(() => {
  return tokenStore.pair
})


const pairTooltipContent = computed(() => {
  const publish_at = token?.value?.publish_at * 1000
  const migrate_time = globalStore?.migrated?.migrate_time
  if(migrate_time){
    return `${t('migratedToMarket')}: ${formatDate(migrate_time)} <br/>${t('createdAt')}: ${formatDate(publish_at)}`
  }
  return `${t('createdAt')}: ${formatDate(publish_at)}`
})

const price = computed(() => {
  return tokenStore.price
})
const priceChange = computed(() => {
  return tokenStore.priceChangeV2 || 0
})
const marketCap = computed(() => {
  return tokenStore.marketCap || 0
})

const volume24 = computed(() => {
  const isSupportTokenKlineLaunchpad = SupportTokenKlineLaunchpad?.includes?.(
    chain.value + '-' + (tokenStore?.token?.launchpad || '')
  )
  const isTokenKline =
    (SupportTokenKlineChains?.includes?.(chain.value) ||
      isSupportTokenKlineLaunchpad) &&
    'tokenAllPair' in tokenStore &&
    tokenStore?.tokenAllPair &&
    tokenStore?.selectedToken
  if (isTokenKline) {
    const pairs = tokenStore?.pairs || []
    if (pairs?.length > 0) {
      const total_volume_24 = pairs?.reduce((sum, item) => {
        return sum + (item.volume_u || 0)
      }, 0)
      return total_volume_24 || tokenStore.tokenInfoExtra?.volume_24 || 0
    }
    return tokenStore.tokenInfoExtra?.volume_24 || 0
  }
  return tokenStore.pair?.volume_u || tokenStore.tokenInfoExtra?.volume_24 || 0
})
const tokenInfoExtra= computed(()=>{
  return tokenStore.tokenInfoExtra
})
const medias = computed(() => {
  return getMedias(token.value?.appendix)
})
const currentGroup = computed(() => {
  return groupId.value == 0
    ? t('defaultGroup')
    : userFavoriteGroups.value?.find((i) => i.group_id == groupId.value)?.name
})
const chain = computed(() => {
  const { chain } = getAddressAndChainFromId(id.value, 0)
  return chain
})
// const tokenInfo = computed(() => {
//   return tokenStore.tokenInfo || 0
// })
// console.log('-------tokenInfo---------', tokenInfo)
// console.log('-------token---------', token)
onMounted(() => {
  if (walletAddress.value) {
    getTokenFavoriteCheck()
    getTokenUserFavoriteGroups() //获取分组数组
  }
  if (route.params.id) {
    getRugPullList()
  }
  // useCheckStore().getContractCheckResult(id.value, walletAddress.value)
  if (chain.value == 'solana') {
    getRugPull()
  }
})
watch(walletAddress, (val) => {
  if (val) {
    getTokenFavoriteCheck()
    getTokenUserFavoriteGroups() //获取分组数组
  } else {
    collected.value = false
    remark.value = ''
    remark2.value = ''
    groupId.value = 0
    selectedGroup.value = 0
  }
})
watch(
  () => route.params.id,
  () => {
    if (walletAddress.value) {
      getTokenFavoriteCheck()
      getTokenUserFavoriteGroups() //获取分组数组
    }
    // useCheckStore().getContractCheckResult(id.value, evmAddress.value)
    if (chain.value == 'solana') {
      getRugPull()
    }
  }
)
// const collected = shallowRef(false)
const loading = shallowRef(false)

function getTokenFavoriteCheck() {
  getFavoriteCheck(id.value, walletAddress.value)
    .then((res) => {
      collected.value = res?.address ? true : false
      remark.value = res?.remark || ''
      remark2.value = res?.remark || ''
      groupId.value = res?.group_id || 0
      selectedGroup.value = res?.group_id || 0
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {})
}

function newGroupAndCollect(newGroupName:string) {
  addFavoriteGroup(newGroupName, walletAddress.value).then(res=>{
    topAddGroupEvent.emit()
    if(res){
      addTokenFavorite(Number(res))
      userFavoriteGroups.value.push({
        group_id: Number(res),
        name: newGroupName,
      })
    }
  })
}

function addTokenFavorite(groupId?:number) {
  loading.value = true
  addFavorite(id.value, walletAddress.value,groupId || 0)
    .then(() => {
      ElMessage.success(t('collected'))
      getTokenFavoriteCheck()
      topEventBus.emit()
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      loading.value = false
    })
}
function removeTokenFavorite() {
  loading.value = true
  removeFavorite(id.value, walletAddress.value)
    .then(() => {
      ElMessage.success(t('cancelled1'))
      collected.value = false
      topEventBus.emit(-1)
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      loading.value = false
    })
}

async function collect(groupId?:number) {
  if (walletAddress.value) {
    if (walletStore.address) {
      await walletStore.signMessageForFavorite()
    }
    if (collected.value) {
      removeTokenFavorite()
    } else {
      addTokenFavorite(groupId)
    }
  } else {
    verifyLogin()
  }
}
async function getTokenUserFavoriteGroups() {
  try {
    loadingGroup.value = true
    const res = await getUserFavoriteGroups(walletAddress.value)
    userFavoriteGroups.value = (res || []).filter(
      (el) => !!el.name && el.type === 'token'
    )
  } catch (e) {
    console.log('=>(favoriteTable.vue:19) e', e)
  } finally {
    loadingGroup.value = false
  }
}

function confirmSwitchGroup(nextGroupId: number,tokenId= id.value, evmAddress= walletAddress.value) {
  if (!evmAddress) {
    return
  }
  if (groupId.value !== nextGroupId) {
    loadingGroupEdit.value = true
    moveFavoriteGroup(tokenId, nextGroupId, evmAddress)
      .then(() => {
        ElMessage.success(t('success'))
        editableGroup.value = false
        getTokenFavoriteCheck()
        topEventBus.emit()
      })
      .catch((err) => {
        console.log(err)
        ElMessage.error(t('fail'))
      })
      .finally(() => {
        loadingGroupEdit.value = false
      })
  } else {
    loadingGroupEdit.value = false
    editableGroup.value = false
  }
}
function handleReset() {
  if (editableGroup.value) {
    editableGroup.value = false
    selectedGroup.value = groupId.value
  }
  if (editableRemark.value) {
    editableRemark.value = false
    remark2.value = remark.value
  }
}
function confirmEditRemark(tokenId: string, remark2: string) {
  if (!walletAddress.value) {
    verifyLogin()
    return
  }
  if (remark2?.length > 50) {
    return ElMessage.error(t('maximum10characters'))
  }
  editTokenFavRemark(tokenId, remark2, walletAddress.value)
    .then(() => {
      ElMessage.success(t('success'))
      remark.value = remark2
      editableRemark.value = false
      topEventBus.emit()
    })
    .catch((err) => {
      console.log(err)
      ElMessage.error(t('fail'))
    })
    .finally(() => {})
}

function getTags(i: Pair) {
  type Signal = {
    tag: string
    color: string
    n: string
    timestamp: number
  }
  type Normal = {
    tag: string
    color: string
    showText?: boolean
  }
  let signal_arr: Array<Signal> = []
  let normal_tag: Array<Normal> = []
  let normal_str: Array<string> = []
  if (i?.dynamic_tag) {
    const tag_arr = JSON.parse(i?.dynamic_tag) || []
    const signal_str = tag_arr?.filter((i: string) => i?.startsWith('signal'))
    signal_arr = signal_str?.map((y: string) => ({
      tag:
        y?.split('-')[5] &&
        (y?.split('-')[1] == 'whale_sell' || y?.split('-')[1] == 'whale_buy')
          ? `${y?.split('-')[1]}_trump`
          : y?.split('-')[1],
      color: y?.split('-')[2],
      n: y?.split('-')[3],
      timestamp: y?.split('-')[4],
    }))
    signal_arr?.sort((a, b) => b.timestamp - a.timestamp)
    const kol_arr = signal_arr.filter(
      (item, index) =>
        signal_arr.findIndex((el) =>
          new RegExp('^kol_.*$', 'gi').test(el.tag)
        ) == index
    )
    const dev_arr = signal_arr.filter(
      (item, index) =>
        signal_arr.findIndex((el) =>
          new RegExp('^dev_.*$', 'gi').test(el.tag)
        ) == index
    )
    const smarter_arr = signal_arr.filter(
      (item, index) =>
        signal_arr.findIndex((el) =>
          new RegExp('^smarter_.*$', 'gi').test(el?.tag)
        ) == index
    )
    const whale_arr = signal_arr.filter(
      (item, index) =>
        signal_arr.findIndex((el) =>
          new RegExp('^whale_.*$', 'gi').test(el.tag)
        ) == index
    )
    const other_arr = signal_arr?.filter(
      (el) => !new RegExp('^dev_|kol_|smarter_|whale_.*$', 'gi').test(el.tag)
    )
    signal_arr = kol_arr
      ?.concat(dev_arr)
      ?.concat(smarter_arr)
      ?.concat(whale_arr)
      ?.concat(other_arr)
    signal_arr?.sort((a, b) => b.timestamp - a.timestamp)
    normal_str = tag_arr.filter((i: string) => !i?.startsWith('signal'))
  }
  // if (i?.tag) {
  //   const tag = i.tag?.split(',') || []
  //   const tag1 = tag.filter((i) => i !== 'pump' && i !== 'moonshot') || []
  //   normal_str = tag1.concat(normal_str)
  // }
  normal_tag =
    normal_str?.map((i) => ({
      tag: i,
      color: 'green',
      showText: false,
    })) || []
  const is_rug_pull =
    signal_arr?.some((i) => new RegExp('rug_pull', 'gi').test(i?.tag)) ||
    normal_tag?.some((i) => new RegExp('rug_pull', 'gi').test(i?.tag))
  const is_shit_coins =
    signal_arr?.some((i) => new RegExp('shitcoin', 'gi').test(i?.tag)) ||
    normal_tag?.some((i) => new RegExp('shitcoin', 'gi').test(i.tag))
  if ((i?.risk_score ?? 0) >= 100 && i?.chain == 'solana') {
    i.lp_locked_percent = 0
    signal_arr = []
    normal_tag = [
      {
        tag: 'flag_dangerous',
        color: 'red',
        showText: true,
      },
    ]
  } else if (is_rug_pull) {
    i.lp_locked_percent = 0
    signal_arr = []
    normal_tag = [
      {
        tag: 'flag_rug_pull',
        color: 'red',
        showText: true,
      },
    ]
  } else if (is_shit_coins) {
    i.lp_locked_percent = 0
    signal_arr = []
    normal_tag = [
      {
        tag: 'flag_shit_coins',
        color: 'red',
        showText: true,
      },
    ]
  }

  if (token?.value?.tag) {
    const tagti = token?.value?.tag?.split(',') || []
    const tag_t = tagti?.filter((i) => i !== '' && i !== 'newcommunity')
    const tag_t1: Array<Normal> = tag_t?.map((i) => ({
      tag: i,
      color: 'green',
      showText: false,
    }))
    normal_tag = tag_t1.concat(normal_tag)
  }
  const extra_tag = token?.value?.tag?.split(',') || []
  const newcommunity = extra_tag?.includes?.('newcommunity')
  // if(extra_tag?.length >0){
  //   extra_tag = extra_tag?.map(i => ({
  //     tag: i,
  //     color: 'green',
  //     showText: false
  //   }))
  //   if (normal_tag?.length > 0) {
  //     normal_tag = normal_tag?.concat(extra_tag)
  //   } else {
  //     normal_tag = extra_tag
  //   }
  // }
  if (token?.value?.cto_flag == 1 || newcommunity) {
    normal_tag.unshift({
      tag: 'cto_flag',
      color: 'green',
      showText: false,
    })
  }
  return {
    normal_tag,
    signal_arr,
  }
}
function getRiskColor(token?: Token | null) {
  if (
    (token?.risk_level ?? 0) == -1 ||
    (token?.risk_score ?? 0) >= 60 ||
    statistics_risk_store?.value > 0
  ) {
    return '#e74e54'
  } else if (statistics_warning_store ?? 0 > 0) {
    return '#f8be46'
  } else if (
    !statistics_risk_store &&
    !statistics_warning_store &&
    !statistics_unknown_store
  ) {
    return '#81c54e'
  } else {
    return '#507eef'
  }
}

function getRugPull() {
  loadingRun.value = true
  _getRugPull(id.value)
    .then((res) => {
      rugPull.value.dev = res?.dev || ''
      rugPull.value.all_tag_rate = res?.rates?.rateList?.find(
        (i) => i?.icon == 'icon_all_tag_rate'
      )?.rate
      rugPull.value.all_tag_rate =
        Number(rugPull.value.all_tag_rate?.toFixed(1) || 0) || 0
      rugPull.value.rates = res?.rates
      rugPull.value.rateList = res?.rates?.rateList?.filter(
        (i) => i.icon !== 'icon_all_tag_rate'
      )
      rugPull.value.rateList = rugPull.value?.rateList?.map((i) => ({
        ...i,
        rate: Number(i.rate?.toFixed(1) || 0),
      }))
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      loadingRun.value = false
    })
}
function handleNoticeClose() {
  const id = route.params.id as string
  tokenStore.tokenWarningObj[id] = true
}
async function handleSearchTokenName() {
  dialogVisible_search.value = true
  await Promise.resolve()
  dialogSearchText.value = token.value?.symbol || ''

}
</script>

<style scoped lang="scss">
.token-info {
  .token-icon {
    height: 40px;
    width: 40px;
  }
  .icon-symbol {
    width: 20px;
    position: absolute;
    bottom: 3px;
    right: 0px;
  }
}
.bg-btn {
  --uno: bg-[--main-input-button-bg] rounded-2px mr-4px flex items-center
    justify-center h-16px min-w-16px p-2px;
}
.item {
  display: flex;
  flex-direction: column;
}
.pump-item_item {
  position: relative;
  &:hover {
    .black-container {
      color: #959a9f;
      visibility: visible;
    }
  }
  .black-container {
    position: absolute;
    visibility: hidden;
    left: -8px;
    top: -4px;
    color: var(--d-666-l-999);
    z-index: 1;
  }
}

@media screen and (max-width: 1080px) {
  .tokenName1{
    display: none;
  }
  .tokenName2{
    cursor: pointer;
    display: inline-block;
    max-width: 100px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
@media screen and (min-width: 1081px) {
  .tokenName1{
    display: inline-block;
  }
  .tokenName2{
    display: none;
  }
}
</style>
