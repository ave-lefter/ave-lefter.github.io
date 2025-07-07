<!-- eslint-disable vue/no-duplicate-attributes -->
<template>
  <el-table-column
    v-if="['hot', 'gainer', 'new'].includes?.(activeCategory)"
    :label="$t('security')"
    :width="$f.getTextWidth($t('security'), 50) + 25"
    align="center"
  >
    <template #default="{ row }">
      <div class="icon-container">
        <div class="security-icon">
          <el-tooltip
            effect="customized"
            placement="top"
            v-if="row.risk_level == -1 || row.risk_score >55"
            :popper-class="$store.state.mode"
          >
            <template #content>
              <ul v-if="row.checkResult && formatRisk(row.checkResult)?.length > 0">
                <li
                  v-for="(item, index) in formatRisk(row.checkResult)"
                  :key="index"
                  class="card-list-item flex-start mb-5"
                  :class="{ 'line-through': item[2] }"
                >
                  <svg class="icon-svg1" style="cursor: default;width: 15px; height: 15px;margin-right: 3px" aria-hidden="true">
                    <use :xlink:href="`#icon-${riskStatus[item[0]]}`" />
                  </svg>
                  <span class="risk-message">{{ item[1] }}</span>
                </li>
              </ul>
              <span v-else>--</span>
            </template>
            <svg
              class="icon-svg1"
              aria-hidden="true"
              v-if="row.risk_level == -1 || row.risk_score >= 60"
            >
              <use xlink:href="#icon-weixian"></use>
            </svg>
            <svg
              class="icon-svg1"
              aria-hidden="true"
              v-else-if="row.risk_score > 55 && row.risk_score < 60"
            >
              <use xlink:href="#icon-jinggao1"></use>
            </svg>
          </el-tooltip>
          <template v-else>
            <svg
              class="icon-svg1"
              aria-hidden="true"
              v-if="row.risk_score > 0 && row.risk_score <= 55"
            >
              <use xlink:href="#icon-anquan"></use>
            </svg>
            <svg class="icon-svg1" aria-hidden="true" v-else-if="row.risk_score == 0">
              <use xlink:href="#icon-unknownRisk1"></use>
            </svg>
          </template>
        </div>

        <div class="separator-line" v-if="false"></div>

        <div class="dex-icon" v-if="false">
          <el-tooltip
            effect="customized"
            :content="row.amm"
            placement="top"
            v-if="row.amm"
            :popper-class="$store.state.mode"
          >
            <i
              class="iconfont icon-unknown color-text-2 font-20"
              style="font-size: 16px; margin-right: 3px; line-height: 16px"
              v-if="row.amm === 'unknown'"
            ></i>
            <a
              v-else
              :href="$f.formatSwapUrl(row.token, row.chain, row.amm)"
              @click.stop
              target="_blank"
              class="icon-a"
              rel="noopener noreferrer"
            >
              <img
                v-if="row.chain"
                style="width: 16px; height: 16px;"
                class="icon-svg icon-symbol"
                :src="$f.formatIconSwap(row.amm)"
                onerror="this.src='/icon-default.png'"
                height="16"
              />
            </a>
          </el-tooltip>
        </div>
      </div>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: "securityContent",
  props: {
    activeCategory: {
      type: String,
      default: ''
    },
    riskStatus: {
      type: Object,
      default: () => ({
        0: 'anquan',
        0.5: 'normal',
        0.6: 'unknownRisk1',
        1: 'jinggao1',
        2: 'weixian'
      })
    },
    formatRisk: {
      type: Function,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-svg1 {
  width: 16px;
  height: 16px;
  fill: currentColor;
  overflow: hidden;
  cursor: pointer;
  border-radius: 50%;
}
.icon-svg {
  border-radius: 50%;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.security-icon, .dex-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.separator-line {
  width: 1px;
  height: 16px;
  background-color: var(--a-border-color, #444);
  margin: 0 8px;
}

.card-list-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 5px;

  &.line-through {
    text-decoration: line-through;
  }

  .risk-message {
    font-size: 12px;
    word-break: break-word;
  }
}

// 风险图标颜色
:deep(#icon-weixian) {
  fill: var(--custom-danger-color);
}

:deep(#icon-jinggao1) {
  fill: var(--custom-warning-color);
}

:deep(#icon-anquan) {
  fill: var(--custom-success-color);
}

:deep(#icon-unknownRisk1) {
  fill: var(--a-text-3-color);
}

:deep(#icon-normal) {
  fill: var(--a-text-2-color);
}

// tooltip 样式
.el-tooltip__popper {
  max-width: 300px;

  ul {
    padding-left: 0;
    margin: 0;
    list-style: none;
  }
}

.flex-start {
  display: flex;
  align-items: flex-start;
}

.mb-5 {
  margin-bottom: 5px;
}
</style>


<style lang="scss">
.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>