<template>
  <div class="login-container">
    <div class="logo">
        <!-- 圖片区域 -->
        <img src="../assets/logo.png" alt="">
    </div>
    <!-- 表单校验 -->
    <el-form :model="loginForm" :rules="loginFormRules" ref="ruleFormRef" label-width="0px" class="loginForm">
        <el-form-item prop="username" type="username">
            <el-input v-model="loginForm.username">
                <!-- slot 方式： -->
                    <i slot="prefix" class="iconfont icon-user .icon-3702mima"></i>
            </el-input>
        </el-form-item>
        <el-form-item prop="password" type="password">
            <el-input v-model="loginForm.password">
                <!-- slot 方式： -->
                    <i slot="prefix" class="iconfont icon-3702mima"></i>
            </el-input>
        </el-form-item>
        <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单要绑定的数据对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 登录表单要验证的规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置表单项
    resetForm() {
      this.$refs.ruleFormRef.resetFields()
    },
    // 点击按钮登录
    login() {
      this.$refs.ruleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // 把成功的令牌写入token，供后续使用
        window.sessionStorage.setItem('token', res.data.token)
        // 只用JS API实现登录跳转
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  width: 450px;
  height: 304px;
  background-color: #fff;
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 5px;
  .logo {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    padding: 8px;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px #eee;
    position: absolute;
    left: 50%;
    transform: translateX(-50%) translateY(-40px);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .loginForm {
    padding: 0 20px;
    margin-top: 120px;
    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
