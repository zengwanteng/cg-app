<template>
    <page-layout text="采购订单详情" :showBack="true" :showHome="false">
        <span class="line">采购项目：<em>{{pageData.projectName}}</em></span>
        <span class="line">状态：<em>{{pageData.state}}</em></span>
        <span class="line">负责人：<em>{{pageData.createName}}</em></span>
        <span class="line">采购日期：<em>{{pageData.createTime | dateFormat('yyyy年MM月DD日')}}</em></span>
        <span class="line">采购材料：<em>{{pageData.materialName}}</em></span>
        <span class="line">采购数量：<em>{{pageData.materialWeight + pageData.materialUnit}}</em></span>
        <span class="line">供应商：<em>{{pageData.supplierName}}</em></span>
        <span class="line">联系人：<em>{{pageData.supplierContact}}</em></span>
        <span class="line">联系电话：<em>{{pageData.supplierPhone}}</em></span>
        <span class="line">流程：</span>
        <van-steps v-if="!!pageData.remark" direction="vertical" :active="pageData.remark.length - 1" active-color="#ff5513">
            <van-step v-for="item in pageData.remark" :key="item.time">
                <span>【{{item.userName}}】{{item.time | dateFormat('yyyy年MM月DD日')}}</span>
                <p>{{item.remark || "这个人比较懒，没有备注！"}}</p>
            </van-step>
        </van-steps>
    </page-layout>
</template>

<script>
    import { purchaseInfoApi } from '../../apis/purchaseApi'
    export default {
        data() {
            return {
                pageData: {}
            }
        },
        async created() {
            let id = this.$route.query.id
            let result = await purchaseInfoApi(id)
            if (result.code === 200) this.pageData = result.data
        }
    }
</script>

<style lang="less" scoped>
    .line {
        display: block;
        font-size: .7rem;
        padding: 6px 12px;
        color: #888;
        em {
            color: #333;
            font-style: normal;
        }
    }

    .van-steps {
        background-color: transparent;
        span {
            display: block;
            font-size: 0.8rem;
            color: #ff5513;
            margin: 3px 0 0 -7px;
        }
        p {
            color: #ff5513;
        }
    }
</style>