import axios from 'axios';

export var Api = {

    // token: 'M3nuSucc3ssAp1987456321M3nuSucc3ssAp1741258963M3nuSucc3ssAp1963258741',      
    // endPointURL: 'http://localhost:7071/api/',

    token: 'M3nuSucc3ssAp1987456321M3nuSucc3ssAp1741258963M3nuSucc3ssAp1963258741',      
    endPointURL: 'https://sls-eus-dev-serverless-succes-api.azurewebsites.net/api/',

    //  token: 'eposMiddl34PI',
    // endPointURL: 'https://8akf11lds3.execute-api.us-east-1.amazonaws.com/',

    // token: 'Basic UDNQVUFONkw3QkZSSlNSWVE3Sk5NRzNDS1pVT1pSVVg6S0NBSFhUMUlWNFlITEw2Qjc5VDFWUkJDN0tET0VFMDQ=',
    // endPointURL: 'https://api.eposnowhq.com/api/v4/',

    //Azure token
    //token: 'M3nuSucc3ssAp1987456321M3nuSucc3ssAp1741258963M3nuSucc3ssAp1963258741',

    restaurantId: '',
    restaurant: null,

    setRestaurantId: async function(restaurantId){
        this.restaurantId = restaurantId;
        if (restaurantId != '')
        {
            const data = await this.fetchById_Sync('Restaurant', restaurantId);
            this.restaurant = data.data;
        }
        else
            this.restaurant = null
        console.log("ESTE RES")
        console.log(this.restaurant)
    },

    getRestaurant: function(){
        return this.restaurant
    },

    setTokenId: function(tokenId){
        this.token = tokenId;
    },

    fetchAll: async function(entity){
        return await axios.get(this.endPointURL + entity, {headers: {'Authorization': this.token, 'restaurantid': this.restaurantId}})
    },

    fetchById: async function(entity, id){
        return await axios.get(this.endPointURL + entity + '?id=' + id, {headers: {'Authorization': this.token, 'restaurantid': this.restaurantId}})
    },

    fetchById_Sync: function(entity, id){
        return axios.get(this.endPointURL + entity + '?id=' + id, {headers: {'Authorization': this.token, 'restaurantid': this.restaurantId}})
    },

    postIn: async function(entity, items){
        return await axios.post(this.endPointURL + entity, items, {headers: {'Authorization':this.token, 'Content-Type': 'application/json', 'restaurantid': this.restaurantId}})
    },

    login: async function(items){
        return await axios.post(this.endPointURL + 'login', items, {headers: {'Content-Type': 'application/json'}})
    },

    loginForgot: async function(items){
        return await axios.post(this.endPointURL + 'login?forgotPassword=1', items, {headers: {'Content-Type': 'application/json'}})
    },

    putIn: async function(entity, items){
        return await axios.put(this.endPointURL + entity, items, {headers: {'Authorization':this.token, 'Content-Type': 'application/json', 'restaurantid': this.restaurantId}})
    },

    changePassword: async function(items){
        return await axios.put(this.endPointURL + 'staff?changePassword=1', items, {headers: {'Authorization':this.token, 'Content-Type': 'application/json', 'restaurantid': this.restaurantId}})
    },

    
    deleteById: async function(entity, id){
        return await axios.delete(this.endPointURL + entity + '?id=' + id, {headers: { "Authorization": this.token, 'restaurantid': this.restaurantId}} )
    },

    getProductsByCategory: async function(categoryId){
        return await axios.get(this.endPointURL + 'Product?category=' + categoryId, {headers: {'Authorization': this.token, 'restaurantid': this.restaurantId}})
    },

    findCustomerByEmail: async function(email){
        return await axios.get(this.endPointURL + 'Customer?email=' + email, {headers: {'Authorization': this.token, 'restaurantid': this.restaurantId}})
    },

    findProductCharges: async function(id, cant){
        
        return await axios.get(this.endPointURL + 'othercharges?product=' + id+'&cant='+ cant , {headers: {'Authorization': this.token, 'restaurantid': this.restaurantId}})
    },

    getAvailbleShipping: async function(){
        return await axios.get(this.endPointURL + 'shipping?available=1' , {headers: {'Authorization': this.token, 'restaurantid': this.restaurantId}})
    },

    getAvailbleTax: async function(){
        return await axios.get(this.endPointURL + 'tax?available=1' , {headers: {'Authorization': this.token, 'restaurantid': this.restaurantId}})
    },

    getAllCategoryActiveMenu: async function(){
        return await axios.get(this.endPointURL + 'menu?category=1' , {headers: {'Authorization': this.token, 'restaurantid': this.restaurantId}})
    },

    getCustomerOrders: async function(id){
        return await axios.get(this.endPointURL + 'order?customer=' + id , {headers: {'Authorization': this.token, 'restaurantid': this.restaurantId}})
    },

    getCustomerTickets: async function(id){
        return await axios.get(this.endPointURL + 'order?ticket=' + id , {headers: {'Authorization': this.token, 'restaurantid': this.restaurantId}})
    },

    sendEmail: async function(items){
        return await axios.post(this.endPointURL + 'order?email=1', items, {headers: {'Authorization':this.token, 'Content-Type': 'application/json', 'restaurantid': this.restaurantId}})
    },

    sendSms: async function(items){
        return await axios.post(this.endPointURL + 'order?sms=1', items, {headers: {'Authorization':this.token, 'Content-Type': 'application/json', 'restaurantid': this.restaurantId}})
    },

    menuSinCaterin: async function(){
        return await axios.get(this.endPointURL + 'menu?sinCatering=1', {headers: {'Authorization':this.token, 'Content-Type': 'application/json', 'restaurantid': this.restaurantId}})
    },

    menuConCaterin: async function(){
        return await axios.get(this.endPointURL + 'menu?concatering=1', {headers: {'Authorization':this.token, 'Content-Type': 'application/json', 'restaurantid': this.restaurantId}})
    },

    categoryByMenuId: async function(id){
        return await axios.get(this.endPointURL + 'menu?categorybymenu=' + id , {headers: {'Authorization': this.token, 'restaurantid': this.restaurantId}})
    },

    hasPermission: function(user, permission){
        let res = false;
        for (let index = 0; index < user.Roles.length; index++) {
             this.fetchById_Sync("Rol", user.Roles[index])
                .then(response => {
                   switch(permission){                        
                        case 'canViewMenu':
                            res = response.data.canViewMenu;
                            break;
                        case 'canCreateMenu':
                            res = response.data.canCreateMenu;
                            break;
                        case 'canEditMenu':
                            res = response.data.canEditMenu;
                            break;
                        case 'canDeleteMenu':
                            res = response.data.canDeleteMenu;
                            break;
                        case 'canCreateCategory':
                            res = response.data.canCreateCategory;
                            break;
                        case 'canEditCategory':
                            res = response.data.canEditCategory;
                            break;
                        case 'canDeleteCategory':
                            res = response.data.canDeleteCategory;
                            break;
                        case 'canCreateProduct':
                            res = response.data.canCreateProduct;
                            break;
                        case 'canEditProduct':
                            res = response.data.canEditProduct;
                            break;
                        case 'canDeleteProduct':
                            res = response.data.canDeleteProduct;
                            break;
                        case 'canCreateCustomer':
                            res = response.data.canCreateCustomer;
                            break;
                        case 'canEditCustomer':
                            res = response.data.canEditCustomer;
                            break;
                        case 'canDeleteCustomer':
                            res = response.data.canDeleteCustomer;
                            break;
                        case 'canCreateTable':
                            res = response.data.canCreateTable;
                            break;
                        case 'canEditTable':
                            res = response.data.canEditTable;
                            break;
                        case 'canDeleteTable':
                            res = response.data.canDeleteTable;
                            break;
                        case 'canCreateTax':
                            res = response.data.canCreateTax;
                            break;
                        case 'canEditTax':
                            res = response.data.canEditTax;
                            break;
                        case 'canDeleteTax':
                            res = response.data.canDeleteTax;
                            break;
                        case 'canCreateShipping':
                            res = response.data.canCreateShipping;
                            break;
                        case 'canEditShipping':
                            res = response.data.canEditShipping;
                            break;
                        case 'canDeleteShipping':
                            res = response.data.canDeleteShipping;
                            break;
                        case 'canCreateOtherCharge':
                            res = response.data.canCreateOtherCharge;
                            break;
                        case 'canEditOtherCharge':
                            res = response.data.canEditOtherCharge;
                            break;
                        case 'canDeleteOtherCharge':
                            res = response.data.canDeleteOtherCharge;
                            break;
                        case 'canCreateUser':
                            res = response.data.canCreateUser;
                            break;
                        case 'canEditUser':
                            res = response.data.canEditUser;
                            break;
                        case 'canDeleteUser':
                            res = response.data.canDeleteUser;
                            break;
                        case 'canCreateRole':
                            res = response.data.canCreateRole;
                            break;
                        case 'canEditRole':
                            res = response.data.canEditRole;
                            break;
                        case 'canDeleteRole':
                            res = response.data.canDeleteRole;
                            break;
                        case 'canEditOrder':
                            res = response.data.canEditOrder;
                            break;
                        default:
                            break;
                   }
                   if (res)
                   { 
                        return res;
                   }
                        
                })
                .catch(e => {
                    console.log(e);
                })
        }
        return res;
    },

    getCustomerReservations: async function(id){
        return await axios.get(this.endPointURL + 'reservation?customer=' + id , {headers: {'Authorization': this.token, 'restaurantid': this.restaurantId}})
    },
    getReservationByCode: async function(id){
        return await axios.get(this.endPointURL + 'reservation?code=' + id , {headers: {'Authorization': this.token, 'restaurantid': this.restaurantId}})
    },

    customerLogIn: async function(item){
        return await axios.post(this.endPointURL + 'customer?login=1' , item , {headers: {'Authorization': this.token, 'restaurantid': this.restaurantId}})
    },

    customerForgotPassword: async function(item){
        return await axios.post(this.endPointURL + 'customer?forgotPassword=1' , item , {headers: {'Authorization': this.token, 'restaurantid': this.restaurantId}})
    },

    customerResetPassword: async function(item){
        return await axios.put(this.endPointURL + 'customer?changePassword=1' , item , {headers: {'Authorization': this.token, 'restaurantid': this.restaurantId}})
    },

    //Doing payments
    autenticateShift4: async function(item){
        return await axios.post(this.endPointURL + 'payment?activateshift4=1', item, {headers: {'Authorization':this.token, 'restaurantid': this.restaurantId}})
    },

    payShift4: async function(item, restaurantId, ipClient){
        return await axios.post(this.endPointURL + 'payment?payshift4=1', item, {headers: {'Authorization':this.token, 'restaurantid': restaurantId, 'ipClient': ipClient}})
    },

    authorizeShift4: async function(item, moto, restaurantId, ipClient){
        return await axios.post(this.endPointURL + 'payment?authorizationshift4='+moto, item, {headers: {'Authorization':this.token, 'restaurantid': restaurantId, 'ipClient': ipClient}})
    },

    captureShift4:  async function(invoice, moto, restaurantId){
        return await axios.get(this.endPointURL + 'payment?captureshift4=' + invoice + '&moto=' + moto,  {headers: {'Authorization':this.token, 'restaurantid': restaurantId}})
    },

    refoundShift4: async function(item, moto,  restaurantId){
        console.log("REFUND")
        return await axios.post(this.endPointURL + 'payment?refoundshift4='+moto, item, {headers: {'Authorization':this.token, 'restaurantid': restaurantId}})
    },

    invoiceInformationShift4: async function(invoice, moto, restaurantId){
        return await axios.get(this.endPointURL + 'payment?invoice=' + invoice +'&moto='+ moto, {headers: {'Authorization':this.token, 'restaurantid': restaurantId}})
    },

    voidShift4: async function(invoice, moto, restaurantId){
        return await axios.delete(this.endPointURL + 'payment?invoice=' + invoice +'&moto='+ moto, {headers: {'Authorization':this.token, 'restaurantid': restaurantId}})
    },

    getInvoiceSequence: async function(restaurantId){
        if (restaurantId == null)
            restaurantId = this.restaurantId
        return await axios.get(this.endPointURL + 'imenusupport?invoicenumber=1', {headers: {'Authorization':this.token, 'restaurantid': restaurantId}})
    },

    getCaptchaKey: async function(restaurantId){
        if (restaurantId == null)
            restaurantId = this.restaurantId
        return await axios.get(this.endPointURL + 'imenusupport?captchakey=1', {headers: {'Authorization':this.token, 'restaurantid': restaurantId}})
    },

    payAutorizeNet: async function(item, restaurantId){
        return await axios.post(this.endPointURL + 'payment?payAutorizeNet=1', item, {headers: {'Authorization':this.token, 'restaurantid': restaurantId}})
    },

    refoundAutorizeNet: async function(item, restaurantId){
        return await axios.post(this.endPointURL + 'payment?refoundAutorizeNet=1', item, {headers: {'Authorization':this.token, 'restaurantid': restaurantId}})
    },

    getClientIp: async function(){
        return await axios.get('https://api.ipify.org/?format=json'); // https://api.ipify.org/?format=json , http://www.ip-api.com/json/
    },

    payQrShift4: async function(item, restaurantId){
        return await axios.post(this.endPointURL + 'payment?payqrshift4=1', item, {headers: {'Authorization':this.token, 'restaurantid': restaurantId}})
    },

    validateStatusQrShift4: async function(item, restaurantId){
        return await axios.post(this.endPointURL + 'payment?statusqrshift4=1', item, {headers: {'Authorization':this.token, 'restaurantid': restaurantId}})
    },

    cancelQrShift4: async function(item, restaurantId){
        return await axios.post(this.endPointURL + 'payment?cancelqrshift4=1', item, {headers: {'Authorization':this.token, 'restaurantid': restaurantId}})
    },

    generateKeyTsys: async function(item, restaurantId){
            //item = {
            //  "mid": "",
            //  "userID": "",
            //  "password": ""
            // }
        return await axios.post(this.endPointURL + 'payment?generateKeyTsys=1', item, {headers: {'Authorization':this.token, 'restaurantid': restaurantId}})
    },

    tokenCardTsys: async function(item, restaurantId){
        return await axios.post(this.endPointURL + 'payment?generateTokenTsys=1', item, {headers: {'Authorization':this.token, 'restaurantid': restaurantId}})
    },

    payTsys: async function(item, restaurantId){
        return await axios.post(this.endPointURL + 'payment?payTsys=1', item, {headers: {'Authorization':this.token, 'restaurantid': restaurantId}})
    },

    authorizeTsys: async function(item, restaurantId){
        return await axios.post(this.endPointURL + 'payment?authorizeTsys=1', item, {headers: {'Authorization':this.token, 'restaurantid': restaurantId}})
    },

    captureTsys: async function(item, restaurantId){
        //item = {
        //  "transactionID": ""
        // }
    return await axios.post(this.endPointURL + 'payment?captureTsys=1', item, {headers: {'Authorization':this.token, 'restaurantid': restaurantId}})
    },


    invoiceTsys: async function(invoice, restaurantId){
        return await axios.get(this.endPointURL + 'payment?invoiceTsys=' + invoice, {headers: {'Authorization':this.token, 'restaurantid': restaurantId}})
    },

    returnWithReferenceTsys: async function(item, restaurantId){
        //item = {
        //  "transactionID": ""
        // }
    return await axios.post(this.endPointURL + 'payment?returnWithReferenceTsys=1', item, {headers: {'Authorization':this.token, 'restaurantid': restaurantId}})
    },

    voidTsys: async function(item, restaurantId){
        //item = {
        //  "transactionID": "",        
        // }
    return await axios.post(this.endPointURL + 'payment?voidTsys=1', item, {headers: {'Authorization':this.token, 'restaurantid': restaurantId}})
    },

    restoreBackUpFromPortal: async function(){
        return await axios.get(this.endPointURL + 'setting?restorefromportal=1', {headers: {'Authorization':this.token, 'restaurantid': this.restaurantId}})
    },

    restoreBackUpFromFile: async function(item){
        return await axios.post(this.endPointURL + 'setting?restorefromfile=1', item, {headers: {'Authorization':this.token, 'restaurantid': this.restaurantId}})
    },

    backUpToPortal: async function(){
        return await axios.get(this.endPointURL + 'setting?backup=1', {headers: {'Authorization':this.token, 'restaurantid': this.restaurantId}})
    },

    initPaxStore: async function(){
        return await axios.get(this.endPointURL + 'payment?initPaxstoreDevice=1', {headers: {'Authorization':this.token, 'restaurantid': this.restaurantId}})
    },

    doCreditStore: async function(){
        return await axios.get(this.endPointURL + 'payment?doCreditPaxstoreDevice=1', {headers: {'Authorization':this.token, 'restaurantid': this.restaurantId}})
    },

    walletInformation: async function(item, restaurantId, ipClient){
        return await axios.post(this.endPointURL + 'payment?walletShift4=1', item, {headers: {'Authorization':this.token, 'restaurantid': restaurantId, 'ipClient': ipClient}})
    },

    getPaymentByInvoice: async function(invoice, restaurantId,){
        return await axios.get(this.endPointURL + 'allpayments?invoice='+ invoice, {headers: {'Authorization':this.token, 'restaurantid': restaurantId}})
    },

    getPaymentByOrder: async function(modelId, restaurantId,){
        return await axios.get(this.endPointURL + 'allpayments?modelid='+ modelId, {headers: {'Authorization':this.token, 'restaurantid': restaurantId}})
    },

    getPaymentByDateTo: async function(todate, restaurantId,){
        return await axios.get(this.endPointURL + 'allpayments?todate='+ todate, {headers: {'Authorization':this.token, 'restaurantid': restaurantId}})
    },

    getPaymentByDateToFrom: async function(datefrom, dateto, restaurantId,){
        return await axios.get(this.endPointURL + 'allpayments?rangedatefrom='+ datefrom +'&rangedateto='+dateto, {headers: {'Authorization':this.token, 'restaurantid': restaurantId}})
    },

}