module.exports = {
  lintOnSave: false,
  publicPath: './',
  //axios配置
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:9966/',
        // 允许跨域
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
