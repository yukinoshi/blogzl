<script setup lang="ts">
import TopTitle from '../components/bar/TopTitle.vue';
import SubSet from '../components/subset/subset.vue';
import Files from '../components/files/files.vue';
import type { ResFileData } from '../utils/interface';
import { getCurrentInstance, ref } from 'vue';
import { uploadUrl } from '../hooks/article';

const proxy: any = getCurrentInstance()?.proxy
const subsetId = ref<number | string>(-2);//-2表示全部

const setSubsetId = (e: number | string) => {
  subsetId.value = e;
}

const handleSuccess = (e: ResFileData) => {
  if (e.code !== 200) {
    proxy.$message({ type: 'warning', message: '上传失败' })
    return
  }
  proxy.$message({ type: 'success', message: '上传成功' })
  refreshList()
  refreshSubset()
}
// 1. 创建一个 ref 来引用 Files 组件实例
const filesRef = ref();

// 2. 定义一个方法，用来调用子组件的 getFiles
const refreshList = () => {
  filesRef.value?.getFiles();
}
// 1. 创建一个 ref 来引用 SubSet 组件实例
const subsetRef = ref();
const refreshSubset = () => {
  subsetRef.value?.rawSubset();
}
</script>

<template>
  <yk-space dir="vertical" size="l" class="file-view">
    <TopTitle name="本地文件" :isSearch="false" style="width: 100%; margin-bottom: 8px;">
      <template #custom>
        <yk-space align="center">
          <yk-text type="third">图片，视频，音频大小不超过2M</yk-text>
          <yk-upload @handleSuccess="handleSuccess" :upload-url="uploadUrl"></yk-upload>
        </yk-space>
      </template>
    </TopTitle>
    <SubSet ref="subsetRef" @setSubsetId="setSubsetId" :type="2"></SubSet>
    <Files @CRUDSuccess="refreshSubset" :FileSubset="subsetId" ref="filesRef" :pageSize="14" :subsetId="-2"></Files>
  </yk-space>
</template>

<style lang="less" scoped>
.file-view {
  width: 100%;
}
</style>

<style lang="less">
.file-view {
  .yk-upload {
    width: auto;
  }

  .yk-upload__file-list {
    display: none;
  }
}
</style>