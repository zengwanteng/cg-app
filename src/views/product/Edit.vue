<template>
    <div>
        材料编辑页面
        <p>
            <button @click="backEvt">返回</button>
        </p>
    </div>
</template>

<script>
    export default {
        methods: {
            backEvt() {
                this.$router.push('/home')
            }
        },

        beforeRouteLeave(to, from, next) {
            let flag = confirm('确定要放弃本页面的编辑内容？')
            if (flag) {
                next()
            }
        }
    }
</script>