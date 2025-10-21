<script setup lang="ts">
import * as echarts from 'echarts'
import type {  KlineDatum } from '~/api/market'

const retryCount = ref(0)
const maxCount = 3
let timer:number
const chartDom = useTemplateRef('chartDom')
const chartInstance = shallowRef<echarts.ECharts>()
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
        const xAxis = props.list.map(el=>el.t)
        const barData = props.list.map(el=>el.c)
        const lineData = props.list.map(el=>el.vol)
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
            },{
                type: 'value',
                name:'Temperature',
                show: false, // 关键设置：不显示整个Y轴
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
                        color:'#37B270'
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