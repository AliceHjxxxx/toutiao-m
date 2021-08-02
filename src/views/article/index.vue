<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="黑马头条"></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image class="avatar" slot="icon" round fit="cover" :src="article.aut_photo" />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">{{ article.pubdate | relativeTime }}</div>

          <!-- 模板中得$event是事件参数
          当我们传递给子组件得数据既要使用还要修改
          传递：props
          :is-followed="article.is_followed"
          修改：自定义事件
               @update-is_followed="article.is_followed = $event"
          简写方式：在组件上使用v-model语法等于下面两句
          value="article.is_followed"
          @input=" @update-is_followed== $event"
          如果需要修改v-model名称得规则，可以通过子组件model属性改

每个组件只能使用一次v-model

          如果有多个数据需要实现类似于v-model的效果，可以使用属性得.sync修饰符
           -->
          <follow-user
            :is-followed="article.is_followed"
            class="follow-btn"
            :user-id="article.aut_id"
            v-model="article.is_followed"
          />
          <!-- <van-button
            v-if="article.is_followed"
            class="follow-btn"
            round
            size="small"
            :loading="followLoading"
            @click="onFollow()"
            >已关注</van-button
          >
          <van-button
            v-else
            class="follow-btn"
            type="info"
            color="#3296fa"
            :loading="followLoading"
            round
            size="small"
            icon="plus"
            @click="onFollow()"
            >关注</van-button
          > -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章的评论列表 -->
        <comment-list
          :list="commentList"
          :source="article.art_id"
          @onload-success="totalCommentCount = $event.total_count"
          @relpy-click="onReplyClick"
        />
        <!--/ 文章的评论列表 -->

        <!-- 底部区域 -->
        <!-- 只有当文章信心加载结束，有数据了才能渲染底部信息 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostshow = true"
            >写评论</van-button
          >
          <van-icon name="comment-o" :info="totalCommentCount" color="#777" />
          <!-- <van-icon color="#777" name="star-o" /> -->
          <collect-article
            class="btn-item"
            :article-id="article.art_id"
            v-model="article.is_collected"
          />
          <like-article class="btn-item" :article-id="article.art_id" v-model="article.attitude" />
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->

        <!-- 发布评论 -->
        <van-popup v-model="isPostshow" position="bottom"
          ><comment-post :target="article.art_id" @post-success="onPostSuccess"
        /></van-popup>
      </div>
      <!-- /发布评论 -->

      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errorStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!--评论回复  -->

    <!-- 弹出层是懒渲染的，只有第一次才会渲染里面的内容，之后的渲染都是在简单的切换与隐藏 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height:90%">
      <!--所以可以添加条件渲染内部组件  -->
      <comment-reply v-if="isReplyShow" :comment="currentComment" @close="isReplyShow = false" />
    </van-popup>
    <!--/评论回复  -->
  </div>
</template>

<script>
import { getArticlesById } from "@/api/article"
import { ImagePreview } from "vant"
import FollowUser from "@/components/follow-user/index.vue"
import CollectArticle from "@/components/collect-article/index.vue"
import LikeArticle from "@/components/like-article/index.vue"
import CommentList from "./components/comment-list.vue"
import CommentPost from "./components/comment-post.vue"
import CommentReply from "./components/comment-reply.vue"
export default {
  name: "ArticleIndex",
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  // 给所有的后代组件提供数据
  provide: function() {
    return {
      articleId: this.articleId
    }
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      article: {},
      loading: true,
      errorStatus: 0,
      followLoading: false,
      totalCommentCount: 0,
      isPostshow: false, //控制发布评论的显示状态
      commentList: [],
      isReplyShow: true,
      currentComment: {} //当前点击回复的评论项
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle()
  },
  mounted() {},
  methods: {
    async loadArticle() {
      // 展示loading加载中
      this.loading = true
      try {
        const { data } = await getArticlesById(this.articleId)
        // 数驱动视图 这件事不是立即的
        this.article = data.data
        // console.log(data.data)
        // 初始化图片点击预览
        //
        setTimeout(() => {
          // console.log(this.$refs["article-content"])
          this.previewImage()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errorStatus = 404
        }
        console.log(err)
      }
      this.loading = false //请求结束后，关闭loading
    },
    previewImage() {
      //得到多有的IMG节点
      const articleContent = this.$refs["article-content"]
      const imgs = articleContent.querySelectorAll("img")
      const images = []
      imgs.forEach((img, index) => {
        // 获取所有img地址
        images.push(img.src)
        //  给所有图片添加点事件
        img.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images,
            //起始位置,从0开始
            startPosition: index
          })
        }
      })
      // console.log(images)
    },
    onPostSuccess(data) {
      // 关闭弹层
      this.isPostshow = false
      // 将最新评论显示到顶部
      this.commentList.unshift(data.new_obj)
    },
    onReplyClick(comment) {
      console.log(comment)
      this.currentComment = comment

      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      // font-size: 30px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/.van-icon {
      font-size: 40px;
      color: #777;

      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
