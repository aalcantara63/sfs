<template>
  <div>
    <ion-header v-if="showButtons">

        <ion-toolbar>
            <ion-buttons slot="start" @click="dismiss()">
              <ion-back-button default-href="home"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{i18n.t('frontend.home.cardTitle')}} </h1>            
            </ion-label>
             
          </ion-toolbar>
    
    </ion-header>
    <div >
               
      <ion-list>
          <div v-for="(car, index) in cart" :key="car.Name" >

            <ion-item-sliding>
              
              <ion-item>

                  <div class="menu-col-4">                     
                      <p>{{car.Name}} <br> {{ getFormatPrice(parseFloat(car.Price)) }}</p>                     
                  </div>

                  <div class="menu-col-4">     
                      <ion-input inputmode="numeric"
                        :readonly="car.State === 1"
                        type="number" min=1 :value="car.Cant" 
                        @input="car.y=$event.target.value" 
                        @ionChange="addCant(index, car.y || car.Cant)"
                        :style="car.State === 0 ? 'text-align: center;width: 60%;float: left;    border: 1px solid #80808042;':'text-align: center;width: 60%;float: left;    border: 0;'" >
                      </ion-input>          
                  </div>

                  <div class="menu-col-4"> 
                      <p style="width: 70%; float: left;    margin-top: 10px;">{{ getFormatPrice(car.Price * car.Cant) }}</p> 
                      <div style="position: absolute; right: 0px; top: 30%;" v-if="car.State === 0">
                        <span class="iconify" data-icon="mdi:backburger" style="color: grey;margin:0;width: 20px; height: 20px;" data-inline="false"></span>
                      </div>
                      <span 
                          v-if="car.State === 1"
                        class="iconify" 
                        data-icon="openmoji:pot-of-food" 
                        data-inline="false" 
                        style="float: right; margin:0;     position: absolute;"
                        color="green" >
                      </span> 

                  </div>

                  

                 
                  
              </ion-item> 

              <ion-item-options side="end">
                <ion-item-option v-if="car.State === 0" color="light" @click="productDetail(car)">
                  <span class="iconify" data-icon="dashicons:edit" data-inline="false" ></span> 
                </ion-item-option> 
                <ion-item-option v-if="car.State === 0" color="light" @click="deleteToCart(index)">
                  <span class="iconify" data-icon="fe:trash" data-inline="false"></span>
                </ion-item-option>
               
              </ion-item-options>            

            </ion-item-sliding>
                
              
              <p v-if="car.Aggregates.length > 0" style="margin: 0;padding-left: 20px;font-size: 0.7em;text-align: left;">{{i18n.t('frontend.home.aggregateFree')}} {{car.CantAggr=car.AggregatesCant * car.Cant}} </p>

              <ion-item v-for="(agg, index1) in car.Aggregates" :key="index1"  style="padding-left:25px" >
                                          
                  <div class="menu-col-4" >
                    <p >{{agg.Name}} <br> {{getFormatPrice(agg.SalePrice)}}</p>  
                    </div>
            
                  <div class="menu-col-4">     
                      <ion-input type="number" min=1 :value="agg.Cant" @input="agg.Cant=$event.target.value" style="text-align: center;width: 60%;float: left;border: 1px solid #80808042;" >
                      </ion-input>  
                      <ion-icon name="refresh" color="blue" size="large" style="margin-top: 0px;width: 24px;" @click="agg.Cant=addAgregate(index, index1, agg.Cant)"> </ion-icon>   
                  </div>
                    
                <div class="menu-col-4" :key="key" >                        
                  <p v-if="car.CantAggr - agg.Cant >= 0" style="width: 70%; float: left;margin-top: 10px;">{{getFormatPrice(0) }}  <span style="opacity:0">{{car.CantAggr = car.CantAggr - agg.Cant}}</span></p> 
                  <p v-else style="width: 70%; float: left; margin-top: 10px;" > {{ getFormatPrice(agg.SalePrice * (agg.Cant-car.CantAggr)) }} <span style="opacity:0">{{car.CantAggr = 0}}</span></p> 
                  <ion-icon  size="large" color="danger" @click="deleteToAgg(index, index1)" name="trash" style="float: right; margin-top: 2px;width: 24px"> </ion-icon>                                               
                  
                </div>

              </ion-item>

          </div> 
           <div v-if="otherCharges.length > 0">
                <ion-label class="ion-text-wrap" >
                    <h2 class="titles-order" :style="otherCharges.length === 0 ? 'color: lightgrey;':'color: initial;'">{{i18n.t('frontend.order.otherCharges')}}
                    <ion-spinner style="padding-top:10px"  name="crescent" v-if="spinnerCharge" color="primary"></ion-spinner></h2> 
                </ion-label>
                                
              <ion-item-sliding v-for="charge in otherCharges" v-bind:key="charge.Id">
                  <ion-item>

                      <div class="menu-col-8">
                          <p>{{ charge.Name }}</p>
                      </div>
                      <ion-label  class="menu-col-4" >
                          <h2>{{ getFormatPrice(charge.Price) }}</h2>
                      </ion-label>
                      
                  </ion-item>
              </ion-item-sliding>

          </div>

            <ion-item > 
                <div class="menu-col-12" style="padding: 20px 0;font-weight: 600;"> 
                  <ion-label :key="key" style="text-align: right;">{{i18n.t('frontend.order.subtotal')}}:  {{ getFormatPrice(finalTotal()) }}</ion-label>                                           
              </div>
          </ion-item>
          <ion-item  v-if="discount === 0"> 
            <div class="menu-col-12" style="padding: 20px 0;text-align: right;">   
              <a style="margin-left: auto;    display: block;" @click="showDiscount=!showDiscount">{{i18n.t('frontend.reservation.discount')}}</a>          
                <ion-button v-if="showDiscount" :disabled="spinnerDiscount" color="light" @click="getDiscountByCode()">
                  <ion-input  placeholder="codigo de descuento" @input="theCodeToDiscount=$event.target.value">                      
                  </ion-input>
                  <span class="iconify" data-icon="websymbol:ok" data-inline="false" style="color: green;width: 15px;"></span>
                </ion-button>                                 
            </div>
          </ion-item>  
           <ion-item v-if="discount > 0"> 
                <div class="menu-col-12" style="padding: 20px 0;font-weight: 600;text-align: right;"> 
                  <ion-label class="menu-col-12" :key="key" style="text-align: right;display: contents;">{{i18n.t('frontend.reservation.discount')}}: {{ getFormatPrice(discount ) }}</ion-label>                                           
              </div>
          </ion-item>
          <ion-item > 
                <div class="menu-col-12" style="padding: 20px 0;font-weight: 600;"> 
                  <ion-label :key="key" style="text-align: right;">{{i18n.t('frontend.order.taxe')}} ({{taxes.toFixed(2)}} %):  {{ getFormatPrice(taxes * finalSubTotal() / 100) }}</ion-label>                                           
              </div>
          </ion-item>
          <ion-item v-if="order.OrderType=='Delivery'" > 
                <div class="menu-col-12" style="padding: 20px 0;font-weight: 600;"> 
                  <ion-label :key="key" style="text-align: right;">{{i18n.t('frontend.order.deliver')}}:  {{getFormatPrice(shipping)}} </ion-label>                                           
              </div>
          </ion-item>
          <ion-item >
            <div  class="menu-col-12" style="padding: 20px 0;font-weight: 600;" :key="keyTip">
              
               <ion-input  class="menu-col-2" style="float: right; text-align: right;"
                :disabled="configuration.tipRequire"
                :value="getFormatPrice(tip * finalSubTotal() / 100)" 
                @change="changeTip($event.target.value)">
              </ion-input> 
              <ion-label class="menu-col-2" style="float: right;padding: 10px 0;" v-if="keyTip !==0">{{tip}} %</ion-label>
              <ion-select interface="popover" icon="add" class="menu-col-8" style="float: right;padding: 10px 5px;text-align: right;"                                         
                v-if="configuration.tips.length > 0"
                :ok-text="i18n.t('backoffice.form.messages.buttons.ok')"
                :cancel-text="i18n.t('backoffice.form.messages.buttons.dismiss')"
                :value="tip"
                :disabled="configuration.tipRequire"
                :placeholder="i18n.t('frontend.order.tip')"                        
                @ionChange="$event.target.value? tip = $event.target.value: tip=0,keyTip=0" >
                <ion-select-option v-for="res in configuration.tips"                    
                    :key="res" 
                    :value="res" >{{i18n.t('frontend.order.tip')}} {{res.toFixed(2)}} %                         
                </ion-select-option>                                   
              </ion-select>    
            </div>  
          </ion-item>   
         
           <ion-item  > 
                <div class="menu-col-12" style="padding: 20px 0;font-weight: 600;"> 
                  <ion-label :key="key" style="text-align: right;">{{i18n.t('frontend.order.total')}}:  {{getFormatPrice(finalTotal1())}} </ion-label>                                           
              </div>
          </ion-item>  
                    
      </ion-list> 

      <div style="text-align: right;">        
         <ion-button @click="showNote=!showNote" v-tooltip="i18n.t('frontend.order.notes')"> 
          <span class="iconify" data-icon="akar-icons:comment-add" data-inline="false" ></span>  
        </ion-button> 
         <ion-textarea v-if="showNote" class="menu-textarea" @ionChange="changeOrderNote($event.target.value)" style="text-align: left;"></ion-textarea>
      </div> 

      

          
      <ion-item v-if="showButtons">
        <ion-button color="primary" class="menu-col-6" size="normal" @click="dismiss">{{i18n.t('frontend.home.cancel')}}</ion-button>
        <ion-button color="primary" :disabled="cart.length ===0 " class="menu-col-6" size="normal" @click="checkOut">{{i18n.t('frontend.home.checkout')}}</ion-button>
      </ion-item>  
       
    </div>
  </div>
</template>

<script>

import { EventBus } from '../event-bus';
import store from '../../main'
import {i18n} from '@/plugins/i18n'
import { Commons } from '../commons'
import ProductDetail from '../components/ProductDetail'
import { Api } from '../../backoffice/api/api';



export default {
  name: 'ProductDetail',
  props: {      
    currency:  { type: String, default: '' },
    showButtons: { type: Boolean, default: true },  
    products: {type: Array, default:() => [] },  
    variants: {type: Array, default:() => [] },  
    taxes: {type: Number, default:0 } ,
    shipping:  {type: Number, default:0 } ,
  },
  created: async function(){ 
    
    this.i18n = i18n; 
    this.message = this.i18n.t('frontend.product.massageToast') ;

    console.log(this.message)
    
    this.cart = store.state.cart
    this.order = store.state.order;
    this.configuration = store.state.configuration;
    if(this.configuration.tips.length > 0)
        this.tip = this.configuration.tips[0] 
    if(this.order.Discount)
        this.discount = this.order.Discount

    await this.loadOtherCharges();
      
  },
  computed: {
    Total(){
          let total = 0;      
          this.cart.forEach(car => total += parseFloat( this.getTotal(parseInt(car.AggregatesCant),  parseInt(car.Cant), parseFloat(car.Price), car.Aggregates) ))
          
          return total;
      },

  
  },
  data() {
    return {
      content: 'Content',
      staticUrl:"https://imenuapps.net/?share=",
      thisCant:1,
      thisNote: this.Note,
      thisPrice: this.SalePrice,
      thisName: '',
      key:1,
      keyTip: 0,
      cart: [],
      order: {},
      otherCharges: [],
      spinnerCharge: false,
      i18n: {},
      message: '',
      showNote: false,
      tip:  0,
      discount: 0,
      configuration: {},
      theCodeToDiscount: '',
      showDiscount: false,
      spinnerDiscount: false,
    }
  },
   components:{
     
  },
 
methods: {

    dismiss(){
       return this.$ionic.modalController.dismiss()
    },

    async addCant(index, Cant){
        if(Cant < 1)
         return this.deleteToCart(index);

        this.cart[index].Cant= Cant;       
        this.openToast(); 
        await this.loadOtherCharges();
        store.commit('setCart', this.cart);
        EventBus.$emit('updateCart', true); 
       
    },
   
   async deleteToCart(index){
      if(index != -1){
        this.cart[index].Aggregates = []
          this.cart.splice(index,1)  
          this.openToast();  
          await this.loadOtherCharges(); 
           store.commit('setCart', this.cart); 
           EventBus.$emit('updateCart', true);
          if(this.cart.length ===0)
            this.dismiss(); 
      }

    },

    deleteToAgg(index, index1){
        let obj = this.cart[index];
        obj.Aggregates.splice(index1, 1);       
        this.openToast();         
         store.commit('setCart', this.cart);
         EventBus.$emit('updateCart', true);

    },

    addAgregate(index, index1, cant){
        if(cant < 1)
          return this.deleteToAgg(index, index1)
        else{       
          this.cart[index].Aggregates[index1].Cant = parseInt(cant);       
          this.finalTotal();
          this.openToast();           
          store.commit('setCart', this.cart); 
          EventBus.$emit('updateCart', true);        
        } 
        this.key++;
        return cant;
    },

    finalTotal(){
      let total = 0;          
      this.cart.forEach(car => total += parseFloat( this.getTotal(parseInt(car.AggregatesCant),  parseInt(car.Cant), parseFloat(car.Price), car.Aggregates) ))     
      for (const obj of this.otherCharges){
              total += obj.Price ;
          }
      return total;
          },

    getTotal( aggregateCant, thisCant, thisPrice, thisAggregates) {
     
      let cant = aggregateCant * thisCant;
      let semiTotal = 0; 
      let t = 0;    
      for(var i=0 ; i < thisAggregates.length; i++){  
       
        if(cant - thisAggregates[i].Cant >= 0){
          cant -= thisAggregates[i].Cant; 
          continue;
        }
        else{
         semiTotal+= ((thisAggregates[i].Cant -cant) * thisAggregates[i].SalePrice); 
         cant = 0;       
        }
      } 

      t= (thisCant * thisPrice + semiTotal).toFixed(2) ;
      return t;
    },
  
    async openToast() {
      
      return this.$ionic.toastController      
        .create({
          message: this.message,
          duration: 2000,
          position: 'top',
          color:'success'
        })
      .then(a => a.present())
    },

   async openToastError(mss) {
      
      return this.$ionic.toastController      
        .create({
          message: mss,
          duration: 2000,
          position: 'top',
          color:'danger'
        })
      .then(a => a.present())
    },

    checkOut(){
        if(this.cart.length > 0) 
            EventBus.$emit('showOrder', true ); 
        this.dismiss();
                    
    },

    getFormatPrice(price){
      const result = new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(price)
      return result;
    },

     async loadOtherCharges(){
       console.log('in loadOtherCharges')
       this.spinnerCharge = true;
       this.otherCharges = await Commons.getOtherCharges();
       this.spinnerCharge = false;
    },

    productDetail: function(pr){

      console.log('Variants in productDetail');
      console.log(JSON.parse(JSON.stringify(this.variants)));
      var productVariant=[]
      var Description='';
      const indexInitial = this.products.findIndex( x => x._id === pr.ProductId)
      if(indexInitial !==-1){
        const prX = this.products[indexInitial];
        if(prX.VariantGroupId !=''){
          productVariant = this.variants.filter(v => v._id == prX.VariantGroupId)
          Description = prX.Description
        } 
      }
         
      return this.$ionic.modalController
      .create({
        component: ProductDetail,
        cssClass: 'my-custom-class',
        componentProps: {
          data: {
            content: 'New Content',
          },
          propsData: {
            productId: pr.ProductId,
            Name: pr.Name,
            SalePrice: parseFloat(pr.Price),
            Description: Description,
            ImageUrl: pr.ImageUrl,
            ProductCant: parseInt(pr.Cant) || 1,
            Note: pr.Note,
            productVariant: productVariant,
            aggregateCant: pr.AggregateCant || 0,
            Aggregates: pr.Aggregates || [],
            products: this.products,           
            Ingredients: pr.Ingredients || [],           
            orderFromCatering: pr.fromCatering,
            isService: pr.isService,           
            currency: this.currency,
            forEdit: true,
          },
        },
      })
      .then(m => m.present())
      },

    finalTotal1(){
         let percent = ( (this.finalSubTotal() * this.taxes) / 100) ;
         let tipPercent = ( (this.finalSubTotal() * this.tip) / 100) ; 
         console.log(percent)
         console.log(tipPercent)
         var t = 1    
        if(this.order.OrderType=='Delivery')  
          t  = parseFloat(this.finalSubTotal()) + parseFloat(percent) + parseFloat(this.shipping) + parseFloat(tipPercent); 
        else
          t  = parseFloat(this.finalSubTotal()) + parseFloat(percent)  +  parseFloat(tipPercent);
          t = t - this.discount;
        return t.toFixed(2);
      } ,  

    finalSubTotal(){
        let total = 0;
        this.cart.forEach(car => total += parseFloat( this.getSemiTotal(parseInt(car.AggregatesCant),  parseInt(car.Cant), parseFloat(car.Price), car.Aggregates) ))
        for (const obj of this.otherCharges){
            total += obj.Price ;
        }
        // total = total - this.discount;
        return total.toFixed(2);
      },

    getSemiTotal( aggregateCant, thisCant, thisPrice, thisAggregates) {
     
      let cant = aggregateCant * thisCant;
      let semiTotal = 0; 
      let t = 0;    
      for(var i=0 ; i < thisAggregates.length; i++){  
       
        if(cant - thisAggregates[i].Cant >= 0){
          cant -= thisAggregates[i].Cant;   
          thisAggregates[i].AllTotal = 0         
          continue;
        }
        else{
            thisAggregates[i].AllTotal =  ((thisAggregates[i].Cant -cant) * thisAggregates[i].SalePrice)
            semiTotal+= ((thisAggregates[i].Cant -cant) * thisAggregates[i].SalePrice); 
            cant = 0;       
        }
      } 

      t= (thisCant * thisPrice + semiTotal).toFixed(2) ;
      
      return t;
    },

    changeOrderNote(note){
      this.order.Note = note;
      store.commit("setOrder", this.order);
    },

    changeTip(value){
      this.tip = (value *100 / this.finalSubTotal()).toFixed(2);
      this.order.Tip = this.tip;
      store.commit("setOrder", this.order);
      this.keyTip = -1;
    },

 
    async getDiscountByCode(){
      console.log('getDiscountByCode: '+ this.theCodeToDiscount);
      if(this.theCodeToDiscount != ''){
        this.spinnerDiscount = true;

        try {
           const response = await Api.getReservationByCode(this.theCodeToDiscount)
         if(response.status === 200 ){
            if(response.data.State === 6){
              this.discount = 0;
              this.spinnerDiscount = false;
              const mss =  this.i18n.t('frontend.reservation.orderCloseToDiscount');
              return this.openToastError(mss);
            }
            if(response.data.QuotationPayment > this.finalSubTotal() ){
                this.discount = 0;
                 this.spinnerDiscount = false;
                const mss =  this.i18n.t('frontend.reservation.subtotalNotForDiscount');
                return this.openToastError(mss);
            } 
             if(response.data.QuotationPayment && response.data.State === 4){
                this.spinnerDiscount = false;
                this.discount = response.data.QuotationPayment;
                this.order.Discount = this.discount; 
                store.commit("setOrder", this.order);
                return;
             }                 
            else{
                this.theCodeToDiscount = '';
                this.showDiscount = false;  
                 this.spinnerDiscount = false;
                const mss =  this.i18n.t('frontend.reservation.notDiscountToApply');
                return this.openToastError(mss);                  
            }  
          }
        } catch (error) {
          console.log(error)
          this.theCodeToDiscount = '';
           this.showDiscount = false;  
          this.spinnerDiscount = false;
          const mss =  this.i18n.t('frontend.reservation.notDiscountToApply');
          return this.openToastError(mss); 
        }

      } 
    }
}
 

}
</script>

<style>
.ion-page {
    overflow: overlay !important;
  
}
.select-placeholder {
    opacity: 0.83;
}
</style>