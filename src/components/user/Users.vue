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
                <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
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
            <!-- switchChange(scope.row.id)但是这样写方法只能拿到id，不能同时拿状态，要改写 -->
            <!-- this.switchChange()不能加this 此时this指向的不是当前数据对象，而是el-switch元素对象 -->
                <!-- 第1种方式 -->
                <!-- <el-switch
                @change="(newState)=>{switchChange(newState,scope.row.id)}"
                slot-scope="scope">
                </el-switch> -->
                <!-- 第2种方式 -->
                <el-switch
                v-model="scope.row.mg_state"
                @change="switchChange2(scope.row.mg_state,scope.row.id)"
                slot-scope="scope">
                </el-switch>
            </el-table-column>
            <el-table-column
            width="200"
            label="操作">
            <!-- templete只是一个包裹的内容，不占具体位置 -->
            <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                    <el-button type="primary" class="el-icon-edit" @click="showEditDialog(scope)" size="mini"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                    <el-button type="danger" class="el-icon-delete"  @click="remove(scope)" size="mini"></el-button>
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
    <!-- 添加一个用户的对话框 -->
    <el-dialog
        title="添加用户"
        @closed="addDialogClosed"
        :visible.sync="addDialogVisible"
        width="50%">
        <!-- 这里是添加用户的表单 -->
        <el-form ref="addFormRef" :rules="addFormRules" :model="addForm" label-width="70px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
            </el-form-item>
             <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
            </el-form-item>
             <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
            </el-form-item>
             <el-form-item label="手机" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 编辑用户的对话框（我们让弹出的此对话框和天机用户对话共用一个） -->
     <el-dialog
        title="修改用户信息"
        :visible.sync="editDialogVisible"
        @closed="editDialogClosed"
        width="50%">
        <!-- 这里是添加用户的表单 -->
        <!-- 分析下：用户名不需要修改，在这里我们修改邮箱和手机号 -->
        <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="70px">
            <el-form-item label="用户名"  disabled prop="username">
                <el-input v-model="editForm.username"></el-input>
            </el-form-item>
             <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
            </el-form-item>
             <el-form-item label="手机" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
// 使用mixins拆分组件结构和行为
// 导入当前使用的mixins
import mixins from './Users-mixins.js'
export default {
  // 表示混合，把外界定义的相关的代码，混入到当前这个组件中
  mixins: [mixins]
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
.el-pagination {
  margin-top: 15px;
}
</style>
