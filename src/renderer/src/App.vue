<template>
  <!--  最外边容器-->
  <div class="container">
    <!--    左边容器-->
    <div class="aside">
      <!--      标题展示块-->
      <div class="aside-header">
        <el-image
          src="./src/assets/cut.jpg"
          fit="cover"
          style="height: 50px; width: 50px"
        ></el-image>
        <el-text>CTT</el-text>
      </div>
      <!--      菜单-->
      <el-menu
        v-for="item in menu_list"
        :key="item.index"
        :default-active="activeIndex"
        router
        mode="vertical"
        style="width: 100%"
        @select="handleSelect"
      >
        <!--        菜单按钮-->
        <el-menu-item :index="item.index" class="aside-button">
          <el-icon>
            <Component :is="item.icon"></Component>
          </el-icon>
          <h3>{{ item.name }}</h3>
        </el-menu-item>
      </el-menu>
      <el-text class="aside-bottom">成为班主任：{{ class_teacher_day }}天</el-text>
    </div>
    <!--    右边容器-->
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

let menu_list = [
  {
    index: '/',
    name: '主页',
    icon: 'Monitor'
  },
  {
    index: '/about',
    name: '日志',
    icon: 'Monitor'
  },
  {
    index: '3',
    name: '待办',
    icon: 'Monitor'
  },
  {
    index: '4',
    name: '成长档案',
    icon: 'Monitor'
  },
  {
    index: '5',
    name: '班级活动',
    icon: 'Monitor'
  },
  {
    index: '6',
    name: '奖惩',
    icon: 'Monitor'
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
/*最外边容器的样式*/
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  /*左边容器的样式*/
  .aside {
    flex: 2;
    position: relative;
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
      padding: 10px;
      justify-content: space-between;
    }

    /*aside的底部样式*/
    .aside-bottom {
      position: absolute;
      margin-bottom: 10px;
      bottom: 0;
    }

    /*菜单按按钮样式*/
    .aside-button {
      margin: 5px;
      border-radius: 5px;
      border: 2px solid aquamarine;
      display: flex;
      flex-direction: row;
      justify-content: start;
      height: 45px;
    }
  }

  /*右边容器的样式*/
  .main {
    flex: 14;
  }
}
</style>
