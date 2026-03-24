import { defineStore } from 'pinia'

export const useNewsStore = defineStore('news', {
  state: () => ({
    newsList: [] as any[],
    newsDetails: {} as Record<string, any>,
    lastUpdated: 0
  }),
  actions: {
    setNewsList(list: any[]) {
      this.newsList = list
      this.lastUpdated = Date.now()
    },
    setNewsDetail(id: string, detail: any) {
      this.newsDetails[id] = detail
    },
    getNewsById(id: string) {
      return this.newsDetails[id] || this.newsList.find(n => n.$id === id)
    }
  },
  persist: true
})
