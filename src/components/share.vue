<script setup lang="ts">
import QRCode from 'qrcode'
import Cookies from 'js-cookie'
import html2canvas from 'html2canvas'
import type {GetTokenStatisticsResponse} from '~/api/token'

import up1 from '@/assets/images/share/up_1.webp'
import down1 from '@/assets/images/share/down_1.webp'
import ExcludeError from '~/pages/token/components/tokenDetails/excludeError.vue'
import {addSign, getTextWidth} from '~/utils'
import {templateRef} from '@vueuse/core'

const props = defineProps({
  statistics: {
    type: Object as PropType<GetTokenStatisticsResponse>,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  classString: {
    type: String,
    required: false,
    default: ''
  },
  chain: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: false,
    default: 'default',
    validator: (value: string) => {
      return ['topHolder', 'default','walletDetailTop'].includes(value)
    },
  },

})
const dialogVisible = ref(false)
const shareDom = templateRef('shareDom')
const bgImg = ref('')
const qrcodeUrl = ref('')
const localeStore = useLocaleStore()
const configStore = useConfigStore()
const imgList = computed(() => {
  const upShareImg = configStore.globalConfig.pc_share_image.replace(/^.*\|/, '')
  const ups = upShareImg.split(',').map((img: string) => {
    return configStore.token_logo_url + 'pc_share/' + img
  })
  const downShareImg = configStore.globalConfig.pc_share_image.replace(/\|.*$/, '')
  const downs = downShareImg.split(',').map((img: string) => {
    return configStore.token_logo_url + 'pc_share/' + img
  })
  return {
    ups,
    downs
  }
})

defineExpose({
  openDialog
})

function openDialog() {
  dialogVisible.value = true
  getQRCode()
  getRandomBg(Number(props.statistics?.total_profit_ratio) > 0)
}

function getQRCode() {
  const inviterUrl = configStore.globalConfig.inviter_url_v2 || 'https://share.ave.ai'
  const refCode = Cookies.get('refCode') || ''
  const refCodeParams = refCode ? '&code=' + refCode : ''
  const shareLink = inviterUrl + '?lang=' + localeStore.locale + refCodeParams
  QRCode.toDataURL(shareLink, {margin: 1})
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

function downloadSharePoster() {
  if (shareDom.value) {
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

function getColorClass(val: string) {
  if (Number(val) > 0) {
    return 'color-#12b886!'
  } else if (Number(val) < 0) {
    return 'color-#ff646d!'
  } else {
    return 'color-#848E9C!'
  }
}
</script>

<template>
  <slot>
    <Icon
      name="custom:share"
      :class="['text-12px color-[--d-999-l-666] ml-6px cursor-pointer', props.classString]"
      @click.self.stop="openDialog"
    />
  </slot>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('share')"
    width="700"
    append-to-body
  >
    <div>
      <div ref="shareDom" class="relative p-25px z-1 w-100% overflow-hidden min-h-353px">
        <img
          class="absolute left--1px top--1px z--1 w-101%"
          :src="bgImg"
          alt="share"
        >
        <div class="inline-block">
          <div class="flex flex-col">
            <div class="flex items-center">
              <img
                src="@/assets/images/avedex_mobile_logo.png"
                class="h-24px"
                height="24" alt=""
                srcset=""
              >
              <span class="ml-5px text-20px">Ave.ai</span>
            </div>
            <span
              class="mt-5px block ml-auto text-10px color-#fff m-w-180px text-center">{{
                $t('campaignTitle')
              }}</span>
          </div>
        </div>
        <div class="flex items-center mt-40px">
          <UserAvatar
            :address="address"
            :chain="chain"
            icon-size="40px"
            icon-chain-size="20px"
          />
          <span class="text-14px color-#999 ml-8px">
              {{ address?.slice(0, 4) + '...' + address?.slice(-4) }}
          </span>
        </div>
        <div class="mt-15px text-40px lh-none" :class="getColorClass(statistics.total_profit_ratio)">
          <div class="color-#999 text-14px">{{ $t('RIO') }}</div>
          <ExcludeError
            :model-value="statistics.total_profit_ratio"
          >
            <div class="lh-46px h-46px mt-5px font-700">
            {{ addSign(Number(statistics.total_profit_ratio)) }}{{
              formatNumber(Math.abs(Number(statistics.total_profit_ratio)) * 100 || 0, 2)
            }}%
            </div>
          </ExcludeError>
        </div>
        <table class="absolute" style="bottom: 25px; left: 25px;">
          <tbody>
          <template v-if="type === 'topHolder'">
            <tr>
              <td :style="{ width: getTextWidth($t('profit')) + 20 + 'px' }">
                {{ $t('profit') }}
              </td>
              <td :class="getColorClass(statistics.total_profit)">
                <ExcludeError :model-value="statistics.total_profit">
                  {{ addSign(Number(statistics.total_profit)) }}${{
                    formatNumber(Math.abs(Number(statistics.total_profit)), 2)
                  }}
                </ExcludeError>
              </td>
            </tr>
            <tr>
              <td :style="{ width: getTextWidth($t('balance2')) + 20 + 'px' }">
                {{ $t('balance2') }}
              </td>
              <td>
                <ExcludeError :model-value="statistics.balance_usd">
                  {{'$'+formatNumber(statistics.balance_usd, 4)}}
                </ExcludeError>
              </td>
            </tr>
            <tr>
              <td :style="{ width: getTextWidth($t('costPrice')) + 20 + 'px' }">
                {{ $t('costPrice') }}
              </td>
              <td>
                <ExcludeError :model-value="statistics.average_purchase_price_usd">
                  {{'$'+formatNumber(statistics.average_purchase_price_usd, 4)}}
                </ExcludeError>
              </td>
            </tr>
            <tr>
              <td :style="{ width: getTextWidth($t('lastPrice1')) + 20 + 'px' }">
                {{ $t('lastPrice1') }}
              </td>
              <td>
                <ExcludeError :model-value="statistics.current_price_usd">
                  {{'$'+formatNumber(statistics.current_price_usd, 4)}}
                </ExcludeError>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td :style="{ width: getTextWidth($t('total_profit')) + 20 + 'px' }">
                {{ $t('total_profit') }}
              </td>
              <td :class="getColorClass(statistics.total_profit)">
                <ExcludeError
                  :model-value="statistics.total_profit"
                >
                  {{ addSign(Number(statistics.total_profit)) }}${{
                    formatNumber(Math.abs(Number(statistics.total_profit)), 2)
                  }}
                </ExcludeError>
              </td>
            </tr>
            <tr v-if="type==='walletDetailTop'">
              <td :style="{ width: getTextWidth($t('winRate')) + 20 + 'px' }">
                {{ $t('winRate') }}
              </td>
              <td :class="getColorClass(statistics.total_win_rate)">
                {{ console.log("statistics",statistics) }}
                <ExcludeError
                  :model-value="statistics.total_win_rate"
                >
                  {{
                    formatNumber(Number(statistics.total_win_rate), 1)
                  }}%
                </ExcludeError>
              </td>
            </tr>
          </template>
          </tbody>
        </table>
        <div class="absolute right-30px bottom-30px flex justify-end text-center">
          <div class="text-right mt-10px">
            <span class="font-20 font_weight_700 block color-#FFF">{{ $t('campaignSubTitle') }}</span>
            <span class="font-12 font_weight_400 mt_10 color-#FFF">{{ $t('campaignDesc') }}</span>
          </div>
          <div class="ml-10px">
            <img :src="qrcodeUrl" :alt="$t('campaignScan')" width="60px" height="60px">
            <span class="text-14px font-400 mt-5px block color-#FFF">{{ $t('campaignScan') }}</span>
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
table {
  tr {
    td:nth-child(odd) {
      color:#999;
    }
    td:nth-child(even) {
      color:#fff;
    }
  }
}
</style>
