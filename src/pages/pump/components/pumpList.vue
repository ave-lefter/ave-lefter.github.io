<template>
  <div class="mt-10px mb-10px relative">
    <ul  v-bind="containerProps" class="pump-item_list scroller-container"  :style="{height: scrollHeight}" @scroll="handleScroll">
      <div v-bind="wrapperProps">
          <li
            v-for="({data: row}, $index) in list"
            :id="row?.target_token + '-' + row?.chain"
            :key="row?.pair + '-' + row?.chain"
            class="pump-item_item relative item-row"
            :style="{ background:  pumpSetting.bgList?.includes(row.platform)? pumpSetting?.bg?.[row.platform]?.bg : '' }"
            @click.stop="tableRowClick(row)"
            @contextmenu="handleContextMenu($event, row)"
            @mouseenter="() => currentRow = row "
            @mouseleave="currentRow = null"
          >
            <div class="w-full relative" :class="getAnimClass(row)">
              <div class="flex-start items-start relative">
                <div class="mr-12px relative top-4px">
                  <!-- <div class="flex items-center px-4px py-2px bg-[--secondary-bg] absolute z-2 right--2px top--7px !rounded-4px border border-1 border-solid border-[--border] color-[--secondary-text] text-9px">
                      <Icon class="text-9px mr-2px" name="ix:image" />44
                  </div> -->
                  <div class="black-container">
                    <span
                      v-tooltip="pumpBlackList?.findIndex(i => (i.address == row.token && i.type == 'ca') || (i.address == row.symbol && i.type == 'keyword')) !== -1 ? $t('cancel') + $t('BlackListToken') : $t('BlackListToken')"
                      class="bg-[--d-000-l-FFF] cursor-pointer px-2px py-2px color-[--third-text1] block rounded-2px hover:color-[--primary-color] w-16px h-16px flex items-center justify-center"
                    >
                      <Icon
                        v-if="
                          pumpBlackList?.findIndex(
                            (i) =>
                              (i.address == row.token && i.type == 'ca') ||
                              (i.address == row.symbol && i.type == 'keyword')
                          ) !== -1
                        "
                        name="custom:key-invisible"
                        class="text-12px color-[#F6465D]"
                        @click.stop="addOrRemoveBlaclList(row, 'ca')"
                      />
                      <Icon
                        v-else
                        name="custom:key-invisible"
                        class="text-12px"
                        @click.stop="addOrRemoveBlaclList(row, 'ca')"
                      />
                    </span>
                    <span
                      v-tooltip="pumpBlackList?.findIndex(i => i.address == row.token && i.type == 'dev') !== -1 ? $t('cancel') + $t('BlackListDev') : $t('BlackListDev')"
                      class="bg-[--d-000-l-FFF] cursor-pointer px-2px py-2px color-[--third-text1] block rounded-2px mt-4px hover:color-[--primary-color] w-16px h-16px flex items-center justify-center"
                    >
                      <Icon
                        v-if="
                          pumpBlackList?.findIndex(
                            (i) => i.address == row.token && i.type == 'dev'
                          ) !== -1
                        "
                        name="custom:invisible"
                        class="text-12px color-[#F6465D]"
                        @click.stop="addOrRemoveBlaclList(row, 'dev')"
                      />
                      <Icon
                        v-else
                        name="custom:dev-invisible"
                        class="text-12px"
                        @click.stop="addOrRemoveBlaclList(row, 'dev')"
                      />
                    </span>
                    <span
                      v-if="hasTwitterXUser(row?.medias)"
                      v-tooltip="pumpBlackList?.findIndex(i => i.address == row.token && i.type == 'twitter') !== -1 ? $t('cancel') + $t('BlackListTwitter') : $t('BlackListTwitter')"
                      class="bg-[--d-000-l-FFF] cursor-pointer px-2px py-2px color-[--third-text1] block rounded-2px mt-4px hover:color-[--primary-color] w-16px h-16px flex items-center justify-center"
                    >
                      <Icon
                        v-if="
                          pumpBlackList?.findIndex(
                            (i) => i.address == row.token && i.type == 'twitter'
                          ) !== -1
                        "
                        name="custom:twitter-unvisible"
                        class="text-12px color-[#F6465D]"
                        @click.stop="addOrRemoveBlaclList(row, 'twitter')"
                      />
                      <Icon
                        v-else
                        name="custom:twitter-unvisible"
                        class="text-12px"
                        @click.stop="addOrRemoveBlaclList(row, 'twitter')"
                      />
                    </span>
                  </div>
                  <div class="token-logo">
                    <el-image
                      v-memo="row.target_token + '-' + row.chain+'-' + (row.logo_url || '')"
                      class="token-icon"
                      :class="{ small: pumpSetting.Progress_isCircle == 'horizontal' }"
                      fit="cover"
                      :src="srcMap[row.target_token + '-' + row.chain] || getSymbolDefaultIcon(row, pumpSetting.avatar_isCircle == 'circle' ? 'circle' : 'rect')"
                      :style="{
                        'border-radius': pumpSetting.avatar_isCircle == 'circle' ? '100%' : '4px'
                      }"
                    >
                      <template #error>
                        <img
                          class="token-icon h-32px text-16px color-#fff"
                          :style="{
                            'border-radius': pumpSetting.avatar_isCircle == 'circle' ? '100%' : '0',
                          }"
                          :src="getChainDefaultIcon(row.chain, row.symbol, pumpSetting.avatar_isCircle == 'circle' ? 'circle' : 'rect')"
                        >
                      </template>
                      <template #placeholder>
                        <img
                          class="token-icon h-32px text-16px color-#fff"
                          :style="{
                            'border-radius': pumpSetting.avatar_isCircle == 'circle' ? '100%' : '0',
                          }"
                          :src="srcMap[row.target_token + '-' + row.chain] || getChainDefaultIcon(row.chain, row.symbol, pumpSetting.avatar_isCircle == 'circle' ? 'circle' : 'rect')"
                        >
                      </template>
                    </el-image>
                    <Progress
                      class="token-progress"
                      :color="getPumpColor(row.issue_platform)"
                      :class="pumpSetting.Progress_isCircle == 'horizontal' ? 'horizontal' : 'circle'"
                      :progress="row.progress"
                    />
                    <a
                      :href="`https://lens.google.com/uploadbyurl?url=${encodeURIComponent(
                        getSymbolDefaultIcon(row)
                      )}`"
                      target="_blank"
                      class="token-mark clickable"
                      :style="{
                        'border-radius': pumpSetting.avatar_isCircle == 'circle' ? '100%' : '4px',
                      }"
                    @mouseover.stop="onEnter($event, row, props.type, getDataColor)"
                      @click.stop
                    >
                      <Icon class="text-16px text-#fff" name="custom:search" />
                    </a>
                    <div v-if="!isOut" class="bg-btn bg-[--secondary-bg] absolute bottom--8px left--10px !rounded-4px border border-1 border-solid border-[--border] color-[--yellow] text-9px">
                      {{(row?.progress || 0).toFixed(0)}}%
                    </div>
                    <el-image
                      v-if="row.issue_platform"
                      v-tooltip="row.issue_platform"
                      class="mr-5px rounded-100% bg-[--d-151A22-l-E8F1FF] chain border border-[#55D592] border-solid border-[1px]"
                      :style="{
                        'border-color': getPumpColor(row.issue_platform),
                      }"
                      style="
                        position: absolute;
                        width: 18px;
                        height: 18px;
                        bottom: -7px;
                        right: -10px;
                      "
                      :src="formatIconTag(row.issue_platform)"
                    />
                  </div>
                  <div
                    class="color-[--third-text1] text-12px hover:color-[--main-text1]"
                    @click.stop="clickToken(row.token, row.chain)"
                    :class="pumpSetting.Progress_isCircle == 'horizontal' ? 'mt-25px' : 'mt-15px'">
                    {{row.token?.slice(0, 4) + '...' + row.token?.slice(-4)}}
                  </div>
                </div>
                <div class="flex flex-col self-stretch relative h-98px">
                  <div class="flex-start">
                    <span v-tooltip="row.symbol" v-copy="row.token" class="text-16px font-500 mr-5px symbol-ellipsis ellipsis-auto block color-[--d-F2F2F2-l-000]">{{
                      row.symbol
                    }}</span>
                    <span
                      v-if="pumpSetting?.define?.some((i) => i === 'name')"
                      v-tooltip="row.name"
                      v-copy="row.name"
                      class="name text-12px font-500 mr-5px color-[--third-text1] symbol-ellipsis ellipsis-auto block"
                      >{{ row.name }}</span>
                      <RemarkEditor :token="row.token" :chain="row.chain" :remark="row.remark" @update:remark="row.remark = $event" />
                      <img
                        v-if="row.is_cloned"
                        @mouseover.stop="onEnter($event, row, props.type,getDataColor, true)"
                        @click.stop
                        class="rounded-100% mr-5px cursor-pointer"
                        :src="formatIconTag('j7tracker.com')"
                        alt=""
                        :width="12"
                      >
                      <img
                        v-if="row.is_pump_agent"
                        v-tooltip="$t('agentToken')"
                        class="rounded-100% mr-5px cursor-pointer"
                        :src="formatIconTag('pumpt_agent')"
                        alt=""
                        :width="12"
                      >
                    <span
                      v-if="Number(row.buy_tax) && Number(row.sell_tax)"
                    >
                      <span
                        v-if="Number(row.buy_tax) == Number(row.sell_tax)"
                        class="bg-[--d-1E2025-l-E8F1FF] rounded-4px px-2px text-10px"
                        :style="{
                              color:(Number(row?.sell_tax) > 5 ? '#F6465D' : 'var(--secondary-text1)'),
                          }"
                      >
                        {{ $t('tax') }} {{ formatNumber(row?.sell_tax || 0, 2) }}%
                      </span>
                      <span
                        v-else
                        class="bg-[--d-1E2025-l-E8F1FF] rounded-4px px-2px text-10px"
                          :style="{
                              color: (Number(row?.sell_tax) > 5 || Number(row?.buy_tax) > 5  ? '#F6465D' :'var(--secondary-text1)'),
                          }"
                      >
                      B {{ formatNumber(row?.buy_tax || 0, 2) }}%&nbsp;&nbsp;S {{ formatNumber(row?.sell_tax || 0, 2) }}%
                      </span>
                    </span>
                    <span
                      v-else-if="Number(row.buy_tax)"
                      class="bg-[--d-1E2025-l-E8F1FF] rounded-4px px-2px text-10px"
                      :style="{
                            color:(Number(row?.buy_tax) > 5 ? '#F6465D' : 'var(--secondary-text1)'),
                        }"
                    >
                      B {{ formatNumber(row?.buy_tax || 0, 2) }}%
                    </span>
                    <span
                      v-else-if="Number(row.sell_tax)"
                      class="bg-[--d-1E2025-l-E8F1FF] rounded-4px text-10px"
                        :style="{
                            color:(Number(row?.sell_tax) > 5 ? '#F6465D' : 'var(--secondary-text1)'),
                        }"
                    >
                      S {{ formatNumber(row?.sell_tax || 0, 2) }}%
                    </span>
                  </div>
                  <div v-if="(lang === 'zh-cn' || lang === 'zh-tw') && (row.symbol_zh || row.name_zh) && row.symbol_zh !== row.symbol || (!(lang === 'zh-cn' || lang === 'zh-tw')) && (row.symbol_en || row.name_en) && row.symbol_en !== row.symbol" class="flex-start text-11px line-height-14px mt-2px color-[--yellow] whitespace-nowrap overflow-hidden">
                    <template v-if="lang === 'zh-cn' || lang === 'zh-tw'">
                      {{ row.symbol_zh || '' }}&nbsp;&nbsp;{{ row.name_zh || '' }}
                    </template>
                    <template v-else>
                      {{ row.symbol_en || '' }}&nbsp;&nbsp;{{ row.name_en || '' }}
                    </template>
                  </div>
                  <div class="flex-start text-12px mt-2px">
                      <div
                        v-tooltip="formatDate(row?.created_at || row?.time)"
                        class="time mr-8px"
                        :style="{
                          color:
                            Number(formatTimeFromNow(row?.created_at || row?.time, true)) <= 600
                              ? '#FFA622'
                              : '#12B886',
                        }"
                      >
                          <TimerCount
                            v-if="row?.created_at || row?.time"
                            :key="row.pair + '-' + row.chain"
                            :timestamp="Number(row.created_at || row.time || 0)"
                            :end-time="60"
                            mode="count-up"
                          >
                            <template #default="{ seconds }">
                              <span>
                                <span v-if="seconds < 60"  class="color-#FFA622">
                                  {{ seconds }}s
                                </span>
                                <template v-else>
                                  {{ formatTimeFromNow(row.created_at || row.time) }}
                                </template>
                              </span>
                            </template>
                          </TimerCount>

                          <template v-else>
                            -
                          </template>
                      </div>
                      <img
                        v-if="row.baseToken"
                          v-tooltip="{
                          content:getLiqTooltip(row),
                          props: { 'raw-content': true, 'popper-class': 'pump-tooltip' }
                        }"
                        class="rounded-100% cursor-pointer mr-8px"
                        :src="row.baseToken?.logo_url ? `${configStore.token_logo_url}${row.baseToken?.logo_url}` : qsImage"
                        alt=""
                        :width="12"
                        style="border-radius: 100%"
                      >
                      <!-- <a
                      v-if="
                        summaryList(
                          lang == 'zh-cn' || lang == 'zh-tw'
                            ? row?.headline_cn || ''
                            : row?.headline_en || ''
                        )?.length
                      "
                      v-tooltip="{
                        content: {
                          is: AiPop,
                          props: {
                            summary: lang == 'zh-cn' || lang == 'zh-tw'
                            ? row?.headline_cn || ''
                              : row?.headline_en || '',
                            score: row.summary_score
                          }
                        },
                        props: {
                          placement: 'bottom',
                          trigger: 'hover',
                          'popper-class': 'new-popover',
                        }
                      }"
                      class="media-item clickable mr-5px"
                    >
                      <Icon name="custom:ai2" class="text-12px color-[--primary-color]" />
                    </a> -->

                    <AiPop
                      v-if="
                        summaryList(
                          lang == 'zh-cn' || lang == 'zh-tw'
                            ? row?.headline_cn || ''
                            : row?.headline_en || ''
                        )?.length
                      "
                      :summary="lang == 'zh-cn' || lang == 'zh-tw'? row?.headline_cn || '': row?.headline_en || ''"
                      :score="row.summary_score"
                    >
                      <Icon name="custom:ai2" class="text-12px color-[--primary-color] clickable mr-5px" />
                  </AiPop>
                    <div
                      v-if="
                        row?.medias?.length > 0 && pumpSetting?.define?.some((i) => i === 'media')
                      "
                      class="flex text-12px items-center"
                    >
                      <div v-for="(item, index) in row?.medias" :key="index" class="flex ">
                        <template v-if="item.url">
                          <Icon
                            v-if="item.name === 'QQ'" v-tooltip="item.url"
                            :name="`custom-media:${item.icon}`"
                            class="text-[--third-text1] h-12px leading-12px mr-8px"
                          />
                          <!-- <span v-if="item.name === 'QQ'" v-tooltip="item.url" class="mr-8px h-12px leading-12px">
                          </span> -->
                          <XPopup
                            v-else-if="item.icon === 'twitter'"
                            :tokenId="(row.token + '-' + row.chain)"
                            :type="row.twitter_type"
                          >
                            <a
                              :href="item.url"
                              target="_blank"
                              class="mr-8px h-12px block leading-12px"
                              @click.stop
                            >
                              <XIcon
                                v-if="[1, 2, 3].includes(row.twitter_type)"
                                :type="row.twitter_type"
                                class="text-12px"
                              />
                              <Icon
                                v-else
                                :name="`custom-media:${item.icon}`"
                                class="text-[--third-text1] text-12px"
                              />
                            </a>
                          </XPopup>
                          <a
                            v-else
                            v-tooltip="item.url"
                            :href="item.url"
                            target="_blank"
                            class="h-12px mr-8px block leading-12px"
                            @click.stop
                          >
                            <Icon
                              v-if="item.icon === 'tiktok'"
                              :name="`custom-media:${isDark?'tiktok1':'tiktok2'}`"
                              :class="`h-12px`"
                            />
                            <Icon
                              v-else
                              :name="`custom-media:${item.icon}`"
                              :class="`h-12px ${
                                (item.icon === 'github') ? 'text-[--github-color]' : 'text-[--third-text1]'}`"
                            />
                          </a>
                        </template>
                      </div>
                    </div>
                  <Icon v-if="row.is_cashback" name="custom:cashback" class="text-12px color-[--yellow] clickable mr-5px hover:!color-[--primary-color]" v-tooltip="$t('cashback')"/>
                  <PumpLive v-if="row?.is_streaming" class="mr-4px" :tokenId="(row.token + '-' + row.chain)" />

                    <a
                      :ref="(el: any) => $refs.currentBtnRef[$index] = el"
                      class="media-item h-12px block leading-12px"
                      target="_blank"
                      @mouseenter="showPopoverSearch(row, $index)"
                      @mouseleave="showPopSearch = false"
                      @click.stop.prevent
                    >
                      <Icon class="text-[--third-text1] h-12px w-12px mr-8px" name="custom:search" />
                    </a>
                    <div
                      v-show="pumpSetting?.define?.some((i) => i === 'holder')"
                      v-tooltip.raw="{
                        content: `<div class='max-w-[400px] color-[--secondary-text]'>${$t('holders')}: <span class=${ 'color-'+getDataColor('holders',row.holders)}>${formatNumber(row?.holders || 0, 2)}</span> </div>`,
                        props: {
                          placement: 'top-start',
                        },
                      }"
                      class="flex mr-8px items-center"
                    >
                      <Icon
                        class="iconfont icon-rug mr-4px text-12px vertical-middle color-[--third-text1]"
                        name="custom:holders"
                      />
                      <span v-if="Number(row?.holders) === 0 || row?.holders == null" class="color-[--third-text1]" >0</span>
                      <span v-else class="color-[--main-text1]" :style="{ color: getDataColor('holders',row.holders) }">
                        {{ formatNumber(row?.holders || 0, 2) }}
                      </span>
                    </div>
                    <HolderRank
                      v-if="route.name === 'index' && row?.favorite_holder_count> 0"
                      :tokenId="(row?.token || row?.target_token) + '-' + row?.chain"
                      :baseInfo="{
                        symbol: row.symbol,
                        logo_url: row.logo_url || ''
                      }"
                      :type="-100"
                      :ratio="Number(0)"
                    >
                      <div
                        class="flex mr-8px items-center"
                        :style="{color: row?.favorite_holder_count> 0 ?'var(--yellow)' : 'var(--third-text1)'}"
                      >
                        <Icon
                          class="iconfont icon-rug text-10px vertical-middle"
                          name="custom:fav"
                        />
                      </div>
                    </HolderRank>
                    <div
                      v-show="pumpSetting?.define?.some((i) => i === 'markers')"
                      v-tooltip.raw="{
                        content: `<div class='max-w-[400px] color-[--secondary-text]'>${$t('markersBuy')}/${$t('markersSell')}: <span class='color-#12B886'>${formatNumber(row?.buyers_24h || 0, 2)}</span><span class='color-[--third-text1]'>/</span><span class='color-#F6465D'>${formatNumber(row?.sellers_24h || 0, 2)}</span></div>`,
                        props: {
                          placement: 'top-start',
                        },
                      }"
                      class="flex mr-8px items-center"
                    >
                      <Icon
                        class="iconfont icon-rug mr-4px text-12px vertical-middle color-[--third-text1] hover:color-#3F80F7"
                        name="custom:wallets"
                      />
                      <span v-if="Number(row?.makers_24h) === 0 || row?.makers_24h == null" class="color-[--third-text1]" >0</span>
                      <span v-else class="color-[--main-text1]">{{
                        formatNumber(row?.makers_24h || 0, 2)
                      }}</span>
                    </div>
                    <HolderRank
                    v-if="route.name === 'index' && pumpSetting?.define?.some((i) => i === 'kol')"
                    class="flex mr-8px"
                    :tokenId="(row?.token || row?.target_token) + '-' + row?.chain"
                    :baseInfo="{
                      symbol: row.symbol,
                      logo_url: row.logo_url || ''
                    }"
                    :type="31"
                    :ratio="Number(row?.kol_ratio || 0)"
                    >
                      <div class="flex items-center">
                        <Icon
                          class="iconfont icon-rug mr-4px text-10px vertical-middle color-[--third-text1]"
                          name="custom:kol2"
                          :style="{color: row?.kol_tag_count> 0 ?'var(--yellow)' : 'var(--third-text1)'}"
                        />
                        <span v-if="Number(row?.kol_tag_count) === 0 || row?.kol_tag_count == null" class="color-[--third-text1]" >0</span>
                        <span v-else class="color-[--main-text1]">
                          {{ formatNumber(row?.kol_tag_count || 0, 2) }}</span>
                      </div>
                    </HolderRank>
                    <HolderRank
                      v-if="route.name === 'index' && pumpSetting?.define?.some((i) => i === 'smart')"
                      class="flex mr-8px"
                      :tokenId="(row?.token || row?.target_token) + '-' + row?.chain"
                      :baseInfo="{
                        symbol: row.symbol,
                        logo_url: row.logo_url || ''
                      }"
                      :type="30"
                      :ratio="Number(row?.smart_wallet_ratio || 0)"
                      >
                      <div class="flex items-center color-[--third-text1]">
                          <Icon
                            class="iconfont icon-rug mr-4px text-10px vertical-middle "
                            name="custom:smart-plain"
                            :style="{color: Number(formatNumber(row?.smart_wallet_tag_count || 0, 2) || 0) > 0 ?'var(--yellow)' : 'var(--third-text1)'}"
                          />
                          <span v-if="Number(row?.smart_wallet_tag_count) === 0 || row?.smart_wallet_tag_count == null" class="color-[--third-text1]" >0</span>
                          <span v-else class="color-[--main-text1]">{{ formatNumber(row?.smart_wallet_tag_count || 0, 2) }}</span>
                        </div>
                    </HolderRank>
                    <div
                      v-tooltip="{
                        content:
                          `<div style='color:var(--secondary-text)'>${$t('devMigrated')} <span style='color:var(--main-text)'>${formatNumber(row?.dev_migrated_count || 0, 0)}</span></div>
                          <div style='color:var(--secondary-text)'>${$t('devLaunched')} <span style='color:var(--up-color)'>${formatNumber(row?.dev_total_count || 0, 0)}</span></div>
                          <div style='color:var(--secondary-text)'>${$t('migratedRatio')} <span style='color:var(--down-color)'>${formatNumber(row?.dev_migrated_ratio || 0, 2)}%</span></div>
                          `,
                        props: { 'raw-content': true, 'popper-class': 'pump-tooltip' }
                      }"
                      class="flex mr-8px items-center">

                      <Icon
                        class="iconfont icon-rug mr-4px text-10px vertical-middle "
                        name="custom:top2"
                        :style="{color: Number(row?.dev_migrated_count || 0)> 0 ?'var(--yellow)' : 'var(--third-text1)'}"
                      />
                      <span v-if="(Number(row?.dev_migrated_count) == 0 || row?.dev_migrated_count == null) && (Number(row?.dev_total_count) == 0 || row?.dev_total_count == null) " class="color-[--third-text1]" >0</span>
                      <span v-else class="color-[--main-text1]" >{{
                        formatNumber(row?.dev_migrated_count || 0, 2)}}/{{formatNumber(row?.dev_total_count || 0, 2)}}
                      </span>
                    </div>
                    <!-- <HolderRank
                      v-if="route.name === 'index'"
                      class="flex mr-8px bg-btn"
                      :tokenId="(row?.token || row?.target_token) + '-' + row?.chain"
                      type="rank"
                      >
                        <div class="flex items-center">
                          <Icon
                            class="iconfont icon-rug mr-4px text-10px vertical-middle "
                            name="custom:holder-rank"
                            :style="{color: Number(row?.co_holders_count || 0)> 0 ?'var(--yellow)' : 'var(--third-text1)'}"
                          />
                          <span v-if="(Number(row?.co_holders_count) == 0 || row?.co_holders_count == null) && (Number(row?.co_holders_count) == 0 || row?.co_holders_count == null) " class="color-[--third-text1]" >0</span>
                          <span v-else class="color-[--main-text1]" >{{
                            formatNumber(row?.co_holders_count || 0, 2)}}
                          </span>
                        </div>
                    </HolderRank> -->
                  </div>
                  <div class="mt-2px text-11px"  v-if="row?.medias?.some(i=> i.icon === 'twitter') && route.name === 'index'">
                    <div class="flex-start items-center" v-for="(item, index) in row?.medias?.filter(i => i.icon === 'twitter')" :key="index">
                      <PumpPop
                          v-if="row?.medias?.some(i=> i.icon === 'twitter') && route.name === 'index'"
                          :tokenId="(row.token + '-' + row.chain)"
                          :type="2"
                        >
                        <a :href="item.url" target="_blank" class="!color-#009EF7" @click.stop>
                          {{ formatXUser(item?.url) }}
                        </a>
                      </PumpPop>
                      <template v-if="formatXUser(item?.url)">
                        <div v-if="row?.followers" class=" ml-8px color-[--third-text1] flex-start leading-10px cursor-pointer" v-tooltip="$t('followers')">
                            <Icon
                              class="iconfont icon-rug mr-4px text-10px"
                              name="custom:followers"
                            />{{ formatNumber(row?.followers || 0, {decimals: 2, l: 4, limit: 3, locale: 'en'}) }}
                        </div>
                        <!-- <div v-if="row?.following" class="color-[--x-blue] ml-8px flex-start leading-10px cursor-pointer" v-tooltip="$t('following')">
                          <Icon
                            class="iconfont icon-rug mr-4px text-10px"
                            name="custom:following"
                          />{{ formatNumber(row?.following || 0, {decimals: 2, l: 4, limit: 3, locale: 'en'}) }}
                        </div> -->
                      </template>
                    </div>
                  </div>
                  <div class="flex-start text-12px absolute bottom-0"
                  :class=" ((lang === 'zh-cn' || lang === 'zh-tw') && (row.symbol_zh || row.name_zh) && row.symbol_zh !== row.symbol || (!(lang === 'zh-cn' || lang === 'zh-tw')) && (row.symbol_en || row.name_en) && row.symbol_en !== row.symbol) && hasTwitterXUser(row.medias)? '' : 'absolute bottom-0px'"
                  >
                    <div
                      v-show="pumpSetting?.define?.some((i) => i === 'top')"
                      class="flex-start mr-8px bg-btn"
                      :style="{
                          background:Number(formatNumber(row?.holders_top10_ratio || 0, 1))==0? '': (Number(row?.holders_top10_ratio) > 30 ? '#f6465d1a' : '#12b8861a'),
                          color:Number(formatNumber(row?.holders_top10_ratio || 0, 1))==0? 'var(--third-text1)': (Number(row?.holders_top10_ratio) > 30 ? '#F6465D' : '#12B886'),
                      }"
                      @mouseover.stop="(e) => showBubbleTooltip(row, e)"
                    >
                      <Icon
                        class="iconfont icon-TOP text-10px mr-4px"
                        name="custom:top3"
                      />
                      <span
                        >{{
                         ((Number(row?.holders_top10_ratio || 0)<0.01)&&(Number(row?.holders_top10_ratio || 0)>0))? '<0.01':formatNumber(row?.holders_top10_ratio || 0, 1)
                        }}%</span
                      >
                    </div>
                    <DevPop
                      v-if="route.name === 'index'&& pumpSetting?.define?.some((i) => i === 'dev')"
                      class="flex mr-8px bg-btn"
                      :style="{
                        background: Number(formatNumber(row?.dev_balance_ratio_cur || 0, 1)) == 0 ? '' : (Number(row?.dev_balance_ratio_cur) > 5 ? '#f6465d1a' : '#12b8861a'),
                        color:Number(formatNumber(row?.dev_balance_ratio_cur || 0, 1))==0? 'var(--third-text1)': (Number(row?.dev_balance_ratio_cur) > 5 ? '#F6465D' : '#12B886')
                      }"
                      :tokenId="(row?.token || row?.target_token) + '-' + row?.chain">
                      <template v-if="row?.max_dev_ratio !==null && row?.max_dev_ratio !== undefined && Number(row?.max_dev_ratio)!== 0 && Number(row?.dev_balance_ratio_cur)== 0">
                        <Icon
                          class="iconfont icon-TOP text-10px mr-4px color-[--x-blue]"
                          name="custom:dev-ds"
                        />
                        <span class="color-[--x-blue]">DS</span>
                      </template>
                      <template v-else>
                        <Icon
                          class="iconfont icon-TOP text-10px mr-4px"
                          name="custom:dev-ds"
                        />
                        <span
                          >{{ Number(row?.dev_balance_ratio_cur) >= 0.1 ? formatNumber(row?.dev_balance_ratio_cur ,1) : (Number(row?.dev_balance_ratio_cur) == 0  ? '0':'<0.1')}}%
                        </span>
                      </template>
                      <img
                        v-if="row.dev_first_transfer_in_from_label"
                        class="w-12px h-12px cursor-pointer rounded-full ml-4px"
                        :src="formatIconPumpDev(row.dev_first_transfer_in_from_label)"
                        alt=""
                      >
                      <span v-if="row?.dev_age_seconds" class="ml-4px color-[--main-text1]">{{ formatSeconds(Number(row?.dev_age_seconds || 0)) }}</span>
                     </DevPop>
                    <!-- </div> -->
                    <div
                      v-show="pumpSetting?.define?.some((i) => i === 'sniper')"
                      v-tooltip="$t('sniper2')"
                      class="flex mr-8px bg-btn"
                      :style="{
                        color: Number(formatNumber(row?.sniper_balance_ratio_cur || 0, 1))==0? 'var(--third-text1)' : (Number(row?.sniper_balance_ratio_cur) > 5 ? '#F6465D' : '#12B886'),
                        background: Number(formatNumber(row?.sniper_balance_ratio_cur || 0, 1))==0? '' : (Number(row?.sniper_balance_ratio_cur) > 5 ? '#f6465d1a' : '#12b8861a'),
                      }"
                    >
                      <Icon class="iconfont icon-gun text-10px mr-4px" name="custom:gun1" />
                      <span>{{
                        formatNumber(
                          Number(row?.sniper_balance_ratio_cur) > 0.001 ? row?.sniper_balance_ratio_cur || 0 : 0,
                          1
                        )
                      }}%</span>
                    </div>
                    <div
                      v-show="pumpSetting?.define?.some((i) => i === 'insider')"
                      v-tooltip="$t('insider_balance_ratio_cur_tips')"
                      class="flex mr-8px bg-btn"
                      :style="{
                        color: Number(formatNumber(row?.insider_balance_ratio_cur || 0, 1))==0? 'var(--third-text1)' : (Number(row?.insider_balance_ratio_cur) > 5 ? '#F6465D' : '#12B886'),
                        background: Number(formatNumber(row?.insider_balance_ratio_cur || 0, 1))==0? '' : (Number(row?.insider_balance_ratio_cur) > 5 ? '#f6465d1a' : '#12b8861a'),
                      }"
                    >
                      <Icon
                        class="iconfont icon-laoshucang text-10px mr-4px"
                        name="custom:insider1"
                      />
                      <span
                        >{{
                          formatNumber(
                            Number(row?.insider_balance_ratio_cur) > 0.001
                              ? row?.insider_balance_ratio_cur || 0
                              : 0,
                            1
                          )
                        }}%</span
                      >
                    </div>
                    <div
                      v-tooltip="$t('phishing1')"
                      class="flex mr-8px bg-btn"
                      :style="{
                        color: Number(formatNumber(row?.phishing_ratio || 0, 1))==0? 'var(--third-text1)' : (Number(row?.phishing_ratio) > 5 ? '#F6465D' : '#12B886'),
                        background: Number(formatNumber(row?.phishing_ratio || 0, 1))==0? '' : (Number(row?.phishing_ratio) > 5 ? '#f6465d1a' : '#12b8861a'),
                      }"
                    >
                      <Icon class="iconfont icon-fish text-12px mr-4px" name="custom:fish"/>
                      <span>{{
                        formatNumber(
                          Number(row?.phishing_ratio) > 0.001 ? row?.phishing_ratio || 0 : 0,
                          1
                        )
                      }}%</span>
                    </div>

                    <div
                      v-tooltip="$t('Bundle')"
                      :style="{
                        color: Number(formatNumber(row?.address_binding_ratio || 0, 1))==0? 'var(--third-text1)' : (Number(row?.address_binding_ratio) > 5 ? '#F6465D' : '#12B886'),
                        background: Number(formatNumber(row?.address_binding_ratio || 0, 1))==0? '' : (Number(row?.address_binding_ratio) > 5 ? '#f6465d1a' : '#12b8861a'),
                      }"
                      class="flex mr-8px bg-btn"
                    >
                      <Icon class="iconfont icon-binding text-12px mr-4px" name="custom:binding"/>
                      <span>{{
                        formatNumber(
                          Number(row?.address_binding_ratio) > 0.001 ? row?.address_binding_ratio || 0 : 0,
                          1
                        )
                      }}%</span>
                    </div>
                    <div
                      v-tooltip="$t('Cabal')"
                      :style="{
                        color: Number(formatNumber(row?.colluded_cluster_ratio || 0, 1))==0? 'var(--third-text1)' : (Number(row?.colluded_cluster_ratio) > 5 ? '#F6465D' : '#12B886'),
                        background: Number(formatNumber(row?.colluded_cluster_ratio || 0, 1))==0? '' : (Number(row?.colluded_cluster_ratio) > 5 ? '#f6465d1a' : '#12b8861a'),
                      }"
                      class="flex mr-8px bg-btn"
                    >
                      <Icon class="iconfont icon-binding text-12px mr-4px" name="custom:cabal"/>
                      <span>{{
                        formatNumber(
                          Number(row?.colluded_cluster_ratio) > 0.001 ? row?.colluded_cluster_ratio || 0 : 0,
                          1
                        )
                      }}%</span>
                    </div>

                  </div>
                </div>
              </div>
              <div class="pump-right">
                <div
                 v-show="(pumpSetting.border && pumpSetting.size_swap === '16px') || pumpSetting.bgList?.includes(row.platform)"
                 class="w-160px h-120px absolute z-2 top--12px right--8px border border-solid rounded-8px" :style="{background:  pumpSetting.bgList?.includes(row.platform)? pumpSetting?.bg?.[row.platform]?.bg : ( pumpSetting.border &&  pumpSetting.size_swap ==='16px'? '#12B88614': ''), 'border-color': pumpSetting.border &&  pumpSetting.size_swap ==='16px'? (pumpSetting.border =='border_hight' ? '#12B886': 'var(--border)') : 'transparent' ,'box-shadow': pumpSetting.border &&  pumpSetting.size_swap ==='16px'? (pumpSetting.border =='border_hight' ? '0px 0px 10px 0px #12B88699': '0px 2px 10px 0px var(--border)') : ''}"
                 >
                </div>
                <div
                  v-if="
                    (isSoon && row.progress > 99) || pumpSetting?.define?.some((i) => i === 'mcap')
                  "
                  class="flex-end text-12px pr-12px bg-1"
                  :class="pumpSetting.fontSize_mc =='12px'? 'mb-2px' : 'mb-0px'"
                >
                  <div v-if="isSoon && row.progress >= 99.99" class="bg-1 flex-end py-2px">
                    <el-image
                      v-if="row.issue_platform"
                      v-tooltip="row.issue_platform"
                      class="w-20px rounded-100% bg-[--d-1A1A1A-l-FFF] chain mr-9px"
                      :src="formatIconTag(row.issue_platform)"
                    />
                    <ArrowAnimation />
                    <el-image
                      v-if="row.amm"
                      v-tooltip="row.amm"
                      class="w-20px ml-9px rounded-100% bg-[--d-1A1A1A-l-FFF] chain"
                      :src="`${token_logo_url}swap/${row.amm}.jpeg`"
                    />
                  </div>
                  <div class="bg-1 flex-end py-2px" v-else>
                    <template v-if="pumpSetting?.define?.some((i) => i === 'vol')">
                      <div class="mr-5px color-[--third-text1]" :style="{ 'font-size': pumpSetting.fontSize_mc }">V</div>
                      <span v-if="Number(row?.volume_u_24h) === 0 || row?.volume_u_24h == null" class="color-[--third-text1]" >0</span>
                      <div v-else class="color-[--main-text1]" :style="{ color: getDataColor('vol',row.volume_u_24h),'font-size': pumpSetting.fontSize_mc  }">
                        ${{ pumpSetting.isInt ? formatNumber(row.volume_u_24h || 0, { decimals: 0, l: 4, limit: 3, locale: 'en' }) : formatNumber(row.volume_u_24h || 0, {decimals: 1, l: 4, limit: 3, locale: 'en' }) }}
                      </div>
                    </template>
                    <template v-if="pumpSetting?.define?.some((i) => i === 'mcap')">
                      <div
                        class="color-[--third-text1] mr-5px ml-5px"
                        :style="{ 'font-size': pumpSetting.fontSize_mc }"
                      >
                        MC
                      </div>
                      <span v-if="Number(row?.market_cap) === 0 || row?.market_cap == null" class="color-[--third-text1]" >0</span>
                      <span
                        v-else
                        :style="{ 'font-size': pumpSetting.fontSize_mc, color: getDataColor('mc',row.market_cap) }"
                        >${{ pumpSetting.isInt ? formatNumber(row.market_cap || 0, { decimals: 0, l: 4, limit: 3,  locale: 'en' }) : formatNumber(row.market_cap || 0, { decimals: 1, l: 4, limit: 3, locale: 'en' }) }}</span
                      >
                    </template>
                  </div>
                </div>
                <div
                  v-show="pumpSetting?.define?.some((i) => i === 'txs')"
                  class="flex-end text-12px pr-12px bg-1 py-2px"
                >
                  <div class="flex-end bg-1">
                    <div class="mr-2px color-[--third-text1]">F</div>
                    <img
                      v-if="row?.chain"
                      class="icon-symbol rounded-100% h-14px mr-2px"
                      :src="`${token_logo_url}chain/${row?.chain}.png`"
                    >
                    <span v-if="Number(row?.commission_sum ?? 0)+ Number(row?.priority_fee_sum ?? 0) + Number(row?.fee_sum ?? 0) >0" class="color-[--main-text1]">
                        {{ formatNumber((Number(row?.commission_sum ?? 0)+ Number(row?.priority_fee_sum ?? 0) + Number(row?.fee_sum ?? 0)) , 2) }}
                    </span>
                    <span v-else class="color-[--third-text1]" >0</span>
                  </div>
                  <div v-tooltip.raw="{
                        content: `<div class='max-w-[400px] color-[--secondary-text]'>${$t('netInflow')}: <span class=${ 'color-'+(Number(row?.net_flow_vol) === 0 || row?.net_flow_vol == null? '' : ((row?.net_flow_vol||0)>0?'[--up-color]':'[--down-color]'))}>${Number(row?.net_flow_vol) === 0 || row?.net_flow_vol == null? 0 : ( (row?.net_flow_vol > 0 ? '+$' : '-$')+ formatNumber(Math.abs(row?.net_flow_vol ?? 0), { decimals: 2, l: 4, limit: 3, locale: 'en' }))}</span> </div>`,
                        props: {
                          placement: 'top-start',
                        },
                      }" class="flex-end bg-1">
                    <div class="mr-5px color-[--third-text1] ml-5px">N</div>
                    <span v-if="Number(row?.net_flow_vol) === 0 || row?.net_flow_vol == null" class="color-[--third-text1]" >0</span>
                    <div v-else class="color-[--main-text1]">
                      <ave-data-number :value="row?.net_flow_vol" :signVisible="true" classZero="color-[--main-text1]">
                       {{ formatNumber(Math.abs(row?.net_flow_vol ?? 0), { decimals: 2, l: 4, limit: 3, locale: 'en' }) }}
                      </ave-data-number>
                    </div>
                  </div>
                  <div
                    v-if="pumpSetting?.define?.some((i) => i === 'txs')"
                    v-tooltip="{
                      content:
                        `<div style='color:var(--secondary-text)'>${$t('Txs')} <span style='color:var(--main-text)'>${formatNumber(row?.tx_24h_count || 0, 0)}</span></div>
                        <div style='color:var(--secondary-text)'>${$t('buy')} <span style='color:var(--up-color)'>${formatNumber(row?.buys_tx_24h_count || 0, 0)}</span></div>
                        <div style='color:var(--secondary-text)'>${$t('sell')} <span style='color:var(--down-color)'>${formatNumber(row?.sells_tx_24h_count || 0, 0)}</span></div>
                        `,
                      props: { 'raw-content': true, 'popper-class': 'pump-tooltip' }
                    }"
                    class="relative flex-end bg-1">
                    <div class="mr-5px color-[--third-text1] ml-5px">Txs</div>
                    <span v-if="Number(row?.tx_24h_count) === 0 || row?.tx_24h_count == null" class="color-[--third-text1]" >0</span>
                    <div v-else class="color-[--main-text1]">
                      {{ formatNumber(row.tx_24h_count || 0, { decimals: 0, l: 4, limit: 3, locale: 'en' })}}
                    </div>
                    <el-progress
                      class="clickable w-16px ml-4px border-rd-4px overflow-hidden"
                      :class="row.tx_24h_count > 0 || (Number(row.buys_tx_24h_count) + Number(row.sells_tx_24h_count) > 0)? 'progress-bar' : 'progress-bar-disabled'"
                      :percentage="Math.min(Number((row.buys_tx_24h_count ||0) / row.tx_24h_count * 100) || 0, 100)"
                      :show-text="false"
                      color="#12B886"
                      :stroke-width="2"
                    />
                  </div>
                </div>
                <div class="btns-swap flex-end pr-12px" :style="{ background:  pumpSetting.bgList?.includes(row.platform)? pumpSetting?.bg?.[row.platform]?.bg : '' }">
                  <div
                    v-if="row?.state === 'migrating'"
                    style="
                      margin-left: auto;
                      color: #ffa622;
                      background: #ffa6221a;
                      font-size: 12px;
                      font-weight: 400;
                      border-radius: 4px;
                      padding: 9px 8px;
                      display: flex;
                      margin-right: 5px;
                      align-items: center;
                    "
                  >
                    <img
                      src="@/assets/images/pump/migrating.svg"
                      height="12"
                      class="mr-5px"
                      alt=""
                      srcset=""
                    >
                    <span>Migrating...</span>
                  </div>
                  <QuickSwap
                    v-if="parseInt(pumpSetting?.size_swap|| '0') > 0"
                    :quickBuyValue="quickBuyValue"
                    :swapSetSelected="props.swapSetSelected"
                    :row="row"
                    :classNames="pumpSetting.border &&  pumpSetting.size_swap ==='16px' ? '' :'bg-[--up-color] color-#fff'"
                    :size="pumpSetting.size_swap"
                    @jump="jump(row)"
                  />
                </div>
              </div>
            </div>
          </li>
      </div>
       <AveEmpty v-if="tableList?.length == 0 && !loading" class="mt-200px" />
       <div class="flex justify-center">
        <el-button class="w-266px mt-20px" v-if="hasFilter && tableList?.length == 0 && !loading" @click="handleClearFilter">{{ $t('clearPumpFilter') }}</el-button>
       </div>
    </ul>
    <transition name="fade">
      <span v-if="showBackTop" class="back-top text-12px flex items-center bg-[--main-bg] cursor-pointer" @click="scrollToTop">
          <Icon
          class="mr-4px text-14px color-[--third-text1]"
          name="material-symbols-light:arrow-circle-up-rounded"
        />
        {{ $t('backToTop') }}
      </span>
    </transition>
    <el-popover
      v-if="showPopSearch"
      v-model:visible="showPopSearch"
      :virtual-ref="$refs.currentBtnRef[currentIndex]"
      virtual-triggering
      :persistent="false"
      popper-class="[--el-popover-bg-color:--border]"
    >
    <div class="py-4px [&&]:m--12px flex flex-col">
      <a :href="`https://x.com/search?q=${currentRow?.target_token}`" target="_blank" class="text-12px py-4px px-8px color-[--main-text1] hover:bg-[--dialog-tab-active]">
        {{ $t('tweetSearchContractAddress') }}
      </a>
      <a :href="`https://x.com/search?q=$${currentRow?.symbol}`" target="_blank" class="text-12px py-4px px-8px color-[--main-text1] hover:bg-[--dialog-tab-active]">
        {{ $t('tweetSearchContractAddress2') }}
      </a>
      <!-- <a :href="`https://www.google.com/search?q=${currentRow?.symbol}&tbm=nws`" target="_blank" class="text-12px py-4px px-8px color-[--main-text1] hover:bg-[--dialog-tab-active]">
        {{ $t('tweetSearchContractAddress3') }}
      </a> -->
      <a :href="`https://www.tiktok.com/search?q=${currentRow?.symbol}`" target="_blank" class="text-12px py-4px px-8px color-[--main-text1] hover:bg-[--dialog-tab-active]">
        {{ $t('TikTokSearchName') }}
      </a>
      <a :href="`https://www.google.com/search?q=${currentRow?.symbol}&tbm=nws`" target="_blank" class="text-12px py-4px px-8px color-[--main-text1] hover:bg-[--dialog-tab-active]">
        {{ $t('GoogleSearchName') }}
      </a>
      <span class="text-12px py-4px px-8px color-[--main-text1] hover:bg-[--dialog-tab-active] cursor-pointer" @click="handleSearchTokenName">{{ $t('tweetSearchContractAddress4') }}</span>
    </div>
  </el-popover>
  </div>
</template>

<script setup lang="ts">
import Progress from './progress.vue'
import ArrowAnimation from './arrowAnimation.vue'
import {
  getSymbolDefaultIcon,
  getChainDefaultIcon,
  formatTimeFromNow,
  formatIconTag,
} from '@/utils/index'
import { formatNumber } from '@/utils/formatNumber'
import { Icon } from '#components'
import type { PumpObj } from '@/api/types/pump'
import XIcon from '~/components/xPopup/xIcon.vue'
import { useVirtualList } from '@vueuse/core'
import ProgressPop from './progressPop.vue'
import DevPop from './devPop/index.vue'
import PumpPop from './pumpPop/index.vue'
import HolderRank from './holderRank/index.vue'
import { useSimilarTokenPopup } from '../utils'
import { windowEndpoint } from 'comlink'
import AiPop from './aiPop/index.vue'
import RemarkEditor from './remarkEditor.vue'
import qsImage from '@/assets/images/pump/qs.svg'
const props = defineProps({
  tableList: {
    type: Array<PumpObj>,
    default: () => [],
  },
  quickBuyValue: {
    type: String,
    default: () => '',
  },
  swapSetSelected: {
    type: String as PropType<'s1' | 's2' | 's3'>,
    default: '',
  },
  loading: {
    type: Boolean,
    default: () => false,
  },
  isOut: {
    type: Boolean,
    default: () => false,
  },
  isSoon: {
    type: Boolean,
    default: () => false,
  },
  scrollHeight: {
    type: [String, Number],
    default: 'calc(100vh - 215px)',
  },
  type: {
    type: String,
    default: () => '',
  },
  hasFilter: {
    type: Boolean,
    default: () => false,
  },
})

// const showPop = ref(false)
// const selected = ref<PumpObj | null>(null)
// const btnRefs = ref<Record<string, HTMLElement | null>>({})
// const currentBtnRef = ref<HTMLElement | null>(null)
const { monitorList2:dataSourceCache } = storeToRefs(useMonitorStore()) //获取钱包监控数据,为了处理favorite_holder_count
const emit = defineEmits(['clearFilter'])
const handleClearFilter = () => {
  emit('clearFilter')
}
const configStore = useConfigStore()
const { quickBuyValue, loading, isOut, isSoon, type } = toRefs(props)
const tableList = shallowRef<PumpObj[]>(props.tableList || [])
const srcMap = ref<Record<string, string>>({})
const router = useRouter()
const route = useRoute()
const { token_logo_url } = useConfigStore()
const globalStore = useGlobalStore()
const { pumpSetting, pumpBlackList, lang,isDark, dialogVisible_search, dialogSearchText} = storeToRefs(globalStore)
// const isPaused = defineModel<boolean>('isPaused')

const { t } = useI18n()
const { $createTooltip } = useNuxtApp()
const $refs = ref({
  currentBtnRef: {} as Record<number, any>,
})
const currentIndex = shallowRef(0)
const currentRow = ref<PumpObj | null>(null)
const showPopSearch= shallowRef(false)

const $tooltip = $createTooltip('bubble--tooltip')
const { onEnter, hide: similarHide } = useSimilarTokenPopup()


const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(tableList, {
  itemHeight: 110.8,
  // 必须增加过采样，否则 translateY(-20px) 向上移动时，
  // 顶部刚进入视口的节点会因为高度计算没到视口而无法渲染，导致动画“闪现”
  overscan: 3,
})

onDeactivated(() => {
  $tooltip?.hide?.()
  similarHide?.()
})

onUnmounted(() => {
  $tooltip?.hide?.()
  similarHide?.()
  // Object.keys($refs.value.currentBtnRef).forEach((key) => {
  //   delete $refs.value.currentBtnRef[key]
  // })
  // $refs.value.currentBtnRef = {}
})

function handleContextMenu(e: MouseEvent, row: { target_token: string; chain: string }) {
  if (pumpSetting.value.isRight) {
    e.preventDefault()
    const url = router.resolve({
      name: 'token-id',
      params: { id: row.target_token + '-' + row.chain },
    }).href
    window.open(url, '_blank')
  }
}

function tableRowClick(row: { target_token: string; chain: string }) {
    if ($tooltip) {
    $tooltip.hide?.()
    $tooltip.destroy?.()
  }
  similarHide?.()
  showPopSearch.value = false

  router.push({
    name: 'token-id',
    params: { id: row.target_token + '-' + row.chain },
  })
}
function clickToken(token: string, chain: string) {
  const action = globalStore.audioSettings.wallet?.clickTokenAction ?? -1
  if (action === -1) {
    navigator.clipboard.writeText(token)
    ElMessage.success(t('copySuccess'))
    return
  }
  const url = router.resolve({
    name: 'token-id',
    params: { id: token + '-' + chain },
  }).href
  if (action === 1) {
    window.open(url, '_blank')
  } else {
    router.push(url)
  }
}
function addOrRemoveBlaclList(item: { token: string , medias: any[]}, type: 'ca' | 'dev' | 'keyword'| 'twitter') {
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

// function setBtnRef(el: HTMLElement | null) {
//   if (el && el?.id) {
//     btnRefs.value[el?.id] = el
//     // console.log('-------el?.id----',el?.id)
//   }
// }
// function showPopover(item: PumpObj) {
//   // if (!isOut.value) {
//   // console.log('-----[item.id--',item.id)
//   selected.value = item
//   currentBtnRef.value = btnRefs.value[item.id] || null
//   // console.log('-----currentBtnRef.value ---',currentBtnRef.value )
//   showPop.value = true
//   isPaused.value = true
//   // }
// }

// function hidePopover() {
//   showPop.value = false
//   isPaused.value = false
// }

// function summaryList(summary: string): string[] {
//   return summary?.match(/\d\.[^0-9]*/g) || []
// }
function summaryList(summary: string): string[] {
  if (!summary) return []
  const regex = /\d+\.\s*[\s\S]*?(?=\d+\.|$)/g

  const matches = summary.match(regex)

  if (matches && matches.length > 0) {
    return matches.map(i => i.trim())
  }
  return [summary.trim()]
}
function hasTwitterXUser(medias?: Array<{ icon?: string; url?: string }>) {
  return medias?.some((item) => item.icon === 'twitter' && !!formatXUser(item?.url)) ?? false
}
function buildTooltipContent(summary: string, summary_score?: number): string {
  const items = summaryList(summary)
  return items?.length > 0
    ? `
    <div class="max-w-[400px]">
      <div class="flex-between font-14px">
        <Icon name="custom:ai2" class="text-14px color-[--primary-color]" />AI叙事
        <span class="flex-1"></span>
        <el-rate v-model="summary_score" />
      </div>
      ${items.map((item) => `<div>${item}</div>`).join('')}
    </div>
  `
    : ''
}

function showBubbleTooltip(row: PumpObj, e: MouseEvent) {
  $tooltip.show({
    content: `<iframe
                  style='width:400px; height:400px;  border:none; overflow: hidden;'
                  src='https://app.insightx.network/bubblemaps/${row.chain === 'bsc' ? 56 : row.chain}/${row.target_token}?embed_id=9Pt12qHMl1KDeK'
                  allow='clipboard-write'
                ></iframe>`,
    target: e.target as HTMLElement,
    props: {
      showArrow: false,
      rawContent: true,
      placement: 'bottom',
      trigger: 'hover',
      'popper-class': 'x--tooltip',
      'onUpdate:visible': (v: boolean) => {
        if (v) return
        $tooltip.hide()
      },
    },
  })
}
function getDataColor(type: string, num: number) {
  if (type === 'mc') {
    const middleSize = pumpSetting.value.data?.mc?.middleSize ?? 0
    const minSize = pumpSetting.value.data?.mc?.minSize ?? 0
    if (Number(num) > middleSize) {
      return pumpSetting.value.data?.mc?.maxColor || ''
    } else if (Number(num) > minSize) {
      return pumpSetting.value.data?.mc?.middleColor || ''
    } else {
      return pumpSetting.value.data?.mc?.minColor || ''
    }
  }
  if (type === 'vol') {
    const middleSize = pumpSetting.value.data?.vol?.middleSize ?? 0
    const minSize = pumpSetting.value.data?.vol?.minSize ?? 0
    if (Number(num) > middleSize) {
      return pumpSetting.value.data?.vol?.maxColor || ''
    } else if (Number(num) > minSize) {
      return pumpSetting.value.data?.vol?.middleColor || ''
    } else {
      return pumpSetting.value.data?.vol?.minColor || ''
    }
  }
  if (type === 'holders') {
    const middleSize = pumpSetting.value.data?.holders?.middleSize ?? 0
    const minSize = pumpSetting.value.data?.holders?.minSize ?? 0
    if (Number(num) > middleSize) {
      return pumpSetting.value.data?.holders?.maxColor || ''
    } else if (Number(num) > minSize) {
      return pumpSetting.value.data?.holders?.middleColor || ''
    } else {
      return pumpSetting.value.data?.holders?.minColor || ''
    }
  }
}
function jump (row: { target_token: string; chain: string }) {
  if (pumpSetting.value.jump == 'open') {
  router.push({
    name: 'token-id',
    params: { id: row.target_token + '-' + row.chain },
  })
  } else  if(pumpSetting.value.jump == 'open_jump'){
    const routeData = router.resolve({
      name: 'token-id',
      params: { id: row.target_token + '-' + row.chain },
    })
    window.open(routeData.href, '_blank')
  }
}
// const scrollbarRef = ref()
const showBackTop = ref(false)
// const handleScroll = ({ scrollTop }: { scrollTop: number }) => {
//   showBackTop.value = scrollTop > 200
// }

// 示例：监听滚动事件以实现“锁定置顶”逻辑
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  showBackTop.value = target.scrollTop > 200
}

const scrollToTop = () => {
  scrollTo(0)
  // const wrap = scrollbarRef.value?.wrapRef
  // if (wrap) {
  //   wrap.scrollTo({
  //     top: 0,
  //     behavior: 'smooth' // 平滑滚动
  //   })
  // }
}
function showPopoverSearch(row: PumpObj,$index: number) {
  showPopSearch.value = true
  currentIndex.value = $index
  currentRow.value = row
}
async function handleSearchTokenName() {
  dialogVisible_search.value = true
  await Promise.resolve()
  dialogSearchText.value = currentRow.value?.symbol || ''
}

// 记录最近一次全局下推的时间
const lastPushTime = ref(0)
const newestId = ref('')

// 监听原始列表数据 (假设 props.list 是 shallowRef)
watch(() => props.tableList, (newList, oldList) => {
  if (dataSourceCache.value?.length > 0) {
    dataSourceCache.value?.forEach(item => {
      const index = newList.findIndex((i: PumpObj) => i.target_token === item.target_address && i.chain === item.chain)
      if (index !== -1) {
        newList[index].favorite_holder_count = 1
      }
    })
  }
  tableList.value = newList
  const currentKeys = new Set<string>()
  newList.forEach(row => {
    const key = row.target_token + '-' + row.chain
    currentKeys.add(key)
    const logoUrl = String(row.logo_url || '').trim()
    if (logoUrl) {
      const src = /^https?:\/\//.test(logoUrl) ? logoUrl : token_logo_url + logoUrl
      if (srcMap.value[key] !== src) {
        srcMap.value[key] = src
      }
    }
  })
  // 移除不再存在的 key
  for (const key in srcMap.value) {
    if (!currentKeys.has(key)) {
      delete srcMap.value[key]
    }
  }
  // 1. 判断是否是插入了新数据（长度增加，或第一个元素 ID 变了）
  const new1 = newList?.[0]
  const old1 = oldList?.[0]
  const new1PairId = new1?.pair + '-' + new1?.chain
  const old1PairId = old1?.pair + '-' + old1?.chain

  if (new1PairId !== old1PairId) {
    lastPushTime.value = Date.now()
    newestId.value = new1PairId
  }
}) // shallowRef 监听引用即可，性能最高

// 动画判定函数
const getAnimClass = (itemData: any) => {
  const now = Date.now()
  const duration = 300 // 动画持续 300ms

  // A. 判断是否是新行入场
  if ((itemData?.pair + '-' + itemData?.chain) === newestId.value && (now - lastPushTime.value < duration)) {
    return 'anim-enter'
  }

  // B. 判断是否是旧行被推挤
  if (now - lastPushTime.value < duration) {
    return 'anim-push'
  }

  return ''
}
function getLiqTooltip(row: PumpObj) {
  const isToken0 =
    row.token === row.token0_address ||
    row.target_token === row.token0_address

  const value = isToken0 ? row.reserve1 : row.reserve0

  return `
    <div class="flex-start" style="color:var(--secondary-text)">
      ${t('pair')}
      <span class="color-[--main-text1] text-12px ml-5px">
        ${formatNumber(value || 0, { decimals: 2, l: 4, locale: 'en' })}
        <span class="text-11px ml-4px">
          ${row.baseToken?.symbol ?? ''}
        </span>
      </span>
    </div>
  `
}

defineExpose({
  scrollToTop
})
</script>

<style lang="scss" scoped>
.pump-item_list {
  scroll-behavior: smooth;
  font-size: 12px;
  .pump-item_item {
    min-height: 100px;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 12px;
    border-top: 1px solid var(--main-input-button-bg);
    border-radius: 4px;
    .bg-1{
      background-color: var(--d-0E0F10-l-FFF);
    }
    &:hover {
      background-color: var(--main-list-hover);
      .black-container {
        color: #959a9f;
        visibility: visible;
      }
      .bg-1{
        background-color: var(--main-list-hover);
      }
      .pump-right {
        box-shadow: none;
        // background-color: var(--main-list-hover);
        .btns-swap{
          visibility: visible;
          // background-color: var(--main-list-hover);
        }
      }
      .bg-btn {
        // border: 0.5px solid var(--main-input-button-bg);
        // background: var(--secondary-bg);
      }
    }
    .pump-right {
      // box-shadow: -2px 0px 4px 0px #00000099;
      // background: var(--secondary-bg);
      width: 0;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 10;
      height: 100%;
      // border: 1px solid;

      .btns-swap{
        // background-color: var(--secondary-bg);
        position: absolute;
        z-index:20;
        bottom: 0px;
        right:-12px;
      }
    }
    .black-container {
      position: absolute;
      visibility: hidden;
      left: -8px;
      top: -10px;
      color: var(--d-666-l-999);
      z-index: 1;
    }
  }
  .token-logo {
    // margin-right: 12px;
    // width: 64px;
    // height: 64px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    .token-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--custom-bg-6-color);
      display: flex;
      align-items: center;
      justify-content: center;
      &.small {
        width: 50px;
        height: 50px;
      }
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .token-progress {
      &.circle {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 72px;
        height: 72px;
        transform: translate(-50%, -50%) rotate(-90deg);
      }

      &.horizontal {
        position: absolute;
        top: 100%;
        left: 50%;
        width: 72px;
        height: 2px;
        transform: translate(-50%, -50%);
        margin-top: 15px;
      }
    }
    &:hover .token-mark {
      display: flex;
      visibility: visible;
    }
    .token-mark {
      position: absolute;
      visibility: hidden;
      justify-content: center;
      align-items: center;
      inset: 0;
      // border-radius: 50%;
      &:hover {
        background: #00000099;
        .iconify {
          color: #f5f5f5;
          opacity: 1;
        }
      }
      opacity: 1;
      .iconify {
        // color: var(--a-text-2-color);
        // font-weight: 800;
        // font-size: 24px;
      }
    }
  }
  .token-icon-signal-tag {
    max-width: 12px;
    max-height: 12px;
    font-size: 10px;
    width: 12px;
  }
  .token-icon-tag {
    max-width: 14px;
    max-height: 14px;
    font-size: 10px;
    margin-left: 2px;
    width: 12px;
  }
  .table-empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 80px 0;
    min-height: calc(100vh - 200px);
    color: var(--a-text-2-color);
  }
}
.bg-btn {
  --uno: rounded-2px mr-4px flex items-center justify-center min-w-16px p-4px;
}
.time {
  color: #959a9f;
  text-align: center;
}
.chain {
  .el-image__inner {
    border-radius: 100%;
  }
}
@media (max-width: 1680px) and (min-width: 1025px) {
  .btns-swap{
    // visibility: hidden;
  }
}
@media (max-width: 1920px) {
  .symbol-ellipsis {
    max-width: 100px;
  }
}
@media (min-width: 1920px) {
  .symbol-ellipsis {
    max-width: 200px;
  }
}
.ellipsis-auto {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
/* 回到顶部按钮定位到底部右侧 */
.back-top {
  position: absolute;
  left: 50%;
  bottom: 20px;
  transform: translate(-50%, -50%);
  z-index: 10;
  border: 1px solid var(--dialog-divider);
  border-radius: 4px;
  padding: 5px 10px;
}

/* 动画效果 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.slide-fade-move {
  transition: transform 0.3s ease;
}

/* 1. 新行入场：从上方滑入并淡入
.anim-enter {
  animation: slideIn 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  z-index: 10;
}

*/

/* 2. 旧行下推补偿：
   数据置顶时，虚拟滚动将旧行瞬间下移了 70px。
   我们让内层瞬间反向向上偏移 70px（回原位），然后平滑归位到 0。
.anim-push {
  animation: pushDown 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

 */

@keyframes slideIn {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes pushDown {
  from { transform: translateY(-70px); }
  to { transform: translateY(0); }
}

.item-inner {
  will-change: transform;
  transform: translateZ(0); /* 硬件加速 */
}

.scroller-container {
  // overflow-y: auto;
  scrollbar-width: thin;
  /* Firefox 颜色：第一个是滑块颜色，第二个是轨道颜色 */
  scrollbar-color: rgba(144, 147, 153, 0.3) transparent;
  overflow-x: hidden;
}

/* 1. 整体宽度保持 6px 比较精致 */
.scroller-container::-webkit-scrollbar {
  width: 6px;
}

/* 2. 核心：调低默认透明度 (模拟 el-scrollbar 的淡色感) */
.scroller-container::-webkit-scrollbar-thumb {
  /* 使用 rgba 手动控制透明度，0.2 是最接近 Element 的淡色 */
  background-color: var(--el-text-color-placeholder, rgba(144, 147, 153, 0.2));
  border-radius: 10px;
  /* 只有加上这一行，颜色才会变淡 */
  opacity: 0.2;
}

/* 3. 只有鼠标移入容器时，滑块才稍微变深一点点 */
.scroller-container:hover::-webkit-scrollbar-thumb {
  background-color: var(--el-text-color-secondary, rgba(144, 147, 153, 0.3));
}

/* 4. 只有鼠标直接放在滑块上时，颜色才明显 */
.scroller-container::-webkit-scrollbar-thumb:hover {
  background-color: var(--el-text-color-secondary, rgba(144, 147, 153, 0.5)) !important;
}

.scroller-container::-webkit-scrollbar-track {
  background-color: transparent;
}
.progress-bar {
  :deep() .el-progress-bar__outer {
    --el-border-color-lighter: var(--down-color);
  }
}
.progress-bar-disabled{
  :deep() .el-progress-bar__outer {
    --el-border-color-lighter: var(--third-text1);
  }
}
</style>
