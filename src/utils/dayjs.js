import Vue from "vue"
import dayjs from "dayjs"
// dayjs默认语言为英文，默认为中文
// 加载中文语言包
import "dayjs/locale/zh-cn"

import relativeTime from "dayjs/plugin/relativeTime"
// 配置使用中文语言包
dayjs.locale("zh-cn")

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)
    // 定义一个全局过滤器，其实过滤器就是一个全局可用的方法，但必须在模板中使用
    //参数1：过滤器名称
    //参数2：过滤器函数
    //使用方法:{{表达式|过滤器名称}}
Vue.filter("relativeTime", value => {
    // return dayjs().to(dayjs(value))
    return dayjs().format("YYYY-MM-DD")
})