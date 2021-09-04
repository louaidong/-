import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/views/login/login'
import home from '@/views/home/home'
import welcome from '@/views/home/welcome'
import users from '@/views/users/users'
import power from '@/views/power/power'
import roles from '@/views/power/roles'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  {
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome', component: welcome
      },
      {
        path: '/users', component: users
      },
      {
        path: '/rights', component: power
      },
      {
        path: '/roles', component: roles
      }
    ]
  }

]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
