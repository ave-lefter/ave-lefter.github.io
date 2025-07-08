<template>
  <el-popover placement="left" popper-class="chains-table-filter" title="" :width="247" trigger="hover"
              :persistent="false">
    <template #reference>
      <span class="color-text-1" :style="{ color: dataSource.rug_rate > 60 ? '#F6465D' : '#999' }"><i
        class="iconfont icon-rug mr-2px" style="height: 13px; font-size: 13px;"></i>{{
          dataSource.rug_rate == -1 ?
            $t('unKnown1') : $f.formatNumber2(dataSource.rug_rate || 0, 2) + '%'
        }}</span>
    </template>
    <template #default>
      <div class="filter-box w-content" :class="$store.state.mode">
        <el-row align="middle" class="w-bugText">
          <el-col :span="24">
            <span>{{ $t('abnormalChips') }}&nbsp;:&nbsp;</span>
            <span> {{
                formateMin(dataSource.all_tag_rate) || $f.formatNumber2(dataSource.all_tag_rate || 0, 1)
              }}%</span>
          </el-col>
        </el-row>
        <template v-for="(item, index) in progressData" :key="item.label+index">
          <el-row align="middle" class="w-midText">
            <el-col :span="12" class="items-center" style="display: flex;">
              <img :src="item.icon" alt="" width="14" height="14" style="margin-right: 2px;">
              <span>{{ item.label }}:</span>
            </el-col>
            <el-col :span="12">
              <div class="m-run-progress-bar">
                <el-progress class="mr-5" :percentage="item.rate || 0" :stroke-width="4" color="#F6465D"
                             :show-text="false" style="width: 70px"/>
                <span class="progress-text">
                  {{ formateMin(item.rate) || $f.formatNumber2(item.rate || 0, 1) }}%
                </span>
              </div>
            </el-col>
          </el-row>
        </template>
        <div class="w-history" v-if="dataSource?.total">
          {{ $t('runPullHistory') }}&nbsp;:&nbsp;<span
          :style="!ruggedColor?{}:{color:ruggedColor}">{{ $f.formatNumber2(dataSource?.rugged || 0, 0) }}</span>/<span>{{
            $f.formatNumber2(dataSource?.total || 0, 0)
          }}</span>
          <el-tooltip effect="customized" placement="top" :popper-class="$store.state.mode">
            <template #content>{{ tooltipText }}</template>
            <i class="iconfont icon-jiancexiang font-14 ml-5" style="color: #999"></i>
          </el-tooltip>
        </div>
        <div class="w-footer">
          <img v-if="$store.state.mode === 'dark'" src="@/assets/images/logo1-140x38.5.png" alt="logo" height="14">
          <img v-else src="@/assets/images/logo2-140x38.5.png" alt="logo" height="14">
          <p>{{ $t('campaignTitle') }}</p>
        </div>
      </div>
    </template>
  </el-popover>
</template>

<script>
import BigNumber from 'bignumber.js';

export default {
  name: 'RugPull',
  data() {
    return {};
  },
  props: {
    dataSource: {
      type: Object,
      required: true
    },
  },
  methods: {
    // Add your component methods here
    formateMin(data) {
      if (typeof data === 'string' || typeof data === 'number') {
        const value = new BigNumber(data);
        if (value.lt(0.01) && value.gt(0)) {
          return '<0.01';
        } else {
          return false
        }
      } else {
        return false;
      }
    }
  },

  computed: {
    progressData() {
      return [
        {
          icon: require("@/assets/images/rugPull/insiders.svg"),
          label: this.$t('insiders'),
          rate: this.dataSource.rat_rate
        },
        {
          icon: require("@/assets/images/rugPull/phishing.svg"),
          label: this.$t('phishing1'),
          rate: this.dataSource.phishing_rate
        },
        {
          icon: require("@/assets/images/rugPull/cabal.svg"),
          label: this.$t('cabal'),
          rate: this.dataSource.cluster_rate
        },
        {
          icon: require("@/assets/images/rugPull/bundle.svg"),
          label: this.$t('bundle1'),
          rate: this.dataSource.boulder_rate
        },
      ]
    },
    tooltipText() {
      return this.$t('runPullHistoryTip', {
        y: this.$f.formatNumber2(this.dataSource?.rugged || 0, 0),
        x: this.$f.formatNumber2(this.dataSource?.total || 0, 0)
      })
    },
    ruggedColor() {
      // if(this.dataSource.rugged) return null
      // if(new BigNumber(this.dataSource.rugged).lt(2)) return '#F6465D'
      const data = this.dataSource.rugged
      if (typeof data === 'string' || typeof data === 'number') {
        const value = new BigNumber(data);
        if (value.lte(2) && value.gt(0)) {
          // 0< x <=2
          return false
        } else if (value.lte(10) && value.gt(2)) {
          // 2< x <=10
          return '#FFA622'
        } else if (value.gt(10)) {
          return '#F6465D'
        } else {
          return false
        }
      } else {
        return false;
      }
    }
  },
};
</script>

<style scoped lang="scss">
.rug-pull {
  /* Add your component styles here */
}

.m-run-progress-bar {
  display: flex;

  :deep() .el-progress-bar__outer {
    background-color: var(--d-333333-l-F2F2F2);
  }

  .progress-text {
    width: 40px;
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 12px;
    text-align: right;
    line-height: 16px;
    letter-spacing: -0.81px;
    color: var(--custom-font-1-color);
  }
}

.w-midText {
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0px;
  color: #666;
  margin-bottom: 16px;
}

.w-bugText {
  font-family: Poppins;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  height: 20px;
  letter-spacing: 0px;
  margin-bottom: 16px;
  /* color:var(--custom-font-1-color) */
}

.w-content {
  color: var(--custom-font-1-color);
  font-family: PingFang SC;
  margin-bottom: -10px;
}

.w-history {
  font-family: Poppins;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  height: 20px;
  letter-spacing: 0px;
  margin-bottom: 16px;
}

.w-footer {
  img {
    display: block;
    margin: 0 auto 6.89px auto;
  }

  p {
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 8px;
    line-height: 10px;
    height: 10px;
    letter-spacing: -0.43px;
    width: 100%;
    text-align: center;
  }
}
</style>
