<script setup lang="ts">
import { getCurrentInstance, reactive, ref } from 'vue';
import type { ResFileData } from '../../utils/interface';
import { uploadUrl } from '../../hooks/article';
import { Format } from '../../utils/menu';

const proxy: any = getCurrentInstance()?.proxy

const form = reactive({
  title: '大飞',
  sex: 'man',
  subset_id: 1,
  url: '',
  password: '',
  introduce: '',
  format: '',
})
const fileUrl = ref<{ name: string; url: string }[]>([])


//图片提交成功
const handleSuccess = (e: ResFileData) => {
  if (e.code !== 200) {
    proxy.$message({ type: 'warning', message: '上传失败' })
    return
  }
}

//删除文件回调
const handleDelete = async () => {
}
</script>

<template>
  <div class="resource-form">
    <yk-form :model="form" layout="vertical">
      <yk-form-item label="资源标题" field="title">
        <yk-input v-model="form.title"></yk-input>
      </yk-form-item>
      <yk-form-item label="资源分类" field="subset_id">
        <yk-radio-group v-model="form.subset_id">
          <yk-radio value="man">男</yk-radio>
          <yk-radio value="woman">女</yk-radio>
        </yk-radio-group>
      </yk-form-item>
      <yk-form-item label="资源地址" field="url">
        <yk-input v-model="form.url"></yk-input>
      </yk-form-item>
      <yk-form-item label="提取码" field="password">
        <yk-input v-model="form.password"></yk-input>
      </yk-form-item>
      <yk-form-item label="说明" field="introduce">
        <yk-input v-model="form.introduce"></yk-input>
      </yk-form-item>
      <yk-form-item label="资源格式" field="format">
        <yk-radio-group v-model="form.format">
          <yk-radio v-for="value in Format" :key="value.value" :value="value.value">{{ value.label }}</yk-radio>
        </yk-radio-group>
      </yk-form-item>
      <yk-form-item size="s" label="封面" field="cover">
        <yk-upload @handleDelete="handleDelete" @handleSuccess="handleSuccess" :limit="1" accept="image/*"
          :upload-url="uploadUrl" :file-list="fileUrl"></yk-upload>
      </yk-form-item>
    </yk-form>
  </div>
</template>

<style lang="less" scoped>
.resource-form {
  background-color: @bg-color-l;
  border-radius: 12px;
  padding: 24px;
  width: 100%;

}
</style>