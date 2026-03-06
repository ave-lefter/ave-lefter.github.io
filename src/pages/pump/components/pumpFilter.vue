<template>
  <el-popover
      v-model:visible="visible"
      placement="bottom"
      popper-class="w-pumpFilter popper new-popover"
      title=""
      :width="398"
      trigger="click"
      popper-style="padding: 10px"
      append-to-body
      :persistent="false"
    >
      <template #reference>
        <div :class="['filter-btn', { active: visible }, filterNumber > 0 ? 'hight': '']" class="min-h-28px">
          <Icon
            id="custom-filter"
            name="custom:filter"
            class="text-10px cursor-pointer"
            :class="!hideReferenceText?'mr-3px':''"
          />
          <span v-if="!hideReferenceText">{{ $t('filter') }}</span>
          <span v-if="filterNumber > 0" class="filter-number">{{ filterNumber }}</span>
        </div>
      </template>

      <template #default>
        <span class="text-14px block border pb-10px">{{ $t('FilterSetting') }}</span>
        <el-form
          ref="formRef"
          class="hide-scrollbar"
          :model="form"
          label-width="auto"
          autocomplete="off"
          label-position="left"
          size="small"
          @submit.prevent
        >
        <el-scrollbar view-class="filter-height">
          <el-form-item
              :label="$t('searchTip')"
              :prop="form.q"
              class="border pb-20px pt-20px"
            >
            <div class="formItem inputRange">
              <el-input v-model.trim="form.q" class="search-input1"   placeholder="abc,abc,abc" @input="(val) => form.q = val.replace(/\s/g, '')" />
            </div>

          </el-form-item>
          <el-form-item
              :label="$t('dev_sold_out')"
              :prop="form.q"
            >
            <div class="formItem checkbox">
              <el-checkbox v-model="form.dev_sale_out" :true-value="1" :false-value="0"/>
            </div>
          </el-form-item>

          <el-form-item
              v-if="!props.storage?.includes('_graduated')"
              :label="`${t('progress')}(%)`"
              class="border pb-20px"
            >

            <div class="formItem inputRange">
                  <el-input
                    v-model.trim.number="form.progress_min"
                    :placeholder="$t('minor')"
                    
                    @blur="(val) => handleBlur(['progress_min', 'progress_max'], val, 0)"
                    @input="(val) => handleInput(['progress_min', 'progress_max'], val, 0)"
                  >
                    <template #suffix>
                      <span>%</span>
                    </template>
                  </el-input>
                  <span class="gap">~</span>
                  <el-input
                    v-model.trim.number="form.progress_max"
                    :placeholder="$t('max1')"
                    
                    @blur="(val) => handleBlur(['progress_min', 'progress_max'], val, 1)"
                    @input="(val) => handleInput(['progress_min', 'progress_max'], val, 1)"
                  >
                    <template #suffix>
                      <span>%</span>
                    </template>
                  </el-input>
                </div>
          </el-form-item>

        <div class="tabs">
          <button
            v-for="item in tabs"
            :key="item.id"
            :class="{ active: item.id === active }"
            class="flex-start"
            type="button"
            @click.stop="active = item.id"
          >
            <span>{{ item.name || '' }}</span>
          </button>
        </div>

          <template v-for="(column) in columns" :key="column.label">
            <el-form-item
              v-if="active== column.tab"
              class="mt-20px px-10px"
              :label="column.tab !== 'media' ?column.label : ''"
              :prop="isArray(column.prop) ? '' : isString(column.prop) ? column.prop : ''"
            >
              <template v-if="column.type === 'inputRange'">
                <div :class="['formItem', column.type]">
                  <el-input
                    v-model.trim.number="form[column.prop[0]]"
                    :placeholder="column?.placeholder && column?.placeholder[0]"
                    
                    @blur="(val) => handleBlur(column.prop, val, 0)"
                    @input="(val) => handleInput(column.prop, val, 0)"
                  >
                    <template  v-if="column.suffix" #suffix>
                      <span>{{ column.suffix }}</span>
                    </template>
                  </el-input>
                  <span class="gap">~</span>
                  <el-input
                    v-model.trim.number="form[column.prop[1]]"
                    :placeholder="column?.placeholder && column?.placeholder[1]"
                    
                    @blur="(val) => handleBlur(column.prop, val, 1)"
                    @input="(val) => handleInput(column.prop, val, 1)"

                  >
                    <template v-if="column.suffix" #suffix>
                      <span>{{ column.suffix }}</span>
                    </template>
                  </el-input>
                </div>
              </template>
              <template v-else-if="column.type === 'media'">
                <div :class="['formItem', column.type]">
                  <el-checkbox-group
                  v-model="form[column.prop]"
                  :disabled="form.has_sm ==1"
                    >
                      <el-checkbox v-for="(item,$index) in column.list" :key="$index" class="mt-20px" :value="item.url">
                        {{ item.name }}
                      </el-checkbox>
                  </el-checkbox-group>
                </div>
              </template>
              <template v-else-if="column.type === 'checkbox'">
                  <el-checkbox v-model="form[column.prop]" :true-value="1" :false-value="0">{{ column.label}}</el-checkbox>
              </template>

              <template v-else>
                <div :class="['formItem', column.type]">
                  <el-input v-model="form[column.prop]" >
                    <template v-if="column.suffix" #suffix>
                      <span>{{ column.suffix }}</span>
                    </template>
                  </el-input>
                </div>
              </template>
            </el-form-item>
          </template>
        </el-scrollbar>

          <el-form-item>
            <div style="display: flex; width: 100%" class="mt-30px">
              <el-button
                class="flex-1"
                style="height: 30px; min-width: 60px; --el-button-font-weight: 400; background: var(--border); border: none;color: var(--main-text)"
                @click="reset"
              >
                {{ $t('reset') }}
              </el-button>
              <el-button
                style="height: 30px; min-width: 60px; --el-button-font-weight: 400; background:#3F80F7; color: #f5f5f5"
                type="primary"
                class="flex-1"
                @click="handleConfirm"
              >
                {{ $t('confirm') }}
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </template>
    </el-popover>
  </template>

  <script setup lang="ts">
  import { handleError } from 'vue'
import { usePumpTableDataFetching, _isArray, _isString } from '@/utils/index.js'
const props = defineProps({
    storage: {
      type: String,
      default: 'pumpFilter_bsc_new'
    },
    hideReferenceText:{
      type:Boolean
    }
})
const emit = defineEmits(['update:filterData'])
const globalStore = useGlobalStore()
const { isDark } = storeToRefs(globalStore)
const { t } = useI18n()

  const limitData = {
  q: '',
  dev_sale_out: 0,
  platforms: 'pump,moonshot',
  platforms_pump: true,
  platforms_moonshot: true,
  progress_min: 0, //进度
  progress_max: 100,

  lage: '', //代币时长
  rage: '',
  dev_balance_ratio_cur_min: 0, //dev 持仓%
  dev_balance_ratio_cur_max: 100,
  holder_min: 0, //持有人
  holder_max: 1000000,
  holders_top10_ratio_min: 0, //top10 持仓%
  holders_top10_ratio_max: 100,
  lsnip: '',   //狙击人数
  rsnip: '',
  smart_money_tx_count_24h_min: 0, // 聪明钱交易数 （买入数+卖出数）
  smart_money_tx_count_24h_max: 1000000,
  lins: '',  //老鼠仓
  rins: '',
  lkol: '',  //KOL交易人数
  rkol: '',
  lrug: '', //跑路概率
  rrug:'',

  market_cap_min: 0, // 市值
  market_cap_max: 10000000,
  volume_u_24h_min: 0, //交易额
  volume_u_24h_max: 10000000,

  lbtx: '' ,//买入交易数
  rbtx: '',
  lstx: '', //卖出交易数
  rstx: '',
  lmks: '', //24h 钱包数
  rmks: '',
  sm_list: [],
  has_sm: 0
}
  const initForm = {
  q: '',
  dev_sale_out: 0,
  platforms: 'pump,moonshot',
  platforms_pump: true,
  platforms_moonshot: true,
  progress_min: '', //进度
  progress_max: '',

  lage: '', //代币时长
  rage: '',
  dev_balance_ratio_cur_min: '', //dev 持仓%
  dev_balance_ratio_cur_max: '',
  holder_min: '', //持有人
  holder_max: '',
  holders_top10_ratio_min: '', //top10 持仓%
  holders_top10_ratio_max: '',
  lsnip: '',   //狙击人数
  rsnip: '',
  smart_money_tx_count_24h_min: '', // 聪明钱交易数 （买入数+卖出数）
  smart_money_tx_count_24h_max: '',
  lins: '',  //老鼠仓
  rins: '',
  lkol: '',  //KOL交易人数
  rkol: '',
  lrug: '', //跑路概率
  rrug:'',

  market_cap_min: '', // 市值
  market_cap_max: '',
  volume_u_24h_min: '', //交易额
  volume_u_24h_max: '',
  lbtx: '' ,//买入交易数
  rbtx: '',
  lstx: '', //卖出交易数
  rstx: '',
  lmks: '', //卖出交易数
  rmks: '',
  sm_list: [],
  has_sm: 0

  // tvl_min: '',
  // tvl_max: '',

  // tx_24h_count_min: '',
  // tx_24h_count_max: '',

}
const visible = ref(false)
const formRef = ref()
type FormType = typeof initForm
const form = ref<FormType>(initForm)
const tableFilter = usePumpTableDataFetching(props.storage)
const active = shallowRef('tag')
const tabs = computed(() => {
  return [
    { name: t('chainToken'), id: 'tag' },
    { name: t('marketIndices'), id: 'market' },
    { name: t('media'), id: 'media' }
  ]
})
  watch(visible, (val) => {
    if (val) {
      const platformsArr = (tableFilter?.value?.platforms || 'pump,moonshot')?.split?.(',') || []
      form.value = {...tableFilter.value, platforms_pump: platformsArr.includes('pump'), platforms_moonshot: platformsArr.includes('moonshot')}
    }
  })
    // watch(() => props.storage, (val) => {
    //     tableFilter.value = usePumpTableDataFetching(val)
    // })

  const columns = computed(() => {
    const c = [
        {
          label: `${t('tokenDuration')}`,
          prop: ['lage', 'rage'],
          placeholder: [t('minor'), t('max1')],
          type: 'inputRange',
          suffix: 'm',
          tab: 'tag'
        },
        {
          label: `Dev ${t('positions')}(%)`,
          prop: ['dev_balance_ratio_cur_min', 'dev_balance_ratio_cur_max'],
          placeholder: [t('minor'), t('max1')],
          type: 'inputRange',
          suffix: '%',
          tab: 'tag'
        },
        {
          label: `${t('tokenHolders')}`,
          prop: ['holder_min', 'holder_max'],
          placeholder: [t('minor'), t('max1')],
          type: 'inputRange',
          tab: 'tag'
        },
        {
          label: `Top10 ${t('positions')}(%)`,
          prop: ['holders_top10_ratio_min', 'holders_top10_ratio_max'],
          placeholder: [t('minor'), t('max1')],
          type: 'inputRange',
          suffix: '%',
          tab: 'tag'
        },

        {
          label: t('snipers'),
          prop: ['lsnip', 'rsnip'],
          placeholder: [t('minor'), t('max1')],
          type: 'inputRange',
          tab: 'tag'
        },
        {
          label: t('smarterTxs'),
          prop: [
            'smart_money_tx_count_24h_min',
            'smart_money_tx_count_24h_max'
          ],
          placeholder: [t('minor'), t('max1')],
          type: 'inputRange',
          suffix: '',
          tab: 'tag'
        },

        {
          label: t('insiders'),
          prop: [
            'lins',
            'rins'
          ],
          placeholder: [t('minor'), t('max1')],
          type: 'inputRange',
          suffix: '%',
          tab: 'tag'
        },
        {
          label: t('KOLTraders'),
          prop: [
            'lkol',
            'rkol'
          ],
          placeholder: [t('minor'), t('max1')],
          type: 'inputRange',
          tab: 'tag'
        },
        {
          label: `${t('runPullRatio')}`,
          prop: [
            'lrug',
            'rrug'
          ],
          placeholder: [t('minor'), t('max1')],
          type: 'inputRange',
          suffix: '%',
          tab: 'tag'
        },

        {
          label: `${t('MC')}($)`,
          prop: ['market_cap_min', 'market_cap_max'],
          placeholder: [t('minor'), t('max1')],
          type: 'inputRange',
          suffix: '$',
          tab: 'market'
        },
        {
          label: `${t('24Volume')}($)`,
          prop: ['volume_u_24h_min', 'volume_u_24h_max'],
          placeholder: [t('minor'), t('max1')],
          type: 'inputRange',
          suffix: '$',
          tab: 'market'
        },
        {
          label: `${t('buyTxs')}`,
          prop: ['lbtx', 'rbtx'],
          placeholder: [t('minor'), t('max1')],
          type: 'inputRange',
          tab: 'market'
        },
        {
          label: `${t('sellTxs')}`,
          prop: ['lstx', 'rstx'],
          placeholder: [t('minor'), t('max1')],
          type: 'inputRange',
          tab: 'market'
        },
        {
          label: `${t('24hMarkers')}`,
          prop: ['lmks', 'rmks'],
          placeholder: [t('minor'), t('max1')],
          type: 'inputRange',
          tab: 'market'
        },
        {
          label: 'media',
          prop: 'sm_list',
          type: 'media',
          list: [
                  {
                    name: 'Website',
                    url: 'website'
                  },
                  {
                    name: 'Twitter',
                    url: 'twitter'
                  },
                  {
                    name: 'Telegram',
                    url: 'telegram'
                  },
                  {
                    name: 'Tiktok',
                    url: 'tiktok'
                  },
                  {
                    name: 'Instagram',
                    url: 'instagram'
                  }
          ],
          tab: 'media'
        },
        {
          label: `${t('oneOfficial')}`,
          prop: 'has_sm',
          type: 'checkbox',
          tab: 'media'
        },
        // {
        //   label: `${t('liquidity')}($)`,
        //   prop: ['tvl_min', 'tvl_max'],
        //   placeholder: [t('minor'), t('max1')],
        //   type: 'inputRange',
        //   suffix: '$'
        // },
        // {
        //   label: t('Txs'),
        //   prop: ['tx_24h_count_min', 'tx_24h_count_max'],
        //   placeholder: [t('minor'), t('max1')],
        //   type: 'inputRange'
        // },
      ]
    return c || []
  })

  const filterNumber = computed(() => {
    const form = tableFilter.value
    let filterList = Object.keys(form).filter((key) => form[key] !== null && form[key] !== undefined && form[key] !== '' && form[key] !== 0 && (form[key]?.length >0 || form[key] ==1))
    filterList = Array.from(new Set(filterList.map(key => key.replace(/_min|_max$/g, ''))))
    if (filterList.includes('has_sm') && filterList.includes('sm_list')) {
      // 任选其一删除，这里以删除 'lage' 为例
      const index = filterList.indexOf('sm_list')
      if (index !== -1) {
        filterList.splice(index, 1)
      }
    }

    if (filterList.includes('lage') && filterList.includes('rage')) {
      // 任选其一删除，这里以删除 'lage' 为例
      const index = filterList.indexOf('rage')
      if (index !== -1) {
        filterList.splice(index, 1)
      }
    }

    if (filterList.includes('lsnip') && filterList.includes('rsnip')) {
      // 任选其一删除，这里以删除 'lage' 为例
      const index = filterList.indexOf('rsnip')
      if (index !== -1) {
        filterList.splice(index, 1)
      }
    }

    if (filterList.includes('lins') && filterList.includes('rins')) {
      // 任选其一删除，这里以删除 'lage' 为例
      const index = filterList.indexOf('rins')
      if (index !== -1) {
        filterList.splice(index, 1)
      }
    }

    if (filterList.includes('lkol') && filterList.includes('rkol')) {
      // 任选其一删除，这里以删除 'lage' 为例
      const index = filterList.indexOf('rkol')
      if (index !== -1) {
        filterList.splice(index, 1)
      }
    }
    if (filterList.includes('lbtx') && filterList.includes('rbtx')) {
      // 任选其一删除，这里以删除 'lage' 为例
      const index = filterList.indexOf('lbtx')
      if (index !== -1) {
        filterList.splice(index, 1)
      }
    }
    if (filterList.includes('lstx') && filterList.includes('rstx')) {
      // 任选其一删除，这里以删除 'lage' 为例
      const index = filterList.indexOf('rstx')
      if (index !== -1) {
        filterList.splice(index, 1)
      }
    }
    if (filterList.includes('lmks') && filterList.includes('rmks')) {
      // 任选其一删除，这里以删除 'lage' 为例
      const index = filterList.indexOf('lmks')
      if (index !== -1) {
        filterList.splice(index, 1)
      }
    }

    if (filterList.includes('lrug') && filterList.includes('rrug')) {
      // 任选其一删除，这里以删除 'lage' 为例
      const index = filterList.indexOf('rrug')
      if (index !== -1) {
        filterList.splice(index, 1)
      }
    }


      filterList = filterList?.filter(i => i !== 'platforms' )
    return filterList?.length || 0
  })

  function handleConfirm() {
    visible.value = false
  // 使用 ref 来访问表单实例，并进行验证
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      const form1 = switchForm(form.value)
      tableFilter.value = { ...form1 }
      console.log('----------form1-------------',form1)
      emit('update:filterData', { ...form1},props.storage)
    } else {
      handleError('error')
      return false
    }
  })
  }

  function reset() {
    visible.value = false  // 隐藏视图
    if (formRef.value) {
      formRef.value.resetFields()  // 重置表单字段
    }
    const form = switchForm(initForm)
    tableFilter.value = { ...form }  // 更新过滤器数据
    // 触发更新事件
    emit('update:filterData', { ...form },props.storage)
  }

  function handleInput(props: string[], val: string, index: number) {
    const key = props[index] || ''
    form.value[key] = val.replace(/-|[^\d.]/g, '')
  }

  function handleBlur(props: string[], val: string, index: number) {
    const key = props[index] || ''
      const defaultRange = props
        ? [limitData[props[0]], limitData[props[1]]]
        : []
      // form.value[a]=Number(b)
    // form.value[key]=val.replace(/\-|[^\d.]/g, '')
    if (form.value[key]) {
        if (defaultRange[0] && Number.parseFloat(form.value[key]) <= defaultRange[0])
          form.value[key] = defaultRange[0]


        if (defaultRange[1] && Number.parseFloat(form.value[key]) >= defaultRange[1])
          form.value[key] = defaultRange[1]
          if (index == 1) {
          if (!form.value[props[0]]) return
          if (
            Number.parseFloat(form.value[key]) <=
            Number.parseFloat(form.value[props[0]])
          ) {
            form.value[key] = form.value[props[0]]
          }
        } else {
          if (!form.value[props[1]]) return
          if (
            Number.parseFloat(form.value[key]) >=
            Number.parseFloat(form.value[props[1]])
          ) {
            // if (this.form[key] >= this.form[props[1]]) {
            form.value[key] = form.value[props[1]]
          }
        }



      }
  }

  function switchForm(f: any) {
    const form = { ...f }
    const platforms = []
    if (form.platforms_pump) platforms.push('pump')
    if (form.platforms_moonshot) platforms.push('moonshot')
    form.platforms = platforms.join(',')
    delete form.platforms_pump
    delete form.platforms_moonshot
    return form
  }

  const isArray = _isArray
  const isString = _isString
  </script>

<style lang="scss">
.w-pumpFilter.el-popover.el-popper {
  padding: 30px 20px;

  .el-form {
    .el-form-item {
      .formItem {
        display: flex;
        justify-content: flex-end;
        width: 100%;
      }

      .inputRange {
        display: flex;

        .gap {
          display: inline-block;
          position: relative;
          margin: 0 8px;
        }

        /* .el-input:first-child::after{
                    display: inline-block;
                    position: relative;
                    content: '～';
                    margin: 0 8px;
                } */
        /* .el-input{
                    width: 48%;
                } */
      }
    }
  }
}
</style>
<style scoped lang="scss">
/* Add your component styles here */

.filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 8px;
  cursor: pointer;
  color: var(--third-text);
  background: var(--main-input-button-bg);
  border-radius: 4px;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0;
  font-weight: 500;
  box-sizing: border-box;
  height: 26px;
  position: relative;
  &.hight{
    color: var(--main-text)
  }

  img {
    margin-right: 2px;
  }

  .filter-number {
    position: relative;
    display: inline-block;
    border-radius: 2px;
    width: 14px;
    height: 14px;
    text-align: center;
    background-color: var(--third-text);
    color: var(--main-text);
    margin-left: 4px;
    font-size: 10px;
  }

  &:hover {
    cursor: pointer;
    color: var(--main-text);
    .iconify {
      color: var(--main-text);
    }
  }

  /* &.active {
        color: var(--a-text-1-dark-color);
        background: var(--a-bg-active-color);
    } */
}
.tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--border);
  padding: 4px;
  border-radius: 4px;
  font-size: 12px;
  height: 36px;

  button {
    border: none;
    // font-size: 14px;
    color: var(--third-text);
    letter-spacing: 0;
    font-weight: 400;
    cursor: pointer;
    border-radius: 4px;
    border: 1ox solid var(--border);
    background: transparent;
    min-width: 36px;
    padding: 6px 6px;
    text-align: center;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    &.active {
      color: var(--main-text);
      background: var(--dialog-tab-active-bg);
    }
  }
}
.border{
  border: none;
  border-bottom: 1px solid var(--dialog-divider);
}
:deep().el-form-item__label{
  color: var(--secondary-text);

}
:deep().el-checkbox__inner{
  border-color: var(--border);

}
:deep().el-checkbox__label{
  color: var(--third-text);
}
:deep().el-input.el-input {
  --el-input-bg-color: var(--border);
  --el-input-border-color: var(--border);
  --el-input-border-radius: 4px;
  color: var(--main-text);
  .el-checkbox__inner{
      border-color: var(--border);
    }
  .el-input__wrapper {
    background: transparent;
    &:hover {
      box-shadow: 0 0 0 1px #3F80F7 inset;
    }
    &.is-focus {
      border-color: #3F80F7; /* 蓝色 */
      box-shadow: 0 0 0 1px #3F80F7 inset;
    }
    .el-input__suffix{
      color: var(--third-text)
    }
    .el-input__inner{
      color: var(--main-text);
      &::placeholder {
        color: var(--third-text);
      }
    }
  }
}

</style>
