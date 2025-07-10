<template>
  <button class="flex items-center bg-transparent border-none p-0 clickable text-14px" type="button" @click.stop="show = true">
    <template v-if="props.token?.address || props.token?.token">
      <TokenImg :key="props.token?.address" :row="props.token" />
      <span class="text-14px color-[--d-F5F5F5-l-333] font-400 ml-3px">
        {{ props.token?.symbol || '' }}
      </span>
    </template>
    <div v-else>{{ $t('pleaseSelectToken') }}</div>
    <Icon class="arrow-up" :class="{ active: show === true }" name="solar:alt-arrow-down-bold" />
  </button>
  <el-dialog v-model="show" class="dialog-select" width="420px">
    <template #header>
      <span>{{ t('selectToken') }}</span>
    </template>
    <div class="search-dialog-container" @click.stop>
      <el-input
        ref="inputSearch"
        v-model.trim="keyword"
        :placeholder="t('enterAddress/token')"
        clearable
        @keydown.enter="tokenSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <div class="search-content" style="padding-top: 10px">
        <SearchTable
          :searchTokens="searchResultTokens"
          :loading="loading"
          :disabledToken="props.disabledToken || props.token.address"
          @onSelect="handleSelectToken"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { searchSwapToken } from '~/api/swap'
import SearchTable from './searchTable.vue'
import { useI18n } from 'vue-i18n'
import { Search } from '@element-plus/icons-vue'
const { t } = useI18n()
const props = defineProps({
  tokens: {
    type: Array as PropType<Array<{
      name?: string; address?: string; token?: string; symbol: string; logo_url: string; chain: string
}>>,
    default: () => []
  },
  token: {
    type: Object as PropType<{ address?: string; token?: string; symbol: string; logo_url: string; chain: string }>,
    default: () => ({
      token: '',
      address: '',
      symbol: '',
      logo_url: '',
      chain: ''
    })
  },
  chain: {
    type: String,
    default: ''
  },
  disabledToken: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:token'])

const show = ref(false)
const keyword = ref('')
const searchTokens = ref(props.tokens || [])
const loading = ref(false)

// const selectTokenHistory = useStorage('selectTokenHistory', [], localStorage)


const searchResultTokens = computed(() => {
  if (searchTokens.value?.length > 0) {
    return searchTokens.value
  }
  return props.tokens || []
})

watch(keyword, val => {
  if (val !== '') {
    tokenSearch()
  } else {
    searchTokens.value = props.tokens
  }
})

watch(show, val => {
  if (val) {
    searchTokens.value = props.tokens || []
    keyword.value = ''
  }
})

let Timer: null | ReturnType<typeof setTimeout> = null
function tokenSearch() {
  if (Timer) {
    clearTimeout(Timer)
    Timer = null
  }
  Timer = setTimeout(() => {
    search()
  }, 500)
}

function search() {
  if (keyword.value !== '') {
    const reg = new RegExp(keyword.value, 'i')
    const filterTokens =
      props.tokens?.filter(
        i => reg.test(i?.address || '') || reg.test(i?.symbol || '') || reg.test(i?.name || '')
      ) || []
    loading.value = true
    searchSwapToken(keyword.value, props.chain)
      .then(res => {
        const tokens = res
          .filter?.((i: { chain: string; token: string | undefined }) => i.chain === props.chain && !filterTokens.some(j => j.token === i.token))
          ?.map?.((i: { token: any }) => ({ ...i, address: i.token }))
        searchTokens.value = [...filterTokens, ...tokens]
      })
      .catch(err => {
        console.log(err)
        searchTokens.value = []
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    searchTokens.value = props.tokens
  }
}

function handleSelectToken(item: { address?: string; token?: string; value?: number | bigint, balance?: number | bigint }) {
  if (item.address === props.disabledToken) {
    return
  }
  if (item?.address || item?.token) {
    emit('update:token', {...item, value: item?.value?.toString() || 0, balance: item?.balance?.toString() || 0})
    show.value = false
  }
}
</script>
<style scoped lang="scss">
.history-tag {
  min-width: 40px;
  background-color: transparent;
  border: 1px solid #5b66f936;
  color: #eaecef;
  border-radius: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
  padding: 4px 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  & + .history-tag {
    margin-left: 0;
  }
}
.header-title {
  margin-top: 15px;
}
.token-icon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  border-radius: 100%;
}
.icon-token-container {
  display: inline-block;
  font-size: 15px;
  margin-right: 5px;
  position: relative;
  .icon-token {
    width: 25px;
    height: 25px;
    border-radius: 50%;
  }
  .icon-chain {
    width: 14px;
    // font-size: 14px;
    position: absolute;
    bottom: -2px;
    right: -3px;
    border-radius: 50%;
    border: 1px solid var(--custom-primary-lighter-0-color);
  }
}
.arrow-up {
  font-size: 16px;
  transition: all 0.2s linear;
  color: #999;
  &.active {
    transform: rotate(180deg);
  }
}

.select2 {
  :deep() .el-input__prefix-inner > :last-child {
    margin-right: 8px;
  }
}
</style>
