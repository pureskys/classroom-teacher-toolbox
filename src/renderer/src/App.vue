<template>
  <!--  最外边容器-->
  <div class="container">
    <!--    左边容器-->
    <div class="aside">
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
        <el-text>天气：多云</el-text>
        <br />
        <el-text>日期：2024-07-29</el-text>
        <br />
        <el-text>时间：12:53</el-text>
        <br />
        <div style="background-color: #38b2ff; width: 100%; height: 1px; margin-top: 30px"></div>
        <div style="text-align: center; color: #515c67">
          <h6>成为班主任：{{ class_teacher_day }}天</h6>
        </div>
      </div>
    </div>
    <!--    右边容器-->
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import icon_cut from '@renderer/assets/icons/cut.jpg'

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
// 设置默认路由页面
const activeIndex = ref('/')
const class_teacher_day = 0
const handleSelect = (key, keyPath) => {
  activeIndex.value = key
  console.log(key, keyPath)
}
</script>

<style lang="scss" scoped>
/*菜单焦点样式*/
.el-menu-item:hover {
  background-color: #e4f0fd !important;
  color: #38b2ff !important;
}

/*菜单选中样式开始*/
.el-menu-item.is-active {
  border-left: #33a2ef solid 6px !important;
  background-color: #e2eff9 !important;
  color: #38b2ff !important;
  font-weight: bolder;
}

.aside-button.is-active h4 {
  font-weight: bolder;
}

/*菜单选中样式结束*/

/*最外边容器的样式*/
.container {
  width: 100vw;
  height: 100vh;
  background-color: #f2f2f2;
  display: flex;
  color: black;
  /*左边容器的样式*/
  .aside {
    flex: 1.9;
    min-width: 140px;
    max-width: 150px;
    position: relative;
    padding: 5px;
    display: flex;
    flex-direction: column;
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
      position: absolute;
      text-align: start;
      width: 100%;
      bottom: 0;

      .el-text {
        margin-left: 8px;
      }
    }

    /*菜单按按钮样式*/
    .aside-button {
      box-sizing: border-box;
      margin-top: 1em;
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
