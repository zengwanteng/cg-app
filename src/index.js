import Vue from 'vue'

import App from './views'

import router from './router'

import store from './store'

// 全局安装vant组件
import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)

// 因为样式加载有一个覆盖的效果，后加载会覆盖先加载
import './style/index.less'

// import PageLayout from './views/common/PageLayout'
// Vue.component("PageLayout", PageLayout)
// Vue的插件开发 -- 两种模式：方法、对象
// 方法插件，它会进行传递一个VueContructor对象作为入参
// const plugin = function(_Vue) {
//     _Vue.component("PageLayout", PageLayout)
// }

// 需要对自定义插件进行注册
import plugin from './components'
Vue.use(plugin)

new Vue({
    router,
    store,
    render: ce => ce(App)
}).$mount('#app')