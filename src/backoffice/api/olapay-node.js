/**
 * @version 1.0.0;
 * @overview Tsys Payment Interface
 *
 * Application Layer that communicates with TSYS
 *
 */

 export var  Tsys = {

           transaction : {

            authorize : function (params, callback) {
                'use strict';

                try {

                    var response, request;

                    /* @ Create request, append params */
                    request = { 'Authorize' : params };

                    /* @ Send command and capture response */
                    response = Tsys.https.send(request, function (json) {
                           console.log(json.AuthorizeResponse);

                           if (json.AuthorizeResponse.Status == 'FAIL') {
                               console.log('Transaction Failed');
                           }
                           if (json.AuthorizeResponse.Status == 'PASS') {
                               console.log('Transaction Success');
                           }

                    }, 'authorize' );

                } catch (err) {
                    console.log(err);
                    Tsys.log.error('Auth Error:', err);
                }
            },


            /**
             * Captures a prior
             * Authorization
             */

            capture : function (params, callback) {
                'use strict';

                try {

                    var response, request;

                    /* @ Create request, append params */
                    request = { 'Capture' : params };

                    /* @ Send command and capture response */
                    response = Tsys.https.send(request, function (json) {
                           console.log(json.CaptureResponse);

                           if (json.CaptureResponse.Status == 'FAIL') {
                               console.log('Transaction Failed');
                           } else {
                               console.log('Transaction Success');
                           }

                    }, 'capture' );

                } catch (err) {
                    console.log(err);
                    Tsys.log.error('Capture Error:', err);
                }
            },


            /**
             * Performs a sale
             * using MSR or
             * manual keyed trans
             */

            saleEMV : function (params, callback) {
                'use strict';

                try {
                     var response, request;

                    /* @ Create request, append params */
                    request = { 'Sale' : params };

                    /* @ Send command and capture response */
                    response = Tsys.https.send(request, function (json) {
                           console.log(json.saleResponse);
                           if (json.saleResponse.error == '0') {
                               console.log('Transaction Success');
                           } else {
                               console.log('Transaction Fail');
                           }
                    }, 'sale/emv' );

                } catch (err) {
                    console.log(err);
                    Tsys.log.error('Sale Error:', err);
                }
            },


            /**
             * Performs a sale
             * using MSR or
             * manual keyed trans
             */

            saleManual : function (params, callback) {
                'use strict';

                try {
                     var response, request;

                    /* @ Create request, append params */
                    request = { 'Sale' : params };

                    /* @ Send command and capture response */
                    response = Tsys.https.send(request, function (json) {
                           console.log(json.saleResponse);
                            if (json.saleResponse.error == '0') {
                                console.log('Transaction Success');
                            } else {
                                console.log('Transaction Fail');
                            }
                     }, 'sale/manual' );

                } catch (err) {
                    console.log(err);
                    Tsys.log.error('Sale Error:', err);
                }
            },



           /**
             * Returns a prior sale
             * With reference
             */

             device : function (params, callback) {
                'use strict';

                try {
                     var response, request;

                    /* @ Create request, append params */
                    request = { 'Device' : params };

                    /* @ Send command and capture response */
                    response = Tsys.https.send(request, function (json) {
                           console.log(json);

                           if (json.Error == '99') {
                               console.log('Transaction Failed');
                           } else {
                               console.log('Transaction Success');
                           }

                    }, 'device' );

                } catch (err) {
                    console.log(err);
                    Tsys.log.error('Device Error:', err);
                }
            },
             deviceset : function (params, callback) {
                'use strict';

                try {
                     var response, request;

                    /* @ Create request, append params */
                    request = {  merchant:{ name : "Rafa Hidalgo",
                        address : "1980 Festival Drive",
                        city  : "Las Vegas",
                        state  : "NV",
                        zipcode : "89135",
                        currencyCode : "USD"},
                        device:{deviceid:"88700000297501",
                        device_type:"APT50",
                        merchant_id: "12345",
                        status: 0,
                        trans_key: "MSPN7HTPID0Q9LMTLNYQKMWASCUEMFJ7",
                        processor: "TSYS" }  };

                    /* @ Send command and capture response */
                    response = Tsys.https.send(request, function (json) {
                           console.log(json);

                           if (json.Error == '99') {
                               console.log('Transaction Failed');
                           } else {
                               console.log('Transaction Success');
                           }

                    }, 'device/set' );

                } catch (err) {
                    console.log(err);
                    Tsys.log.error('DeviceSet Error:', err);
                }
            },


            return : function (params, callback) {
                'use strict';

                try {
                    var response, request;

                    /* @ Create request, append params */
                    request = { 'Return' : params };

                    /* @ Send command and capture response */
                    response = Tsys.https.send(request, function (json) {
                           console.log(json.ReturnResponse);

                           if (json.ReturnResponse.Status == 'FAIL') {
                               console.log('Transaction Failed');
                           } else {
                               console.log('Transaction Success');
                           }

                    }, 'return' );

                } catch (err) {
                    console.log(err);
                    Tsys.log.error('Refund: Error', err);
                }
            },

              tipadjust : function (params, callback) {
                'use strict';

                try {
                    var response, request;

                    /* @ Create request, append params */
                    request = { 'TipAdjust' : params };

                    /* @ Send command and capture response */
                    response = Tsys.https.send(request, function (json) {
                           console.log(json.TipAdjustResponse);

                           if (json.TipAdjustResponse.Status == 'FAIL') {
                               console.log('Transaction Failed');
                           } else {
                               console.log('Transaction Success');
                           }

                    }, 'tipadjust' );

                } catch (err) {
                    console.log(err);
                    Tsys.log.error('Refund: Error', err);
                }
            },

           search : function (params, callback) {
                'use strict';

                try {
                    var response, request;

                    /* @ Create request, append params */
                    request = { 'Search' : params };

                    /* @ Send command and capture response */
                    response = Tsys.https.send(request, function (json) {

                             console.log(json.SearchResponse);

                    }, 'search' );

                } catch (err) {
                    console.log(err);
                    Tsys.log.error('Void: Error', err);
                }
            },


            /**
             * Returns status
             * on a prior sale
             */

             status : function (params, callback) {
                'use strict';

                try {
                    var response, request;

                    /* @ Create request, append params */
                    request = { 'Request' : params };

                    /* @ Send command and capture response */
                    response = Tsys.https.send(request, function (json) {
                             // This would return the response
                             //json.response.command
                             //json.response.amount
                             //json.response.auth_code
                             //json.response.card_payment_type
                             //json.response.processor
                             //json.response.response;
                             //json.response.response_message
                             //json.response.Status
                             //json.response.trans_id
                             //json.response.trans_date
                             //json.response.trans_type
                             console.log(json.response);

                    }, 'status' );

                } catch (err) {
                    console.log(err);
                    Tsys.log.error('Void: Error', err);
                }
            },

            void : function (params, callback) {
                'use strict';

                try {
                    var response, request;

                    /* @ Create request, append params */
                    request = { 'Void' : params };

                    /* @ Send command and capture response */
                    response = Tsys.https.send(request, function (json) {

                             console.log(json.VoidResponse);

                           if (json.VoidResponse.Status == 'FAIL') {
                               console.log('Transaction Failed');
                           } else {
                               console.log('Transaction Success');
                           }

                    }, 'void' );

                } catch (err) {
                    console.log(err);
                    Tsys.log.error('Void: Error', err);
                }
            }
        },



        https: {
            ip: '',
            port: '',
            URI_sandbox : 'https://'+ip + ':' + port,
            // URI_sandbox : 'https://192.168.0.119:8000',
            URI_production : '',

            send : function (params, callback, service) {
                'use strict';

                try {
                    var Request = require("request"),
                        error,
                        response,
                        body;

                    /* Output the supplied params */
                    console.log(params);

                    /* Disable SSL verification -
                     * NOTE: ONLY USE IN DEVELOPMENT */
                    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

                    console.log(Tsys.https.URI_sandbox + '/api/' + service);

                    Request.post({
                        "headers": { "content-type": "application/json" },
                        "url": Tsys.https.URI_sandbox + '/api/' + service,
                        "body": JSON.stringify( params )
                    }, (error, response, json) => {
                        if (error) {
                            return console.log('error' , error);
                        }
                        console.log(json);

                        /* Return data, execute callback */
                        if (typeof(json) === "string" && callback && typeof(callback) === "function") {
						    return callback(JSON.parse(json));
                        }
                    });
                } catch (err) {
                    console.log(err);
                }
            },

        },

        log : {

			/**
			 * Returns the current date
			 */
			getDate: function () {
                'use strict';

                var date = new Date();
				return (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear();
			},

			/**
			 * Logs standard messages to local file system
			 */
		    info: function (message) {
                'use strict';
                var log = require('simple-node-logger').createSimpleLogger('logs/' + Tsys.log.getDate() + '.log');

                if (Array.isArray(message)) {
				    for (var i = 0; i < message.length; i++) {
			         log.info(message[i]);
				   }
                 } else {
			         log.info(message);
                 }
		    },

			/**
			 * Logs error messages to local file system
			 */
		   error: function(message) {
                'use strict';

                    var log = require('simple-node-logger').createSimpleLogger('logs/' + Tsys.log.getDate() + '.log');
                 if (Array.isArray(message)) {
				   for (var i = 0; i < message.length; i++) {
			         log.error(message[i]);
				   }
                 } else {
			         log.error(message);
                 }
		    }
        }
}

// module.exports = Tsys;
//var response;

/* @ Perform a SWIPE Auth Transaction */
/*
Tsys.transaction.authorize({ Tip : "20",
                        AddressLine1 : "",
                        Amount  : "200",
                        CardDataSource : "SWIPE",
                        City  :  "Las Vegas",
                        CardNumber : "",
                        CVV2 : "",
                        CardHolderName  : "",
                        ExpirationDate : "",
                        KSN  :  "",
                        TokenRequired  :  "Y",
                        orderID  :  "ABC123456",
                        State  : "",
                        Zip : ""}
                   );
*/

//Tsys.transaction.status({ Ref:12 });

//Tsys.transaction.search({ trans_type:['Sale'],trans_date:[]});
//Tsys.transaction.search({ trans_type:['Sale'] });

//Tsys.transaction.status({ Ref:11 });
//return;

// Tsys.transaction.saleManual({ Tip : "20",
//                          AddressLine1 : "1980 Festival Drive",
//                          Amount : "4000",
//                          CardDataSource : "MANUAL",
//                          City  : "Las Vegas",
//                          CardNumber : "4342574027103061",
//                          CVV2 : "999",
//                          CardHolderName : "John Doe",
//                          ExpirationDate : "05/21",
//                          OrderID  : "123",
//                          State  : "NV",
//                          Zip : "89135"
//                          }
//                     );

// return


// Tsys.transaction.saleEMV({ Tip : "0",
//                         AddressLine1 : "",
//                         Amount  : "600",
//                         City  :  "",
//                         CardNumber : "",
//                         CVV2 : "",
//                         CardHolderName  : "",
//                         ExpirationDate : "",
//                         orderID  :  "ABC123456",
//                         State  : "",
//                         Zip : ""}
//                    );

// return;



/*
Tsys.transaction.authorize({
                         CardDataSource : "MANUAL",
                         Amount : "200",
                         Tip : "20",
                         CardNumber : "4111111111111111",
                         ExpirationDate : "11/19",
                         CVV2 : "999",
                         AddressLine1 : "1980 Festival Drive",
                         Zip : "89135",
                         orderNumber : "ABC123456",
                         CardHolderName: "John Doe",
                         City: "Las Vegas",
                         TokenRequired: "N",
                         State: "NV",
                         OrderID: "",
                         KSN: "ABC1234566699" }
                    );
*/
//  @ Perform a Manual Sale Transaction
// Tsys.transaction.sale({ Tip : "20",
//                         AddressLine1 : "1980 Festival Drive",
//                         Amount : "4000",
//                         CardDataSource : "MANUAL",
//                         City  : "Las Vegas",
//                         CardNumber : "4111111111111111",
//                         CVV2 : "999",
//                         CardHolderName : "John Doe",
//                         ExpirationDate : "11/19",
//                         KSN  : "ABC1234566699",
//                         TokenRequired  :  "N",
//                         OrderID  : "123",
//                         State  : "NV",
//                         Zip : "89135",
//                         currencyCode : "USD"}
//                    );
//Tsys.transaction.deviceset( {} );
// Tsys.transaction.deviceset({ merchant:{ name : "John",
//                         address : "1990 Festival Drive",
//                         city  : "Las Vegas",
//                         state  : "NV",
//                         zipcode : "89135",
//                         currencyCode : "USD"},
//                         device:{deviceid:"1231245678",
//                         device_type:"APT40",
//                         merchant_id: "12312",
//                         status: 0,
//                         trans_key: "ewrwe",
//                         processor: "TSYS"


//                         }
//                       }
//                    );


// Tsys.transaction.tipadjust({

//                         Tip : "5.00",
//                         TransactionID : "14561484"


//                       }
//                    );

/* @ Voids a prior Authorization */
// Tsys.transaction.void( { Amount : "4000", TransactionID : "14531472",
//                          ReasonCode : "1" } );


/* @ Refunds a prior Sale with a reference */
// Tsys.transaction.return({ Amount : "165",
//                           KSN : "123456",
//                           CardNumber : "4111111111111111",
//                           FirstName  : "John",
//                           LastName   : "Doe"
//                         }
//                    );

// /* @ Captures a prior Authorization */
// Tsys.transaction.capture({ Amount : "4000",
//                            TransactionID : "14531514"
//                           }
//                    );
// Tsys.transaction.return({ Amount : "4000",
//                            TransactionID : "14531514"
//                           }
//                    );

// /* @ Refunds a prior Sale without a prior reference */
// Tsys.transaction.return({ deviceID : "",
//                           transactionKey : "",
//                           cardDataSource : "MANUAL",
//                           transactionAmount : "165",
//                           cardNumber : "4111111111111111",
//                           expirationDate : "11/19",
//                           cvv2 : "999",
//                           terminalCapability : "KEYED_ENTRY_ONLY",
//                           terminalOperatingEnvironment : "NO_TERMINAL",
//                           cardholderAuthenticationMethod : "MANUAL_SIGNATURE",
//                           terminalAuthenticationCapability : "NO_CAPABILITY",
//                           terminalOutputCapability : "NONE",
//                           maxPinLength : "NOT_SUPPORTED",
//                           developerID: '12345' }
//                    );
// Tsys.transaction.return({ Amount : "4165",
//                           Track1Data : "egser123456",
//                           Track2Data : "ger23fwegsd",
//                           Track3Data  : "sdf32f2wef",
//                           KSN   : "ABC1234566699"
//                         }
//                    );
