/* eslint-disable no-console */
import type { AxiosResponse } from 'axios'
import axios from 'axios'

const apiUrl = 'http://127.0.0.1:3000'

export const ApiService = {
  async addBid(amount: number, price: number) {
    axios.post(`${apiUrl}/addBid`, {
      amount,
      price,
    })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
  },

  async addOffer(amount: number, price: number) {
    axios.post(`${apiUrl}/addOffer`, {
      amount,
      price,
    })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
  },

  async getBidsOffersAndDeals() {
    try {
      const response: AxiosResponse<any> = await axios.get(`${apiUrl}/getBidsOffersAndDeals`)
      console.log(response.data)
      return response.data
    }
    catch (error) {
      console.error(error)
      throw error
    }
  },

  async getLatestStockPrice() {
    try {
      const response: AxiosResponse<any> = await axios.get(`${apiUrl}/getLatestStockPrice`)
      console.log(response.data)
      return response.data
    }
    catch (error) {
      console.error(error)
      throw error
    }
  },
}
