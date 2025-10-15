<template>
  <div class="index-view">
    <!-- 菜单 -->
    <MenuBar />
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import MenuBar from '../components/bar/MenuBar.vue';
</script>


<style lang="less" scoped>
.index-view {
  padding: 32px 32px 32px 232px;
}
</style>