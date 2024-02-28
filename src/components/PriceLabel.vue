<script>
import app from '../server/app.ts'

export default {
  data() {
    return {
      lastPrice: null,
    }
  },
  created() {
    app.fetchPrice()
      .then((price) => { this.lastPrice = price })
      .catch((error) => { console.error('Error fetching stock data:', error) })
  },
}
</script>

<template>
  <span price-label>{{ lastPrice }}</span>
</template>
