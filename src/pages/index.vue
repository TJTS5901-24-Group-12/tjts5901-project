<script setup lang="ts">
import app from '../server/app'

defineOptions({
  name: 'IndexPage',
  data() {
    return {
      amount: 0 as number,
      price: 0 as number,
      bid: true as boolean,
      offer: false as boolean,
    }
  },
  methods: {
    submit() {
      if (this.amount > 0 && this.price > 0)
        app.validateTransaction(this.amount, this.price)
    },
    cancel() {
      this.amount = 0
      this.price = 0
      this.bid = false
      this.offer = false
    },
    isBid() {
      this.bid = true
      this.offer = false
    },
    isOffer() {
      this.offer = true
      this.bid = false
    },
  },
})

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
      <em text-sm>Latest traded price: <b><PriceLabel /></b> (fetched hourly)</em>
    </p>

    <div>
      <button
        style="width: 15%"
        m-3 text-sm bid-btn
        @click="isBid()"
      >
        {{ t('button.bid') }}
      </button>

      <button
        style="width: 15%"
        m-3 text-sm offer-btn
        @click="isOffer()"
      >
        {{ t('button.offer') }}
      </button>
    </div>

    <fieldset m-a w-xl border border-rd>
      <legend>{{ bid && !offer ? 'Bid' : 'Offer' }}</legend>
      <div w-full flex justify-center flex-items-center>
        <div flex flex-col flex-items-start>
          <em>{{ t(`intro.amount`) }}</em>
          <input
            id="input"
            v-model="amount"
            :placeholder="t('intro.amount')"
            type="number"
            p="y-2"
            w="220px"
            text="center"
            bg="transparent"
            border="~ rounded gray-200 dark:gray-700"
            outline="none active:none"
          >
        </div>

        <div flex flex-col flex-items-start style="margin-left: 22px;">
          <em>{{ t(`intro.price`) }}</em>
          <input
            id="input"
            v-model="price"
            :placeholder="t('intro.price')"
            type="number"
            p="y-2"
            w="220px"
            text="center"
            bg="transparent"
            border="~ rounded gray-200 dark:gray-700"
            outline="none active:none"
          >
        </div>
      </div>

      <p mb-2 mt-4>
        <em text-sm>Total: {{ amount && price ? amount * price : 0 }} USD</em>
      </p>
    </fieldset>

    <div>
      <button
        style="width: 15%"
        m-3 text-sm btn-default
        @click="cancel()"
      >
        {{ t('button.cancel') }}
      </button>

      {{ console.log(price, amount) }}
      <button
        style="width: 15%"
        m-3 text-sm btn-default
        :disabled="!price || !amount"
        data-test-id="confirm-button"
        @click="submit()"
      >
        {{ t('button.confirm') }}
      </button>
    </div>

    <!-- Mock data for bids and offers to show on UI -->
    <div flex-column m-auto mt-10 w-75 flex justify-center>
      <div>
        <b color-bluegray-800>Bids</b>
        <ul>
          <li>40 @ 102.8</li>
          <li>5 @ 101.4</li>
          <li>100 @ 101.2</li>
        </ul>
      </div>
      <div ml-12>
        <b color-bluegray-800>Offers</b>
        <ul>
          <li>250 @ 102.9</li>
          <li>900 @ 103.1</li>
          <li>1200 @ 103.2</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
