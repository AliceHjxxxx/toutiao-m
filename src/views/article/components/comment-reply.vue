<template>
  <div class="comment-reply">
    <van-nav-bar
      :title="
        comment.reply_count > 0
          ? `
        ${comment.reply_count}条回复`
          : '暂无回复'
      "
    >
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>
    <div class="scrop-wrap">
      <!-- 当前评论项 -->
      <comment-item :comment="comment" />

      <!-- 评论的回复列表 -->
      <van-cell :center="true">全部回复</van-cell>
      <comment-list :list="commentList" :source="comment.com_id" type="c" />
      <!--/评论的回复列表 -->
    </div>
    <!-- 底部区域 -->
    <div class="post-wrap">
      <van-button class="post-btn" size="small" round @click="isPostShow = true">写评论</van-button>
    </div>
    <!-- /底部区域 -->

    <!-- 发布评论 -->
    <van-popup v-model="isPostShow" position="bottom">
      <!--所以可以添加条件渲染内部组件  -->
      <comment-post :target="comment.com_id" @post-success="onPostSuccess" />
    </van-popup>
    <!-- /发布评论 -->
  </div>
</template>

<script>
import CommentItem from "./comment-item.vue"
import CommentList from "./comment-list.vue"
import CommentPost from "./comment-post.vue"

export default {
  name: "CommentReply",
  components: { CommentItem, CommentList, CommentPost },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isPostShow: false,
      commentList: [] //评论的回复列表
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onPostSuccess(data) {
      // 更新回复的数量
      this.comment.reply_count++
      this.isPostShow = false
      // 关闭弹层
      // 将最新的回复内容展示到列表顶部
      this.CommentList.unshift(data.new_obj)
    }
  }
}
</script>
<style scoped lang="less">
.comment-reply {
  .van-cell__value--alone {
    text-align: center;
  }
  .post-wrap {
    height: 88px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border-top: 1px solid #d8d8d8;
    .post-btn {
      width: 60%;
    }
  }
  .scroll-wrap {
    position: fixed;
    top: 92px;
    left: 0;
    right: 0;
    bottom: 88px;
    overflow-y: auto;
  }
}
</style>
