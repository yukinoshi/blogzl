<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { LineChart,PieChart } from "../echarts/index";
import { visit,survey } from '../../mock/data';
const visitDate = ref([])
const getVisit = (e:string) => {
  let data = visit.data
  if(e === 'week'){
    data = data.slice(23,30)
  }
  visitDate.value = data
}
onMounted(() => {
  getVisit(radio.value)
})
const radio = ref('week');
const data_radio = ref('week');
</script>

<template>
  <yk-space dir="vertical" size="xl" style="width: 50%;">
    <div class="card">
      <div class="card_title">
        <p class="card_title-name">
          访问量
        </p>
        <yk-radio-group @change="getVisit" v-model="radio" type="button" :solid="true">
          <yk-radio value="month">近一月</yk-radio>
          <yk-radio value="week">近一周</yk-radio>
        </yk-radio-group>
      </div>
      <LineChart :data="visitDate" chart-height="208px"></LineChart>
    </div>
    <div class="card">
      <div class="card_title">
        <p class="card_title-name">
          数据检测
        </p>
        <yk-radio-group v-model="data_radio" type="button" :solid="true">
          <yk-radio value="month">近一月</yk-radio>
          <yk-radio value="week">近一周</yk-radio>
        </yk-radio-group>
      </div>
      <!-- 饼图 -->
       <div class="Pie_chart">
         <PieChart :data="survey.data.device" title="设备总数" chart-height="208px"></PieChart>
         <PieChart :data="survey.data.website" title="访问总数" chart-height="208px"></PieChart>
       </div>

    </div>
  </yk-space>
</template>

<style lang="less" scoped>

.Pie_chart {
  display: flex;
  justify-content: space-between;
}
</style>