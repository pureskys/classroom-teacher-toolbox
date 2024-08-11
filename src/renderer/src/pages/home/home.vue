<template>
  <div class="flex flex-1 flex-col">
    <div class="flex h-2/6">
      <!--      总人数卡片布局-->
      <TopDataCard v-model:chart_data="all_students_chart_data"></TopDataCard>
    </div>
    <div class="flex h-4/6 bg-red-400">asdas</div>
    <!--    上传文件dialog-->
    <el-dialog v-model="is_show_dialog_upload" :close-on-click-modal="false" center>
      <div class="flex flex-row items-stretch justify-center">
        <el-upload
          ref="upload"
          drag
          accept=".xls, .xlsx"
          :auto-upload="false"
          :limit="1"
          :on-change="handleChange"
          :on-exceed="handleExceed"
        >
          <el-icon class="el-icon--upload">
            <upload-filled />
          </el-icon>
          <div class="el-upload__text">支持拖拽文件 / <em>点击上传文件</em></div>
          <template #tip>
            <div class="h-2"></div>
          </template>
        </el-upload>
        <div class="ml-6 flex flex-col items-center justify-between pb-12 pt-5">
          <div class="h-fit w-fit">
            <el-button size="large" type="success" @click="submitUpload"> 下载模板</el-button>
          </div>
          <div class="h-fit w-fit">
            <el-button
              :disabled="is_upload_button"
              size="large"
              type="success"
              @click="submitUpload"
            >
              上传文件
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { UploadFilled } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { genFileId } from 'element-plus'
import TopDataCard from '@renderer/pages/home/components/topDateCard.vue'

const Xlsx = require('xlsx') // 导入xlsx工具

const is_show_dialog_upload = ref(true) // 弹窗状态控制
const is_upload_button = ref(true) //禁用上传按钮状态
const upload = ref() //文件暂存地址
const file_path = ref() //文件路径
const jsonData = ref() //获取的excel——to——json
// 总人数饼状图数据
const all_students_chart_data = {
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: '总人数：',
      type: 'pie',
      radius: ['40%', '82%'],
      avoidLabelOverlap: true,
      label: {
        show: false,
        position: 'center'
      },
      data: [
        { value: 20, name: '女生', itemStyle: { color: '#FFC0CB' } },
        { value: 26, name: '男生', itemStyle: { color: '#ADD8E6' } }
      ]
    }
  ]
}

onMounted(async () => {})

// 文件状态改变时调用
const handleChange = (file) => {
  try {
    const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
    const whiteList = ['xls', 'xlsx']
    if (whiteList.indexOf(fileSuffix) === 1) {
      console.log('获取的文件后缀：', fileSuffix)
      file_path.value = file.raw.path
      console.log('预备的文件本地路径', file_path.value)
      is_upload_button.value = false
    } else {
      is_upload_button.value = true
      console.log('上传文件不是excel，禁用按钮')
    }
  } catch (e) {
    console.log('尝试获取文件后缀失败', e)
    is_upload_button.value = true
  }
}

// 文件超出限制时调用的函数
const handleExceed = (files) => {
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
}

// 点击上传文件执行的方法
const submitUpload = () => {
  try {
    console.log('点击上传时的路径：', file_path.value)
    const workbook = Xlsx.readFile(file_path.value)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    jsonData.value = Xlsx.utils.sheet_to_json(worksheet)
    upload.value.clearFiles()
    is_show_dialog_upload.value = false
    console.log('获取的excel数据', jsonData.value)
  } catch (e) {
    console.log('上传文件失败', e)
  }
}
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
