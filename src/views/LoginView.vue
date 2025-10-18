<script setup lang="ts">
import { ref, getCurrentInstance, onMounted, nextTick } from 'vue';
import { loginApi } from '../api/login';
import { useUserStore } from '../store/user';

const userStore = useUserStore()
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
const valid = () => {
  if (!user.value.username || user.value.username.length < 4 || user.value.username.length > 11) {
    proxy.$message({ type: 'warning', message: '用户名不能少于4位且不能超过11位' })
    return false
  }

  if (!user.value.password || user.value.password.length < 6) {
    proxy.$message({ type: 'warning', message: '密码不能少于6位' })
    return false
  }
  return true
}
const submit = async () => {
  if (valid()) {
    const res = await loginApi(user.value.username, user.value.password);
    if (res.code === 200 && res.data?.token) {
      userStore.id = res.data.id
      userStore.name = res.data.name
      userStore.token = res.data.token
      proxy.$message({ type: 'success', message: '登录成功' })
      nextTick(() => {
        proxy.$router.push('/');
      });
    } else {
      proxy.$message({ type: 'warning', message: '用户名或密码错误' })
    }
  }
}
//跳转到注册页面
const goToRegister = () => {
  proxy.$router.push('/register');
}

onMounted(() => {

})
</script>

<template>
  <div class="login" :style="{ height: pageHeight + 'px' }">
    <yk-space :size="48" dir="vertical" align="center" class="login-main">
      <yk-space dir="vertical" align="center">
        <img class="logo" src="../assets/vue.svg" alt="">
        <span class="name">欢迎使用个人博客管理后台</span>
      </yk-space>
      <yk-space dir="vertical">
        <yk-input size="xl" style="width: 320px;" v-model="user.username" placeholder="请输入用户名"></yk-input>
        <yk-input size="xl" style="width: 320px;" v-model="user.password" placeholder="请输入密码"
          type="password"></yk-input>
        <yk-text style="cursor: pointer;" type="secondary" @click="goToRegister">没有账号？立即注册！</yk-text>
      </yk-space>
      <yk-button @click="submit" size="xl" type="primary" long>登录</yk-button>
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