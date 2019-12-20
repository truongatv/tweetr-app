import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import SignUpForm from '@/components/Auth/SignUpForm'
import LogInForm from '@/components/Auth/LogInForm'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUpForm
  },
  {
    path: '/login',
    name: 'login',
    component: LogInForm
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
