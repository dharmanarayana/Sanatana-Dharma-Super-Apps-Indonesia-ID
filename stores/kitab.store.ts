import { defineStore } from 'pinia'

export const useKitabStore = defineStore('kitab', {
  state: () => ({
    kitabList: [] as any[],
    babLists: {} as Record<string, any[]>,
    slokaLists: {} as Record<string, any[]>,
    lastUpdated: 0
  }),
  actions: {
    setKitabList(list: any[]) {
      this.kitabList = list
      this.lastUpdated = Date.now()
    },
    setBabList(kitabSlug: string, list: any[]) {
      this.babLists[kitabSlug] = list
    },
    setSlokaList(kitabSlug: string, babNumber: string | number, list: any[]) {
      const key = `${kitabSlug}-${babNumber}`
      this.slokaLists[key] = list
    },
    getKitabBySlug(slug: string) {
      return this.kitabList.find(k => k.slug === slug)
    },
    getBabList(kitabSlug: string) {
      return this.babLists[kitabSlug] || []
    },
    getSlokaList(kitabSlug: string, babNumber: string | number) {
      const key = `${kitabSlug}-${babNumber}`
      return this.slokaLists[key] || []
    }
  },
  persist: true
})
