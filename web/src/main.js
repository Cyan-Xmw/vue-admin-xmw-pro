// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import './core/lazy_use' // use lazy load components
import './permission' // permission control
import './utils/filter' // global filter
import './global.less' // global style

import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import Vue from 'vue'

import themePluginConfig from '../config/themePluginConfig'
import App from './App.vue'
import bootstrap from './core/bootstrap'
import i18n from './locales'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'

Vue.config.productionTip = false

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)
// use pro-layout components
Vue.component('pro-layout', ProLayout)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)

window.umi_plugin_ant_themeVar = themePluginConfig.theme

new Vue({
  router,
  store,
  i18n,
  // init localstorage, vuex, Logo message
  created: bootstrap,
  render: (h) => h(App)
}).$mount('#app')
