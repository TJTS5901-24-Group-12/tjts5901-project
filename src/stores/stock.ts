import { defineStore } from 'pinia'

export const useStockStore = defineStore('user', () => {
  const amount = ref(0)
  const price = ref(0)
  const bidSelected = ref(false)
  const offerSelected = ref(false)

  return {
    amount,
    price,
    bidSelected,
    offerSelected,
  }
})
