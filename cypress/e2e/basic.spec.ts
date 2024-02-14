context('Basic', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('navigate to Bid-button', () => {
    cy.url()
      .should('eq', 'http://localhost:3333/')

    cy.contains('Amount')
      .should('exist')

    cy.get('[bid-btn]')
      .click()
      .url()
      .should('eq', 'http://localhost:3333/')
  })

  it('navigate to Offer-button', () => {
    cy.url()
      .should('eq', 'http://localhost:3333/')

    cy.contains('Price')
      .should('exist')

    cy.get('[bid-btn]')
      .click()
      .url()
      .should('eq', 'http://localhost:3333/')
  })
})
