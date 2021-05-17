<template>
  <div>  
    
    <div class="ion-padding">  
       <qrcode-vue v-if="hasQrPayment !=='' && staffName!== ''"
        :value="hasQrPayment" 
        :size=200 level="H" 
        style="text-align: center;padding: 5px 20px;" >
      </qrcode-vue>

      <ion-button style="text-align: center; padding: 5px 20px;" @click="printOrder(order)"  v-if="hasQrPayment !=='' && staffName!== ''">
       <span class="iconify" data-icon="ic:round-local-printshop" data-inline="false"></span></ion-button>

     

        

        <div style="padding: 20px 15px; text-align: center">

          <ion-button :disabled="spinner1? true: false"  fill="outline" @click="cancelQrPayment">{{Cancel}}</ion-button>
          <ion-button :disabled="spinner1? true: false" fill="outline"  @click="validateQrPayment">{{verifyText}}</ion-button>

          <div v-if="spinner1" style="margin: 10px">
              <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
          </div>

        </div>

       
    </div>
  </div>
</template>

<script>

import { eye } from "ionicons/icons";
import { addIcons } from "ionicons";
import moment from 'moment-timezone';
import { Plugins } from '@capacitor/core';
 const { Share } = Plugins;




addIcons({
  "ios-eye": eye.ios,
  "md-eye": eye.md,
});

import { payAuthorizeNet } from '../../backoffice/api/payments.js';
import Moment from 'moment';
import QrcodeVue from 'qrcode.vue';

export default {
   name: 'PaymentModal',
   created: function(){
      this.getQrPayment();

    
   },
   props: { 
    splitOrder: {type: Boolean, default: false},    
    staffName:   {type: String, default:"" } ,
    RestaurantName:   {type: String, default:"" } ,
    parent: {type: Object, default:() => {} },       
    order: {type: Object, default:() => {} },       
    Acept:  {type: String, default:"" } ,
    Cancel:  {type: String, default:"" } ,
    Total:  {type: String, default:"" } ,
    Tax:  {type: String, default:"" } ,
    TaxName:  {type: String, default:"" } ,
    restaurantId:  {type: String, default:"" } ,
    payMethod:  {type: String, default:"" } ,    
    errorPaymentHeader:  {type: String, default:"" } ,
    errorPaymentMss:  {type: String, default:"" } ,
    gooPaymentHeader:  {type: String, default:"" } ,
    gooPaymentMss:  {type: String, default:"" } ,
    notValidEmail:  {type: String, default:"" } ,
    codeNotValid:  {type: String, default:"" } ,
    notValidCC:  {type: String, default:"" } ,
    dataRequired:  {type: String, default:"" } ,   
    paymentByCard:   {type: String, default:"" } ,  
    currency:   {type: String, default:"" } ,   
    ccard: {type: String, default:"" } ,
    expcard: {type: String, default:"" } , 
    ccode:   {type: String, default:"" } , 
    cityText: {type: String, default:"" } ,
    stateText: {type: String, default:"" } ,
    firstNameText: {type: String, default:"" } ,
    lastNameText: {type: String, default:"" } ,
    postalCode: {type: String, default:"" } ,
    addressLine1: {type: String, default:"" } ,
    verifyText: {type: String, default:"" } ,
    returnTo:  {type: String, default:"" } ,
    isTicket: {type: Boolean, default: false } ,
  },
  components:{
    QrcodeVue
  },
   data () {
    return {                       
        spinner: false ,
        spinner1: false,           
        dateTodaymin: new Date().toISOString().substr(0, 7),
        dateTodaymax:  new Date().getFullYear(),
        date: Moment().toISOString(),     
        cardNumber:'',
        cardCode: '',
        expirationCard:'',
        firstName: '',      
        lastName: '',
        zipCode: '',
        address:'',       
        state: '',
        city:'',   
        key: 0,  
        hasQrPayment: '',   
        CustomerName: '',
    }
  }, 
  
   methods: {


    async goodPaymentToast() {
      return this.$ionic.toastController      
        .create({
            header: this.gooPaymentHeader,
            message:  this.gooPaymentMss,
            duration: 2000,
            position: 'middle',
            color:'success'
            })
      .then(a => a.present())
    },

    async errorPaymentToast() {
      return this.$ionic.toastController      
        .create({
            header: this.errorPaymentHeader,
            message:  this.errorPaymentMss,
            duration: 2000,
            position: 'middle',
            color:'danger'
            })
      .then(a => a.present())
    },

    async errorPaymentDetail(msg) {
      return this.$ionic.toastController      
        .create({
            header:'Error',
            message:  msg,
            duration: 5000,
            position: 'middle',
            color:'danger'
            })
      .then(a => a.present())
    },

    getFormatPrice(price){
      let result = price
      if(this.currency !== '')
       result = new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(price);
      return result;
    },

    dismissModal(){
         return this.$ionic.modalController.dismiss()
    },

    getQrPayment: async function(){

      this.spinner1 = true;

      const data = {
          total: this.Total,
          tax: (parseFloat(this.order.Taxe) * parseFloat(this.order.SubTotal) )/ 100,
          tip: (parseFloat(this.order.Tip) * parseFloat(this.order.SubTotal) )/ 100,
          payMethod: this.payMethod,
          restaurantId: this.restaurantId,
      }

      data.saleFlag = 'S'
      if(this.isTicket) data.saleFlag = 'A'
     
     
     try {
       
        var response = await payAuthorizeNet.payQrOrder(data); 
        if(response !=='Error')  {
          this.hasQrPayment = response;
          this.spinner1 = false;  
        } 
        else{
           this.spinner1 = false;
           this.paymentError('Try another payment method.')
        }   
          
       
     } catch (error) {
      this.spinner1 = false;
       console.log(error)
       
     }
  },

  validateQrPayment: async function(){

    this.spinner1 = true;

    const data = {
        qrCode: this.hasQrPayment,
        payMethod: this.payMethod,
        restaurantId: this.restaurantId,
    }  
     try {  

      var response = await payAuthorizeNet.validateStatusQrOrder(data);
       let mss = 'Paid: '+ this.getFormatPrice(response.total);
       mss += ' TransId: ' + response.transId;        
      this.paymentSuccessfull(mss)     
      this.spinner1 = false; 
      response.returnTo = this.returnTo;
      if(!this.splitOrder) this.parent.recivePayment(response);
      else this.parent.makeSplitPayment(response)
      return this.dismissModal();

    } catch (error) {
      this.spinner1 = false;
      this.paymentError(error);
    }
  },

  cancelQrPayment: async function(){

    this.spinner1 = true;

    const data = {
        qrCode: this.hasQrPayment,
        payMethod: this.payMethod,
        restaurantId: this.restaurantId,
    }  
     try {  

      await payAuthorizeNet.cancelStatusQrOrder(data);   
      this.paymentSuccessfull('cancelado correctamente')     
      this.spinner1 = false;      
      return this.dismissModal();

    } catch (error) {
      this.spinner1 = false;
      this.paymentError(error);
    }
  },

  async paymentSuccessfull(message) {
    return this.$ionic.toastController
    
     
        .create({
          message: message,
          // duration: 2000,
          position: 'top',
          color:'success',
           buttons: [
            {
              text: 'Done',
              role: 'cancel',
              handler: () => {}
            }
          ]
        })
      .then(a => a.present())
  },

    async paymentError(message) {
    return this.$ionic.toastController
    
      .create({
        message: message,
        duration: 2000,
        position: 'top',
        color:'danger'
      })
    .then(a => a.present())
  },

  async sharePayment(){ 
    try {
        await Share.share({
        title: `Sharing ${this.order.CustomerName}'s payment at the ${this.RestaurantName} restaurant`,
        url: this.hasQrPayment,
        dialogTitle: 'Test'
      });
    } catch (error) {
       this.paymentError(error);   
    }
     
    },


      async htmlToUse(order){

        const partOfTotal = order.Total / this.Total
        const taxGeneral = (parseFloat(order.Taxe) * parseFloat(order.SubTotal) )/ 100;
        const tipGeneral =  (parseFloat(order.Tip) * parseFloat(order.SubTotal) )/ 100;
        const partialTip =  tipGeneral /  partOfTotal;
        const partialTax =  taxGeneral /  partOfTotal;

      let totalWithoutQuotation = 0;
      if(order.QuotationPayment)        
            totalWithoutQuotation = this.Total - order.QuotationPayment;
        else
            totalWithoutQuotation = this.Total;

       var date = moment.tz(order.Date, moment.tz.guess()).format('MM-DD-YYYY hh:mm A');
        if(order.OrderForCatering === true)
          date = moment.tz(order.DateToPick, moment.tz.guess()).format('MM-DD-YYYY') + ' ' +  moment.tz(order.HourToPick, moment.tz.guess()).format('hh:mm A') ;
       
         let qrList = document.getElementsByTagName('canvas')
         let dataUrl = qrList[0].toDataURL();

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
        html += `<h2>${this.RestaurantName}</h2>`;
        html += `<h4>Qr Payment</h4>`;
        html += `<img src="${dataUrl}" style="width: 100px;"></img>`;  
         html +=`</td>`;     
        html += `</tr>`;          
        html += '<tr><td colspan=6 >'       
        html += `<h4>Date: ${date} </h4><hr>`;
        html += `<h4>Customer: ${order.CustomerName} </h4>`;
        html += `<h4>Phone: ${order.CustomerPhone} </h4>`;   
       
        html += '<hr>';  
        html += '<br>'; 
        html += `<tr><br><td colspan=6 style="border-top: 1px solid black;"><h4 ><strong>Items</strong></h4></td></tr> <tr></tr>`;
        for(var i = 0; i<order.Products.length ; i++){
            html += `<tr ><td  colspan=4 style="width: 50%;border-bottom: 1px solid #dbd1d1;" ><strong >${order.Products[i].Name}</strong>` ;
            if(order.Products[i].Note !='')
                html +=`<p style="background: #f1f1004d;">${order.Products[i].Note}</p> `;
            html +=`</td><td style="width: 25%;border-bottom: 1px solid #dbd1d1;" > <p >( ${order.Products[i].Cant} X ${this.getFormatPrice(order.Products[i].Price)})</p> </td>`;
            html += `<td style="width: 25%;border-bottom: 1px solid #dbd1d1;"> <p >${ this.getFormatPrice( order.Products[i].Price * order.Products[i].Cant )}</p> </td>`;
            html += `</tr>`;
           if(order.Products[i].Aggregates.length > 0){
                html +=`<tr style="padding: 20px 35px;"> Free Sides: ${order.Products[i].CantAggr=order.Products[i].AggregatesCant * order.Products[i].Cant} </tr>`;

                 for(var a=0; a<order.Products[i].Aggregates.length; a++){
                    let agg = order.Products[i].Aggregates[a]
                    html += `<tr ><td  colspan=4 style="width: 50%;border-bottom: 1px solid #dbd1d1;" ><p style="padding-left: 20px;">${agg.Name} <br>${this.getFormatPrice(agg.SalePrice)}</p>` ;
                    html +=`</td><td style="width: 25%;border-bottom: 1px solid #dbd1d1;" > <p > ${agg.Cant}</p> </td>`;
                    html += `<td style="width: 25%;border-bottom: 1px solid #dbd1d1;"> <p > ${ this.getFormatPrice( agg.AllTotal ) }</p> </td></tr >`;            
                 }
            }
            
        }
       
        if(order.OtherCharges.length >0){
            html += `<tr ><td colspan=6 ><h4 ><strong>Other Charges</strong></h4></td></tr>`;
            for(var e = 0; e< order.OtherCharges.length ; e++){
                html += ` <tr ><td colspan=5 style="width: 75%;border-bottom: 1px solid #dbd1d1;"><p >${order.OtherCharges[e].Name}</p></td> <td style="border-bottom: 1px solid #dbd1d1;"> <p>${this.getFormatPrice(order.OtherCharges[e].Price)}</p></td></tr>`;
            }
        }
       
        
        html += `<tr ><td colspan=5 ><br><p ><strong>Subtotal</strong></p></td> <td ><br> <p >${this.getFormatPrice(order.SubTotal)}</p></td></tr>`;      
       html += `<tr><td  colspan=5 ><p  ><strong>Taxes ${order.Taxe}%</strong></p></td> <td > <p >${ this.getFormatPrice(partialTax) } </p> </td></tr>`;      
        if(order.OrderType == 'Delivery' && order.Shipping)
            html +=  `<tr ><td colspan=5  ><p  ><strong>Deliver</strong></p></td><td  ><p >${this.getFormatPrice(order.Shipping)}</p></td></tr>`;
        if(order.Tip)
            html += `<tr ><td  colspan=5 ><p ><strong>Tip ${order.Tip}%</strong></p></td><td ><p>${ this.getFormatPrice(partialTip) } </p> </td></tr>`;
        html += `<tr><td colspan=5 style="border-bottom: 1px solid #dbd1d1;"><p  ><strong>Total </strong></p></td> <td style="border-bottom: 1px solid #dbd1d1;"> <strong > ${this.getFormatPrice(this.Total)}</strong> </td></tr>`;
        
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
            html += `<tr ><td style="width: 20%;border-bottom: 1px solid grey;"><h4 >Notes</h4></td><td colspan=5 style="width: 80%;border-bottom: 1px solid grey;" ><p >${order.Note}</p></td></tr>`;
        html += '<tr><td colspan=6 style=" text-align: center;">';
        html += `<h2>${this.RestaurantName}</h2>  `;      
        if(this.restaurantWeb)  
            html += `<h4>${this.restaurantWeb}  </h4>`;   
        html +=`</td>`;     
        html += `</tr>`;       
        html += `</table></div></body></html>`;
        return html;
    },

   async printOrder(order){
        
        var html = await this.htmlToUse(order)
        
          var winimp = window.open('/print', 'popimpr');
          winimp.document.open();
          winimp.document.write( html );
          winimp.document.close();
          winimp.focus();
          winimp.print();
          winimp.close();

   },
      
}, 
  

}
</script>