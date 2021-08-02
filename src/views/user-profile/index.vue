<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="个人信息" left-arrow @click-left="$router.back()" />
    <!-- /导航栏 -->

    <input type="file" hidden="hidden" ref="file" @change="onFileChange" />

    <!-- 个人信息 -->
    <van-cell class="avatar-cell" title="头像" is-link center @click="$refs.file.click()">
      <van-image class="avatar" round fit="cover" :src="user.photo" />
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link @click="isUpdateNameShow = true" />
    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      @click="isUpdateGenderShow = true"
    />
    <van-cell title="生日" :value="user.birthday" is-link @click="isUpdateBirthdayShow = true" />
    <!-- /个人信息 -->

    <!-- 编辑昵称修改 -->
    <van-popup :style="{ height: '100%' }" position="bottom" v-model="isUpdateNameShow"
      ><update-name @close="isUpdateNameShow = false" v-model="user.name" v-if="isUpdateNameShow"
    /></van-popup>

    <!-- 性别修改 -->
    <van-popup position="bottom" v-model="isUpdateGenderShow"
      ><update-gender
        @close="isUpdateGenderShow = false"
        v-model="user.gender"
        v-if="isUpdateGenderShow"
    /></van-popup>

    <!-- 生日修改 -->
    <van-popup position="bottom" v-model="isUpdateBirthdayShow">
      <update-birthday
        v-model="user.birthday"
        v-if="isUpdateBirthdayShow"
        @close="isUpdateBirthdayShow = false"
      />
    </van-popup>

    <!-- 编辑头像 -->
    <van-popup position="bottom" style="height:100%" v-model="isUpdatePhotoShow">
      <update-photo
        v-if="isUpdatePhotoShow"
        :img="img"
        @close="isUpdatePhotoShow = false"
        @update-photo="user.photo = $event"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from "@/api/user"
import UpdateName from "./components/update-name.vue"
import UpdateGender from "./components/update-gender.vue"
import UpdateBirthday from "./components/update-birthday.vue"
import UpdatePhoto from "./components/update-photo.vue"
export default {
  name: "UserProfile",
  components: { UpdateName, UpdateGender, UpdateBirthday, UpdatePhoto },
  props: {},
  data() {
    return {
      user: {}, //用户的个人性息
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null //预览的图片
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadUserProfile()
  },
  mounted() {},
  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile()
        console.log(data)
        this.user = data.data
      } catch (err) {
        this.$toast("获取用户信息失败")
      }
    },
    onFileChange() {
      //获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文件对象获取blob数据
      this.img = window.URL.createObjectURL(file)
      // 展示预览图片弹出层
      // console.log(data)
      this.isUpdatePhotoShow = true

      // fileInput如果选了同一个文件不会触发change事件
      // 解决办法就是每次使用完毕，把它的value清空
      this.$refs.file.value = ""
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar-cell {
    .van-cell__value {
      display: flex;
      flex-direction: row-reverse;
    }
    .avatar {
      width: 60px;
      height: 60px;
    }
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
