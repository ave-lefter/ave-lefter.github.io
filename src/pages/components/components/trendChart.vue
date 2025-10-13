<script setup lang="ts">
import * as echarts from 'echarts'

const chartDom = useTemplateRef('chartDom')
const chartInstance = shallowRef<echarts.ECharts>()
onMounted(() => {
    if (chartDom.value) {
        chartInstance.value = echarts.init(chartDom.value)
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
                    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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
                    data: [
                        2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
                    ]
                },
                {
                    name: 'Temperature',
                    type: 'line',
                    symbol: 'none', // 隐藏所有节点
                    itemStyle:{
                        color:'#37B270'
                    },
                    yAxisIndex:1,
                    data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                }
            ]
        })
    }
})
</script>

<template>
    <div ref="chartDom" class="h-40px w-143px"/>
</template>

<style scoped lang="scss"></style>