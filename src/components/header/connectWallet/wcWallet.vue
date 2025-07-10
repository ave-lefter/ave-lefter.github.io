<template>
  <div class="color-[--d-F5F5F5-l-333]">
    <div class="wc-qr-container flex items-center justify-center h-320px">
      <el-skeleton :loading="loading" animated>
        <template #template>
          <el-skeleton-item variant="rect" class="w-320px! h-320px! rd-8px" />
        </template>
      </el-skeleton>
      <!-- <img v-show="!loading" id="wc-qr-image" class="h-320px w-320px" :src="qrImgUrl" alt="qrCode"> -->
      <canvas v-show="!loading" id="wc-qr-canvas" class="rd-8px" />
    </div>
    <div class="text-center text-14px mt-10px">Scan this QR Code with your phone</div>
    <el-divider><span class="color-[--d-999-l-666]">{{ $t('download') }} App</span></el-divider>
    <div v-if="walletName === 'Binance Wallet'" class="flex items-center justify-around">
      <a class="text-center clickable" target="_blank" href="https://apps.apple.com/sg/app/binance-buy-bitcoin-crypto/id1436799971">
        <div class="mb-5px">
          <Icon name="simple-icons:apple" class="text-20px" />
        </div>
        <div class="color-[--d-999-l-666]">iOS</div>
      </a>
      <a class="text-center clickable" target="_blank" href="https://play.google.com/store/apps/details?id=com.binance.dev">
        <div class="mb-5px">
          <Icon name="logos:google-play-icon" class="text-20px" />
        </div>
        <div class="color-[--d-999-l-666]">Google Play</div>
      </a>
    </div>
    <div v-if="walletName === 'AveWallet'" class="flex items-center justify-around">
      <a class="text-center clickable" target="_blank" href="https://apps.apple.com/sg/app/aveai/id1645676067">
        <div class="mb-5px">
          <Icon name="simple-icons:apple" class="text-20px" />
        </div>
        <div class="color-[--d-999-l-666]">iOS</div>
      </a>
      <a class="text-center clickable" target="_blank" href="https://play.google.com/store/apps/details?id=ai.ave.platform">
        <div class="mb-5px">
          <Icon name="logos:google-play-icon" class="text-20px" />
        </div>
        <div class="color-[--d-999-l-666]">Google Play</div>
      </a>
       <a class="text-center clickable" target="_blank" href="https://ossaveai.com/oss/app/ave.ai.apk">
        <div class="mb-5px">
          <Icon name="material-symbols:android" class="text-20px color-#8ad04d" />
        </div>
        <div class="color-[--d-999-l-666]">Android APK</div>
      </a>
    </div>
  </div>
</template>

<script setup lang='ts'>
import QrCodeWithLogo from 'qr-code-with-logo'
import binanceLogo from '@/assets/images/binance.png'
import aveLogo from '@/assets/images/logo-bg.png'
const themeStore = useThemeStore()

const props = defineProps({
  walletName: {
    type: String,
    default: 'Binance Wallet'
  },
  uri: {
    type: String,
    default: ''
  }
})

const logos: Record<string, string> = {
  'Binance Wallet': binanceLogo,
  'AveWallet': aveLogo
}

const loading = ref(true)

watch([() => props.walletName, () => props.uri], () => {
  if (!props.uri) return
  drawQrCode()
})


function drawQrCode() {
  console.log('props.uri', props.uri)
  loading.value = true
  QrCodeWithLogo.toCanvas({
    canvas: document.getElementById('wc-qr-canvas') as HTMLCanvasElement,
    content: props.uri,
    width: 320,
    nodeQrCodeOptions: {
      margin: themeStore.isDark ? 2 : 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#333333', //前景色
        light: '#fff' //背景色
      }
    },
    logo: {
      src: props.walletName ? (logos?.[props.walletName] || binanceLogo) : binanceLogo,
      logoRadius: 8,
      logoSize: 0.2,
      borderColor: '#fff',
    },
  }).then(() => {
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}
</script>

<style>

</style>
