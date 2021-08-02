<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
    >
      <van-cell v-for="(article, index) in list" :key="index" :title="article.title" error />
    </van-list>
  </div>
</template>
<script>
import { getSearchResult } from "@/api/search"
export default {
  name: "SearchResult",
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      pre_page: 10,
      error: false //展示加载失败状态
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      try {
        // 1. 请求获取数据
        const { data } = await getSearchResult({
          page: this.page, //页码
          pre_page: this.pre_page, //每页大小
          q: this.searchText
        })
        // 2. 将数据添加到列表中
        const { results } = data.data
        this.list.push(...results)
        // 3. 设置加载状态结束
        this.loading = false
        // 4. 判断数据是否加载完毕
        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
        console.log(data)
      } catch (err) {
        this.error = true
        this.loading = false
        this.$toast("数据获取失败，请稍后重试")
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
