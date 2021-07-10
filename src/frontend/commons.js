import store from '../main.js'
import {Api} from '../backoffice/api/api.js'
import { Utils } from '../backoffice/utils/utils'
import moment from 'moment-timezone';
import {i18n} from '@/plugins/i18n'

export var Commons = {

    
    order: store.state.order,
    cart: store.state.cart,
    configuration: store.state.configuration,
    restaurantActive: store.state.restaurantActive,
    clientId: store.state.customer._id,
    CustomerName: store.state.customer.Name,
    email: store.state.customer.EmailAddress,
    phone: store.state.customer.Phone,   
    i18n: i18n,
    allTypeOrder:{'Delivery':i18n.t('frontend.app.deliver'), 'PickUp':i18n.t('frontend.app.pickup'), 'On Table':i18n.t('frontend.app.table'),'Curbside':i18n.t('frontend.app.curbside'), },
     

    getOtherCharges: async function(){   
      this.cart = store.state.cart;
      
        const otherCharges = []
        for (const obj of this.cart){
            const resp = await Api.findProductCharges(obj.ProductId, obj.Cant);           
            if(resp.status === 200 && resp.data.length > 0){
                 otherCharges.push( resp.data[0]); 
            }             
         }         
         return otherCharges;
    },

    changeRestaurant: async function(restaurantId){
        Api.setRestaurantId(restaurantId);

        if(store.state.allRestaurant.length === 0)
         await this.getAllRestaurant();
               
        await this.defaultData(restaurantId);   
        store.commit('setHasRating',false) ; 
        store.commit('setRestaurantId',restaurantId) ;
        
       
        if(this.clientId !==''){
            await this.getOrders();
            await this.getListReservation();
            await this.getTickets();
        }

        if(store.state.guess.Name && store.state.guess.Phone && store.state.guess.EmailAddress ){
          if(store.state.guess.Name !=='' && store.state.guess.Phone !=='' && store.state.guess.EmailAddress !=='' ){
            this.alertSubscription(store.state.guess.EmailAddress,store.state.guess.Name, store.state.guess.Phone);
          }
        }



          
        return true;
     },

     getAllRestaurant: async function(){
  
        try {
          const response = await Api.fetchAll('Restaurant');
            if(response.status === 200){            
                const allRest = response.data.filter(r => r.Online === true)
                store.commit('setAllRestaurant', JSON.parse(JSON.stringify(allRest)))
            }
            
        } catch (error) {
          error
        }
  
  
      
      },

     async getOrders(){
        if(this.clientId =='')
          return false;       
         try {
           const response = await Api.getCustomerOrders(this.clientId)
          if(response.status === 200){
            store.commit('setAllOrder', response.data)            
          }          
         } catch (error) {          
          error
         }       
      },
  
      async getTickets(){
        if(this.clientId =='')
          return false;
       
         try {
           const response = await Api.getCustomerTickets(this.clientId)
          if(response.status === 200 && response.data.length > 0){
            store.commit('setAllTickets', response.data) 
            this.cart = JSON.parse(JSON.stringify(response.data[0].Products)) ;         
            store.commit('setCart', this.cart);
            this.order =JSON.parse(JSON.stringify(response.data[0])) ;
            store.commit('setOrder', this.order);
          } 
          else store.commit('setAllTickets', [])           ;
         } catch (error) {         
            error
         }       
      },

      getListReservation: async function(){
        if(this.clientId =='')
          return false;       
         await  Api.getCustomerReservations(this.clientId)
          .then(response => {
              store.commit('setAllReservations', response.data)                    
          })
          .catch(e => {            
            e           
          })   
      },

      async defaultData(restaurantId){       
  
        store.commit('setCart', []) 
        store.commit('setOrder', {})  
        store.commit('setAllOrder', []) 
        store.commit('setAllReservations', []) 
        store.commit('setConfiguration', {})
        store.commit('setAllTickets', [])  
        store.commit('setMenuSinCatering', []) 
        store.commit('setMenuConCatering', [])        
        store.commit('setCategoryMenuListSinCatering', []) 
        store.commit('setCategoryMenuConCatering', [])        
        store.commit('setProducts', []) 
        store.commit('setVariants', []) 
        store.commit('setCategories', []) 
        store.commit('setTax', {}) 
        store.commit('setShipping', {}) 
        store.commit('setRestaurantActive', {}) 
        store.commit('setWalletConfig', {}) 
        store.commit('setSubscriptors', []) 

        document.querySelector('style').innerHTML += Utils.defaultStyles;
       
  
        await  this.getConfig();
        await this.fetchMenus(); 

        await this.restaurantData(restaurantId);  
        await this.fetchProducts();           
        await this.fetchVariants();  
        await this.fetchCategories();     
        await this.getTax();  
        await this.getShipping();  
        await this.getSubscriptors();
        await this.getAllTaxes();
       
       
        if(store.state.restaurantActive.payMethod === 'SHIFT4'){         
          this.getWalletInformation();          
        }
          
      },

      getConfig: async function(){
     
        await Api.fetchAll("Setting").then(response => {
          if(response.status === 200){
            
            var allStyles= response.data[0].AllStyles;
            document.querySelector('style').innerHTML += allStyles;
  
            const configuration = {
              showCooker: response.data[0].ShowCooker,
              selectPickHour: response.data[0].SelectPickHour,
              deliveryZone: response.data[0].DeliveryZone,
              zipCodes: response.data[0].ZipCodes,
              CanViewGeolocation: response.data[0].CanViewGeolocation,
              minTimeToCook: response.data[0].MinTimeToCook,
              minHour: response.data[0].PickFrom,
              maxHour: response.data[0].PickTo,
              viewCatering: response.data[0].ViewCatering,
              tipRequire: response.data[0].TipRequire || false, 
              tips: response.data[0].Tips || [],
              viewRating: response.data[0].ViewRating || false,
              payForQuotation: response.data[0].PayForQuotation || false, 
              percentPayForQuotation: response.data[0].PercentPayForQuotation || 0,  
              minAmountCateringDelivery: response.data[0].MinAmountCateringDelivery || 0,
              minAmoutCatering: response.data[0].MinAmoutCatering || 0, 
              cateringMarginDays : response.data[0].CateringMarginDays || 2, 
              cateringStates : response.data[0].CateringStates || [],
              zipCodesExcludes : response.data[0].ZipCodesExcludes || [],
              cateringEvents : response.data[0].CateringEvents || [],
              viewReservation : response.data[0].ViewReservation || false,
              viewCustomerReservation : response.data[0].ViewCustomerReservation || false,
              minDayToReservation : parseInt(response.data[0].MinDayToReservation) || 0,
              reservationDaysAndTime : response.data[0].ReservationDaysAndTime || [],
              viewDelivery : response.data[0].ViewDelivery || false,
              viewOnTable : response.data[0].ViewOnTable || false,  
              viewCurbside : response.data[0].ViewCurbside || false,                     
              hasReservationQuotation : response.data[0].HasReservationQuotation || false, 
              payForReservationQuotation : response.data[0].PayForReservationQuotation || 0,
              showOtherRestaurant: response.data[0].ShowOtherRestaurant || false,
              ads : response.data[0].Ads || [],
              hasDeliveryPayment: response.data[0].HasDeliveryPayment || false,
            }
  
            store.commit('setConfiguration', configuration)           
           }
        })
        .catch(e => {       
           e         
        });
      },

      async getCategoryMenu(menulist){
        if(menulist.length > 0){        
          const id = menulist[0]._id;                 
          const response = await Api.categoryByMenuId(id);        
          if(response.status === 200){ 
            return response.data;
          }  
        }
      },

      async fetchMenus(){ 
          
        try {
            const responseSC = await Api.menuSinCaterin();
            if(responseSC.status === 200){
                const menuSC = responseSC.data.filter(m =>m.Active === true)
                store.commit('setMenuSinCatering',menuSC)
                const categoryMenuListSinCatering = await this.getCategoryMenu(menuSC) 
                store.commit('setCategoryMenuListSinCatering', categoryMenuListSinCatering)
            }

            const responseCC = await Api.menuConCaterin();
            if(responseCC.status === 200){
                const menuCC = responseCC.data.filter(m =>m.Active === true)
                store.commit('setMenuConCatering', menuCC) 
                const menuListConCatering = await this.getCategoryMenu(menuCC) 
                store.commit('setCategoryMenuConCatering', menuListConCatering) 
            }          
            
        } 
        catch (error) {
          error            
        }
     
    },

    restaurantData: async function(restaurantId){

        let flag = false;
  
        try{
          const response = await Api.fetchById("Restaurant", restaurantId)         
          if(response.status === 200){
  
            const dataRestaurant = {
              restaurantId: restaurantId,
              restaurantName: response.data.Name,
              restaurantZipCode: response.data.ZipCode,
              restaurantUrl: response.data.Url,
              restaurantPhone: response.data.Phone,
              restaurantLogo: response.data.ImageUrl,
              restaurantEmail: response.data.Email,
              restaurantAddress: response.data.Address,
              currency: response.data.Currency,
              hasPaymentCardConfig: response.data.HasPaymentCardConfig || false,
              restaurantWeb : response.data.Web || '',          
              restaurantDaysAndTime : response.data.RestaurantDaysAndTime || [],          
              customHours: response.data.CustomHours || false,   
              customHoursText : response.data.CustomHoursText || '',          
              payMethod : response.data.PayMethod || '', 
              rating : response.data.rating || [],
              UrlLocation: response.data.UrlLocation || '',
              Fax: response.data.Fax || '',
            };
  
            flag = response.data.Online || false;
  
            const fcb = response.data.Sociasls.findIndex(pr => pr.SocialName === 'Facebook');
            if (fcb !== -1)  dataRestaurant.restaurantFacebok=  response.data.Sociasls[fcb].SocialUrl;
            const twt = response.data.Sociasls.findIndex(pr => pr.SocialName === 'Twitter');
            if (twt !== -1)  dataRestaurant.restaurantTwitter=  response.data.Sociasls[twt].SocialUrl;
            const itg = response.data.Sociasls.findIndex(pr => pr.SocialName === 'Instagram');
            if (itg !== -1)  dataRestaurant.restaurantInstagram =  response.data.Sociasls[itg].SocialUrl;
            const ytb = response.data.Sociasls.findIndex(pr => pr.SocialName === 'Youtube');
            if (ytb !== -1)  dataRestaurant.restaurantYoutube =  response.data.Sociasls[ytb].SocialUrl;
  
             store.commit('setRestaurantActive', dataRestaurant)
            } 
            return flag;
          }
          catch (error) {           
            error;
          return flag;
        }
  
      },

      getAllTaxes:async function(){      
        await Api.fetchAll("Tax").then(response => {         
          
          const taxes = response.data.filter(t => t.Available === true)        
          store.commit('setAllTaxes', JSON.parse(JSON.stringify(taxes)))     
          })
          .catch(e => {
            e
          });
       },

    fetchProducts:async function(){
      
       await Api.fetchAll("Product").then(response => {
         const allSpecialProd = response.data;
         for (const prod of allSpecialProd) {
           if(prod.SpecialPrice && prod.SpecialPrice > 0)
              prod.SalePrice = prod.SpecialPrice           
         }
        store.commit('setProducts', allSpecialProd)          
        })
        .catch(e => {
          e
        });
      },
  
    fetchVariants: async function(){        
        await Api.fetchAll("Variantgroup").then(response => {
          const allSpecialVariants = response.data;
          for (const variant of allSpecialVariants) {
            for (const prod of variant.Variants) {
              if(prod.SpecialPrice && prod.SpecialPrice > 0)
                prod.SalePrice = prod.SpecialPrice    
            }            
          }
        
        store.commit('setVariants', response.data) ;
        })
        .catch(e => {        
          e       
        });
      },
    
      fetchCategories: async function(){       
        await Api.fetchAll('Menu').then(response => {
          if(response.data.length > 0){
             Api.getAllCategoryActiveMenu().then(response => {
                store.commit('setCategories', response.data) ;
          }).
           catch(e => 
               e)
          }
        })
        .catch(e => 
        e)
      },

      getTax: function(){
        Api.getAvailbleTax().then(response => {
            const tax = {
                taxesName: response.data.Name,
                taxes: response.data.Percentage 
            }            
            store.commit('setTax', tax) ;
        })
        .catch(e => {
            e
        });   
     },
         
      getShipping: function(){        
        Api.getAvailbleShipping().then(response => {
                const shipping = {
                shippingName: response.data.Name,
                shipping: parseFloat(response.data.Price)
            }            
            store.commit('setShipping', shipping) ;           
        })
        .catch(e => {
           e
        });       
     },

     getSubscriptors: async function(){        
     try {
      const response = await Api.fetchAll('Subscriptor');
      if(response.status === 200)
        store.commit('setSubscriptors', response.data)
     } catch (error) {
      error
     }      
   },

     async getWalletInformation(){
      
     
      const basket = {"invoice": 666, "total": 100 };       
      try {
      const ipClient = await Api.getClientIp();

      const res = await Api.walletInformation(basket, store.state.restaurantActive.restaurantId, ipClient.data.ip); 
      if(res.status === 200 && res.statusText === "OK"){

        const walletConfig = {
         merchantId: res.data.walletConfig.merchantID.toString(), 
          gateway : res.data.walletConfig.googlePay.gateway,          
          allowedAuthMethods: res.data.walletConfig.googlePay.allowedAuthMethods,         
          allowedCardNetworks: res.data.walletConfig.googlePay.allowedCardNetworks, 
          currencyCode: res.data.walletConfig.currencyCode,
          countryCode: res.data.walletConfig.countryCode, 
        };

        store.commit('setWalletConfig', walletConfig);
       
      }         
         return false;
      } catch (error) {
        error;
      }  
    },

    getFormatPrice(price){
      const result = new Intl.NumberFormat('en', {style: "currency", currency: store.state.restaurantActive.currency} ).format(price)
      return result;
    },

    getDate(thisDate){
      return  moment.tz(thisDate, moment.tz.guess()).format('MM-DD-YYYY') 
    },

     getHour(thisHour){
      return  moment.tz(thisHour, moment.tz.guess()).format('hh:mm A') 
    },


    htmlToSendEmailOrder(order){

     

      let totalWithoutQuotation = 0;
      if(order.QuotationPayment)        
            totalWithoutQuotation = order.Total - order.QuotationPayment;
        else
            totalWithoutQuotation = order.Total;
       
      var date = moment.tz(moment.tz.guess()).format('MM/DD/YYYY HH:mm:ss');

      if(order.Date)       
        date = moment.tz(order.Date, moment.tz.guess()).format('MM/DD/YYYY HH:mm:ss');

      const  allStates = [i18n.t('frontend.order.state0'),i18n.t('frontend.order.state1'), i18n.t('frontend.order.state2'),
      i18n.t('frontend.order.state3'), i18n.t('frontend.order.state4'), i18n.t('frontend.order.state5')];

      let urlCurbside = '';
      let orderInfo = '';
      if(order.OrderType == 'Delivery')
          orderInfo = order.AddressToDeliver
      if(order.OrderType == 'PickUp')
          orderInfo = moment.tz(order.DateToPick, moment.tz.guess()).format('MM-DD-YYYY') + ' |  ' + moment.tz(order.HourToPick, moment.tz.guess()).format('hh:mm A')
      if(order.OrderType == 'On Table')
          orderInfo = order.tableService
      if(order.OrderType == 'Curbside'){
          orderInfo = moment.tz(order.DateToPick, moment.tz.guess()).format('MM-DD-YYYY') + ' |  ' + moment.tz(order.HourToPick, moment.tz.guess()).format('hh:mm A')
          if(order._id)
            urlCurbside = `https://imenuapps.net/?rid=${store.state.restaurantActive.restaurantId}&curbside=${order._id}`;
      }

      var html =' <html><head>';    
      html +='<style> .progressBar { width: 100%;  border-bottom: 1px solid black;display: list-item;list-style: unset; padding: 0}';
      html += '.progressBar li {list-style-type: none; float: left; position: relative; text-align: center; margin:0}';
      html += '.progressBar li .before {content: " "; line-height: 30px; border-radius: 50%; width: 30px; height: 30px; border: 1px solid #ddd;';
      html += 'display: block;text-align: center;margin: 0 auto 10px;background-color: white}';
      html += '.progressBar li .after { content: "";position: absolute;width: 100%;height: 4px;background-color: #ddd;top: 15px;left: -50%;z-index: -1;}';
      html += '.progressBar li .one .after {content: none;}.progressBar li.active {color: black;}';
      html += '.progressBar li.active .before { border-color: #63ee68; background-color: #63ee68}.progressBar .active:after {background-color: #4ca44f;} </style>';
      
      html += '</head><body><div >';
      html += '<table  align=center style="width: 90%;">';
      html += '<tr><td colspan=6 style="text-align: center;">';
      html += `<h2>${store.state.restaurantActive.restaurantName}</h2>  `;
      html += `<img src="${store.state.restaurantActive.restaurantLogo}" style="max-width: 100px;"></img> `;     
      html +=`</td>`;     
      html += `</tr>`;          
      html += '<tr><td colspan=6 >'
      if(order.Payment){
         html += `<br> <h2> ${i18n.t('frontend.order.payment')}: </h2>`;
         for (const payment of order.Payment) {
          if(payment.paymentInfo)
            html += ` <h4> 
              ${i18n.t('frontend.order.total')}: <strong>  ${ this.getFormatPrice(payment.total)} </strong>  |
              ${i18n.t('frontend.order.transId')}: <strong>  ${ payment.paymentInfo.transId} </strong>  |
              ${i18n.t('frontend.order.paymentMethod')}: <strong>  ${ payment.PaymentMethod} </strong> 
            </h4>`;
        }
      }
      html += `<h4>${i18n.t('frontend.order.date')}: ${date} </h4><hr>`;
      html += `<h4>${i18n.t('frontend.order.client')}: ${order.CustomerName} </h4>`;
      html += `<h4>${i18n.t('frontend.orderType.phone')}: ${order.CustomerPhone} </h4>`;  
      if(order.OrderType)    
        html += `<h4>${i18n.t('frontend.order.orderFor')} ${this.allTypeOrder[order.OrderType]}: ${orderInfo} </h4>`;
      if(order.State) 
        html += `<h4>${i18n.t('frontend.order.orderState')}: ${allStates[order.State]} </h4>`;
      if(order.State == 6)
          html += `<h4>${i18n.t('frontend.order.cancelReason')}: ${order.CancelNote}</h4><hr>`;         
      if(urlCurbside !== ''){           
            html+= `<h2>${i18n.t('frontend.home.curbsideDetail')}</h2>`  
            html += `<h4>${i18n.t('frontend.orderType.licencePlate')}: ${order.LicencePlate} </h4>`;
            html += `<h4>${i18n.t('frontend.orderType.vehicleModel')}: ${order.VehicleModel} </h4>`;
            html += `<h4>${i18n.t('frontend.orderType.vehicleColor')}: ${order.VehicleColor} </h4>`;
            html += `<a href="${urlCurbside}">${i18n.t('frontend.tooltips.getToRestaurant')}</a><hr>`;             
        } 
      html += `</td></tr>`; 
      html += `<tr ><td colspan=6 ><h2 ><strong>${i18n.t('frontend.order.products')}</strong></h2></td></tr> <tr></tr>`;
      for(var i = 0; i<order.Products.length ; i++){
          html += `<tr ><td  colspan=4 style="width: 50%;border-bottom: 1px solid #dbd1d1;" ><strong >${order.Products[i].Name} `
          if(order.Products[i].VariantSelected)
            if(order.Products[i].VariantSelected.name)
              html += `${order.Products[i].VariantSelected.name }`
          html += `</strong>` ;
          if(this.hasSomeNote(order.Products[i]))
              html +=`<p style="background: #f1f1004d;">${this.getIngredientNote(order.Products[i])} </br> ${order.Products[i].Note}</p> `;
          html +=`</td><td style="width: 25%;border-bottom: 1px solid #dbd1d1;" > <p >( ${order.Products[i].Cant} X ${this.getFormatPrice(order.Products[i].Price)} )</p> </td>`;
          html += `<td style="width: 25%;border-bottom: 1px solid #dbd1d1;"> <p > ${ this.getFormatPrice( order.Products[i].Price * order.Products[i].Cant )}</p> </td>`;
          html += `</tr>`;
         if(order.Products[i].Aggregates.length > 0){
              html +=`<tr style="padding: 20px 35px;"> ${i18n.t('frontend.home.aggregateFree')}: ${order.Products[i].CantAggr=order.Products[i].AggregatesCant * order.Products[i].Cant} </tr>`;

               for(var a=0; a<order.Products[i].Aggregates.length; a++){
                  let agg = order.Products[i].Aggregates[a]
                  html += `<tr ><td  colspan=4 style="width: 50%;border-bottom: 1px solid #dbd1d1;" ><p style="padding-left: 20px;">${agg.Name} <br> ${this.getFormatPrice(agg.SalePrice)}</p>` ;
                  html +=`</td><td style="width: 25%;border-bottom: 1px solid #dbd1d1;" > <p > ${agg.Cant}</p> </td>`;
                  html += `<td style="width: 25%;border-bottom: 1px solid #dbd1d1;"> <p > ${ this.getFormatPrice( agg.AllTotal ) }</p> </td></tr >`;            
               }
          }
          
      }

      if(order.OtherCharges){
          if(order.OtherCharges.length >0){
            html += `<tr ><td colspan=6 ><h4 ><strong>${i18n.t('frontend.order.otherCharges')}</strong></h4></td></tr>`;
            for(var e = 0; e< order.OtherCharges.length ; e++){
                html += ` <tr ><td colspan=5 style="width: 75%;border-bottom: 1px solid #dbd1d1;"><p >${order.OtherCharges[e].Name}</p></td> <td style="border-bottom: 1px solid #dbd1d1;"> <p> ${this.getFormatPrice(order.OtherCharges[e].Price)}</p></td></tr>`;
            }
        }
      }
      html += `<tr ><td colspan=5 ><p ><strong>${i18n.t('frontend.order.subtotal')}</strong></p></td> <td > <p > ${this.getFormatPrice(order.SubTotal)}</p></td></tr>`;
      for(var g = 0 ; g< order.AllTaxes.length ; g++){
        html += `<tr><td  colspan=5><p  ><strong>${order.AllTaxes[g].Name} (${order.AllTaxes[g].Percentage}%) </strong></p></td> <td > <p >${ this.getFormatPrice(order.AllTaxes[g].Percentage * order.SubTotal / 100) }</p> </td></tr>`;
      }
      if(order.OrderType == 'Delivery')
          html +=  `<tr ><td colspan=5 ><p  ><strong>${i18n.t('frontend.order.deliver')}</strong></p></td><td  ><p > ${this.getFormatPrice(order.Shipping) }</p></td></tr>`;
      if(order.Tip)
          html += `<tr ><td  colspan=5 ><p ><strong>${i18n.t('frontend.order.tip')} ${order.Tip}%</strong></p></td><td ><p>${ this.getFormatPrice(order.Tip * order.SubTotal / 100) } </p> </td></tr>`;
      html += `<tr><td colspan=5 style="border-bottom: 1px solid #dbd1d1;"><p  ><strong>${i18n.t('frontend.order.total')}</strong></p></td> <td style="border-bottom: 1px solid #dbd1d1;"> <strong > ${this.getFormatPrice(order.Total) }</strong> </td></tr>`;
      
      if(order.QuotationPayment)
      html += `<tr style="border-bottom: 1px solid #399922;"><td colspan=5 ><p  ><strong>Quotation</strong></p></td> <td > <strong >${this.getFormatPrice(order.QuotationPayment)}</strong> </td></tr>`;
      if(order.PendingPayment)
        html += `<tr style="border-bottom: 1px solid #ff5500;"><td colspan=5 style="border-bottom: 1px solid #ff5500;"><p  ><strong>Pending</strong></p></td> <td  style="border-bottom: 1px solid #ff5500;"> <strong >${this.getFormatPrice(order.PendingPayment)}</strong> </td></tr>`;
      if(order.PendingPayment > 0 && order.Deadline){
          html += `<tr ><td colspan=6 ><h4 ><strong>Parcial Payment</strong></h4></td></tr>`;
          for(var dead = 0; dead < order.Deadline.length ; dead ++){
              html += ` <tr ><td colspan=3 style="border-bottom: 1px solid #dbd1d1;"><p >${order.Deadline[dead].Date}  </p></td> `
              html += ` <td colspan=3 style="border-bottom: 1px solid #dbd1d1;"><strong >  ${order.Deadline[dead].Percent}%  =  ${ this.getFormatPrice((totalWithoutQuotation * order.Deadline[dead].Percent) / 100)}</strong></td> `
              if(order.Deadline[dead].State === 1)
              html += ` <td style="border-bottom: 1px solid #dbd1d1;"> <strong  style= "color: #399922;  ">Payed</strong></td>`;
              else html += ` <td style="border-bottom: 1px solid #dbd1d1;"><strong  style= "color: #ff5500; ">Pending</strong> </td>`;
              html += ` </tr>`;
          }
        }   
      
      if(order.Note)
          html += `<tr ><td style="width: 20%;border-bottom: 1px solid grey;"><h4 >${i18n.t('frontend.order.notes')}</h4></td><td colspan=5 style="width: 80%;border-bottom: 1px solid grey;" ><p >${order.Note}</p></td></tr>`;
      html += '<tr><td colspan=6 style=" text-align: center;">';
      html += `<h2>${store.state.restaurantActive.restaurantName}</h2>  `;
      html += `<h4>${store.state.restaurantActive.restaurantPhone} </h4> `;
      html += `<h4>${store.state.restaurantActive.restaurantAddress}  </h4>`; 
      if(store.state.restaurantActive.restaurantWeb)  
          html += `<h4>${store.state.restaurantActive.restaurantWeb}  </h4>`;   
      html +=`</td>`;     
      html += `</tr>`; 
      html += '<tr> <td colspan=6 align="center"  style="border-bottom: 1px solid grey;">';
      html += `<a href="mailto:${store.state.restaurantActive.restaurantEmail}" style="margin: 0 10px;"><img style="width: 32px;" src="https://storagemenusuccess.blob.core.windows.net/logo/email-icon.png"></img> </a>`;
      if(store.state.restaurantActive.restaurantFacebok)
          html += `<a href="${store.state.restaurantActive.restaurantFacebok}" style="margin: 0 10px;"><img style="width: 32px;" src="https://storagemenusuccess.blob.core.windows.net/logo/Facebook-icon.png"></img> </a>`;
      if(store.state.restaurantActive.restaurantInstagram)
          html += `<a  href="${store.state.restaurantActive.restaurantInstagram}" style="margin: 0 10px;"><img style="width: 32px;"  src="https://storagemenusuccess.blob.core.windows.net/logo/instagram-icon.png"></img> </a>`;
      if(store.state.restaurantActive.restaurantTwitter)
          html += `<a href="${store.state.restaurantActive.restaurantTwitter}" style="margin: 0 10px;"><img style="width: 32px;"  src="https://storagemenusuccess.blob.core.windows.net/logo/Twitter-icon.png"></img> </a>`;
      if(store.state.restaurantActive.restaurantYoutube)
          html += `<a href="${store.state.restaurantActive.restaurantYoutube}" style="margin: 0 10px;"><img style="width: 32px;"  src="https://storagemenusuccess.blob.core.windows.net/logo/Youtube-icon.png"></img> </a>`;
      
      html += '</td></tr>'
      html += `</table></div></body></html>`;
      
    return html;
    

    },

    async sendOrderEmail(order){
   
      const html = this.htmlToSendEmailOrder(order);
      var items = {
        "email": order.CustomerEmail,
        "mess": html,
        "subject": i18n.t('frontend.order.invoice') + '-'+ order.Payment[0].paymentInfo.transId +' ' + store.state.restaurantActive.restaurantName
      }
      return Api.sendEmail(items);    
    },

    getIngredientNote(car){
      let str = i18n.t('frontend.home.withoutIngredients') + ': '
      let count = 0
  
      if(car.Ingredients)
        car.Ingredients.forEach( e => 
          { 
            if(e.selected === 0 ) {
            str += e.name + '. ' ;
            count ++
            } 
          } )
      if(count >0)
      return str
  
      return '';
      
    },
  
    hasSomeNote(car){
      let flag = false;
      if(car.Note) flag = true;
      if(this.getIngredientNote(car) !== '') flag = true;
      return flag;
    },

    htmlSendReservation(reservation){

      const  allState = [i18n.t('frontend.reservation.state0'), i18n.t('frontend.reservation.state1'),
                          i18n.t('frontend.reservation.state2'), i18n.t('frontend.reservation.state3'),
                          i18n.t('frontend.reservation.state4'), i18n.t('frontend.reservation.state5'),
                          i18n.t('frontend.reservation.state6')];
      var html =' <html><head>';    
      html +='<style> .progressBar { width: 100%;  border-bottom: 1px solid black;display: list-item;list-style: unset; padding: 0}';
      html += '.progressBar li {list-style-type: none; float: left; position: relative; text-align: center; margin:0}';
      html += '.progressBar li .before {content: " "; line-height: 30px; border-radius: 50%; width: 30px; height: 30px; border: 1px solid #ddd;';
      html += 'display: block;text-align: center;margin: 0 auto 10px;background-color: white}';
      html += '.progressBar li .after { content: "";position: absolute;width: 100%;height: 4px;background-color: #ddd;top: 15px;left: -50%;z-index: -1;}';
      html += '.progressBar li .one .after {content: none;}.progressBar li.active {color: black;}';
      html += '.progressBar li.active .before { border-color: #63ee68; background-color: #63ee68}.progressBar .active:after {background-color: #4ca44f;} </style>';
      
      html += '</head><body><div >';
      html += '<table  align=center style="width: 90%;">';
      html += '<tr><td colspan=6 style="text-align: center;">';
      html += `<h2>${i18n.t('frontend.reservation.reservationDetail')}</h2>  `;
      html +=`</td>`;     
      html += `</tr>`; 
       html += '<tr><td colspan=6 style="text-align: center;">';
      html += `<h4>${store.state.restaurantActive.restaurantName}</h4>  `;       
      html += `<img src="${store.state.restaurantActive.restaurantLogo}" style="max-width: 100px;"></img> `;     
      html +=`</td></tr>`;         
      html += '<tr><td colspan=6 >'
      if(reservation.CustomerName)
        html += `<h4> ${i18n.t('frontend.orderType.name')}: ${reservation.CustomerName}</h4>`;
      if(reservation.CustomerEmail)
        html += ` <h4> ${i18n.t('frontend.orderType.email')}: ${reservation.CustomerEmail}</h4>`;
      if(reservation.CustomerPhone)
        html += ` <h4> ${i18n.t('frontend.orderType.phone')}: ${reservation.CustomerPhone}</h4>`;
      if(reservation.Capacity)
        html += ` <h4> ${i18n.t('frontend.reservation.peoples')}: ${reservation.Capacity}</h4>`;
      if(reservation.Date)
        html += ` <h4> ${i18n.t('frontend.reservation.reservationDate')}: ${this.getDate(reservation.Date)}</h4>`;
      if(reservation.Hour)
        html += ` <h4> ${i18n.t('frontend.reservation.reservationHour')}: ${this.getHour(reservation.Hour)}</h4>`;
      if(reservation.Note)
        html += ` <h4> ${i18n.t('frontend.order.notes')}: ${reservation.Note}</h4>`;
      if(reservation.Reason)
        html += ` <h4> ${i18n.t('frontend.reservation.reason')}: ${reservation.Reason}</h4>`;
      if(reservation.State)
        html += ` <h4> ${i18n.t('frontend.home.state')}: ${allState[reservation.State]}</h4>`;
      if(reservation.Code)
        html += ` <h4> ${i18n.t('frontend.reservation.code')}: ${reservation.Code}</h4>`;
      if(reservation.QuotationPayment)
        html += `<h4> ${i18n.t('frontend.reservation.dinnerPrePayment')}: ${ this.getFormatPrice(reservation.QuotationPayment)}</h4>`;     
      html += `</td></tr>`;  

      html += '<tr><td colspan=6 style=" text-align: center;">';
      html += `<h2>${store.state.restaurantActive.restaurantName}</h2>  `;
      html += `<h4>${store.state.restaurantActive.restaurantPhone} </h4> `;
      html += `<h4>${store.state.restaurantActive.restaurantAddress}  </h4>`; 
      if(store.state.restaurantActive.restaurantWeb)  
          html += `<h4>${store.state.restaurantActive.restaurantWeb}  </h4>`;   
      html +=`</td>`;     
      html += `</tr>`; 
      html += '<tr> <td colspan=6 align="center"  style="border-bottom: 1px solid grey;">';
      html += `<a href="mailto:${store.state.restaurantActive.restaurantEmail}" style="margin: 0 10px;"><img style="width: 32px;" src="https://storagemenusuccess.blob.core.windows.net/logo/email-icon.png"></img> </a>`;
      if(store.state.restaurantActive.restaurantFacebok)
          html += `<a href="${store.state.restaurantActive.restaurantFacebok}" style="margin: 0 10px;"><img style="width: 32px;" src="https://storagemenusuccess.blob.core.windows.net/logo/Facebook-icon.png"></img> </a>`;
      if(store.state.restaurantActive.restaurantInstagram)
          html += `<a  href="${store.state.restaurantActive.restaurantInstagram}" style="margin: 0 10px;"><img style="width: 32px;"  src="https://storagemenusuccess.blob.core.windows.net/logo/instagram-icon.png"></img> </a>`;
      if(store.state.restaurantActive.restaurantTwitter)
          html += `<a href="${store.state.restaurantActive.restaurantTwitter}" style="margin: 0 10px;"><img style="width: 32px;"  src="https://storagemenusuccess.blob.core.windows.net/logo/Twitter-icon.png"></img> </a>`;
      if(store.state.restaurantActive.restaurantYoutube)
          html += `<a href="${store.state.restaurantActive.restaurantYoutube}" style="margin: 0 10px;"><img style="width: 32px;"  src="https://storagemenusuccess.blob.core.windows.net/logo/Youtube-icon.png"></img> </a>`;
      
      html += '</td></tr>'

      html += `</table></div></body></html>`;

      return html;
    },

    async alertSubscription(email, name, phone){

      const index = store.state.subscriptors.findIndex( s=> s.Email === email);
      var mss = '';
      var flag = false;

      if( index === -1){
        mss = i18n.t('frontend.createNew.reciveSubscription')
        flag = true
      }
      else{
          if(store.state.subscriptors[index].State === false){
            mss = i18n.t('frontend.createNew.activateSubscription');
            flag = true
          }
      }  
      if(flag){
        const toast = document.createElement('ion-toast');
        toast.message = mss + ' '+ store.state.restaurantActive.restaurantName;
        toast.position = 'botton';
        toast.color= "dark";
        toast.duration = 10000;
        toast.buttons = [
          {
              text: 'Ok', role: 'acept',handler: async () => {
                  if(index === -1){
                      toast.dismiss();
                      const data = {
                          "Email": email,
                          "Phone": phone,
                          "Name": name
                      }                    
                      const response = await Api.postIn('subscriptor', data);
                      if(response.status === 200){                            
                        await this.getSubscriptors();
                      }   
                  }                            
                  else {       
                      toast.dismiss();                     
                      const data = store.state.subscriptors[index]
                      data.State = true;
                      const response = await Api.putIn('subscriptor', data);
                      if(response.status === 200){                             
                          await this.getSubscriptors();
                      }  
                  }
              }
          },
          {
              text: 'Cancel', role: 'cancel',handler: () => {}
          }
                        ];

        document.body.appendChild(toast);
        return toast.present();

    }
  },
       
    
}