<template>
    <page-layout :showHome="false" :showBack="true" text="新增采购订单">
        <van-form @submit="onSubmit">
            <p class="my-title">基础信息</p>
            <van-field v-model="pageData.createName"
                name="创建人"
                label="创建人"
                readonly
                placeholder="请填写创建人"/>
            <van-field v-model="pageData.createTime"
                name="创建时间"
                label="创建时间"
                readonly
                placeholder="请选择创建时间"
                :rules="[{required: true, message: '请选择创建时间'}]">
                <!-- rules属性一定是数组，因为这个值可以做多个校验 -->
                <template #button>
                    <van-button size="small" color="#ff5513" native-type="button" @click="timeShow = true" type="primary">选择日期</van-button>
                </template>
            </van-field>
            <van-field v-model="pageData.projectName"
                name="项目名称"
                label="项目名称"
                readonly
                placeholder="请选择项目"
                :rules="[{required: true, message: '请选择项目'}]">
                <template #button>
                    <van-button size="small" color="#ff5513" native-type="button" @click="pickerOpenEvt('project')" type="primary">选择项目</van-button>
                </template>
            </van-field>
            <p class="my-title">材料信息</p>
            <van-field v-model="pageData.materialName"
                name="材料名称"
                label="材料名称"
                readonly
                placeholder="请选择材料"
                :rules="[{required: true, message: '请选择材料'}]">
                <template #button>
                    <van-button size="small" color="#ff5513" native-type="button" @click="pickerOpenEvt('product')" type="primary">选择材料</van-button>
                </template>
            </van-field>
            <van-field v-model.number="pageData.materialWeight"
                type="number"
                name="采购数量"
                label="采购数量"
                placeholder="请填写采购数量"
                :rules="[
                    {required: true, message: '请填写采购数量'},
                    {validator, message: '请填写正确的数字'}
                ]"/>
            <van-field v-model.trim="pageData.materialUnit"
                name="材料单位"
                label="材料单位"
                placeholder="请填写材料单位"
                :rules="[{required: true, message: '请选择材料'}]"/>
            <van-field v-model.number="pageData.price"
                type="number"
                name="单价"
                label="单价"
                placeholder="请填写单价"
                :rules="[
                    {required: true, message: '请填写单价'},
                    {validator, message: '请填写正确的数字'}
                ]"/>
            <p class="my-title">供应商信息</p>
            <van-field v-model="pageData.supplierName"
                name="供应商名称"
                label="供应商名称"
                readonly
                placeholder="请选择供应商"
                :rules="[{required: true, message: '请选择供应商'}]">
                <template #button>
                    <van-button size="small" color="#ff5513" native-type="button" @click="pickerOpenEvt('supplier')" type="primary">选择供应商</van-button>
                </template>
            </van-field>
            <van-field v-model="pageData.supplierContact"
                name="联系人"
                label="联系人"
                readonly
                placeholder="联系人"/>
            <van-field v-model="pageData.supplierPhone"
                name="联系电话"
                label="联系电话"
                readonly
                placeholder="联系电话"/>
            <p class="my-title">审批信息</p>
            <van-field name="审批人"
                label="审批人"
                :value="selectUser.length + '个人'"
                readonly
                placeholder="请选择审批人">
                <template #button>
                    <van-button size="small" color="#ff5513" native-type="button" @click="pickerOpenEvt('user')" type="primary">选择审批人</van-button>
                </template>
            </van-field>
            <van-field v-model="pageData.remark"
                name="备注"
                label="备注"
                placeholder="请输入备注"/>
            <div style="margin: 16px;">
                <van-button round block color="#ff5513" native-type="submit">提交</van-button>
            </div>
        </van-form>

        <!-- <van-popup v-model="timeShow"
            :close-on-click-overlay="false"
            position="bottom"
            :style="{ height: '308px' }">
            <van-datetime-picker
                @cancel="timeShow = false"
                @confirm="timeConfirm"
                type="date"
                title="选择年月日"/>
        </van-popup> -->
        <van-calendar v-model="timeShow" @confirm="timeConfirm"/>

        <dialog-picker @pickEvt="pickerEvent" :isDX="isDX" :type="dialogType" :show.sync="showDialog"/>
        <!-- <dialog-picker v-model="showDialog"/> -->
    </page-layout>
</template>

<script>
import { purchaseInfoApi, purchaseSaveApi, purchaseUpdateApi } from '../../apis/purchaseApi'
    import DialogPicker from './DialogPicker.vue'

    export default {
        components: { DialogPicker },
        data() {
            return {
                pageData: {
                    nextId: '',
                    createId: '',
                    createName: '',
                    createTime: '',
                    projectId: '',
                    projectName: '',
                    materialId: '',
                    materialName: '',
                    materialUnit: '',
                    materialWeight: '',
                    price: '',
                    supplierId: '',
                    supplierName: '',
                    supplierContact: '',
                    supplierPhone: '',
                    remark: ''
                },
                timeShow: false,
                showDialog: false,
                dialogType: '', // 每次点击弹出框组件的时候，设置一个类型，组件就知道调用哪个接口的数据，然后进行展示
                isDX: false,
                selectUser: []
            }
        },

        // 获取当前页面的登录用户信息
        computed: {
            userInfo() {
                return this.$store.getters['common/userInfo']
            }
        },

        async created() {
            this.pageData.createId = this.userInfo.id
            this.pageData.createName = this.userInfo.name

            let id = this.$route.query.id
            if (!!id) {
                let result = await purchaseInfoApi(id)
                this.pageData = result.data
                // 因为remark字段为一个数组，因此需要对remark字段进行置空 -- 如果不置空，会导致数据库崩溃
                this.pageData.remark = ''
            }
        },

        methods: {
            // 表单数据校验方法
            validator(val) {
                return !isNaN(val) && val*1 > 0
            },
            // 表单校验如果没有通过，是不会调用这个方法的
            async onSubmit() {

                if (this.selectUser.length < 1) {
                    this.$toast('请选择审批人')
                    return
                }

                this.pageData.nextId = this.selectUser.reduce(function(nl, item) {
                    nl.push(item.id)
                    return nl
                }, [])

                // 如果id存在则表示数据处于编辑状态，需要调用编辑保存接口，否则为新建
                if (!!this.pageData.id) {
                    let updateRes = await purchaseUpdateApi(this.pageData)
                    if (updateRes.code === 200) {
                        this.$toast.success('修改采购订单成功')
                    } else {
                        this.$toast.fail('修改采购订单失败')
                    }
                } else {
                    let result = await purchaseSaveApi(this.pageData)
                    if (result.code === 200) {
                        this.$toast.success('新增采购订单成功')
                    } else {
                        this.$toast.fail('新增采购订单失败')
                    }
                }
            },
            myDate(val, type) {
            // console.log(arguments)
            // 做一个容错处理，如果用户传递的是null、undefined、''
                if (!val) return ''

                let _d = new Date(val),
                    yyyy = _d.getFullYear(),
                    MM = _d.getMonth() + 1,
                    DD = _d.getDate(),
                    hh = _d.getHours(),
                    mm = _d.getMinutes(),
                    ss = _d.getSeconds()

                MM = MM > 9 ? MM : `0${MM}`
                DD = DD > 9 ? DD : `0${DD}`
                hh = hh > 9 ? hh : `0${hh}`
                mm = mm > 9 ? mm : `0${mm}`
                ss = ss > 9 ? ss : `0${ss}`

                // 需要使用replace方法来进行数据格式化
                // return `${yyyy}年${MM}月${DD}日 ${hh}时${mm}分${ss}秒`
                // return `${MM}-${DD} ${hh}:${mm}:${ss}`
                // let res = 'yyyy年MM月DD日 hh时mm分ss秒'.replace(/(yyyy)|(MM)|(DD)|(hh)|(mm)|(ss)/g, function(key) {
                // let res = 'yyyy-MM-DD hh时mm分ss秒'.replace(/(yyyy)|(MM)|(DD)|(hh)|(mm)|(ss)/g, function(key) {
                // let res = 'yyyy-MM-DD hh:mm:ss'.replace(/(yyyy)|(MM)|(DD)|(hh)|(mm)|(ss)/g, function(key) {
                return type.replace(/(yyyy)|(MM)|(DD)|(hh)|(mm)|(ss)/g, function(key) {
                    if (key === 'yyyy') return yyyy
                    if (key === 'MM') return MM
                    if (key === 'DD') return DD
                    if (key === 'hh') return hh
                    if (key === 'mm') return mm
                    if (key === 'ss') return ss
                })
                // return res
            },
            timeConfirm(val) {
                this.pageData.createTime = this.myDate(val, 'yyyy-MM-DD')
                this.timeShow = false
            },
            pickerEvent(item, type) {
                // 根据type不同，给不同的数据赋值
                if (type === 'project') {
                    this.pageData.projectId = item.id
                    this.pageData.projectName = item.name
                } else if (type === 'product') {
                    this.pageData.materialId = item.id
                    this.pageData.materialName = item.name
                } else if (type === 'supplier') {
                    this.pageData.supplierId = item.id
                    this.pageData.supplierName = item.name
                    this.pageData.supplierContact = item.contact
                    this.pageData.supplierPhone = item.phone
                } else if (type === 'user') {
                    this.selectUser = item
                }
                this.showDialog = false
            },
            pickerOpenEvt(type) {
                this.dialogType = type
                this.isDX = type === 'user'
                this.showDialog = true
            }
        }
    }
</script>

<style lang="less" scoped>
    .my-title {
        font-size: .75rem;
        color: #999;
        padding-left: 16px;
        margin: 10px 0;
    }
</style>