module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://backend:9900',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    }
  }
}