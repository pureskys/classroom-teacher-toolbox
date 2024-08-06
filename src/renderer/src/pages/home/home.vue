<template>
  <div class="flex flex-1 flex-col bg-red-200 p-1">
    <div class="flex flex-1 bg-green-200">
      <div class="flex w-5/6 bg-amber-200"></div>
      <div class="flex w-1/6 bg-green-100"></div>
    </div>
    <div class="flex flex-1 bg-red-300"></div>
  </div>
</template>

<script setup>
// 渲染进程代码
import axios from 'axios'
import { ref } from 'vue'

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
