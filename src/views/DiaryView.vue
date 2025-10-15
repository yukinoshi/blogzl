<script lang="ts" setup>
import TopTitle from '../components/bar/TopTitle.vue';
import diary from '../components/diary/diary.vue';
import diaryEditor from '../components/diary/diary-editor.vue';
</script>
<template>
    <yk-space dir="vertical" size="l">
        <TopTitle name="随笔随记" :isSearch="true" style="width: 100%; margin-bottom: 8px;" />
        <yk-space style="width: 100%;" size="l">
          <diary />
          <diaryEditor style="flex: none;width: 600px;"></diaryEditor>
        </yk-space>
    </yk-space>
</template>
<style lang="less" scoped></style>