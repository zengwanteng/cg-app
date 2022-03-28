import PageLayout from './PageLayout'

// 开发一个对象插件
const plugin = {
    // 在对象中必须包含一个方法，这个方法的名字叫install，这个方法会入参一个VueContructor
    install: function(Vue) {
        // 注册全局组件
        Vue.component('PageLayout', PageLayout)

        // 注册全局过滤器
        // 全局过滤器定义，第一个参数为过滤器名字，第二个参数为过滤器实现方法
        Vue.filter('dateFormat', function(val, type) {
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
        })

        // 全局指令的注册
        // 全局指令定义，第一个参数为指令名字，第二个参数为指令实现方法(或则指令的实现对象)
        Vue.directive("mytext", function(el, bindData) {
            console.log(bindData)
            let val = bindData.value

            // 如果需要对dom进行操作，可以使用原生方法来实现
            el.innerText = '签订日期：' + val

            // 可以通过bindData获取到在指令上添加的参数
            el.style.color = bindData.arg

            // 可以通过bindData来获取数据
            if (bindData.modifiers['18']) el.style.fontSize = `${18}px`
            if (bindData.modifiers.bold) el.style.fontWeight = 'bold'
        })
    }
}

export default plugin