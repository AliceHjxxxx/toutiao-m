<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(text, index) in suggestions"
      :key="index"
      icon="search"
      @click="$emit('search', text)"
    >
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
    <!-- 双花括号绑定会直接输出纯文本内容 -->
    <!-- 如果使用v-html指令可以绑定渲染带有HTML标签的字符串 -->
    <!-- <div v-html="htmlStr"></div> -->
  </div>
</template>
<script>
import { getSearchSuggestion } from "@/api/search.js"
// 按需加载有好处
import { debounce } from "lodash"
export default {
  name: "SearchSuggestion",
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggestions: [] //联想建议列表
      // htmlStr: `Hello<span style="color:red">word</span>`
    }
  },
  computed: {},
  watch: {
    // 当searchText发生改变就会调用handler函数
    // 注意：handler函数名称是固定的
    // debounce函数，参数1：一个函数，参数2：延迟时间，返回值：防抖之后的函数
    //意思就是无论输入多少，只有停下来200毫秒后才会触发
    searchText: {
      handler: debounce(function(value) {
        this.loadSearchSuggestion(value)
      }, 100),
      // handler(value) {
      //   this.loadSearchSuggestion()
      // },
      immediate: true //该回调会在侦听开始之后立即调用
    }
  },
  created() {},
  mounted() {},
  methods: {
    async loadSearchSuggestion(q) {
      try {
        const { data } = await getSearchSuggestion(q)
        console.log(data)
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast("获取数据失败，请稍后尝试")
      }
    },
    highlight(text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      // style="color:red"
      // 正则表达式//中间得内容都会当作匹配字符来使用而不是变量
      // 如果需要根据数据变量动态创建动态正则表达式，则手动new RegExp
      //  RegExp 正则表达式原生构造函数
      // 参数1：匹配模式，它会根据这个字符串创建正则对象
      // 参数2：匹配模式，要写到字符串中
      const reg = new RegExp(this.searchText, "gi")
      return text.replace(reg, highlightStr)
    }
  }
}
</script>
<style lang="less" scoped>
.search-suggestion {
  /deep/ span {
    .active {
      color: #3296fa;
    }
  }
}
</style>
