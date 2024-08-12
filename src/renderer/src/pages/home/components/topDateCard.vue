<template>
  <div
    class="m-2 flex h-32 w-1/6 min-w-fit flex-row rounded-xl border border-gray-200 bg-white p-2"
  >
    <!--        总人数左边布局开始-->
    <div class="ml-2.5 flex flex-col items-center justify-around">
      <div class="text-sm font-semibold text-slate-500 lg:text-base">
        {{ card_name }}
        <!--        分割线-->
        <div class="ml-0 h-1 w-10 rounded-xl bg-green-300"></div>
      </div>
      <!--      数字显示组件开始-->
      <div class="flex flex-1 items-center justify-center">
        <el-text style="font-weight: bold; font-size: 2.8rem">{{ data_count }}</el-text>
      </div>
      <!--      数字显示组件结束-->
    </div>
    <!--    总人数左边布局结束-->
    <!--    右边图表开始-->
    <div class="hidden flex-1 items-center justify-center lg:flex">
      <div ref="myChart" class="h-full w-full"></div>
    </div>
    <!--    右边图表结束-->
  </div>
</template>
<script setup>
import * as echarts from 'echarts'
import { nextTick, onMounted, ref, watch } from 'vue'

const chart_data = defineModel('chart_data', { required: true, type: Object }) // 必须传入组件的数据
const data_count = defineModel('count', { type: Number, required: true }) //数据展示
const card_name = defineModel('card_name', { required: true, type: String })
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
