<script setup lang="ts">
import { onMounted, ref, getCurrentInstance, watch } from 'vue';
import ArticleItem from './article-item.vue';
import type { articleData, ReqGetArticle } from '../../utils/interface';
import { changeArticleStateApi, getArticleApi, deleteArticleApi, getAllArticleApi, getAllArticlebyApi } from '../../api/article';
import { useArticleStore } from '../../store/article';

const proxy: any = getCurrentInstance()?.proxy

const nowpage = ref<number>(1);
//渲染文章列表数据
const articleList = ref<articleData[]>([]);

const count = ref<number>(0);

const articleStore = useArticleStore();

type changeState = {
  id: number,
  state: number
}

const props = defineProps({
  pagesize: {
    type: Number,
    default: 6
  },
  subsetId: {
    type: Number,
    default: -2
  },
  state: {
    type: Number,
    default: -1
  },
  serchTerm: {
    type: String,
    default: ''
  },
  articlesubset: {
    type: [Number, String],
    default: ''
  }
})

const request: ReqGetArticle = {
  pageSize: props.pagesize,
  nowPage: nowpage.value,
  state: props.state,
  subsetId: props.subsetId,
  serchTerm: props.serchTerm,
  count: true,
  classify: 0 //文章
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
    classify: 0,
  })
  articleStore.data = res.data.list;
  articleStore.tempcount = res.data.list.length;
  count.value = articleStore.tempcount;
  getData();//获取当前分页数据
})
//当点击分类变化时，重新获取数据
watch(() => props.articlesubset, async (newVal) => {
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
    if (newVal === 'unpublish') {
      request.state = 0;
      count.value = articleStore.data.filter(item => item.state === 0).length;
    } else if (newVal === 'publish') {
      request.state = 1;
      count.value = articleStore.data.filter(item => item.state === 1).length;
    } else {//未分类
      request.subsetId = -1;
      count.value = articleStore.data.filter(item => !item.subset_id).length;
    }
    getData();
    
  }
})
//获取文章分页 只有分页的时候才用
const getData = async () => {
  const res = await getArticleApi(request)
  if (res.code !== 200) {
    proxy.$message({ type: 'warning', message: '获取文章列表失败' })
    //文章列表为空 页面提示没有文章
    articleList.value = []
    return
  }
  articleList.value = res.data.list
}
//获取所有的文章
const getAllData = async () => {
  const res = await getAllArticleApi(0)
  articleStore.data = res.data.list
  articleStore.count = res.data.list.length
  articleStore.tempcount = res.data.list.length
  count.value = articleStore.count
}
//删除文章
const deleteArticle = async (id: number) => {
  const res = await deleteArticleApi(id)
  if (res.code !== 200) {
    proxy.$message({ type: 'warning', message: '操作失败' })
    return
  }
  articleList.value = articleList.value.filter(item => item.id !== id)
  getAllData()
  getData()
  proxy.$message({ type: 'success', message: '删除成功' })
}
//更新文章状态
const updateState = async (obj: changeState) => {
  const res = await changeArticleStateApi({ articleId: obj.id, state: obj.state })
  if (res.code !== 200) {
    proxy.$message({ type: 'warning', message: '操作失败' })
    return
  }
  articleList.value.filter(item => {
    if (item.id === obj.id) {
      item.state = obj.state
    }
  })
  let submittext = obj.state === 0 ? '撤回成功' : '发布成功';
  proxy.$message({ type: 'success', message: submittext })
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
  <yk-space style="width: 100%;" dir="vertical" size="xl">
    <ArticleItem v-if="articleList.length > 0" @state="updateState" @delete="deleteArticle" v-for="item in articleList"
      :key="item.id" :data="item" />
    <div v-if="articleList.length > 0" class="article_pagination">
      <yk-pagination @change="changePage" :default-page-size="request.pageSize" v-model:current="nowpage" :total="count" size="m" />
    </div>
    <yk-empty description="暂无文章" style="margin-left: 50%;" v-else />
  </yk-space>
</template>

<style lang="less" scoped>
.article {
  &_pagination {
    padding: @space-s 0 @space-xl;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
  }
}
</style>