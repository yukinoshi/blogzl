<script lang="ts" setup>
import TopTitle from '../components/bar/TopTitle.vue';
import SubSet from '../components/subset/subset.vue';
import labelView from '../components/label/label.vue';
import Article from '../components/article/article.vue';
import { ref } from 'vue';

const searchTerm = ref<string>('');

const subsetId = ref<number | string>(-1);//-1表示全部

const search = (e: string) => {
  searchTerm.value = e;
}

const setSubsetId = (e: number | string) => {
  subsetId.value = e;
}

</script>
<template>
    <yk-space dir="vertical" size="l">
        <TopTitle @search="search" name="文章管理" :isSearch="true" :classify = 0 style="width: 100%; margin-bottom: 8px;" />
        <SubSet @setSubsetId="setSubsetId" :search="searchTerm.length > 0" :type="0" />
        <yk-space style="width: 100%;">
            <Article :articlesubset="subsetId" :serchTerm="searchTerm" style="width: 100%; height: 12px;"></Article>
            <labelView style="flex: none; width: 280px;"></labelView>
        </yk-space>
    </yk-space>
</template>
<style lang="less" scoped></style>