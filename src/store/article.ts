import { defineStore } from 'pinia';
import type { articleData } from '../utils/interface';

export const useArticleStore = defineStore('article', {
  state: () => {
    return {
      count: 0,
      data: [] as articleData[]
    }
  },
  getters: {
    exclude: (state) => {
      let n = state.count
      //计算未发布文章数量
      for (let i = 0; i < state.data.length; i++) {
        if (state.data[i].state === 0) {
          n--;
        }
      }
      return [{ id: 'unpublish', name: '未发布', value: n },{ id: 'publish', name: '已发布', value: state.count - n }]
    }
  },
  actions: {

  },
  persist: true,
})