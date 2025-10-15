<template>
  <yk-space dir="vertical" size="xl">
    <TopTitle name="总览" :isSearch="false">
    </TopTitle>
    <Gather />
    <yk-space style="width: 100%;">
      <Datas></Datas>
      <Comment :height="'491px'" :pageSize="10"></Comment>
    </yk-space>
  </yk-space>
</template>

<script lang="ts" setup>
import TopTitle from "../components/bar/TopTitle.vue";
import Gather from '../components/overview/gather.vue';
import Datas from '../components/overview/datas.vue'
import { Comment } from '../components/reply/index.ts';

</script>


<style lang="less" scoped></style>