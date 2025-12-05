<script setup lang="ts">
import { useRouter } from 'vue-router';
import Information from '../reply/information.vue';
import { computed, onMounted, ref } from 'vue';
import { getUnreadMessageCountApi } from '../../api/overview';
import { useUserStore } from '../../store/user';
import { avatarList } from '../../utils/avatar';
import { logoutApi } from '../../api/login';
import { YkMessage } from '@yike-design/ui';

const router = useRouter()
let isNewMessage = ref(0);
const userStore = useUserStore();
const active = ref(false)

const changeActive = (e:boolean) => {
  active.value = e
}

const backHome = () => {
  router.push('/')
}
const getUnreadMessageCount = async () => {
  const res = await getUnreadMessageCountApi()
  if (res.code === 200) {
    isNewMessage.value = res.data.count || 0;
  }
}

//获取头像
const avatarUrl = computed(() => {
  return avatarList[userStore.avatarIndex] || '../../assets/image/avatar.png';
})

const logout = async () => {
  try {
    await logoutApi()
  } finally {
    userStore.clearUser()
    YkMessage({ type: 'success', message: '已退出登录' })
    window.location.href = '/login'
  }
}

onMounted(() => {
  getUnreadMessageCount()
})

</script>

<template>
  <div class="head-bar">
    <yk-space align="center" @click="backHome" :size="12" style="cursor: pointer;">
      <img src="../../assets/vue.svg" class="logo" alt="">
      <span>博客后台</span>
    </yk-space>
    <yk-space align="center" :size="24">
      <yk-badge :count="isNewMessage" :overflow-count="99">
        <IconEmailFill @click="changeActive(true)" style="font-size: 20px;" />
      </yk-badge>
      <!-- 默认图片 -->
        <img :src="avatarUrl" class="avatar" alt="">
      <div><yk-theme></yk-theme></div>
      <yk-button @click="logout">退出</yk-button>
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
