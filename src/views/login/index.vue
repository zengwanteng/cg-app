<template>
    <div class="login-container">
        <div v-if="!showLogin" class="wel-container">
            <div class="title">
                <span>凌动智能采购系统</span>
                <em>{{welText}}</em>
            </div>
            <!-- 在组件上添加的事件不再是组件的原生事件，需要使用修饰符：'.native' -->
            <van-circle v-model="currentRate"
                @click.native="closeWelcome"
                :rate="100"
                :clockwise="false"
                :text="`${Math.ceil(currentRate/20)}s`"/>
        </div>
        <div class="wel-container login" v-else>
            <span class="login-title">凌动智能采购系统</span>
            <div class="login-item">
                <!-- {phone: this.phone, vdtCode: this.vdtCode} => loginObj = {Phone, vdtCode} -->
                <input type="text" v-model="loginObj.phone" placeholder="输入登录手机号"/>
            </div>
            <div class="login-item">
                <input type="text" v-model="loginObj.vdtCode" placeholder="输入登录手机号"/>
                <span @click="getVdtCodeEvt">{{codeText}}</span>
            </div>
            <van-checkbox v-model="remember" checked-color="#ff5513">记住密码？</van-checkbox> 
            <van-checkbox v-model="auto" checked-color="#ff5513">七天免登录？</van-checkbox>    
            <van-button @click="loginEvt" type="primary" block color="#ff5513">登录</van-button>        
        </div>

        <div class="right-info">&copy; 2021- 龙腾集团 copy right</div>
    </div>
</template>

<script>
    import { autoLoginApi, loginApi, userInfoApi, userRoleApi, vdtCodeApi } from '../../apis/userApi'

    export default {
        data() {
            return {
                currentRate: 0,
                showLogin: false,
                loopTimer: null,
                // 自动登录业务是否已经完成，如果完成了，用户可以点击按钮跳转欢迎页面
                // init 是初始化的值，如果为init用户不能进行点击，home 执行路由跳转到首页，login展示登录页面
                autoFinish: 'init',
                remember: false,
                auto: false,
                loginObj: {
                    phone: '',
                    vdtCode: ''
                },
                codeText: '获取验证码',
                welText: [
                    '渐寒 揣着喜庆的年',
                    '情迷 有巧克力芬芳',
                    '微暖 花出豆蔻意浅',
                    '鹅黄 林徽因的晴天',
                    '初夏 送了春的婉转',
                    '离殇 一曲青春飞扬',
                    '炎炎 宛若你的张狂',
                    '芬芳 桂花羹与蜜糖',
                    '旖旎 谁与谁的迷藏',
                    '枫红 灼了彷徨的眼',
                    '寒入 思念如雪飞扬',
                    '弥彰 假装遗忘的慌'
                ][new Date().getMonth()]
            }
        },

        async created() {

            // 读取自动登录标识，如果存在--需要对token进行缓存，然后发起请求
            let autoToken = localStorage.getItem('auto-token'),
                rememberPhone = localStorage.getItem('remember-phone')

            this.remember = !!rememberPhone

            if (!!autoToken) {
                this.$store.commit('common/mutationToken', autoToken)
                let result = await autoLoginApi()
                console.log(result)
                // 如果免登录成功以后，倒计时完成或则用户点击按钮，可以直接进入首页，如果没有成功，则停留在登录页面
                if (result.code === 200) {
                    // 缓存用户信息
                    this.$store.commit('common/mutationUserInfo', result.data)
                    this.getUserRights(result.data.role)
                    this.autoFinish = 'home'
                } else {
                    this.autoFinish = 'login'
                    // 如果由记住手机号，需要给loginObj.phone赋值
                if (!!rememberPhone) this.loginObj.phone = rememberPhone
                }
            } else {
                // 当用户点击按钮的时候，展示登录页面
                this.autoFinish = 'login'
                // 如果由记住手机号，需要给loginObj.phone赋值
                if (!!rememberPhone) this.loginObj.phone = rememberPhone
            }

            this.loop()
        },

        methods: {
            async loginEvt() {

                // 校验手机号
                if (!/^1[3-9]{1}[0-9]{9}$/.test(this.loginObj.phone)) {
                    this.$toast({
                            message: '手机号码输入错误',
                            position: 'bottom',
                        })
                    return
                }

                // 校验验证码
                if (!/^[0-9]{4}$/.test(this.loginObj.vdtCode)) {
                    this.$toast({
                            message: '验证码输入错误',
                            position: 'bottom',
                        })
                    return
                }

                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0
                })

                let result = await loginApi(this.loginObj)

                this.$toast.clear()
                // 因为这里是处理失败的结果，可以是return终止业务
                if (result.code !== 200) {
                    this.$toast.fail('登录失败，原因：' + result.message)
                    return
                }

                // 登录成功 -- 缓存token
                this.$store.commit('common/mutationToken', result.data.token)

                // 判断是否有记住手机后？
                if (this.remember) {
                    localStorage.setItem('remember-phone', this.loginObj.phone)
                } else {
                    localStorage.removeItem('remember-phone')
                }

                // 判断是否有免登录？
                if (this.auto) {
                    localStorage.setItem('auto-token', result.data.token)
                } else {
                    localStorage.removeItem('auto-token')
                }

                // 获取当前登录用户信息，并进行vuex缓存
                let userInfo = await userInfoApi(result.data.id)

                if (userInfo.code === 200) {
                    this.$store.commit('common/mutationUserInfo', userInfo.data)
                }

                // 获取用户角色权限信息
                this.getUserRights(userInfo.data.role)

                this.$router.push('/home')
            },

            loop() {
                this.loopTimer = setTimeout(() => {
                    this.currentRate -= 1
                    if (this.currentRate > 0) {
                        this.loop()
                    } else {
                        // 执行页面的跳转业务
                        if (this.autoFinish === 'login') {
                            this.showLogin = true
                        } else {
                            this.$router.push('/home')
                        }
                    }
                }, 50)
            },

            closeWelcome() {
                clearTimeout(this.loopTimer)
                if (this.autoFinish === 'login') {
                    this.showLogin = true
                } else {
                    this.$router.push('/home')
                }
            },

            async getVdtCodeEvt() {
                // 实现节流，如果已经获取验证码，就不要继续执行业务
                if (this.codeText !== '获取验证码') return

                // 校验手机号
                if (!/^1[3-9]{1}[0-9]{9}$/.test(this.loginObj.phone)) {
                    this.$toast({
                            message: '手机号码输入错误',
                            position: 'bottom',
                        })
                    return
                }

                // 如果可以获取验证码，应该设置codeText，实现节流
                this.codeText = '重新获取(5s)'

                let result = await vdtCodeApi(this.loginObj.phone)
                if (result.code === 200) {
                    this.$toast.success(`验证码：${result.data.vdtCode}`)
                    this.loopCode(Date.now())
                } else {
                    this.codeText = '获取验证码'
                }
            },

            loopCode(st) {
                setTimeout(() => {
                    let dt = 5 - Math.floor((Date.now() - st) / 1000)
                    if (dt > 0) {
                        this.codeText = `重新获取(${dt}s)`
                        this.loopCode(st)
                    } else {
                        this.codeText = '获取验证码'
                    }
                }, 100)
            },

            // 获取用户角色权限方法
            async getUserRights(ids) {
                let result = await userRoleApi(ids)
                if (result.code === 200) {
                    this.$store.commit('common/mutationRights', result.data)
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "./index.less";
</style>