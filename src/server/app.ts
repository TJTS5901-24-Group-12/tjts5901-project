function fetchPrice() {
  const result = fetch('https://api.marketdata.app/v1/stocks/quotes/AAPL/')
    .then(response => response.json())
    .then((data) => { return Number.parseFloat(data.last) })
    .catch((error) => { throw new Error('Error fetching data:', error) })

  return result
}

async function validateTransaction(amount: number, price: number) {
  const lastPrice = await fetchPrice()

  // These are the maximum and minimum amounts of what the user could give as input
  const maxPrice = lastPrice * 1.1
  const minPrice = lastPrice * 0.9

  // Validates that amount is given
  if (!amount)
    throw new Error('Invalid amount of stocks')

  if (!Number.isInteger(amount))
    throw new Error('Quantity cannot be a float.')

  // Validate that price cannot go higher or lower than max price
  if (!price || price < minPrice || price > maxPrice)
    throw new Error('Price must be +-10% of the last traded price!')

  return true
}

function submitTransaction(amount: number, price: number, arr: Array<any>) {
  arr.push({ id: arr.length, amount, price })
}

export default { fetchPrice, validateTransaction, submitTransaction }
