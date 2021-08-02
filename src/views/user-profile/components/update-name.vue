<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onComfirm"
    />

    <!-- 输入框 -->
    <div class="filed-wrap">
      <van-field
        v-model.trim="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user"
export default {
  name: "UpdateName",
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      localName: this.value
    }
  },
  created() {},
  methods: {
    async onComfirm() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true, //禁止背景点击
        duration: 0
      })
      try {
        const localName = this.localName
        if (!localName.length) {
          this.$toast("昵称不能为空")
          return
        }
        const { data } = await updateUserProfile({
          name: localName
        })
        console.log(data)
        this.$emit("input", localName)

        this.$emit("close")
        this.$toast.success("更新完成")
      } catch (err) {
        this.$toast.fail("更新失败")
        console.log(err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.filed-wrap {
  padding: 15px;
}
</style>
