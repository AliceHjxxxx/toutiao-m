<template>
  <div class="article-list">
    <!--
      List 列表组件：瀑布流滚动加载，用于展示长列表。

      List 组件通过 loading 和 finished 两个变量控制加载状态，
      当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 自动设置成 true，此时可以发起异步操作并更新数据，
      数据更新完毕后，将 loading 设置成 false 即可。
      若数据已全部加载完毕，则直接将 finished 设置成 true 即可。

      - load 事件：
        + List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
        + 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。

      - loading 属性：控制加载中的 loading 状态
        + 非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
        + 加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件

      - finished 属性：控制加载结束的状态
        + 在每次请求完毕后，需要手动将 loading 设置为 false，表示本次加载结束
        + 所有数据加载结束，finished 为 true，此时不会触发 load 事件
     -->
    <van-pull-refresh
      v-model="isFreshLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration="1000"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <article-item v-for="(article, index) in list" :key="index" :article="article" />
        <!-- <van-cell v-for="(article, index) in list" :key="index" :title="article.title" /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { getArticles } from "@/api/article.js"
import ArticleItem from "@/components/article-item/index.vue"
export default {
  name: "ArticleList",
  components: { ArticleItem },
  props: {
    channel: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      list: [], //存储列表数据的数组
      loading: false, //控制加载中Loadding的作用
      finished: false, //控制数据加载结束的状态
      timestamp: null,
      error: false,
      refreshSuccessText: "刷新成功",

      isFreshLoading: false //控制下拉刷新的状态
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 初始化或者滚动到底部的时候会触发Unload
    // onLoad() {
    //   // 异步更新数据
    //   // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    //   setTimeout(() => {
    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1)
    //     }

    //     // 3. 本次数据加载结束之后要把加载状态设置为结束
    //     //     loading 关闭以后才能触发下一次的加载更多
    //     // 加载状态结束
    //     this.loading = false

    //     // 数据全部加载完成
    //     if (this.list.length >= 40) {
    //          // 如果没有数据了，把 finished 设置为 true，之后不再触发加载更多
    //       this.finished = true
    //     }
    //   }, 1000)
    // }

    async onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, //频道Id
          timestamp: this.timestamp || Date.now(), //时间戳，简单理解就是请求数据的页码,
          // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          with_top: 1 //是否包含置顶文章,进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        // console.log(data.data)
        const { results } = data.data
        this.list.push(...results) //数组的展开操作符，它会把数组元素一个一个拿出来
        // 3. 本次数据加载结束之后要把加载状态设置为结束
        //     loading 关闭以后才能触发下一次的加载更多
        // 加载状态结束
        this.loading = false
        // 数据全部加载完成
        if (results.length) {
          this.timestamp = data.data.pre_timestamp
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }

      // 如果没有数据了，把 finished 设置为 true，之后不再触发加载更多
    },
    async onRefresh() {
      // 1. 请求获取数据
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, //频道Id
          timestamp: Date.now(), //时间戳，简单理解就是请求数据的页码,
          //下拉刷新每次都应该获取最新数据
          with_top: 1 //是否包含置顶文章,进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        // 随机模拟失败情况
        // if (Math.random() > 0.5) {
        //   JSON.parse("sfdsfdsfdsfdsf")
        // }
        const { results } = data.data
        this.list.unshift(...results)
        this.isFreshLoading = false
        // 提示成功
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        this.refreshSuccessText = "刷新失败"
        this.isFreshLoading = false // 关闭下拉刷新的 loading 状态
      }
      // 2. 将数据追加到列表的顶部
      // 3. 关闭下拉刷新的 loading 状态
    }
  }
}
</script>
<style lang="less" scoped>
.article-list {
  height: 80vh;
  overflow-y: auto;
}
</style>
