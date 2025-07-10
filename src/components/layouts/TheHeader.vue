<template>
  <header
    class="w-full bg-[var(--d-111-l-FFF)] flex items-center justify-between p-x-17px h-60px"
  >
    <a :href="homeUrl" target="_blank" class="flex"><img height="26" src="~/assets/images/avedex_mobile_logo.png" ></a>
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
      class="bg-[var(--d-222-l-F2F2F2)] rounded-4px p-8px ml-8px h-32px w-320px flex items-center no-underline"
      href=""
      @click.stop.prevent="dialogVisible_search = !dialogVisible_search"
    >
      <Icon
        class="text-16px text-[var(--d-666-l-999)]"
        name="custom:search"
      />
      <span class="text-12px ml-4px text-[var(--d-666-l-999)]">
        {{ $t('enterAddress/token') }}
      </span>
    </a>
    <div class="flex-1" />
    <el-button
      v-if="!botStore.evmAddress && !walletStore.address"
      text
      type=""
      bg
      color="bg-[var(--d-222-l-F2F2F2)]"
      class="ml-10px  rounded-4px text-[var(--d-F5F5F5-l-333)]!"
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
    <Notice/>
    <el-dropdown
      trigger="click"
      placement="bottom"
      popper-class="dropdown-lang"
      @command="langStore.setLanguage"
    >
      <a
        class="bg-[var(--d-222-l-F2F2F2)] rounded-4px p-8px ml-8px h-32px flex items-center"
        href=""
        popper-class="dropdown-lang"
        @click.stop.prevent
      >
        <Icon
          class="text-20px text-[--d-999-l-666]"
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
      class="bg-[var(--d-222-l-F2F2F2)] rounded-4px p-8px ml-8px h-32px flex items-center"
      href=""
      @click.stop.prevent="themeStore.toggleTheme()"
    >
      <Icon
        class="text-20px text-[--d-999-l-666]"
        :name="themeStore.isDark ? 'custom:dark' : 'custom:light'"
      />
    </a>
    <dialog-search v-model="dialogVisible_search" />
    <!-- <component :is="connectWalletCom" v-model="botStore.connectVisible" /> -->
    <ConnectWalletCom />
  </header>
</template>
<script lang="ts" setup>
import dialogSearch from '@/components/header/dialogSearch.vue'
import wallet from '@/components/header/wallet/index.vue'
import Notice from '~/components/layouts/components/notice.vue'
// const connectWallet = shallowRef<Component | null>(null)
import Positions from '@/components/header/positions/index.vue'
import ExWalletBtn from '../header/connectWallet/exWalletBtn.vue'
// import connectWallet from '@/components/header/connectWallet/index.vue'
// const connectWallet = shallowRef<Component | null>(null)
const { locales } = useI18n()
const themeStore = useThemeStore()
const botStore = useBotStore()
const walletStore = useWalletStore()
const route = useRoute()
const langStore = useLocaleStore()
const {t } = useI18n()
const list = computed(() => {
  let query = ''
  if (botStore.accessToken && botStore.refreshToken) {
    query = `?act=${botStore.accessToken}&ret=${botStore.refreshToken}`
  }
  const menues = [
    {id: 'index', name: t('markets'), src: 'https://ave.ai/' + query, target: '_blank'},
    { id: 'pump', name: t('pump1'), src: '/pump' },
    { id: 'follow', name: t('follow'), src: '/follow' },
    {id: 'smart', name: t('smarter2'), src: '/smart', target: '_self'},
    {id: 'assets', name: t('balances'), src: '/address', target: '_self'},
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
      color: #999999;
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
