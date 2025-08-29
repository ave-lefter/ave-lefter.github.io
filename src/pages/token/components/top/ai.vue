<template>
  <div class="AI">
    <!-- 概览 -->
    <div class="mt-20px" v-if="desc">
      <span class="title">{{ $t('AIOverview') }}</span>
      <div class="mt-10px relative text-wrapper">
        <div ref="textEl" :class="{ collapsed: !expanded }" class="text">
          {{ desc }}
        </div>
        <a
          v-if="isOverflow"
          href=""
          @click.stop.prevent="toggle"
          class="toggle-btn"
        >
          {{ expanded ? $t('Collapse') : $t('Expand') }}
        </a>
      </div>
    </div>

    <!-- 税费 -->
    <div class="mt-20px" v-if="props.obj.fee_structure">
      <span class="title">{{ $t('AITax') }}</span>
      <div class="mt-10px">
        <ul class="tax">
          <li v-if="props.obj.fee_structure.buy_fee">
            <span>{{ $t('buyTax') }}：</span>{{ props.obj.fee_structure.buy_fee }}
          </li>
          <li v-if="props.obj.fee_structure.sell_fee">
            <span>{{ $t('sellTax') }}：</span>{{ props.obj.fee_structure.sell_fee }}
          </li>
          <li v-if="props.obj.fee_structure.transfer_fee">
            <span>{{ $t('TransferTax') }}：</span>{{ props.obj.fee_structure.transfer_fee }}
          </li>
          <li v-if="props.obj.fee_structure.max_tx_amount">
            <span>{{ $t('MaxTxAmount') }}：</span>{{ props.obj.fee_structure.max_tx_amount }}
          </li>
          <li v-if="props.obj.fee_structure.max_wallet_amount">
            <span>{{ $t('MaxWalletAmount') }}：</span>{{ props.obj.fee_structure.max_wallet_amount }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 风险检查 -->
    <div class="mt-20px" v-if="props.riskList?.length > 0">
      <div class="flex-between">
        <span class="title">{{ $t('AIRiskCheck') }}</span>
        <span class="card-t">
          <span
            :class="riskList.filter((i) => i?.risk_level === -3)?.length > 0 ? 'red' : ''"
          >
            {{ riskList.filter((i) => i?.risk_level === -3)?.length || 0 }}
          </span>
          /{{ riskList.length }}
        </span>
      </div>

      <ul class="mt-10px">
        <li v-for="(i, index) in riskList" :key="index" class="card-list-item">
          <div class="flex-start">
            <div style="width: 20px">
              <img
                :src="getAssetsImagesUrl(riskStatus[i.risk_level])"
                width="12px"
                alt=""
              >
            </div>
            <div>
              <span class="risk-message">
                {{ isZh ? i.name_zh || '' : i.name_en || '' }}
                {{ i?.risk_removed === 1 ? `(${$t('riskRemoved')})` : '' }}
              </span>
            </div>
            <span style="flex:1"></span>
            <template v-if="i.code_snippet">
              <Icon
                v-if="showList[index]"
                class="ml-5 text-14px"
                name="material-symbols:keyboard-arrow-down-rounded"
                color="#999"
                @click="showList[index] = !showList[index]"
              />
              <Icon
                v-else
                class="ml-5 text-14px"
                name="material-symbols:keyboard-arrow-up-rounded"
                color="#999"
                @click="showList[index] = !showList[index]"
              />
            </template>
          </div>

          <template v-if="showList[index]">
            <Code v-if="i.code_snippet" :code="i.code_snippet" :show="showList[index]"  language="solidity"/>
            <div class="color-999 text-12px">
              {{ isZh ? i.description_zh || '' : i.description_en || '' }}
            </div>
          </template>
        </li>
      </ul>
    </div>

    <!-- 管理员控制 -->
    <div class="mt-20px" v-if="ownerControl">
      <span class="title">
        {{ $t('AIAdmin') }}
        <template v-if="props.obj?.summary?.is_owner_renounced === 1">
          ({{ $t('Renounced') }})
        </template>
      </span>
      <div class="mt-10px color-999 text-12px">
        {{ ownerControl }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Code from './code.vue'

// ---------------- Props 定义 ----------------
interface FeeStructure {
  buy_fee?: number
  sell_fee?: number
  transfer_fee?: number
  max_tx_amount?: number
  max_wallet_amount?: number
}

interface ObjType {
  mechanism_zh?: string
  mechanism_en?: string
  ownerControl?: string[]
  summary?: { is_owner_renounced?: number }
  fee_structure?: FeeStructure
}

interface Risk {
  code_snippet?: string
  description_en: string
  description_zh: string
  is_related_to_owner: boolean
  name_en: string
  name_zh: string
  risk_level: number
  risk_removed: number
}

const props = defineProps<{
  obj: ObjType
  riskList: Risk[]
}>()

const globalStore = useGlobalStore()
const language = computed(() => globalStore.lang)
const isZh = computed(() => language.value === 'zh-cn' || language.value === 'zh-tw')

const riskStatus: Record<string, string> = {
  '1': 'normal1',
  '0': 'normal1',
  '-1': 'normal-half',
  '-2': 'warning1',
  '-3': 'danger1',
}
const expanded = ref(false)
const isOverflow = ref(false)
const textEl = ref<HTMLElement | null>(null)

const showList = ref<boolean[]>(props.riskList?.map(i => i.risk_level < -1) || [])

const desc = computed(() => {
  return isZh.value ? props.obj.mechanism_zh || '' : props.obj.mechanism_en || ''
})

const ownerControl = computed(() => {
  return props.obj.ownerControl?.join('、') || ''
})

const toggle = () => {
  expanded.value = !expanded.value
}

const checkOverflow = () => {
  nextTick(() => {
    const el = textEl.value
    if (!el) return
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight)
    const maxHeight = lineHeight * 3
    isOverflow.value = el.scrollHeight > maxHeight + 1
  })
}
onMounted(() => {
  checkOverflow()
  window.addEventListener('resize', checkOverflow)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkOverflow)
})
//获取assets下的图片
function getAssetsImagesUrl(id: string) {
  // 使用 import.meta.glob 引入所有图片
  const imageMap = import.meta.glob('@/assets/images/check-*.svg', {
    eager: true,
    import: 'default',
  }) as Record<string, string>
  // 根据 ID 找到图片路径
  const imageUrl =
    Object.entries(imageMap).find(([key]) =>
      key.endsWith(`check-${id}.svg`)
    )?.[1] || ''
  return imageUrl
}
</script>

<style lang="scss" scoped>
.AI {
  color: var(--d-999-l-666);
  font-size: 14px;
  font-style: normal;
  line-height: 20px; /* 142.857% */
  margin-bottom: 20px;
  .title {
    color: var(--d-F5F5F5-l-333);
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px; /* 150% */
  }
  ul.tax {
    list-style: disc;
    padding-left: 15px;
    li {
      list-style: disc;
      padding: 5px 0;
      font-size: 12px;
      span {
        font-size: 14px;
      }
    }
  }
  .line-through {
    text-decoration: line-through;
  }
}
.red {
  color: #ec4343;
}
.card-list-item {
  .flex-start {
    display: flex;
    align-items: baseline;
    justify-content: flex-start;
  }
  margin-bottom: 16px;

  .ml-5{
    margin-left: 5px
  }
  .icon-svg {
    width: 20px;
    height: 20px;
    font-size: 20px;
  }
}
.text-wrapper {
  max-width: 100%;
}
.text {
  transition: all 0.3s;
  overflow: hidden;
}
.collapsed {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.toggle-btn {
  font-size: 12px;
  position: absolute;
  right: 3px;
  bottom: -2px;
  color: var(--d-F5F5F5-l-333);
  background: var(--d-111-l-FFF);
  padding: 2px 7px;
}
</style>
