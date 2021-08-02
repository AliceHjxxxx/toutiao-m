<template>
  <van-button
    v-if="isFollowed"
    class="follow-btn"
    round
    size="small"
    :loading="loading"
    @click="onFollow()"
    >已关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    :loading="loading"
    round
    size="small"
    icon="plus"
    @click="onFollow()"
    >关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from "@/api/article"
export default {
  name: "FollowUser",
  components: {},
  model: {
    prop: "isFollowed",
    event: "update-is_followed"
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return { loading: false }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onFollow() {
      this.loading = true //展示关注按钮的loadding状态
      try {
        if (this.isFollowed) {
          //已关注取消关注
          await deleteFollow(this.userId)
        } else {
          // 没有关注
          await addFollow(this.userId)
        }
        // this.isFollowed = !this.isFollowed
        this.$emit("update-is_followed", !this.isFollowed)
        //   this.$emit("input", !this.value)
      } catch (err) {
        let message = "操作失败，请重试"
        if (err.response && err.response.status === 400) {
          message = "你不能关注你自己"
        }
        console.log(err)
        this.$toast(message)
      }
      this.loading = false
    }
  }
}
</script>

<style></style>
