<!-- eslint-disable vue/no-mutating-props -->
<template>
  <el-table-column
    align="right"
    :width="$f.getTextWidth($t('flag_rug_pull'), 50) + 50"
    v-if="showRugAndChips"
  >
    <template #header>
      <span>{{ $t('flag_rug_pull') }}%</span>

      <headSort
        :defaultSort="filterForm['rug_pull']['rug_rate'].sort_dir === 'asc' ? 'ascending' : (filterForm['rug_pull']['rug_rate'].sort_dir === 'desc' ? 'descending' : '')"
        @sort-change="(sortOrder) => handleSortChange(sortOrder, filterForm['rug_pull']['rug_rate'])"
      />

      <filterToolbar :isActiveFilter="isActiveFilter('rug_pull')" :rangeTitle1="`${$t('flag_rug_pull') }%`" :rangeTitle2="`${$t('insiders')}%`" @reset="handleReset(filterForm['rug_pull'])" @confirm="getRangeList" />

      <el-popover
        v-if="false"
        placement="bottom"
        popper-class="chains-table-filter"
        title=""
        :width="350"
        trigger="click"
        v-model:visible="filterForm['rug_pull'].visible"
      >
        <template #reference>
          <i class="iconfont icon-guolv1 text-10px ml-3" :style="{color: isActiveFilter('rug_pull') ? 'var(--custom-primary-color)' : ''}"></i>
        </template>
        <template #default>
          <div class="filter-box" :class="$store.state.mode">
            <div class="text-12px font-400 filter-title">{{ $t('flag_rug_pull') }}%</div>
            <div class="flex mt-10">
              <el-input
                v-model.trim.number="filterForm['rug_pull']['rug_rate'].range[0]"
                :placeholder="$t('minor')"
                clearable
              ></el-input>
              <span class="ml-10 mr-10">~</span>
              <el-input
                v-model.trim.number="filterForm['rug_pull']['rug_rate'].range[1]"
                :placeholder="$t('max1')"
                clearable
              ></el-input>
            </div>
            <div class="mt-10 mb-20" style="padding: 0 10px;">
              <el-slider
                :style="{ '--el-slider-main-bg-color': 'var(--a-slider-bg-color)'}"
                v-model="filterForm['rug_pull']['rug_rate'].range"
                range
                :min="0"
                size="small"
                :max="filterForm['rug_pull']['rug_rate'].defaultRange[1]"
                :marks="{ 0: '0', [filterForm['rug_pull']['rug_rate'].defaultRange[1]]: $f.formatNumber2([filterForm['rug_pull']['rug_rate'].defaultRange[1]], 0, 4, 10 ** 4)}"
              />
            </div>
            <div class="text-12px font-400 filter-title mt-40">{{ $t('insiders') }}%</div>
            <div class="flex mt-10">
              <el-input
                v-model.trim.number="filterForm['rug_pull']['rat_rate'].range[0]"
                :placeholder="$t('minor')"
                clearable
              ></el-input>
              <span class="ml-10 mr-10">~</span>
              <el-input
                v-model.trim.number="filterForm['rug_pull']['rat_rate'].range[1]"
                :placeholder="$t('max1')"
                clearable
              ></el-input>
            </div>
            <div class="mt-10 mb-20" style="padding: 0 10px;">
              <el-slider
                :style="{ '--el-slider-main-bg-color': 'var(--a-slider-bg-color)'}"
                v-model="filterForm['rug_pull']['rat_rate'].range"
                range
                :min="0"
                size="small"
                :max="filterForm['rug_pull']['rat_rate'].defaultRange[1]"
                :marks="{ 0: '0', [filterForm['rug_pull']['rat_rate'].defaultRange[1]]: $f.formatNumber2([filterForm['rug_pull']['rat_rate'].defaultRange[1]], 0, 4, 10 ** 4)}"
              />
            </div>
            <div class="mt-60 flex">
              <div class="flex clickable" style="cursor: pointer;" @click="handleSort(filterForm[`rug_pull`],'','rug_rate',['rug_rate','rat_rate'])">
                <span class="filter-title">{{ $t('rugSort') }}</span>
                <div class="chain-icon-sort-container">
                  <svg
                    class="icon-svg"
                    aria-hidden="true"
                    :class="filterForm['rug_pull']['rug_rate'].sort_dir === 'asc' ? 'active' : ''"
                    @click.stop="handleSort(filterForm['rug_pull'], 'asc','rug_rate',['rug_rate','rat_rate'])"
                  >
                    <use xlink:href="#icon-sort-up"></use>
                  </svg>
                  <svg
                    class="icon-svg"
                    aria-hidden="true"
                    :class="filterForm['rug_pull']['rug_rate'].sort_dir === 'desc' ? 'active' : ''"
                    @click.stop="handleSort(filterForm['rug_pull'], 'desc','rug_rate',['rug_rate','rat_rate'])"
                  >
                    <use xlink:href="#icon-sort-down"></use>
                  </svg>
                </div>
              </div>
              <div class="flex clickable" style="cursor: pointer;" @click="handleSort(filterForm[`rug_pull`],'','rat_rate',['rug_rate','rat_rate'])">
                <span class="filter-title">{{ $t('insidersSort') }}</span>
                <div class="chain-icon-sort-container">
                  <svg
                    class="icon-svg"
                    aria-hidden="true"
                    :class="filterForm['rug_pull']['rat_rate'].sort_dir === 'asc' ? 'active' : ''"
                    @click.stop="handleSort(filterForm['rug_pull'], 'asc','rat_rate',['rug_rate','rat_rate'])"
                  >
                    <use xlink:href="#icon-sort-up"></use>
                  </svg>
                  <svg
                    class="icon-svg"
                    aria-hidden="true"
                    :class="filterForm['rug_pull']['rat_rate'].sort_dir === 'desc' ? 'active' : ''"
                    @click.stop="handleSort(filterForm['rug_pull'], 'desc','rat_rate',['rug_rate','rat_rate'])"
                  >
                    <use xlink:href="#icon-sort-down"></use>
                  </svg>
                </div>
              </div>
              <el-button
                size="default"
                style="height: 30px; min-width: 70px; margin-left: auto;--el-button-font-weight: 400;"
                :color="$store.state.mode !== 'dark' ? '#f2f2f2' : '#333333'"
                @click.stop="handleReset(filterForm['rug_pull'])"
              >
                {{ $t('reset') }}
              </el-button>
              <el-button
                size="default"
                :color="$store.state.mode !== 'dark' ? '#222222' : '#f5f5f5'"
                style="height: 30px; min-width: 70px;--el-button-font-weight: 400;"
                @click.stop="handleFilterConfirm(filterForm['rug_pull'])"
              >
                {{ $t('confirm') }}
              </el-button>
            </div>
          </div>
        </template>
      </el-popover>
    </template>
    <template #default="{ row }">
      <RugPullPop
        :dataSource="{
          rug_rate: row?.rug_rate,
          all_tag_rate: row?.all_tag_rate,
          phishing_rate: row?.phishing_rate,
          cluster_rate: row?.cluster_rate,
          boulder_rate: row?.boulder_rate,
          rugged: row?.rugged,
          total: row?.total,
          rat_rate: row?.rat_rate
        }"
      />
    </template>
  </el-table-column>
</template>

<script>
import RugPullPop from "../../component/rugPull.vue";
import headSort from "@/components/headSort/index.vue";

export default {
  name: "rugPullContent",
  components: {
    RugPullPop,
    headSort
  },
  props: {
    showRugAndChips: {
      type: Boolean,
      default: false
    },
    filterForm: {
      type: Object,
      required: true
    },
    isActiveFilter: {
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
  methods:{
    getRangeList(e){
      if(e.min1){
        this.filterForm['rug_pull']['rug_rate'].range[0] = e.min1;
      }
      if(e.max1){
        this.filterForm['rug_pull']['rug_rate'].range[1] = e.max1;
      }
      if(e.min2){
        this.filterForm['rug_pull']['rat_rate'].range[0] = e.min2;
      }
      if(e.max2){
        this.filterForm['rug_pull']['rat_rate'].range[1] = e.max2;
      }
      this.handleFilterConfirm(this.filterForm['rug_pull'])
    },
    handleSortChange(sortOrder, filterItem) {
      let sortDir = '';
      if (sortOrder === 'ascending') {
        sortDir = 'asc';
      } else if (sortOrder === 'descending') {
        sortDir = 'desc';
      }

      // 更新排序方向
      filterItem.sort_dir = sortDir;

      // 直接调用确认方法
      this.handleFilterConfirm(filterItem);
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-box {
  padding: 20px;

  &.dark {
    background-color: var(--el-bg-color);
    color: var(--el-text-color-primary);
  }
}

.filter-title {
  font-weight: 400;
  color: var(--a-text-1-color);
}

.flex {
  display: flex;
  align-items: center;
}

.mt-10 {
  margin-top: 10px;
}

.mt-40 {
  margin-top: 40px;
}

.mt-60 {
  margin-top: 60px;
}

.mb-20 {
  margin-bottom: 20px;
}

.ml-10 {
  margin-left: 10px;
}

.mr-10 {
  margin-right: 10px;
}

.text-10px {
  font-size: 10px;
}

.text-12px {
  font-size: 12px;
}

.font-400 {
  font-weight: 400;
}

.clickable {
  cursor: pointer;
}

.chain-icon-sort-container {
  display: flex;
  flex-direction: column;
  margin-left: 5px;

  .icon-svg {
    width: 10px;
    height: 10px;
    fill: var(--a-text-3-color);

    &.active {
      fill: var(--custom-primary-color);
    }
  }
}

:deep(.el-slider) {
  --el-slider-main-bg-color: var(--a-slider-bg-color);
}

:deep(.el-popover.chains-table-filter) {
  padding: 0;
  border-radius: 8px;
}
</style>