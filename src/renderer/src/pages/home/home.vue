<template>
  <div class="home-container">
    <el-scrollbar style="display: flex; align-items: center; justify-content: center">
      <div>
        {{ hitokoto }}
      </div>
    </el-scrollbar>
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
  width: 100%;
  height: 100%;
  background-color: #3fc1c9;
}
</style>
