<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form action="/" class="search-form">
      <!-- form标签是在移动端专门用来在键盘里显示搜索那个按钮的 -->
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        background="#3296fa"
        @focus="isResultShow = false"
      />
    </form>
    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :search-text="searchText"></search-result>
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    ></search-suggestion>
    <!-- /联想建议 -->
    <!-- 搜索历史记录 -->
    <search-history
      v-else
      :search-histories="searchHistories"
      @clear-search-histories="searchHistories = []"
      @search="onSearch"
    ></search-history>
    <!-- /搜索历史记录 -->
  </div>
</template>
<script>
import SearchHistory from "./component/search-history.vue"
import SearchSuggestion from "./component/search-suggestion.vue"
import SearchResult from "./component/search-result.vue"
import { setItem, getItem } from "@/utils/storage.js"
export default {
  name: "SearchIndex",
  components: { SearchHistory, SearchSuggestion, SearchResult },
  props: { SearchHistory, SearchSuggestion, SearchResult },
  data() {
    return {
      searchText: "",
      isResultShow: false, //控制搜索结果的展示
      searchHistories: getItem("TOUTIAO_SEARCHHISTORIES") || [] //获取本地存储数据
    }
  },
  computed: {},
  watch: {
    searchHistories: {
      handler(val) {
        setItem("TOUTIAO_SEARCHHISTORIES", val)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    onSearch(val) {
      this.searchText = val
      // 展示搜索结果
      this.isResultShow = true
      // 要求不要有重复历史记录
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      //unshift安插在最前面
      this.searchHistories.unshift(val)
    },
    onCancel() {
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
.search-container {
  margin-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1;
  }
}
</style>
