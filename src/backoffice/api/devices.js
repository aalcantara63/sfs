import axios from 'axios';
import { Api } from '../api/api.js';
import moment from 'moment-timezone';

function StrToHex(response){
    var responseHex = "";
    for(var i=0; i<response.length; i++){
        if(responseHex == "")
            responseHex = response.charCodeAt(i).toString(16).length<2?'0'+response.charCodeAt(i).toString(16):response.charCodeAt(i).toString(16);
        else
            responseHex += response.charCodeAt(i).toString(16).length<2?" " + '0'+response.charCodeAt(i).toString(16):" " + response.charCodeAt(i).toString(16);
    }
    return responseHex;
}

function HexToString(response){
    var responseHex = "";
    var arr = response.split(" ");
    for(var i=0; i<arr.length; i++){
        if(arr[i] == "")
            continue;
        responseHex += String.fromCharCode(parseInt(arr[i],16));
    }
    return responseHex;	
}

//Get LRC
function getLRC(params){
    var lrc = 0;
    for(let i=1; i< params.length; i++){
        var type_of = typeof(params[i]);
        if(type_of == "string"){
            var element = params[i].split("");
            for(let ii=0; ii<element.length; ii++){
                lrc ^= element[ii].charCodeAt(0);
            }
        }else{
            lrc ^= params[i];
        }
    }
    return (lrc>0)?String.fromCharCode(lrc):0;
}

export var Devices = {

    // token: 'M3nuSucc3ssAp1987456321M3nuSucc3ssAp1741258963M3nuSucc3ssAp1963258741', 
    
    a930: {

        // endPointURL: 'https://192.168.4.53:10009?',
        // endPointURL: '192.168.100.166:10009?'

        mStx : {
			hex: 0x02,
			code: "02"
		},
		
		mFS : {
			hex : 0x1c,
			code : "1c"
		},
		
		mEtx : {
			hex : 0x03,
			code : "03"
		},

		mUS : {
			hex : 0x1F,
			code : "1F"
		},

        getDeviceInfoBySN: async function(number){
            return await axios.get('https://poslink.com/poslink/ws/process2.asmx/GetDeviceLocalIP?TerminalId=&Token=&SerialNo=' + number)
        },
        //Get LRC
		getLRC : function(params){
			var lrc = 0;
			for(let i=1; i< params.length; i++){
				var type_of = typeof(params[i]);
				if(type_of == "string"){
					var element = params[i].split("");
					for(let ii=0; ii<element.length; ii++){
						lrc ^= element[ii].charCodeAt(0);
					}
				}else{
					lrc ^= params[i];
				}
			}
			return (lrc>0)?String.fromCharCode(lrc):0;
		},

        //HEX TO BASE64
        hexToBase64: function(str) {
            return window.btoa(String.fromCharCode.apply(null,
            str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
            );
        },

        //BASE64 TO HEX
        base64ToHex: function(str) {
            for (var i = 0, bin = window.atob(str), hex = []; i < bin.length; ++i) {
            var tmp = bin.charCodeAt(i).toString(16);
            if (tmp.length === 1) tmp = "0" + tmp;
                hex[hex.length] = tmp;
            }
            return hex.join(" ");
        },

        PushParams : function(params,type,objectInfo){
			var empty = 0;
			var arr = [];
			arr = arr.concat(params);
			for(var name in objectInfo){
				if(objectInfo[name] == '' && type!="additionalInformation")
				{
					arr.push(this.mUS.hex);
					continue;
				}

				if(type == "additionalInformation"){
					if(objectInfo[name] == ''){
						continue;
					}
					empty++;
					arr.push(name+"="+objectInfo[name].toString());
				}else{
					empty++;
					arr.push(objectInfo[name].toString());
				}
				arr.push(this.mUS.hex);
			}
			arr.pop();
			if(empty==0 && type!="additionalInformation"){
				arr = params;
			}
			if(empty==0 && type=="additionalInformation"){
				arr.push(this.mFS.hex);
			}
			//console.log(params);
			return arr;
		},

        AddBase64 : function(elements,type,objectInfo){
			//console.log(objectInfo);
			var empty = 0;
			var arr = [];
			arr = arr.concat(elements);
			for(const name in objectInfo){
				if(objectInfo[name] == '' && type!="additionalInformation")
				{
					arr.push(this.mUS.code);
					continue;
				}
				if(type == "additionalInformation"){
					if(objectInfo[name] == '')
						continue;
					empty++;
					arr.push(this.base64ToHex(window.btoa(name+"="+objectInfo[name].toString())));
				}else{
					empty++;
					arr.push(this.base64ToHex(window.btoa(objectInfo[name].toString())));
				}
				arr.push(this.mUS.code);
			}
			arr.pop();
			if(empty==0 && type!="additionalInformation"){
				arr = elements;
			}
			if(empty==0 && type=="additionalInformation"){
				arr.push(this.mFS.code);
			}
			//console.log(arr);
			return arr;
		},

        //Connect to the server
        HttpCommunication : function(commandType,url,callback){
            console.log(this)
            var xhr = null;
            if(window.XMLHttpRequest) 
            {
                xhr = new XMLHttpRequest();
            } 
            else 
            {
                try{
                    xhr = new window.ActiveXObject('Microsoft.XMLHttp');
                }
                catch(e)
                {
                    xhr = new window.ActiveXObject('msxml2.xmlhttp');
                }
            }

            xhr.open("GET", url,true);
            xhr.onreadystatechange=function()
            {
                if(xhr.readyState==4)
                {
                    if(xhr.status==200)
                    {
                        var response = xhr.responseText;
                        console.log("Raw response: "+response);

                        var checkParams = StrToHex(response).split(" ").pop();
                        var RedundancyCheck = StrToHex(response).split(" ").pop().substring(1);
                        
                        var check = getLRC(checkParams);

                        if(check == RedundancyCheck)
                        {
                            //get package detail info
                            var packetInfo = [];
                            var len = StrToHex(response).indexOf("03");
                            var hex = StrToHex(response).slice(0,len).split(/02|1c/);

                            console.log(hex);
                            if(commandType == "DoCredit")
                            {
                                var subHex=[], subPacketInfo=[];
                                for(var i=0; i<hex.length; i++){
                                    if(hex[i] != "")
                                    {
                                        if(hex[i].indexOf("1f")>0)
                                        {
                                            subHex = hex[i].split("1f");
                                            console.log(subHex);
                                            subPacketInfo = [];
                                            for(var j=0; j<subHex.length; j++)
                                            {
                                                if(subHex[j]!='')
                                                {
                                                    subPacketInfo.push(HexToString(subHex[j]));
                                                }
                                            }
                                            console.log(subPacketInfo);
                                            packetInfo.push(subPacketInfo);
                                        }
                                        else
                                        {
                                            packetInfo[i] = HexToString(hex[i]);
                                        }
                                    }
                                }
                            }
                            else
                            {
                                for(var k=0; k<hex.length; k++)
                                {
                                    if(hex[k] != "")
                                    {
                                        packetInfo[k] = HexToString(hex[k]);
                                    }
                                }
                            }
                            
                            console.log("Separate package info: ");
                            console.log(packetInfo);
                            callback(packetInfo);	
                        }	
                    } 
                    else 
                    {
                        console.log(xhr.status);
                    }
                } 
            };
            xhr.send(null);
        },

        Printer: async function(ip, port, ssl, callback, PrintCopy = 1){
            const command = 'A60'
            const version = '1.28'
            const PrintData = "Example"

            let params = [this.mStx.hex, command, this.mFS.hex, version,
                this.mFS.hex, PrintCopy, this.mFS.hex, PrintData, this.mEtx.hex]
            let lrc = this.getLRC(params)
            console.log(params)
            
            var command_hex = this.base64ToHex(window.btoa(command));
            var version_hex = this.base64ToHex(window.btoa(version));
            var PrintCopy_hex = this.base64ToHex(window.btoa(PrintCopy));
            var PrintData_hex = this.base64ToHex(window.btoa(PrintData));
            
            var elements = [this.mStx.code, command_hex, this.mFS.code, version_hex,
                this.mFS.code, PrintCopy_hex, this.mFS.code, PrintData_hex, this.mEtx.code,
                this.base64ToHex(btoa(lrc))
            ];

            console.log("elements");
            console.log(elements);

            var final_string = elements.join(" ");
            var final_b64 = this.hexToBase64(final_string);
            console.log("LRC: " + lrc);
            console.log("Base64: " + final_b64);

            //Communication
            let endPointURL = 'http://'+ip+':'+port+'?'+final_b64
            if (ssl)
                endPointURL = 'https://'+ip+':'+port+'?'+final_b64

            console.log(endPointURL)

            // return await axios.get(endPointURL, {headers: {'accessControlAllowed': 'Y'}})
            this.HttpCommunication('Printer',endPointURL,function(response){
                callback(response);
            });
        },

        DoCredit: async function(ip, port, ssl, data, callback){

            console.log(data)
            const invoiceSequence = await Api.getInvoiceSequence(null)
            if (invoiceSequence){
                const command = 'T00'
                const version = '1.28'
                const transactionType = data.transactionType

                const amountInformation = {
                    'TransactionAmount': data.amountInformation.TransactionAmount,
                    'TipAmount': data.amountInformation.TipAmount || '',
                    'CashBackAmount': '',
                    'MerchantFee': '',
                    'TaxAmount': data.amountInformation.TaxAmount || '',
                    'FuelAmount': ''
                    
                }
                const accountInformation = {
                    'Account': '',
                    'EXPD': '',
                    'CVVCode': '',
                    'EBTtype': '',
                    'VoucherNumber': '',
                    'Force': '',
                    'FirstName': data.accountInformation.FirstName || '',
                    'LastName': data.accountInformation.LastName || '',
                    'CountryCode': 'US',
                    'State_ProvinceCode': '',
                    'CityName': '',
                    'EmailAddress': '',
                }
                const traceInformation = {
                    'ReferenceNumber': data.traceInformation.ReferenceNumber || invoiceSequence.data,
                    'InvoiceNumber':  data.traceInformation.InvoiceNumber || invoiceSequence.data,
                    'AuthCode': '',
                    'TransactionNumber': data.traceInformation.TransactionNumber || '',
                    'TimeStamp': '',
                    'ECRTransID': '',
                }
                const avsInformation = {
                    'ZipCode': '',
                    'Address': '',
                    'Address2': '',
                }

                const cashierInformation = {
                    'ClerkID': data.ClerkID,
                    'ShiftID': ''
                }

                const commercialInformation = {
                    'PONumber': '',
                    'CustomerCode': '',
                    'TaxExempt': '',
                    'TaxExemptID': '',
                    'MerchantTaxID': '',
                    'DestinationZipCode': '',
                    'ProductDescription': '',
                }

                const motoEcommerce = {
                    'MOTO_E_CommerceMode': '',
                    'TransactionType': '',
                    'SecureType': '',
                    'OrderNumber': '',
                    'Installments': '',
                    'CurrentInstallment': ''
                }
                const transDatetime = moment()
                console.log('TRANS DATETIME: ' + transDatetime.toISOString())
                const additionalInformation = {
                    'TABLE': '',
                    'GUEST': '',
                    'SIGN': '',
                    'TICKET': '',
                    'HREF': '',
                    'TIPREQ': '',
                    'SIGNUPLOAD': '',
                    'REPORTSTATUS': '',
                    'TOKENREQUEST': '',
                    'TOKEN': '',
                    'CARDTYPE': '',
                    'CARDTYPEBITMAP': '',
                    'PASSTHRUDATA': '',
                    'RETURNREASON': '',
                    'ORIGTRANSDATE': transDatetime.format('YYYYMMDD'),
                    'ORIGPAN': '',
                    'ORIGEXPIRYDATE': '',
                    'ORIGTRANSTIME': transDatetime.format('HHmmss'),
                    'DISPROGPROMPTS': '',
                    'GATEWAYID': '',
                    'GETSIGN': '',
                    'ENTRYMODEBITMAP': '',
                    'RECEIPTPRINT': '',
                    'CPMODE': '',
                    'ODOMETER': '',
                    'VEHICLENO': '',
                    'JOBNO': '',
                    'DRIVERID': '',
                    'EMPLOYEENO': '',
                    'LICENSENO': '',
                    'JOBID': '',
                    'DEPARTMENTNO': '',
                    'CUSTOMERDATA': '',
                    'USERID': '',
                    'VEHICLEID': ''
                }

                let params = [this.mStx.hex, command, this.mFS.hex, version, this.mFS.hex, transactionType, this.mFS.hex]

                params = this.PushParams(params,"amountInformation",amountInformation);

                params.push(this.mFS.hex);
                params = this.PushParams(params,"accountInformation",accountInformation);

                params.push(this.mFS.hex);
                params = this.PushParams(params,"traceInformation",traceInformation);

                params.push(this.mFS.hex);
                params = this.PushParams(params,"avsInformation",avsInformation);

                params.push(this.mFS.hex);
                params = this.PushParams(params,"cashierInformation",cashierInformation);

                params.push(this.mFS.hex);
                params = this.PushParams(params,"commercialInformation",commercialInformation);

                params.push(this.mFS.hex);
                params = this.PushParams(params,"motoEcommerce",motoEcommerce);

                params.push(this.mFS.hex);
                params = this.PushParams(params,"additionalInformation",additionalInformation);

                params.push(this.mEtx.hex)

                let lrc = this.getLRC(params)

                console.log(params)

                //prepare for base64 encoding.
                var command_hex = this.base64ToHex(window.btoa(command));
                var version_hex = this.base64ToHex(window.btoa(version));
                var transactionType_hex = this.base64ToHex(window.btoa(transactionType));
                // var amountInformation_hex = this.base64ToHex(window.btoa(amountInformation));
                // var accountInformation_hex = this.base64ToHex(window.btoa(accountInformation));
                // var traceInformation_hex = this.base64ToHex(window.btoa(traceInformation));
                // var avsInformation_hex = this.base64ToHex(window.btoa(avsInformation));
                // var cashierInformation_hex = this.base64ToHex(window.btoa(cashierInformation));
                // var commercialInformation_hex = this.base64ToHex(window.btoa(commercialInformation));
                // var motoEcommerce_hex = this.base64ToHex(window.btoa(motoEcommerce));
                // var additionalInformation_hex = this.base64ToHex(window.btoa(additionalInformation));

                var elements = [this.mStx.code]; //0-
                elements.push(command_hex); //1-
                elements.push(this.mFS.code); //2-
                elements.push(version_hex); //3-
                elements.push(this.mFS.code); //4-
                elements.push(transactionType_hex); //5-
                elements.push(this.mFS.code); //6-

                elements = this.AddBase64(elements,"amountInformation",amountInformation);
                elements.push(this.mFS.code);
                elements = this.AddBase64(elements,"accountInformation",accountInformation);
                elements.push(this.mFS.code);
                elements = this.AddBase64(elements,"traceInformation",traceInformation);
                elements.push(this.mFS.code);
                elements = this.AddBase64(elements,"avsInformation",avsInformation);
                elements.push(this.mFS.code);
                elements = this.AddBase64(elements,"cashierInformation",cashierInformation);
                elements.push(this.mFS.code);
                elements = this.AddBase64(elements,"commercialInformation",commercialInformation);
                elements.push(this.mFS.code);
                elements = this.AddBase64(elements,"motoEcommerce",motoEcommerce);
                elements.push(this.mFS.code);
                elements = this.AddBase64(elements,"additionalInformation",additionalInformation);

                elements.push(this.mEtx.code);
                elements.push(this.base64ToHex(btoa(lrc)));
                console.log("elements");
                console.log(elements);

                var final_string = elements.join(" ");
                var final_b64 = this.hexToBase64(final_string);
                console.log("LRC: " + lrc);
                console.log("Base64: " + final_b64);

                //Communication
                let endPointURL = 'http://'+ip+':'+port+'?'+final_b64
                if (ssl)
                    endPointURL = 'https://'+ip+':'+port+'?'+final_b64

                console.log(endPointURL)

                // return await axios.get(endPointURL, {headers: {'accessControlAllowed': 'Y'}})
                this.HttpCommunication('DoCredit',endPointURL,function(response){
                    callback(response);
                });
            }
            
        },

        Initialize: async function(ip, port, ssl, callback){

            const command = 'A00'
            const version = '1.28'
            
            var params = [this.mStx.hex,command,this.mFS.hex, version, this.mEtx.hex];
			//[02]A08[1c]1.28[1c]0[1c]90000[03]
			//var params = [0x02,"A08",0x1c,"1.28",0x1c, "0", 0x1c,"90000",0x03];
			var lrc = this.getLRC(params);
			var command_hex = this.base64ToHex(window.btoa(command));
			var version_hex = this.base64ToHex(window.btoa(version));
			//var elements = [this.mStx, command_hex, this.mFS, version_hex, this.mEtx, base64ToHex($.base64.btoa(lrc))];
			var elements = [this.mStx.code, command_hex, this.mFS.code, version_hex, this.mEtx.code, this.base64ToHex(window.btoa(lrc))];

			var final_string = elements.join(" ");
			//console.log("final_string: " + final_string);

			var final_b64 = this.hexToBase64(final_string);
			console.log("LRC: " + lrc);
			console.log("Base64: " + final_b64);
            console.log("COMMAND_HEX: " + command_hex + " VERSION_HEX: " + version_hex);
			
            //Communication
            let endPointURL = 'http://'+ip+':'+port+'?'+final_b64
            if (ssl)
                endPointURL = 'https://'+ip+':'+port+'?'+final_b64

            console.log(endPointURL)
            // return await axios.get(endPointURL, {headers: {'accessControlAllowed': 'Y'}})
            this.HttpCommunication('Initialize',endPointURL,function(response){
				callback(response);
			});
        }
    }
    


}