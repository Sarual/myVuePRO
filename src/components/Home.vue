<template>
    <el-container class="home-container">
        <el-header class="el-header">
             <div class="logo_title">
                <img src="../assets/heima_logo.png" alt="">
                <h2>电商后台管理系统</h2>
            </div>
            <el-button type="info" class="el-button" @click="logout">退出</el-button>
        </el-header>
        <el-container class="el-container">
            <el-aside class="el-aside" :width="iscollapse ? 'el-submenu_large' : 'el-submenu_small'">
                <!-- 左侧的menu菜单 -->
                <!-- 折叠展开menu的bar -->
                <div class="toggle" @click="iscollapse=!iscollapse">|||</div>
                <!-- 再为整个菜单开启路由跳转 -->
                <el-menu
                background-color="#6e6e6e"
                default-active="2"
                text-color="#fff"
                active-text-color="#409e6c"
                router
                unique-opened
                collapse-transition
                :collapse="iscollapse"
                :width="iscollapse ? '65px' : '200px'"
                class="el-menu-vertical-demo">
                <!-- 注意：此菜单的数据是动态获取的，而不是固定的，所以不能复制子菜单项然后加以修改 -->
                    <!-- 循环创建一级菜单 -->
                    <el-submenu :index="item.id+''" v-for="(item, index) in menu" :key="item.id" :width="iscollapse ? 'el-submenu_large' : 'el-submenu_small'">
                        <template slot="title">
                            <!-- 左侧的一级菜单小图标（数据是动态渲染的，但图标需要我们手动写，可定义一个数组） -->
                            <i :class="['iconfont',iconList[index]]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 循环创建一级菜单(:代表属性绑定(可以写表达式))之所以将index加：和'/'是为了使其变成路由的跳转 -->
                        <el-menu-item :index="'/'+subitem.path"  v-for="subitem in item.children" :key="subitem.id">
                            <i class="el-icon-menu"></i>
                            {{ subitem.authName }}
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧的主体区域(这个就是内容坑) -->
            <el-main class="el-main">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
  data() {
    return {
      menu: [],
      // 左侧菜单项对应的图标数组
      iconList: ['icon-users', 'icon-tijikongjian', 'icon-shangpin', 'icon-danju', 'icon-baobiao'],
      // 是否被展开，默认为false
      iscollapse: false
    }
  },
  created() {
    this.getmenus()
  },
  methods: {
    logout() {
      // 清空token
      window.sessionStorage.removeItem('token')
      //   强制跳转至登录页
      this.$router.push('/login')
    },
    // 获取左侧菜单列表
    async getmenus() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error('请求数据失败')
      // this.$message.success('请求数据成功')
      // 把获取到的菜单数据，保存到menu数组中。供页面使用
      this.menu = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #6e6e6e;
  display: flex;
  justify-content: space-between;
  padding: 0;
  align-items: center;
  .logo_title {
    display: flex;
    align-items: center;
    color: #fff;
    user-select: none;
    h2 {
      font-weight: 100;
      margin-left: 15px;
    }
  }
  .el-button {
    margin-right: 20px;
  }
}
.el-container {
  .el-aside {
    background-color: #5e5e5e;
  }
  .el-main {
    background-color: #fff;
  }
}
.iconfont {
  margin-right: 10px;
}
.toggle {
  color: #fff;
  line-height: 24px;
  font-size: 14px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-submenu_large{
  width: 200px;
}
.el-submenu_small{
  width: 65px;
}
</style>
