import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      id: -1,
      name: '',
      token: '',
      avatarIndex: 0,//头像索引
    }
  },
  getters: {

  },
  actions: {

  },
  persist: true,
})