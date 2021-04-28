import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'

import { get, post, upload, exportData } from '@/utils/fetch'

Vue.config.productionTip = false

import 'ant-design-vue/dist/antd.css'

Vue.use(Antd)
Vue.prototype.$get = get
Vue.prototype.$post = post
Vue.prototype.$upload = upload
Vue.prototype.$exportData = exportData

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

import { Icon } from 'ant-design-vue';
const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1747216_ocifsbiwdnb.js',
});

Vue.component('MyIcon', MyIcon);

Vue.mixin({
  data() {
    return {
      host: 'http://meinian.qs110.com'
    }
  }
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
