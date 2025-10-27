<script lang="ts" setup>
import TopTitle from '../components/bar/TopTitle.vue';
import diary from '../components/diary/diary.vue';
import diaryEditor from '../components/diary/diary-editor.vue';
import { ref } from 'vue';

const diaryListRef = ref()

const searchTerm = ref<string>('');

const search = (e: string) => {
  searchTerm.value = e;
}

</script>
<template>
    <yk-space dir="vertical" size="l">
        <TopTitle @search="search" name="随笔随记" :isSearch="true" style="width: 100%; margin-bottom: 8px;" />
        <yk-space style="width: 100%;" size="l">
          <diary :serchTerm="searchTerm" ref="diaryListRef" />
          <diaryEditor @refreshDiary="diaryListRef?.getData()" style="flex: none;width: 600px;"></diaryEditor>
        </yk-space>
    </yk-space>
</template>
<style lang="less" scoped></style>