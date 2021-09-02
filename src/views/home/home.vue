<template>

<el-container class="hoem-container">

    <!-- 头部部分 -->
  <el-header>
    <div>
      <img src="../../assets/heima.png" alt="">
      <span>电商后台管理系统</span>
    </div>
    <el-button type='info' @click="logout">退出</el-button></el-header>
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px':'200px'">
      <div class="toggle-button" @click="toggleCollapse">|||</div>
      <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409eff"
      unique-opened
      :collapse = 'isCollapse'
      :collapse-transition = "false"
      router
      :default-active='activePath'>
      <el-submenu :index="item.id + ''" v-for = "item in menuList" :key='item.key'>
        <template slot="title">
          <i :class="iconsObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <el-menu-item
        :index="'/'+subItem.path+ ''"
        v-for='subItem in item.children'
        :key='subItem.id'
        @click="saveNavState('/'+subItem.path)">
          <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{subItem.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <!-- 主体部分 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>
<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menuList: [],
      // 侧边栏图标
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的连接地址
      activePath: ''
    }
  },
  methods: {
    // 登出功能
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 侧边栏的隐藏和展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    // 获取侧边栏的数据
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style lang='less' scoped>
.hoem-container {
  height: 100%
}
  .el-header {
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    background-color: #373D41;
    >div{
      display: flex;
      align-items: center;
      span {
        margin-left:15px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
  .iconfont {
    margin-right: 10px;
  }
  .toggle-button{
    background-color: #4a5064;
    text-align: center;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    letter-spacing: 0.2em;
    cursor:pointer;
  }
</style>
