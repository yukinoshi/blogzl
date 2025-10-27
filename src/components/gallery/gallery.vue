<script setup lang="ts">
import { onMounted, ref, getCurrentInstance, watch } from 'vue';
import GalleryItem from './gallery-item.vue';
import type { galleryData, Photo, ReqGetArticle } from '../../utils/interface';
import { useArticleStore } from '../../store/article';
import { deleteArticleApi, getAllArticleApi, getAllArticlebyApi, getArticleApi } from '../../api/article';

const proxy: any = getCurrentInstance()?.proxy

const nowpage = ref<number>(1);

const galleryList = ref<galleryData[]>([]);

const count = ref<number>(0);

const articleStore = useArticleStore();

const props = defineProps({
  pagesize: {
    type: Number,
    default: 6
  },
  subsetId: {
    type: Number,
    default: -2
  },
  serchTerm: {
    type: String,
    default: ''
  },
  gallerysubset: {
    type: [Number, String],
    default: ''
  }
})

const request: ReqGetArticle = {
  pageSize: props.pagesize,
  nowPage: nowpage.value,
  subsetId: props.subsetId,
  serchTerm: props.serchTerm,
  count: true,
  classify: 1 //图库
}

//当搜索词变化时，重新获取数据
watch(() => props.serchTerm, async (newVal) => {
  request.serchTerm = newVal;
  nowpage.value = 1;
  request.nowPage = nowpage.value;
  const res = await getAllArticlebyApi({
    state: -1,
    subsetId: -2,
    serchTerm: request.serchTerm || '',
    classify: 1,
  })
  articleStore.data = res.data.list;
  articleStore.tempcount = res.data.list.length;
  count.value = articleStore.tempcount;
  getData();//获取当前分页数据
})
//当点击分类变化时，重新获取数据
watch(() => props.gallerysubset, async (newVal) => {
  request.state = -1;
  request.subsetId = -2;
  nowpage.value = 1;
  request.nowPage = nowpage.value;
  if (typeof newVal === 'number') {
    if (newVal !== -1) {
      request.subsetId = newVal;
      count.value = articleStore.data.filter(item => item.subset_id === newVal).length;
    } else {//全部
      request.subsetId = -2;
      nowpage.value = 1;
      request.nowPage = nowpage.value;
      count.value = articleStore.data.length;
    }
    getData();
  } else if (typeof newVal === 'string') {
      request.subsetId = -1;
      count.value = articleStore.data.filter(item => !item.subset_id).length;
    }
    getData();

  })
//获取图库分页 只有分页的时候才用
const getData = async () => {
  const res = await getArticleApi(request)
  if (res.code !== 200) {
    proxy.$message({ type: 'warning', message: '获取图库列表失败' })
    //图库列表为空 页面提示没有图库
    galleryList.value = []
    return
  }
  galleryList.value = res.data.list
  for (const item of galleryList.value) {
    item.content = JSON.parse(item.content as string) as Photo[];
  }
}
//获取所有的图库
const getAllData = async () => {
  const res = await getAllArticleApi(1)
  articleStore.data = res.data.list
  articleStore.count = res.data.list.length
  articleStore.tempcount = res.data.list.length
  count.value = articleStore.count
}
//删除图库
const deleteArticle = async (id: number) => {
  const res = await deleteArticleApi(id)
  if (res.code !== 200) {
    proxy.$message({ type: 'warning', message: '操作失败' })
    return
  }
  galleryList.value = galleryList.value.filter(item => item.id !== id)
  
  getAllData()
  getData()
  proxy.$message({ type: 'success', message: '删除成功' })
}
//分页变化
const changePage = (e: number) => {
  request.nowPage = e
  getData()
}
//首次加载
onMounted(() => {
  getData()
  getAllData()
  
})

</script>

<template>
  <div class="gallery">
    <div class="gallery-content">
      <div class="gallery-content-files">
        <GalleryItem @delete="deleteArticle" v-for="item in galleryList" :key="item.id"
          :data="item" />
      </div>
    </div>
    <div v-if="galleryList.length > 0" class="gallery_pagination">
      <yk-pagination v-model:current="nowpage" @change="changePage" :default-page-size="request.pageSize" :total="count" size="m" />
    </div>
    <yk-empty description="暂无文章" style="margin: 0 auto;" v-else />

  </div>
</template>

<style lang="less" scoped>
.gallery {
  width: 100%;
  background-color: @bg-color-l;
  padding: 32px 24px 24px;
  border-radius: @radius-m;

  &_pagination {
    padding: @space-s 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
  }

  &-content {
    display: inline;

    &-files {
      display: grid;
      grid-template-columns: repeat(auto-fill, 238px);
      row-gap: 32px;
      column-gap: 24px;
      justify-content: center;
    }
  }
}
</style>