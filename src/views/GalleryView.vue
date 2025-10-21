<script lang="ts" setup>
import TopTitle from '../components/bar/TopTitle.vue';
import SubSet from '../components/subset/subset.vue';
import gallery from '../components/gallery/gallery.vue';
</script>
<template>
    <yk-space dir="vertical" size="l">
        <TopTitle name="摄影图库" :isSearch="true" style="width: 100%; margin-bottom: 8px;" />
        <SubSet :type="1" />
        <gallery :pagesize="12"/>
    </yk-space>
</template>
<style lang="less" scoped></style>