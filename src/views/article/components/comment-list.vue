<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    :error="error"
    error-text="加载失败，请点击重试"
    :immediate-check="false"
  >
    <comment-item
      v-for="(item, index) in list"
      @reply-click="$emit('reply-click', $evnet)"
      :key="index"
      :comment="item"
    />
  </van-list>
</template>

<script>
import { getComments } from "@/api/comment.js"
import CommentItem from "./comment-item.vue"
export default {
  name: "CommentList",
  components: { CommentItem },
  props: {
    source: {
      type: [String, Number, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      // 自定义prop数据验证
      validator(value) {
        return ["a", "c"].includes(value) //value必须包含在数组中，这里返回布尔值，布尔值通关就验证成功,否则会报错
      },
      default: "a"
    }
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, //获取下一页的标记，起始数据的前一个数据
      limit: 10,
      error: false
    }
  },
  created() {
    // 当你手动Onload的话，它不会自动开始初始的loading，所以需手动开启初始loading
    this.loading = true
    this.onLoad()
  },
  mounted() {},
  methods: {
    // List在可视范围内才会调用onLoad
    async onLoad() {
      // 获取文章的评论或获取评论的回复是同一个接口
      // 1、请求获取数据
      try {
        const { data } = await getComments({
          type: "a", //评论类型
          source: this.source.toString(), //源Id
          offset: this.offset, //获取评论数据的偏移量
          limit: this.limit
        })
        console.log(data)
        // 2、将数据添加到列表中
        const { results } = data.data
        this.list.push(...results)

        // 3、将loading设置为false
        this.loading = false
        // 把文章的总数量传递到外部
        this.$emit("onload-success", data.data)
        // 4、判断为否还有数据
        if (results.length) {
          // 有就更新获取下一页的数据页面
          this.offset = results.last_id
        } else {
          // 没有就将finished设置结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
        console.log(err)
      }
    }
  },
  computed: {}
}
</script>

<style></style>
