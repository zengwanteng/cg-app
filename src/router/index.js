import Vue from 'vue'
import Router from 'vue-router'
// 因为在vue实例对象中使用this.$sotre的时候，这个对象指向的时候 src/store/index.js文件中的store实例
// 因为这个页面不是一个vue文件，所以没有this对象，因此在使用store实例的时候需要自行引入
import store from '../store'

// 插件注册
Vue.use(Router)

// 路由定义
// 引入路由组件
import NotFound from '../views/common/NotFound'
import Login from '../views/login'
import Home from '../views/home'
import ProductEdit from '../views/product/Edit.vue'
import ProjectList from '../views/project'

import PurchaseList from '../views/purchase'
import PurchaseDetail from '../views/purchase/Detail'
import PurchaseEdit from '../views/purchase/Edit'

const routes = [
    // 定义默认路由重定向
    {path: '/', redirect: '/login'},
    {path: '/login', component: Login},
    {path: '/home', component: Home, meta: {required: true}},
    {path: '/product/edit', component: ProductEdit, meta: {required: true}},
    {path: '/project/list', component: ProjectList, meta: {required: true}},
    {path: '/purchase/list', component: PurchaseList, meta: {required: true}},
    {path: '/purchase/detail', component: PurchaseDetail, meta: {required: true}},
    {path: '/purchase/edit', component: PurchaseEdit, meta: {required: true}},
    {path: '*', component: NotFound}
]

// 路由进行实例化
const router = new Router({
    routes
})

// 常用beforeEach实现全局拦截
router.beforeEach(function(to, from, next) {
    // 如果需要去的页面路由不需要用户登录以后才能访问
    if (!to.meta.required) {
        next()
        return
    }

    // TypeError: Cannot read properties of undefined (reading '$store')
    // 类型错误：不能从undefined上读取一个属性(读取$store属性)
    // console.log(this.$store)

    // 代码能执行到此处的都是要进行登录校验
    // 获取登录缓存标识
    // let token = sessionStorage.getItem('token')
    let token = store.getters['common/token']
    if (!!token) {
        next()
    } else {
        // 如果当前页面路由是从登录页面过来，因此不需要进行登录页面跳转
        if (from.path !== '/login') {
            next('/login')
        }
    }
})

export default router