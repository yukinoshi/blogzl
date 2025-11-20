<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue';
import resourceForm from '../components/resource/resource-form.vue';
import { addResourceApi, updateResourceByIdApi } from '../api/resource';
import type { ReqResource } from '../utils/interface';

const proxy: any = getCurrentInstance()?.proxy

const isEdit = ref<boolean>(false);

const isSubmit = ref(false);

// 获取路由参数，判断是否为编辑
const id = ref<number>(-1);

const route = proxy.$route;

const form = ref<ReqResource>({
  title: '',
  subset_id: -2,
  url: '',
  password: '',
  introduce: '',
  format: '',
})

const submit = async () => {
  let res = {} as any;
  if (isSubmit.value) {
    if (isEdit.value) {
      res = await updateResourceByIdApi(
        id.value,
        form.value,
      )
    } else {
      res = await addResourceApi({
        value: {
          ...form.value,
        }
      })
    }
    if (Number(res.code) !== 200) {
      proxy?.$message?.({ type: 'warning', message: '资源发布失败' })
      return
    } else {
      proxy?.$message?.({ type: 'success', message: '资源发布成功' })
      proxy.$router.push('/resource');
    }
  } else {
    proxy?.$message?.({ type: 'warning', message: '表单信息不完整' })
  }
};

const formData = (e: any) => {
  e.isSubmit ? isSubmit.value = true : isSubmit.value = false;
  form.value = {
    ...e.newVal
  }
};

onMounted(() => {
  id.value = Number(route.query.id);
  if (id.value) {
    isEdit.value = true;
  }
})
</script>

<template>
  <div class="edit-resource">
    <yk-space dir="vertical" style="width: 1200px;">
      <div class="edit-resource-topbar">
        <p class="edit-resource-topbar-title" v-if="!isEdit">新建资源分享</p>
        <p class="edit-resource-topbar-title" v-else>修改资源分享</p>
        <yk-space>
          <yk-button type="secondary">取消</yk-button>
          <yk-button @click="submit">发布</yk-button>
        </yk-space>
      </div>
      <resource-form :is-edit="isEdit" @form-data="formData"></resource-form>
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