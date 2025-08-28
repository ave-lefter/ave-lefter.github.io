<template>
  <el-popover
    v-if="list?.length > 0"
    v-model:visible="show"
    placement="bottom"
    popper-class="chains-table-filter"
    title=""
    :width="370"
    trigger="click"
  >
    <template #reference>
      <a class="top50 bg-btn text-10px" href="" @click.stop.prevent>
        <Icon name="custom:top" class="text-[--d-666-l-999] h-10px mr-2px" />
        <span
          class="text-10px"
          :class="{
            text:
              (list?.filter(
                (i) => i?.tag_type == 4 || i?.tag_type == 1 || i?.tag_type == 2
              )?.length || 0) /
                Math.min(list?.length || 50) >
              1 / 3,
          }"
        >
          {{
            list?.filter(
              (i) => i?.tag_type == 4 || i?.tag_type == 1 || i?.tag_type == 2
            )?.length || 0
          }}
        </span>
        /{{ Math.min(list?.length || 50) }}
        <Icon
          name="material-symbols:arrow-forward-ios-rounded"
          class="text-10px"
        />
      </a>
    </template>
    <template #default>
      <div class="filter-box">
        <div class="flex-start">
          <span class="font_18 title">{{
            list[0]?.tag == 'early' ? t('top50TitleHold') : t('top50TitleEarly')
          }}</span>
          <el-tooltip
            v-if="list[0]?.tag == 'early'"
            placement="top"
            popper-class="[&&]:[--el-text-color-primary:--dialog-list-hover]!"
          >
            <template #content>{{ t('top50TitleTip') }}</template>
            <Icon
              class="text-14px ml-5px mt-2px color-[--third-text] cursor-pointer"
              name="mi:circle-warning"
            />
          </el-tooltip>
        </div>
        <div class="border mt-20px">
          <div class="holder">
            <div v-for="(item, $index) in list" :key="$index">
              <el-tooltip
                v-if="filterTag(item.tag_type)"
                placement="top"
                :hide-after="0"
              >
                <template #content>
                  {{ filterTag(item.tag_type)?.text }}
                </template>
              <NuxtLink :to="`/address/${item.account_address}/${chain}`">
                <div class="item">
                  <Icon
                    class="dot iconfont font-10 mr-5px color-red-6"
                    :name="filterTag(item.tag_type)?.icon"
                    :style="{ color: filterTag(item.tag_type)?.color }"
                  />
                  <img
                    v-if="item?.new_tags?.length > 0"
                    style="max-width: 10px; max-height: 10px"
                    class="mr-3"
                    :src="formatNewTags(item.new_tags[0]?.icon)"
                    alt=""
                  >
                </div>
              </NuxtLink>
              </el-tooltip>
            </div>
          </div>
          <div class="flex-between mt-10px">
            <div>
              <div class="flex-start mt-10px">
                <Icon
                  class="dot iconfont font-10 mr-5px color-red-6"
                  :name="filterTag(1)?.icon"
                  :style="{ color: filterTag(1)?.color }"
                />
                {{ t('top50Holders') }}：{{
                  list?.filter((i) => i.tag_type == 1)?.length || 0
                }}
              </div>
              <div class="flex-start mt-10px">
                <Icon
                  class="dot iconfont font-10 mr-5px color-red-6"
                  :name="filterTag(3)?.icon"
                  :style="{ color: filterTag(3)?.color }"
                />
                {{ t('top50SSoldOut') }}：{{
                  list?.filter((i) => i.tag_type == 3)?.length || 0
                }}
              </div>
            </div>
            <div>
              <div class="flex-start mt-10px">
                <Icon
                  class="dot iconfont font-10 mr-5px color-red-6"
                  :name="filterTag(2)?.icon"
                  :style="{ color: filterTag(2)?.color }"
                />
                {{ t('top50Increase') }}：{{
                  list?.filter((i) => i.tag_type == 2)?.length || 0
                }}
              </div>
              <div class="flex-start mt-10px">
                <Icon
                  class="dot iconfont font-10 mr-5px color-red-6"
                  :name="filterTag(4)?.icon"
                  :style="{ color: filterTag(4)?.color, 'margin-top': '2px' }"
                />
                {{ t('top50PartialSale') }}：{{
                  list?.filter((i) => i.tag_type == 4)?.length || 0
                }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex-start mt-20px">
          <img
            src="@/assets/images/avedex_mobile_logo.png"
            style="height: 17px"
            height="17"
            alt=""
            srcset=""
          >
          <span class="ml-5px font-14">Ave.ai</span>
        </div>
        <span class="mt-5px block text-10px color-[--secondary-text]">
          {{ t('campaignTitle') }}
        </span>
      </div>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { _getEarlyholders, type EarlyHolders } from '@/api/top50'
import { formatNewTags, getAddressAndChainFromId } from '@/utils/index'
const { t } = useI18n()
const route = useRoute()
// const router = useRouter()
const show = shallowRef(false)
const list = shallowRef<Array<EarlyHolders>>([])

const id = computed(() => route.params?.id as string)
const { chain } = getAddressAndChainFromId(route.params?.id as string)

onMounted(() => {
  getEarlyholders()
})

watch(()=>route.params.id, () => {
  getEarlyholders()
})
function jumpBalance(row: {account_address: string}) {
    const { chain } = getAddressAndChainFromId(route.params?.id as string)
    // const targetRoute = router.resolve({
    //   name: 'Balance',
    //   params: { chain: chain, userAddress: row.account_address },
    // })
    // window.open(targetRoute.href, '_blank')
    const url = `/address/${row.account_address}/${chain}`
    window.open(url, '_blank')

}
function filterTag(type:number) {
  interface TagInfo {
    color: string;
    icon: string;
    text: string;
  }
  const obj: Record<number, TagInfo> = {
    1: {
      color: '#12B886',
      icon: 'custom-top50-holders',
      text: t('top50Holders'),
    },
    2: {
      color: '#00B00F',
      icon: 'custom-top50-holders',
      text: t('top50Increase'),
    },
    3: {
      color: '#F6465D',
      icon: 'custom-top50-sold',
      text: t('top50SSoldOut'),
    },
    4: {
      color: '#F6465D',
      icon: 'custom-top50-partial',
      text: t('top50PartialSale'),
    },
  } as const
  return obj[type] || ''
}
function getEarlyholders() {
  _getEarlyholders(id.value)
    .then((res) => {
      const a = Array.isArray(res) ? res?.slice(0, 50) : []
      list.value = a?.map((i) => ({
        ...i,
        new_tags: i.new_tags?.filter(
          (y) => ['25', '30', '31'].includes(y?.type ?? '')
        ),
      }))
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {})
}
</script>

<style lang="scss" scoped>
.top50 {
  font-size: 12px;
  // color: var(--custom-text-2-color);
  display: flex;
  background: var(--custom-bg-7-color);
  border-radius: 2px;
  padding: 2px;
  line-height: 1;
  min-width: 18px;
  min-height: 18px;
  align-items: center;
  justify-content: center;

  .text {
    color: var(--d-FFF-l-000);
    margin-left: 3px;
  }
  .icon-youjiantou {
    margin-left: 2px;
    font-size: 8px;
  }
}
.filter-box {
  padding: 10px 0;
}
.border {
  border-top: 0.5px solid var(--d-333-l-F5F5F5);
  border-bottom: 0.5px solid var(--d-333-l-F5F5F5);
  padding: 22px 0 30px;
}
.holder {
  display: flex;
  flex-wrap: wrap;
  margin-left: -5px;
  margin-right: -5px;
  .item {
    padding: 8px 5px;
    position: relative;
    img {
      position: absolute;
      // transform: translate(-50%, -50%);
      // top: 50%;
      // left: 50%;
      top: 17px;
      right: 0px;
    }
    .dot {
      font-size: 20px;
      width: 20px;
      height: 20px;
      border-radius: 100%;
      line-height: 1;
      //   background: #12b886;
    }
  }
}

.bg-btn{
    font-size: 10px;
    margin-right: 4px;
    height: 16px;
    min-width: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    background-color: var(--main-input-button-bg);
    padding: 2px;
}
</style>
