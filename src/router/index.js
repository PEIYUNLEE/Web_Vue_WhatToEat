import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Menu from '@/components/Menu'
import OrderManager from '@/components/OrderManager'
import Order from '@/components/Order'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'OrderManager',
      component: OrderManager
    },
    {
      path: '/Menu',
      name: 'Menu',
      component: Menu
    },
    {
      path: '/Order',
      name: 'Order',
      component: Order
    },
    // {
    //   path: '/OrderManager',
    //   name: 'OrderManager',
    //   component: OrderManager
    // }
  ]
})
