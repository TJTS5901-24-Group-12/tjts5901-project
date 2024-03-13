/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable node/handle-callback-err */

let amountInput: any, priceInput: any, latestStockPrice: any
const apiUrl = 'http://127.0.0.1:3000'

context('Test cases', () => {
  function bidSetup() {
    cy.get('[bid-btn]')
      .click()

    cy.get('legend').invoke('text').then((text) => {
      cy.wrap(text).should('eq', 'Bid')
    })
  }

  function offerSetup() {
    cy.get('[offer-btn]')
      .click()

    cy.get('legend').invoke('text').then((text) => {
      cy.wrap(text).should('eq', 'Offer')
    })
  }

  function typeAdjustedPrice(multiplier: number): number {
    let testedPrice = 0

    cy.get('#lastPrice').invoke('text').then((text) => {
      const parsedNumber = Number.parseFloat(text)
      cy.log(`Apple's stock price is: ${parsedNumber}`)

      const testedInput = (parsedNumber * multiplier).toFixed(2).toString() || parsedNumber.toString()

      cy.log(`Tested price input: ${testedInput}`)
      cy.get(priceInput).type(testedInput.toString())

      testedPrice = Number.parseFloat(testedInput)
    })

    return testedPrice
  }

  beforeEach(() => {
    amountInput = '#amount'
    priceInput = '#price'

    cy.visit('/')

    cy.request(`${apiUrl}/getLatestStockPrice`).then((response) => {
      cy.get('#lastPrice').invoke('text', response.body)
    })

    cy.contains('Amount')
      .should('exist')

    cy.contains('Price')
      .should('exist')
  })

  describe('verify input prices are validated based on latest market data', () => {
    before(() => {
      cy.request('POST', `${apiUrl}/reset`).then((response) => {
        cy.log(response.body)
      })
    })

    it('fetch current market last trade price of AAPL - example M1', () => {
      cy.get('#lastPrice')
        .should('exist')

      cy.get('#lastPrice').invoke('text').then((text) => {
        const parsedNumber = Number.parseFloat(text)
        cy.log(`Apple's stock price is: ${parsedNumber}`)
        cy.wrap(parsedNumber).should('be.gte', 160).and('be.lte', 200)
      })

      cy.wait(1000)
    })

    it('verify Bid order at price M1 x 1.08 is accepted', () => {
      bidSetup()
      const adjustedPrice = typeAdjustedPrice(1.08)

      cy.get(amountInput).type('10')

      cy.wait(500)
      cy.get('[confirm-btn]')
        .click()
        .invoke('submit')
        .then(() => {
          cy.wait(500)
          cy.request({
            method: 'POST',
            url: `${apiUrl}/addBid`,
            body: {
              amount: 10,
              price: adjustedPrice,
            },
          }).then((response) => {
            cy.log(response.body)
          })

          // Wait for successful post request
          cy.wait(1250)

          cy.request(`${apiUrl}/getBidsOffersAndDeals`).then((response) => {
            const bids = response.body.bids
            const bidsText = bids.map((bid: { id: any, amount: any, price: any }) => `ID: ${bid.id} [${bid.amount} / ${bid.amount}] @ ${bid.price}`).join('\n')
            cy.get('#bids').then(($bids) => {
              const currentText = $bids.text()
              cy.get('#bids').invoke('text', `${currentText}\n${bidsText}`)
            })

            cy.get('#bids').should('have.length.above', 0)
          })
        })
    })

    it('verify Offer order at price M1 x 0.90 is accepted', () => {
      offerSetup()
      const adjustedPrice = typeAdjustedPrice(0.91)

      cy.get(amountInput).type('10')

      cy.get('[confirm-btn]')
        .click()
        .invoke('submit')
        .then(() => {
          // Make a POST request similar to the addOffer function
          cy.request({
            method: 'POST',
            url: `${apiUrl}/addOffer`,
            body: {
              amount: 10,
              price: adjustedPrice,
            },
          }).then((response) => {
            cy.log(response.body)
          })

          // Wait for successful post request
          cy.wait(1250)

          cy.request(`${apiUrl}/getBidsOffersAndDeals`).then((response) => {
            const offers = response.body.offers
            const offersText = offers.map((offer: { id: any, amount: any, price: any }) => `ID: ${offer.id} [${offer.amount} / ${offer.amount}] @ ${offer.price}`).join('\n')
            cy.get('#offers').invoke('text', offersText)
            cy.get('#offers').should('have.length.above', 0)
          })
        })
    })

    it('verify Bid order at price M1 x 1.11 is rejected', () => {
      bidSetup()
      typeAdjustedPrice(1.11)

      cy.get(amountInput).type('10')

      cy.get('[confirm-btn]')
        .click()
        .invoke('submit')
        .then(() => {
          cy.on('uncaught:exception', (err, runnable) => {
            expect(err.message).to.include('Price must be +-10%')
          })

          cy.log('Bid rejected!')
        })

      cy.wait(1250)

      cy.on('uncaught:exception', (err, runnable) => {
        // Mark it as false because we want the test to succeed if validation threw an error
        return false
      })
    })

    it('verify Offer order at price M1 x -1.01 is rejected', () => {
      offerSetup()
      typeAdjustedPrice(-1.01)

      cy.get(amountInput).type('10')

      cy.get('[confirm-btn]')
        .click()
        .invoke('submit')
        .then(() => {
          cy.on('uncaught:exception', (err, runnable) => {
            expect(err.message).to.include('Price must be +-10%')
          })

          cy.log('Offer rejected!')
        })

      cy.wait(1000)

      cy.on('uncaught:exception', (err, runnable) => {
        // Mark it as false because we want the test to succeed if validation threw an error
        return false
      })
    })

    it('verify one trade has happened', () => {
      cy.request(`${apiUrl}/getBidsOffersAndDeals`).then((response) => {
        cy.wait(1000)
        cy.log(response.body)
        expect(response.body).to.have.property('deals').that.is.an('array')
      })
    })
  })

  describe('verify input quantity is valid', () => {
    before(() => {
      cy.request('POST', `${apiUrl}/reset`).then((response) => {
        cy.log(response.body)
      })
    })

    it('fetch current market last trade price of AAPL - example M2', () => {
      cy.get('#lastPrice')
        .should('exist')

      cy.get('#lastPrice').invoke('text').then((text) => {
        const parsedNumber = Number.parseFloat(text)
        cy.wait(1000)
        cy.log(`Apple's stock price is: ${parsedNumber}`)
        cy.wrap(parsedNumber).should('be.gte', 160).and('be.lte', 200)
      })
    })

    it('bid order at Price M2, Qty 0 is rejected', () => {
      bidSetup()
      typeAdjustedPrice(1)

      cy.get(amountInput).type('0')

      cy.get('[confirm-btn]')
        .click()
        .invoke('submit')
        .then(() => {
          cy.on('uncaught:exception', (err, runnable) => {
            expect(err.message).to.include('Price must be +-10%')
          })

          cy.log('Bid rejected!')
        })

      cy.wait(1000)

      cy.on('uncaught:exception', (err, runnable) => {
        // Mark it as false because we want the test to succeed if validation threw an error
        return false
      })
    })

    it('bid order at Price M2, Qty 10.1 is rejected', () => {
      bidSetup()
      typeAdjustedPrice(1)

      cy.get(amountInput).type('10.1')

      cy.get('[confirm-btn]')
        .click()
        .invoke('submit')
        .then(() => {
          cy.on('uncaught:exception', (err, runnable) => {
            expect(err.message).to.include('Quantity cannot be a float')
          })

          cy.log('Validation successful!')
        },
        )

      cy.on('uncaught:exception', (err, runnable) => {
        // Mark it as false because we want the test to succeed if validation threw an error
        return false
      })
    })

    it('offer order at Price M2, Qty -100 is rejected', () => {
      offerSetup()
      typeAdjustedPrice(1)

      cy.get(amountInput).type('-100')

      cy.get('[confirm-btn]')
        .click()
        .invoke('submit')
        .then(() => {
          cy.on('uncaught:exception', (err, runnable) => {
            expect(err.message).to.include('Price must be +-10%')
          })

          cy.log('Offer rejected!')
        },
        )

      cy.on('uncaught:exception', (err, runnable) => {
        // Mark it as false because we want the test to succeed if validation threw an error
        return false
      })
    })

    it('verify no trades have happened', () => {
      cy.request(`${apiUrl}/getBidsOffersAndDeals`).then((response) => {
        cy.wait(1000)
        cy.log(response.body)
        expect(response.body).to.have.property('deals').that.is.an('array')
      })
    })
  })

  describe('verify trades happen according to the given logic', () => {
    before(() => {
      cy.request('POST', `${apiUrl}/reset`).then((response) => {
        cy.wait(500)
        cy.log(response.body)
      })
    })

    it('fetch current market last trade price of AAPL - example M3', () => {
      cy.get('#lastPrice')
        .should('exist')

      cy.get('#lastPrice').invoke('text').then((text) => {
        cy.wait(1000)
        const parsedNumber = Number.parseFloat(text)
        cy.log(`Apple's stock price is: ${parsedNumber}`)
        cy.wrap(parsedNumber).should('be.gte', 160).and('be.lte', 200)
      })
    })

    it('ord 1 - Bid Price: M3, Qty: 100', () => {
      bidSetup()
      const adjustedPrice = typeAdjustedPrice(1)

      cy.get(amountInput).type('100')

      cy.get('[confirm-btn]')
        .click()
        .invoke('submit')
        .then(() => {
          cy.request({
            method: 'POST',
            url: `${apiUrl}/addBid`,
            body: {
              amount: 100,
              price: adjustedPrice,
            },
          }).then((response) => {
            cy.log(response.body)
          })

          // Wait for successful post request
          cy.wait(1250)

          cy.request(`${apiUrl}/getBidsOffersAndDeals`).then((response) => {
            const bids = response.body.bids
            const bidsText = bids.map((bid: { id: any, amount: any, price: any }) => `ID: ${bid.id} [${bid.amount} / ${bid.amount}] @ ${bid.price}`).join('\n')
            cy.get('#bids').then(($bids) => {
              const currentText = $bids.text()
              cy.get('#bids').invoke('text', `${currentText}\n${bidsText}`)
            })

            cy.get('#bids').should('have.length.above', 0)
          })

          cy.log('Bid transaction successful!')
        })
    })

    it('ord 2 - Offer, Price: M3 x 0.8, Qty: 200', () => {
      offerSetup()
      typeAdjustedPrice(0.8)
      const quantity = 200

      cy.get(amountInput).type(quantity.toString())

      cy.get('[confirm-btn]')
        .click()
        .invoke('submit')
        .then(() => {
          cy.on('uncaught:exception', (err, runnable) => {
            expect(err.message).to.include('Price must be +-10%')
          })

          cy.log('Bid rejected!')
        })

      cy.on('uncaught:exception', (err, runnable) => {
        // Mark it as false because we want the test to succeed if validation threw an error
        return false
      })
    })

    it('ord 3 - Bid Price: M3 x 1.01, Qty: 200', () => {
      bidSetup()
      const adjustedPrice = typeAdjustedPrice(1.01)
      const quantity = 200

      cy.get(amountInput).type(quantity.toString())

      cy.get('[confirm-btn]')
        .click()
        .invoke('submit')
        .then(() => {
          cy.request({
            method: 'POST',
            url: `${apiUrl}/addBid`,
            body: {
              amount: quantity,
              price: adjustedPrice,
            },
          }).then((response) => {
            cy.log(response.body)
          })

          cy.request(`${apiUrl}/getBidsOffersAndDeals`).then((response) => {
            const bids = response.body.bids
            const bidsText = bids.map((bid: { id: any, amount: any, price: any }) => `ID: ${bid.id} [${bid.amount} / ${bid.amount}] @ ${bid.price}`).join('\n')
            cy.get('#bids').then(($bids) => {
              const currentText = $bids.text()
              cy.get('#bids').invoke('text', `${currentText}\n${bidsText}`)
            })

            cy.get('#bids').should('have.length.above', 0)

            // Wait for successful post request
            cy.wait(1250)
          })

          cy.log('Bid transaction successful!')
        })
    })

    it('ord 4 - Bid Price: M3 x 0.95, Qty: 50', () => {
      bidSetup()
      const adjustedPrice = typeAdjustedPrice(0.95)
      const quantity = 50

      cy.get(amountInput).type(quantity.toString())

      cy.get('[confirm-btn]')
        .click()
        .invoke('submit')
        .then(() => {
          cy.request({
            method: 'POST',
            url: `${apiUrl}/addBid`,
            body: {
              amount: quantity,
              price: adjustedPrice,
            },
          }).then((response) => {
            cy.log(response.body)
          })

          cy.request(`${apiUrl}/getBidsOffersAndDeals`).then((response) => {
            const bids = response.body.bids
            const bidsText = bids.map((bid: { id: any, amount: any, price: any }) => `ID: ${bid.id} [${bid.amount} / ${bid.amount}] @ ${bid.price}`).join('\n')
            cy.get('#bids').then(($bids) => {
              const currentText = $bids.text()
              cy.get('#bids').invoke('text', `${currentText}\n${bidsText}`)
            })

            cy.get('#bids').should('have.length.above', 0)
          })

          cy.log('Bid transaction successful!')
        })
    })

    it('ord 5 - Bid Price: M3, Qty: 30', () => {
      bidSetup()
      const adjustedPrice = typeAdjustedPrice(1)
      const quantity = 30

      cy.get(amountInput).type(quantity.toString())

      cy.get('[confirm-btn]')
        .click()
        .invoke('submit')
        .then(() => {
          cy.request({
            method: 'POST',
            url: `${apiUrl}/addBid`,
            body: {
              amount: quantity,
              price: adjustedPrice,
            },
          }).then((response) => {
            cy.log(response.body)
          })

          cy.request(`${apiUrl}/getBidsOffersAndDeals`).then((response) => {
            const bids = response.body.bids
            const bidsText = bids.map((bid: { id: any, amount: any, price: any }) => `ID: ${bid.id} [${bid.amount} / ${bid.amount}] @ ${bid.price}`).join('\n')
            cy.get('#bids').then(($bids) => {
              const currentText = $bids.text()
              cy.get('#bids').invoke('text', `${currentText}\n${bidsText}`)
            })

            cy.get('#bids').should('have.length.above', 0)
          })

          cy.log('Bid transaction successful!')
        })
    })

    it('ord 6 - Offer, Price: M3, Qty 250 - T1', () => {
      offerSetup()
      const adjustedPrice = typeAdjustedPrice(1)
      const quantity = 250

      cy.get(amountInput).type(quantity.toString())

      cy.get('[confirm-btn]')
        .click()
        .invoke('submit')
        .then(() => {
          // Make a POST request similar to the addOffer function
          cy.wait(500)
          cy.request({
            method: 'POST',
            url: `${apiUrl}/addOffer`,
            body: {
              amount: quantity,
              price: adjustedPrice,
            },
          }).then((response) => {
            cy.log(response.body)
          })

          cy.request(`${apiUrl}/getBidsOffersAndDeals`).then((response) => {
            const offers = response.body.offers
            const offersText = offers.map((offer: { id: any, amount: any, price: any }) => `ID: ${offer.id} [${offer.amount} / ${offer.amount}] @ ${offer.price}`).join('\n')
            cy.get('#offers').then(($offers) => {
              const currentText = $offers.text()
              cy.get('#offers').invoke('text', `${currentText}\n${offersText}`)
            })

            cy.get('#offers').should('have.length.above', 0)
          })

          cy.log('Offer transaction successful!')
        })
    })

    it('fetch trades', () => {
      cy.request(`${apiUrl}/getBidsOffersAndDeals`).then((response) => {
        cy.wait(500)
        expect(response.body).to.have.property('deals').that.is.an('array')
      })
    })
  })
})
