<script setup lang="ts">
import * as echarts from 'echarts'
import type {  KlineDatum } from '~/api/market'

const retryCount = ref(0)
const maxCount = 3
let timer:number
const chartDom = useTemplateRef('chartDom')
const chartInstance = shallowRef<echarts.ECharts>()
const globalStore = useGlobalStore()
const props = defineProps<{
    list:KlineDatum[]
}>()
const isIntersecting = ref(false)
const observer = new IntersectionObserver(entries=>{
    isIntersecting.value = entries[0].isIntersecting
    entries.forEach(entry => {
    if (entry.isIntersecting && props.list?.length) {
      initOrUpdateChart()
      observer.unobserve(entry.target)
    }
  })
})

watch(()=>props.list,()=>{
    if(isIntersecting.value && chartDom.value&&props.list?.length){
        initOrUpdateChart()
    }
})
onMounted(()=>{
    if(chartDom.value){
        observer.observe(chartDom.value)
    }
})

function initOrUpdateChart() {
        const interval = ({
        '1m':60,
        '5m':300,
        '15m':900,
        '1h':3600,
        '4h':3600,
        '24h':3600
        }[globalStore.rankCommon.activeInterval]) as number
        const oldXAxis = props.list.map(el=>el.t)
        const xAxisLength = oldXAxis.length
        const firstTime = oldXAxis[0]
        const needCount = 24 - xAxisLength
        const barData = props.list.map(el=>Number(el.vol))
        const lineData = props.list.map(el=>Number(el.c))
        const newXAxis = []
        for(let i=0;i<needCount;i++){
            newXAxis.unshift(firstTime-interval*i)
            barData.unshift(0)
            lineData.unshift(0)
        }
        const xAxis = [...newXAxis, ...oldXAxis]
        const maxLineData = Math.max(...lineData)
        const color = lineData[lineData.length -1] >= maxLineData
        ? getCssVariable('--up-color')
        : getCssVariable('--down-color')
        if(!chartInstance.value){
            if(chartDom.value){
                clearTimeout(timer)
                chartInstance.value = echarts.init(chartDom.value)
            } else {
                return retry()
            }
        }
        chartInstance.value.setOption({
            tooltip: false,
            grid:{
                left:0,
                right:0,
                top:0,
                bottom:0,
            },
            xAxis: [
                {
                    type: 'category',
                    show: false, // 不显示X轴
                    axisTick: {
                        show: false // 不显示刻度
                    },
                    axisLine: {
                        show: false // 不显示轴线
                    },
                    axisLabel: {
                        show: false // 不显示标签
                    },
                    data: xAxis
                }
            ],
            yAxis: [{
                type: 'value',
                name:'Evaporation',
                show: false, // 关键设置：不显示整个Y轴
                scale:true
            },{
                type: 'value',
                name:'Temperature',
                show: false, // 关键设置：不显示整个Y轴
                scale:true
            }],
            series: [
                {
                    name: 'Evaporation',
                    type: 'bar',
                    itemStyle:{
                        color:'#383F4B'
                    },
                    data:barData
                },
                {
                    name: 'Temperature',
                    type: 'line',
                    symbol: 'none', // 隐藏所有节点
                    itemStyle:{
                        color:getCssVariable('--up-color')
                    },
                    yAxisIndex:1,
                    data: lineData
                }
            ]
        })
        chartInstance.value.resize()
}

function retry() {
    if(retryCount.value<maxCount){
        retryCount.value++
        timer = window.setTimeout(()=>{
            if(chartDom.value){
                initOrUpdateChart()
            } else{
                retry()
            }
        },1000)
    }
}
</script>

<template>
    <div ref="chartDom" class="h-40px w-143px"/>
</template>

<style scoped lang="scss"></style>