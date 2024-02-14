<script setup lang="ts">
defineOptions({
  name: 'IndexPage',
})

const user = useUserStore()
const amount = ref(user.amount)
const price = ref(user.price)
const bidSelected = ref(user.bidSelected)
const offerSelected = ref(user.offerSelected)
const { t } = useI18n()

function cancel() {
  bidSelected.value = false
  offerSelected.value = false
  price.value = 0
  amount.value = 0
}
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
      <!-- This should be done on backend to fetch the stock price -->
      <em text-sm>Latest traded price: <b>xxx.xx</b> (fetched hourly)</em>
    </p>

    <div>
      <button
        style="width: 15%"
        m-3 text-sm bid-btn
        @click="bidSelected = !bidSelected"
      >
        {{ t('button.bid') }}
      </button>

      <button
        style="width: 15%"
        m-3 text-sm offer-btn
        :disabled="bidSelected"
        @click="offerSelected = !offerSelected"
      >
        {{ t('button.offer') }}
      </button>
    </div>

    <fieldset m-a w-xl border border-rd>
      <legend>{{ bidSelected && !offerSelected ? 'Offer' : 'Bid' }}</legend>
      <div w-full flex justify-center flex-items-center>
        <div flex flex-col flex-items-start>
          <em>{{ t(`intro.amount`) }}</em>
          <TheInput
            v-model="amount"
            :placeholder="t('intro.amount')"
            autocomplete="false"
          />
        </div>

        <div flex flex-col flex-items-start style="margin-left: 22px;">
          <em>{{ t(`intro.price`) }}</em>
          <TheInput
            v-model="price"
            :placeholder="t('intro.price')"
            autocomplete="false"
          />
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
        @click="cancel"
      >
        {{ t('button.cancel') }}
      </button>

      <button
        style="width: 15%"
        m-3 text-sm btn-default
        :disabled="!price && !amount"
        data-test-id="confirm-button"
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
