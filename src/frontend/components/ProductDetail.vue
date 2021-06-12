<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-row>
          <ion-col size="10" style="border: 0px !important;">
            <ion-title>{{ i18n.t('frontend.product.productDetail') }}</ion-title>
          </ion-col>
          <ion-col size="2" style="border: 0px !important;">
            <ion-button @click="dismissQr" >
              <ion-icon slot="icon-only"  name="close"></ion-icon>
            </ion-button>
          </ion-col>
        </ion-row>
         
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding"> 

        <ion-card  >
          <ion-card-header>
              <h1 style="padding: 0;">{{Name}} {{thisName}}  </h1>
          </ion-card-header>

          <ion-row>

            <v-breakpoint>
              <div slot-scope="scope" style="width: 100%;">
               

                  <div :class="scope.isSmall || scope.noMatch ?'menu-col-12 ' : 'menu-col-6 ' " style="border: 0px !important; float:left">
                    <ion-list v-if="ImageUrl">                        
                      <div>
                        <img class="menu-col-12" :src="ImageUrl">                 
                      </div> 
                    </ion-list>

                    <ion-list>
                      <ion-item>
                          <ion-label class="menu-col-12"   color="danger" style="font-size: 14pt;font-weight: bold;text-align: center;">{{ getFormatPrice(thisPrice) }}
                          <span style="color: #f82525;" v-if="isService">( {{i18n.t('frontend.home.priceEstimated')}} )</span>
 
                            </ion-label>                   
                      </ion-item>                    
                        <ion-textarea v-if="!Description===''" style="padding: 0;" readonly>{{Description}}</ion-textarea>                    
                    </ion-list>

                  </div>

                  <div :class="scope.isSmall || scope.noMatch ?'menu-col-12 ' : 'menu-col-6 ' " style="border: 0px !important; float:left">

                    <div  v-if="productVariant.length > 0">
                      <ion-list  v-for="vari in productVariant" :key="vari._id"  style="padding: 0;border: 1px solid;"  >
                          <ion-title style="background: #d6cbcb;padding: 5px;">{{ i18n.t('frontend.home.variants') }}</ion-title>
                          <ion-radio-group :value="variantSelected.variant" @ionChange="changeVariant(vari._id, $event.target.value)">
                            <ion-item v-for="variant in vari.Variants" :key="variant._id"> 
                              <ion-avatar>
                                <img :src="variant.ImageUrl">
                                
                              </ion-avatar> 
                              <ion-label>{{ variant.Name }}</ion-label>                          
                              <ion-label>( {{ getFormatPrice(variant.SalePrice) }} ) </ion-label>                          
                              <ion-radio  :value="variant._id"></ion-radio>                      
                            </ion-item> 
                          </ion-radio-group>  
                      </ion-list>
                    </div>

                    <div  v-if="getSide(productId).Aggregates.length > 0">
                      <ion-list style="padding: 0;border: 1px solid;"  >
                          <p style="background: #d6cbcb;padding: 5px;">{{i18n.t('frontend.home.sides')}} ( {{aggregateCant}} {{i18n.t('frontend.home.aggregateFree')}} ) </p>
                          
                          <ion-item v-for="(aggre,index) in getSide(productId).Aggregates" :key="index" >
                            <ion-avatar><img :src="getSide(aggre).ImageUrl"></ion-avatar>
                            <p>{{ getSide(aggre).Name }} - {{ getFormatPrice(getSide(aggre).SalePrice) }} </p> <span style="opacity:0">{{getSide(aggre).c = 1}}</span>
                            <ion-input slot="end" 
                              type="number" 
                              :value="getAggCant(aggre)" 
                              @input="$event.target.value > 0 ? getSide(aggre).c =$event.target.value : getSide(aggre).c = 1" 
                              @ionChange="$event.target.value > 0 ? addSideCant(aggre, $event.target.value) : getSide(aggre).c = 1"
                              style="margin: 0;max-width: 50px; float: right;border: 1px solid #80808075;text-align: center;">
                            </ion-input>
                            <ion-checkbox  
                              @ionChange="addSide($event.target.checked, aggre, getSide(aggre).c)" 
                              :checked="getAggChecked(aggre)"
                              slot="end" 
                              style="margin: 5px;">
                            </ion-checkbox>
                          </ion-item>
                      </ion-list>
                    </div>

                     <div  v-if="Ingredients.length > 0">
                      <ion-list style="padding: 0;border: 1px solid;"  >
                          <ion-title style="background: #d6cbcb;padding: 5px;">{{i18n.t('frontend.home.choises')}}</ion-title>
                          <ion-item v-for="(ing,index) in Ingredients" :key="index" >                           
                            <p>{{ing.name}}</p>
                            <ion-toggle  slot="end"  
                             @ionChange="getIngredients($event.target.checked, index)" 
                             :checked="ing.selected === 1? true : false"> 
                            </ion-toggle>{{ing.selected}}

                          </ion-item>
                      </ion-list>
                    </div>

                    <ion-list  style="padding: 0;border: 1px solid;" >
                        <ion-title style="background: #d6cbcb;padding: 5px;">{{i18n.t('frontend.order.notes')}}</ion-title>
                        <ion-textarea  :value="thisNote " @input="thisNote = $event.target.value"
                      >{{getIngredientNote()}}</ion-textarea>   
                    </ion-list>
                  
                      <ion-list style="padding: 0;border-bottom: 1px solid;border-left: 1px solid;border-right: 1px solid;">
                        <ion-title style="background: #d6cbcb;padding: 5px;"> {{ getFormatPrice(getTotal) }}</ion-title>
                        <ion-input  type="number" min=1 :value="thisCant" @input="thisCant = $event.target.value" style="text-align: center;max-width: 50%; float:left" ></ion-input>              
                        <ion-button v-if="forEdit" color="primary" size="normal" style="float:right" @click="linkToCart()"> {{i18n.t('frontend.order.edit')}} </ion-button>
                        <ion-button  v-else color="primary" size="normal" style="float:right" @click="linkToCart()"> {{i18n.t('frontend.order.add')}} </ion-button>
                        
                      </ion-list>
                                                    
                    </div>

               
                  </div>
            </v-breakpoint>

           
          </ion-row>         

          

          

          
        
        
        </ion-card>

       
    </ion-content>
  </div>
</template>

<script>

import { EventBus } from '../event-bus';
import { VBreakpoint } from 'vue-breakpoint-component'
import {i18n} from '@/plugins/i18n'
import store from '../../main'

export default {
  name: 'ProductDetail',
  props: {
    productId: { type: String, default: '' },
    ImageUrl: { type: String, default: '' },
    Name: { type: String, default: '' },
    Description: { type: String, default: '' },
    ProductCant: { type: Number, default: 1 },
    Note: { type: String, default: '' },   
    SalePrice: { type: Number, default: 0 },
    productVariant:  {type: Array, default:() => []},
    products:  {type: Array, default:() => []},    
    aggregateCant: { type: Number, default: 0 },
    Aggregates:  {type: Array, default:() => []},
    Ingredients:  {type: Array, default:() => []},
    orderFromCatering: { type: Boolean, default: false },
    isService:{ type: Boolean, default: false },   
    currency:  { type: String, default: '' },
    forEdit: { type: Boolean, default: false },
    indexForEdit: { type: Number, default: -1 },
    VariantSelected: {type: Object, default:() => {} },
  },
  created: function(){

    this.i18n = i18n; 

    this.cart = store.state.cart;

   if(this.productVariant.length > 0){      
     if(this.VariantSelected)
        this.variantSelected = this.VariantSelected;
     else {
      this.variantSelected = {
        name: this.productVariant[0].Variants[0].Name,
        variant: this.productVariant[0].Variants[0]._id,
        }
     }
     this.thisPrice = this.productVariant[0].Variants[0].SalePrice;
     this.thisName =  this.variantSelected.name;
   }
   else{
     this.thisPrice = this.SalePrice;
     this.thisName = '';
   }

    
  },
  data() {
    return {
      content: 'Content',
      result: '',
      error: ''  ,
      staticUrl:"https://imenuapps.net/?share=",
      thisCant: this.ProductCant,
      thisNote: this.Note,
      thisPrice: this.SalePrice,
      thisName: '',
      variantSelected: {},
      thisIngredients:[],
      cart: [],
      i18n: {},
      
    }
  },
   components:{
     VBreakpoint: VBreakpoint,    
  },
  computed:{
    getTotal() {
     
      let cant = this.aggregateCant * this.thisCant;
      let semiTotal = 0;     
      for(var i=0 ; i < this.Aggregates.length; i++){  
       
        if(cant - this.Aggregates[i].Cant >= 0){
          cant -= this.Aggregates[i].Cant; 
          continue;
        }
        else{
         semiTotal+= ((this.Aggregates[i].Cant -cant) * this.Aggregates[i].SalePrice);   
         cant = 0 ;
        }
      } 

      let t= (this.thisCant * this.thisPrice + semiTotal).toFixed(2) ;
      return t;
    }
   
  },
 
methods: {

    dismissQr(){
       return this.$ionic.modalController.dismiss()
    },

    changeVariant(varId, variant){
      let option = this.productVariant.filter(v => v._id == varId);
      if(option.length > 0){
      let v =  option[0].Variants.filter(r => r._id == variant)
      this.thisPrice = v[0].SalePrice;
      this.thisName = v[0].Name;
      this.variantSelected = {name: v[0].Name, variant: variant};
      
      }

    },

    alertMissingProduct(){
      let mssg = ''
      if(this.orderFromCatering)
        mssg = this.i18n.t('frontend.order.warningProductsTheCateringToOrder');
      else
        mssg = this.i18n.t('frontend.order.warningProductsTheOrderToCatering');

        
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Warning',
          message: mssg,
          buttons: [                   
          {
            text: this.i18n.t('frontend.home.cancel'),
            handler: () => {   
              this.dismissQr(); 
            },
          },
            {
            text: this.i18n.t('frontend.home.acept'),
            handler: () => {      
               this.cart = [];
               delete this.order.OrderType 
               store.commit('setCart', this.cart); 
               store.commit('setOrder', this.order); 
               EventBus.$emit('updateCart', true); 
              this.addProduct();
            }
            },       
          ],
      })
      .then(a => a.present())                  
    },

    linkToCart: function(){

      if(this.cart.length > 0){       
        if( this.cart[0].fromCatering !== this.orderFromCatering )
          return this.alertMissingProduct();
        else 
         return this.addProduct();       
      }
      else
       return this.addProduct();
    },


    addProduct: function(){

       if(this.thisCant <1)
          return this.cantNoValida();

         let p = {
           "ImageUrl": this.ImageUrl,
            "ProductId": this.productId,
            "Name": this.Name,
            "Price": this.thisPrice,
            "Cant": parseInt(this.thisCant),
            "Note": this.thisNote,
            "AggregatesCant": this.aggregateCant || 0,
            "Aggregates": this.Aggregates,
            "isService": this.isService,
            "fromCatering": this.orderFromCatering,
            "VariantSelected": this.variantSelected,
            "Ingredients": this.Ingredients,
            "State": 0,
         }        
         if(this.forEdit && this.indexForEdit !== -1){
            this.cart[this.indexForEdit] = p                     
         }
         else{
          const index = this.cart.findIndex(pr => pr.ProductId === this.productId && pr.Price === this.thisPrice && pr.State === 0);      
          if (index !== -1) {          
            this.cart[index].Cant = parseInt(this.cart[index].Cant) + parseInt(this.thisCant);          
            this.cart[index].Note += this.thisNote;  
            this.cart[index].VariantSelected =  this.variantSelected;                   
            this.cart[index].Ingredients =  this.Ingredients;                   
            this.cart[index].Aggregates =  this.Aggregates;                   
          }
          else{
            this.cart.push(p);
          } 
         }
                 
          store.commit('setCart', this.cart); 
          EventBus.$emit('updateCart', true); 
          this.openToast();
          this.dismissQr();

      // return this.dismissQr();

    },

    getSide(id){
      let producto = this.products.filter(p => p._id == id)
      if(producto.length > 0)
        return producto[0];
      else
        return ''  
    },

    getAggCant(aggre){
     
      let list = this.Aggregates.filter(p => p._id == aggre )
      if(list.length > 0){      
        return list[0].Cant;
      }
      return 1;
    },

    getAggChecked(aggre){
      let list = this.Aggregates.filter(p => p._id == aggre )     
      if(list.length > 0){      
        return true
      }
      return false;
    },

    cantNoValida(){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.i18n.t('frontend.home.cantNotValid'),
          buttons: [                   
          {
              text: this.i18n.t('frontend.home.acept'),
              handler: () => {                                 
                            
              },
          },
          ],
      })
      .then(a => a.present())
                  
    },

      addSideCant( id, cant){
      
       let index = this.Aggregates.findIndex(a => a._id === id)
       if(index !== -1 && cant > 0){
          this.Aggregates[index].Cant = parseInt(cant);
       }

        if(index !== -1 && cant <= 0){
          this.Aggregates.splice(index, 1)
       }
    },

 
    addSide(event, id, cant){
  
      if(!event || cant === 0){       
         let index = this.Aggregates.findIndex(a => a._id === id)
          return this.Aggregates.splice(index, 1)
      }
    
      const index1 = this.cart.findIndex(pr => pr.ProductId === this.productId && pr.Price === this.thisPrice );
      
      let index2
      if(index1 !== -1)
        index2 = this.cart[index1].Aggregates.findIndex(a => a._id === id)
         
      if(index1 !== -1 && index2 !== -1){
        this.cart[index1].Aggregates[index2].Cant = parseInt(this.cart[index1].Aggregates[index2].Cant) + parseInt(cant)
        return this.openToast()
      }

      let producto = this.products.filter(p => p._id == id)
      if(producto.length > 0 && cant > 0){
        producto[0].Cant = parseInt(cant);
        this.Aggregates.push(producto[0]);
      } 
    },

    getIngredients(flag, index){
      if(flag){
        this.Ingredients[index].selected = 1;          
      }
      else{
         this.Ingredients[index].selected = 0;         
      }       
    },

    getIngredientNote(){
      let str =this.i18n.t('frontend.home.withoutIngredients') + ': '
      let count = 0

      this.Ingredients.forEach( e => 
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
    
    alertSelectOrderTypeCatering(){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: '',
          message: this.i18n.t('frontend.home.selectOrderType'),
          inputs:[
            {type: 'radio', label: 'Catering', value: 'delivery', },
            {type: 'radio', label: this.i18n.t('frontend.app.pickup'), value: 'pick', },           
          ],
          buttons: [                   
          {
            text: this.i18n.t('frontend.home.cancel'),
            handler: () => {   
              this.dismissQr(); 
            },
          },
            {
            text: this.i18n.t('frontend.home.acept'),
            handler: (value) => {      
              this.chooseOrderType(value)   
            }
            },       
          ],
      })
      .then(a => a.present())                  
    },

    alertSelectOrderType(){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: '',
          message: this.i18n.t('frontend.home.selectOrderType'),
          inputs:[
            {type: 'radio', label: this.i18n.t('frontend.app.deliver'), value: 'delivery', },
            {type: 'radio', label: this.i18n.t('frontend.app.pickup'), value: 'pick', },
            {type: 'radio', label: this.i18n.t('frontend.app.table'), value: 'table', },        
          ],
          buttons: [                   
          {
            text: this.i18n.t('frontend.home.cancel'),
            handler: () => {   
              this.dismissQr(); 
            },
          },
            {
            text: this.i18n.t('frontend.home.acept'),
            handler: (value) => {      
              this.chooseOrderType(value)   
            }
            },       
          ],
      })
      .then(a => a.present())                  
    },

    async openToast() {
      return this.$ionic.toastController      
        .create({
          message: this.i18n.t('frontend.product.massageToast'),
          duration: 2000,
          position: 'top',
          color:'success'
        })
      .then(a => a.present())
    },

    show () {
      this.$modal.show('my-second-modal');
    },
    
    hide () {
      this.$modal.hide('my-second-modal');
    },

    chooseOrderType(value){
      if(value ==='delivery')
        EventBus.$emit('openDeliveryModal1');

      if(value ==='pick')
        EventBus.$emit('openPickUpModal1');

      if(value ==='table'){
        EventBus.$emit('openTableModal1');
        this.dismissQr();
      }   
    },

    getFormatPrice(price){
      const result = new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(price)
      return result;
    }

  

}
 

}
</script>

<style >

</style>