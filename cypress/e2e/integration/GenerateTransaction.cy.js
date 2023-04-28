/// <reference types="cypress" />
import algosdk from 'algosdk';
const mnemonicFile = 'cypress/fixtures/mnemonic.json';
const myAccountInfo = 'cypress/fixtures/myAccountInfo.json';

describe('Transaction using AlgoSDK', function(){
    let myAccount;
    const algodToken = '';
    const algodServer = 'https://testnet-api.algonode.cloud';
    const algodPort = 443;
    let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

    it('Get account address and secret key', function() {
        cy.readFile(mnemonicFile).then((json) => {            
            myAccount = algosdk.mnemonicToSecretKey(json.mnemonic);
        });
    });

    it('Check account balance', function(){        
        cy.readFile(myAccountInfo).then(async (json) => {
            json.globalInformation = {myAccount : await algodClient.accountInformation(myAccount.addr).do()};
            cy.log(`Account balance: ${json.globalInformation.myAccount.amount} microAlgos`);
            cy.writeFile(myAccountInfo, json);
        });        
    });

    it('Construct, sign in and submit the transaction',async function(){
        let params = await algodClient.getTransactionParams().do();
        params.fee = algosdk.ALGORAND_MIN_TX_FEE;
        params.flatFee = true;
        const receiver = "HZ57J3K46JIJXILONBBZOHX6BKPXEM2VVXNRFSUED6DKFD5ZD24PMJ3MVA";
        const enc = new TextEncoder();
        const note = enc.encode("C3 Challenge!");
        let amount = 1000;
        let sender = myAccount.addr;            
        let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: sender, 
            to: receiver, 
            amount: amount, 
            note: note, 
            suggestedParams: params
        });

        cy.readFile(myAccountInfo).then((json) => {
            json.globalInformation.txId = txn.txID().toString();
            cy.writeFile(myAccountInfo, json);
        });   

        let signedTxn = txn.signTxn(myAccount.sk);
        await algodClient.sendRawTransaction(signedTxn).do();           
    });

    it('Wait for confirmation', function(){
        cy.readFile(myAccountInfo).then({timeout : 20000}, async (json) => {
            json.globalInformation.confirmedTxn = await algosdk.waitForConfirmation(algodClient, json.globalInformation.txId, 20);
            cy.writeFile(myAccountInfo, json);
        });
    });

    it('Get the completed Transaction', function(){
        cy.readFile(myAccountInfo).then({timeout : 20000}, async (json) => {
            let txId = json.globalInformation.txId;
            let confirmedTxn = json.globalInformation.confirmedTxn;

            cy.log(`Transaction ${txId} confirmed in round ${confirmedTxn["confirmed-round"]}`);
            let accountInfo = await algodClient.accountInformation(myAccount.addr).do();
            cy.log(`Transaction Amount: ${confirmedTxn.txn.txn.amt} microAlgos`);
            cy.log(`Transaction Fee: ${confirmedTxn.txn.txn.fee} microAlgos`);
            cy.log(`Account balance: ${accountInfo.amount} microAlgos`);
        });        
    });
});