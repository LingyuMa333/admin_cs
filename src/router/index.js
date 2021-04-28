import Vue from 'vue'
import VueRouter from 'vue-router'

import basic from '@/views/basic'
import user from '@/views/user'
import demo from '@/views/demo'
import login from '@/views/user/login'
import userlist from '@/views/basic/userlist'
import home from '@/views/basic/home'
import banner from '@/views/basic/banner'
import courseList from '@/views/basic/courseList'
import noticeList from '@/views/basic/noticeList'

import courseOperaList from '@/views/basic/courseOperaList'




Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: '/'
  },
  {
    path: '/',
    redirect: '/basic/userlist'
  },
  {
    path: '/user',
    component: user,
    children: [{
      path: 'login',
      component: login
    }]
  },
  {
    path: '/demo', component: demo
  },
  {
    path: '/basic',
    component: basic,
    children: [
      { path: 'userlist', component: userlist },
      { path: 'home', component: home },
      { path: 'banner', component: banner },
      { path: 'courseList', component: courseList },
      { path: 'noticeList', component: noticeList },
      { path: 'courseOperaList', component: courseOperaList },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
