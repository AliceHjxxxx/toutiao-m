<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('clear-search-histories', [])">全部删除</span>&nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isDeleteShow = true" />
    </van-cell>
    <van-cell
      v-for="(item, index) in searchHistories"
      :key="index"
      :title="item"
      @click="onSearchItemClick(item, index)"
    >
      <van-icon v-if="isDeleteShow" name="close" />
    </van-cell>
  </div>
</template>
<script>
export default {
  name: "SearchHistory",
  components: {},
  props: {
    //props数据
    //如果是普通数据（数据，字符串，布尔值）绝对不能修改，即便改了也不会传给父组件

    // 如果是引用类数据（数组，对象）
    // 可以修改里面的数据，例如[]push ,但不能重新赋值XXX=[]
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data() {
    return { isDeleteShow: false }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onSearchItemClick(item, index) {
      if (this.isDeleteShow) {
        // 删除状态下
        this.searchHistories.splice(index, 1)
      } else {
        //非删除状态,直接进入搜索
        this.$emit("search", item)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.search-history {
}
</style>
