export default {
  data() {
    // 在data()中，且return之前，自定义一些校验规则
    var checkUsername = (rule, value, callback) => {
      if (/[\u4e00-\u9fa5]/.test(value) === false) {
        return callback(new Error('用户名不正确'))
      }
      callback()
    }
    var checkPassword = (rule, value, callback) => {
      if (/^[a-z]\w{1,17}$/.test(value) === false) {
        return callback(new Error('用户密码不正确'))
      }
      callback()
    }
    var checkEmail = (rule, value, callback) => {
      if (/^[a-z]\w{1,17}$/.test(value) === false) {
        return callback(new Error('邮箱地址不正确'))
      }
      callback()
    }
    var checkMobile = (rule, value, callback) => {
      if (/^[a-z]\w{1,17}$/.test(value) === false) {
        return callback(new Error('电话填写不正确'))
      }
      callback()
    }
    return {
      // 查询用户列表时候，要携带的查询参数
      queryInfo: {
        query: '', // 用户输入的搜索条件(查询参数)
        pagenum: 1, // 当前请求的是第几页数据
        pagesize: 10 // 每页显示多少条数据
      },
      total: 0, // 总页数
      // 用户列表
      usersList: [],
      // 添加对话框的显示和隐藏
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          // { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
          { validator: checkUsername, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          // { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          { validator: checkPassword, trigger: 'blur' }
        ],
        email: [
          // { required: true, message: '请输入邮箱', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          // { required: true, message: '请输入电话', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 编辑对话框的显示与隐藏
      editDialogVisible: false,
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
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
    },
    // 函数作用：每当点击开关，就触发这个函数，把最新的状态保存到数据库
    // 看修改用户的接口
    // async switchChange(newState, id) {
    //   const { data: res } = await this.$http.put(`users/${id}/state/${newState}`)
    //   if (res.meta.status !== 200) return this.$message.error('修改数据失败')
    //   this.$message.error('修改数据成功')
    // },
    // 修改用户状态的第2种方式
    async switchChange2(newState, id) {
      const { data: res } = await this.$http.put(`users/${id}/state/${newState}`)
      if (res.meta.status !== 200) return this.$message.error('修改数据失败')
      this.$message.success('修改数据成功')
    },
    // 监听关闭对话框的按钮
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定按钮（添加用户）
    addUser() {
      // 调用JS方法，校验表单是否符合规范（符合：返回的valid就是true）
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        // 此时数据库里的数据已经天机成功，前台只需再重新刷新数据
        this.getUsersList()
        this.addDialogVisible = false
      })
    },
    // 关闭编辑对话框时候的处理函数
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    async showEditDialog(scope) {
      const { data: res } = await this.$http.get('users/' + scope.row.id)
      if (res.meta.status !== 200) return this.$message.error('编辑用户失败')
      this.editForm.id = res.data.id
      this.editForm.username = res.data.username
      this.editForm.email = res.data.email
      this.editForm.mobile = res.data.mobile
      // 显示编辑对话框
      this.editDialogVisible = true
    },
    editUser() {
      // 调用JS方法，校验表单是否符合规范（符合：返回的valid就是true）
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.editForm.id, this.editForm)
        if (res.meta.status !== 200) return this.$message.error('编辑用户失败')
        this.$message.success('编辑用户成功')
        console.log(res)
        this.getUsersList()
        this.editDialogVisible = false
      })
    },
    async remove(scope) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'success',
          message: '删除失败!'
        })
      }
      const { data: res } = await this.$http.delete('users/' + scope.row.id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败')
      this.$message({
        type: 'success',
        message: '删除用户成功!'
      })
      this.getUsersList()
    }
  }
}
