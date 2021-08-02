<template>
  <div class="update-photo">
    <img :src="img" class="img" ref="img" />
    <div class="toolbar" hidden>
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>
<script>
import "cropperjs/dist/cropper.css"
import Cropper from "cropperjs"
import { updateUserPhoto } from "@/api/user.js"
export default {
  name: "UpdatePhoto",
  components: {},
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data() {
    return { cropper: null }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1, //定义裁剪器的视图模式。如果设置viewMode为0，则裁剪框可以延伸到画布之外，而值为1、2、 或3会将裁剪框限制为画布的大小。
      //viewMode的2或3将额外限制画布到容器。之间不存在差异2并且3当所述画布与所述容器的比例是相同的。
      dragMode: "move", //拖动模式,定义裁剪器的拖动模式。
      aspectRatio: 1, //初始纵横比,定义裁剪框的初始纵横比。默认情况下，它与画布（图像包装器）的纵横比相同。
      autoCropArea: 1, //定义裁剪框的固定纵横比。默认情况下，裁剪框具有自由比例。
      cropBoxMovable: false, //裁剪框可移动,启用通过拖动移动裁剪框。
      cropBoxResizable: false, //截图区域是否可缩放
      background: false, //截图区域背景
      movable: true //画布允许被拖动
    })
  },
  methods: {
    onConfirm() {
      // 基于服务端的裁切用getData,获取裁切参数
      //基于客户端用以下的方法，获取裁切的文件对象
      this.cropper.getCroppedCanvas().toBlob(blob => {
        this.updateUserPhoto(blob)
      })
    },
    async updateUserPhoto(blob) {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true, //禁止背景点击
        duration: 0
      })
      try {
        // 错误用法
        // const {data}= await  updateUserPhoto(blob)
        // 如果接口要求是Content-Type是multipart/form-data
        //你必须传递FormData对象
        // 如果要求是application/json
        // 怎必须传递普通js对象
        const formData = new FormData()
        formData.append("photo", blob)
        const { data } = await updateUserPhoto(formData)
        // console.log(data)
        this.$emit("close")
        this.$emit("update-photo", data.data.photo)
        this.$toast.success("更新成功")
      } catch (error) {
        this.$toast.fail("更新失败")
      }
    }
  }
}
</script>
<style lang="less" scoped>
.update-photo {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
.img {
  display: block;
  max-width: 100%;
}
</style>
