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
            <el-text style="font-size: 1.5em; font-weight: bold; letter-spacing: 4px" type="primary"
              >CTT
            </el-text>
          </div>
          <!--      菜单-->
          <el-menu
            v-for="item in menu_list"
            :key="item.index"
            :default-active="activeIndex"
            mode="vertical"
            router
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
            <div>
              <transition name="el-fade-in-linear">
                <div
                  v-if="weather_data"
                  class="aside-bottom-weather"
                  @click="is_show_dialog_weather = true"
                >
                  <div>
                    <i
                      :class="'qi-' + weather_data.now.icon"
                      style="font-size: 26px; color: white"
                    ></i>
                  </div>
                  <div>
                    <el-text size="large" style="color: white"
                      >{{ weather_data.now.temp }}℃
                    </el-text>
                    <span style="display: inline-block; width: 12px"></span>
                    <el-text size="large" style="color: white">{{ weather_data.now.text }}</el-text>
                  </div>
                </div>
              </transition>
              <transition name="el-fade-in-linear">
                <div
                  v-if="!weather_data"
                  class="aside-bottom-weather"
                  @click="is_show_dialog_weather = true"
                >
                  <div>
                    <el-text size="large" style="color: white">获取失败</el-text>
                  </div>
                </div>
              </transition>
            </div>
            <!--        时间展板-->
            <transition name="el-fade-in-linear">
              <div v-if="date_list" class="aside-bottom-time">
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
            </transition>
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
  <!--  地区选择弹出组件-->

  <el-dialog v-model="is_show_dialog_weather" center width="30%" @close="weatherDialogClose">
    <span>请选择地区:</span>
    <China_Area
      v-model:is_dialog="is_show_dialog_weather"
      localstorage_name="weather_area"
    ></China_Area>
  </el-dialog>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import icon_cut from '@renderer/assets/icons/cut.jpg'
import axios from 'axios'
import China_Area from '@renderer/components/china-area-cascader.vue'

// 菜单选项list
const menu_list = [
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
const date_list = ref(null) // 日期数据变量
const weather_url = 'https://devapi.qweather.com/v7/weather/now' //天气请求的url
const weather_location = ref('101251206') // 获取天气的地址
const weather_key = '903c529f31b8404c9b6c54b96253be43' // 天气请求key
let weather_data = ref(null) // 天气数据
let timer = null // 定时器对象
const is_show_dialog_weather = ref(false) // 天气dialog控制变量
let weather_location_name //地区名字

// 页面初始化完成之后函数区域
onMounted(async () => {
  // 设置时钟定时器
  timer = setInterval(() => {
    getDate()
  }, 1000)
  // 获取天气LocationId
  weather_location.value = await getWeatherLocationId()
  // 请求天气
  weather_data.value = await getWeather(weather_url, weather_location, weather_key)
})

// 页面销毁前执行的函数
onBeforeUnmount(() => {
  // 销毁定时器
  clearTimeout(timer)
  timer = null
})

// 天气dialog关闭回调函数
const weatherDialogClose = async () => {
  try {
    const weather_location_name_list = JSON.parse(localStorage.getItem('weather_area'))
    const weather_location_name_0 =
      weather_location_name_list[weather_location_name_list.length - 1]
    if (weather_location_name === weather_location_name_0) {
      console.log('地区位置不变，不请求天气api')
    } else {
      // 获取天气LocationId
      weather_location.value = await getWeatherLocationId()
      // 请求天气
      weather_data.value = await getWeather(weather_url, weather_location, weather_key)
    }
  } catch (e) {
    console.log(e)
  }
}

// 获取地区location_id
function getWeatherLocationId() {
  return new Promise((resolve) => {
    try {
      const weather_location_name_list = JSON.parse(localStorage.getItem('weather_area'))
      weather_location_name = weather_location_name_list[weather_location_name_list.length - 1]
      const params = {
        location: weather_location_name,
        key: weather_key
      }
      try {
        axios
          .get('https://geoapi.qweather.com/v2/city/lookup', { params })
          .then((res) => {
            console.log('获取天气地区id成功：', res.data.location[0].id)
            resolve(res.data.location[0].id)
          })
          .catch((err) => {
            console.log('获取天气地区id失败（地区id网络请求失败0）', err)
            resolve('1010100')
          })
      } catch (err) {
        console.log('获取天气地区id失败（地区id网络请求失败1）', err)
        resolve('1010100')
      }
    } catch (e) {
      console.log('获取天气地址失败,天气组件不加载')
      resolve('1010100')
    }
  })
}

// 请求天气接口
function getWeather(url, location, key) {
  return new Promise((resolve) => {
    const params = {
      location: location.value,
      key: key
    }
    axios
      .get(url, { params })
      .then((response) => {
        console.log('返回的天气数据', response.data)
        try {
          const code = response.data.code
          if (code === '200') {
            resolve(response.data)
          } else {
            localStorage.removeItem('weather_area')
            resolve(false)
          }
        } catch (err) {
          localStorage.removeItem('weather_area')
          resolve(false)
        }
      })
      .catch((err) => {
        console.log(err)
        localStorage.removeItem('weather_area')
        resolve(false)
      })
  })
}

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
  if (hour >= 0 && hour < 3) {
    date12 = '拂晓'
  } else if (hour >= 3 && hour < 6) {
    date12 = '黎明'
  } else if (hour >= 6 && hour < 9) {
    date12 = '清晨'
  } else if (hour >= 9 && hour < 12) {
    date12 = '上午'
  } else if (hour >= 12 && hour < 15) {
    date12 = '中午'
  } else if (hour >= 15 && hour < 18) {
    date12 = '下午'
  } else if (hour >= 18 && hour < 21) {
    date12 = '傍晚'
  } else {
    //考虑小时数大于等于21且小于等于23的情况
    date12 = '深夜'
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
    display: flex;
  }
}
</style>
