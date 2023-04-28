/// <reference types="cypress" />

class TransactionPage {

    transactionId() {
        return cy.get('[data-cy="TransactionID"]', { timeout: 10000 }).invoke('text')
    }

    timeStamp() {
        return cy.get('[data-cy="Timestamp"]', { timeout: 10000 }).invoke('text')
    }

    block() {
        return cy.get('[data-cy="Block"]', { timeout: 10000 }).invoke('text')
    }

    type() {
        return cy.get('[data-cy="Type"]', { timeout: 10000 }).invoke('text')
    }

    //Operations

    compareObjects(obj1, obj2, skipProperties = []) {
        let props1 = Object.getOwnPropertyNames(obj1);
        let props2 = Object.getOwnPropertyNames(obj2);

        if (props1.length !== props2.length) {
            return false;
        }

        for (let i = 0; i < props1.length; i++) {
            let propName = props1[i];

            if (skipProperties.includes(propName)) {
                continue;
            }

            if (typeof obj1[propName] === 'object') {
                if (!this.compareObjects(obj1[propName], obj2[propName], skipProperties)) {
                    return false;
                }
            } else {
                if (obj1[propName] !== obj2[propName]) {
                    return false;
                }
            }
        }
        return true;
    }
}

export default new TransactionPage