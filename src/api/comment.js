// 评论请求
import request from "@/utils/request"

// 获取评论列表
export const getComments = params => {
        return request({
            methods: "GET",
            // GET参数使用params进行传递
            // 我们写的时候是对象，但是最终发给后端的数据是？
            // axios会把Param对象转为key=value?key=value的格式放到url中，拼接会自动添加引号

            url: "/app/v1_0/comments",
            params
        })
    }
    // 评论点赞
export const addCommentLike = target => {
        return request({
            methods: "POST",
            url: "/app/v1_0/article/likings",
            data: { target }
        })
    }
    // 取消点赞
export const deleteCommentLike = commentId => {
        return request({
            methods: "DELETE",
            url: `/app/v1_0/comment/likings/${commentId}`
        })
    }
    // 发布文章评论或评论的回复
export const addComment = data => {
    return request({
        methods: "POST",

        url: "/app/v1_0/comments",
        data
    })
}