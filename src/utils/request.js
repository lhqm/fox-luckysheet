import axios from 'axios'
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: '/api',
    // 超时
    timeout: 10000
})
// request拦截器
service.interceptors.request.use(config => {
    return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
        // 未设置状态码则默认成功状态
        const code = res.data.code || 200;
        // 获取错误信息
        const message = res.data.msg
        if (code === 401) {
            window.confirm(
                '登录状态已过期，您可以继续留在该页面，或者重新登录',
                '系统提示',
                {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).then(() => {
                // store.dispatch('LogOut').then(() => {
                //   location.reload() // 为了重新实例化vue-router对象 避免bug
                // })
            })
        } else if (code === 500) {
            // Message({
            //     message: message,
            //     type: 'error'
            // })
            alert(message)
            return Promise.reject(new Error(message))
        } else if (code !== 200) {
            Notification.error({
                title: message
            })
            return Promise.reject('error')
        } else {
            return res.data
        }
    },
    error => {
        console.log('err' + error)
        // Message({
        //     message: error.message,
        //     type: 'error',
        //     duration: 5 * 1000
        // })
        alert(error.message)
        return Promise.reject(error)
    }
)

export default service
