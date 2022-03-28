<template>
    <!-- :close-on-click-overlay="false" -->
    <van-popup v-model="show"
            position="right"
            @click-overlay="overlayEvt"
            :style="{ height: '100%', width: '80%' }">
            <van-button @click="sureEvt">确定</van-button>
            <ul v-if="list.length > 0" class="picker-list">
                <li @click="pickEvt(item)" v-for="item in list" :key="item.id">
                    {{item.name}}
                </li>
            </ul>
            <li v-else>数据请求中</li>
    </van-popup>
</template>

<script>
    import { productListApi, projectListApi, supplierListApi, userListApi } from '../../apis/purchaseApi'
    export default {
        props: {
            show: {
                type: Boolean,
                required: true
            },

            type: {
                type: String,
                required: true
            },

            isDX: {
                type: Boolean,
                default: false
            }
        },

        // 监听show的变化，当show的值为true的时候，去请求数据，并且根据type不同，需要调用不同的接口
        watch: {
            async show(val) {
                if (val) {
                    if (this.type === 'project') {
                        let result = await projectListApi({page: 1, size: 200})
                        this.list = result.data.rows
                    } else if (this.type === 'product') {
                        let result = await productListApi()
                        this.list = result.data.rows
                    } else if (this.type === 'supplier') {
                        let result = await supplierListApi({page: 1, size: 500})
                        this.list = result.data.rows
                    } else if (this.type === 'user') {
                        let result = await userListApi()
                        this.list = result.data.rows
                    }

                    this.selectedData = []
                } else {
                    this.list = []
                }
            }
        },

        data() {
            return {
                list: [],
                selectedData: []
            }
        },

        async created() {
            // 因为需要根据弹出框的类行不通需要获取不同的数据
            // let result = await projectListApi({page: 1, size: 200})
            // this.list = result.data.rows
        },

        methods: {
            overlayEvt() {
                this.$emit('update:show', false)
            },

            pickEvt(item) {
                // 如果是多选，则给selectedData添加数据，否则直接把数据返回到父组件中去
                if (this.isDX) {
                    this.selectedData.push(item)
                } else {
                    this.$emit('pickEvt', item, this.type)
                }
            },
            // 多选的确认按钮
            sureEvt() {
                this.$emit('pickEvt', this.selectedData, this.type)
            }
        }
    }
</script>

<style lang="less" scoped>
    .picker-list {
        display: block;
        position: relative;
        padding: 8px 12px;
        > li {
            padding: 4px 10px;
            border-bottom: solid 1px #ddd;
            line-height: 26px;
            color: #ff5513;
            font-size: .7rem;
            &:last-child {
                border-bottom: none;
            }
        }
    }
</style>