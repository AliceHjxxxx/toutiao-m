// 请求模块
import axios from "axios"
import store from "@/store/index.js"
import JSONBig from "json-bigint"
//JSONBig.parse() //把JSON格式的字符串转化城JavaScript对象
//JSONBig.stringify()//把JavaScript对象转化为JSON格式的字符串

// const jsonStr = '{ "art_id": 1245953273786007552 }'
//console.log(JSON.parse(jsonStr))1245953273786007600
// JSON.stringify()

// JSONBig 可以处理数据中超出 JavaScript 安全整数范围的问题
//console.log(JSONBig.parse(jsonStr))   把 JSON 格式的字符串转为 JavaScript 对象

// 使用的时候需要把 BigNumber 类型的数据转为字符串来使用
//console.log(JSONBig.parse(jsonStr).art_id.toString()) 1245953273786007552

const request = axios.create({
    baseURL: "http://ttapi.research.itcast.cn/", // 基础路径
    //自定义后端返回的原始数据
    //data:后算返回的原始数据，说白了就是JSON格式的字符串
    transformResponse: [
        function(data) {
            try {
                // 如果转换成功则返回转换的数据结果
                return JSONBig.parse(data)
            } catch (err) {
                return data
            }
        }
    ]
})
request.interceptors.request.use(
    function(config) {
        // 请求发起会经过这里
        // config:本次请求配置对象
        // config 里面有一个属性：headers
        const { user } = store.state
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`
        }
        // 这里务必要返回config配置对象，否则请求就停在这出不去，这是一放行标记
        return config
    },
    function(error) {
        // 如果请求出错了会进入这里
        return Promise.reject(error)
    }
)
export default request