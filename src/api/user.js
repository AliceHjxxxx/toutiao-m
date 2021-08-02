// 用户相关请求模块
// import store from "@/store/index.js"
/**
 * 1、接口重用
 * 2、接口维护
 * 实际开发过程中，接口经常容易变化，
 * 你能记住你在哪里请求了这个接口吗？很难记住
 * 怎么办呢？
 *  我们单独的把接口请求的代码封装起来，统一的放到一起。
 * 放到哪里呢？
 *  我们放到项目的 api 目录中，
 *  根据接口的种类进行归类管理
 *  例如用户相关的接口放到 user.js 中
 *      文章相关的接口放到 article.js 中
 * 如何封装呢？
 *  一个函数，接收参数，返回请求结果就可以了。
 * 用户接口相关请求模块
 */
import request from "@/utils/request"
export const login = data => {
        return request({
            method: "POST",
            url: "/app/v1_0/authorizations",
            data
        })
    }
    // 发送验证码 注意：每手机号每分钟一次
export const sendSms = mobile => {
    return request({
        method: "GET",
        url: `/app/v1_0/sms/codes/${mobile}`
    })
}
export const getUserInfo = () => {
        return request({
            method: "GET",
            url: "/app/v1_0/user"
                // headers: {
                //     // 注意：该接口需要授权才能访问
                //     //       token的数据格式：Bearer token数据，注意 Bearer 后面有个空格
                //     Authorization: `Bearer ${store.state.user.token}`
                // }
        })
    }
    // 获取频道列表
export const getUserChannels = () => {
        return request({
            method: "GET",
            url: "/app/v1_0/user/channels"
        })
    }
    // 获取当前用户资料
export const getUserProfile = () => {
        return request({
            method: "GET",
            url: "/app/v1_0/user/profile"
        })
    }
    // 编辑用户个人资料
export const updateUserProfile = () => {
    return request({
        method: "PATCH",
        url: "/app/v1_0/user/profile"
    })
}

/**
 * 更新用户照片资料
 */
export const updateUserPhoto = data => {
    return request({
        method: "PATCH",
        url: "/app/v1_0/user/photo",
        data
    })
}