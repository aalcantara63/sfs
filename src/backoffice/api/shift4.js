import axios from 'axios';

export var shift4 = {
    //Endpoint url
    EndPointURL: 'https://utgapi.shift4test.com/api/rest/v1/transactions/sale',

    //Client GUID
    ClientGUID: 'A9B58E64-DF10-8298-397FB8C9B36BC823',

    //Test AuthToken
    AuthToken: 'AF63DBEE-DC8B-B071-3B5FA7C29D613CDE',

    //Headers
    InterfaceVersion: '1.0',
    InterfaceName: 'iMenuApps',
    CompanyName: 'Solutions for Success LLC',

    paySale: async function(){
        const headers = {
            "InterfaceVersion": this.InterfaceVersion,
            "InterfaceName": this.InterfaceName,
            "CompanyName": this.CompanyName,
            "AccessToken": "07B18295-3E2C-41A8-B62A-18BA618F878F",
            "Content-Type": "application/json"
        }

        const data = {
            "dateTime": "2018-06-21T09:18:23.283-07:00",
            "amount": {
              "tax": 15,
              "total": 120
            },
            "card": {
              "entryMode": "M",
              "expirationDate": 1221,
              "number": 2221000000000009,
              "securityCode": {
                  "indicator": 1,
                  "value": 999
              }
            },
            "clerk": {
              "numericId": 1576
            },
            "transaction": {
              "invoice": "192030",
              "notes": "Transaction notes are added here",
              "purchaseCard": {
                "customerReference": "D019D09309F2",
                "destinationPostalCode": "94719",
                "productDescriptors": [
                  "Cookie",
                  "Fries",
                  "Hamburger",
                  "Soda"
                ]
              }
            }
          }

          return await axios.post(this.EndPointURL, data, {headers: headers});
    }
    
}