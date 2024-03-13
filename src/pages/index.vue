<script setup lang="ts">
import { ref } from 'vue'
import app from '../server/app'
import { ApiService } from '../services/ApiService'

interface TransactionData {
  id: number
  amount: number
  price: number
  amountLeft: number
}

interface DealData {
  id: number
  bidId: number
  offerId: number
  amountSold: number
  price: number
  timeOfDeal: string
}

interface TransactionsAndDealsData {
  bids: TransactionData[]
  offers: TransactionData[]
  deals: DealData[]
}

const amount = ref(0)
const price = ref(0)
const bid = ref(true)
const offer = ref(false)
const lastPrice = ref(0)

const bidsOffersAndDealsData = ref<TransactionsAndDealsData>()

async function fetchData() {
  try {
    const bidsOffersAndDealsResult = await ApiService.getBidsOffersAndDeals()
    if (bidsOffersAndDealsResult)
      bidsOffersAndDealsData.value = bidsOffersAndDealsResult
    const lastPriceResult = await ApiService.getLatestStockPrice()
    if (lastPriceResult)
      lastPrice.value = lastPriceResult
  }
  catch (error) {
    console.error('Error fetching data:', error)
  }
};

async function startFetchingData() {
  fetchData()
  lastPrice.value = await ApiService.getLatestStockPrice()
  const intervalId = setInterval(fetchData, 10000)

  onBeforeUnmount(() => {
    clearInterval(intervalId)
  })
};

onMounted(startFetchingData)

async function validate(): Promise<boolean> {
  if (amount.value > 0 && price.value > 0)
    return await app.validateTransaction(amount.value, price.value)
  return false
}

async function submit(): Promise<void> {
  if (await validate()) {
    bid.value
      ? ApiService.addBid(amount.value, price.value).then(() => { setTimeout(fetchData, 1000) })
      : ApiService.addOffer(amount.value, price.value).then(() => { setTimeout(fetchData, 1000) })
  }
}

function cancel(): void {
  amount.value = 0
  price.value = 0
  isBid()
}

function isBid(): void {
  bid.value = true
  offer.value = false
}

function isOffer(): void {
  offer.value = true
  bid.value = false
}

const { t } = useI18n()
</script>

<template>
  <div>
    <div text-4xl>
      <div i-carbon-finance inline-block />
    </div>
    <p>
      <a rel="noreferrer" href="https://github.com/antfu/vitesse" target="_blank">
        Brokerage ABC
      </a>
    </p>
    <p>
      <em text-sm opacity-75>{{ t('intro.desc') }}</em>
    </p>

    <hr ml-auto mr-auto mt-6 w-100>

    <p mb-2 mt-6>
      <em text-sm>Latest traded price: <b id="lastPrice">
        {{ lastPrice }}
      </b> (fetched hourly)</em>
    </p>

    <div>
      <button style="width: 15%" m-3 text-sm bid-btn @click="isBid">
        {{ t('button.bid') }}
      </button>

      <button style="width: 15%" m-3 text-sm offer-btn @click="isOffer">
        {{ t('button.offer') }}
      </button>
    </div>

    <fieldset m-a w-xl border border-rd>
      <legend>{{ bid && !offer ? 'Bid' : 'Offer' }}</legend>
      <div w-full flex justify-center flex-items-center>
        <div flex flex-col flex-items-start>
          <em>{{ t(`intro.amount`) }}</em>
          <input
            id="amount" v-model="amount" :placeholder="t('intro.amount')" type="number" p="y-2" w="220px"
            text="center" bg="transparent" border="~ rounded gray-200 dark:gray-700" outline="none active:none"
          >
        </div>

        <div flex flex-col flex-items-start style="margin-left: 22px;">
          <em>{{ t(`intro.price`) }}</em>
          <input
            id="price" v-model="price" :placeholder="t('intro.price')" type="number" p="y-2" w="220px" text="center"
            bg="transparent" border="~ rounded gray-200 dark:gray-700" outline="none active:none"
          >
        </div>
      </div>

      <p mb-2 mt-4>
        <em text-sm>Total: {{ amount && price ? (amount * price)?.toFixed(2) : 0 }} USD</em>
      </p>
    </fieldset>

    <div>
      <button style="width: 15%" m-3 text-sm cancel-btn @click="cancel">
        {{ t('button.cancel') }}
      </button>

      <button
        style="width: 15%" m-3 text-sm confirm-btn
        @click="submit"
      >
        {{ t('button.confirm') }}
      </button>
    </div>

    <!-- Mock data for bids and offers to show on UI -->
    <div v-if="bidsOffersAndDealsData" class="flex-column m-auto mb-4 mt-8 w-150 flex justify-center">
      <div>
        <b class="color-bluegray-800">Bids</b>
        <ul v-if="bidsOffersAndDealsData.bids" id="bids">
          <li v-for="bidItem in bidsOffersAndDealsData.bids" :key="bidItem.id" :class="{ grayedout: bidItem.amountLeft === 0 }">
            ID: {{ bidItem.id + 1 }} [{{ bidItem.amountLeft }} / {{ bidItem.amount }}] @ {{ bidItem.price?.toFixed(2) }}
          </li>
        </ul>
      </div>
      <div class="ml-12">
        <b class="color-bluegray-800">Offers</b>
        <ul v-if="bidsOffersAndDealsData.offers" id="offers">
          <li v-for="offerItem in bidsOffersAndDealsData.offers" :key="offerItem.id" :class="{ grayedout: offerItem.amountLeft === 0 }">
            ID: {{ offerItem.id + 1 }} [{{ offerItem.amountLeft }} / {{ offerItem.amount }}] @ {{ offerItem.price?.toFixed(2) }}
          </li>
        </ul>
      </div>
    </div>

    <div v-if="bidsOffersAndDealsData">
      <b class="table-title color-bluegray-800">Trades</b>
    </div>
    <div v-if="bidsOffersAndDealsData" class="deals-arr m-auto mt-4 w-150 flex justify-center">
      <table v-if="bidsOffersAndDealsData.deals" class="styled-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dealItem in bidsOffersAndDealsData.deals" :key="dealItem.id">
            <td>{{ dealItem.timeOfDeal }}</td>
            <td>{{ dealItem.price }}</td>
            <td>{{ dealItem.amountSold }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style>
.grayedout {
  opacity: 0.5;
}

.table-title {
  font-size: 1.15em;
}

.styled-table {
  width: 80%;
  font-size: 0.9em;
}

.styled-table thead tr {
  background-color: #555a59;
  color: #ffffff;
  text-align: left;
}

.styled-table th,
.styled-table td {
  padding: 12px 15px;
  text-align: left;
}

.styled-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
  border-bottom: 1px solid #555a59;
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
