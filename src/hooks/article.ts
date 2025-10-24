import type { Ref } from "vue"
import { getArticleApi } from "../api/article"

export const getData = async (e: boolean, count: Ref<number>, articleStore: any, request: any, articleList: Ref<any[]>) => {
  if (e) {//首次加载从store获取总数
    count.value = articleStore.count
  }
  const res = await getArticleApi(request)
  articleStore.count = res.data.count
  articleStore.data = res.data.list
  articleList.value = res.data.list
}