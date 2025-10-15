<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount, markRaw, watch } from 'vue';
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
import { PieChart } from "echarts/charts";
// 引入标题，提示框，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent
} from 'echarts/components';
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent,
  PieChart
]);

const chart = ref<HTMLDivElement>()

const myChart = ref()
const props = defineProps(['data', 'title', 'chartHeight'])

const option = ref()
const survey = (e: any) => {
  const list = Array.isArray(e) ? e : []
  let total: number = 0;
  for (let i = 0; i < list.length; i++) {
    total += list[i].value || 0
  }
  option.value = {
    color: ['#285AED', '#FA5247', '#1CCBB6', '#F625AF', '#FFB435'],
    title: {
      text: total,
      subtext: props.title,
      left: 'center',
      top: '34%',
      textStyle: {
        fontSize: 32,
        color: '#686B73',
        align: 'center',
      },
      subtextStyle: {
        fontSize: 14,
        color: '#686B73',
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      show: false,
      bottom: 0,
      icon: 'circle',
    },
    series: [
      {
        type: 'pie',
        radius: ['60%', '76%'],
        avoidLabelOverlap: true,
        // 默认显示标签，放到扇区外侧并显示名称与百分比
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}: {d}%',
          color: '#333'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true,
          length: 12,
          length2: 6
        },
        data: list
      }
    ]
  }
}

// 初始化和 resize 处理
survey(props.data)
const resizeHandler = () => {
  if (myChart.value && typeof myChart.value.resize === 'function') myChart.value.resize()
}
onMounted(() => {
  survey(props.data)
  if (!myChart.value) myChart.value = markRaw(echarts.init(chart.value as HTMLDivElement))
  if (option.value) myChart.value.setOption(option.value)
  window.addEventListener('resize', resizeHandler)
})

watch(() => props.data, (newVal) => {
  survey(newVal)
  if (!myChart.value) myChart.value = markRaw(echarts.init(chart.value as HTMLDivElement))
  if (option.value) myChart.value.setOption(option.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
})
</script>

<template>
  <div :style="{ height: chartHeight }" ref="chart" class="chart"></div>
</template>

<style lang="less" scoped>
.chart {
  width: 100%;
}
</style>