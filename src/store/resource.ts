import { defineStore } from 'pinia';
import type { ResourceData } from '../utils/interface';

export const useResourceStore = defineStore('resource', {
  state: () => {
    return {
      count: 0,
      tempcount: 0,
      data: [] as ResourceData[]
    }
  },
  getters: {

  },
  actions: {

  },
  persist: true,
})