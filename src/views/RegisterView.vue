<script setup lang="ts">
import { ref,getCurrentInstance } from 'vue';

const proxy: any = getCurrentInstance()?.proxy
const pageHeight = ref(window.innerHeight);
type User = {
  username: string,
  password: string,
}
const user = ref<User>({
  username: '',
  password: ''
});

const submit = () => {
  if (user.value.username && user.value.password && user.value.password.length >= 6) {
    proxy.$message({ type: 'success', message: '注册成功' })
  } else {
    proxy.$message({ type: 'warning', message: '用户名或密码错误' })
  }
}
</script>

<template>
  <div class="login" :style="{ height: pageHeight + 'px' }">
    <yk-space :size="48" dir="vertical" align="center" class="login-main">
      <yk-space dir="vertical" align="center">
        <img class="logo" src="../assets/vue.svg" alt="">
        <span class="name">欢迎注册个人博客管理后台</span>
      </yk-space>
      <yk-space dir="vertical">
        <yk-input size="xl" style="width: 320px;" v-model="user.username" placeholder="请输入用户名"></yk-input>
        <yk-input size="xl" style="width: 320px;" v-model="user.password" placeholder="请输入密码" type="password"></yk-input>
      </yk-space>
      <yk-button @click="submit" size="xl" type="primary" long>注册</yk-button>
    </yk-space>
  </div>
</template>

<style lang="less" scoped>
.login {
  z-index: 100;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: @bg-color-m;
  display: flex;
  justify-content: center;
  align-items: center;

  &-main {
    padding: 48px;
    border-radius: @radius-xl;
    background-color: @bg-color-l;
    .name {
      font-size: 20px;
      font-weight: 600;
    }
    .logo {
      width: 84px;
    }
  }
}
</style>