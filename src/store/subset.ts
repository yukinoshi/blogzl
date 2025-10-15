import { defineStore } from 'pinia';
import type { SubsetData } from '../utils/interface';
export const useSubsetStore = defineStore('subset', {
  state: () => {
    return {
      count: 0,
      data: [] as SubsetData[]
    }
  },
  getters: {
    exclude: (state) => {
      let arr = []
      let n = state.count
      for (let i = 0; i < state.data.length; i++) {
        arr[i] = state.data[i].id
        n = n-state.data[i].value
      }
      return {id: arr.join(','), name: '未分类', value: n}
    }
  },
  actions: {
    subsetName(e?: number) {
      for (let i = 0; i < this.$state.data.length; i++) {
        if (this.$state.data[i].id === e) {
          return this.$state.data[i].name
        }
      }
      return '未分类'
    }
  }
})