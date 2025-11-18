<script lang="ts" setup>
import TopTitle from '../components/bar/TopTitle.vue';
import SubSet from '../components/subset/subset.vue';
import resource from '../components/resource/resource.vue';
import { ref } from 'vue';

const searchTerm = ref<string>('');

const subsetId = ref<number | string>(-2);//-1表示全部

const search = (e: string) => {
  searchTerm.value = e;
}

const setSubsetId = (e: number | string) => {
  subsetId.value = e;
}
</script>
<template>
  <yk-space dir="vertical" size="l">
    <TopTitle @search="search" name="摄影图库" :isSearch="true" style="width: 100%; margin-bottom: 8px;" />
    <SubSet @setSubsetId="setSubsetId" :search="searchTerm.length > 0" :type="3" />
    <yk-space style="width: 100%;">
      <resource :pageSize="8" :subsetId="subsetId" :serchTerm="searchTerm" />
    </yk-space>
  </yk-space>
</template>
<style lang="less" scoped></style>