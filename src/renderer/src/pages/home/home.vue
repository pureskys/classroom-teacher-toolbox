<template>
  <div class="flex-1 bg-red-200">
    <!--    <China_Area></China_Area>-->
  </div>
</template>

<script setup>
// 渲染进程代码
import axios from 'axios'
import { ref } from 'vue'
import China_Area from '@renderer/components/china-area-cascader.vue'

const hitokoto = ref()

axios
  .get('https://v1.hitokoto.cn')
  .then((response) => {
    console.log(response.data.hitokoto)
    hitokoto.value = response.data.hitokoto
  })
  .catch((error) => {
    console.error(error)
  })
</script>

<style lang="scss" scoped>
.home-container {
  flex-direction: column;
  display: flex;
  flex: 1;
  background-color: #3fc1c9;
  padding: 10px;
}
</style>
