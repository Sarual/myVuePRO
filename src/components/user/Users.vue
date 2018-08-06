<template>
  <div class="hello">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
        <!-- 用户列表（layout布局（整体）） -->
        <el-row class="el-userList-top" :gutter="20">
            <el-col :span="7">
                <!-- 通过v-model双向绑定的数据query（筛选），同时当我们点击搜索框时，列表刷新 -->
                <el-input placeholder="请输入内容" v-model="queryInfo.query">
                    <el-button slot="append" icon="el-icon-search" @click="getUsersList()"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary">添加用户</el-button>
            </el-col>
        </el-row>
        <!-- 表格区域(动态渲染表格数据) -->
        <el-table
        border=""
        highlight-current-row
        style="width: 100%"
        :data="usersList">
            <el-table-column
            type="index">
            </el-table-column>
            <el-table-column
            prop="username"
            label="姓名"
            width="120">
            </el-table-column>
            <el-table-column
            prop="email"
            label="邮箱"
            width="120">
            </el-table-column>
            <el-table-column
            prop="mobile"
            label="电话">
            </el-table-column>
            <el-table-column
            property="role_name"
            label="角色">
            </el-table-column>
            <el-table-column
            label="状态">
            <!-- 让状态动态绑定到这一行数据中的mg_state上 -->
                <el-switch
                v-model="scope.row.mg_state"
                slot-scope="scope">
                </el-switch>
            </el-table-column>
            <el-table-column
            width="200"
            label="操作">
            <!-- templete只是一个包裹的内容，不占具体位置 -->
            <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                    <el-button type="primary" class="el-icon-edit" size="mini"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                    <el-button type="danger" class="el-icon-delete" size="mini"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start">
                    <el-button type="warning" class="el-icon-setting" size="mini" :enterable="false"></el-button>
                </el-tooltip>
            </template>
            </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <el-pagination
            class="el-pagination>"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 10, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询用户列表时候，要携带的查询参数
      queryInfo: {
        query: '', // 用户输入的搜索条件(查询参数)
        pagenum: 1, // 当前请求的是第几页数据
        pagesize: 2 // 每页显示多少条数据
      },
      total: 0, // 总页数
      // 用户列表
      usersList: []
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    // 获取用户列表列表
    async getUsersList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('请求数据失败')
      this.usersList = res.data.users
      this.total = res.data.total
      console.log(res.data)
    },
    // 监听 pagesize 的变化
    handleSizeChange(getNewSize) {
      // 把最新的 pagesize 赋值给 this.queryInfo
      this.queryInfo.pagesize = getNewSize
      this.getUsersList()
    },
    // 监听 页码值 的变化
    handleCurrentChange(getNewPageNum) {
      this.queryInfo.pagenum = getNewPageNum
      this.getUsersList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
.el-userList-top {
  margin-bottom: 20px;
}
.el-pagination{
    margin-top: 15px;
}
</style>
