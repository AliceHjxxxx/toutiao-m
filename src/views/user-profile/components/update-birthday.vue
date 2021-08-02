<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>
<script>
import { updateUserProfile } from "@/api/user"
import dayjs from "dayjs"
export default {
  name: "UpdateBirthday",
  component: {},
  props: { value: { type: String, required: true } },
  data() {
    return {
      minDate: new Date(1980, 0, 1),
      maxDate: new Date(2022, 7, 22),
      currentDate: new Date(this.value)
    }
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
        const currentDate = dayjs(this.currentDate).format("YYYY-MM-DD")
        const { data } = await updateUserProfile({
          birthday: currentDate
        })
        // console.log(data)
        this.$emit("input", currentDate)

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

<style></style>
