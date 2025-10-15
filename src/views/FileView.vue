<script setup lang="ts">
import TopTitle from '../components/bar/TopTitle.vue';
import SubSet from '../components/subset/subset.vue';
import Files from '../components/files/files.vue';
</script>

<template>
  <yk-space dir="vertical" size="l" class="file-view">
    <TopTitle name="本地文件" :isSearch="false" style="width: 100%; margin-bottom: 8px;" >
      <template #custom>
        <yk-space align="center">
          <yk-text type="third">图片，视频，音频大小不超过2M</yk-text>
          <yk-button>上传</yk-button>
        </yk-space>
      </template>
    </TopTitle>
    <SubSet></SubSet>
    <Files :pageSize="12" :subsetId="-1"></Files>
  </yk-space>
</template>

<style lang="less" scoped>
.file-view{
  width: 100%;
}
</style>