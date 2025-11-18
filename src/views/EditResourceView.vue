<script setup lang="ts">
import { ref } from 'vue';
import resourceForm from '../components/resource/resource-form.vue';

const isEdit = ref(false);
</script>

<template>
  <div class="edit-resource">
    <yk-space dir="vertical" style="width: 1200px;">
      <div class="edit-resource-topbar">
        <p class="edit-resource-topbar-title" v-if="!isEdit">新建资源分享</p>
        <p class="edit-resource-topbar-title" v-else>修改资源分享</p>
        <yk-space>
          <yk-button type="secondary">取消</yk-button>
          <yk-button @click="submit()">发布</yk-button>
        </yk-space>
      </div>
      <resource-form></resource-form>
    </yk-space>
  </div>
</template>

<style lang="less" scoped>
.edit-resource {
  padding: 24px;
  display: flex;
  justify-content: center;

  &-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: @radius-m;
    background-color: @bg-color-l;
    padding: @space-l @space-xl;
    margin-bottom: @space-l;
    width: 100%;
    &-title {
      .font-xl();
      font-weight: 600;
    }
  }
}
</style>