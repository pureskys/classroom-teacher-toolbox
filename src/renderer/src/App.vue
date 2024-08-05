<template>
  <!--  最外边容器-->
  <div class="my-container">
    <!--    左边容器-->
    <div class="aside">
      <el-scrollbar style="flex: 1">
        <div
          style="
            margin: 5px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 98.5vh;
          "
        >
          <!--      标题展示块-->
          <div class="aside-header">
            <el-avatar :src="icon_cut" fit="cover" shape="square" size="large"></el-avatar>
            <el-text type="primary" style="font-size: 1.5em; font-weight: bold; letter-spacing: 4px"
              >CTT
            </el-text>
          </div>
          <!--      菜单-->
          <el-menu
            v-for="item in menu_list"
            :key="item.index"
            :default-active="activeIndex"
            router
            mode="vertical"
            style="width: 100%; border-right: 0"
            @select="handleSelect"
          >
            <!--        菜单按钮-->
            <el-menu-item :index="item.index" class="aside-button">
              <el-icon>
                <Component :is="item.icon"></Component>
              </el-icon>
              <h4 style="letter-spacing: 1px">{{ item.name }}</h4>
            </el-menu-item>
          </el-menu>
          <!--      aside的底部布局-->
          <div class="aside-bottom">
            <!--        天气组件-->
            <div class="aside-bottom-weather">
              <div><i class="qi-100" style="font-size: 25px; color: white"></i></div>
              <div>
                <el-text size="large" style="color: white">30℃</el-text>
                <span style="display: inline-block; width: 12px"></span>
                <el-text size="large" style="color: white">晴天</el-text>
              </div>
            </div>
            <!--        时间展板-->
            <div class="aside-bottom-time">
              <el-text size="large" style="font-weight: bold; color: white"
                >{{ date_list.year }}年{{ date_list.month }}月
              </el-text>
              <br />
              <el-text size="large" style="font-size: 3em; font-weight: bolder; color: white"
                >{{ date_list.day }}
              </el-text>
              <br />
              <el-text size="large" style="font-weight: bold; color: white">
                <el-text size="large" style="font-weight: bold; color: white">
                  {{ date_list.date12 }}
                </el-text>
                {{ date_list.hour + ':' + date_list.minute + ':' + date_list.second }}
              </el-text>
            </div>
            <!--        班主任日期显示-->
            <div style="margin-bottom: 5px">
              <el-tag type="success">已成为班主任：{{ class_teacher_day }} 天</el-tag>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <!--    右边容器-->
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import icon_cut from '@renderer/assets/icons/cut.jpg'
// 菜单选项list
let menu_list = [
  {
    index: '/',
    name: '主页',
    icon: 'DataAnalysis'
  },
  {
    index: '/about',
    name: '班级日志',
    icon: 'Notebook'
  },
  {
    index: '3',
    name: '待办事项',
    icon: 'Files'
  },
  {
    index: '4',
    name: '成长档案',
    icon: 'Document'
  },
  {
    index: '5',
    name: '班级活动',
    icon: 'Coordinate'
  },
  {
    index: '6',
    name: '学生奖惩',
    icon: 'Lollipop'
  },
  {
    index: '7',
    name: '设置',
    icon: 'Setting'
  }
]

const activeIndex = ref('/') // 设置默认路由页面
const class_teacher_day = 0 // 班主任天数变量
const date_list = ref({}) // 日期变量
let timer = null // 定时器对象
// 页面初始化完成之后函数区域
onMounted(() => {
  timer = setInterval(() => {
    getDate()
  }, 1000)
})
// 页面销毁前执行的函数
onBeforeUnmount(() => {
  clearTimeout(timer)
  timer = null
})
// 菜单切换函数
const handleSelect = (key, keyPath) => {
  activeIndex.value = key
  console.log(key, keyPath)
}

// 实时获取时间并渲染
function getDate() {
  const date = new Date() // 创建时间实例
  let hour = date.getHours() //获取小时
  let date12 //12小时制上下午变量
  if (hour < 11) {
    date12 = '上午'
  } else if (hour > 13) {
    date12 = '下午'
  } else {
    date12 = '中午'
  }
  if (hour >= 12) {
    hour = hour - 12
  }
  date_list.value = {
    date12: date12,
    year: date.getFullYear(),
    month: (date.getMonth() + 1).toString().padStart(2, '0'),
    day: date.getDate().toString().padStart(2, '0'),
    hour: hour.toString().padStart(2, '0'),
    minute: date.getMinutes().toString().padStart(2, '0'),
    second: new Date().getSeconds().toString().padStart(2, '0')
  }
}
</script>

<style lang="scss" scoped>
/*菜单焦点样式*/
.el-menu-item:hover {
  background-color: #a8d8ea !important;
  color: white !important;
}

/*菜单选中样式开始*/
.el-menu-item.is-active {
  transition: border-left-width 0.2s;
  border-left: #267b7e solid 6px !important;
  background-color: #3fc1c9 !important;
  color: white !important;
}

.aside-button.is-active h4 {
  font-weight: bolder;
}

/*菜单选中样式结束*/

/*最外边容器的样式*/
.my-container {
  background-color: #e2e1e4;
  display: flex;
  color: black;
  /*左边容器的样式*/
  .aside {
    flex: 2;
    min-width: 144px;
    max-width: 155px;
    display: flex;
    height: 100%;
    align-items: center;
    border-radius: 5px;
    background-color: white;
    /*aside的标题展示块*/
    .aside-header {
      width: 100%;
      display: flex;
      flex-direction: row;
      padding-left: 5px;
      padding-bottom: 30px;
      padding-top: 10px;
      justify-content: space-between;
    }

    /*aside的底部样式*/
    .aside-bottom {
      display: flex;
      flex: 0;
      justify-content: space-between;
      flex-direction: column;
      text-align: center;
      width: 100%;
      height: 100%;
      /*aside天气展板*/
      .aside-bottom-weather {
        display: flex;
        border-radius: 12px;
        flex-direction: row;
        padding: 6px;
        align-items: center;
        justify-content: space-around;
        background-color: #00b8a9;
        flex: 0;
        text-align: center;
        margin-top: 2px;
      }

      /*aside时间展板*/
      .aside-bottom-time {
        border-radius: 10px;
        background-color: #f38181;
        padding: 5px;
        margin: 5px 0 5px 0;
      }

      /* .el-text {
         margin-left: 8px;
       }*/
    }

    /*菜单按按钮样式*/
    .aside-button {
      box-sizing: border-box;
      margin-top: 8px;
      border-radius: 5px;
      background-color: #ffffff;
      /*border: 2px solid aquamarine;*/
      display: flex;
      flex-direction: row;
      justify-content: start;
      height: 40px;
    }
  }

  /*右边容器的样式*/
  .main {
    flex: 14;
  }
}
</style>
