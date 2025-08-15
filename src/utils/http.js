// import Vue from 'vue';
import axios from 'axios'
import {errorDeal, getStore} from '@/utils/utils'
import NProgress from 'nprogress'

NProgress.configure({showSpinner: false})

//请求拦截器
axios.interceptors.request.use(
    function (config) {
        //网路进度条
        NProgress.start()
        //获取token
        config.headers.token = getStore('admin_token') || ''
        config.baseURL = import.meta.env.VITE_URL
        return config
    },
    function (error) {
        console.log(error, 'error')
        NProgress.done()
        return Promise.reject(error)
    },
)

//响应拦截器
axios.interceptors.response.use(
    function (response) {
        // 获取后台返回的token,后面优化
        //   let token = response.headers?.token
        //   console.log(token, '0000')

        if (response.request.responseType == 'blob') {
            NProgress.done()
            return response
        }

        if (response.data.code !== 0) {
            NProgress.done()
            errorDeal(response.data)
            return Promise.reject(response)
        } else {
            //网路进度条
            NProgress.done()
            return response.data
        }
    },
    function (error) {
        const status = error.response.status
        let message = ''
        switch (status) {
            case 66:
                message = 'TOKEN过期'
                break
            case 403:
                message = '无权访问'
                break
            case 404:
                message = '请求地址错误'
                break
            case 500:
                message = '服务器出现问题'
                break
            default:
                message = '网络出现问题'
                break
        }
        errorDeal(message)
        NProgress.done()
        return Promise.reject(error)
    },
)
/**
 *@describe http请求
 *@method {String} 请求方式
 *@url {String} 接口地址
 *@params {Object} 对应接口参数
 **/

export default function _http(method = 'post', {url, apiName = ''}, params = {}, loading = true, headers = {}) {
    return axios({
        method: method,
        url: url,

        headers: Object.assign(
            {
                'Content-Type': 'application/json;charset=UTF-8', //这里charset=UTF-8如果加了；,express接收不到参数
            },
            headers,
        ),
        params: method === 'get' ? params : '' || method === 'delete' ? params : '',
        data: params instanceof FormData ? params : typeof params === 'object' ? JSON.stringify(params) : params,
        timeout: 1000 * 60,
        responseType: params.responseType == 'blob' ? 'blob' : undefined,
        withCredentials: true,
    }).then((res) => {
        return res
    })
}
