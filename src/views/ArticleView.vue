<script lang="ts" setup>
import TopTitle from '../components/bar/TopTitle.vue';
import SubSet from '../components/subset/subset.vue';
import labelView from '../components/label/label.vue';
import Article from '../components/article/article.vue';
</script>
<template>
    <yk-space dir="vertical" size="l">
        <TopTitle name="文章管理" :isSearch="true" style="width: 100%; margin-bottom: 8px;" />
        <SubSet :type="0" />
        <yk-space style="width: 100%;">
            <Article style="width: 100%; height: 12px;"></Article>
            <labelView style="flex: none; width: 280px;"></labelView>
        </yk-space>
    </yk-space>
</template>
<style lang="less" scoped></style>