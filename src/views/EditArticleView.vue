<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue';
import Editor from '../components/editor/editor.vue';
import forms from '../components/forms/forms.vue';
import { momentm, time } from '../utils/moment';
import { addArticleApi, getArticleByIdApi, updateArticleApi } from '../api/article';
import type { articleData, ReqArticle, Res } from '../utils/interface';
import { useRoute } from 'vue-router';

const proxy: any = getCurrentInstance()?.proxy

const form = ref<ReqArticle>({
  value: {
    title: '',
    subset_id: undefined,
    label: [] as string[],
    introduce: '',
    cover: '',
    moment: '',
    classify: 0 //文章
  }
})
const editor = ref()
const formData = (e: any) => {
  form.value = e
}
const editorData = (e: any) => {
  editor.value = e
}
const nowMoment = ref('')
//判断是否有id，有则为编辑文章，无则为新建文章
const isEdit = ref(false)
const id = ref<number>(-1)
const editdata = ref<articleData>({} as articleData)
const getEditData = async () => {
  //获取文章数据进行编辑
  const route = useRoute()
  id.value = Number(route.query.id)
  if (id.value) {
    isEdit.value = true
    const res = await getArticleByIdApi(id.value)
    if (res.code === 200) {
      editdata.value = res.data;
    }
  }
}

const submit = async (e: number) => {
  if (form.value.value && form.value.value.title) {
    if (e === 0) {
      nowMoment.value = time(new Date())
    }
    let request = {
      value: {
        ...form.value.value,
        content: editor.value,
        state: e,
        classify: 0,
        moment: momentm(new Date()),
      }
    }
    let res: Res = {} as Res;
    if (isEdit.value) {
      //编辑文章
      // console.log({id: id.value, ...request});
      const res = await updateArticleApi({ id: id.value, ...request })
      if (res.code !== 200) {
        proxy.$message({ type: 'warning', message: '操作失败' })
        return
      }
      proxy.$message({ type: 'success', message: e === 0 ? '保存成功' : '发布成功' })
    } else {
      res = await addArticleApi(request);
      if (res.code !== 200) {
        proxy.$message({ type: 'warning', message: '操作失败' })
        return
      }
      id.value = res.data;
      isEdit.value = true;
      proxy.$message({ type: 'success', message: e === 0 ? '保存成功' : '发布成功' })
      if (e === 1) {
        proxy.$router.push('/article');
      }
    }
  } else {
    proxy.$message({ type: 'warning', message: '标题不能为空1' })
  }
}

onMounted(() => {
  getEditData()
})
</script>

<template>
  <div class="edit-gallery">
    <div class="edit-gallery-topbar">
      <p class="edit-gallery-topbar-title" v-if="!isEdit">新建博客</p>
      <p class="edit-gallery-topbar-title" v-else>编辑博客</p>
      <yk-space align="center">
        <yk-text type="secondary">{{ nowMoment }} 保存</yk-text>
        <yk-button type="secondary" @click="submit(0)">保存</yk-button>
        <yk-button @click="submit(1)">发布</yk-button>
      </yk-space>
    </div>
    <Editor style="width: 1200px;" :editcontent="editdata.content" @editors="editorData">
      <forms @formData="formData" :editInfo="editdata" :classify="0" style="width: 820px;" />
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