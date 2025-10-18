<script setup lang="ts">
import { useRouter } from 'vue-router';
import Information from '../reply/information.vue';
import { ref } from 'vue';
const router = useRouter()
const backHome = () => {
  router.push('/')
}
const active = ref(false)
const changeActive = (e:boolean) => {
  active.value = e
}

</script>

<template>
  <div class="head-bar">
    <yk-space align="center" @click="backHome" :size="12" style="cursor: pointer;">
      <img src="../../assets/vue.svg" class="logo" alt="">
      <span>博客后台</span>
    </yk-space>
    <yk-space align="center" :size="24">
      <yk-badge is-dot>
        <IconEmailFill @click="changeActive(true)" style="font-size: 20px;" />
      </yk-badge>
      <!-- 默认图片 -->
      <img src="../../assets/avatar.png" class="avatar" alt="">
      <div><yk-theme></yk-theme></div>
      <yk-button>退出</yk-button>
      <img src="http://localhost:3000/files/1760773655285.png" alt="">

    </yk-space>
    <Information :page-size="8" :active="active" @close="changeActive(false)"></Information>
  </div>
</template>

<style lang="less" scoped>
.head-bar {
  width: 100%;
  height: 64px;
  background-color: @bg-color-l;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 @space-xl;

  .name {
    font-weight: 600;
    font-size: 20px;
  }
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
  }
}
</style>
