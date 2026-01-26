<template>
  <div class="mt-20px mb-30px relative">
    <!-- <el-scrollbar ref="scrollbarRef" v-loading="loading" :height="scrollHeight" @scroll="handleScroll"> -->
    <ul  v-bind="containerProps" class="pump-item_list scroller-container"  :style="{height: scrollHeight}" @scroll="handleScroll">
      <div v-bind="wrapperProps">
        <!-- <TransitionGroup name="slide-fade"> -->
          <li
            v-for="({data: row}, $index) in list"
            :id="row?.target_token + '-' + row?.chain"
            :key="row?.pair + '-' + row?.chain"
            v-tooltip:pump-tooltip="{
              content: {
                is: ProgressPop,
                props: {
                  isOut: isOut,
                  selected: row
                }
              },
              props: {
                placement: 'top',
                'popper-class': 'text-center new-popover',
                'popper-style':'width: auto'
              }
            }"
            class="pump-item_item relative item-row"
            :style="{ background:  pumpSetting.bgList?.includes(row.platform)? pumpSetting?.bg?.[row.platform]?.bg : '' }"
            @click.stop="tableRowClick(row)"
            @contextmenu="handleContextMenu($event, row)"
          >
            <div class="w-full relative" :class="getAnimClass(row)">
              <div class="flex-start items-start">
                <div class="mr-12px relative">
                  <div class="black-container">
                    <span
                      v-tooltip="$t('BlackListToken')"
                      class="bg-[--d-000-l-FFF] px-2px py-2px color-[--third-text] block hover:color-[--secondary-text] w-16px h-16px flex items-center justify-center"
                    >
                      <Icon
                        v-if="
                          pumpBlackList?.findIndex(
                            (i) =>
                              (i.address == row.token && i.type == 'ca') ||
                              (i.address == row.symbol && i.type == 'keyword')
                          ) !== -1
                        "
                        name="custom:key-visible"
                        class="text-12px"
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
                      v-tooltip="$t('BlackListDev')"
                      class="bg-[--d-000-l-FFF] px-2px py-2px color-[--third-text] block mt-5px hover:color-[--secondary-text] w-16px h-16px flex items-center justify-center"
                    >
                      <Icon
                        v-if="
                          pumpBlackList?.findIndex(
                            (i) => i.address == row.token && i.type == 'dev'
                          ) !== -1
                        "
                        name="custom:dev"
                        class="text-12px"
                        @click.stop="addOrRemoveBlaclList(row, 'dev')"
                      />
                      <Icon
                        v-else

                        name="custom:dev-invisible"
                        class="text-12px"
                        @click.stop="addOrRemoveBlaclList(row, 'dev')"
                      />
                    </span>
                  </div>
                  <div class="token-logo">
                    <el-image
                      class="token-icon"
                      :class="{ small: pumpSetting.Progress_isCircle == 'horizontal' }"
                      fit="cover"
                      :src="
                        getSymbolDefaultIcon(
                          row,
                          pumpSetting.avatar_isCircle == 'circle' ? 'circle' : 'rect'
                        )
                      "
                      :style="{
                        'border-radius': pumpSetting.avatar_isCircle == 'circle' ? '100%' : '4px',
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
                          :src="getChainDefaultIcon(row.chain, row.symbol, pumpSetting.avatar_isCircle == 'circle' ? 'circle' : 'rect')"
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
                    @mouseover.stop="onEnter($event, row, props.type, getDataColor)"
                      @click.stop
                    >
                      <Icon class="text-16px text-#fff" name="custom:search" />
                    </a>
                    <!-- <el-tooltip
                      popper-class="tooltip-pd-0"
                      placement="bottom-start"
                      :show-arrow="false"
                    >
                      <template #content
                        >
                        <el-image
                          class="token-icon max-w-228px max-h-228px w-228px flex items-center justify-center"
                          style="display: flex"
                          fit="cover"
                          :src="getSymbolDefaultIcon(row)"
                          preview-teleported
                        >
                          <template #error>
                            <img
                              class="token-icon h-228px w-228px text-16px color-#fff"
                              :src="getChainDefaultIcon(row.chain, row.symbol)"
                            >
                          </template>
                          <template #placeholder>
                            <img
                              class="token-icon h-228px w-228px text-16px color-#fff"
                              :src="getChainDefaultIcon(row.chain, row.symbol)"
                            >
                          </template>
                        </el-image>
                      </template>
                      <a
                        :href="`https://lens.google.com/uploadbyurl?url=${encodeURIComponent(
                          getSymbolDefaultIcon(row)
                        )}`"
                        target="_blank"
                        class="token-mark clickable"
                        @click.stop
                      >
                        <Icon class="text-16px text-#fff" name="custom:search" />
                      </a>
                    </el-tooltip> -->
                    <div v-if="!isOut" class="bg-btn bg-[--secondary-bg] absolute bottom--8px left--10px !rounded-4px border border-1 border-solid border-[#1E1F23] color-[--yellow] text-9px">
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
                        width: 14px;
                        height: 14px;
                        bottom: -7px;
                        right: -10px;
                      "
                      :src="formatIconTag(row.issue_platform)"
                    />

                    <!-- <el-image
                      v-if="row.issue_platform && isOut"
                      v-tooltip="row.issue_platform"
                      class="ml-5px rounded-100% bg-[--d-151A22-l-E8F1FF] chain border border-[#55D592] border-solid border-[1px]"
                      style="position: absolute; width: 14px; height: 14px; bottom: -7px; left: -10px"
                      :style="{
                        'border-color': getPumpColor(row.issue_platform)
                      }"
                      :src="formatIconTag(row.issue_platform)"
                    />
                    <Icon
                      v-if="row.issue_platform && isOut"
                      class="color-#4FD58F"
                      name="line-md:pause-to-play-filled-transition"
                      style="position: absolute; bottom: -7px; left: 20px; font-size: 16px"
                    /> -->
                  </div>
                  <div
                      v-copy="row.token"
                      class="color-[--third-text] text-12px hover:color-[--main-text]"
                      :class="pumpSetting.Progress_isCircle == 'horizontal' ? 'mt-20px' : 'mt-10px'">
                      {{row.token?.slice(0, 4) + '...' + row.token?.slice(-4)}}
                  </div>
                </div>
                <div class="flex flex-col self-stretch relative">
                  <div class="flex-start">
                    <span v-tooltip="row.symbol" class="text-16px font-500 mr-5px symbol-ellipsis ellipsis-auto block">{{
                      row.symbol
                    }}</span>
                    <span
                      v-if="pumpSetting?.define?.some((i) => i === 'name')"
                      v-tooltip="row.name"
                      v-copy="row.name"
                      class="name text-12px font-500 mr-5px color-[--secondary-text] symbol-ellipsis ellipsis-auto block"
                      >{{ row.name }}</span>
                    <a
                      v-if="
                        summaryList(
                          lang == 'zh-cn' || lang == 'zh-tw'
                            ? row?.summary_cn || ''
                            : row?.summary || ''
                        )?.length && isOut
                      "
                      v-tooltip.raw="{
                        content: buildTooltipContent(
                          lang == 'zh-cn' || lang == 'zh-tw'
                            ? row?.summary_cn || ''
                            : row?.summary || ''
                        ),
                        props: {
                          placement: 'top-start',
                        },
                      }"
                      class="media-item clickable"
                    >
                      <Icon name="custom:ai" class="text-14px" />
                    </a>
                  </div>

                  <div class="flex-start text-12px mt-5px">
                      <div
                        v-tooltip="formatDate(row?.created_at || row?.time)"
                        class="time"
                        :style="{
                          color:
                            Number(formatTimeFromNow(row?.created_at || row?.time, true)) <= 600
                              ? '#FFA622'
                              : '#12B886',
                        }"
                      >
                        <template v-if="!(row?.created_at || row?.time)"> - </template>
                        <template
                          v-else-if="Number(formatTimeFromNow(row?.created_at || row?.time, true)) >= 60"
                        >
                          {{
                            formatCountdown(
                              Number(row?.created_at) * 1000 || Number(row?.time) * 1000,
                              false
                            )
                          }}
                        </template>
                        <TimerCount
                          v-else-if="
                            (row?.created_at || row?.time) &&
                            Number(formatTimeFromNow(row?.created_at || row?.time, true)) < 60
                          "
                          :key="`${row.created_at}`"
                          :timestamp="row.created_at"
                          :end-time="60"
                        >
                          <template #default="{ seconds }">
                            <span class="color-#FFA622">
                              <template v-if="seconds < 60"> {{ seconds }}s </template>
                              <template v-else>
                                {{ formatTimeFromNow(row.created_at) }}
                              </template>
                            </span>
                          </template>
                        </TimerCount>
                      </div>
                      <img
                        v-if="row.baseToken"
                          v-tooltip="{
                          content:getLiqTooltip(row),
                          props: { 'raw-content': true, 'popper-class': 'pump-tooltip' }
                        }"
                        class="rounded-100% cursor-pointer ml-8px mr-8px"
                        :src="getSymbolDefaultIcon({ ...(row.baseToken || {}), chain: row.chain})"
                        alt=""
                        :width="12"
                        style="border-radius: 100%"
                      >
                    <div
                      v-if="
                        row?.medias?.length > 0 && pumpSetting?.define?.some((i) => i === 'media')
                      "
                      class="flex text-12px"
                    >
                      <div v-for="(item, index) in row?.medias" :key="index">
                        <template v-if="item.url">
                          <span v-if="item.name === 'QQ'" v-tooltip="item.url" class="mr-8px">
                            <Icon
                              :name="`custom:${item.icon}`"
                              class="text-[--secondary-text] h-12px"
                            />
                          </span>
                          <XPopup
                            v-else-if="item.icon === 'twitter'"
                            :tokenId="(row.token + '-' + row.chain) as string"
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
                                :name="`custom:${item.icon}`"
                                class="text-[--secondary-text] text-12px"
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
                              :name="`custom:${item.icon}`"
                              class="text-[--secondary-text] h-12px"
                            />
                          </a>
                        </template>
                      </div>
                    </div>
                    <PumpLive class="mr-4px" v-if="row?.is_streaming" :tokenId="(row.token + '-' + row.chain) as string" />

                    <a
                      :ref="(el: any) => $refs.currentBtnRef[$index] = el"
                      class="media-item h-12px block leading-12px"
                      target="_blank"
                      @mouseenter="showPopoverSearch(row, $index)"
                      @mouseleave="showPopSearch = false"
                      @click.stop.prevent
                    >
                      <Icon class="text-[--secondary-text] h-12px w-12px mr-8px" name="custom:search" />
                    </a>
                    <div
                      v-show="pumpSetting?.define?.some((i) => i === 'holder')"
                      v-tooltip="$t(`holders`)"
                      class="flex mr-8px items-center"
                    >
                      <Icon
                        class="iconfont icon-rug mr-4px text-12px vertical-middle color-[--secondary-text]"
                        name="custom:holders"
                      />
                      <span v-if="Number(row?.holders) === 0 || row?.holders == null" class="color-[--secondary-text]" >0</span>
                      <span v-else class="color-[--main-text]" :style="{ color: getDataColor('holders',row.holders) }">
                        {{ formatNumber(row?.holders || 0, 2) }}
                      </span>
                    </div>
                    <div
                      v-show="pumpSetting?.define?.some((i) => i === 'markers')"
                      v-tooltip.raw="{
                        content: `<div class='max-w-[400px] color-[--secondary-text]'>${$t('markersBuy')}/${$t('markersSell')}: <span class='color-#12B886'>${formatNumber(row?.buyers_24h || 0, 2)}</span><span class='color-[--third-text]'>/</span><span class='color-#F6465D'>${formatNumber(row?.sellers_24h || 0, 2)}</span></div>`,
                        props: {
                          placement: 'top-start',
                        },
                      }"
                      class="flex mr-8px items-center"
                    >
                      <Icon
                        class="iconfont icon-rug mr-4px text-12px vertical-middle color-[--secondary-text] hover:color-#3F80F7"
                        name="custom:wallets"
                      />
                      <span v-if="Number(row?.makers_24h) === 0 || row?.makers_24h == null" class="color-[--secondary-text]" >0</span>
                      <span v-else class="color-[---main-text]">{{
                        formatNumber(row?.makers_24h || 0, 2)
                      }}</span>
                    </div>

                    <div
                      v-show="pumpSetting?.define?.some((i) => i === 'kol')"
                      v-tooltip="`${$t('KOLRatio')} ${formatNumber(row?.kol_ratio || 0, 2)}%`"
                      class="flex mr-8px items-center"
                    >
                      <Icon
                        class="iconfont icon-rug mr-4px text-10px vertical-middle color-[--secondary-text]"
                        name="custom:kol2"
                      />
                      <span v-if="Number(row?.kol_tag_count) === 0 || row?.kol_tag_count == null" class="color-[--secondary-text]" >0</span>
                      <span v-else class="color-[---main-text]">
                        {{ formatNumber(row?.kol_tag_count || 0, 2) }}</span>
                    </div>

                    <div
                      v-tooltip="{
                        content:
                          `<div style='color:var(--secondary-text)'>${$t('devMigrated')} <span style='color:var(--main-text)'>${formatNumber(row?.migrated_count || 0, 0)}</span></div>
                          <div style='color:var(--secondary-text)'>${$t('devLaunched')} <span style='color:var(--up-color)'>${formatNumber(row?.total_count || 0, 0)}</span></div>
                          <div style='color:var(--secondary-text)'>${$t('migratedRatio')} <span style='color:var(--down-color)'>${formatNumber(row?.migrated_ratio || 0, 0)}%</span></div>
                          `,
                        props: { 'raw-content': true, 'popper-class': 'pump-tooltip' }
                      }"
                      class="flex mr-8px items-center">

                      <Icon
                        class="iconfont icon-rug mr-4px text-10px vertical-middle "
                        name="custom:top2"
                        :style="{color: row?.migrated_count> 2 ?'var(--yellow)' : 'var(--secondary-text)'}"
                      />
                      <span v-if="Number(row?.migrated_count) === 0 || row?.migrated_count == null" class="color-[--secondary-text]" >0</span>
                      <span v-else class="color-[---main-text]">{{
                        formatNumber(row?.migrated_count || 0, 2)}}/{{formatNumber(row?.total_count || 0, 2)}}
                      </span>
                    </div>

                    <div
                      v-show="pumpSetting?.define?.some((i) => i === 'smart')"
                      v-tooltip="`${$t('smarterRatio')} ${formatNumber(row?.smart_wallet_ratio || 0, 2)}%`"
                      class="flex mr-5px items-center color-[--secondary-text]"
                    >
                      <Icon
                        class="iconfont icon-rug mr-4px text-10px vertical-middle "
                        name="custom:smart-plain"
                      />
                      <span v-if="Number(row?.smart_wallet_tag_count) === 0 || row?.smart_wallet_tag_count == null" class="color-[--secondary-text]" >0</span>
                      <span v-else>{{ formatNumber(row?.smart_wallet_tag_count || 0, 2) }}</span>
                    </div>
                    <!-- <div
                  v-show="pumpSetting?.define?.some(i=> i=== 'migraged')"
                  v-tooltip="$t('migraged')"
                  class="flex mr-5px items-center bg-btn"
                >
                  <Icon
                    class="iconfont icon-rug mr-2px text-10px vertical-middle color-[--d-666-l-999]"
                    name="custom:migraged"
                  />
                  <span class="color-[--d-999-l-666]">0</span>
                </div> -->
                  </div>
                  <div class="color-#009EF7 min-h-15px mt-5px">
                    <a v-for="(item, index) in row?.medias?.filter(i=> i.icon === 'twitter')" :key="index" class="color-#009EF7" :href="item.url" target="_blank" @click.stop>
                      {{ (item?.url?.includes('/communities') || item?.url?.includes('.com/i/')) ? '' : '@' + item.url?.replace(/^https?:\/\/(?:www\.)?(?:x|twitter)\.com\/([^\/\?]+).*/, "$1") }}
                    </a>
                  </div>

                  <div class="flex-start text-12px absolute bottom--2px z-1 mt-5px">
                    <div
                      v-show="pumpSetting?.define?.some((i) => i === 'top')"
                      class="flex-start mr-8px bg-btn"
                      @mouseover.stop="(e) => showBubbleTooltip(row, e)"
                      :style="{
                          background:Number(formatNumber(row?.holders_top10_ratio || 0, 1))==0? '': (Number(row?.holders_top10_ratio) > 30 ? '#f6465d1a' : '#12b8861a'),
                          color:Number(formatNumber(row?.holders_top10_ratio || 0, 1))==0? 'var(--secondary-text)': (Number(row?.holders_top10_ratio) > 30 ? '#F6465D' : '#12B886'),
                      }"
                    >
                      <Icon
                        class="iconfont icon-TOP text-10px mr-4px"
                        name="custom:top3"
                      />
                      <span
                        >{{
                          formatNumber(row?.holders_top10_ratio || 0, 1)
                        }}%</span
                      >
                    </div>
                    <!-- <div
                      v-show="pumpSetting?.define?.some((i) => i === 'dev')"
                      class="flex mr-8px bg-btn"
                    > -->
                    <DevPop
                      v-show="pumpSetting?.define?.some((i) => i === 'dev')"
                      class="flex mr-8px bg-btn"
                      :style="{
                        background: Number(formatNumber(row?.dev_balance_ratio_cur || 0, 1)) == 0 ? '' : (Number(row?.dev_balance_ratio_cur) > 5 ? '#f6465d1a' : '#12b8861a'),
                        color:Number(formatNumber(row?.dev_balance_ratio_cur || 0, 1))==0? 'var(--secondary-text)': (Number(row?.dev_balance_ratio_cur) > 5 ? '#F6465D' : '#12B886')
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
                          >{{
                            formatNumber(
                              Number(row?.dev_balance_ratio_cur) > 0.001
                                ? row?.dev_balance_ratio_cur || 0
                                : 0,
                              1
                            )
                          }}%
                        </span>
                      </template>
                      <img
                        v-if="row.first_transfer_in_from_label"
                        class="w-12px h-12px cursor-pointer rounded-full ml-4px"
                        :src="formatIconPumpDev(row.first_transfer_in_from_label)"
                        alt=""
                      >
                      <span v-if="row?.age_seconds" class="ml-4px color-[--secondary-text]">{{ formatSeconds(Number(row?.age_seconds || 0)) }}</span>
                     </DevPop>
                    <!-- </div> -->
                    <div
                      v-show="pumpSetting?.define?.some((i) => i === 'sniper')"
                      v-tooltip="$t('sniper2')"
                      class="flex mr-8px bg-btn"
                      :style="{
                        color: Number(formatNumber(row?.sniper_balance_ratio_cur || 0, 1))==0? 'var(--secondary-text)' : (Number(row?.sniper_balance_ratio_cur) > 5 ? '#F6465D' : '#12B886'),
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
                        color: Number(formatNumber(row?.insider_balance_ratio_cur || 0, 1))==0? 'var(--secondary-text)' : (Number(row?.insider_balance_ratio_cur) > 5 ? '#F6465D' : '#12B886'),
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
                        color: Number(row?.phishing_ratio) > 5 ? '#F6465D' : '#12B886',
                      }"
                    >
                      <Icon class="iconfont icon-fish text-12px mr-4px" name="custom:fish"
                      :style="{
                        color: Number(row?.phishing_ratio) > 5 ? '#F6465D' : '#12B886',
                        }"/>
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
                        color: Number(row?.address_binding_ratio) > 5 ? '#F6465D' : '#12B886',
                      }"
                      class="flex mr-8px bg-btn"
                    >
                      <Icon class="iconfont icon-binding text-12px mr-4px" name="custom:binding"
                      :style="{
                        color: Number(row?.address_binding_ratio) > 5 ? '#F6465D' : '#12B886',
                        }"/>
                      <span>{{
                        formatNumber(
                          Number(row?.address_binding_ratio) > 0.001 ? row?.address_binding_ratio || 0 : 0,
                          1
                        )
                      }}%</span>
                    </div>
                    <!-- <div
                      v-show="pumpSetting?.define?.some((i) => i === 'cabal')"
                      v-tooltip="$t('cabal')"
                      class="flex mr-8px bg-btn"
                    >
                      <img
                        v-if="Number(row?.cabal_tag_count) > 0"
                        class="mr-4px"
                        src="@/assets/images/cabal.svg"
                        :width="11"
                        alt=""
                      >
                      <img
                        v-else
                        class="mr-4px"
                        :src="`${token_logo_url}address_portrait/Cabal11.png`"
                        :width="11"
                        alt=""
                      >
                      <span class="color-[--d-999-l-666]">{{
                        formatNumber(
                          Number(row?.cabal_tag_count) > 0.001 ? row?.cabal_tag_count || 0 : 0,
                          2
                        )
                      }}</span>
                    </div> -->
                    <!-- <div
                      v-show="pumpSetting?.define?.some((i) => i === 'rug')"
                      v-tooltip="$t('rug_rate_tips')"
                      class="flex mr-5px items-center bg-btn"
                      :style="{
                        color: row?.rug_rate > 60 ? '#F6465D' : '#12B886',
                      }"
                    >
                      <Icon
                        class="iconfont icon-rug mr-2px text-12px vertical-middle"
                        name="custom:rug"
                        :style="{
                          color: row?.rug_rate > 60 ? '#F6465D' : '#12B886',
                        }"
                      />
                      <span>{{
                        row.rug_rate == -1
                          ? $t('unKnown1')
                          : formatNumber(row?.rug_rate || 0, 2) + '%'
                      }}</span>
                    </div> -->
                  </div>
                </div>
              </div>
              <div class="pump-right bg-transparent" :style="{ background:  pumpSetting.bgList?.includes(row.platform)? pumpSetting?.bg?.[row.platform]?.bg : '', 'border-color': pumpSetting.border &&  pumpSetting.size_swap ==='16px'? (pumpSetting.border =='border_hight' ? '#12B886': 'var(--border)') : 'transparent' ,'box-shadow': pumpSetting.border &&  pumpSetting.size_swap ==='16px'? (pumpSetting.border =='border_hight' ? '0px 2px 10px 0px #12B886': '0px 2px 10px 0px var(--border)') : ''}">
                <div
                  v-if="
                    (isSoon && row.progress > 99) || pumpSetting?.define?.some((i) => i === 'mcap')
                  "
                  class="flex-end text-12px pr-12px"
                  :class="pumpSetting.fontSize_mc =='12px'? 'mb-6px' : 'mb-6px'"
                >
                  <template v-if="isSoon && row.progress >= 99.99">
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
                  </template>
                  <template v-else>
                    <template v-if="pumpSetting?.define?.some((i) => i === 'vol')">
                      <div class="mr-5px color-[--secondary-text]" :style="{ 'font-size': pumpSetting.fontSize_mc }">V</div>
                      <span v-if="Number(row?.volume_u_24h) === 0 || row?.volume_u_24h == null" class="color-[--secondary-text]" >0</span>
                      <div v-else class="color-[---main-text]" :style="{ color: getDataColor('vol',row.volume_u_24h),'font-size': pumpSetting.fontSize_mc  }">
                        ${{ pumpSetting.isInt ? formatNumber(row.volume_u_24h || 0, { decimals: 0, l: 4, limit: 3, locale: 'en' }) : formatNumber(row.volume_u_24h || 0, {decimals: 2, locale: 'en' }) }}
                      </div>
                    </template>
                    <template v-if="pumpSetting?.define?.some((i) => i === 'mcap')">
                      <div
                        class="color-[--secondary-text] mr-5px ml-5px"
                        :style="{ 'font-size': pumpSetting.fontSize_mc }"
                      >
                        MC
                      </div>
                      <span v-if="Number(row?.market_cap) === 0 || row?.market_cap == null" class="color-[--secondary-text]" >0</span>
                      <span
                        v-else
                        :style="{ 'font-size': pumpSetting.fontSize_mc, color: getDataColor('mc',row.market_cap) }"
                        >${{ pumpSetting.isInt ? formatNumber(row.market_cap || 0, { decimals: 0, l: 4, limit: 3,  locale: 'en' }) : formatNumber(row.market_cap || 0, {decimals: 2, locale: 'en' }) }}</span
                      >
                    </template>
                  </template>
                </div>
                <div
                  v-if="pumpSetting?.define?.some((i) => i === 'txs')"
                  class="flex-end text-12px pr-12px"
                >
                  <div v-tooltip="$t('netInflow')" class="mr-5px color-[--secondary-text] ml-5px">N</div>
                  <span v-if="Number(row?.net_flow_vol) === 0 || row?.net_flow_vol == null" class="color-[--secondary-text]" >0</span>
                  <div v-else class="color-[--main-text]">
                    <ave-data-number :value="row?.net_flow_vol" :signVisible="true" classZero="color-[--main-text]">
                      {{ formatNumber(Math.abs(row?.net_flow_vol ?? 0), { decimals: 2, l: 4, limit: 3, locale: 'en' }) }}
                    </ave-data-number>
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
                    class="relative flex-end">
                    <div class="mr-5px color-[--secondary-text] ml-5px">Txs</div>
                    <span v-if="Number(row?.tx_24h_count) === 0 || row?.tx_24h_count == null" class="color-[--secondary-text]" >0</span>
                    <div v-else class="color-[--main-text]">
                      {{ formatNumber(row.tx_24h_count || 0, { decimals: 0, l: 4, limit: 3, locale: 'en' })}}
                    </div>
                    <el-progress
                      class="clickable w-20px ml-4px"
                      :class="row.tx_24h_count > 0 || (Number(row.buys_tx_24h_count) + Number(row.sells_tx_24h_count) > 0)? 'progress-bar' : 'progress-bar-disabled'"
                      :percentage="Number((row.buys_tx_24h_count ||0) / row.tx_24h_count * 100) || 0"
                      :show-text="false"
                      color="#12B886"
                      :stroke-width="3"
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
                    :row="row"
                    classNames="bg-[--up-color] color-#fff"
                    :size="pumpSetting.size_swap"
                    @jump="jump(row)"
                  />
                </div>
              </div>
            </div>
          </li>
        <!-- </TransitionGroup> -->
      </div>
       <AveEmpty v-if="tableList?.length == 0 && !loading" class="mt-200px" />
    </ul>
    <!-- <AveEmpty v-if="tableList?.length == 0 && !loading" class="mt-200px" /> -->
    <!-- </el-scrollbar> -->
    <transition name="fade">
      <span v-if="showBackTop" class="back-top text-12px flex items-center bg-[--main-bg] cursor-pointer" @click="scrollToTop">
          <Icon
          class="mr-4px text-14px color-[--third-text]"
          name="material-symbols-light:arrow-circle-up-rounded"
        />
        {{ $t('backToTop') }}
      </span>
    </transition>
    <el-popover
      v-model:visible="showPopSearch"
      :virtual-ref="$refs.currentBtnRef[currentIndex]"
      virtual-triggering
      popper-class="[--el-popover-bg-color:--border]"
    >
    <div class="py-4px [&&]:m--12px flex flex-col">
      <a :href="`https://x.com/search?q=${currentRow?.target_token}`" target="_blank" class="text-12px py-4px px-8px color-[--main-text] hover:bg-[--dialog-tab-active]">
        {{ $t('tweetSearchContractAddress') }}
      </a>
      <a :href="`https://x.com/search?q=$${currentRow?.symbol}`" target="_blank" class="text-12px py-4px px-8px color-[--main-text] hover:bg-[--dialog-tab-active]">
        {{ $t('tweetSearchContractAddress2') }}
      </a>
      <a :href="`https://www.google.com/search?q=${currentRow?.symbol}&tbm=nws`" target="_blank" class="text-12px py-4px px-8px color-[--main-text] hover:bg-[--dialog-tab-active]">
        {{ $t('tweetSearchContractAddress3') }}
      </a>
      <span class="text-12px py-4px px-8px color-[--main-text] hover:bg-[--dialog-tab-active] cursor-pointer" @click="handleSearchTokenName">{{ $t('tweetSearchContractAddress4') }}</span>
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
import { useSimilarTokenPopup } from '../utils'

const props = defineProps({
  tableList: {
    type: Array<PumpObj>,
    default: () => [],
  },
  quickBuyValue: {
    type: String,
    default: () => '',
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
})

const showPop = ref(false)
const selected = ref<PumpObj | null>(null)
// const btnRefs = ref<Record<string, HTMLElement | null>>({})
const currentBtnRef = ref<HTMLElement | null>(null)
const { tableList, quickBuyValue, loading, isOut, isSoon , type} = toRefs(props)
const router = useRouter()
const { token_logo_url } = useConfigStore()
const globalStore = useGlobalStore()
const { pumpSetting, pumpBlackList, lang, dialogVisible_search, dialogSearchText} = storeToRefs(globalStore)
const isPaused = defineModel<boolean>('isPaused')

const { t } = useI18n()
const { $createTooltip } = useNuxtApp()
const $refs = ref({
  currentBtnRef: {} as Record<number, any>,
})
const currentIndex = shallowRef(0)
const currentRow = ref<PumpObj | null>(null)
const showPopSearch= shallowRef(false)

const $tooltip = $createTooltip('bubble--tooltip')
const onEnter = useSimilarTokenPopup()


const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(tableList, {
  itemHeight: 110.8,
  // 必须增加过采样，否则 translateY(-20px) 向上移动时，
  // 顶部刚进入视口的节点会因为高度计算没到视口而无法渲染，导致动画“闪现”
  overscan: 5,
})
onUnmounted(() => {
  $tooltip?.hide?.()
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
  router.push({
    name: 'token-id',
    params: { id: row.target_token + '-' + row.chain },
  })
}
function addOrRemoveBlaclList(item: { token: string }, type: 'ca' | 'dev' | 'keyword') {
  if (pumpBlackList.value?.length > 499) {
    ElMessage.error(t('blacklistLimit'))
    return
  }
  if (pumpBlackList.value) {
    const findIndex = pumpBlackList.value?.findIndex(
      (i) => item.token == i.address && i.type == type
    )
    if (findIndex !== -1) {
      pumpBlackList.value.splice(findIndex, 1)
    } else {
      pumpBlackList.value.push({ address: item.token, type: type })
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

function summaryList(summary: string): string[] {
  return summary?.match(/\d\.[^0-9]*/g) || []
}

function buildTooltipContent(summary: string): string {
  const items = summaryList(summary)
  return items?.length > 0
    ? `
    <div class="max-w-[400px]">
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
const scrollbarRef = ref()
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
  // 1. 判断是否是插入了新数据（长度增加，或第一个元素 ID 变了）
  const new1 = newList?.[0]
  const old1 = oldList?.[0]
  const new1PairId = new1?.pair + '-' + new1?.chain
  const old1PairId = old1?.pair + '-' + old1?.chain

  if (new1PairId !== old1PairId) {
    lastPushTime.value = Date.now()
    newestId.value = new1PairId
  }
}, { deep: false }) // shallowRef 监听引用即可，性能最高

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
      <span class="color-[--main-text] text-12px ml-5px">
        ${formatNumber(value || 0, { decimals: 0, l: 4, locale: 'en' })}
        <span class="text-11px ml-4px">
          ${row.baseToken?.symbol ?? ''}
        </span>
      </span>
    </div>
  `
}
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
    padding: 15px 0 11px 12px;
    border-top: 1px solid var(--main-input-button-bg);
    border-radius: 4px;
    &:hover {
      background-color: var(--main-list-hover);
      .black-container {
        color: #959a9f;
        visibility: visible;
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
        border: 0.5px solid var(--main-input-button-bg);
        background: var(--secondary-bg);
      }
    }
    .pump-right {
      // box-shadow: -2px 0px 4px 0px #00000099;
      // background: var(--secondary-bg);
      min-width: 200px;
      position: absolute;
      right: 0;
      bottom: 18px;
      padding-left: 12px;
      padding-bottom: 5px;
      border: 1px solid;

      .btns-swap{
        // background-color: var(--secondary-bg);
        position: relative;
        z-index:1;
        bottom: -24px;
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
    visibility: hidden;
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
    --el-border-color-lighter: var(--secondary-text);
  }
}
</style>
