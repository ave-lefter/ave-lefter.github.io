<template>
  <el-table-column
    align="right"
    width="90"
  >
    <template #header>
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
    <template #default="{ row }">
      <div :style="{color: formatColor($f.formatTimeFromNow(row?.created_at, true))}">
        <template v-if="!row?.created_at">
          -
        </template>
        <template v-else-if="$f.formatTimeFromNow(row?.created_at, true) >= 60">
          {{ $f.formatTimeFromNow(row?.created_at) }}
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
    </template>
  </el-table-column>
</template>

<script>
import headSort from "@/components/headSort/index.vue";
export default {
  name: "openTimeContent",
  components: {
    headSort
  },
  props: {
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
  methods: {
    formatColor(val){
      if(val < 3600) return '#FFA622';
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
  }
}
</script>
