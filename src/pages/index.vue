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
        <em text-sm>Total: {{ amount && price ? amount * price : 0 }} USD</em>
      </p>
    </fieldset>

    <div>
      <button style="width: 15%" m-3 text-sm cancel-btn @click="cancel">
        {{ t('button.cancel') }}
      </button>

      <button
        style="width: 15%" m-3 text-sm confirm-btn :disabled="!price || !amount"
        @click="submit"
      >
        {{ t('button.confirm') }}
      </button>
    </div>

    <!-- Mock data for bids and offers to show on UI -->
    <div v-if="bidsOffersAndDealsData" class="flex-column m-auto mt-10 w-150 flex justify-center">
      <div>
        <b class="color-bluegray-800">Bids</b>
        <ul v-if="bidsOffersAndDealsData.bids">
          <li v-for="bidItem in bidsOffersAndDealsData.bids" :key="bidItem.id" :class="{ grayedout: bidItem.amountLeft === 0 }">
            ID: {{ bidItem.id }} [{{ bidItem.amountLeft }} / {{ bidItem.amount }}] @ {{ bidItem.price }}
          </li>
        </ul>
      </div>
      <div class="ml-12">
        <b class="color-bluegray-800">Offers</b>
        <ul v-if="bidsOffersAndDealsData.offers">
          <li v-for="offerItem in bidsOffersAndDealsData.offers" :key="offerItem.id" :class="{ grayedout: offerItem.amountLeft === 0 }">
            ID: {{ offerItem.id }} [{{ offerItem.amountLeft }} / {{ offerItem.amount }}] @ {{ offerItem.price }}
          </li>
        </ul>
      </div>
      <div class="ml-12">
        <b class="color-bluegray-800">Deals</b>
        <ul v-if="bidsOffersAndDealsData.deals">
          <li v-for="dealItem in bidsOffersAndDealsData.deals" :key="dealItem.id">
            {{ dealItem.offerId }} -> {{ dealItem.bidId }} {{ dealItem.amountSold }} @ {{ dealItem.price }} At time: {{ dealItem.timeOfDeal }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
.grayedout {
  opacity: 0.5;
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
