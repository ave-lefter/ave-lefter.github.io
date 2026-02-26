<template>
  <header
    class="w-full bg-[--main-bg] flex items-center justify-between p-x-17px h-60px"
  >
    <NuxtLink to="/" class="flex items-center gap-4px">
      <img height="26" src="~/assets/images/avedex_mobile_logo.png" >
      <div class="flex items-end gap-5px">
        <Icon name="custom:ave-ai" class="color-[--d-FFF-l-000] text-14px"/>
      </div>
    </NuxtLink>
    <!-- <a :href="homeUrl" target="_blank" class="flex"><img height="26" src="~/assets/images/avedex_mobile_logo.png" ></a> -->
    <!-- <ul class="menu ml-20px">
      <li v-for="(item, $index) in list" :key="$index">
        <a :href="item.src" target="_blank" :class="{ active: item.id == route?.name }">
          {{ item.name }}
        </a>
      </li>
    </ul> -->
    <div class="no-scrollbar overflow-x-auto">
      <div class="menu ml-20px min-w-320px">
        <NuxtLink v-for="(item, $index) in list" :key="$index" class="relative break-keep" :to="item.src" :target="item.target" :class="{ active: routeName?.includes(item.id)}">
          <Icon v-if="item.id == 'index'" name="custom:new1" class="absolute text-8px right--8px top-0px z-2"/>
          {{item.name }}
        </NuxtLink>
      </div>
    </div>

    <div class="flex-1" />
    <a
      class="bg-[--main-input-button-bg] rounded-4px p-8px ml-8px h-32px w-280px flex items-center no-underline"
      href=""
      @click.stop.prevent="showDialog"
    >
      <Icon
        class="text-16px text-[--third-text]"
        name="custom:search"
      />
      <span class="text-12px ml-4px text-[--third-text]">
        {{ $t('enterAddress/token') }}
      </span>
    </a>
    <div class="flex-1" />
    <div
    class="ml-8px bg-[--main-input-button-bg] rounded-4px p-8px h-32px flex items-center text-12px cursor-pointer hover:opacity-80"
      @click="toReferrer"
    >
      <img v-show="showAnimation" src="@/assets/images/refer.gif" height="20" alt="">
      <img v-show="!showAnimation" src="@/assets/images/refer.png" height="20" alt="">
      <span style="word-break: keep-all">{{ $t('refer') }}</span>
    </div>
    <ClipboardToken />
    <el-button
      v-if="!botStore.evmAddress && !walletStore.address"
      class="ml-8px! bg-[--main-input-button-bg] rounded-4px text-[--main-text]!  btn text-12px!"
      @click="openConnect"
    >
      {{ $t('connectWallet') }}
    </el-button>
    <template v-else-if="walletStore.address">
      <Positions/>
      <ExWalletBtn />
    </template>

    <!-- <el-popover v-else placement="bottom" trigger="click">
      <template #reference>
        <el-button class="ml-10px">{{
          botStore.userInfo?.name || ''
        }}</el-button>
      </template>
      <div class="text-center clickable" @click.stop="botStore.logout">
        退出登录
      </div>
    </el-popover> -->
    <template v-else>
      <Positions/>
      <wallet/>
    </template>

    <el-popover
      v-model:visible="appDownloadVisible"
      :persistent="false"
      placement="bottom-end"
      :width="350"
      trigger="click"
      popper-class="app-download-popover"
    >
      <template #reference>
        <el-button
          class="bg-[--main-input-button-bg] border-0! ml-8px!  rounded-4px text-[--main-text]! cursor-pointer btn text-12px!">
          <span>APP</span>
        </el-button>
      </template>
      <div class="pl-0 py-2!">
        <div class="flex">
          <div class="flex flex-col items-center mr-[15px]">
            <div class="h-[110px] border border-solid border-[var(--d-333-l-F2F2F2)] p-1.5 rounded flex items-center justify-center">
              <img
                src="https://ave.ai/img/icons/avecode.png"
                alt="QR Code"
                class="w-full h-full object-contain"
              >
            </div>
            <div class="text-center min-w-[150px] mt-1 text-sm text-sm">
              {{ $t('downloadByScanCode') || 'Scan to download app' }}
            </div>
          </div>
          <div class="flex flex-col justify-center">
            <a
              href="https://apps.apple.com/us/app/ave-pro/id6741381461"
              target="_blank"
              class="flex items-center no-underline mb-4 hover:opacity-100"
            >
              <svg
                class="w-6 h-6 mr-2 text-[var(--d-333-l-F2F2F2)]"
                viewBox="0 0 21 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.1148 13.405C17.084 8.86378 19.6359 8.74626 19.7506 8.67351C18.3152 6.57498 16.0824 6.24481 15.2877 6.21403C13.3878 6.02097 11.5803 7.31086 10.615 7.31086C9.65245 7.31086 8.1639 6.21123 6.5886 6.23921C4.51805 6.26999 2.60698 7.43957 1.53813 9.29467C-0.613561 13.0301 0.986919 18.5618 3.08545 21.5893C4.10953 23.0722 5.33228 24.7371 6.93835 24.6783C8.48287 24.6167 9.06766 23.6766 10.9368 23.6766C12.8058 23.6766 13.3291 24.6783 14.9659 24.6447C16.628 24.614 17.6828 23.1338 18.6985 21.6452C19.8765 19.9244 20.3606 18.3435 20.3885 18.2596C20.3522 18.2428 17.1456 16.4325 17.112 13.405H17.1148Z"
                  fill="#ccc"
                />
                <path
                  d="M10.4521 6.37108C10.4521 3.00224 13.183 0.268555 16.5547 0.268555C16.5547 3.64019 13.821 6.37108 10.4521 6.37108Z"
                  fill="#ccc"
                />
              </svg>
              <span class="text-[var(--a-text-1-color)] text-base leading-5">App Store</span>
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=ai.ave.platform"
              target="_blank"
              class="flex items-center no-underline mb-4 hover:opacity-100"
            >
              <img
                src="/download/frame-1.svg"
                alt="Google Play"
                class="w-5 h-5 mr-2"
              >
              <span class="text-[var(--a-text-1-color)] text-base leading-5">Google Play</span>
            </a>
            <div class="flex justify-between items-center">
               <NuxtLink
                  to="/download"
                  class="inline-flex h-8 px-6 justify-center items-center text-white text-sm font-medium no-underline rounded bg-[#3F80F7] min-w-[140px] mx-auto"
                  @click.stop="appDownloadVisible = false"
                >
                 {{ $t('moreOptions') || 'More Options' }}
                </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </el-popover>
    <el-popover :persistent="false" trigger="click" placement="bottom-end" :popper-style="{minWidth: '248px',width: 'auto'}">
      <template #reference>
        <div
          class="bg-[--main-input-button-bg] rounded-4px p-8px px-10px ml-8px h-32px flex items-center cursor-pointer hover:opacity-80"
        >
          <Icon
            class="text-16px color-[--secondary-text]"
            name="custom:pump-setting"
          />
        </div>
      </template>
      <template #default>
        <div class="flex items-center justify-between mb-16px cursor-pointer" @click="globalStore.audioSettings.active = 'notice'">
         <div class="flex items-center gap-8px">
          <Icon name="custom:alert" class="text-16px"/>
          {{ $t('pushSettings') }}
         </div>
          <Icon name="ep:arrow-right"/>
        </div>
        <div class="flex items-center justify-between mb-16px cursor-pointer" @click="globalStore.audioSettings.active = 'wallet'">
          <div class="flex items-center gap-8px">
            <Icon name="custom:wallet-fill" class="text-16px"/>
            <span>{{ $t('walletSettings') }}</span>
          </div>
          <Icon name="ep:arrow-right"/>
        </div>
        <el-dropdown
          :persistent="false"
          trigger="click"
          popper-class="dropdown-lang"
          class="w-full"
          @command="langStore.setLanguage"
        >
          <div class="flex flex-1 items-center justify-between mb-16px cursor-pointer">
              <div class="flex items-center gap-8px">
                <Icon name="material-symbols:language" class="text-16px"/>
                {{locales.find(i=>i.code === langStore.locale)?.name}}
              </div>
              <Icon name="ep:arrow-right"/>
            </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, $index) in locales"
                :key="$index"
                :command="item?.code"
                :class="{ active: langStore.locale == item.code }"
              >
                {{ item?.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-16px cursor-pointer" @click="globalStore.audioSettings.active = 'notice'">
           <div class="flex items-center gap-8px">
            <Icon name="custom:alert" class="text-16px"/>
            {{ $t('pushSettings') }}
           </div>
            <Icon name="ep:arrow-right"/>
          </div>
          <el-dropdown
  :persistent="false"
            trigger="click"
            popper-class="dropdown-lang"
            placement="bottom-end"
            class="w-auto"
            @command="langStore.setLanguage"
          >
            <div class="flex flex-1 items-center justify-between mb-16px cursor-pointer relative">
                <div class="flex items-center gap-8px ">
                  <Icon name="material-symbols:language" class="text-16px"/>
                  <span class="mt--2px">{{locales.find(i=>i.code === langStore.locale)?.name}}</span>
                </div>
                <Icon name="ep:arrow-right"/>
              </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(item, $index) in locales"
                  :key="$index"
                  :command="item?.code"
                  :class="{ active: langStore.locale == item.code }"
                >
                  {{ item?.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown
  :persistent="false"
            trigger="click"
            placement="bottom-end"
            popper-class="dropdown-lang"
            class="w-auto"
            @command="key=>globalStore.zone=key"
          >
            <div class="flex flex-1 items-center justify-between mb-16px cursor-pointer  gap-24px">
                <div class="flex items-center gap-8px">
                  <Icon name="custom:locale" class="text-16px"/>
                  <span class="mt--2px flex items-center gap-2px">
                    {{ $t('priceChangeZoonSetting') }}
                    <el-tooltip
                      placement="bottom-start"  :persistent="false"
                    >
                      <template #content> <div v-html="$t('priceChangeZoonSettingTip')" class="max-w-224px"></div></template>
                      <Icon name="ri:error-warning-line" class='rotate-180 text-16px text-[--third-text]' />
                    </el-tooltip>
                  </span>
                </div>
                <div class="flex gap-4px items-center">
                  <span class="font-400 text-12px text-[--third-text]">{{zoonName}}</span>
                  <Icon name="ep:arrow-right"/>
                </div>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(item, $index) in globalStore.zoneList"
                  :key="$index"
                  :command="item?.key"
                  :class="{ active: globalStore.zone== item.key }"
                >
                  {{ item?.value }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div class="flex items-center justify-between cursor-pointer" @click="botTipDialogRef && botTipDialogRef?.openBotTipDialog()">
            <div class="flex items-center gap-8px">
              <Icon name="custom:rockets" class="text-16px"/>
            {{ $t('newFeature') }}
            </div>
            <Icon name="ep:arrow-right"/>
          </div>
        </div>
      </template>
    </el-popover>
    <!-- <div
      class="bg-[--main-input-button-bg] rounded-4px p-8px ml-8px h-32px flex items-center cursor-pointer hover:opacity-80"
      @click="globalStore.audioSettings.active = 'notice'"
    >
      <Icon
        class="text-20px color-[--secondary-text]"
        name="custom:alert"
      />
    </div> -->
    <Notice/>
    <!-- <el-dropdown
      trigger="click"
      placement="bottom"
      popper-class="dropdown-lang"
      @command="langStore.setLanguage"
    >
      <a
        class="bg-[--main-input-button-bg] rounded-4px p-8px ml-8px h-32px flex items-center"
        href=""
        popper-class="dropdown-lang"
        @click.stop.prevent
      >
        <Icon
          class="text-20px text-[--secondary-text]"
          name="material-symbols:language"
        />
      </a>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(item, $index) in locales"
            :key="$index"
            :command="item?.code"
            :class="{ active: langStore.locale == item.code }"
          >
            {{ item?.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown> -->
    <a
      class="bg-[--main-input-button-bg] rounded-4px p-8px ml-8px h-32px flex items-center"
      href=""
      @click.stop.prevent="themeStore.toggleTheme()"
    >
      <Icon
        class="text-20px text-[--secondary-text]"
        :name="themeStore.isDark ? 'custom:dark' : 'custom:light'"
      />
    </a>
    <dialog-search ref="dialogSearchRef"/>
    <!-- <component :is="connectWalletCom" v-model="botStore.connectVisible" /> -->
    <ConnectWalletCom />
    <BotTipDialog ref="botTipDialogRef"/>
    <AudioSettings/>
    <audio ref='audioElement' controls :src='audioUrl' class="hidden"/>
  </header>
</template>
<script lang="ts" setup>
import dialogSearch from '@/components/header/dialogSearch.vue'
import wallet from '@/components/header/wallet/index.vue'
import Notice from '~/components/layouts/components/notice.vue'
// const connectWallet = shallowRef<Component | null>(null)
import Positions from '@/components/header/positions/index.vue'
import ExWalletBtn from '../header/connectWallet/exWalletBtn.vue'
import BotTipDialog from './components/botTipDialog.vue'
import ClipboardToken from './components/clipboardToken.vue'
import AudioSettings from './components/audioSettings.vue'
import type { ITGBotResponse } from '~/api/types/ws'
import { useStorage } from '@vueuse/core'

// import connectWallet from '@/components/header/connectWallet/index.vue'
// const connectWallet = shallowRef<Component | null>(null)
const { getNotifyList } = useRemindStore()
const audioUrl = ref('')
const audioElement = useTemplateRef('audioElement')
const dialogSearchRef = useTemplateRef('dialogSearchRef')
const { locales } = useI18n()
const themeStore = useThemeStore()
const botStore = useBotStore()
const walletStore = useWalletStore()
const wsStore = useWSStore()
const route = useRoute()
const langStore = useLocaleStore()
const {t } = useI18n()
const globalStore = useGlobalStore()
const  appDownloadVisible = shallowRef(false)
const botTipDialogRef = useTemplateRef('botTipDialogRef')

const openPasteAddress = useStorage('openPasteAddress', true, localStorage)
const openPasteText = useStorage('openPasteText', false, localStorage)

const routeName = computed(() => {
  return (route.name || '') as string
})

const zoonName= computed(() => {
  return globalStore.zoneList.find(i=>i.key === globalStore.zone)?.value
})

const list = computed(() => {
  // let query = ''
  // if (botStore.accessToken && botStore.refreshToken) {
  //   query = `?act=${botStore.accessToken}&ret=${botStore.refreshToken}`
  // }
  const menues = [
    { id: 'index', name: t('pump1'), src: '/', target: '_self' },
    {id: 'markets', name: t('markets'), src: '/markets', target: '_self'},
    { id: 'follow', name: t('follow'), src: '/follow' },
    {id: 'smart', name: t('signal2'), src: '/smart', target: '_self'},
    {id: 'copy-trade', name: t('copyTrade'), src: '/copy-trade', target: '_self'},
    { id: 'perp', name: t('perp'), src: '/perp' },
    {id: 'address', name: t('balances'), src: '/address', target: '_self'},
  ]
  return menues
})

const homeUrl = computed(() => {
  let query = ''
  if (botStore.accessToken && botStore.refreshToken) {
    query = `?act=${botStore.accessToken}&ret=${botStore.refreshToken}`
  }
  return 'https://ave.ai/' + query
})

// const dialogVisible_search = shallowRef(false)

// const lazyComponent = shallowRef<Component | null>(null)
// const loadComponent = async () => {
//   const component = await import('@/components/header/connectWallet/index.vue')
//   lazyComponent.value = component.default
// }

const ConnectWalletCom = defineAsyncComponent(() => import('@/components/header/connectWallet/index.vue'))

const openConnect = () => {
  botStore.changeConnectVisible(true)
}
const showAnimation = ref(false)
onMounted(() => {
  getNotifyList()
  showAnimation.value = true
  setTimeout(()=>{
    showAnimation.value = false
  },10000)
})

function toReferrer() {
  window.open('/referral')
}

watch(()=>wsStore.wsResult[WSEventType.TGBOT],(subscribeResult:ITGBotResponse)=>{
  if (subscribeResult?.txList?.[0]?.success) {
    const {swapType} = subscribeResult
    const {audioSettings:{audio}} = globalStore
    const map = {
      [SwapType.BUY]: audio.marketBuy,
      [SwapType.SELL]: audio.marketSell,
      [SwapType.LIMIT_BUY]: audio.limit,
      [SwapType.LIMIT_SELL]: audio.limit,
    }
    if(map[swapType]) {
      audioUrl.value = audioNameToResource[map[swapType] as keyof typeof audioNameToResource]
      setTimeout(()=>{
        if(audioElement.value) {
          audioElement.value.play()
        }
      },20)
    }
  }
})

async function showDialog() {
  globalStore.dialogVisible_search = !globalStore.dialogVisible_search
  // 自动粘贴剪切板
  const clipboard = await navigator.clipboard.readText()
  const isValid = clipboard && ['eth', 'solana','tron','sui','ton','brc20'].some(i => isValidAddress(clipboard, i))
  if(dialogSearchRef.value){
    if(isValid&&openPasteAddress.value){
      dialogSearchRef.value.setQuery(clipboard)
    }else if(!isValid&&openPasteText.value){
      dialogSearchRef.value.setQuery(clipboard)
    }
  }
}
</script>
<style lang="scss" scoped>
header {
  div {
    display: flex;
    a {
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0px;
      text-align: center;
      padding: 4px 8px;
      border-radius: 8px;
      color: var(--main-text);
      // margin-right: 8px;
      text-decoration: none;

      &.active {
        background: var(--main-input-button-bg);
        color: var(--primary-color);
      }
    }
  }
  .btn{
    background: var(--main-input-button-bg);
    border:0 none;
    &:hover {
      background: var(--main-input-button-bg);
      opacity: 0.8;
    }
  }
}

.no-scrollbar {
  scrollbar-width: none;
}

</style>
