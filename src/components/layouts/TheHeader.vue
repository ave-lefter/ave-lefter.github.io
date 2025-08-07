<template>
  <header
    class="w-full bg-[--d-000-l-FFF] flex items-center justify-between p-x-17px h-60px"
  >
    <NuxtLink to="/" class="flex"><img height="26" src="~/assets/images/avedex_mobile_logo.png" ></NuxtLink>
    <!-- <a :href="homeUrl" target="_blank" class="flex"><img height="26" src="~/assets/images/avedex_mobile_logo.png" ></a> -->
    <!-- <ul class="menu ml-20px">
      <li v-for="(item, $index) in list" :key="$index">
        <a :href="item.src" target="_blank" :class="{ active: item.id == route?.name }">
          {{ item.name }}
        </a>
      </li>
    </ul> -->
     <ul class="menu ml-20px">
      <li v-for="(item, $index) in list" :key="$index">
       <NuxtLink :to="item.src" :target="item.target" :class="{ active: String(route?.name)?.indexOf(item.id) > -1 }">
        {{item.name }}
      </NuxtLink>
      </li>
    </ul>
    <div class="flex-1" />
    <a
      class="bg-[--d-141721-l-E8F1FF] rounded-4px p-8px ml-8px h-32px w-320px flex items-center no-underline"
      href=""
      @click.stop.prevent="dialogVisible_search = !dialogVisible_search"
    >
      <Icon
        class="text-16px text-[--d-566275-l-8CA0C3]"
        name="custom:search"
      />
      <span class="text-12px ml-4px text-[--d-566275-l-8CA0C3]">
        {{ $t('enterAddress/token') }}
      </span>
    </a>
    <div class="flex-1" />
    <div
    class="ml-10px bg-[var(--d-141721-l-E8F1FF)] rounded-4px p-8px h-32px flex items-center text-14px cursor-pointer hover:opacity-80"
      @click="toReferrer"
    >
      <img v-show="showAnimation" src="@/assets/images/refer.gif" height="20" alt="">
      <img v-show="!showAnimation" src="@/assets/images/refer.png" height="20" alt="">
      <span style="word-break: keep-all">{{ $t('refer') }}</span>
    </div>
    <ClipboardToken />
    <el-button
      v-if="!botStore.evmAddress && !walletStore.address"
      text
      type=""
      bg
      color="bg-[var(--d-141721-l-E8F1FF)]"
      class="ml-10px  rounded-4px text-[var(--d-F5F5F5-l-333)]! [&&]:[--el-fill-color-light:--d-141721-l-E8F1FF]"
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
      placement="bottom-end"
      :width="350"
      trigger="click"
      popper-class="app-download-popover"
    >
      <template #reference>
        <el-button

          color="bg-[var(--d-141721-l-E8F1FF)]"
          class="bg-[var(--d-141721-l-E8F1FF)] border-0! ml-10px  rounded-4px text-[var(--d-F5F5F5-l-333)]! cursor-pointer">
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

    <Notice/>
    <el-dropdown
      trigger="click"
      placement="bottom"
      popper-class="dropdown-lang"
      @command="langStore.setLanguage"
    >
      <a
        class="bg-[var(--d-141721-l-E8F1FF)] rounded-4px p-8px ml-8px h-32px flex items-center"
        href=""
        popper-class="dropdown-lang"
        @click.stop.prevent
      >
        <Icon
          class="text-20px text-#8CA0C3"
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
    </el-dropdown>
    <a
      class="bg-[var(--d-141721-l-E8F1FF)] rounded-4px p-8px ml-8px h-32px flex items-center"
      href=""
      @click.stop.prevent="themeStore.toggleTheme()"
    >
      <Icon
        class="text-20px text-#8CA0C3"
        :name="themeStore.isDark ? 'custom:dark' : 'custom:light'"
      />
    </a>
    <dialog-search v-model="dialogVisible_search" />
    <!-- <component :is="connectWalletCom" v-model="botStore.connectVisible" /> -->
    <ConnectWalletCom />
    <BotTipDialog/>
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
// import connectWallet from '@/components/header/connectWallet/index.vue'
// const connectWallet = shallowRef<Component | null>(null)
const { locales } = useI18n()
const themeStore = useThemeStore()
const botStore = useBotStore()
const walletStore = useWalletStore()
const route = useRoute()
const langStore = useLocaleStore()
const {t } = useI18n()
const  appDownloadVisible = shallowRef(false)
const list = computed(() => {
  // let query = ''
  // if (botStore.accessToken && botStore.refreshToken) {
  //   query = `?act=${botStore.accessToken}&ret=${botStore.refreshToken}`
  // }
  const menues = [
    {id: 'index', name: t('markets'), src: '/', target: '_self'},
    // {id: 'index', name: t('markets'), src: 'https://ave.ai/' + query, target: '_blank'},
    { id: 'pump', name: t('pump1'), src: '/pump' },
    { id: 'follow', name: t('follow'), src: '/follow' },
    {id: 'smart', name: t('smarter2'), src: '/smart', target: '_self'},
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

const dialogVisible_search = shallowRef(false)

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
onMounted(()=>{
  showAnimation.value = true
  setTimeout(()=>{
    showAnimation.value = false
  },10000)
})

function toReferrer() {
  window.open('/referral')
}
</script>
<style lang="scss" scoped>
header {
  ul {
    display: flex;
    li a {
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0px;
      text-align: center;
      padding: 4px 8px;
      border-radius: 8px;
      color: var(--d-566275-l-8CA0C3);
      margin-right: 8px;
      text-decoration: none;

      &.active {
        background: #3f80f71a;
        color: #3f80f7;
      }
    }
  }
}
</style>
