import { defineStore } from 'pinia'

export const useDoaStore = defineStore('doa', {
  state: () => ({
    doaList: [] as any[],
    doaDetails: {} as Record<string, any>,
    lastUpdated: 0
  }),
  actions: {
    setDoaList(list: any[]) {
      this.doaList = list
      this.lastUpdated = Date.now()
    },
    setDoaDetail(slug: string, detail: any) {
      this.doaDetails[slug] = detail
    },
    getDoaById(id: string) {
      return this.doaList.find(d => d.$id === id)
    },
    getDoaBySlug(slug: string) {
      return this.doaDetails[slug] || this.doaList.find(d => d.slug === slug)
    }
  },
  persist: true
})
