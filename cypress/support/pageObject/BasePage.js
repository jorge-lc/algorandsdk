/// <reference types="cypress" />

class BasePage {
    //Operations

    ReloadBrowser(){
        cy.reload()
    }
}

export default new BasePage