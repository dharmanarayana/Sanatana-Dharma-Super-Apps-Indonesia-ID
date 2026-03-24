import { defineStore } from 'pinia'

interface CartItem {
  $id: string
  name: string
  price: number
  image?: string
  icon?: string
  quantity: number
  merchantId?: string
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),
  actions: {
    addItem(product: any) {
      const existing = this.items.find((item) => item.$id === product.$id)
      if (existing) {
        existing.quantity++
      } else {
        this.items.push({
          $id: product.$id,
          name: product.name,
          price: product.price,
          image: product.image,
          icon: product.icon,
          quantity: 1,
          merchantId: product.merchant_id
        })
      }
    },
    removeItem(id: string) {
      this.items = this.items.filter((item) => item.$id !== id)
    },
    updateQuantity(id: string, qty: number) {
      const item = this.items.find((i) => i.$id === id)
      if (item) {
        item.quantity = Math.max(1, qty)
      }
    },
    clearCart() {
      this.items = []
    }
  },
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: (state) => state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    isEmpty: (state) => state.items.length === 0
  },
  persist: true
})
