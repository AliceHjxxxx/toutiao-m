<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        slot="title"
        to="/search"
        type="info"
        size="small"
        round
        icon="search"
        class="search-btn"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 频道列表 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
        <article-list :channel="channel"
      /></van-tab>
      <!-- 文章列表 -->

      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="humberger-btn" @click="isChannelEditShow = true">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <channel-edit
        :my-channels="channels"
        @updata-active="onUpdateActive"
        :active="active"
      ></channel-edit
    ></van-popup>
  </div>
</template>
<script>
import { getUserChannels } from "@/api/user.js"
import ArticleList from "./components/article-list.vue"
import ChannelEdit from "./components/channel-edit.vue"
import { mapState } from "vuex"
import { getItem } from "@/utils/storage.js"
export default {
  name: "HomeIndex",
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data() {
    return {
      active: 0, //控制被激活的标签
      channels: [], //频道列表
      isChannelEditShow: false //控制编辑频道弹出层的展示状态
    }
  },
  computed: {
    ...mapState(["user"])
  },
  watch: {},
  created() {
    this.loadChannels()
  },
  mounted() {},
  methods: {
    async loadChannels() {
      try {
        let channels = []
        if (this.user) {
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          const localChannels = getItem("TOUTIAO_CHANNELS")
          if (localChannels) {
            channels = localChannels
          } else {
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      } catch (err) {}
    },
    onUpdateActive(index, isChannelEditShow = true) {
      console.log("home", index)
      this.active = index
      this.isChannelEditShow = isChannelEditShow
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/ .van-nav-bar__title {
    max-width: unset !important;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px !important;
    }
  }
  /deep/.channel-tabs {
    .van-tabs__wrap {
      height: 82px;
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
    }
    .van-tab {
      border-right: 1px solid #edeff5;
      min-width: 200px;
      font-size: 30px;
      color: #777;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__nav {
      padding: 0;
      .van-tabs__line {
        width: 31px;
        height: 6px;
        background-color: #3296fa;
        bottom: 8px;
      }
      .placeholder {
        width: 66px;
        height: 82px;
        flex-shrink: 0;
      }
      .humberger-btn {
        position: fixed;
        right: 0;
        width: 66px;
        height: 82px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        opacity: 0.9;
        i.toutiao {
          font-size: 33px;
        }
        &:before {
          content: "";
          position: absolute;
          left: 0;
          width: 1px;
          height: 100%;
          background-image: url(~@/assets/gradient-gray-line.png);
          background-size: contain;
        }
      }
    }
  }
}
</style>
