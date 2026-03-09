<script setup lang="ts">
import * as echarts from '@/utils/echarts'
import type {GetTokenDetailMarksResponse} from '~/api/token'

import add_liquidity from 'assets/images/mark/add_liquidity.png'
import burn from 'assets/images/mark/burn.png'
import buy from 'assets/images/mark/buy2.png'
import remove_liquidity from 'assets/images/mark/remove_liquidity.png'
import sell from 'assets/images/mark/sell.png'
import T_Trading from 'assets/images/mark/T_Trading.png'
import transfer_in from 'assets/images/mark/transfer_in.png'
import transfer_out from 'assets/images/mark/transfer_out.png'
const images: any = {
  add_liquidity,
  burn,
  buy,
  remove_liquidity,
  sell,
  T_Trading,
  transfer_in,
  transfer_out
}

const props = defineProps({
  dataList: {
    type: Array<any>,
    required: true
  },
  showSeries: {
    type: Array,
    required: true
  },
  loading: Boolean,
  marks: {
    type: Array<GetTokenDetailMarksResponse>,
    required: true
  },
  activeTime: {
    type: Number,
    required: true
  }
})

const localeStore = useLocaleStore()
const themeStore = useThemeStore()
const {t} = useI18n()
const lineChartRef = useTemplateRef('lineChartRef')
let myChart: any = null
const language = computed(() => localeStore.locale)
const format = computed(() => {
  return props.activeTime == 14400 || props.activeTime == 86400
    ? 'HH:mm' : 'MM-DD HH:mm'
})
const option = computed(() => [
  {
    k: 10,
    color: '#286DFF',
    label: t('price'),
    value: 'close',
    color1: 'rgba(117,115, 243, 1)'
  }
])
const dataX = computed(() => props.dataList?.map?.(i =>
  formatDate(
    i.time,
    format.value
  )
))
const markPoint = computed(() => {
  return props.marks?.map?.((y: any) => {
    return {
      name: t(y.type),
      value: '',
      // coord: [formatDate(y.time, 'HH:mm'), find?.close],
      coord: [formatDate(y.time, format.value), y.coordY],
      symbolOffset: [0, (y.type == 'sell' || y.type == 'remove_liquidity' ? 1 : -1) * y.count * 12],
      itemStyle: {
        color: 'transparent'
        // backgroundColor: '#12b886'
      },
      symbol: `image://${images[y.type]}`, // 替换为你的图标链接
      symbolSize: [12, 12],
      animation: true,
      label: {
        show: true
      },
      tooltip: {
        backgroundColor: 'var(--dialog-bg)',
        trigger: 'item',
        borderWidth: 0,
        textStyle: {
          fontSize: 10,
          color: 'var(--secondary-text)'
        },
        confine: true,
        formatter: () => {
          const buyTxt = `${t('amountB')}(${t('buy')})： ${formatNumber(
            y?.['buy']?.amount || 0,
            2
          )}</br>
               ${t('amountU')}(${t('buy')})： $${formatNumber(
            y?.['buy']?.volume || 0,
            2
          )}</br>
              ${t('price')}(${t('buy')})： $${formatNumber(
            y?.['buy']?.volume / (y?.['buy']?.amount || 1) || 0,
            2
          )}</br>
              ${t('Txs')}(${t('buy')})： ${formatNumber(y['buy']?.txns || 0)}
              `
          const sellTxt = `${t('amountB')}(${t('sell')})： ${formatNumber(
            y?.['sell']?.amount || 0,
            2
          )}</br>
               ${t('amountU')}(${t('sell')})： $${formatNumber(
            y?.['sell']?.volume || 0,
            2
          )}</br>
               ${t('price')}(${t('sell')})： $${formatNumber(
            y?.['sell']?.volume / (y?.['sell']?.amount || 1) || 0,
            2
          )}</br>
              ${t('Txs')}(${t('sell')})： ${formatNumber(y['sell']?.txns || 0)}
              `
          if (y.type == 'T_Trading') {
            return `${formatDate(
              y.time, format.value
            )}<div class="flex items-center mt-5px"><span class="w-10px h-10px rounded-full bg-#286DFF block mr-5px"></span> ${t(
              y.type
            )}</div>
               ${buyTxt}</br>
               ${sellTxt}
                `
          } else if (y.type == 'add_liquidity' || y.type == 'remove_liquidity') {
            return `${formatDate(
              y.time, format.value)}<div class="flex items-center mt-5px"><span class="w-10px h-10px rounded-full bg-#286DFF block mr-5px"></span> ${t(
              y.type
            )}</div><div class="flex">${t(
              'amountB'
            )}： <div>${formatNumber(y[y.type].token0_amount || 0, 2)} ${y[y.type].Token0_symbol}</br>
                 ${formatNumber(y[y.type].token1_amount || 0, 2)} ${y[y.type].Token1_symbol}</br>
                 </div></div>
               <div class="flex">${t(
              'amountU'
            )}： <div>$${formatNumber(y[y.type].token0_volume || 0, 2)} ${y[y.type].Token0_symbol}</br>
                 $${formatNumber(y[y.type].token1_volume || 0, 2)} ${y[y.type].Token1_symbol
            }</div></div>`
          } else {
            return `${formatDate(
              y.time, format.value
            )}<div class="flex items-center mt-5px"><span class="w-10px h-10px rounded-full bg-#286DFF block mr-5px"></span> ${t(
              y.type
            )}</div>
               ${t('amountB')}： ${formatNumber(
              y?.[y.type]?.amount || 0,
              2
            )}</br>
               ${t('amountU')}： $${formatNumber(
              y?.[y.type]?.volume || 0,
              2
            )}</br>
               ${t('price')}： $${formatNumber(
              y?.[y.type]?.volume / (y?.[y.type]?.amount || 1) || 0,
              2
            )}</br>
              ${t('Txs')}： ${formatNumber(y[y.type].txns)}
                `
          }
        },
        // valueFormatter: value => formatNumber(value || 0, 2),
        appendToBody: true
      }
    }
  })
})

const series = computed(() => {
  return option.value.map((i) => {
    return {
      name: i.label,
      type: 'line',
      z: 0,
      smooth: true,
      // symbol: 'none',
      // stack: 'total',
      symbolSize: 1,
      itemStyle: {
        color: i.color // 折线点的颜色
      },
      lineStyle: {
        width: 2
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgb(40, 109, 255, 0.9)' // 0% 处的颜色
            },
            {
              offset: 1,
              color: !themeStore.isDark ? '#fff' : 'rgb(23, 25, 28)' // 100% 处的颜色
            }
          ],
          globalCoord: false // 缺省为 false
        }
      },
      emphasis: {
        disabled: true,
        focus: 'series'
      },
      data: props.dataList.map(j => {
        // console.log('--------this.dataList-------', j)
        return j[i.value]
      }),
      markPoint: {
        z: 1111111111111,
        data: markPoint.value
      }
    }
  })
})

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  if (myChart) {
    myChart.dispose()
    myChart = null
  }
})

watch(() => [props.marks, props.dataList, language.value, themeStore.isDark], () => {
  init()
})

function init() {
  if (!myChart) {
    myChart = echarts.init(lineChartRef.value)
  }
  const option = {
    legend: {
      show: false
    },
    tooltip: {
      backgroundColor: 'var(--dialog-bg)',
      trigger: 'axis',
      borderWidth: 0,
      textStyle: {
        fontSize: 10,
        color: 'var(--secondary-text)'
      },
      valueFormatter: (value: number) => '$' + formatNumber(value || 0, 2),
      appendToBody: true
    },
    grid: {
      left: '16', //图表距边框的距离
      right: '0',
      top: '40',
      bottom: '0',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dataX.value,
      boundaryGap: ['0', '20'],
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: !themeStore.isDark ? '#8ca0c3' : '#566275',
        fontFamily: 'Outfit-Medium',
        formatter:(value:string)=>{
           return value.split(' ').join('\n')
        }
      },
      nameTextStyle: {
        fontSize: 10
      },
      axisLine: {
        lineStyle: {
          color: '#17191c1a'
        }
      }
    },
    yAxis: {
      type: 'value',
      position: 'right',
      name: '',
      nameTextStyle: {
        fontSize: 10
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: !themeStore.isDark ? '#8ca0c3' : '#566275',
        fontFamily: 'Outfit-Medium',
        formatter: '{value}'
      },
      splitLine: {
        show: false
      },
      min: function () {
        return 0
      }
    },
    series: series.value
  }
  myChart.setOption(option)
}
</script>

<template>
  <div class="m-0 text-left w-full">
    <div ref="lineChartRef" class="w-680px h-200px"/>
  </div>
</template>

<style scoped lang="scss">

</style>
