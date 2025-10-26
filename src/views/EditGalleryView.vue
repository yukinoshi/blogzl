<script setup lang="ts">
import editPhoto from '../components/gallery/edit-photo.vue'
import forms from '../components/forms/forms.vue';
import { getCurrentInstance, onMounted, ref } from 'vue';
import type { articleData, Photo, ReqArticle } from '../utils/interface';
import { useRoute } from 'vue-router';
import { addArticleApi, getArticleByIdApi, updateArticleApi } from '../api/article';
import { momentm } from '../utils/moment';
const form = ref<ReqArticle>({
  value: {
    title: '',
    subset_id: undefined,
    label: [] as string[],
    introduce: '',
    cover: '',
    moment: '',
    classify: 1, //文章
  }
})
const proxy: any = getCurrentInstance()?.proxy
const editdata = ref<articleData>({} as articleData)
const isEdit = ref<boolean>(false)
const id = ref<number>(-1)
const getEditData = async () => {
  //获取文章数据进行编辑
  const route = useRoute()
  id.value = Number(route.query.id)
  if (id.value) {
    isEdit.value = true
    const res = await getArticleByIdApi(id.value)
    if (res.code !== 200) {
      proxy?.$message?.({ type: 'warning', message: '获取编辑数据失败' })
      return
    }
    editdata.value = res.data;
  }
}
const formData = (e: any) => {
  form.value.value.title = e.value.title;
  form.value.value.subset_id = e.value.subset_id;
  form.value.value.label = e.value.label;
  form.value.value.introduce = e.value.introduce;
}
const editorData = (e: Photo[], coverId: number) => {
  form.value.value.content = JSON.stringify(e)
  form.value.value.cover = e.find(item => item.id === coverId)?.url || ''
}
const submit = async () => {
  if (form.value.value && form.value.value.title) {
    if (isEdit.value) {
      const res = await updateArticleApi({
        id: id.value,
        value: {
          ...form.value.value,
          moment: momentm(new Date()),
        }
      })
      if (res.code !== 200) {
        proxy?.$message?.({ type: 'warning', message: '编辑失败' })
        return
      }
    } else {
      form.value.value.moment = momentm(new Date())
      const res = await addArticleApi(form.value)
      if (res.code !== 200) {
        proxy?.$message?.({ type: 'warning', message: '发布失败' })
        return
      }
    }
    proxy?.$message?.({ type: 'success', message: isEdit.value ? '编辑成功' : '发布成功' })
    // proxy.$router.push('/gallery');
  } else {
    proxy?.$message?.({ type: 'warning', message: '请填写标题' })
  }

}
onMounted(() => {
  getEditData()
})
</script>

<template>
  <div class="edit-gallery">
    <div class="edit-gallery-topbar">
      <p class="edit-gallery-topbar-title" v-if="!isEdit">新建摄影图库</p>
      <p class="edit-gallery-topbar-title" v-else>编辑摄影图库</p>
      <yk-space>
        <yk-button type="secondary">取消</yk-button>
        <yk-button @click="submit()">发布</yk-button>
      </yk-space>
    </div>
    <yk-space style="width: 100%;">
      <editPhoto @editors="editorData" :editcontent="editdata" />
      <div class="edit-form">
        <forms @formData="formData" :editInfo="editdata" :classify="1" style="width: 420px;" />
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