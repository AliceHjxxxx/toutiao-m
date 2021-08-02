import request from "@/utils/request"
// 请求获取文章列表数据
export const getArticles = params => {
    return request({
        method: "GET",
        url: "/app/v1_1/articles",
        params
    })
}
export const getArticlesById = articleId => {
        return request({
            method: "GET",
            url: `/app/v1_0/articles/${articleId}`
        })
    }
    // 关注用户
export const addFollow = target => {
        return request({
            method: "POST",
            url: "/app/v1_0/user/followings",
            data: {
                target
            }
        })
    }
    // 删除关注用户
export const deleteFollow = userId => {
        return request({
            method: "DELETE",
            url: `/app/v1_0/user/followings/${userId}`
        })
    }
    // 收藏文章
export const addCollect = target => {
        return request({
            method: "POST",
            url: "/app/v1_0/article/collections",
            data: {
                target
            }
        })
    }
    // 取消收藏文章
export const deleteCollect = target => {
        return request({
            method: "DELETE",
            url: `/app/v1_0/article/collections/${target}`
        })
    }
    /**
     * 点赞
     */
export const addLike = articleId => {
    return request({
        method: "POST",
        url: "/app/v1_0/article/likings",
        data: {
            target: articleId
        }
    })
}

/**
 * 取消点赞
 */
export const deleteLike = articleId => {
    return request({
        method: "DELETE",
        url: `/app/v1_0/article/likings/${articleId}`
    })
}