<template>
  <van-icon
    :name="value ? 'star' : 'star-o'"
    :loading="loading"
    @click="onCollect"
    :class="{ collected: value }"
  />
</template>

<script>
import { addCollect, deleteCollect } from "@/api/article"
export default {
  name: "CollectArticle",
  components: {},
  props: {
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return { loading: false }
  },
  computed: {},
  created() {},
  methods: {
    async onCollect() {
      this.loading = true
      try {
        if (this.value) {
          await deleteCollect(this.articleId)
        } else {
          await addCollect(this.articleId)
        }
        // 视图更新
        this.$emit("input", !this.value)
        this.$toast.success(!this.value ? "收藏成功" : "取消收藏")
      } catch (err) {
        console.log(err)
        this.$toast.fail("操作失败，请重试！")
      }

      this.loading = false
    }
  },
  mounted() {}
}
</script>

<style scoped lang="less">
.collected {
  color: #ffa500 !important;
}
</style>
