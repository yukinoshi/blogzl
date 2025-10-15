<script setup lang="ts">
import { onMounted, ref, getCurrentInstance } from 'vue';
import diaryItem from './diary-item.vue';
import { diary } from '../../mock/data';
import type { diaryData } from '../../utils/interface';

const proxy: any = getCurrentInstance()?.proxy

const nowpage = ref<number>(1);

const diaryList = ref<diaryData[]>([]);

const count = ref<number>(0);

const props = defineProps({
  pagesize: {
    type: Number,
    default: 6
  },
  serchTerm: {
    type: String,
    default: ''
  },
})

const request = {
  pageSize: props.pagesize,
  nowPage: nowpage.value,
  serchTerm: props.serchTerm,
  count: true,
}

const getData = () => {
  if (request.nowPage === 1) {
    count.value = diary.count
  }
  let arr = diary.list.slice(
    (request.nowPage - 1) * request.pageSize,
    request.nowPage * request.pageSize
  )
  diaryList.value = arr
  console.log(diaryList.value);
  
}

const deleteDiary = (id: number) => {
  diaryList.value = diaryList.value.filter(item => item.id !== id)
  proxy.$message({ type: 'success', message: '删除成功' })
}


const changePage = (e: number) => {
  request.nowPage = e
  getData()
}

onMounted(() => {
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