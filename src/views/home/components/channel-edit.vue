<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        type="danger"
        plain
        round
        size="mini"
        class="edit-btn"
        @click="isEditShow = !isEditShow"
        >{{ isEditShow ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <van-grid :gutter="10" class="my-grid" clickable>
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channel, index)"
      >
        <div class="text-wrap">
          <span slot="text" class="text" :class="{ active: index === active }">
            {{ channel.name }}</span
          >
        </div>
        <!-- v-bind:class语法
        一个对象，对象中的key表示要作用的css类名
        对象中的value要计算出一个布尔值，若布尔值为true则作用该类名。反则不作用
         -->
        <van-icon
          v-show="isEditShow && !fixedChannels.includes(channel.id)"
          class="clear-icon"
          name="clear"
        ></van-icon>
      </van-grid-item>
    </van-grid>
    <!-- 频道推荐 -->

    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        @click="onAddChannel(channel)"
        class="grid-item"
        v-for="(channel, index) in recommondChannnels"
        icon="plus"
        :key="index"
        :text="channel.name"
      >
      </van-grid-item>
    </van-grid>
  </div>
</template>
<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from "@/api/channel.js"
import { mapState } from "vuex"
import { setItem } from "@/utils/storage"
export default {
  name: "ChannelEdit",
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return { allChannels: [], isEditShow: false, fixedChannels: [0] }
  },
  // 计算属性 会观测内部依赖属性的变化
  //如果依赖数据发生变化。则计算属性会重新执行
  computed: {
    ...mapState(["user"]),
    recommondChannnels() {
      // 数组的filter方法会遍历数组，把符合条件的元素存储到新数组中并返回
      return this.allChannels.filter(channel => {
        // const channels = []

        // 数组的find方法也是遍历数组，把符合条件的第一个元素返回，这里要不符合条件所以用非
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
      // const channels = []
      // this.allChannels.forEach(channel => {
      //   // find返回一个数组，便利数组。找到满足条件的项
      //   const ret = this.myChannels.find(myChannels => {
      //     return myChannels.id === channel.id
      //   })
      //   // 如果我的频道中不包含该频道项，则收集到推荐频道中
      //   if (!ret) {
      //     channels.push(channel)
      //   }
      // })
      // // 把计算结果返回
      // return channels
    }
  },
  watch: {},
  created() {
    this.loadAllChannels()
  },
  mounted() {},
  methods: {
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
        // console.log(this.allChannels)
      } catch (err) {
        this.$toast("数据获取失败")
      }
    },
    async onAddChannel(channel) {
      try {
        this.myChannels.push(channel)
        if (this.user) {
          // 已登录
          await addUserChannel([
            {
              id: channel.id, //频道ID
              seq: this.myChannels.length //序号
            }
          ])
          console.log(this.myChannels)
        } else {
          setItem("TOUTIAO_CHANNELS", this.myChannels)
          // 未登录
        }
      } catch (err) {
        console.log(err)
        this.$toast("保存失败，请稍后重试")
      }
    },
    editMyChannel() {
      if (!this.isClear) {
        this.isClear = "clear"
      } else {
        this.isClear = ""
      }
    },
    onMyChannelClick(channel, index) {
      // 编辑状态
      if (this.isEditShow) {
        if (this.fixedChannels.includes(channel.id)) {
          return
        }
        if (index <= this.active) {
          this.$emit("updata-active", this.active - 1)
        }

        //splice参数1：要删除的元素索引，参数2：要删除的元素个数，不指定则从当前索引删到最后一个
        this.myChannels.splice(index, 1)
        this.deleteChannel(channel)
      } else {
        // 非编辑状态
        this.$emit("updata-active", index, false)
      }
    },
    async deleteChannel(channel) {
      try {
        if (this.user) {
          await deleteUserChannel(channel.id)
        } else {
          setItem("TOUTIAO_CHANNELS", this.myChannels)
        }
      } catch (err) {}
    }
  }
}
</script>
<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    border-radius: 30px;
    .van-grid-item__content {
      background-color: #f4f5f6;
      white-space: nowrap;

      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
    }
  }
  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 20px;
          margin-right: 6px;
        }
      }
    }
  }
  /deep/.my-grid {
    .grid-item {
      .van-grid-item__content {
        .text-wrap {
          position: absolute;
          top: 10px;
        }
        .clear-icon {
          position: absolute;
          z-index: 2;
          top: -10px;
          font-size: 30px;
          right: -10px;
          color: #cacaca;
        }
      }
    }
  }
}
</style>
