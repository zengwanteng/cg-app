<template>
    <page-layout :showNew="true" @btnEvt="toNewPage" text="采购订单管理">
        <header class="my-header">
            <input type="text" v-model="query.projectName" placeholder="输入项目名进行查询">
            <van-dropdown-menu>
                <van-dropdown-item v-model="query.state" :options="option" />
            </van-dropdown-menu>
            <i></i>
        </header>
        <ul @scroll="scrollEvent" class="my-project-list purchase">
            <li v-for="item in list" :key="item.id">
                <van-swipe-cell>
                    <!-- #left指定插槽的名字 -->
                    <template #left>
                        <van-button @click="btnEvt(item, 'detail')" square type="primary" text="详情" />
                    </template>
                    <div class="my-left">
                        <span class="title">
                            {{item.projectName}}
                            <em>{{item.state}}</em>
                        </span>
                        <span class="text">创建人：{{item.createName}}</span>
                        <span class="text">创建日期：{{item.createTime | dateFormat('yyyy-MM-DD')}}</span>
                        <!-- <span class="text">材料：{{item.materialName}} -- {{item.materialWeight}}{{item.materialUnit}}</span> -->
                        <span class="text">材料：{{`${item.materialName} -- ${item.materialWeight}${item.materialUnit}`}}</span>
                    </div>
                    <template #right>
                        <van-button @click="btnEvt(item, 'delete')" v-if="item.state === '新建'" square type="danger" text="删除" />
                        <van-button @click="btnEvt(item, 'edit')" v-if="item.state === '新建'" square type="primary" text="编辑" />
                        <van-button @click="btnEvt(item, 'confirm')" v-if="item.state === '新建'" square color="#7232dd" text="确认" />
                        <van-button @click="btnEvt(item, 'inline')" v-if="item.state === '确认'" square color="#7232dd" text="在途" />
                        <van-button @click="btnEvt(item, 'finish')" v-if="item.state === '在途'" square color="#7232dd" text="完成" />
                        <van-button @click="btnEvt(item, 'payment')" v-if="item.state === '完成'" square color="#7232dd" text="付款" />
                    </template>
                </van-swipe-cell>
                
            </li>
            <!-- 每一行的按钮：受权限控制和用户账号、数据的state有关 -->
            <!-- 详情按钮，应该在整个单据中都应该显示，而且能够进入页面的用户都可以查看 -->
            <!-- 当数据的状态为：新建，显示编辑、删除、确认；删除不会执行物理，它只会执行逻辑删除--就是把单据的状态改为作废，因为要追踪每一条数据的所有信息 -->
            <!-- 当数据的状态为：确认，显示在途 -->
            <!-- 当数据的状态为：在途，显示完成 -- 通过在途和完成的审批时间可以知道货物在运输的途中花费了多少时间，完成以后可以通知对应验货人员进行货物验收 -->
            <!-- 当数据的状态为：完成，显示付款 -->
            <li class="loading-text">
                <span v-if="isLoading">加载中...</span>
                <span v-if="hasMore && !isLoading">上滑加载更多数据</span>
                <span v-if="!hasMore && !isLoading">没有更多数据</span>
            </li>
        </ul>

        <van-popup v-model="show" round position="bottom" :close-on-click-overlay="false" :style="{ height: '30%' }">
            <van-steps :active="active" active-icon="success" active-color="#38f">
                <van-step>新建</van-step>
                <van-step>确认</van-step>
                <van-step>在途</van-step>
                <van-step>完成</van-step>
            </van-steps>
            <input type="text" :value="flowData.userName" readonly/>
            <van-radio-group v-model="flowData.isReject" direction="horizontal">
                <van-radio :name="false">通过</van-radio>
                <van-radio :name="true">驳回</van-radio>
            </van-radio-group>
            <textarea v-model="flowData.remark" style="width: 100%;height: 38px;"></textarea>

            <div>
                <van-button size="small" type="primary" @click="confirmEvt">确定</van-button>
                <van-button size="small" type="default" @click="show = false">取消</van-button>
            </div>
            <!-- <van-field v-model="message"
                rows="2"
                autosize
                label="留言"
                type="textarea"
                maxlength="50"
                placeholder="请输入留言"
                show-word-limit/> -->
        </van-popup>
    </page-layout>
</template>

<script>
    import { purchaseDeleteApi, purchaseFlowApi, purchaseListApi } from '../../apis/purchaseApi'
    export default {
        data() {
            return {
                query: {
                    projectName: '',
                    state: '',
                    page: 1,
                    size: 6
                },
                option: [
                    {text: '全部', value: ''},
                    {text: '新建', value: '新建'},
                    {text: '确认', value: '确认'},
                    {text: '在途', value: '在途'},
                    {text: '完成', value: '完成'},
                    {text: '作废', value: '作废'}
                ],
                list: [],
                isLoading: true,
                hasMore: true,
                show: false,
                active: '',
                flowData: {
                    id: '',
                    isReject: false, // isReject 是驳回，因此通过为false
                    userId: '',
                    userName: '',
                    remark: ''
                }
            }
        },

        computed: {
            userInfo() {
                return this.$store.getters['common/userInfo']
            },
            rights() {
                return this.$store.getters['common/userRights']
            }
        },

        created() {
            this.getList()
        },

        methods: {
            async getList() {
                let result = await purchaseListApi()
                if (result.code === 200) {
                    this.list = result.data.rows
                }
            },
            scrollEvent() {

            },
            // 在公司系统中，如果是一份单需要多个用户来进行处理，这样的业务称为流程系统
            // 比如进入公司以后会用到：钉钉中请假、调休这样的业务，OA
            btnEvt(row, type) {
                switch(type) {
                    case 'edit':
                        this.$router.push({path: '/purchase/edit', query: {id: row.id}})
                        break
                    case 'detail':
                        this.$router.push({path: '/purchase/detail', query: {id: row.id}})
                        break
                    case 'delete':
                        this.$dialog.confirm({
                                title: '删除确认',
                                message: `确定要删除【${row.projectName}】项目的采购订单？`,
                            }).then(async () => {
                                let result = await purchaseDeleteApi(row.id)
                                // 如果删除成功，不能去请求数据，应该是直接把数组中的数据删除即可
                                if (result.code === 200) {
                                    // let idx = this.list.findIndex(it => it.id === row.id)
                                    // this.list.splice(idx, 1)
                                    this.list.map(it => {
                                        if (it.id === row.id) it.state = '作废'
                                        return it
                                    })
                                    this.$toast.success('删除成功')
                                } else {
                                    this.$toast.fail('删除失败')
                                }
                            }).catch(() => {})
                        break
                    case 'confirm':
                        this.show = true
                        this.active = 1
                        // 需要对当前审批数据进行处理
                        this.flowData.id = row.id
                        this.flowData.userId = this.userInfo.id
                        this.flowData.userName = this.userInfo.name
                        this.flowData.remark = ''
                        break
                    case 'inline':
                        this.show = true
                        this.active = 2
                        // 需要对当前审批数据进行处理
                        this.flowData.id = row.id
                        this.flowData.userId = this.userInfo.id
                        this.flowData.userName = this.userInfo.name
                        this.flowData.remark = ''
                        break
                    case 'finish':
                        this.show = true
                        this.active = 3
                        // 需要对当前审批数据进行处理
                        this.flowData.id = row.id
                        this.flowData.userId = this.userInfo.id
                        this.flowData.userName = this.userInfo.name
                        this.flowData.remark = ''
                        break
                }
            },
            // 流程弹出框的确认按钮
            async confirmEvt() {
                if (!this.flowData.remark) {
                    this.$toast.fail('备注信息没有填写')
                    return
                }

                let result = await purchaseFlowApi(this.flowData)

                // 因为不能发起请求，所以状态更新成功以后，需要手动去设置状态
                if (result.code === 200) {
                    this.$toast.success('审批成功')
                    // 如果是驳回，需要去处理，如果是通过也需要进行到下一步
                    let states = ['新建', '确认', '在途', '完成']

                    this.list.map(it => {
                        if (it.id === this.flowData.id) {
                            if (this.flowData.isReject) {
                                let idx = this.active - 2
                                idx = idx < 0 ? 0 : idx
                                it.state = states[idx]
                            } else {
                                it.state = states[this.active]
                            }
                        }
                        return it
                    })
                    this.show = false
                } else {
                    this.$toast.fail('审批失败，请重试')
                }
            },
            // 执行页面跳转，进行权限拦截
            toNewPage() {
                // 因为在具体的页面，因此页面的编码可以固定写死
                let myRights = this.rights.find(it => it.id === "PURCHASE-01-02")
                // 如果权限不存在或没有新增权限
                if (!myRights || !myRights.role.includes("C")) {
                    this.$toast.fail('你没有访问这个页面的权限')
                    return
                } else {
                    this.$router.push('/purchase/edit')
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .my-header {
        display: flex;
        height: 49px;
        padding: 8px 12px;
        border-bottom: solid 1px;
        > input {
            flex: 1;
            width: 0;
            height: 32px;
            line-height: 32px;
            border: none;
            outline: none;
            background: transparent;
            &::-webkit-input-placeholder {
                font-size: .7rem;
                color: #ddd;
            }
        }
        > i {
            flex: 0 0 36px;
            height: 32px;
            background: url(../../images/search-icon.png) center center / 26px 26px no-repeat;
        }
    }
</style>