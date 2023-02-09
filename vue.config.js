// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true,
// })
module.exports = {
  chainWebpack: config => {
    //发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      //entry找到默认的打包入口，调用clear则是删除默认的打包入口 add添加新的打包入口
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')
      //使用externals设置排除项
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })

      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    //开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    client: {
      webSocketURL: 'ws://0.0.0.0:3000/ws'
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}
