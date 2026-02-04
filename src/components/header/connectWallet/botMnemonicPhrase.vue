<template>
  <div class="text-32px inline-flex items-center">
    <span class="font-600">{{ $t('aveBotSwapWallet') }}</span>
  </div>
  <div>
    <div class="item mt-32px" v-for="(item, $index) in listAddress" :key="$index">
      <div class="text-14px color-[--secondary-text] text-left">
        <span class="color-[--primary-color] mr-4px text-17px">{{ item.chain=='bsc' ? 'Evm': capitalize(item.chain) }}</span
        >{{ $t('walletAddress') }}
      </div>
      <div
        class="bg-[--border] rounded-8px text-14px color-[--main-text] flex-start px-12px py-14px mt-8px"
      >
        <span>{{ item.address }}</span>
        <span class="flex-1"></span>
        <Icon
          v-copy="item.address"
          name="bxs:copy"
          class="text-12px ml-2px cursor-pointer color-[--third-text] hover:opacity-80"
          @click.stop.prevent
        />
        <Icon
          name="material-symbols:qr-code"
          class="text-12px cursor-pointer color-[--third-text] ml-8px hover:opacity-80"
          @mouseover="showCode(item, $event)"
          @mouseleave="visible = !visible"
        />
      </div>
      <div class="text-left mt-4px" v-if="Number(item.balance) == 0">
        <span class="color-[--yellow] text-12px"
          >{{ $t('mnemonicTip', {chain: item.chain=='bsc' ? 'Evm': capitalize(item.chain)}) }}</span
        >
      </div>
    </div>
    <div class="item mt-32px">
      <div class="text-14px color-[--secondary-text] text-left">
        <span>{{ $t('mnemonic') }}</span>
        <span class="color-[--yellow] text-12px block mt-4px"
          >{{ $t('mnemonicTip2') }}</span
        >
      </div>

      <div class="relative min-h-160px" @click="hide = false">
        <div
          class="mask text-center color-[--main-text] absolute bg-[--border] top-0 right-0 left-0 bottom-0 flex items-center justify-center z-1 text-14px cursor-pointer"
          v-if="hide"
        >
          <Icon name="custom:show-code" class="text-16px mr-4px color-[--main-text]" />
          {{ $t('clickMnemonic') }}
        </div>
        <div class="grid grid-cols-3 gap-8px mt-30px">
          <div
            class="mnemonic-item block border border-solid border-[--dialog-divider] py-8px px-8px text-center relative"
            v-for="(item, $index) in mnemonic"
            :key="$index"
          >
            <span
              class="color-[--third-text] rounded-4px text-10px px-4px py-1px overflow-hidden text-ellipsis whitespace-nowrap max-w-100px line-height-15px absolute left-2px top-2px"
              >{{ $index + 1 }}</span
            >
            {{ item }}
          </div>
        </div>
      </div>
      <div class="text-center mt-116px flex-between">
        <el-button class="h-48px! flex-1" size="large"  v-copy="mnemonic?.join(' ')" @click.stop.prevent> {{ $t('copyMnemonic') }} </el-button>
        <el-button class="h-48px! flex-1" size="large"  type="primary" @click.stop.prevent="goOn"> {{ $t('startSwap') }} </el-button>
      </div>
    </div>
    <el-tooltip
      ref="tooltipRef"
      :visible="visible"
      :virtual-ref="buttonRef"
      virtual-triggering
      popper-class="tooltip-pd-0"
      placement="right"
      :persistent="false"
      :show-arrow="false"
    >
      <template #content>
        <div class="w-420px h-426px flex flex-col items-center justify-center">
          <canvas id="qr-chain-canvas-code" />
          <div class="text-14px color-[--secondary-text] mt-26px">
            <span class="color-[--primary-color] mr-4px text-17px">{{ currentObj.chain =='bsc' ? 'Evm' : capitalize(currentObj.chain)}}</span
            >{{ $t('walletAddress') }}
          </div>
          <span class="mt-26px color-[--main-text] text-14px block">{{ currentObj.address }}</span>
        </div>
      </template>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { useQRCode } from '@/utils/qrCode'
import sha256 from 'crypto-js/sha256'
import CryptoJS from 'crypto-js'
import QrCodeWithLogo from 'qr-code-with-logo'
import { Warning } from '@element-plus/icons-vue'
import { markRaw } from 'vue'
const botStore = useBotStore()
const configStore = useConfigStore()
const walletStore = useWalletStore()
const themeStore = useThemeStore()
const { t } = useI18n()
const { qrcodeUrl, generateQRCodeWithLogo } = useQRCode()
const { token_logo_url, mode } = storeToRefs(useGlobalStore())
const buttonRef = ref<HTMLElement | null>(null)
const tooltipRef = ref()
const visible = ref(false)
const hide = ref(true)
const currentObj = ref({
  chain: '',
  address: '',
  balance: 0,
  logo_url: '',
})
const mnemonic = computed(() => {
  const msg = botStore.mnemonic || ''
  const guid = botStore?.userInfo?.tgUid || ''
  if (msg && guid) {
    const str = decryptMsg(msg, guid)
    return  str.split(' ') || []
  } else {
    return []
  }
})
const addresses = computed(() => {
  return botStore?.userInfo?.addresses || []
})

const listAddress = computed(() => {
  //返回evm和solana
  // const addresses = [
  //   {
  //     chain: 'eth',
  //     address: '0xada9cf85489aafb26802836139f7a918d19fd287',
  //     balance: 1,
  //     logo_url: '',
  //   },
  //   {
  //     chain: 'bsc',
  //     address: '0xada9cf85489aafb26802836139f7a918d19fd287',
  //     balance: 1,
  //     logo_url: '',
  //   },
  //   {
  //     chain: 'solana',
  //     address: '2gnsqunbP8Hdxc6ee1x5GfzsKRKgBhvvu732Jajgyk7Y',
  //     balance: 0,
  //     logo_url: '',
  //   },
  //   {
  //     chain: 'base',
  //     address: '0xada9cf85489aafb26802836139f7a918d19fd287',
  //     balance: 0,
  //     logo_url: '',
  //   },
  //   {
  //     chain: 'xlayer',
  //     address: '0xada9cf85489aafb26802836139f7a918d19fd287',
  //     balance: 3,
  //     logo_url: '',
  //   },
  // ]
  const result = mergeBalancesToBsc(addresses.value)
  console.log('------result------',result)
  return result
})

watch(visible, (val) => {
  if (val) {
    // let url = `${token_logo_url.value}chain/${currentObj.value.chain}.png`
    // generateQRCodeWithLogo(currentObj.value.address, url, 300)
    setTimeout(() => {
      setChainQr()
    }, 200)
  }
})
function decryptMsg(cipherBase64: string, guid: string): string {
  // 1. 生成 key (SHA256(guid))
  const key = CryptoJS.SHA256(guid)
  // 2. IV = key 前 16 字节
  const iv = CryptoJS.lib.WordArray.create(key.words.slice(0, 4)) // 4*4字节 = 16字节
  // 3. Base64 解码密文
  const cipherParams = CryptoJS.enc.Base64.parse(cipherBase64)
  // 4. AES-CBC 解密
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: cipherParams } as any,
    key,
    {
      mode: CryptoJS.mode.CBC,
      iv,
      padding: CryptoJS.pad.Pkcs7,
    }
  )

  // 5. 得到 Base64 编码的明文
  const base64Str = decrypted.toString(CryptoJS.enc.Utf8)

  // 6. Base64 解码 → 原始明文
  return CryptoJS.enc.Base64.parse(base64Str).toString(CryptoJS.enc.Utf8)
}

function showCode(item: AddressItem, e: MouseEvent) {
  buttonRef.value = e.currentTarget as HTMLElement
  visible.value = true
  currentObj.value = item
  setTimeout(() => {
    setChainQr()
  }, 200)


}
async function setChainQr() {
  const canvas = document.getElementById('qr-chain-canvas-code')
  if (!canvas) {
    return
  }
  QrCodeWithLogo.toCanvas({
    canvas: canvas,
    content: currentObj.value.address,
    width: 200,
    nodeQrCodeOptions: {
      margin: 2,
    },
    logo: {
      src: `${token_logo_url.value}chain/${currentObj.value.chain}.png`,
      logoRadius: 8
    }
  }).catch((err: any) => {
    console.log('QrCodeWithLogo error', err)
  })
}
type AddressItem = {
  chain: string
  address: string
  balance?: string
  logo_url?: string
}
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
function mergeBalancesToBsc(list: AddressItem[]): AddressItem[] {
  const grouped = new Map<string, number>()

  // 统计每个 address 的总 balance
  for (const item of list) {
    grouped.set(item.address, (grouped.get(item.address) || 0) + Number(item.balance))
  }
  const result: AddressItem[] = []

  for (const [addr, totalBalance] of grouped.entries()) {
    const items = list.filter((i) => i.address === addr)

    if (items.length > 1) {
      // 有重复 => 把余额合并到 bsc
      const bscItem = items.find((i) => i.chain === 'bsc')
      if (bscItem) {
        result.push({ ...bscItem, balance: totalBalance || 0 })
      }
    } else {
      // 没重复 => 原样保留
      result.push(items[0])
    }
  }

  return result
}

const goOn = () => {
  ElMessageBox.confirm(t('lastChance'), t('tips'), {
    type: 'warning',
    icon: markRaw(Warning),
    confirmButtonText: t('saved'),
    cancelButtonText: t('cancel'),
    customClass: `${mode.value} delete_confirm`,
  })
    .then(() => {
      botStore.changeConnectVisible(false)
      botStore.mnemonic = ''
    })
    .catch((err) => {
      console.log('--------err-------', err)
    })
}
</script>

<style lang="scss" scoped>
</style>
