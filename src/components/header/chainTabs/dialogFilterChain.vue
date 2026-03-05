<template>
  <el-dialog
    v-model="dialogVisible_chain"
    width="856px"
    class="dialog-box dialog-filterChain"
    destroy-on-close
    append-to-body
  >
    <template #header>
      <span class="text-20px">{{ $t('selectChain') }}</span>
    </template>
    <div class="content">
      <el-input
        v-model="onSearch"
        class="searchChain"
        :placeholder="$t('searchChain')"
        size="large"
        
        @input="goFilterChain"
      >
      <template #prefix>
        <Icon
          class="text-20px text-[--third-text]"
          name="custom:search"
        />
      </template>
      </el-input>
      <div class="title mt-20px flex items-center">
        <Icon name="uim:favorite" class="text-14px mr-3px" />
        <span>
          {{ $t('myFavoriteChain') }}
        </span>
      </div>
      <el-row :gutter="10" style="padding: 0 5px">
        <el-col v-for="(i, index) in myChainFilterList" :key="i.chain" :span="4">
          <div class="token-info flex-start w-full item" @click.stop="selectChain(i.chain)">
            <div v-if="i.chain" class="icon-token-container">
              <el-image
                class="icon-net-connect"
                :src="`${configStore.token_logo_url}chain/${i?.chain}.png`"
                style="width: 24px; height: 24px; border-radius: 100%"
              >
                <template #error>
                  <img class="icon-net-connect" src="/icon-default.png" style="width: 24px; height: 24px; border-radius: 100%">
                </template>
                <template #placeholder>
                  <img class="icon-net-connect" src="/icon-default.png" style="width: 24px; height: 24px; border-radius: 100%">
                </template>
              </el-image>
            </div>
            <i v-else class="iconfont icon-bianzu switch mr-5px" style="font-size: 20px"/>
            <div>
              <div class="flex-start">
                <span class="token-symbol ellipsis" :title="i.value ? i.text : $t('allChain')">
                  {{ i.value ? i.text : $t('allChain') }}
                </span>
              </div>
              <div v-if="i.value" class="text-10px lh-none text-left">
                <span class="text-10px color-#12B886">{{ i.up }}/</span>
                <span class="text-10px color-#F6465D">{{ i.down }}</span>
              </div>
            </div>
            <div class="flex-1"/>
            <a @click.stop.prevent="remove(i, index)">
              <el-icon color="var(--third-text)" size="16"><RemoveFilled /></el-icon>
            </a>
          </div>
        </el-col>
      </el-row>
      <div class="flex-between title mt-20px">
        <span>
          {{ $t('allChain') }}
        </span>
      </div>
      <el-scrollbar :max-height="420" wrap-style="padding: 5px">
        <el-row v-if="searchChainResultList?.length > 0" :gutter="10">
          <el-col v-for="(i, index) in searchChainResultList" :key="i.chain" :span="4">
            <div class="token-info flex-start w-full item">
              <div v-if="i.value" class="icon-token-container">
                <el-image
                  class="icon-net-connect"
                  :src="`${configStore.token_logo_url}chain/${i?.value}.png`"
                  style="width: 24px; height: 24px; border-radius: 100%"
                >
                  <template #error>
                    <img class="icon-net-connect" src="/icon-default.png"  style="width: 24px; height: 24px; border-radius: 100%">
                  </template>
                  <template #placeholder>
                    <img class="icon-net-connect" src="/icon-default.png" style="width: 24px; height: 24px; border-radius: 100%">
                  </template>
                </el-image>
              </div>
              <i v-else class="iconfont icon-bianzu switch mr-5pxpx" style="font-size: 20px"/>
              <div>
                <div class="flex-start">
                  <span class="token-symbol ellipsis color-[--secondary-text]" :title="i.value ? i.text : $t('allChain')">
                    {{ i.value ? i.text : $t('allChain') }}
                  </span>
                </div>
                <div v-if="i.value && (i?.up > 0 || i.down > 0)" class="text-10px lh-none text-left">
                  <span class="text-10px color-#12B886">{{ i.up }}/</span>
                  <span class="text-10px color-#F6465D">{{ i.down }}</span>
                </div>
              </div>
              <div class="flex-1"/>
              <a @click.stop.prevent="add(i, index)">
                <el-icon color="var(--third-text)" size="16"><CirclePlusFilled /></el-icon>
              </a>
            </div>
          </el-col>
        </el-row>
        <el-empty
          v-else
          :image="themeStore.theme === 'light' ? imageEmptyWhite : imageEmptyBlack"
          :description="$t('noSearchResults')"
        />
      </el-scrollbar>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import imageEmptyWhite from '@/assets/images/empty-white.svg'
import imageEmptyBlack from '@/assets/images/empty-black.svg'
import { getTreasureConfig, type IGetTreasureConfig } from '~/api/market'
import { CirclePlusFilled, RemoveFilled } from '@element-plus/icons-vue'
import type { PropType } from 'vue'
// import { useDraggable } from 'vue-draggable-plus'
// import { useCompressStorage } from '@/utils/utils.js'
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Njc2MTcxMTcsImlhdCI6MTc2NzYxNTMxNywiaXNzIjoiYXZlIiwicmVmU3RhcnQiOjE3NjcwMTIzMTcsInN1YiI6ImFjYyIsInVpZCI6IjY4NzYwODIxNzMifQ.dHBNrQEAMiuYcyazTGNmqKNM2CLbYY_MmCEmx9MPcxI
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzAyMDczMTcsImlhdCI6MTc2NzYxNTMxNywiaXNzIjoiYXZlIiwicmVmU3RhcnQiOjE3Njk2MDI1MTcsInN1YiI6InJlZiIsInVpZCI6IjY4NzYwODIxNzMifQ.8m-Q1NEZncJ_Mj720JwM3x5o_ew8NjjnogEJZKx_hbw
const props = defineProps({
  modelValue: Boolean,
  favChains: {
    type: Array as PropType<Array<string>>,
    default: () => ['solana', 'bsc', 'eth', 'base']
  }
})
const emit = defineEmits(['update:modelValue', 'update:favChains',  'selectChain'])
const { t } = useI18n()

const configStore = useConfigStore()

const themeStore = useThemeStore()

const dialogVisible_chain = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const onSearch = ref('')
const myChainFilterList = shallowRef<{ text: string; value: string; chain: string, is_hot?: number, up: number, down: number, net_name?: string }[]>([])
const searchChainResultList = shallowRef<{ text: string; value: string; chain: string, is_hot?: number, up: number, down: number, net_name?: string }[]>([])
const chains = shallowRef<{ text: string; value: string; chain: string, is_hot?: number, up: number, down: number, net_name?: string }[]>([])

function initChains(_chains: IGetTreasureConfig[]) {
  chains.value = _chains?.map?.(i => ({
    text: i.name === 'AllChains' ? t('allChain') : i.name || i.net_name,
    value: i?.net_name === 'AllChains' ? '' : i?.net_name,
    chain: i?.net_name === 'AllChains' ? '' : i?.net_name,
    is_hot: i.is_hot,
    up: i.up,
    down: i.down
  })) || []
  init(props.favChains, chains.value)
}

function init(favChains: string[], _chains: any[]) {
  onSearch.value = ''
  myChainFilterList.value = _chains?.filter?.(i => favChains?.includes(i.chain)) || []
  chains.value = _chains
  searchChainResultList.value = _chains?.filter?.(
    i => myChainFilterList.value.findIndex(y => y.chain === i.chain) == -1
  )
}

function goFilterChain(val: string) {
  const reg = new RegExp(val, 'i')
  const list = (chains.value.filter(i => myChainFilterList.value.findIndex(y => y.chain == i.chain) == -1) || []).map(i => {
    if (i.chain?.includes('nervos')) {
      return {...i, text2: 'ckb'}
    }
    return {...i, text2: ''}
  })
  searchChainResultList.value =
    val != '' ? list?.filter(i => reg.test(i.value) || reg.test(i.text) || (i.text2 && reg.test(i.text2))) : list
}

function add(i: { text: string; value: string; chain: string; is_hot?: number; up: number; down: number; net_name?: string }, index: number) {
  myChainFilterList.value.push(i)
  searchChainResultList.value.splice(index, 1)
  updateFavChain()
}

function remove(item: { chain: string; value: string; text: string; is_hot?: number; up: number; down: number; net_name?: string }, index: number) {
  // const list = ['bsc', 'eth', 'solana', 'base']
  // if (list.includes(item.chain) || item.value == '') {
  //   ElMessage.error(t('unDelete'))
  //   return
  // }
  myChainFilterList.value.splice(index, 1)
  searchChainResultList.value.unshift(item)
  updateFavChain()
}

function selectChain(i: string) {
  emit('selectChain', i)
  dialogVisible_chain.value = false
}

function getChains() {
  getTreasureConfig().then((res) => {
    initChains(res?.filter?.(i => i?.net_name !== 'AllChains'))
  })
}
function updateFavChain() {
  triggerRef(searchChainResultList)
  triggerRef(myChainFilterList)
  emit('update:favChains', myChainFilterList?.value.map?.(i => i.chain) || [])
}

onMounted(() => {
  getChains()

})

</script>

<style scoped lang="scss">
.content {
  text-align: center;
  color: var(--d-F5F5F5-l-333);
  .title {
    font-size: 14px;
    letter-spacing: 0;
    line-height: 16px;
    font-weight: 400;
    padding: 0 5px;
    .sub {
      font-size: 12px;
      color: #465273;
    }
  }
  .item {
    background: var(--dialog-divider);
    border: 1px solid transparent;
    border-radius: 6px;
    margin-top: 10px;
    padding: 7px 5px;
    cursor: pointer;
    .icon-token-container {
      margin-right: 5px;
    }
    .ellipsis {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 70px;
      display: block;
    }
  }
  .btn {
    background: var(--custom-primary-color);
    border-radius: 6px;
    font-size: 14px;
    color: #ffffff;
    letter-spacing: 0;
    font-weight: 400;
    padding: 10px 73px;
  }
  .footer {
    margin: 30px auto;
  }
  .token-symbol{
   font-size: 12px;
   font-weight: 400;
  }
}
// .searchChain {
//   --el-input-bg-color: var(--d-333-l-F2F2F2);
//   --el-input-height: 48px;
//   --el-input-border-color: transparent;
// }

.searchChain {
  margin-left: 5px;
  :deep() .el-input__wrapper {
    background-color: transparent;
    border-bottom: 1px solid var(--border);
    padding-left: 0px;
    box-shadow: none;
    & :hover {
      box-shadow: none;
    }
    .el-input__inner::placeholder {
      color: var(--third-text);
    }
  }
}
</style>
