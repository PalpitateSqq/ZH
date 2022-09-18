<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avater_box">
        <img src="../assets/images/logo.png" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        label-width="0px"
        :model="loginForm"
        class="login_form"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button
            type="primary"
            @click="login"
          >登录</el-button>
          <el-button
            type="info"
            @click="resetLoginFrom"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单的验证规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        // async await 简化 Promise操作
        const { data: result } = await this.$http.post('login', this.loginForm)
        if (result.meta.status !== 200) return this.$message.error('登录失败！')
        this.$message.success('登录成功！')
        // 将 token 保存在 sessionStorage中
        window.sessionStorage.setItem('token', result.data.token)
        this.$router.push('/home')
      })
    },
    // 点击重置按钮，重置登录表单
    resetLoginFrom() {
      // resetFields  对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 10px;
    .avater_box {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 130px;
      width: 130px;
      border-radius: 50%;
      border: 1px solid burlywood;
      background-color: burlywood;
      padding: 2px;
      box-shadow: 0 0 10px #ddd;
      img {
        border-radius: 50%;
        height: 100%;
        width: 100%;
        background-color: #fff;
      }
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  el-form-item {
    padding: 0 10px;
  }
  .btns {
    display: flex;
    justify-content: center;
  }
}
</style>
