import axios from 'axios';
import qs from 'qs';
// import md5 from 'http://www.myersdaily.org/joseph/javascript/md5.js';
import MD5 from "crypto-js/md5";
import SHA512 from "crypto-js/sha512";
// import { data } from 'currency-codes';
// import Api from '../api/api.js';
import { Api } from '../api/api.js';
import { OlaPay } from '../api/olapay';

export var payAuthorizeNet = {

    clerkId: 1,

    // endPointURL: "https://apitest.authorize.net/xml/v1/request.api",
    // apiLoginId: "28gw3VWb",
    // transactionKey: "9d5Ubw5L6J7P7cGn",
    
    endPointURL: 'https://sls-eus-dev-serverless-succes-api.azurewebsites.net/api/',

    setClerkId: function(clerkId){
        this.clerkId = clerkId
    },

    activatePaymentMethod: async function(datas){

        const payMethod = datas.payMethod
        let items = {}

        if (payMethod === 'SHIFT4')
        {
            items = {
                "authToken": datas.authToken
            }

            return Api.autenticateShift4(items)
        }
        throw new Error("Debe especificar en método de pago")
    },

    captureOrder: async function(invoice, moto, restaurantId, payMethod){
        if (payMethod === 'SHIFT4')
        {
            try {

                const res = await Api.captureShift4(invoice, moto, restaurantId);
                if (res.status == 200 && res.statusText === "OK"){ 
                    const response1 = {
                        "total": res.data[0].amount.total,
                        "transId": res.data[0].transaction.invoice,
                        "accountNumber": res.data[0].card.number,
                        "expirationCard": '',
                        "accountType": res.data[0].card.type,
                        "method": 'Authorization',
                        "moto": moto,
                    } 
                    console.log(response1)
                    return response1;
                }
                
            } catch (error) {
                console.log(error)
                throw new Error("Try another payment method")  
            }
        }
        if (payMethod === 'TSYS')
        {
            try {
                  const item = {
                    "transactionID": invoice
                    }

                console.log('Capture in TSYS. con invoice : ' + invoice)

                const res = await Api.captureTsys(item, restaurantId);
                console.log('RESPONSE delCapture in TSYS.')
                console.log(res);
                if (res.status == 200 && res.statusText === "OK" && res.data.CaptureResponse.status ==='PASS'){ 
                    const capRes = await Api.invoiceTsys(invoice, restaurantId);
                    if (capRes.status == 200 && capRes.statusText === "OK" && capRes.data.GetReportDataResponse.status ==='PASS'){ 
                        const response1 = {
                            "total": capRes.data.GetReportDataResponse.reportData.ROW.amount,
                            "transId":capRes.data.GetReportDataResponse.reportData.ROW.invoiceNumber,
                            "accountNumber": capRes.data.GetReportDataResponse.reportData.ROW.cardNumber,
                            "expirationCard": '',
                            "accountType": capRes.data.GetReportDataResponse.reportData.ROW.cardType,
                            "method": 'Authorization',
                            "moto": moto,
                        } 
                        console.log(response1)
                        return response1;
                    }
                  
                }
                
            } catch (error) {
                console.log(error)
                throw new Error("Try another payment method")  
            }
        }
        if (payMethod === 'OlaPay')
        {
            try {
                console.log('Capture in OLAPAY. con invoice : ' + invoice)
                const item = { 
                    'Search': { "trans_id": invoice, }                       
                }              
                const resp = await OlaPay.search(this.ip, this.port, this.ssl, item);
                if(resp){
                    const item = { 
                        'Capture':{
                            "Amount": resp.total,     
                            "TransactionID": invoice
                        }                      
                    }
                    this.spinner = true;
                    const respCapture = await OlaPay.capture(this.ip, this.port, this.ssl, item);
                    if(respCapture){
                        console.log('respCapture: '+ respCapture)
                        const item1 = { 
                            'Search': { "trans_id": respCapture, }                       
                        } 
                        const search = await OlaPay.search(this.ip, this.port, this.ssl, item1);
                        if(search){
                            const response1 = {
                                "total": search.total,
                                "transId":search.transId,
                                "accountNumber": '',
                                "expirationCard": '',
                                "accountType": search.accountType,
                                "method": 'Authorization',
                                "moto": false,
                            } 
                            return response1;
                        }                        
                    }   
                }
                 
            } catch (error) {
                console.log(error)
                throw new Error("Try another payment method")  
            }
        }

        return false
    },

    firstAuthorizeOrder: async function(datas, moto)
    {
        const restaurantId = datas.restaurantId
        const payMethod = datas.payMethod
        let invoiceNumber = ''
        
        let items = {}

       if (payMethod === 'SHIFT4')
        {
            
            let prodNames = []
            if (datas.products)  datas.products.forEach(p => { prodNames.push(p.Name)});

            if(datas.invoiceNumber){                
                invoiceNumber = datas.invoiceNumber;                
                const invoiceCreated = await this.invoiceInformation(invoiceNumber, moto, restaurantId,payMethod );
                if(invoiceCreated){
                    
                    items = JSON.parse(JSON.stringify(invoiceCreated.data[0])) ; 
                    console.log(' items');
                    delete items.dateTime;
                    delete items.receiptColumns;
                    delete items.device;
                    delete items.receipt;
                    delete items.server,
                    delete items.transaction.authorizationCode;
                    delete items.transaction.authSource;
                    delete items.transaction.responseCode;
                    delete items.transaction.saleFlag;
                    delete items.card.entryMode;
                    delete items.card.present;
                    console.log(items)
                    items.amount.tax = datas.tax;
                    items.amount.total =datas.total;
                    items.amount.tip = datas.tip;
                    if(items.transaction.purchaseCard)
                        if(items.transaction.purchaseCard.productDescriptors)
                            items.transaction.purchaseCard.productDescriptors = prodNames;  
                    items.customer = {
                        "addressLine1": datas.address,
                        "firstName": datas.firstName,
                        "lastName": datas.lastName,
                        "postalCode": datas.zip,
                    }                     
                }
                 
            }
            else{
                const invoiceSequence = await Api.getInvoiceSequence(restaurantId)
                invoiceNumber = invoiceSequence.data;
                const resObj = await Api.fetchById('Restaurant', restaurantId);
                console.log('CLERK ID: '+ this.clerkId)

                items = {
                    "amount": {
                      "tax": datas.tax,
                      "total": datas.total,
                      "tip": datas.tip,
                    },
                    "clerk":{
                        "numericId": this.clerkId
                    },
                    // "apiOptions": ["ALLOWPARTIALAUTH"],
                    "card": {
                      "entryMode": "M",
                      "present": "N",
                      "expirationDate": datas.cardExpirationDateF1, //1221
                      "number": datas.cardNumber,
                      "securityCode": {
                          "indicator": 1,
                          "value": datas.cardSecurityCode
                      }
                    },
                    "transaction": {
                        "invoice": invoiceNumber,
                        "purchaseCard": {
                            "customerReference": invoiceNumber,
                            "destinationPostalCode": resObj.data.ZipCode,
                            "productDescriptors": prodNames
                        },
                    },
                    "customer": {
                        "addressLine1": datas.address,
                        "firstName": datas.firstName,
                        "lastName": datas.lastName,
                        "postalCode": datas.zip,
                    }              
                  }
                if(datas.googlePayToken)
                    items.googlePayToken = datas.googlePayToken;
                 if(datas.applePayToken)
                    items.applePayToken = datas.applePayToken;
                if(datas.p2pe)  {
                     items.p2pe = { "data": datas.p2pe, "format": '01' }
                     items.card.entryMode="";
                     items.card.present="";
                     items.card.securityCode.indicator="";
                     moto = 'moto';
                }                   
                if(datas.p2pe && !datas.zip && !datas.cardSecurityCode && !datas.address ){
                    // items.card.entryMode="";
                    // items.card.present="";
                    moto = 'fb'  }

                    console.log('iTEM TO PAY')
                    console.log(JSON.parse(JSON.stringify(items)))
            }


            try {
                const ipClient = await Api.getClientIp();                
                console.log('ip client: ');
                console.log(ipClient.data.ip);
                console.log(JSON.stringify(items));
                const res = await Api.authorizeShift4(items, moto, restaurantId, ipClient.data.ip); 
                console.log(res);
        
                if (res.status == 200 && res.statusText === "OK" && !res.data.msg){ 
                    console.log('response authorization')
                    console.log(res.data[0]);
                    const response1 = {
                        "total": res.data[0].amount.total,
                        "transId": res.data[0].transaction.invoice,
                        "accountNumber": res.data[0].card.number,
                        "expirationCard": datas.cardExpirationDateF1,
                        "accountType": res.data[0].card.type,
                        "method": 'Card',
                        "moto": moto,
                    }
                    if(datas.googlePayToken)
                        response1.method = 'Google Pay'
                    if(datas.applePayToken)
                        response1.method = 'Apple Pay'                    

                    console.log(response1)
                    return response1;
                }
                else
                {
                    console.log(res)
                    return false;
                }
                
            } catch (error) {
                console.log(error)
                return false;
               // throw new Error("Try another payment method")  
            }

             
        }        
        if (payMethod === 'TSYS')
        {            
            let items;

            if(datas.trackData)
            items = {
                "Auth": {   
                    "deviceID": "x",
                    "transactionKey": "x",                
                    "cardDataSource": "SWIPE",
                    "transactionAmount":  datas.total,
                    "track1Data": datas.trackData,
                    "terminalCapability": "ICC_CHIP_READ_ONLY",
                    "terminalOperatingEnvironment": "ON_MERCHANT_PREMISES_ATTENDED",
                    "cardholderAuthenticationMethod": "NOT_AUTHENTICATED", 
                    "developerID": "x",
                }
            }
            else{
                //Buscar el token de la card.
                const token =  await Api.tokenCardTsys({"cardNumber": datas.cardNumber}, restaurantId) ;                
                let cardToken = '';
                if(token.status && token.data.GetOnusTokenResponse)
                    cardToken = token.data.GetOnusTokenResponse.token;
                
                console.log('TOKEN') ;
                console.log(cardToken);

                items = {
                    "Auth": {   
                        "deviceID": "x",
                        "transactionKey": "x",                
                        "cardDataSource": "MANUAL",
                        "transactionAmount":  datas.total,
                        "cardNumber": cardToken, //datas.cardNumber,
                        "expirationDate": datas.cardExpirationDateF1,
                        "cvv2": datas.cardSecurityCode,
                        "cardHolderName": datas.firstName + ' '+  datas.lastName,
                        "addressLine1": datas.address,
                        "zip": datas.zip,
                        "terminalCapability": "ICC_CHIP_READ_ONLY",
                        "terminalOperatingEnvironment": "ON_MERCHANT_PREMISES_ATTENDED",
                        "cardholderAuthenticationMethod": "NOT_AUTHENTICATED", 
                        "developerID": "x",
                    }
                } 
            }
           
            try {               
                const res = await Api.authorizeTsys(items, restaurantId); 
                console.log(res);
        
                if (res.status == 200 && res.statusText === "OK" && res.data.AuthResponse.status ==='PASS'){ 
                    console.log('response authorization')
                    console.log();
                    const response1 = {
                        "total": res.data.AuthResponse.transactionAmount,
                        "transId": res.data.AuthResponse.transactionID,
                        "accountNumber": res.data.AuthResponse.maskedCardNumber,
                        "expirationCard": '',
                        "accountType": res.data.AuthResponse.cardType,
                        "method": 'Card',
                        "moto": moto,
                    }   
                    console.log(response1)
                    return response1;
                }
                else
                { console.log('FALSE')
                    console.log(res)
                   
                    return false;
                }
                
            } catch (error) {
                console.log(error)
                return false;
               // throw new Error("Try another payment method")  
            }

             
        }   
        return true;
    },

    payOrder: async function(datas)
    {
        const restaurantId = datas.restaurantId
        const payMethod = datas.payMethod

        let items = {}

       if (payMethod === 'SHIFT4')
        {
            const invoiceSequence = await Api.getInvoiceSequence(restaurantId)
            const resObj = await Api.fetchById('Restaurant', restaurantId)                               
            console.log('CLERK ID: '+ this.clerkId)

            let prodNames = []
            if (datas.products)
            {
                datas.products.forEach(p => {
                    prodNames.push(p.Name)
                });
            }

            items = {
                "amount": {
                  "tax": datas.tax,
                  "total": datas.total,
                  "tip": datas.tip,
                },
                "clerk":{
                    "numericId": this.clerkId
                },
                // "apiOptions": ["ALLOWPARTIALAUTH"],
                "card": {
                  "entryMode": "M",
                  "present": "N",
                  "expirationDate": datas.cardExpirationDateF1, //1221
                  "number": datas.cardNumber,
                  "securityCode": {
                      "indicator": 1,
                      "value": datas.cardSecurityCode
                  }
                },
                "transaction": {
                    "invoice": invoiceSequence.data,
                    "purchaseCard": {
                        "customerReference": invoiceSequence.data,
                        "destinationPostalCode": resObj.data.ZipCode,
                        "productDescriptors": prodNames
                    },
                },
                "customer": {
                    "addressLine1": datas.address,
                    "firstName": datas.firstName,
                    "lastName": datas.lastName,
                    "postalCode": datas.zip,
                }              
              }
              if(datas.googlePayToken)
                items.googlePayToken = datas.googlePayToken;
              if(datas.applePayToken)
                items.applePayToken = datas.applePayToken;
              if(datas.p2pe)  {
                   items.p2pe = { "data": datas.p2pe, "format": '01' }
                   items.card.entryMode="";
                   items.card.present=""; 
                   items.card.securityCode.indicator="";
              }

              console.log('iTEM TO PAY')
              console.log(JSON.parse(JSON.stringify(items)))
               
            //   if(datas.p2pe && !datas.zip && !datas.cardSecurityCode && !datas.address ){
            //       items.card.entryMode="";
            //       items.card.present="";  }

            try {
                const ipClient = await Api.getClientIp();
                console.log('ip client: ');
                console.log(ipClient.data.ip);
                console.log(JSON.stringify(items));

                const res = await Api.payShift4(items, restaurantId, ipClient.data.ip); 
             
                console.log(res);

                console.log('RESPONSE CODE : '+ res.data[0].transaction.responseCode)
        
                if (res.status == 200 && res.statusText === "OK" && res.data[0].transaction.responseCode !== 'D'){ 
                    if(res.data[0].transaction.responseCode === 'P')
                     return new Error("Partial authorization. Enter a second form of payment.");
                     else{
                        const response1 = {
                            "total": res.data[0].amount.total,
                            "transId": res.data[0].transaction.invoice,
                            "accountNumber": res.data[0].card.number,
                            "expirationCard": datas.cardExpirationDateF1,
                            "accountType": res.data[0].card.type,
                            "method": 'Card',
                            "moto": false,
                        }
                        if(datas.googlePayToken)
                            response1.method = 'Google Pay'
                        if(datas.applePayToken)
                            response1.method = 'Apple Pay'
                        if(datas.p2pe && datas.zip && datas.cardSecurityCode && datas.address )
                            response1.moto = 'moto';
                        if(datas.p2pe && !datas.zip && !datas.cardSecurityCode && !datas.address )
                            response1.moto = 'fb';
    
                        console.log(response1)
                        return response1;
                         
                     }
                   
                }
                else
                {
                    console.log(res)
                    return "Error"
                }
                
            } catch (error) {
                console.log(error)
                throw new Error("Try another payment method")  
            }

             
        }
        else if (payMethod === 'AUTH')
        {
            items = {
                "transactionType":"authCaptureTransaction",
                "amount": datas.total,
                "payment":
                {
                    "creditCard":
                    {
                        "cardNumber": datas.cardNumber,
                        "expirationDate": datas.cardExpirationDateF2 //2021-12
                    }
                },
                "tax":{
                    "amount": datas.tax,
                    "name": datas.taxName 
                },
                "billTo": {
                    "firstName": datas.firstName,
                    "lastName": datas.lastName,
                    "address": datas.address,
                    "zip": datas.zip,
                },
            }
            try {
             const res =  await Api.payAutorizeNet(items, restaurantId)            
                if (res.status == 200 && res.statusText === "OK")
                {
                    console.log('response authorize');
                    console.log(res)
                   
                    return {
                        "total": parseFloat(items.amount),
                        "transId": res.data.transactionResponse.networkTransId,
                        "accountNumber": res.data.transactionResponse.accountNumber,
                        "expirationCard": datas.cardExpirationDateF2,
                        "accountType": res.data.transactionResponse.accountType,
                        "method": 'Card',
                        "moto": false,
                    }
                }
                else
                {
                    console.log(res)
                    return "Error"
                }           
                
            } catch (error) {
                console.log(error)
                throw new Error("Problem contact with Authorize.net")
            }
        } 
        else if (payMethod === 'TSYS')
        {
            if(datas.trackData)
                items = {
                    "Sale": {   
                        "deviceID": "x",
                        "transactionKey": "x",                
                        "cardDataSource": "SWIPE",
                        "transactionAmount":  datas.total,
                        "track1Data": datas.trackData,
                        "terminalCapability": "ICC_CHIP_READ_ONLY",
                        "terminalOperatingEnvironment": "ON_MERCHANT_PREMISES_ATTENDED",
                        "cardholderAuthenticationMethod": "NOT_AUTHENTICATED", 
                        "developerID": "x",
                    }
                }
            else{
                //Buscar el token de la card.
                const token =  await Api.tokenCardTsys({"cardNumber": datas.cardNumber}, restaurantId) ;                
                let cardToken = '';
                if(token.status && token.data.GetOnusTokenResponse)
                    cardToken = token.data.GetOnusTokenResponse.token;
                
                console.log('TOKEN') ;
                console.log(cardToken);

                items = {
                    "Sale": {   
                        "deviceID": "x",
                        "transactionKey": "x",                
                        "cardDataSource": "MANUAL",
                        "transactionAmount":  datas.total,
                        "cardNumber": cardToken, //datas.cardNumber,
                        "expirationDate": datas.cardExpirationDateF1,
                        "cvv2": datas.cardSecurityCode,
                        "cardHolderName": datas.firstName + ' '+  datas.lastName,
                        "addressLine1": datas.address,
                        "zip": datas.zip,
                        "terminalCapability": "ICC_CHIP_READ_ONLY",
                        "terminalOperatingEnvironment": "ON_MERCHANT_PREMISES_ATTENDED",
                        "cardholderAuthenticationMethod": "NOT_AUTHENTICATED", 
                        "developerID": "x",
                    }
                } 
            }
               
            
            try {
             const res =  await Api.payTsys(items, restaurantId)            
                if (res.status == 200 && res.statusText === "OK" && res.data.SaleResponse.status ==='PASS')
                {
                    console.log('response Tsys');
                    console.log(res)
                   
                    return {
                        "total": res.data.SaleResponse.transactionAmount,
                        "transId": res.data.SaleResponse.transactionID,
                        "accountNumber": res.data.SaleResponse.maskedCardNumber,
                        "expirationCard": '',
                        "accountType": '',
                        "method": 'Card',
                        "moto": false,
                    }
                }
                else
                {
                    console.log(res)
                    throw new Error("Error, Try another payment method")
                }           
                
            } catch (error) {
                console.log(error)
                throw new Error("Try another payment method");
            }
        } 
        
        return true;
    },

    payQrOrder: async function(datas){
        
        const restaurantId = datas.restaurantId
        const payMethod = datas.payMethod
        const invoiceSequence = await Api.getInvoiceSequence(restaurantId)
       
        let items = {}

        if (payMethod === 'SHIFT4')
        {
            items = { 
                "amount": {
                  "total": parseFloat(datas.total),
                  "tax": parseFloat(datas.tax),
                  "tip": parseFloat(datas.tip)
                },
                "transaction": {                 
                  "saleFlag": datas.saleFlag,
                  "invoice": invoiceSequence.data, 
                }
              }  

              console.log('before send qr')
              console.log(items)

            try {

                const res = await Api.payQrShift4(items, restaurantId);   
                console.log(res.status)             
                console.log(res.data.value)             
                if (res.status == 200 && res.data.value !== undefined){                    
                    return res.data.value;
                }
                else
                {
                    console.log(res)
                    return "Error"
                }
                
            } catch (error) {
                console.log(error)
                throw new Error("Problem contact with Qr Shift4")  
            }             
        }
        if (payMethod === 'AUTH')
        {
           console.log('qr payment y authorize net');
        } 


    },

    validateStatusQrOrder: async function(datas){
        
        const restaurantId = datas.restaurantId
        const payMethod = datas.payMethod
       
        let items = {}

        if (payMethod === 'SHIFT4')
        {
            items = {
                "qrCode": {
                  "value": datas.qrCode
                }
              }

              console.log('before validate qr')
              console.log(items)

            try {
                const res = await Api.validateStatusQrShift4(items, restaurantId);   
                console.log(res)             
                console.log(res.status)             
                console.log(res.data.result[0])             
                if (res.status == 200 && res.data.result[0].transaction){    
                    const response1 = {
                        "total": res.data.result[0].amount.total,
                        "transId": res.data.result[0].transaction.invoice,
                        "accountNumber": res.data.result[0].card.number,
                        "expirationCard": "",
                        "accountType": res.data.result[0].card.type,
                        "method": 'Qr',
                        "moto": false,
                    }
                    console.log(response1)
                    return response1;  
                }
                else
                {
                    console.log(res)
                    return "Error"
                }
                
            } catch (error) {
                console.log(error)
                throw new Error("Problem contact with Qr Shift4")  
            }             
        }
        if (payMethod === 'AUTH')
        {
           console.log('qr payment y authorize net');
        } 
    },

    cancelStatusQrOrder: async function(datas){
        
        const restaurantId = datas.restaurantId
        const payMethod = datas.payMethod
       
        let items = {}

        if (payMethod === 'SHIFT4')
        {
            items = {
                "qrCode": {
                  "value": datas.qrCode
                }
              }
              console.log('before validate qr')
              console.log(items)

            try {
                const res = await Api.cancelQrShift4(items, restaurantId);   
                console.log(res.status)             
                console.log(res.data.value)             
                if (res.status == 200 && res.data.result[0].transaction.responseCode === 'C'){  
                    return res.data.result[0].transaction;  
                }
                else{
                    console.log(res)
                    return "Error"
                }
                
            } catch (error) {
                console.log(error)
                throw new Error("Problem contact with Qr Shift4")  
            }             
        }
        if (payMethod === 'AUTH')
        {
           console.log('qr payment y authorize net');
        } 
    },

    /* Format Datas*{
        token: '',
        restaurantId: '',
        payMethod: '',
        total: 200,
        cardNumber: 4568,
        cardExpirationDateF1: '',
        cardExpirationDateF2: ''
        invoiceNumber: "",
    }*/
    refundOrder: async function(datas, moto){
        console.log("REFUND en Payment")
        const restaurantId = datas.restaurantId
        const invoiceSequence = await Api.getInvoiceSequence(restaurantId)
        const payMethod = datas.payMethod

        let items = {}

        if (payMethod === 'SHIFT4')
        {
                            
            console.log('CLERK ID: '+ this.clerkId)
           
            items = {
                "amount": {
                  "total": datas.total
                },
                "clerk":{
                    "numericId": this.clerkId
                },
                "card": {
                    "entryMode": "M",
                    "present": "N",
                    "token": {
                        "value": datas.token
                    }
                //   "expirationDate": datas.cardExpirationDateF1,
                //   "number": datas.cardNumber
                },
                "transaction": {
                  "invoice": invoiceSequence.data
                }
            }
            console.log('iTEM TO REFUND')
            console.log(JSON.parse(JSON.stringify(items)))
            // return;
            return Api.refoundShift4(items, moto, restaurantId)
        }

        if (payMethod === 'AUTH')
        {
            items = {
                "transactionType": "refundTransaction",
                "amount": datas.total,
                "payment": {
                    "creditCard": {
                        "cardNumber":  datas.cardNumber,
                        "expirationDate": datas.cardExpirationDateF2 //2021-12
                    }
                },
               "refTransId": datas.invoiceNumber
            }

            return Api.refoundAutorizeNet(items, restaurantId)
        }

        if (payMethod === 'OlaPay')
        {
            try {
                console.log('refund in OLAPAY. con invoice : ' + datas.invoiceNumber)
                const item = { 
                    'Return':{
                        "Amount": datas.total,     
                        "TransactionID": datas.invoiceNumber
                    }
                }              
                const resp = await OlaPay.goReturn(this.ip, this.port, this.ssl, item);
                console.log('RESPONSE RETURN OLAPAY')
                console.log(resp);
                return resp;
              
            }
            catch(error){
                console.log(error)
            }
        }

        throw new Error("Debe especificar en metodo de pago")
    },

    invoiceInformation: async function(invoice, moto, restaurantId, payMethod){
        if (payMethod === 'SHIFT4')
        {
            try {

                const res = await Api.invoiceInformationShift4(invoice, moto, restaurantId);
                return res;
                
            } catch (error) {
                console.log(error)
                throw new Error("Try another payment method")  
            }
        }

        return false
    },

    void: async function(invoice, moto, restaurantId, payMethod){
        if (payMethod === 'SHIFT4')
        {
            try {

                const res = await Api.voidShift4(invoice, moto, restaurantId);
                return res;
                
            } catch (error) {
                console.log(error)
                throw new Error("Try another payment method")  
            }
        }
        //if (payMethod === 'TSYS')
        if (payMethod === 'OlaPay')
        {
            try {
                console.log('Void in OLAPAY. con invoice : ' + invoice)
                const item = { 
                    'Search': { "trans_id": invoice, }                       
                }              
                const resp = await OlaPay.search(this.ip, this.port, this.ssl, item);
                if(resp){
                    const item = { 
                        'Void':{
                            "Amount": resp.total,     
                            "TransactionID": invoice
                        }                      
                    }
                    const respVoid = await OlaPay.goVoid(this.ip, this.port, this.ssl, item);
                    if(respVoid){
                        console.log('Response VOID OLAPAY');
                        console.log(respVoid)
                        return respVoid;
                    }
                }
            }
            catch(error){
                console.log(error)
            }
        }

        return false
    },

    payQuotation: async function(payDatas, endPointURL){    
        return await axios.post(endPointURL, payDatas, {headers: {'Content-Type': 'application/json'}}) 
    },

    pay: async function(payDatas, endPointURL, apiLoginId, transactionKey){       

        let datas = {}

        if (payDatas.transactionRequest.shipping){

            datas = {
                "createTransactionRequest": {
                    "merchantAuthentication": {
                        "name": apiLoginId,
                        "transactionKey": transactionKey
                    },
                    // "refId": "123456",
                    "transactionRequest": {
                        "transactionType": "authCaptureTransaction",
                        "amount": payDatas.transactionRequest.amount, //Total amount of the transaction, include tax, shipping, other charges...
                        "payment": {
                            "creditCard": {
                                "cardNumber": payDatas.transactionRequest.payment.creditCard.cardNumber,
                                "expirationDate": payDatas.transactionRequest.payment.creditCard.expirationDate, //format YYYY-MM
                                 "cardCode":  payDatas.transactionRequest.payment.creditCard.cardCode
                            }
                        },
                        "lineItems": payDatas.transactionRequest.lineitems,
                        "tax": { //Opcional
                            "amount": payDatas.transactionRequest.tax.amount,
                            "name": payDatas.transactionRequest.tax.name
                            // "description": "level2 tax"
                        },
                        // "duty": {
                        //     "amount": "8.55",
                        //     "name": "duty name",
                        //     "description": "duty description"
                        // },
                        "shipping": {
                            "amount": payDatas.transactionRequest.shipping.amount,
                            "name": payDatas.transactionRequest.shipping.name
                            // "description": "level2 tax"
                        },
                        "poNumber": payDatas.transactionRequest.poNumber, //Id de la orden
                        "customer": {
                            "id": payDatas.transactionRequest.customer.id,
                            "email": payDatas.transactionRequest.customer.email
                        }
                        // "billTo": {
                        //     "firstName": "Ellen",
                        //     "lastName": "Johnson",
                        //     "company": "Souveniropolis",
                        //     "address": "14 Main Street",
                        //     "city": "Pecan Springs",
                        //     "state": "TX",
                        //     "zip": "44628",
                        //     "country": "USA"
                        // },
                        // "shipTo": {
                        //     "firstName": "China",
                        //     "lastName": "Bayles",
                        //     "company": "Thyme for Tea",
                        //     "address": "12 Main Street",
                        //     "city": "Pecan Springs",
                        //     "state": "TX",
                        //     "zip": "44628",
                        //     "country": "USA"
                        // },
                        // "customerIP": "192.168.1.1",
                        // "transactionSettings": {
                        //     "setting": {
                        //         "settingName": "testRequest",
                        //         "settingValue": "false"
                        //     }
                        // },
                        // "userFields": {
                        //     "userField": [
                        //         {
                        //             "name": "MerchantDefinedFieldName1",
                        //             "value": "MerchantDefinedFieldValue1"
                        //         },
                        //         {
                        //             "name": "favorite_color",
                        //             "value": "blue"
                        //         }
                        //     ]
                        // }
                    }
                }
            }

        }
        else{

            datas = {
                "createTransactionRequest": {

                    "transactionRequest": {
                        "transactionType": "authCaptureTransaction",
                        "amount": payDatas.transactionRequest.amount, //Total amount of the transaction, include tax, shipping, other charges...
                        "payment": {
                            "creditCard": {
                                "cardNumber": payDatas.transactionRequest.payment.creditCard.cardNumber,
                                "expirationDate": payDatas.transactionRequest.payment.creditCard.expirationDate //format YYYY-MM
                            }
                        },
                        "lineItems": payDatas.transactionRequest.lineitems,
                        "tax": { 
                            "amount": payDatas.transactionRequest.tax.amount,
                            "name": payDatas.transactionRequest.tax.name
                        },
                        "poNumber": payDatas.transactionRequest.poNumber, //Id de la orden
                        "customer": {
                            "id": payDatas.transactionRequest.customer.id,
                            "email": payDatas.transactionRequest.customer.email
                        }
                    }
                }
            }

        }

        console.log("Data obj:");
        console.log(datas);
        return await axios.post(endPointURL, datas, {headers: {'Content-Type': 'application/json'}})
    },

    refund: async function(refundDatas, endPointURL, apiLoginId, transactionKey){

        let datas = {}

        datas = {
            "createTransactionRequest": {
                "merchantAuthentication": {
                    "name": apiLoginId,
                    "transactionKey": transactionKey
                },
                // "refId": "123456",
                "transactionRequest": {
                    "transactionType": "refundTransaction",
                    "amount": refundDatas.amount,
                    "payment": {
                        "creditCard": {
                            "cardNumber": refundDatas.cardNumber,
                            "expirationDate": refundDatas.expirationDate
                        }
                    },
                    "refTransId": refundDatas.refTransId
                }
            }
        }

        console.log("Data obj:");
        console.log(datas);
        return await axios.post(endPointURL, datas, {headers: {'Content-Type': 'application/json'}})

    },

    //Numeros convertidos a string 
    formatThousand: function(input)
    {
        var num = input.replace(/,/g,'');
        num = num.toString().split('').reverse().join('').replace(/(?=\d*,?)(\d{3})/g,'$1,');
        num = num.split('').reverse().join('').replace(/^[,]/,'');
        input = num;
        return input;
    },

    payEvo2: async function(){

        const customerEmail = 'tony@example.net'
        const merchant_order_id = '504529047'
        const total_subtotal = '1000.00'
        const total = '1001.00'
        const code = 'solutionsforsuccess'

        let total_subtotal_thousand = this.formatThousand(total_subtotal)
        let total_thousand = this.formatThousand(total)

        const plaint = code+customerEmail+merchant_order_id+total_thousand+total_subtotal_thousand+'xrh6F4eGbPNJeypJ8hf8';
        const signature = MD5(plaint);


        // var request = require("request");

        // var options = { method: 'POST',
        // url: 'https://cert-hp.evosnap.com/srv/checkout/',
        // headers: 
        // { 'postman-token': '7c6242dc-0c80-40ca-df69-e5ff179db3a3',
        //     'cache-control': 'no-cache',
        //     'content-type': 'application/x-www-form-urlencoded' },
        // form: 
        // { 'customer[email]': 'tony@example.net',
        //     'customer[last_name]': 'Tony',
        //     'customer[first_name]': 'Test',
        //     'order[merchant_order_id]': '504529045',
        //     'order[total_subtotal]': '1000.00',
        //     'order[total_tax]': '1.00',
        //     'order[total]': '1001.00',
        //     'order[total_shipping]': '0.00',
        //     'order_item[0][sku]': '36160111USA',
        //     'order_item[0][name]': 'KWT1601SF(24")Wine Clr Rt Pref',
        //     'order_item[0][price]': '1000.00',
        //     'order_item[0][tax]': '1.00',
        //     'order_item[0][qty]': '1.00',
        //     return_url: 'http://mystore.com/return',
        //     cancel_url: 'http://mystore.com/cancel',
        //     code: 'solutionsforsuccess',
        //     checkout_layout: 'iframe',
        //     action: 'order',
        //     return: 'json',
        //     create_token: '1',
        //     mac: 'ce97935385b0072f3e820c93fce58b13' } };

        //     request(options, function (error, response, body) {
        //     if (error) throw new Error(error);

        //     console.log(body);
        //     });


                var data = qs.stringify({
                    'customer[email]': customerEmail,
                    'customer[first_name]': 'Test',
                    'customer[last_name]': 'Booth',
                    'order[merchant_order_id]': merchant_order_id,
                    'order[total_subtotal]': total_subtotal,
                    'order[total_tax]': '1.00',
                    'order[total]': total,
                    'order[total_shipping]': '0.00',
                    'order_item[0][sku]': '36160111USA',
                    'order_item[0][name]': 'KWT1601SF(24)Wine Clr Rt Pref',
                    'order_item[0][price]': '1000.00',
                    'order_item[0][tax]': '1.00',
                    'order_item[0][qty]': '1.00',
                    return_url: 'http://mystore.com/return',
                    cancel_url: 'http://mystore.com/cancel',
                    code: code,
                    checkout_layout: 'iframe',
                    action: 'order',
                    return: 'json',
                    create_token: '1',
                    mac: signature.toString() 
                });

                // var data = {
                //     'customer[email]': payData.customer.email,
                //     'customer[first_name]': payData.customer.first_name,
                //     'customer[last_name]': payData.customer.last_name,
                //     'order[merchant_order_id]': payData.order.merchant_order_id,
                //     'order[total_subtotal]': payData.order.total_subtotal,
                //     'order[total_tax]': payData.order.total_tax,
                //     'order[total]': payData.order.total,
                //     'order[total_shipping]': payData.total_shipping,
                //     'return_url': payData.return_url,
                //     'cancel_url': payData.cancel_url,
                //     'code': payData.code,
                //     'checkout_layout': 'iframe',
                //     'action': 'order',
                //     'return': 'json',
                //     'create_token': '1', 
                // };

                // //Poner los items
                // let count = 0;
                // payData.order_item.forEach(item => {
                //     data['order_item'][count]['sku'] = item[count].sku
                //     data['order_item'][count]['name'] = item[count].name
                //     data['order_item'][count]['price'] = item[count].price
                //     data['order_item'][count]['tax'] = item[count].tax
                //     data['order_item'][count]['qty'] = item[count].qty
                // });

                // //Generate mac
                // const authKey = 'xrh6F4eGbPNJeypJ8hf8';
                // const plaint = data.code+data.customer['email']+data.order['merchant_order_id']+
                //                             data.order['total_subtotal']+data.order['total']+authKey;
                // const signature = MD5(plaint);
                // data['mac'] = signature;

                //Convertir a cadena el objeto data
                // data = qs.stringify(data);

                // var config = {
                //     method: 'post',
                //     url: 'https://cert-hp.evosnap.com/srv/checkout/',
                //     headers: { 
                //         'Content-Type': 'application/x-www-form-urlencoded', 
                //         // 'Cookie': 'EvoSnap=2474aaf05fe0bc4965411'
                //     },
                //     data : data
                // };
                
                // axios(config)
                // .then(function (response) {
                //     // console.log(JSON.stringify(response.data));
                //     if (response.data.success == 1)
                //     {
                //         console.log(response.data.url);    
                //     }
                //     else{
                //         console.log(response.data)
                //     }
                // })
                // .catch(function (error) {
                //     console.log(error);
                // });

        axios.post('https://cert-hp.evosnap.com/srv/checkout/', data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})

    },

    payCardStream: async function(){
        
        console.log("2")
        let req = [
            {
                merchantID: '100001',
                action: 'SALE',
                type: 1,
                countryCode: 826,
                currencyCode: 826,
                amount: 1001,
                orderRef: 'Test purchase',
                redirectURL: '',
            }
        ]

        const key = 'Circle4Take40Idea';

        //ksort(req);
        req = req.sort();

        console.log("3")

        // let ret = http_build_query(ret, '', '&');
        let ret = req.toString()

        console.log("4")

        ret = ret.replace(Array('%0D%0A', '%0A%0D', '%0D'), '%0A', ret);

        console.log("5")

        // console.log(hash('SHA512', ret . key))
        var hash = SHA512(ret + key)

        console.log("6")
        console.log(hash.toString())
        console.log("7")

        console.log(JSON.stringify(ret))
        // ret[0]["signature"] = hash.toString()
        console.log("8")

        let req1 = qs.stringify(
            {
                "merchantID": "100001",
                "action": "SALE",
                "type": 1,
                "countryCode": 826,
                "currencyCode": 826,
                "amount": 1001,
                "orderRef": 'Test purchase',
                "redirectURL": '',
                "signature": hash.toString()
            }
        )

        // let req1 = [
        //     {
        //         merchantID: '100001',
        //         action: 'SALE',
        //         type: 1,
        //         countryCode: 826,
        //         currencyCode: 826,
        //         amount: 1001,
        //         orderRef: 'Test purchase',
        //         redirectURL: '',
        //         signature: hash.toString()
        //     }
        // ]

        return await axios.post("https://gateway.cardstream.com/hosted/", req1)
         
    },

    payEVO: async function(){
        const customer = 'tony@example.net'
        const authKey = 'xrh6F4eGbPNJeypJ8hf8'
        const code = 'solutionsforsuccess'
        // const action = 'order'
        // const ret = 'json'
        const merchant_order_id = '504529044'

        const plaint = code+customer+merchant_order_id+"1001.00"+"1000.00"+authKey
        console.log(plaint)
        console.log("ESTO")
        const signature = MD5('solutionsforsuccesstony@example.net5045290441001')
        console.log(signature.toString())

        let datas = {
                "order": {
                    "merchant_order_id": merchant_order_id,
                    "total_subtotal": 20,
                    "total_tax": 5,
                    "total": 25,
                },
                "order_item": [
                    {
                        "sku": '1001',
                        "name": 'THE COCKTAIL PARTYSmall serves up to 24 people',
                        "price": 20,
                        "tax": 5,
                        "qty": 1,
                    }
                ],
            "mac": signature
        }

        console.log(datas)
        return;

        // return await axios.post("https://cert-hp.evosnap.com/srv/checkout/", datas)
    }
    
}