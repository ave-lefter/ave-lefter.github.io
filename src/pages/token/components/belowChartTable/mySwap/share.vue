<script setup lang="ts">
import QRCode from 'qrcode'
import Cookies from 'js-cookie'
import { getCampaignToken } from '~/api/token'
import { formatNumber } from '~/utils/formatNumber'

import up1 from '@/assets/images/share/up_1.webp'
import down1 from '@/assets/images/share/down_1.webp'
import { getTextWidth, getChainDefaultIcon, formatDate } from '~/utils'
import { templateRef } from '@vueuse/core'

const props = defineProps({
  statistics: {
    type: Object,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  chain: {
    type: String,
    required: true
  }
})
const botStore = useBotStore()

// 钱包类型判断
const isBotWallet = computed(() => {
  return !!botStore?.userInfo?.evmAddress
})
const dialogVisible = ref(false)
const shareDom = templateRef('shareDom')
const bgImg = ref('')
const qrcodeUrl = ref('')
const localeStore = useLocaleStore()
const configStore = useConfigStore()
const imgList = computed(() => {
  const upShareImg = configStore.globalConfig.pc_share_image.replace(/^.*\|/, '')
  const ups = upShareImg.split(',').map(img => {
    return configStore.token_logo_url + 'pc_share/' + img
  })
  const downShareImg = configStore.globalConfig.pc_share_image?.replace(/\|.*$/, '')
  const downs = downShareImg.split(',').map(img => {
    return configStore.token_logo_url + 'pc_share/' + img
  })
  return {
    ups,
    downs
  }
})

const shareItem = ref<any>()
async function openDialog() {
  const data = {
    token: props.statistics?.swapType === 2 ? props.statistics?.inTokenAddress : props.statistics.outTokenAddress,
    acc: props.address
  }
  const res = await getCampaignToken({
    ...data
  })
  console.log(res, 'res')

  shareItem.value = { ...props.statistics, ...res, profitRate: res?.profit_realized_ratio, }
  dialogVisible.value = true
  getQRCode()
  getRandomBg(Number(props.statistics?.total_profit_ratio) > 0)
}

function getQRCode() {
  const inviterUrl = configStore.globalConfig.inviter_url_v2 || 'https://share.ave.ai'
  const refCode = Cookies.get('refCode') || ''
  const refCodeParams = refCode ? '&code=' + refCode : ''
  const shareLink = inviterUrl + '?lang=' + localeStore.locale + refCodeParams
  QRCode.toDataURL(shareLink, { margin: 1 })
    .then(url => {
      qrcodeUrl.value = url
    })
    .catch(err => {
      console.error(err)
    })
}

function getRandomBg(isUp = false) {
  const imgs = isUp ? imgList.value.ups : imgList.value.downs
  const len = imgs.length
  const index = getRandom(1, len)
  bgImg.value = imgs[index] || (isUp ? up1 : down1)
}

async function downloadSharePoster() {
  if (shareDom.value) {
    const m = await import('html2canvas')
    const html2canvas = m.default || m
    html2canvas(shareDom.value, {
      backgroundColor: null,
      scale: 3,
      allowTaint: true,
      useCORS: true,
      scrollY: 0,
      scrollX: 0
    }).then(canvas => {
      const dataURL = canvas.toDataURL('image/png')
      downloadFile(dataURL, `ave-${Date.now()}.png`)
    })
  }
}

function downloadFile(blob: string, filename: string) {
  let url = ''
  if (typeof blob === 'string') {
    url = blob
  } else {
    url = URL.createObjectURL(blob)
  }
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

// 获取1-5的随机值
function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// function getColorClass(val: string) {
//   if (Number(val) > 0) {
//     return 'color-#12b886'
//   } else if (Number(val) < 0) {
//     return 'color-#ff646d'
//   } else {
//     return 'color-#848E9C'
//   }
// }
</script>

<template>
  <slot>
    <Icon name="custom:share" class="text-12px color-[--d-999-l-666] ml-6px cursor-pointer" @click.self.stop="openDialog" />
  </slot>
  <el-dialog v-if="dialogVisible" v-model="dialogVisible" :title="$t('share')" width="628" append-to-body destroy-on-close>
    <div>
      <div ref="shareDom" class="relative p-25px z-1">
        <img class="absolute w-588px left--1px top--1px z--1 h-[101%]" :src="bgImg" alt="share">
        <div class="inline-block">
          <div class="flex flex-col">
            <div class="flex items-center">
              <img src="@/assets/images/avedex_mobile_logo.png" class="h-24px" height="24" alt="" srcset="">
              <span class="ml-5px text-20px">Ave.ai</span>
            </div>
            <span class="mt-5px block ml-auto text-10px color-#fff m-w-180px text-center">{{
              $t('campaignTitle')
            }}</span>
          </div>
        </div>


        <div class="flex items-center justify-start mt-40px">
          <div class="icon-token-container share" style="margin-right: 10px">
            <el-image
              class="token-icon token-logo"
              :src="getSymbolDefaultIcon({ logo_url: shareItem.swapType === 2 ? shareItem?.inTokenLogoUrl : shareItem.outTokenLogoUrl, chain: shareItem.chain, symbol: shareItem.swapType === 2 ? shareItem?.inTokenSymbol : shareItem.outTokenSymbol })">
              <template #error>
                <img
                  class="token-icon"
                  :src="getChainDefaultIcon(shareItem?.chain, shareItem.swapType === 2 ? shareItem?.inTokenSymbol : shareItem.outTokenSymbol)"
                  alt="" srcset="">
              </template>
              <template #placeholder>
                <img
                  class="token-icon"
                  :src="getChainDefaultIcon(shareItem?.chain, shareItem.swapType === 2 ? shareItem?.inTokenSymbol : shareItem.outTokenSymbol)"
                  alt="" srcset="">
              </template>
            </el-image>

            <img
              v-if="shareItem?.chain" class="w-12px h-12px relative left-[-7px]"
              :src="`${configStore.token_logo_url}chain/${shareItem.chain}.png`" alt=""
              onerror="this.src='/icon-default.png'" srcset="" >
          </div>
          <span class="text-20px">{{ shareItem.swapType === 2 ? shareItem?.inTokenSymbol : shareItem.outTokenSymbol
          }}</span>
        </div>
        <span class="mt-5px text-[#666] block">
          {{ (isBotWallet ? botStore?.userInfo?.evmAddress : props.address)?.slice(0, 6) + '...' +
            (isBotWallet ? botStore?.userInfo?.evmAddress : props.address)?.slice(-6) }}
        </span>
        <div class="mt-15px">
          <span class="text-[#999]">{{ $t('RIO') }}</span>
          <div
            v-if="shareItem?.profitRate" class="mt-5px" style="font-size: 40px; font-weight: 700;"
            :style="{ color: shareItem?.profitRate > 0 ? '#12B886' : '#ff646d' }">{{
              shareItem?.profitRate > 0 ? '+' : '' }}{{ formatNumber(shareItem?.profitRate || 0, 1) }}%</div>
          <div v-else class="mt-5px" style="font-size: 40px; font-weight: 700;" :style="{ color: '#999' }">--</div>
        </div>
        <table class="mt-20px share-table">
          <tbody>
            <tr>
              <td :style="{ width: (getTextWidth($t('campaignBuyAvg')) + 20 + 'px') }">{{ $t('campaignBuyAvg') }}
              </td>
              <td>
                <template v-if="shareItem?.avg_buy_price > 0">
                  ${{ formatNumber(shareItem?.avg_buy_price || 0) }}
                </template>
                <span v-else :style="{ color: '#999' }">--</span>
              </td>
            </tr>
            <tr>
              <td :style="{ width: (getTextWidth($t('campaignSellAvg')) + 20 + 'px') }">{{ $t('campaignSellAvg') }}
              </td>
              <td>
                <template v-if="shareItem?.avg_sell_price > 0">
                  ${{ formatNumber(shareItem?.avg_sell_price || 0) }}
                </template>
                <span v-else :style="{ color: '#999' }">--</span>
              </td>
            </tr>
            <tr>
              <td :style="{ width: (getTextWidth($t('campaignBuyTime')) + 20 + 'px') }">{{ $t('campaignBuyTime') }}
              </td>
              <td>
                <template v-if="shareItem?.last_buy_time">
                  {{ formatDate(shareItem.last_buy_time, 'YYYY-MM-DD HH:mm:ss') }}
                </template>
                <span v-else :style="{ color: '#999' }">--</span>
              </td>
            </tr>
            <tr>
              <td :style="{ width: (getTextWidth($t('campaignSellTime')) + 20 + 'px') }">{{ $t('campaignSellTime') }}
              </td>
              <td>
                <template v-if="shareItem?.last_sell_time">
                  {{ formatDate(shareItem.last_sell_time, 'YYYY-MM-DD HH:mm:ss') }}
                </template>
                <span v-else :style="{ color: '#999' }">--</span>
              </td>
            </tr>
          </tbody>
        </table>


        <div class="absolute right-30px bottom-30px flex justify-end text-center">
          <div class="text-right mt-10px">
            <span class="text-20px font-semibold block">{{ $t('campaignSubTitle') }}</span>
            <span class="text-12px mt-10px">{{ $t('campaignDesc') }}</span>
          </div>
          <div class="ml-10px">
            <img :src="qrcodeUrl" :alt="$t('campaignScan')" width="60px" height="60px">
            <span class="text-14px font-400 mt-5px block">{{ $t('campaignScan') }}</span>
          </div>
        </div>
      </div>
      <div class="flex justify-between mx-auto mt-20px text-12px w-300px color-#999">
        <div class="flex-col flex items-center cursor-pointer" @click.stop="downloadSharePoster">
          <img src="@/assets/images/share/download.svg" height="48" alt="" srcset="">
          <span class="mt-8px">{{ $t('download') }}</span>
        </div>
        <div class="flex-col flex items-center cursor-pointer" @click.stop="jumpX">
          <img src="@/assets/images/share/twitter.svg" height="48" alt="" srcset="">
          <span class="mt-8px">Twitter</span>
        </div>
        <div class="flex-col flex items-center cursor-pointer" @click.stop="jumpTg">
          <img src="@/assets/images/share/tg.svg" height="48" alt="" srcset="">
          <span class="mt-8px">Telegram</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.share-table {
  // width: 200px;
  border-collapse: collapse;
  font-size: 14px;

  tr {
    td {
      padding: 5px 0;

      &:nth-child(2n + 1) {
        color: #999;
        text-align: left;
      }
    }
  }
}

.icon-token-container {
  .token-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

  .icon-symbol {
    width: 12px;
    height: 12px;
    top: 21px;
    left: 21px;
  }
}
</style>
