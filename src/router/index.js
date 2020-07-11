import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import SignUpForm from '../views/Auth/SignUpForm'
import LogInForm from '../views/Auth/LogInForm'
import ConfirmAccount from '../views/Auth/ConfirmAccount'
import ResetPasswordIndex from '../views/Auth/ResetPassword/index'
import RequestResetPasswordForm from '../views/Auth/ResetPassword/RequestResetPassword'
import ResetPasswordForm from '../views/Auth/ResetPassword/ResetPassword'
import PageNotFound from '@/views/PageNotFound'
import Intro from '@/views/Intro'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/intro',
    name: 'intro',
    component: Intro
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
    path: '/reset_password',
    name: 'reset_password',
    component: ResetPasswordIndex,
    children: [ 
      {
        path: '',
        component: RequestResetPasswordForm
      },
      {
        path: ':token/:email',
        component: ResetPasswordForm
      }
    ]
  },
  {
    path: '/confirm_account/:token/:email',
    name: 'confirm_account',
    component: ConfirmAccount
  },
  {
    path: '/sign_up_done',
    name: 'sign_up_done',
    component: ConfirmAccount,
    beforeEnter: (to, from, next) => {
      if(from.name == 'signup') {
        next()
      } else {
        next("/login")
      }
    }
  },
  {
    path: '*',
    name: 'page_not_found',
    component: PageNotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
