<template>
  <el-popover
      v-model:visible="visible"
      placement="bottom"
      popper-class="w-pumpFilter"
      title=""
      :width="398"
      trigger="click"
    >
      <template #reference>
        <div :class="['filter-btn', { active: visible }, filterNumber > 0 ? 'hight': '']">
          <Icon
            id="custom-filter"
            name="custom:filter"
            class="mr-3px text-12px cursor-pointer"
          />
          <span >{{ $t('filters') }}</span>
          <span v-if="filterNumber > 0" class="filter-number">{{ filterNumber }}</span>
        </div>
      </template>

      <template #default>
        <el-form
          :model="form"
          label-width="auto"
          ref="formRef"
          autocomplete="off"
          label-position="left"
          size="small"
          @submit.prevent
        >
          <template v-for="column in columns" :key="column.label">
            <el-form-item
              :label="column.label"
              :prop="isArray(column.prop) ? '' : isString(column.prop) ? column.prop : ''"
            >
              <template v-if="column.type === 'inputRange'">
                <div :class="['formItem', column.type]">
                  <el-input
                    v-model.trim.number="form[column.prop[0]]"
                    @blur="(val) => handleBlur(column.prop, val, 0)"
                    @input="(val) => handleInput(column.prop, val, 0)"
                    :placeholder="column?.placeholder && column?.placeholder[0]"
                    clearable
                  >
                    <template #suffix v-if="column.suffix">
                      <span>{{ column.suffix }}</span>
                    </template>
                  </el-input>
                  <span class="gap">~</span>
                  <el-input
                    v-model.trim.number="form[column.prop[1]]"
                    @blur="(val) => handleBlur(column.prop, val, 1)"
                    @input="(val) => handleInput(column.prop, val, 1)"
                    :placeholder="column?.placeholder && column?.placeholder[1]"
                    clearable
                  >
                    <template #suffix v-if="column.suffix">
                      <span>{{ column.suffix }}</span>
                    </template>
                  </el-input>
                </div>
              </template>

              <template v-else-if="column.type === 'checkbox'">
                <div :class="['formItem', column.type]">
                  <el-checkbox v-model="form[column.prop]" :true-value="1" :false-value="0"></el-checkbox>
                </div>
              </template>

              <template v-else>
                <div :class="['formItem', column.type]">
                  <el-input v-model="form[column.prop]" clearable></el-input>
                </div>
              </template>
            </el-form-item>
          </template>

          <el-form-item>
            <div style="display: flex; width: 100%">
              <el-button
                style="height: 30px; min-width: 60px; --el-button-font-weight: 400; background: var(--d-333333-l-DDDDDD); border: none"
                :color="isDark? '#222222' : '#f5f5f5'"
                @click="reset"
                class="flex-1"
              >
                {{ $t('reset') }}
              </el-button>
              <el-button
                :color="isDark? '#222222' : '#f5f5f5'"
                style="height: 30px; min-width: 60px; --el-button-font-weight: 400; background:#3F80F7"
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
import type { ConstructorFragment } from 'ethers'
const props = defineProps({
    storage: {
      type: String,
      default: 'pumpFilter_bsc_new'
    }
})
const emit = defineEmits(['update:filterData'])
const globalStore = useGlobalStore()
const { isDark } = storeToRefs(globalStore)
const { t } = useI18n()

const limitData = {
  market_cap_min: 0, // 市值
  market_cap_max: 10000000,
  progress_min: 0, //进度
  progress_max: 100,
  volume_u_24h_min: 0, //交易额
  volume_u_24h_max: 10000000,
  dev_balance_ratio_cur_min: 0, //dev 持仓%
  dev_balance_ratio_cur_max: 100,
  holders_top10_ratio_min: 0, //top10 持仓%
  holders_top10_ratio_max: 100,
  tvl_min: 0,
  tvl_max: 100000000,
  holder_min: 0, //持有人
  holder_max: 1000000,
  tx_24h_count_min: 0,
  tx_24h_count_max: 10000000,
  smart_money_tx_count_24h_min: 0, // 聪明钱交易数 （买入数+卖出数）
  smart_money_tx_count_24h_max: 1000000
}
let initForm = {
  dev_sale_out: 0,
  platforms: 'pump,moonshot',
  platforms_pump: true,
  platforms_moonshot: true,
  market_cap_min: '', // 市值
  market_cap_max: '',
  progress_min: '', //进度
  progress_max: '',
  volume_u_24h_min: '', //交易额
  volume_u_24h_max: '',
  dev_balance_ratio_cur_min: '', //dev 持仓%
  dev_balance_ratio_cur_max: '',
  holders_top10_ratio_min: '', //top10 持仓%
  holders_top10_ratio_max: '',
  tvl_min: '',
  tvl_max: '',
  holder_min: '', //持有人
  holder_max: '',
  tx_24h_count_min: '',
  tx_24h_count_max: '',
  smart_money_tx_count_24h_min: '', // 聪明钱交易数 （买入数+卖出数）
  smart_money_tx_count_24h_max: ''
}
const visible = ref(false)
const formRef = ref()
  const form = ref(initForm)
let tableFilter = usePumpTableDataFetching(props.storage)

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
    let c = [
        {
          label: t('dev_sold_out'),
          prop: 'dev_sale_out',
          type: 'checkbox'
        },
        {
          label: `${t('MC')}($)`,
          prop: ['market_cap_min', 'market_cap_max'],
          placeholder: [t('minor'), t('max1')],
          type: 'inputRange',
          suffix: '$'
        },
        {
          label: `${t('progress')}(%)`,
          prop: ['progress_min', 'progress_max'],
          placeholder: [t('minor'), t('max1')],
          type: 'inputRange',
          suffix: '%',
          type1: 'progress'
        },
        {
          label: `${t('volume4')}($)`,
          prop: ['volume_u_24h_min', 'volume_u_24h_max'],
          placeholder: [t('minor'), t('max1')],
          type: 'inputRange',
          suffix: '$'
        },
        {
          label: `Dev ${t('positions')}(%)`,
          prop: ['dev_balance_ratio_cur_min', 'dev_balance_ratio_cur_max'],
          placeholder: [t('minor'), t('max1')],
          type: 'inputRange',
          suffix: '%'
        },
        {
          label: `Top10 ${t('positions')}(%)`,
          prop: ['holders_top10_ratio_min', 'holders_top10_ratio_max'],
          placeholder: [t('minor'), t('max1')],
          type: 'inputRange',
          suffix: '%'
        },
        {
          label: `${t('liquidity')}($)`,
          prop: ['tvl_min', 'tvl_max'],
          placeholder: [t('minor'), t('max1')],
          type: 'inputRange',
          suffix: '$'
        },
        {
          label: `${t('holders4')}`,
          prop: ['holder_min', 'holder_max'],
          placeholder: [t('minor'), t('max1')],
          type: 'inputRange'
        },
        {
          label: t('Txs'),
          prop: ['tx_24h_count_min', 'tx_24h_count_max'],
          placeholder: [t('minor'), t('max1')],
          type: 'inputRange'
        },
        {
          label: t('smarterTxs'),
          prop: [
            'smart_money_tx_count_24h_min',
            'smart_money_tx_count_24h_max'
          ],
          placeholder: [t('minor'), t('max1')],
          type: 'inputRange'
        }
      ]
    return c.filter(i => !(i.type1 === 'progress' && props.storage?.includes('_graduated')))
  })

  const filterNumber = computed(() => {
    const form = tableFilter.value
    let filterList = Object.keys(form).filter((key) => form[key] !== null && form[key] !== undefined && form[key] !== '' && form[key] !== 0)
      filterList = Array.from(new Set(filterList.map(key => key.replace(/_min|_max$/g, ''))))
      filterList = filterList?.filter(i => i !== 'platforms')
    return filterList?.length || 0
  })

  function handleConfirm() {
    visible.value = false
  // 使用 ref 来访问表单实例，并进行验证
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      const form1 = switchForm(form.value)
      tableFilter.value = { ...form1 }
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
    // Handle the input blur event, adjust range values, etc.
  }

  function switchForm(f: any) {
    let form = { ...f }
    let platforms = []
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
  color: var(--d-666-l-999);
  background: var(--d-222-l-F2F2F2);
  border-radius: 4px;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0;
  font-weight: 500;
  box-sizing: border-box;
  height: 26px;
  position: relative;
  &.hight{
    color: var(--d-999-l-666)
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
    background-color: var(--d-666-l-999);
    color: var(--d-F5F5F5-l-333);
    margin-left: 4px;
    font-size: 10px;
  }

  &:hover {
    cursor: pointer;
    color: var(--d-F5F5F5-l-333);
    .iconify {
      color: var(--d-F5F5F5-l-333);
    }
  }

  /* &.active {
        color: var(--a-text-1-dark-color);
        background: var(--a-bg-active-color);
    } */
}
</style>
