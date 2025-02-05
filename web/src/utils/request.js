import { message } from 'ant-design-vue'
import notification from 'ant-design-vue/es/notification'
import axios from 'axios'
import { debounce, get } from 'lodash-es'
import storage from 'store'

import { RequestCode } from '@/constant'
import { ACCESS_TOKEN } from '@/store/mutation-types'

import { VueAxios } from './axios'

// 异常提示防抖
const debounceError = debounce((content, duration = 3) => {
  message.error(content, duration)
}, 300)

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    if (error.response.status === RequestCode.Unauthorized) {
      notification.error({
        message: '登录已失效,请重新登录!',
        description: data.msg
      })
      setTimeout(() => {
        storage.clearAll()
        window.location.reload()
      }, 500)
    } else {
      setTimeout(() => {
        storage.clearAll()
        window.location.reload()
      }, 500)
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use((config) => {
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  const { code, msg } = response.data
  // 配置 skipErrorHandler 会跳过默认的错误处理，用于项目中部分特殊的接口
  if (code !== RequestCode.Success && !get(response, 'config.skipErrorHandler', false)) {
    debounceError(msg || '请求失败')
  }
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export { request as axios, installer as VueAxios }
