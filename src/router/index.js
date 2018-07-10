import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Page from '@/components/page'

const baz = () => import(/* webpackChunkName: "group-baz" */'@/components/asyncBaz')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/page',
      name: 'page',
      component: Page
    },
    {
      path: '/baz',
      name: 'baz',
      component: baz
    }
  ]
})
