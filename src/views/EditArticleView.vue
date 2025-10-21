<script setup lang="ts">
import { ref,getCurrentInstance } from 'vue';
import Editor from '../components/editor/editor.vue';
import forms from '../components/forms/forms.vue';
import { time } from '../utils/moment';

const proxy: any = getCurrentInstance()?.proxy

const form = ref()
const editor = ref()
const formData = (e: any) => {
  form.value = e
}
const editorData = (e: any) => {
  editor.value = e
}
const nowMoment = ref('')
const submit = (e: number) => {
  if (form.value && form.value.title) {
    if (e === 0) {
      nowMoment.value = time(new Date())
    }
    let request = {
      ...form.value,
      ...{
        content: editor.value,
        status: e,
        classify: 0,
        moment: new Date(),
      }
    }
  } else {
    proxy.$message({ type: 'warning', message: '标题不能为空' })
  }

}
</script>

<template>
  <div class="edit-gallery">
    <div class="edit-gallery-topbar">
      <p class="edit-gallery-topbar-title">新建博客</p>
      <yk-space align="center">
        <yk-text type="secondary">{{ nowMoment }} 保存</yk-text>
        <yk-button type="secondary" @click="submit(0)">保存</yk-button>
        <yk-button @click="submit(1)">发布</yk-button>
      </yk-space>
    </div>
    <Editor style="width: 1200px;" @editors="editorData">
      <forms @formData="formData" :classify="0" style="width: 820px;" />
    </Editor>
  </div>
</template>

<style lang="less" scoped>
.edit-gallery {
  padding: @space-xl 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  &-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: @radius-m;
    background-color: @bg-color-l;
    padding: @space-l @space-xl;
    margin-bottom: @space-l;
    width: 1200px;
    &-title {
      .font-xl();
      font-weight: 600;
    }
  }
  .edit-form {
    background-color: @bg-color-l;
    border-radius: @radius-m;
    width: 100%;
    flex: none;
    flex-direction: column;
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 24px;
  }
}
</style>