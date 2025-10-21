<script setup lang="ts">
import { onMounted, ref, getCurrentInstance } from 'vue';
import ArticleItem from './article-item.vue';
import { article } from '../../mock/data';
import type { articleData, ReqGetArticle } from '../../utils/interface';
import { getArticleApi } from '../../api/article';
import { useArticleStore } from '../../store/article';

const proxy: any = getCurrentInstance()?.proxy

const nowpage = ref<number>(1);

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
    default: -1
  },
  state: {
    type: Number,
    default: -1
  },
  serchTerm: {
    type: String,
    default: ''
  },
})

const request:ReqGetArticle = {
  pageSize: props.pagesize,
  nowPage: nowpage.value,
  state: props.state,
  subsetId: props.subsetId,
  serchTerm: props.serchTerm,
  count: true,
  classify: 0 //文章
}

const getData = async (e: boolean) => {
  if (e) {
    count.value = article.count
  }
  const res = await getArticleApi(request)
  articleStore.count = res.data.count
  articleStore.data = res.data.list
  let arr = article.list.slice(
    (request.nowPage - 1) * request.pageSize,
    request.nowPage * request.pageSize
  )
  articleList.value = arr
}

const deleteArticle = (id: number) => {
  articleList.value = articleList.value.filter(item => item.id !== id)
  proxy.$message({ type: 'success', message: '删除成功' })
}

const updateState = (obj: changeState) => {
  articleList.value.filter(item => {
    if (item.id === obj.id) {
      item.state = obj.state
    }
  })
  let submittext = obj.state === 0 ? '撤回成功' : '发布成功';
  proxy.$message({ type: 'success', message: submittext })
}

const changePage = (e: number) => {
  request.nowPage = e
  getData(false)
}

onMounted(() => {
  getData(true)
})

</script>

<template>
  <yk-space style="width: 100%;" dir="vertical" size="xl">
    <ArticleItem @state="updateState" @delete="deleteArticle" v-for="item in articleList" :key="item.id" :data="item" />
    <div class="article_pagination">
      <yk-pagination @change="changePage" :default-page-size="request.pageSize" :total="count" size="m" />
    </div>
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