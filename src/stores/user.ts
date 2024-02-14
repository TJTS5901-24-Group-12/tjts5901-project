import { acceptHMRUpdate, defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
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

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore as any, import.meta.hot))
