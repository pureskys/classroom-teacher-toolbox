<template>
  <div class="flex flex-1 flex-col">
    <div class="flex h-2/6">
      <!--      学生总人数卡片布局-->
      <TopDataCard
        card_name="学生数"
        :chart_data="all_students_chart_data"
        :count="students_count"
      ></TopDataCard>
      <!--      教师总人数卡片-->
      <TopDataCard
        card_name="教师数"
        :chart_data="all_teachers_chart_data"
        :count="teachers_count"
      ></TopDataCard>
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
import { nextTick, onMounted, ref } from 'vue'
import { genFileId } from 'element-plus'
import TopDataCard from '@renderer/pages/home/components/topDateCard.vue'

const path = require('path')
const os = require('os')
const fs = require('fs')
const nedb = require('nedb')
const Xlsx = require('xlsx') // 导入xlsx工具

const is_show_dialog_upload = ref(true) // 弹窗状态控制
const is_upload_button = ref(true) //禁用上传按钮状态
const upload = ref() //文件暂存地址
const file_path = ref() //文件路径
const jsonData1 = ref() //获取的学生数据
const jsonData2 = ref() //获取的教师数据
const db_students = ref() //学生数据库
const db_teachers = ref() //教师数据库
const students_count = ref(0) //学生总人数
const teachers_count = ref(0) //教师总人数
const db_path = path.join(os.homedir(), 'Documents/CttDb/') //获取数据库路径
// 学生总人数饼状图数据
const all_students_chart_data = ref({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    left: '10%',
    top: '0%'
  },
  series: [
    {
      name: '学生数：',
      type: 'pie',
      radius: ['40%', '85%'],
      top: '25%',
      label: {
        show: false,
        position: 'center'
      },
      data: [
        { value: 0, name: '女生', itemStyle: { color: '#FFC0CB' } },
        { value: 0, name: '男生', itemStyle: { color: '#ADD8E6' } }
      ]
    }
  ]
})
//教师总人数饼状图数据
const all_teachers_chart_data = ref({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    show: false
  },
  series: [
    {
      name: '教师数：',
      type: 'pie',
      radius: ['40%', '90%'],
      label: {
        show: false,
        position: 'center'
      },
      data: []
    }
  ]
})
// 页面初始化函数
onMounted(async () => {
  await connectToTheDb() //连接数据库
  await nextTick() //等待UI渲染
  await setStudentsCount() // 设置学生数据
  await setTeachersCount() // 设置教师数据
})

// 设置教师展示卡片数据
const setTeachersCount = async () => {
  let data_list = [] //初始化教师图表数据
  let subject_list = []
  // 获取教师总人数
  teachers_count.value = await findDbData(db_teachers.value, 'count', {})
  // 设置图表数据
  let subject_data = await findDbData(db_teachers.value, 'find', { 学科: { $exists: true } })
  await Promise.all(
    subject_data.map((item) => {
      return new Promise((resolve) => {
        subject_list.push(item.学科)
        resolve()
      })
    })
  )
  const unique_subjects_list = new Set(subject_list) // 使用 Set 来获取唯一的学科值
  const unique_subjects_list_array = Array.from(unique_subjects_list) // 将Set对象转换为数组
  await Promise.all(
    unique_subjects_list_array.map(async (item) => {
      let value1 = await findDbData(db_teachers.value, 'count', { 学科: item })
      return new Promise((resolve) => {
        let subject_data = {
          value: value1,
          name: item
        }
        data_list.push(subject_data)
        resolve()
      })
    })
  )
  all_teachers_chart_data.value.series[0].data = data_list
}
// 设置学生展示卡片数据
const setStudentsCount = async () => {
  // 获取学生总人数
  students_count.value = await findDbData(db_students.value, 'count', {})
  // 获取数据库男女人数
  all_students_chart_data.value.series[0].data[1].value = await findDbData(
    db_students.value,
    'count',
    { 性别: '男' }
  )
  all_students_chart_data.value.series[0].data[0].value = await findDbData(
    db_students.value,
    'count',
    { 性别: '女' }
  )
}
//连接数据库
const connectToTheDb = async () => {
  // 数据库路径
  const path_students_db = path.join(db_path, 'students.db')
  const path_teachers_db = path.join(db_path, 'teachers.db')
  // 连接数据库
  db_students.value = new nedb({ filename: path_students_db, autoload: true })
  db_teachers.value = new nedb({ filename: path_teachers_db, autoload: true })
}
// 查找数据
const findDbData = async (db, key, params) => {
  console.log('查询的语句：', params)
  return new Promise((resolve, reject) => {
    try {
      if (key === 'find') {
        db.find(params, (err, docs) => {
          if (err) {
            reject(err)
            console.error(err)
          } else {
            console.log(docs)
            resolve(docs)
          }
        })
      } else if (key === 'count') {
        // 获取数据库中的文档数量
        db.count(params, (err, count) => {
          if (err) {
            console.error(err)
            reject(err)
          } else {
            console.log(`数据库中的文档数量为: ${count}`)
            resolve(count)
          }
        })
      }
    } catch (e) {
      reject(e)
      console.log('查找数据库数据失败：', e)
    }
  })
}
// 删除数据库文件
const removeDb = async (dbname) => {
  let path1 = path.join(db_path, `${dbname}.db`)
  try {
    fs.unlink(path1, function (err) {
      if (err) {
        console.error(err)
      } else {
        console.log('数据库文件已成功删除。')
      }
    })
  } catch (e) {
    console.log('删除数据库失败', e)
  }
}
// 导入数据库数据操作
const creatDb = async (db, data) => {
  try {
    // 导入新的数据文档
    await Promise.all(
      data.value.map((item) => {
        return new Promise((resolve, reject) => {
          db.insert(item, (err) => {
            if (err) {
              console.error(err)
              reject()
            } else {
              console.log('数据已成功导入到数据库中。')
              resolve()
            }
          })
        })
      })
    )
  } catch (e) {
    console.log('连接数据库失败：', e)
  }
}

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
const submitUpload = async () => {
  try {
    console.log('点击上传时的路径：', file_path.value)
    const workbook = Xlsx.readFile(file_path.value)
    const worksheet1 = workbook.Sheets[workbook.SheetNames[0]]
    const worksheet2 = workbook.Sheets[workbook.SheetNames[1]]
    jsonData1.value = Xlsx.utils.sheet_to_json(worksheet1)
    jsonData2.value = Xlsx.utils.sheet_to_json(worksheet2)
    upload.value.clearFiles()
    is_show_dialog_upload.value = false
    console.log('获取的excel学生数据：', jsonData1.value)
    console.log('获取的excel教师数据：', jsonData2.value)
    // 删除数据库文件
    await removeDb('students')
    await removeDb('teachers')
    // 导入数据库数据
    await creatDb(db_students.value, jsonData1)
    await creatDb(db_teachers.value, jsonData2)
    // 设置男女数量
    await setStudentsCount()
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
