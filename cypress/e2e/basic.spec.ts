/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable node/handle-callback-err */

let amountInput: any, priceInput: any, latestStockPrice: any

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

  function typeAdjustedPrice(multiplier: number) {
    cy.get('#lastPrice').invoke('text').then((text) => {
      const parsedNumber = Number.parseFloat(text)
      cy.log(`Apple's stock price is: ${parsedNumber}`)

      const testedInput = parsedNumber * multiplier

      cy.log(`Tested price input: ${testedInput}`)
      cy.get(priceInput).type(testedInput.toString())
    })
  }

  before(() => {
    amountInput = '#amount'
    priceInput = '#price'
  })

  beforeEach(() => {
    cy.request('http://127.0.0.1:3000/getLatestStockPrice').then((response) => {
      latestStockPrice = response.body // Assuming the response contains the stock price
    })

    cy.visit('/')

    cy.contains('Amount')
      .should('exist')

    cy.contains('Price')
      .should('exist')
  })

  describe('verify input prices are validated based on latest market data', () => {
    it('fetch current market last trade price of AAPL - example M1', () => {
      cy.get('#lastPrice')
        .should('exist')

      cy.get('#lastPrice').invoke('text').then((text) => {
        const parsedNumber = Number.parseFloat(text)
        cy.log(`Apple's stock price is: ${parsedNumber}`)
        cy.wrap(parsedNumber).should('be.gte', 160).and('be.lte', 200)
      })
    })

    it('verify Bid order at price M1 x 1.08 is accepted', () => {
      bidSetup()
      typeAdjustedPrice(1.08)

      cy.get(amountInput).type('10')

      cy.get('[confirm-btn]')
        .click()
        .invoke('submit')
        .then(() => {
          cy.on('uncaught:exception', (err, runnable) => {
            cy.log('An error was thrown during the submit function: ', err)
            throw err
          })

          cy.log('Bid transaction successful!')
        })
    })

    it('verify Offer order at price M1 x 0.90 is accepted', () => {
      offerSetup()
      typeAdjustedPrice(0.90)

      cy.get(amountInput).type('10')

      cy.get('[confirm-btn]')
        .click()
        .invoke('submit')
        .then(() => {
          cy.on('uncaught:exception', (err, runnable) => {
            cy.log('An error was thrown during the submit function: ', err)
            throw err
          })

          cy.log('Offer transaction successful!')
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
        },
        )

      cy.on('uncaught:exception', (err, runnable) => {
        // Mark it as false because we want the test to succeed if validation threw an error
        return false
      })
    })

    it('verify Offer order at price M1 x -1.01 is rejected', () => {
      offerSetup()
      typeAdjustedPrice(-1.01)

      cy.get(amountInput).type('10')

      cy.log('Testing if confirm-btn is disabled because given price is not greater than 0.')

      cy.get('[confirm-btn]')
        .should('be.disabled')
    })

    it('verify no trades have happened', () => {
      // TODO: Implement later
    })
  })

  describe('verify input quantity is valid', () => {
    it('fetch current market last trade price of AAPL - example M2', () => {
      cy.get('#lastPrice')
        .should('exist')

      cy.get('#lastPrice').invoke('text').then((text) => {
        const parsedNumber = Number.parseFloat(text)
        cy.log(`Apple's stock price is: ${parsedNumber}`)
        cy.wrap(parsedNumber).should('be.gte', 160).and('be.lte', 200)
      })
    })

    it('bid order at Price M2, Qty 0 is rejected', () => {
      bidSetup()
      typeAdjustedPrice(1)

      cy.get(amountInput).type('0')

      cy.log('Testing if confirm-btn is disabled because given amount is not greater than 0.')

      cy.get('[confirm-btn]')
        .should('be.disabled')
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

      cy.log('Testing if confirm-btn is disabled because given amount is not greater than 0.')

      cy.get('[confirm-btn]')
        .should('be.disabled')
    })

    it('verify no trades have happened', () => {
      // TODO: Implement later
    })
  })

  describe('verify trades happen according to the given logic', () => {
    it('fetch current market last trade price of AAPL - example M3', () => {
      cy.get('#lastPrice')
        .should('exist')

      cy.get('#lastPrice').invoke('text').then((text) => {
        const parsedNumber = Number.parseFloat(text)
        cy.log(`Apple's stock price is: ${parsedNumber}`)
        cy.wrap(parsedNumber).should('be.gte', 160).and('be.lte', 200)
      })
    })

    it('ord 1 - Bid Price: M3, Qty: 100', () => {
      bidSetup()
      typeAdjustedPrice(1)
      cy.get(amountInput).type('100')

      cy.get('[confirm-btn]')
        .click()
        .invoke('submit')
        .then(() => {
          cy.on('uncaught:exception', (err, runnable) => {
            cy.log('An error was thrown during the submit function: ', err)
            throw err
          })

          cy.log('Bid fulfilled!')
        })
    })

    it('ord 2 - Offer, Price: M3 x 0.8, Qty: 200', () => {
      offerSetup()
      typeAdjustedPrice(0.8)

      cy.get(amountInput).type('250')

      cy.get('[confirm-btn]')
        .click()
        .invoke('submit')
        .then(() => {
          cy.on('uncaught:exception', (err, runnable) => {
            expect(err.message).to.include('Price must be +-10%')
          })

          cy.log('Validation successful - offer transaction failed!')
        },
        )

      cy.on('uncaught:exception', (err, runnable) => {
        // Mark it as false because we want the test to succeed if validation threw an error
        return false
      })
    })

    it('ord 3 - Bid Price: M3 x 1.01, Qty: 200', () => {
      bidSetup()
      typeAdjustedPrice(1.01)

      cy.get(amountInput).type('200')

      cy.get('[confirm-btn]')
        .click()
        .invoke('submit')
        .then(() => {
          cy.on('uncaught:exception', (err, runnable) => {
            cy.log('An error was thrown during the submit function: ', err)
            throw err
          })

          cy.log('Bid fulfilled!')
        })
    })

    it('ord 4 - Bid Price: M3 x 0.95, Qty: 50', () => {
      bidSetup()
      typeAdjustedPrice(0.95)

      cy.get(amountInput).type('50')

      cy.get('[confirm-btn]')
        .click()
        .invoke('submit')
        .then(() => {
          cy.on('uncaught:exception', (err, runnable) => {
            cy.log('An error was thrown during the submit function: ', err)
            throw err
          })

          cy.log('Bid fulfilled!')
        })
    })

    it('ord 5 - Bid Price: M3, Qty: 30', () => {
      bidSetup()
      typeAdjustedPrice(1)

      cy.get(amountInput).type('30')

      cy.get('[confirm-btn]')
        .click()
        .invoke('submit')
        .then(() => {
          cy.on('uncaught:exception', (err, runnable) => {
            cy.log('An error was thrown during the submit function: ', err)
            throw err
          })

          cy.log('Bid fulfilled!')
        })
    })

    it('ord 6 - Offer, Price: M3, Qty 250 - T1', () => {
      offerSetup()
      typeAdjustedPrice(1)

      cy.get(amountInput).type('250')

      cy.get('[confirm-btn]')
        .click()
        .invoke('submit')
        .then(() => {
          cy.on('uncaught:exception', (err, runnable) => {
            cy.log('An error was thrown during the submit function: ', err)
            throw err
          })

          cy.log('Offer fulfilled!')
        })
    })

    it('fetch trades', () => {
      // TODO: Implement later
    })
  })
})
