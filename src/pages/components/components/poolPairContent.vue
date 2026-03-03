<script setup lang="ts">
import dayjs from 'dayjs'
import { addFavorite, addFavoriteGroup, removeFavorite } from '~/api/fav'
import XIcon from '~/components/xPopup/xIcon.vue'
import Collect from '~/components/collect.vue'

const emit = defineEmits(['toggleKline'])
const rankKlineStore = useRankKlineStore()
const walletStore = useWalletStore()
const botStore = useBotStore()
const { t } = useI18n()
const props = defineProps<{
  pageNO: number
  pageSize: number
  row: any
  rowIndex: number
  activeKline?:boolean
  enableKline?:boolean
}>()

const walletAddress = computed(() => {
  return botStore.evmAddress || walletStore.address
})

function getSymbol(row, shouldReverse = false) {
  const isZeroAddress = row.target_token == row.token0_address
  if (shouldReverse) {
    return isZeroAddress ? row.token1_symbol : row.token0_symbol
  }
  return isZeroAddress ? row.token0_symbol : row.token1_symbol
}
function getLogoUrl(row) {
  return row.target_token == row.token0_address ? row.token0_logo_url : row.token1_logo_url
}

const globalStore = useGlobalStore()
function inBlackList(row) {
  return (
    globalStore.pumpBlackList.findIndex(
      (i) =>
        (i.address == row.token && i.type == 'ca') ||
        (i.address == getSymbol(row) && i.type == 'keyword')
    ) !== -1
  )
}

function blockToken(row) {
  addOrRemoveBlackList(row, 'ca')
  if(row.id === rankKlineStore.klineRow.id){
    toggleKline()
  }
}

function addOrRemoveBlackList(item: { token: string }, type: 'ca' | 'dev' | 'keyword') {
  if (globalStore.pumpBlackList.length > 499) {
    ElMessage.error(t('blacklistLimit'))
    return
  }
  if (globalStore.pumpBlackList) {
    const findIndex = globalStore.pumpBlackList.findIndex(
      (i) => item.token == i.address && i.type == 'ca'
    )
    if (findIndex !== -1) {
      globalStore.pumpBlackList.splice(findIndex, 1)
    } else {
      globalStore.pumpBlackList.push({ address: item.token, type: type })
    }
  } else {
    globalStore.pumpBlackList = [{ address: item.token, type: type }]
  }
}

function timerCountColor(val: number) {
  if (Number(formatTimeFromNow(val, true)) < 3600 * 24) {
    return 'color-[--yellow]'
  }
  return ''
}
const isCircle = computed(() => globalStore.pumpSetting.avatar_isCircle === 'circle')
const created_at_unix = computed(() => {
  return dayjs(props.row.created_at).unix()
})

function toggleKline() {
  emit('toggleKline',props.row)
}

function newGroupAndCollect(newGroupName:string) {
  addFavoriteGroup(newGroupName,walletAddress.value).then(res=>{
    if(res){
      globalStore.userFavoriteGroups.push({
        group_id: Number(res),
        name: newGroupName,
      })
      addTokenFavorite(props.row,Number(res))
    }
  }).catch(console.log)
}

async function collect(newGroupId?:number) {
  if (walletAddress.value) {
    if (walletStore.address) {
      await walletStore.signMessageForFavorite()
    }
    if (props.row.is_fav) {
      removeTokenFavorite(props.row)
    } else {
      addTokenFavorite(props.row,newGroupId || 0)
    }
  } else {
    verifyLogin()
  }
}

function removeTokenFavorite(row) {
  row.is_fav = false
  removeFavorite(`${row.token}-${row.chain}`, walletAddress.value)
    .then(() => {
      ElMessage.success(t('cancelled1'))
      row.is_fav = false
    })
    .catch((err) => {
      console.log(err)
    })
}

function addTokenFavorite(row, newGroupId: number) {
  row.is_fav = true
  addFavorite(`${row.token}-${row.chain}`, walletAddress.value, newGroupId)
    .then(() => {
      ElMessage.success(t('collected'))
      row.is_fav = true
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>

<template>
  <div class="[&&]:color-[--third-text] [&&]:text-12px flex items-center box">
    <div class="items-center justify-center w-16px h-16px bg-[--main-bg] rounded-2px absolute top-5px left-5px hidden icon hover:color-[--secondary-text]">
      <Icon
      v-if="!inBlackList(row)"
      v-tooltip="$t('blockToken')"
      name="custom:invisible"
      class="text-12px"
      @click.self.stop="blockToken(row)"
      />
      <Icon
        v-else
        name="custom:visible"
        class="text-9px"
        @click.self.stop="addOrRemoveBlackList(row, 'ca')"
      />
    </div>
    <span
      :style="{ width: Math.ceil(getTextWidth('#' + pageNO * pageSize)) + 'px' }"
      class="text-right text-10px"
      >#{{ (pageNO - 1) * pageSize + rowIndex + 1 }}</span
    >
    <div class="flex items-center">
      <Collect :iconClass="`text-16px cursor-pointer ml-5px mr-12px`" :isCollected="row.is_fav" :userFavoriteGroups="globalStore.userFavoriteGroups" @collect="collect" @newGroupAndCollect="newGroupAndCollect"/>
    </div>
    <div class="flex items-center gap-8px">
      <el-tooltip popper-class="tooltip-pd-0" placement="bottom-start" :show-arrow="false" :persistent="false">
        <template #default>
          <TokenImg
            :is-circle="isCircle"
            chain-class="w-20px h-20px"
            :token-class="`w-48px h-48px ${isCircle ? '' : 'rounded-8px'}`"
            :row="{
              chain: row.chain,
              symbol: getSymbol(row),
              logo_url: getLogoUrl(row),
            }"
          />
        </template>
        <template #content>
          <TokenImg
            :is-circle="false"
            chain-class="hidden"
            :token-class="`w-240px h-240px [&&]:mr-0 rounded-16px`"
            :row="{
              chain: row.chain,
              symbol: getSymbol(row),
              logo_url: getLogoUrl(row),
            }"
          />
        </template>
      </el-tooltip>
      <div class="flex flex-col gap-6px">
        <div class="flex items-center lh-20px">
          <span class="text-16px color-[--main-text] max-w-88px truncate"> {{ getSymbol(row) }}</span
          ><span class="text-10px">/{{ getSymbol(row, true) }} </span>
          <Icon
            v-copy="row.target_token"
            name="bxs:copy"
            class="text-12px ml-8px"
            @click.self.stop
          />
          <a
            class="ml-4px lh-10px"
            :href="`https://x.com/search?q=($${getSymbol(row)} OR ${row.target_token})&src=typed_query&f=live`"
            target="_blank"
            @click.stop
          >
            <Icon name="custom:search" class="text-12px" />
          </a>
          <img
            v-if="row.issue_platform"
            v-tooltip="row.issue_platform"
            :src="formatIconTag(row.issue_platform)"
            width="12"
            height="12"
            class="rounded-full ml-4px"
            alt=""
          >
          <template v-if="row.normal_tag?.length > 0">
            <div
              v-for="(i, index) in row.normal_tag"
              :key="index"
              v-tooltip="getTagTooltip(i)"
              class="flex items-center ml-4px"
            >
              <img
                class="w-12px h-12px"
                :src="formatIconTag(i.tag)"
                alt=""
                onerror="this.src='/icon-default.png'"
              >
              <span v-if="i?.showText" :style="{color: i?.color=='green'? 'color-[--up-color]' : 'color-[--down-color]'}">
                  {{ $t(i?.tag) }}
              </span>
            </div>
          </template>
          <el-tooltip
            v-if="row?.lp_locked_percent > 0 && row?.lp_locked_percent <= 100"
            placement="top"
            :persistent="false"
          >
            <template #default>
              <el-progress
                class="progress ml-4px"
                type="circle"
                :percentage="row.lp_locked_percent"
                color="var(--primary-color)"
                :width="14"
                :stroke-width="1.5"
                indeterminate
              >
                <Icon name="material-symbols:lock" class="text-8px" />
              </el-progress>
            </template>
            <template #content>
              <div v-if="row.lp_holders">LP {{ $t('holders') }}: {{ row.lp_holders }}</div>
              <div v-if="row.lp_locked_percent > 0">
                {{ $t('LPLocked') }}: {{ formatNumber(row.lp_locked_percent, 0) }}%
              </div>
              <div v-if="row.lp_lock_platform">
                {{ $t('platform') }}: {{ row.lp_lock_platform }}
              </div>
              <div v-if="row.lp_locked_to">
                {{ $t('unlockDate') }}:
                {{ formatDate(row.lp_locked_to / 1000, 'YYYY-MM-DD') }}
              </div>
            </template>
          </el-tooltip>
          <!-- <Icon
            v-if="enableKline"
            v-tooltip="!activeKline?$t('kline'):$t('hidekline')"
            name="custom:kline" class="text-12px ml-4px hover:color-[--secondary-text]"
            :class="activeKline ? 'color-[--secondary-text]' : 'color-[--third-text]'"
            @click.self.stop="toggleKline"
          /> -->
          <Icon v-if="row.headline" v-tooltip="row.headline" class="ml-4px" name="custom:ai"/>
        </div>
        <div class="flex items-center lh-12px">
          <div
            v-tooltip="formatDate(row.created_at, 'YYYY/MM/DD HH:mm:ss')"
            class="mr-8px text-12px"
          >
            <TimerCount
              v-if="row.created_at && Number(formatTimeFromNow(created_at_unix, true)) < 60"
              :key="created_at_unix"
              :timestamp="created_at_unix"
              :end-time="60"
            >
              <template #default="{ seconds }">
                <span v-if="seconds < 60" class="color-[--yellow]"> {{ seconds }}s </span>
                <span v-else :class="timerCountColor(created_at_unix)">
                  {{ formatTimeFromNow(created_at_unix) }}
                </span>
              </template>
            </TimerCount>
            <div v-else :class="created_at_unix ? timerCountColor(created_at_unix) : ''">
              {{ created_at_unix ? formatTimeFromNow(created_at_unix) : '-' }}
            </div>
          </div>
          <div v-if="row?.medias?.length > 0" class="flex items-center gap-4px">
            <template v-for="(item, index) in row?.medias" :key="index">
              <span v-if="item.name === 'QQ'" v-tooltip="item.url" @click.stop>
                <Icon
                  :name="`custom:${item.icon}`"
                  class="text-[--third-text] h-12px"
                />
              </span>
              <XPopup v-else-if="item.icon === 'twitter'" :tokenId="((row.token + '-' + row.chain) as string)" :type="row.twitter_type">
                <a class="flex items-center" :href="item.url" target="_blank" @click.stop>
                  <XIcon
                    v-if="[1, 2, 3].includes(row.twitter_type)"
                    :type="row.twitter_type"
                  />
                  <Icon v-else :name="`custom:${item.icon}`" />
                </a>
              </XPopup>
              <div v-else-if="item.url" v-tooltip="item.url">
                <a class="flex items-center" :href="item.url" target="_blank" @click.stop>
                  <Icon :name="`custom:${item.icon}`" />
                </a>
              </div>
            </template>
          </div>
          <PumpLive v-if="row?.is_streaming" :class="{'ml-4px': row?.medias?.length > 0}" class="mr-0!" :tokenId="((row.token + '-' + row.chain) as string)" />
          <template v-if="row.signal_arr?.length > 0">
            <div
              v-for="(i, index) in row.signal_arr"
              :key="index"
              v-tooltip="getTagTooltip(i)"
              class="flex items-center ml-4px"
            >
              <img
                class="w-12px h-12px mr-5px"
                :src="formatIconTag(i.tag)"
                alt=""
                onerror="this.src='/icon-default.png'"
              >
              <span v-if="i.tag" :class="i.color === 'green' ? 'color-[--up-color]' : 'color-[--down-color]'">{{
                $t(i.tag)
              }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.progress {
  :deep().el-progress__text {
    min-width: 12px;
  }
}
.is-hovered {
  .icon {
    display: flex;
  }
}
</style>
