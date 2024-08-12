<template>
  <div
    class="m-2 flex h-1/2 w-1/6 min-w-fit flex-col rounded-xl border border-gray-200 bg-white p-2"
  >
    <!--        总人数上边布局-->
    <div class="flex justify-between">
      <span class="ml-2 text-sm font-semibold text-slate-500 lg:text-base">总人数</span>
      <!--          上边的右边布局-->
      <div class="flex flex-1 flex-row justify-around space-x-2">
        <div class="ml-2 flex flex-1 items-center justify-center space-x-2 rounded-3xl">
          <div class="h-3 w-3 rounded-3xl bg-blue-300"></div>
          <el-text>男</el-text>
        </div>
        <div class="flex flex-1 items-center justify-center space-x-2 rounded-3xl">
          <div class="h-3 w-3 rounded-3xl bg-pink-300"></div>
          <el-text>女</el-text>
        </div>
      </div>
    </div>
    <!--        分割线-->
    <div class="ml-2 h-1 w-10 rounded-xl bg-green-300"></div>
    <!--        总人数下边布局-->
    <div class="flex flex-1 pl-2.5">
      <div class="flex flex-1 items-center justify-center">
        <el-text style="font-weight: bold; font-size: 2.6rem">46</el-text>
        <div ref="myChart" class="h-full w-full"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import * as echarts from 'echarts'
import { nextTick, onMounted, ref, watch } from 'vue'

const chart_data = defineModel('chart_data', { required: true, type: Object }) // 必须传入组件的数据
const myChart = ref()
const myChart1 = ref()

onMounted(async () => {
  myChart1.value = echarts.init(myChart.value)
  await nextTick()
  drawEcharts(chart_data.value)
})
watch(
  chart_data,
  () => {
    console.log('监听到数据变化')
    drawEcharts(chart_data.value)
  },
  { deep: true }
)
const drawEcharts = (data) => {
  console.log('获取的图表数据：', data)
  myChart1.value.setOption(data)
  window.addEventListener('resize', () => {
    myChart1.value.resize()
  })
}
</script>
<style scoped lang="scss"></style>
