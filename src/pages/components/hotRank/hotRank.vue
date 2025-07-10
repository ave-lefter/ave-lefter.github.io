<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { getDefaultColumns } from './columnRender/hotColumusService'
import { getTreasureList } from '~/api/market'
import {
  // poolPairHeader,
  // poolPairRow,
  // quickHeader,
  quickContent,
  // openTimeContent,
  // dexContent,
  securityContent,
  // devContent,
  // top10PositionsContent,
  // snipersContent,
  holdersContent,
  priceChange24hContent,
  // priceChange5mContent,
  priceChangeDynamicContent,
  // markersContent,
  // priceChange1mContent,
  // volumeContent,
  // txnsContent,
  smarterContent,
  // rugPullContent,
  liquidityContent,
  priceContent,
  mCapContent,
  // marketCapContent,
  // listTimeContent,
  poolPairContent,
  // insidersContentNew,
  // insidersContent
  Headline
} from './columnRender/index'
import { set } from 'lodash-es'

const { t } = useI18n()

const props = defineProps<{
  listMapFunction(i:Record<string,any>):Record<string,any>
}>()
const sortConditions = ref({
  sort: '',
  sort_dir: '',
})
function setSortConditions(params: { sort: string; sort_dir: string }) {
  sortConditions.value = params
}
const defaultFilter = {
  created_at: {
    created_interval:'',
    range:[]
  },
}
const filterForm = ref(defaultFilter)
function setFilterForm<T>(path:string,val:T) {
  set(filterForm.value,path,val)
}
const rankCommonConditions = useStorage('rankCommon', {
  activeInterval: '1m',
  quickVisible: true,
  quickBuyValue:'0.01'
})
const listData = shallowRef([])
const pageInfo = ref({
  pageNO: 1,
  pageSize: 100,
  total: 0,
})
const loading = shallowRef(false)
const columns = useStorage('hotUserTableColumns', getDefaultColumns(t))
const renderData = computed(() => {
  return {
    // txnsContent: {
    //   Comp: txnsContent,
    //   props: {}
    // },
    // volumeContent: {
    //   Comp: volumeContent,
    //   props: {}
    // },
    // priceChange1mContent: {
    //   Comp: priceChange1mContent,
    //   props: {}
    // },
    // markersContent: {
    //   Comp: markersContent,
    //   props: {}
    // },
    priceChangeDynamicContent: {
      Comp: priceChangeDynamicContent,
      props: {
        activeInterval:rankCommonConditions.value.activeInterval,
        sortConditions: sortConditions.value,
        setSortConditions,
      }
    },
    // priceChange5mContent: {
    //   Comp: priceChange5mContent,
    //   props: {}
    // },
    priceChange24hContent: {
      Comp: priceChange24hContent,
      props: {
        sortConditions: sortConditions.value,
        setSortConditions,
      }
    },
    // poolPairHeader: {
    //   Comp: poolPairHeader,
    //   props: {}
    // },
    quickContent: {
      Comp: quickContent,
      props: {
        quickBuyValue:rankCommonConditions.value.quickBuyValue
      }
    },
    // openTimeContent: {
    //   Comp: openTimeContent,
    //   props: {}
    // },
    // dexContent: {
    //   Comp: dexContent,
    //   props: {}
    // },
    securityContent: {
      Comp: securityContent,
      props: {}
    },
    // insidersContentNew: {
    //   Comp: insidersContentNew,
    //   props: {}
    // },
    // devContent: {
    //   Comp: devContent,
    //   props: {}
    // },
    // top10PositionsContent: {
    //   Comp: top10PositionsContent,
    //   props: {}
    // },
    // snipersContent: {
    //   Comp: snipersContent,
    //   props: {}
    // },
    holdersContent: {
      Comp: holdersContent,
      props: {
        filterForm: filterForm.value,
        sortConditions: sortConditions.value,
        setSortConditions,
        setFilterForm,
      }
    },
    smarterContent: {
      Comp: smarterContent,
      props: {
        filterForm: filterForm.value,
        sortConditions: sortConditions.value,
        setSortConditions,
        setFilterForm,
      }
    },
    // rugPullContent: {
    //   Comp: rugPullContent,
    //   props: {}
    // },
    liquidityContent: {
      Comp: liquidityContent,
      props: {
        filterForm: filterForm.value,
        sortConditions: sortConditions.value,
        setSortConditions,
        setFilterForm,
      }
    },
    // listTimeContent: {
    //   Comp: listTimeContent,
    //   props: {}
    // },
    // marketCapContent: {
    //   Comp: marketCapContent,
    //   props: {}
    // },
    mCapContent: {
      Comp: mCapContent,
      props: {
        filterForm: filterForm.value,
        sortConditions: sortConditions.value,
        setSortConditions,
        setFilterForm,
      }
    },
    priceContent: {
      Comp: priceContent,
      props: {}
    },
    poolPairContent: {
      Comp: poolPairContent,
      props: {
        filterForm: filterForm.value,
        sortConditions: sortConditions.value,
        setSortConditions,
        setFilterForm,
        pageNO: pageInfo.value.pageNO,
        pageSize: pageInfo.value.pageSize,
      },
    },
    headline:{
      Comp:Headline
    }
  }
})

function tableRowClick(row) {
  navigateTo(`/token/${row.target_token}-${row.chain}`)
}

onMounted(() => {
  _getTreasureList()
})

async function _getTreasureList() {
  try {
    loading.value = true
    const { total: _, ...rest } = pageInfo.value
    const res = await getTreasureList({
      category: 'hot',
      ...rest,
    })
    pageInfo.value.total = res.total
    listData.value = (res.data || []).map(props.listMapFunction)
  } finally {
    loading.value = false
  }
}


</script>

<template>
  <el-table
    :height="'calc(100vh - 190px)'"
    :data="listData"
    fit
    header-row-class-name="[&&]:text-12px h-40px"
    row-class-name="color-[--d-CCC-l-333]"
    @row-click="tableRowClick"
  >
    <template #empty>
      <AveEmpty v-if="!loading && listData.length === 0" />
      <span v-else />
    </template>
    <template v-for="item in columns" :key="item.field">
      <component
        v-bind="renderData[item.render]?.props"
        :is="renderData[item.render]?.Comp"
        v-if="item.isHide"
      />
    </template>
  </el-table>
  <el-pagination
    v-model:current-page="pageInfo.pageNO"
    v-model:page-size="pageInfo.pageSize"
    class="mt-5px flex justify-center"
    layout="total, prev, pager, next"
    :total="pageInfo.total || 0"
    :small="false"
    :page-sizes="[20, 50, 100, 200, 300, 400]"
    @size-change="
      pageInfo.pageNO = 1;
      _getTreasureList();
    "
    @current-change="_getTreasureList"
  />
</template>

<style scoped lang="scss">
:deep(.cell) {
  padding: 0 16px;
}
</style>
