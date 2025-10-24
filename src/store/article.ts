import { defineStore } from 'pinia';
import type { articleData } from '../utils/interface';

export const useArticleStore = defineStore('article', {
  state: () => {
    return {
      count: 0,
      tempcount: 0,
      countUnpublish: 0,
      data: [] as articleData[]
    }
  },
  getters: {
    exclude: (state) => {
      state.countUnpublish = 0
      state.data.map(item => {
        if (item.state === 0) {
          state.countUnpublish++
        }
      })
      return [{ id: 'unpublish', name: '未发布', value: state.countUnpublish }, { id: 'publish', name: '已发布', value: state.tempcount - state.countUnpublish }]
    }
  },
  actions: {

  },
  persist: true,
})