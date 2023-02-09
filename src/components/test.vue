<template>
  <div
    class="container"
    id="container"
  >
    <div class="form-container sign-up-container">

      <!-- 注册表单 -->
      <el-form>
        <h1>用户注册</h1>
        <div class="social-container">
          <a
            href="#"
            class="social"
          ><i class="el-icon-zoom-in"></i></a>
          <a
            href="#"
            class="social"
          ><i class="el-icon-zoom-out"></i></a>
          <a
            href="#"
            class="social"
          ><i class="el-icon-circle-plus-outline"></i></a>
          <a
            href="#"
            class="social"
          ><i class="el-icon-remove-outline"></i></a>
        </div>
        <span>您可以选择以上几种方式注册一个您的账户!</span>
        <input
          type="text"
          placeholder="用户名"
        >
        <input
          type="password"
          placeholder="密码"
        >
        <input
          type="email"
          placeholder="邮箱"
        >
        <button id="send_code">发送验证码</button>
        <input
          type="email"
          placeholder="验证码"
        >
        <button>注册</button>
      </el-form>
    </div>
    <div class="form-container sing-in-container">
      <!-- 登陆表单 -->
      <form action="#">
        <h1>用户登陆</h1>
        <div class="social-container">
          <a
            href="#"
            class="social"
          ><i class="el-icon-zoom-in"></i></a>
          <a
            href="#"
            class="social"
          ><i class="el-icon-zoom-out"></i></a>
          <a
            href="#"
            class="social"
          ><i class="el-icon-circle-plus-outline"></i></a>
          <a
            href="#"
            class="social"
          ><i class="el-icon-remove-outline"></i></a>
        </div>
        <span>您可以选择以上几种方式登陆您的账户!</span>
        <input
          type="text"
          placeholder="用户名"
          v-model="loginForm.username"
        >
        <input
          type="password"
          placeholder="密码"
          v-model="loginForm.password"
        >
        <a href="#">忘记密码?</a>
        <button @click="login">登陆</button>
      </form>
    </div>
    <!-- 侧边栏内容 -->
    <div class="overlay-container">
      <div class="overlay">
        <div class="overlay-pannel overlay-left">
          <h1>已有账号?</h1>
          <p>亲爱的快快点我去进行登陆吧。</p>
          <button
            class="ghost"
            id="signIn"
            @click="signInButton"
          >登陆</button>

        </div>
        <div class="overlay-pannel overlay-right">
          <h1>没有帐号？</h1>
          <p>点击注册去注册一个属于你的账号吧。</p>
          <button
            class="ghost"
            id="signUp"
            @click="signUpButton"
          >注册</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    signInButton() {
      const container = document.querySelector('#container')
      container.classList.remove('right-panel-active')
    },
    signUpButton() {
      const container = document.querySelector('#container')
      container.classList.add('right-panel-active')
    },
    // 点击登陆按钮点击事件
    async login() {
      const { data: res } = await this.$http.post('login', this.loginForm)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      console.log(res)

      // 将 token 保存在 sessionStorage中
      // window.sessionStorage.setItem('token', result.data.token)
      // this.$router.push('/home')
    }
  }
}
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  /*标准盒子 */
  box-sizing: border-box;
}
body,
html {
  font-family: Arial, Helvetica, sans-serif;
  background: #f8f8f8;
  /* 锁定背景： */
  background-attachment: fixed;
  /* 弹性布局 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: 0 auto;
}
h1 {
  margin: 0.2rem;
  font-size: 1.2rem;
}

p {
  font-size: 1rem;
  line-height: 1.5rem;
  /* 字体变淡 */
  font-weight: 100;
  margin: 1.2rem 0;
  /* 字间距 */
  letter-spacing: 0.1rem;
}
span {
  font-size: 0.8rem;
  margin: 1.2rem 0;
}
a {
  color: #333;
  font-size: 1rem;
  /* 下划线消失 */
  text-decoration: none;
}

.container {
  /* 相对定位 */
  position: relative;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  padding: 0.6rem;
  width: 50rem;
  height: 35rem;
  /* 溢出隐藏 */
  overflow: hidden;
  max-width: 100vw;
  min-height: 70vh;
}
.form-container form {
  background: #fff;
  /* 弹性布局 */
  display: flex;
  flex-direction: column;
  padding: 0 1.8rem;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.social-container {
  margin: 0.6rem 0;
}

.social-container a {
  border: 1px solid #eee;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 1.8rem;
  width: 1.8rem;
}

.social-container a:hover {
  opacity: 0.8;
}

.form-container input {
  width: 100%;
  height: 2.2rem;
  text-indent: 1rem;
  border: 1px solid #ccc;
  /* 把input上左右边框取消 */
  border-left: none;
  border-right: none;
  border-top: none;
  /* 点击input边框消失 */
  outline: none;
  margin: 0.6rem 0;
}

/* 被选中时候缩小 */
.form-container button:active {
  transform: scale(0.95, 0.95);
}

.form-container button {
  padding: 0.4rem 1rem;
  background: #417dff;
  color: white;
  border: 1px solid #fff;
  outline: none;
  /* 鼠标放上变小手 */
  cursor: pointer;
  width: 5rem;
  border-radius: 8px;
  transition: all 100ms ease-in;
  margin: 0.6rem 0;
  font-size: 0.6rem;
  padding: 0.5rem 0;
}

button#send_code {
  width: 100%;
}

button.ghost {
  background: transparent;
  border-color: #fff;
  border: 1px solid #fff;
  outline: none;
  cursor: pointer;
  width: 5rem;
  border-radius: 8px;
  transition: all 800ms ease-in;
  margin: 0.6rem 0;
  padding: 0.5rem 0;
  color: white;
  font-size: 0.6rem;
}
button.ghost:active {
  transform: scale(0.95, 0.95);
}

.form-container {
  /* 绝对定位 */
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.5s ease-in;
}

.sing-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}
.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.overlay {
  background: #417dff;
  width: 200%;
  height: 100%;
  position: relative;
  left: -100%;
  transition: all 0.6s ease-in-out;
  color: white;
}

.overlay-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: all 0.6s ease-in-out;
  z-index: 99;
}

.overlay-pannel {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  padding: 0 2.2rem;
}

.overlay-right {
  right: 0;
}

.container.right-panel-active .overlay-container {
  transform: translateX(-100%);
}
.container.right-panel-active .sing-in-container {
  transform: translateX(100%);
}
.container.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  transition: all 0.6s ease-in-out;
}

.container.right-panel-active .overlay {
  transform: translateX(50%);
}
.container.right-panel-active .overlay-left {
  transform: translateX(0);
  transition: all 0.6s ease-in-out;
}
.container.right-panel-active .overlay-right {
  transform: translateX(20%);
  transition: all 0.6s ease-in-out;
}
</style>
