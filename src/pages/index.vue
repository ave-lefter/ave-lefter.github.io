<script setup lang="ts">
import ChainsSelect from './components/chainsSelect.vue'
import CategoryTabs from './components/categoryTabs.vue'
import hot from './components/hotRank/hot.vue'
import { getTreasureConfig, type IGetTreasureConfig } from '~/api/market'

const components = {
  hot,
  pump:defineAsyncComponent(()=>import('./components/pump/pump.vue'))
}
const activeTab = shallowRef<keyof typeof components>('hot')
const activeChain = shallowRef('AllChains')
const chains = shallowRef<IGetTreasureConfig[]>([])
const categories = computed(()=>{
  return chains.value.find(el => el.net_name === activeChain.value)
  ?.categories || []
})

onMounted(() => {
  _getTreasureConfig()
})
const wsStore = useWSStore()
// 把榜单的订阅取消掉
onUnmounted(() => {
  wsStore.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: ['price_extra'],
    id: 1,
  })
})

async function _getTreasureConfig() {
  const res = await getTreasureConfig()
  chains.value = res || []
}

const { t } = useI18n()
function listMapFunction(i: Record<string, any>) {
  const time_arr = ['1m', '5m', '15m', '1h', '4h', '24h']
  const progress_obj: Record<string, any> = {}
  time_arr.forEach((t) => {
    ;(progress_obj[`progress_buys_tx_${t}_count`] =
      i[`sells_tx_${t}_count`] + i[`buys_tx_${t}_count`] > 0
        ? (i[`buys_tx_${t}_count`] / (i[`sells_tx_${t}_count`] + i[`buys_tx_${t}_count`])) * 100
        : 0),
      (progress_obj[`progress_sells_tx_${t}_count`] =
        i[`sells_tx_${t}_count`] + i[`buys_tx_${t}_count`] > 0
          ? (i[`sells_tx_${t}_count`] / (i[`sells_tx_${t}_count`] + i[`buys_tx_${t}_count`])) * 100
          : 0),
      (progress_obj[`progress_buy_volume_u_${t}`] =
        i[`buy_volume_u_${t}`] + i[`sell_volume_u_${t}`] > 0
          ? (i[`buy_volume_u_${t}`] / (i[`buy_volume_u_${t}`] + i[`sell_volume_u_${t}`])) * 100
          : 0),
      (progress_obj[`progress_sell_volume_u_${t}`] =
        i[`buy_volume_u_${t}`] + i[`sell_volume_u_${t}`] > 0
          ? (i[`sell_volume_u_${t}`] / (i[`buy_volume_u_${t}`] + i[`sell_volume_u_${t}`])) * 100
          : 0)
  })
  let signal_arr: any[] = []
  let normal_tag = []
  if (i.dynamic_tag) {
    const tag_arr = JSON.parse(i.dynamic_tag) || []
    signal_arr = tag_arr?.filter((i) => i?.startsWith('signal'))
    signal_arr = signal_arr?.map((y) => ({
      tag:
        y?.split('-')[5] && (y?.split('-')[1] == 'whale_sell' || y?.split('-')[1] == 'whale_buy')
          ? `${y?.split('-')[1]}_trump`
          : y?.split('-')[1],
      color: y?.split('-')[2],
      n: y?.split('-')[3],
      timestamp: y?.split('-')[4],
    }))
    signal_arr?.sort((a, b) => b.timestamp - a.timestamp)
    const kol_arr = signal_arr.filter(
      (item, index) =>
        signal_arr.findIndex((el) => new RegExp('^kol_.*$', 'gi').test(el.tag)) == index
    )
    const dev_arr = signal_arr.filter(
      (item, index) =>
        signal_arr.findIndex((el) => new RegExp('^dev_.*$', 'gi').test(el.tag)) == index
    )
    const smarter_arr = signal_arr.filter(
      (item, index) =>
        signal_arr.findIndex((el) => new RegExp('^smarter_.*$', 'gi').test(el?.tag)) == index
    )
    const whale_arr = signal_arr.filter(
      (item, index) =>
        signal_arr.findIndex((el) => new RegExp('^whale_.*$', 'gi').test(el.tag)) == index
    )
    const other_arr = signal_arr?.filter(
      (el) => !new RegExp('^dev_|kol_|smarter_|whale_.*$', 'gi').test(el.tag)
    )
    signal_arr = kol_arr?.concat(dev_arr)?.concat(smarter_arr)?.concat(whale_arr)?.concat(other_arr)
    signal_arr?.sort((a, b) => b.timestamp - a.timestamp)
    normal_tag = tag_arr.filter((i) => !i?.startsWith('signal'))
  }
  if (i.tag) {
    const tag = i.tag?.split(',') || []
    const tag1 = tag.filter((i) => i !== 'pump' && i !== 'moonshot') || []
    normal_tag = tag1.concat(normal_tag)
  }
  normal_tag =
    normal_tag?.map((i) => ({
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
  if (i.risk_score >= 100 && i.chain == 'solana') {
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
  if (i.cto_flag == 1) {
    normal_tag.unshift({
      tag: 'cto_flag',
      color: 'green',
      showText: false,
    })
  }
  if (i.tag_ti) {
    const tagti = i.tag_ti?.split(',') || []
    let tag_t = tagti?.filter((i) => i !== '' && i !== 'newcommunity')
    tag_t = tag_t?.map((i) => ({
      tag: i,
      color: 'green',
      showText: false,
    }))
    normal_tag = tag_t.concat(normal_tag)
  }
  return {
    ...i,
    id: `${i.target_token}-${i.chain}`,
    pair_id: `${i.pair}-${i.chain}`,
    token: i.target_token,
    progress: Number(i.progress || 0),
    reply_count: i.reply_count || 0,
    logo_url: i.target_token == i.token0_address ? i?.token0_logo_url : i?.token1_logo_url,
    target_opening_at:
      i?.target_opening_at !== '1970-01-01T00:00:00Z' &&
      i?.target_opening_at !== '0001-01-01T00:00:00Z'
        ? new Date(i?.target_opening_at).getTime()
        : 0,
    created_at:
      i?.created_at !== '1970-01-01T00:00:00Z' && i?.created_at !== '0001-01-01T00:00:00Z'
        ? i?.created_at
        : 0,
    liq:
      i.target_token !== i.token0_address
        ? i.reserve0 * i.token0_price_usd * 2
        : i.reserve1 * i.token1_price_usd * 2,
    lp_locked_percent:
      Number(i.lp_locked_percent * 100 || 0) < 1 ? 0 : Number(i.lp_locked_percent * 100 || 0),
    lp_locked_to:
      i?.lp_locked_to !== '1970-01-01T00:00:00Z' && i?.lp_locked_to !== '0001-01-01T00:00:00Z'
        ? new Date(i?.lp_locked_to).getTime()
        : 0,
    medias: getMedias(i.appendix),
    ...progress_obj,
    normal_tag: normal_tag?.slice(0, 3) || [],
    signal_arr: signal_arr?.slice(0, 1) || [],
  }
}

function getMedias(appendix: string) {
  if (!appendix) return []
  if (isJSON(appendix)) {
    const obj = JSON.parse(appendix)
    const arr = []
    if (obj?.website)
      arr.push({
        name: t('website'),
        icon: 'web',
        url: formatUrl(obj.website),
      })
    if (obj?.btok) arr.push({ name: 'Btok', icon: 'btok', url: formatUrl(obj.btok) })
    if (obj?.qq) arr.push({ name: 'QQ', icon: 'qq', url: obj.qq })
    if (obj?.telegram) arr.push({ name: 'Telegram', icon: 'tg', url: formatUrl(obj.telegram) })
    if (obj?.twitter)
      arr.push({
        name: 'Twitter',
        icon: 'twitter',
        url: formatUrl(obj.twitter),
      })
    return arr
  }
  return []
}
</script>

<template>
  <div class="w-full [&&]:max-w-1920px mx-auto">
    <div class="flex gap-16px py-12px px-16px bg-[--d-111-l-FFF]">
      <ChainsSelect v-model:activeChain="activeChain" :list="chains" />
      <CategoryTabs :key="activeTab" v-model:activeTab="activeTab" :categories="categories"/>
    </div>
    <KeepAlive :max="6">
      <component
        :is="components[activeTab]"
        :listMapFunction="listMapFunction"
        :activeChain="activeChain"
      />
    </KeepAlive>
  </div>
</template>

<style scoped lang="scss"></style>
