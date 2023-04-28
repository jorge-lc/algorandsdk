/// <reference types="cypress" />

import homePage from '../../support/pageObject/HomePage';
import transactionPage from '../../support/pageObject/TransactionPage';
const ids = require('../../fixtures/ids.json');
const responseBody = require('../../fixtures/firstTestResponseBody.json');

describe('Automation challenge for C3', function(){
    beforeEach(() => {
        cy.visit('https://algoexplorer.io/');
      });
      
    it('Search transaction ID and intercept request', function(){
      var id = ids.firstTest;

      homePage.searchTransaction(id);
      cy.intercept(`https://indexer.algoexplorerapi.io/v2/transactions/${id}`).as('request');

      cy.wait('@request', {timeout: 15000}).then((test) => {
        cy.wrap(test.response.statusCode).should('eq', 200);
        assert.isTrue(transactionPage.compareObjects(test.response.body, responseBody, ['current-round', 'note', 'signature']));
      });
      cy.fixture('transactionInformation.json').then((jsonFile) => {
        transactionPage.transactionId().should('eq', jsonFile.transactionId);
        transactionPage.timeStamp().should('eq', jsonFile.timeStamp);
        transactionPage.block().should('eq', jsonFile.block);
        transactionPage.type().should('eq', jsonFile.type);
      });
    });
});