<script setup lang="ts">
import { onMounted, ref, getCurrentInstance, watch } from 'vue';
import diaryItem from './diary-item.vue';
import type { diaryData, ReqDiary } from '../../utils/interface';
import { deleteDiaryApi, getDiaryApi } from '../../api/diary';
import { deleteFileApi } from '../../api/files';

const proxy: any = getCurrentInstance()?.proxy

const nowpage = ref<number>(1);

const diaryList = ref<diaryData[]>([]);

const count = ref<number>(0);

const props = defineProps({
  pagesize: {
    type: Number,
    default: 5
  },
  serchTerm: {
    type: String,
    default: ''
  },
})

const request: ReqDiary = {
  pageSize: props.pagesize,
  nowPage: nowpage.value,
  serchTerm: props.serchTerm,
  count: true,
}

const getData = async () => {
  const res = await getDiaryApi(request)
  if (res.code !== 200) {
    proxy.$message({ type: 'error', message: '获取日记失败' })
    return
  }
  count.value = res.data.count
  diaryList.value = res.data.list
}
defineExpose({
  getData
})
const deleteDiary = async (id: number) => {
  const res = await deleteDiaryApi(id)
  if (res.code !== 200) {
    proxy.$message({ type: 'error', message: '删除失败' })
    return
  }
  const temp = diaryList.value.find(item => item.id === id)
  temp?.picture?.forEach(async (item: any) => {
    //删除图片
    const { code } = await deleteFileApi(item.id)
    if (code !== 200) {
      proxy.$message({ type: 'warning', message: '删除图片失败' })
      return
    }
  });
  diaryList.value = diaryList.value.filter(item => item.id !== id)
  proxy.$message({ type: 'success', message: '删除成功' })
  getData()
}


const changePage = (e: number) => {
  request.nowPage = e
  getData()
}

onMounted(() => {
  getData()
})

watch(() => props.serchTerm, (newVal)=>{
  request.serchTerm = newVal
  getData()
})

</script>

<template>
  <div class="diary">
    <yk-space dir="vertical" style="width: 100%; padding-bottom: 24px;">
      <diaryItem v-for="item in diaryList" :key="item.id" :data="item" @delete="deleteDiary"></diaryItem>
    </yk-space>

    <div class="diary_pagination">
      <yk-pagination @change="changePage" :default-page-size="request.pageSize" :total="count" size="m" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.diary {
  width: 100%;

  &_pagination {
    padding: @space-s 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
  }

}
</style>