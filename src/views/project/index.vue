<template>
    <page-layout text="项目管理" :showNew="true" @newEvt="newEvt">
        <ul @scroll="scrollEvent" class="my-project-list">
            <li v-for="item in list" :key="item.id">
                <div class="left">
                    <span class="title">{{item.name}}</span>
                    <span class="text">负责人：{{item.ownerName}}</span>
                    <!-- 在使用过滤器的时候，在{{}}中的数据后添加 "|" 和过滤器方法即可 -->
                    <!-- 因为过滤器是方法调用，因此可以传值 -->
                    <!-- <span class="text">签订日期：{{item.signTime | dateFormat('MM月DD日 hh时mm分')}}</span> -->
                    <!-- 自定义指令使用 -->
                    <!-- <span class="text" v-mytext="item.signTime"></span> -->
                    <!-- 使用":"来给指令添加参数，传递的参数只能传一个，通过：arg来接收参数 -->
                    <!-- <span class="text" v-mytext:red:green="item.signTime"></span> -->
                    <!-- 使用"."来给指令添加修饰符，传递参数可以是多个，通过：modifiers来获取参数，每一个参数的值为true -->
                    <span class="text" v-mytext:red.18.bold="item.signTime"></span>
                    <span class="text">地址：{{item.address}}</span>
                </div>
                <div class="right">
                    <i></i>
                    <i class="del"></i>
                </div>
            </li>
            <li class="loading-text">
                <span v-if="isLoading">加载中...</span>
                <span v-if="hasMore && !isLoading">上滑加载更多数据</span>
                <span v-if="!hasMore && !isLoading">没有更多数据</span>
            </li>
        </ul>
    </page-layout>
</template>

<script>
    import { projectListApi } from '../../apis/projectApi'

    export default {
        // 页面注册组件
        // components: {},

        // 在Vue中如果是展示数据的形态和原始数据不一样，可以使用过滤器 -- 它实际上是使用计算属性原理
        // 在项目开发中，vue的过滤器经常使用到
        filters: {
            // 定义一个过滤器，方法必须返回展示内容
            // 过滤器在使用的时候，第一个参数始终为使用过滤器的数据值，从第二个起为传递的参数
            // dateFormat: function(val, type) {
            //     console.log(arguments)
            //     // 做一个容错处理，如果用户传递的是null、undefined、''
            //     if (!val) return ''

            //     let _d = new Date(val),
            //         yyyy = _d.getFullYear(),
            //         MM = _d.getMonth() + 1,
            //         DD = _d.getDate(),
            //         hh = _d.getHours(),
            //         mm = _d.getMinutes(),
            //         ss = _d.getSeconds()

            //     MM = MM > 9 ? MM : `0${MM}`
            //     DD = DD > 9 ? DD : `0${DD}`
            //     hh = hh > 9 ? hh : `0${hh}`
            //     mm = mm > 9 ? mm : `0${mm}`
            //     ss = ss > 9 ? ss : `0${ss}`

            //     // 需要使用replace方法来进行数据格式化
            //     // return `${yyyy}年${MM}月${DD}日 ${hh}时${mm}分${ss}秒`
            //     // return `${MM}-${DD} ${hh}:${mm}:${ss}`
            //     // let res = 'yyyy年MM月DD日 hh时mm分ss秒'.replace(/(yyyy)|(MM)|(DD)|(hh)|(mm)|(ss)/g, function(key) {
            //     // let res = 'yyyy-MM-DD hh时mm分ss秒'.replace(/(yyyy)|(MM)|(DD)|(hh)|(mm)|(ss)/g, function(key) {
            //     // let res = 'yyyy-MM-DD hh:mm:ss'.replace(/(yyyy)|(MM)|(DD)|(hh)|(mm)|(ss)/g, function(key) {
            //     return type.replace(/(yyyy)|(MM)|(DD)|(hh)|(mm)|(ss)/g, function(key) {
            //         if (key === 'yyyy') return yyyy
            //         if (key === 'MM') return MM
            //         if (key === 'DD') return DD
            //         if (key === 'hh') return hh
            //         if (key === 'mm') return mm
            //         if (key === 'ss') return ss
            //     })
            //     // return res
            // }
        },

        // 使用指令属性，来定义当前页面的指令
        directives: {
            // 因为指令功能强大，所以在定义的时候，有两种定义方法
            // 第一种是：函数模式
            // 函数有入参：总共有五个，常用的两个
            // 第一个参数：绑定指令的dom标签
            // 第二个参数：绑定在指令上的属性
            // 第三个参数和第四个参数分别为：更新后的vdom元素和更新前的vdom元素
            // mytext: function(el, bindData) {
            //     console.log(bindData)
            //     let val = bindData.value

            //     // 如果需要对dom进行操作，可以使用原生方法来实现
            //     el.innerText = '签订日期：' + val

            //     // 可以通过bindData获取到在指令上添加的参数
            //     el.style.color = bindData.arg

            //     // 可以通过bindData来获取数据
            //     if (bindData.modifiers['18']) el.style.fontSize = `${18}px`
            //     if (bindData.modifiers.bold) el.style.fontWeight = 'bold'
            // }

            // 对象写法 -- 整个指令的生命周期
            // 生命周期中每一个的参数都差不多，几乎也是使用前两个参数
            // mytext: {
            //     // 指令什么时候被绑定到节点上
            //     bind(el, bindData) {
            //         console.log('direct mytext bind')
            //         let val = bindData.value

            //         // 如果需要对dom进行操作，可以使用原生方法来实现
            //         el.innerText = '签订日期：' + val

            //         // 可以通过bindData获取到在指令上添加的参数
            //         el.style.color = bindData.arg

            //         // 可以通过bindData来获取数据
            //         if (bindData.modifiers['18']) el.style.fontSize = `${18}px`
            //         if (bindData.modifiers.bold) el.style.fontWeight = 'bold'
            //     },
            //     // dom节点什么时候被插入到VDom中
            //     inserted() {
            //         console.log('direct mytext inserted')
            //     },
            //     componentUpdated() {
            //         console.log('direct mytext componentUpdated')
            //     },
            //     unbind() {
            //         console.log('direct mytext unbind')
            //     }
            // }
        },
        data() {
            return {
                query: {
                    page: 1,
                    size: 6
                },
                list: [],
                isLoading: true,
                hasMore: true
            }
        },

        created() {
            this.getList()
        },

        methods: {
            scrollEvent(evt) {
                // 如果没有更多数据了，不需要执行滚动加载业务
                if (!this.hasMore) return

                // 数据正在加载中，不能执行滚动加载的所有业务
                if (this.isLoading) return

                // 可以监听页面的滚动距离，如果 滚动距离(evt.target.scrollTop) 加上 当前窗口高度(evt.target.clientHeight) 等于 窗口内容的真实高度
                // 表示页面已经滚动到底部了，可以执行下页数据的加载
                let dis = evt.target.scrollHeight - (evt.target.clientHeight + evt.target.scrollTop)
                // 当用户滚动距离底部差不多16像素的时候就开始加载
                if (dis < 16) {
                    this.isLoading = true
                    // 因为要获取下一页的数据，因此需要对query.page进行加一
                    this.query.page += 1
                    // 调用获取数据的接口来获取数据
                    this.getList()
                }
            },

            newEvt() {

            },

            async getList() {
                let result = await projectListApi(this.query)
                if (result.code === 200) {
                    // 因为每次后端都是返回当前页面的数据，不会把之前的数据进行返回，因此需要自己去拼接
                    // this.list = result.data.rows
                    this.list = [...this.list, ...result.data.rows]
                    // 是否有更多数据:已经获取的数据和总数对比，如果已经获取的数据等于或小于已经获取的数据则没有更多数据
                    this.hasMore = this.query.page * this.query.size < result.data.total
                }

                // 因为vue赋值是异步的，因此每次加载完成数据以后，要执行一个setTimeout来阻断立即页面刷新的功能
                setTimeout(() => {
                    this.isLoading = false
                })
            }
        }
    }
</script>