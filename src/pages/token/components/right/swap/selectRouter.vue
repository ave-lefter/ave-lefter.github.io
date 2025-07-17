<template>
  <el-dialog v-model="show" class="dialog-zixuan dialog" width="600px">
    <template #header>
      <span>{{ $t('selectRouter') }}</span>
    </template>
    <ul>
      <li class="token-item header">
        <span class="flex-3">{{ $t('router') }}</span>
        <span class="flex-1-5">
          {{ isAmount ? $t('expectedAmount') : $t('expectedPay')  }}
        </span>
        <span class="flex-1 right-label">{{ $t('priceImpact') }}</span>
        <span class="w-16px" />
      </li>
      <el-empty v-show="listRouter && listRouter.length === 0" :image="imageEmptyBlack" />
      <a
        v-for="(item, index) in listRouter"
        :key="index"
        href=""
        @click.stop.prevent="getSelectedRouter(index)"
      >
        <li class="token-item">
          <div class="path-list flex-start flex-3">
            <template v-for="(i, k) in (item?.path || [])" :key="k">
              <span v-if="i.symbol">{{ i.symbol }}</span>
              <div v-if="i.nextAmm && i.nextAmm !== 'unknown'" class="path-amm">
                <el-image
                  :src="formatIconSwap(i.nextAmm)"
                  class="w-14px h-14px rd-10px mb-3px"
                  style="width: 14px; height: 14px; border-radius: 10px; margin-bottom: 3px"
                >
                  <template #error>
                    <img
                      class="w-14px rd-10px"
                      src="/icon-default.png"
                    >
                  </template>
                  <template #placeholder>
                    <img
                      class="w-14px rd-10px"
                      src="/icon-default.png"
                    >
                  </template>
                </el-image>
                <img
                  class="w-15px mr-5px"
                  src="@/assets/images/arrow-right.svg"
                  alt=""
                  srcset=""
                >
              </div>
            </template>
            <div v-if="index === 0" class="tag">{{ $t('best') }}</div>
          </div>
          <span class="flex-1-5" v-html="formatNumber(item?.amount || 0)"/>
          <span
            v-if="Number(item?.priceImpact || 0) < 10"
            class="right-label flex-1"
            :style="{ color: formatPriceImpactColor(Number(item.priceImpact || 0)) }"
          >
            <template v-if="Number(item.priceImpact) < 0.01">&lt;0.01%</template>
            <template v-else>{{ formatNumber(Number(item?.priceImpact || 0)) }}%</template>
          </span>
          <span
            v-else
            class="right-label flex-1"
            :style="{ color: formatPriceImpactColor(Number(item?.priceImpact || 0)) }"
          >
            <template v-if="Number(item.priceImpact) > 40">&gt;40%</template>
            <template v-else>{{ formatNumber(Number(item?.priceImpact || 0), 2) }}%</template>
          </span>
          <el-icon v-if="selectedRouterIndex === index" :size="16" color="#12B886">
            <Select />
          </el-icon>
          <el-icon v-else style="opacity: 0" :size="16" color="#12B886"><Select /></el-icon>
        </li>
      </a>
    </ul>
  </el-dialog>
</template>

<script lang="ts" setup>
import imageEmptyBlack from '@/assets/images/empty-black.svg'
import {Select} from '@element-plus/icons-vue'
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  listRouter: {
    type: Array as PropType<Array<{
      path: Array<{
        symbol: string
        nextAmm: string
      }>
      amount?: string | number
      priceImpact?: number | string
    }>>,
    default: () => {
      return []
    }
  },
  isAmount: {
    type: Boolean,
    default: false
  },
  selectedRouterIndex: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['getSelectedRouter', 'update:visible'])

const show = computed({
  get() {
    return props.visible
  },
  set(value) {
    emit('update:visible', value)
  }
})

const getSelectedRouter = (index: number) => {
  emit('getSelectedRouter', index)
}

function formatPriceImpactColor(priceImpact: number) {
  if (priceImpact > 40) {
    return '#ff646d'
  } else if (priceImpact > 10) {
    return '#F7933F'
  } else if (priceImpact > 5) {
    return '#f8be46'
  } else {
    return ''
  }
}

</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  display: block;
  &:hover {
    // background-color: #212847;
    background: var(--d-1A1A1A-l-F2F2F2)
  }
}
.path-amm {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.token-item {
  font-size: 14px;
  display: flex;
  align-items: center;
  color: var(--d-F5F5F5-l-333);
  letter-spacing: 0;
  font-weight: 400;
  padding: 14px 0;
  &.header {
    color: #787b86;
  }
  &:active {
    opacity: 0.5;
  }
  .flex-1 {
    flex: 1;
  }
  .flex-1-5 {
    flex: 1.5;
  }
  .flex-3 {
    flex: 3;
  }
  .icon-token {
    margin-right: 7px;
  }
  .minor {
    font-size: 12px;
    color: #999999;
    letter-spacing: 0;
    font-weight: 400;
    margin-top: 2px;
  }
}
.tag {
  font-size: 10px;
  color: #eaecef;
  letter-spacing: 0;
  font-weight: 400;
  background: #12b886;
  border: 0.5px solid #12b886;
  border-radius: 8px;
  padding: 2px 5px;
  margin-left: 5px;
}
</style>
