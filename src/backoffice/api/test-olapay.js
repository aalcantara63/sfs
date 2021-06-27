

 export var  Tsys = {

    transaction : {

     authorize : function (params) {
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

            console.log(response);

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

     capture : function (params) {
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

             console.log(response)

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

     saleEMV : async function (params) {
         'use strict';

         try {
              var response, request;

             /* @ Create request, append params */
             request = { 'Sale' : params };

             /* @ Send command and capture response */
             response = await Tsys.https.send(request, function (json) {
                    console.log(json.saleResponse);
                    if (json.saleResponse.error == '0') {
                        console.log('Transaction Success');
                    } else {
                        console.log('Transaction Fail');
                    }
             }, 'sale/emv' );

             console.log(response)

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

     saleManual : async function (params) {
         'use strict';

         try {
              var response, request;

             /* @ Create request, append params */
             request = { 'Sale' : params };

             /* @ Send command and capture response */
             response = await Tsys.https.send(request, function (json) {
                    console.log(json.saleResponse);
                     if (json.saleResponse.error == '0') {
                         console.log('Transaction Success');
                     } else {
                         console.log('Transaction Fail');
                     }
              }, 'sale/manual' );

              console.log(response)

         } catch (err) {
             console.log(err);
             Tsys.log.error('Sale Error:', err);
         }
     },



    /**
      * Returns a prior sale
      * With reference
      */

      device : async function (params) {
         'use strict';

         try {
              var response, request;

             /* @ Create request, append params */
             request = { 'Device' : params };

             /* @ Send command and capture response */
             response = await Tsys.https.send(request, function (json) {
                    console.log(json);

                    if (json.Error == '99') {
                        console.log('Transaction Failed');
                    } else {
                        console.log('Transaction Success');
                    }

             }, 'device' );

             console.log(response)

         } catch (err) {
             console.log(err);
             Tsys.log.error('Device Error:', err);
         }
     },
      deviceset : function (params) {
         'use strict';

         try {
              var response, request;

              if(params) request = params 
              else

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

             console.log(response)

         } catch (err) {
             console.log(err);
             Tsys.log.error('DeviceSet Error:', err);
         }
     },


     return : function (params) {
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

             console.log(response)

         } catch (err) {
             console.log(err);
             Tsys.log.error('Refund: Error', err);
         }
     },

       tipadjust : function (params) {
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

             console.log(response)

         } catch (err) {
             console.log(err);
             Tsys.log.error('Refund: Error', err);
         }
     },

    search : function (params) {
         'use strict';

         try {
             var response, request;

             /* @ Create request, append params */
             request = { 'Search' : params };

             /* @ Send command and capture response */
             response = Tsys.https.send(request, function (json) {

                      console.log(json.SearchResponse);

             }, 'search' );

             console.log(response)

         } catch (err) {
             console.log(err);
             Tsys.log.error('Void: Error', err);
         }
     },


     /**
      * Returns status
      * on a prior sale
      */

      status : function (params) {
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

             console.log(response)

         } catch (err) {
             console.log(err);
             Tsys.log.error('Void: Error', err);
         }
     },

     void : function (params) {
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
             console.log(response)

         } catch (err) {
             console.log(err);
             Tsys.log.error('Void: Error', err);
         }
     }
 },



 https: {
     ip: '',
     port: '',
     // URI_sandbox : 'https://192.168.0.119:8000',
     URI_production : '',

     send : async  function (params, callback, service) {
         'use strict';

         try {
             var Request = require("request");
                

             /* Output the supplied params */
             console.log(params);

             /* Disable SSL verification -
              * NOTE: ONLY USE IN DEVELOPMENT */
             process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

             console.log( 'https://'+Tsys.https.ip + ':' + Tsys.https.port + '/api/' + service);

            Request.post({
                 "headers": { "Access-Control-Allow-Origin": "*", "content-type": "application/json" },
                 "options": {"mode": "no-cors"},
                 "url": 'https://'+Tsys.https.ip + ':' + Tsys.https.port + '/api/' + service,
                 "body": JSON.stringify( params )
             },(error, response, json) => {
                console.log(response)
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
         console.log(message)
        //  'use strict';
        //  var log = require('simple-node-logger').createSimpleLogger('logs/' + Tsys.log.getDate() + '.log');

        //  if (Array.isArray(message)) {
        //      for (var i = 0; i < message.length; i++) {
        //       log.info(message[i]);
        //     }
        //   } else {
        //       log.info(message);
        //   }
     },

     /**
      * Logs error messages to local file system
      */
    error: function(message) {
         'use strict';
         console.log(message);

        //      var log = require('simple-node-logger').createSimpleLogger('logs/' + Tsys.log.getDate() + '.log');
        //   if (Array.isArray(message)) {
        //     for (var i = 0; i < message.length; i++) {
        //       log.error(message[i]);
        //     }
        //   } else {
        //       log.error(message);
        //   }
     }
 }
}