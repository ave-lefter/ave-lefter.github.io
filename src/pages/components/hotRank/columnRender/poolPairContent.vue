<template>
  <!-- fixed="left" -->
  <el-table-column :label="$t('poolPair')" min-width="300" fixed="left">
    <template #header>
      <span class="text-10px" style="opacity: 0;">0</span>
      <span>{{ $t('poolPair') }}</span>
      /
      <span>{{ $t('openTime') }}</span>

      <headSort
        :defaultSort="filterForm['created_at'].sort_dir === 'asc' ? 'ascending' : (filterForm['created_at'].sort_dir === 'desc' ? 'descending' : '')"
        @sort-change="(sortOrder) => handleSortChange(sortOrder)"
      />

      <el-popover
        placement="bottom"
        popper-class="chains-table-filter"
        title=""
        :width="300"
        trigger="click"
        v-model:visible="filterForm['created_at'].visible"
      >
        <template #reference>
          <i class="iconfont icon-guolv1 text-10px ml-3" :style="{color: isActiveFilter('created_at') ? 'var(--custom-primary-color)' : ''}"></i>
        </template>
        <template #default>
          <div class="filter-box" :class="$store.state.mode">
            <div class="text-12px font-400 filter-title">{{ $t('openTime') }}</div>
            <div class="flex mt-10">
              <ul class="openTime">
                <li v-for="(item, index) in openTimeList" :key="index">
                  <a href @click.stop.prevent="handleTimeConfirm(filterForm['created_at'], item.value)">
                    {{ item.text }}
                  </a>
                </li>
              </ul>
            </div>
            <div class="flex mt-10">
              <el-input
                v-model.trim.number="filterForm['created_at'].range[0]"
                clearable
                type="text"
                @input="value => filterForm['created_at'].range[0] = value.replace(/\-|[^\d.]/g, '')"
              >
                <template #append>h</template>
              </el-input>
              <span class="ml-10 mr-10">~</span>
              <el-input
                v-model.trim.number="filterForm['created_at'].range[1]"
                clearable
                type="text"
                @input="value => filterForm['created_at'].range[1] = value.replace(/\-|[^\d.]/g, '')"
              >
                <template #append>h</template>
              </el-input>
            </div>
            <div class="mt-40 flex">
              <div class="flex clickable" v-if="false" style="cursor: pointer;" @click="handleSort(filterForm[`created_at`])">
                <span class="filter-title">{{ $t('sort') }}</span>
                <div class="chain-icon-sort-container">
                  <svg
                    class="icon-svg"
                    aria-hidden="true"
                    :class="filterForm['created_at'].sort_dir === 'asc' ? 'active' : ''"
                    @click.stop="handleSort(filterForm['created_at'], 'asc')"
                  >
                    <use xlink:href="#icon-sort-up"></use>
                  </svg>
                  <svg
                    class="icon-svg"
                    aria-hidden="true"
                    :class="filterForm['created_at'].sort_dir === 'desc' ? 'active' : ''"
                    @click.stop="handleSort(filterForm['created_at'], 'desc')"
                  >
                    <use xlink:href="#icon-sort-down"></use>
                  </svg>
                </div>
              </div>
              <el-button
                size="default"
                style="height: 30px; min-width: 70px;--el-button-font-weight: 400; margin-left: auto"
                :color="$store.state.mode !== 'dark' ? '#f2f2f2' : '#333333'"
                @click.stop="handleReset(filterForm['created_at'])"
              >
                {{ $t('reset') }}
              </el-button>
              <el-button
                size="default"
                :color="$store.state.mode !== 'dark' ? '#222222' : '#f5f5f5'"
                style="height: 30px; min-width: 70px;--el-button-font-weight: 400;"
                @click.stop="handleFilterConfirm(filterForm['created_at'])"
              >
                {{ $t('confirm') }}
              </el-button>
            </div>
          </div>
        </template>
      </el-popover>
    </template>
    <template #default="{ row, $index }">
      <router-link :to="{name: 'Token', params: { id: row.target_token + '-' + row.chain } }" @click.stop.prevent>
        <div
          class="token-info table-item_d"
          style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
        >
          <span class="text-10px" v-if="$index < 9" style="opacity: 0;">0</span>
          <span class="text-10px mr-5" style="color: #696E7C">
            #{{ (pageNO - 1) * pageSize + $index + 1 }}
          </span>
          <i
            v-if="$store.state.currentAccount || $store.state.bot?.userInfo?.evmAddress"
            class="iconfont icon-collect"
            :class="{
              collected: row.is_fav
            }"
            @click.stop.prevent="$emit('collect',row)"
          ></i>
          <div class="icon-token-container" style="margin-right: 10px">
            <el-image class="token-icon" :src="$f.formatIcon(row, row.target_token == row.token0_address ? row.token0_symbol : row.token1_symbol)">
              <template #error>
                <!-- <img class="token-icon" src="/icon-default.png" /> -->
                <div class="token-icon" style="line-height: 32px; text-align: center; font-size: 16px; color: #fff" :style="{background: $f.getChainDefaultIconColor(row?.chain)}">{{ (row.target_token == row.token0_address ? row.token0_symbol : row.token1_symbol)?.slice(0, 1)?.toUpperCase?.() || '' }}</div>
              </template>
              <template #placeholder>
                <div class="token-icon" style="line-height: 32px; text-align: center; font-size: 16px; color: #fff" :style="{background: $f.getChainDefaultIconColor(row?.chain)}">{{ (row.target_token == row.token0_address ? row.token0_symbol : row.token1_symbol)?.slice(0, 1)?.toUpperCase?.() || '' }}</div>
              </template>
            </el-image>
            <img
              v-if="row?.network || row?.chain"
              class="icon-svg icon-symbol"
              :src="`${$store.state.s3BaseUrl}chain/${row.chain}.png`"
              alt=""
              onerror="this.src='/icon-default.png'"
              lazy
              srcset=""
            />
          </div>
          <div>
            <div class="flex-start">
              <span class="token-symbol ellipsis" style="font-size: 14px;">
                {{ row.target_token == row.token0_address ? row.token0_symbol : row.token1_symbol }}
              </span>
              <span style="color: var(--a-text-2-color); font-size: 10px;">
                /{{
                  row.target_token == row.token0_address ? row.token1_symbol : row.token0_symbol
                }}
              </span>
              <i class="iconfont icon-copy text-12px" style="color: #666;margin-left: 3px;" @click.stop.prevent v-copy="row.target_token"></i>


              <div class="flex-start" style="margin-left: 2px;">
                <!-- <i
                  class="iconfont icon-unknown color-text-2"
                  style="font-size: 14px;"
                  v-if="row.amm === 'unknown'"
                ></i>
                <span v-else>
                  <img
                    v-if="row.issue_platform"
                    style="width: 14px; height: 14px;border-radius: 50%;"
                    :src="$f.formatIconSwap(row.amm)"
                    onerror="this.src='/icon-default.png'"
                    height="14"
                  />
                </span> -->
                <img
                    v-if="row.issue_platform"
                    style="width: 10px; height: 10px;border-radius: 50%;"
                    :src="$f.formatIconSwap1(row.issue_platform)"
                    onerror="this.src='/icon-default.png'"
                    height="14"
                  />
              </div>

              <el-tooltip
                effect="customized"
                placement="top"
                :popper-class="$store.state.mode"
                v-if="row?.lp_locked_percent > 0 && row?.lp_locked_percent <= 100"
              >
                <template #content>
                  <ul>
                    <li class="card-list-item flex-start mb-5" v-if="row.lp_holders">
                      <span class="risk-message"> LP {{ $t('holders') }}: {{ row.lp_holders }} </span>
                    </li>
                    <li class="card-list-item flex-start mb-5" v-if="row.lp_locked_percent >0">
                      <span class="risk-message"> {{ $t('LPLocked') }}: {{ $f.formatNumber2(row.lp_locked_percent,0) }}% </span>
                    </li>
                    <li class="card-list-item flex-start mb-5" v-if="row.lp_lock_platform">
                      <span class="risk-message">{{ $t('platform') }}: {{ row.lp_lock_platform }} </span>
                    </li>
                    <li class="card-list-item flex-start mb-5" v-if="row.lp_locked_to">
                    <span class="risk-message"> {{ $t('unlockDate') }}:  {{ $f.formatDate(row.lp_locked_to / 1000, 'YYYY-MM-DD') }} </span>
                    </li>
                  </ul>
                </template>
                <el-progress
                  class="progress"
                  type="circle"
                  :percentage="row?.lp_locked_percent"
                  color="var(--custom-primary-color)"
                  :width="14"
                  :stroke-width="1.5"
                  indeterminate
                >
                  <svg class="icon-suo1" aria-hidden="true">
                    <use xlink:href="#icon-suo1"></use>
                  </svg>
                </el-progress>
              </el-tooltip>
              <template v-if="false">
                <template v-for="(i, index) in row.normal_tag" :key="index">
                  <el-image class="token-icon-tag" :src="$f.formatIconTag(i.tag)" lazy  @mouseover.stop="(e) => {buttonTagRef = e.currentTarget; toolTipTagVisible = true; toolTipTagContent = $t(`${i.tag}`);}"  @mouseleave.stop="(e) => (toolTipTagVisible = false)">
                    <template #error>
                      <img class="token-icon-tag" src="/icon-default.png" lazy />
                    </template>
                    <template #placeholder>
                      <img class="token-icon-tag" src="/icon-default.png" lazy />
                    </template>
                  </el-image>
                  <span v-if="i?.showText" :style="{color: i?.color=='green'? $store.getters.upColor[7]: $store.getters.downColor[7] }" class="text-10px ml-3">
                      {{ $t(i?.tag) }}
                  </span>
                </template>
              </template>





              
            </div>
            <div class="font_10 color-icon flex-start mt_4" style="line-height: 1;" @click.stop>
              <div :style="{color: formatColor($f.formatTimeFromNow(row?.created_at, true)), marginRight: '4px', fontSize: '11px', width: '15px'}">
                <template v-if="!row?.created_at">
                  -
                </template>
                <template v-else-if="$f.formatTimeFromNow(row?.created_at, true) >= 60">
                  {{ $f.formatTimeFromNow1(row?.created_at) }}
                </template>
                <van-count-down
                  v-else-if="row?.created_at && $f.formatTimeFromNow(row?.created_at, true) < 60"
                  :time="(60 - $f.formatTimeFromNow(row?.created_at, true)) * 1000"
                  style="--van-count-down-text-color: currentColor"
                >
                  <template #default="{ total }">
                    <template v-if="total > 0">
                      {{ Math.floor(($f.formatTimeFromNow(row?.created_at, true) + 60 * 1000 - total) / 1000) }} s
                    </template>
                    <template v-else>
                      {{ $f.formatTimeFromNow(row?.created_at) }}
                    </template>
                  </template>
                </van-count-down>
              </div>

              <div class="media-list flex-start ml-2" v-if="row?.medias?.length >0">
                <template v-for="(item, index) in row?.medias" :key="index">
                  <div class="ml-2" v-if="item.url" @mouseover.stop="(e) => {buttonTagRef = e.currentTarget; toolTipTagVisible = true; toolTipTagContent = item.url;}"  @mouseleave.stop="(e) => (toolTipTagVisible = false)">
                    <span class="media-item" v-if="item.name === 'QQ'">
                      <i class="iconfont icon-QQ text-12px"></i>
                    </span>

                    <a class="media-item" :href="item.url" target="_blank" v-else>
                      <i class="iconfont text-12px" :class="`icon-${item.icon}`"></i>
                    </a>
                  </div>
                </template>
              </div>
              <template v-if="row.signal_arr?.length > 0">
                <div class="flex" v-for="(i, index) in row.signal_arr" :key="index" @mouseover.stop="(e) => {buttonTagRef = e.currentTarget; toolTipTagVisible = true; toolTipTagContent = $f.getTagTooltip(i);}"  @mouseleave.stop="(e) => (toolTipTagVisible = false)">
                  <el-image class="token-icon-signal-tag" :src="$f.formatIconTag(i.tag)" lazy >
                    <template #error>
                      <img class="token-icon-signal-tag" src="/icon-default.png" lazy />
                    </template>
                    <template #placeholder>
                      <img class="token-icon-signal-tag" src="/icon-default.png" lazy />
                    </template>
                  </el-image>
                  <span class="ml-2" :style="{color: i.color=='green'? $store.getters.upColor[7]: $store.getters.downColor[7] }">
                    <template v-if="i.tag">{{ $t(i.tag) }}</template>
                  </span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </router-link>
    </template>
  </el-table-column>

  <el-tooltip
      ref="tooltipRef1"
      :visible="toolTipTagVisible"
      :content="toolTipTagContent"
      placement="top"
      :popper-class="$store.state.mode"
      effect="customized"
      :virtual-ref="buttonTagRef"
      virtual-triggering
    >
    </el-tooltip>
</template>

<script>
import headSort from "@/components/headSort/index.vue";
import { CountDown } from 'vant'
export default {
  name: "poolPairContent",
  components: {
    headSort,
    'van-count-down': CountDown
  },
  props: {
    pageNO: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      required: true
    },
    // 添加来自openTimeContent的props
    filterForm: {
      type: Object,
      required: true
    },
    openTimeList: {
      type: Array,
      default: () => []
    },
    isActiveFilter: {
      type: Function,
      required: true
    },
    handleTimeConfirm: {
      type: Function,
      required: true
    },
    handleSort: {
      type: Function,
      required: true
    },
    handleReset: {
      type: Function,
      required: true
    },
    handleFilterConfirm: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      buttonTagRef: null,
      toolTipTagVisible: false,
      toolTipTagContent: ''
    }
  },
  methods: {
    // 添加来自openTimeContent的方法
    formatColor(val){
      if(val < 3600 * 24) return '#FFA622';
      return 'var(--a-text-2-color)';
    },
    // 处理排序变化的方法
    handleSortChange(sortOrder) {
      let sortDir = '';
      if (sortOrder === 'ascending') {
        sortDir = 'asc';
      } else if (sortOrder === 'descending') {
        sortDir = 'desc';
      }

      // 更新排序方向
      this.filterForm['created_at'].sort_dir = sortDir;

      // 直接调用确认方法
      this.handleFilterConfirm(this.filterForm['created_at']);
    }
  },
  emits: ['collect']
}
</script>

<style lang="scss" scoped>
.token-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.icon-token-container {
  position: relative;
  width: 32px;
  height: 32px;
}

.token-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.icon-symbol {
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid var(--a-bg-1-color);
}

.token-symbol {
  max-width: 80px;
  font-weight: 500;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.flex-start {
  display: flex;
  align-items: center;
}

.progress {
  margin-left: 3px;
  :deep().el-progress__text {
    min-width: 12px;
  }

  .icon-suo1 {
    width: 8px;
    height: 8px;
  }
}


.icon-svg1{
  width: 16px;
  height: 16px;
  vertical-align: middle;
}
.token-icon-tag {
  width: 10px;
  height: 10px;
  margin-left: 5px;
  border-radius: 2px;
}

.token-icon-signal-tag {
  width: 12px;
  height: 12px;
  margin-left: 5px;
  border-radius: 2px;
}

.font_10 {
  font-size: 10px;
}

.color-icon {
  color: var(--a-text-3-color);
}

.mt_4 {
  margin-top: 4px;
}

.ml-2 {
  margin-left: 2px;
}

.ml-3 {
  margin-left: 3px;
}

.mr-5 {
  margin-right: 5px;
}

.mb-5 {
  margin-bottom: 5px;
}

.text-10px {
  font-size: 10px;
}

.text-12px {
  font-size: 12px;
}

.media-list {
  display: flex;
  align-items: center;
}

.media-item {
  color: var(--a-text-3-color);

  &:hover {
    color: var(--custom-primary-color);
  }
}

.card-list-item {
  margin-bottom: 5px;
}

.risk-message {
  font-size: 12px;
  color: var(--a-text-1-color);
}

.icon-collect {
  margin-right: 5px;
  font-size: 12px;
  color: var(--a-bg-6-color);
  cursor: pointer;

  &.collected {
      color: #ffbb19;
  }
}
</style>
