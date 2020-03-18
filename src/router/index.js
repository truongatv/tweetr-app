import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import SignUpForm from '../views/Auth/SignUpForm'
import LogInForm from '../views/Auth/LogInForm'
import ConfirmAccount from '../views/Auth/ConfirmAccount'

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
  {
    path: '/confirm_account/:token/:email',
    name: 'confirm_account',
    component: ConfirmAccount
  },
  {
    path: '/sign_up_done',
    name: 'sign_up_done',
    component: ConfirmAccount
  },
]

const router = new VueRouter({
  routes
})

export default router
