<script setup lang="ts">
import HeadBar from './components/bar/HeadBar.vue';
</script>

<template>
  <!-- 头部：根据路由元信息决定是否显示 -->
  <HeadBar v-if="$route.meta?.hideHeader !== true" />
  <!-- 内容 -->
  <router-view />
  
</template>

<style scoped lang="less">
.test{
  color: @pcolor
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
