<script setup lang="ts">
import editPhoto from '../components/gallery/edit-photo.vue'
import forms from '../components/forms/forms.vue';
</script>

<template>
  <div class="edit-gallery">
    <div class="edit-gallery-topbar">
      <p class="edit-gallery-topbar-title">新建摄影图库</p>
      <yk-space>
        <yk-button type="secondary">取消</yk-button>
        <yk-button>发布</yk-button>
      </yk-space>
    </div>
    <yk-space style="width: 100%;">
      <editPhoto />
      <div class="edit-form">
        <forms :classify="1" style="width: 420px;"/>
      </div>
    </yk-space>
  </div>
</template>

<style lang="less" scoped>
.edit-gallery {
  padding: @space-xl 80px;
  &-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: @radius-m;
    background-color: @bg-color-l;
    padding: @space-l @space-xl;
    margin-bottom: @space-l;
    &-title {
      .font-xl();
      font-weight: 600;
    }
  }
  .edit-form {
    background-color: @bg-color-l;
    border-radius: @radius-m;
    flex: none;
    display: flex;
    justify-content: center;
    padding: 24px;
  }
}
</style>