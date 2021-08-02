<template>
  <div class="update-gender">
    <van-picker
      title="性别"
      show-toolbar
      :columns="columns"
      @confirm="onConfirm"
      @cancel="$emit('close')"
      :default-index="value"
      @change="onPickerChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user"
export default {
  name: "UpdateGender",
  component: {},
  props: { value: { type: Number, required: true } },
  data() {
    return { columns: ["男", "女"], localGender: this.value }
  },
  created() {},
  mounted() {},
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true, //禁止背景点击
        duration: 0
      })
      try {
        const localGender = this.localGender
        const { data } = await updateUserProfile({
          gender: localGender
        })
        console.log(data)
        this.$emit("input", localGender)

        this.$emit("close")
        this.$toast.success("更新完成")
      } catch (err) {
        this.$toast.fail("更新失败")
        console.log(err)
      }
    },
    onPickerChange(picker, value, index) {
      this.localGender = index
    }
  }
}
</script>

<style></style>
