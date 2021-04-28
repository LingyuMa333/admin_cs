module.exports = {
    devServer: {
        disableHostCheck: true,
        proxy: {
            '/API': {
                target: 'http://127.0.0.1:2021/api/v1',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/API': ''
                }
            }
        }
    },
    productionSourceMap: false,
    publicPath: './',
    css: {
        loaderOptions: {
            less: {
                modifyVars: {
                    'primary-color': '#ff7200',
                    'link-color': '#1DA57A',
                    'border-radius-base': '2px',
                },
                javascriptEnabled: true,
            },
        },
    },
}