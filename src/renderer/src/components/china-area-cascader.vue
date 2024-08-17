<template>
  <div class="flex w-full items-center justify-center">
    <el-cascader
      v-model="area"
      :options="pcaTextArr"
      :show-all-levels="false"
      clearable
      filterable
      placeholder="选择地区"
      size="default"
      @change="handleChange"
    />
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { pcaTextArr } from 'element-china-area-data'

const area = ref() //初始化的地区地址

const is_dialog = defineModel('is_dialog', { type: Boolean })
const localstorage_name_0 = defineModel('localstorage_name', { type: String, required: true })
const localstorage_name = localstorage_name_0.value.toString()
console.log('localstorage_name:', localstorage_name)
// 页面初始化生命周期钩子
onMounted(() => {
  getArea()
})

// 初始化地区方法
function getArea() {
  try {
    const area_storage = localStorage.getItem(localstorage_name)
    area.value = JSON.parse(area_storage)
    console.log('获取持久化读取信息成功', area_storage, area.value)
  } catch (e) {
    console.log('地区缓存获取失败：', e)
    localStorage.removeItem(localstorage_name)
  }
}

// 更新地址并持久化地址方法
const handleChange = () => {
  try {
    localStorage.removeItem(localstorage_name)
    localStorage.setItem(localstorage_name, JSON.stringify(area.value))
    console.log('持久化保存的地址', area.value)
    is_dialog.value = false
  } catch (e) {
    localStorage.setItem(localstorage_name, area.value)
    console.log('持久化保存的地址', area.value)
  }
}
</script>

<style scoped></style>
