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
      usersList: [],
      // 添加对话框的显示和隐藏
      addDialogVisible: false,
      addForm: {
        username: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
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
      console.log(res.data)
      this.$message.success('修改数据成功')
    }
  }
}
