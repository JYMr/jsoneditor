import Vue from 'vue'
import Router from 'vue-router'
import Edit from '@/components/Edit'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Edit',
      component: Edit
    }
  ]
})
