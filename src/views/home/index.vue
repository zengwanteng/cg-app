<template>
    <page-layout text="凌动智能采购系统">
        <div>
            <van-swipe :autoplay="3000" indicator-color="white">
                <van-swipe-item>
                    <div ref="lineNode" class="chart-box"></div>
                </van-swipe-item>
                <van-swipe-item>
                    <div ref="pieNode" class="chart-box"></div>
                </van-swipe-item>
            </van-swipe>
        </div>
        <ul class="func-box">
            <li v-for="it in list" :key="it.title">
                <span class="title">{{it.title}}</span>
                <div class="item" v-for="item in it.children" :key="item.name">
                    <i @click="toPage(item)" :class="item.icon"></i>
                    <span>{{item.name}}</span>
                </div>
            </li>
        </ul>
    </page-layout>
</template>

<script>
    import LineChart from './LineChart.vue'
    import PieChart from './PieChart'
    // 第一步：引入echarts库
    import echarts from 'echarts'

    import { collectionApi, paymentApi } from '../../apis/homeApi'

    export default {
        // mixins: [LineChart, PieChart],
        extends: PieChart,
        mixins: [LineChart],
        data() {
            return {
                list: [
                    {
                        title: '基础数据',
                        children: [
                            {id: 'SYSTEM-01-05', right: 'R', icon: 'product-list', name: '材料管理', path: ''},
                            {id: 'SYSTEM-01-05', right: 'C', icon: 'product-new', name: '新建材料', path: ''},
                            {id: 'SYSTEM-01-06', right: 'R', icon: 'supplier-list', name: '供应商管理', path: ''},
                            {id: 'SYSTEM-01-06', right: 'C', icon: 'supplier-new', name: '新建供应商', path: ''}
                        ]
                    },
                    {
                        title: '项目管理',
                        children: [
                            {id: 'PROJECT-01-01', right: 'R', icon: 'project-list', name: '项目管理', path: '/project/list'},
                            {id: 'PROJECT-01-01', right: 'C', icon: 'project-new', name: '新建项目', path: ''}
                        ]
                    },
                    {
                        title: '采购管理',
                        children: [
                            {id: 'PURCHASE-01-01', right: 'R', icon: 'purchase-list', name: '采购管理', path: '/purchase/list'},
                            {id: 'PURCHASE-01-01', right: 'C', icon: 'purchase-new', name: '新建采购', path: '/purchase/edit'}
                        ]
                    },
                    {
                        title: '收货管理',
                        children: [
                            {id: 'RECEIVING-01-01', right: 'R', icon: 'receive-list', name: '收货管理', path: ''},
                            {id: 'RECEIVING-01-01', right: 'C', icon: 'receive-new', name: '新建收货', path: ''}
                        ]
                    },
                    {
                        title: '系统管理',
                        children: [
                            {icon: 'setting', name: '设置', path: ''}
                        ]
                    }
                ]
            }
        },

        // 需要使用computed属性来获取用户权限信息
        computed: {
            rights() {
                return this.$store.getters['common/userRights']
            }
        },

        // 需要对echarts进行初始化，需要传递一个dom节点
        async mounted() {
            // 调用init方法 -- 得到一个实例对象
            // lineChart 数据在 LineChart组件中定义的，因为混合，然后可以直接使用
            this.lineChart = echarts.init(this.$refs.lineNode)
            let result = await collectionApi()

            // 调用渲染方法
            this.renderLineChart(result.data)

            // 饼图echarts实例化
            this.pieChart = echarts.init(this.$refs.pieNode)
            let pieRes = await paymentApi()

            // 调用渲染方法
            this.renderPieChart(pieRes.data)
        },

        methods: {
            // 根据用户的点击，来判断是否有权限访问页面
            toPage(item) {
                // 如果菜单没有right这个属性，表示这个菜单用户可以直接进入，不需要权限
                if (!item.right) {
                    this.$toast.success('不需要权限')
                    return
                }
                // 在权限数组中找到对应的菜单权限
                let myRights = this.rights.find(it => it.id === item.id)
                if (!myRights) {
                    this.$toast.fail('你没有访问这个页面的权限')
                    return
                }

                // 如果菜单权限存在，需要判断具体的使用权限
                if (myRights.role.includes(item.right)) {
                    if (!item.path) {
                        this.$toast('此功能正在建设中...')
                    } else {
                        this.$router.push(item.path)
                    }
                } else {
                    this.$toast.fail('你没有访问这个页面的权限')
                }
            }
        }
    }
</script>


<style lang="less" scoped>
    @import "../../style/common.less";
    .chart-box {
        display: block;
        height: 260px;
    }
    .func-box {
        > li {
            display: block;
            position: relative;
            margin: 0 20px 20px;
            background: #fff;
            .clear();
            > .title {
                display: block;
                padding: 8px 12px;
                color: #ff5513;
                font-size: .8rem;
                line-height: 22px;
                border-bottom: solid 1px #ddd;
                &::before {
                    content: '';
                    display: inline-block;
                    vertical-align: bottom;
                    height: 22px;
                    width: 2px;
                    background: #ff5513;
                    margin-right: 8px;
                }
            }

            > .item {
                float: left;
                width: 25%;
                margin: 10px 0;
                i {
                    display: block;
                    width: 48px;
                    height: 48px;
                    margin: auto;
                    background-position: center;
                    background-size: 30px;
                    background-repeat: no-repeat;
                    // background: url(../../images/home/setting.png) center center / 30px 30px no-repeat;
                    // &.product-list {
                    //     background-image: url("../../images/home/product-list.png");
                    // }
                    .loop();
                }
                span {
                    display: block;
                    font-size: .6rem;
                    color: @primary;
                    text-align: center;
                }
            }
        }
    }

    // less的for遍历来实现多个图片样式的编写
    // 定义一个less数组
    @list: product-list product-new project-list project-new purchase-list purchase-new receive-list receive-new setting supplier-list supplier-new;

    // 实现for遍历，在less中需要使用到递归来实现，在less中下标从1开始
    // less 中获取数组的长度：length函数
    .loop(@index: 1) when(@index <= length(@list)) {
        @name: extract(@list, @index);
        // 定义的变量，如果要当一个变量名来使用的时候，需要使用@{name}
        &.@{name} {
            background-image: url("../../images/home/@{name}.png");
        }

        // 要递归遍历
        .loop(@index + 1);
    }
</style>