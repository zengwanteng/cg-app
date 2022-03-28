<template>
    <div class="page-layout-container">
        <header>
            <i v-if="showHome" @click="$router.push('/home')"></i>
            <i v-if="showBack" @click="$router.go(-1)" class="back"></i>
            <span>{{text}}</span>
            <i v-if="showNew" @click="$emit('btnEvt')" class="new"></i>
        </header>
        <article>
            <slot/>
        </article>
    </div>
</template>

<script>
    export default {
        props: {
            text: {
                type: String,
                required: true
            },

            showHome: {
                type: Boolean,
                default: true
            },

            showBack: {
                type: Boolean,
                default: false
            },

            showNew: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../style/common.less";

    .page-layout-container {
        display: block;
        position: relative;
        height: 100%;

        > header {
            position: relative;
            height: 48px;
            padding: 8px;
            background: @primary;
            .clear();
            span {
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 48px;
                font-size: 1rem;
                line-height: 48px;
                text-align: center;
                color: #fff;
                z-index: 1;
            }
            i {
                float: left;
                position: relative;
                width: 38px;
                height: 32px;
                background: url(../images/home.png) center center / 28px 28px no-repeat;
                &.back {
                    background-image: url(../images/back.png);
                }
                &.new {
                    float: right;
                    background-image: url(../images/add-icon.png);
                }
                z-index: 5;
            }
        }

        > article {
            display: block;
            position: relative;
            height: calc(100% - 48px);
            overflow-x: hidden;
        }
    }
</style>