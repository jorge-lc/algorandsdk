/// <reference types="cypress" />

class HomePage {

    searchBar(){
        return cy.get('#searchbar')
    }

    searchButton(){
        return cy.get('[data-cy="searchbar"]')
    }

    //Operations

    searchTransaction(transactionId){
        this.searchBar().type(transactionId)
        this.searchButton().click()
    }
}

export default new HomePage