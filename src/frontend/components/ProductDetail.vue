<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-row>
          <ion-col size="10" style="border: 0px !important;">
            <!-- <ion-title>{{ title }}</ion-title> -->
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
                          <span style="color: #f82525;" v-if="isService">( {{estimatedMessage}} )</span>
 
                            </ion-label>                   
                      </ion-item>                    
                        <ion-textarea v-if="!Description===''" style="padding: 0;" readonly>{{Description}}</ion-textarea>                    
                    </ion-list>

                  </div>

                  <div :class="scope.isSmall || scope.noMatch ?'menu-col-12 ' : 'menu-col-6 ' " style="border: 0px !important; float:left">

                    <div  v-if="productVariant.length > 0">
                      <ion-list  v-for="vari in productVariant" :key="vari._id"  style="padding: 0;border: 1px solid;"  >
                          <ion-title style="background: #d6cbcb;padding: 5px;">{{ variantsText }}</ion-title>
                          <ion-radio-group :value="productVariant[0].Variants[0]._id" @ionChange="changeVariant(vari._id, $event.target.value)">
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

                    <div  v-if="Aggregates.length > 0">
                      <ion-list style="padding: 0;border: 1px solid;"  >
                          <p style="background: #d6cbcb;padding: 5px;">{{sides}} ( {{aggregateCant}} {{aggregateFree}} ) </p>
                          
                          <ion-item v-for="(aggre,index) in Aggregates" :key="index" >
                            <ion-avatar><img :src="getSide(aggre).ImageUrl"></ion-avatar>
                            <p>{{ getSide(aggre).Name }} - {{ getFormatPrice(getSide(aggre).SalePrice) }} </p> <span style="opacity:0">{{getSide(aggre).c = 1}}</span>
                            <ion-input slot="end" type="number" value="1" @input="getSide(aggre).c =$event.target.value" style="margin: 0;max-width: 50px; float: right;border: 1px solid #80808075;text-align: center;"></ion-input>
                            <ion-checkbox  @ionChange="addSide($event.target.checked, aggre, getSide(aggre).c)" slot="end" style="margin: 5px;"></ion-checkbox>
                          </ion-item>
                      </ion-list>
                    </div>

                     <div  v-if="Ingredients.length > 0">
                      <ion-list style="padding: 0;border: 1px solid;"  >
                          <ion-title style="background: #d6cbcb;padding: 5px;">{{ingredientText}}</ion-title>
                          <ion-item v-for="(ing,index) in Ingredients" :key="index" >                           
                            <p>{{ing}}</p>
                            <ion-toggle checked slot="end"  
                             @ionChange="getIngredients($event.target.checked, $event.target.value)"                          
                              :value="ing">
                            </ion-toggle>

                          </ion-item>
                      </ion-list>
                    </div>

                    <ion-list  style="padding: 0;border: 1px solid;" >
                        <ion-title style="background: #d6cbcb;padding: 5px;">{{noteMss}}</ion-title>
                        <ion-textarea  :value="thisNote" @input="thisNote = $event.target.value"
                      ></ion-textarea>   
                    </ion-list>
                  
                      <ion-list style="padding: 0;border-bottom: 1px solid;border-left: 1px solid;border-right: 1px solid;">
                        <ion-title style="background: #d6cbcb;padding: 5px;"> {{ getFormatPrice(getTotal) }}</ion-title>
                        <ion-input  type="number" min=1 :value="thisCant" @input="thisCant = $event.target.value" style="text-align: center;max-width: 50%; float:left" ></ion-input>              
                        <ion-button  color="primary" size="normal" style="float:right" @click="linkToCart()"> {{addMss}} </ion-button>
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

export default {
  name: 'ProductDetail',
  props: {
    parent:  {type: Object, default:() => {}}, 
    title: { type: String, default: '' },
    productId: { type: String, default: '' },
    ImageUrl: { type: String, default: '' },
    Name: { type: String, default: '' },
    Description: { type: String, default: '' },
    ProductCant: { type: Number, default: 1 },
    Note: { type: String, default: '' },
    CantNoValid: { type: String, default: '' },   
    Acept: { type: String, default: '' },        
    Cancel: { type: String, default: '' }, 
    mssOrderType: { type: String, default: '' },  
    aggregateFree: { type: String, default: '' },
    sides: { type: String, default: '' },
    ingredientText:  { type: String, default: '' },
    variantsText:  { type: String, default: '' },
    withoutIng: { type: String, default: '' },
    message: { type: String, default: '' },      
    noteMss: { type: String, default: '' },
    addMss: { type: String, default: '' },
    SalePrice: { type: Number, default: 0 },
    productVariant:  {type: Array, default:() => []},
    products:  {type: Array, default:() => []},    
    aggregateCant: { type: Number, default: 0 },
    Aggregates:  {type: Array, default:() => []},
    Ingredients:  {type: Array, default:() => []},    
    Delivery: { type: String, default: '' },
    PickUp: { type: String, default: '' },
    Table: { type: String, default: '' },
    orderFromCatering: { type: Boolean, default: false },
    isService:{ type: Boolean, default: false },
    estimatedMessage: { type: String, default: '' },
    mssgToOrder:  { type: String, default: '' },
    mssgToCatering:  { type: String, default: '' },
    currency:  { type: String, default: '' },
  },
  created: function(){

  this.cart = this.parent.$store.state.cart;

   if(this.productVariant.length > 0){
     this.thisPrice = this.productVariant[0].Variants[0].SalePrice;
    this.thisName = this.productVariant[0].Variants[0].Name; 
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
      thisAggregates: [],
      thisIngredients:[],
      cart: [],
      
    }
  },
   components:{
     VBreakpoint: VBreakpoint,    
  },
  computed:{
    getTotal() {
     
      let cant = this.aggregateCant * this.thisCant;
      let semiTotal = 0;     
      for(var i=0 ; i < this.thisAggregates.length; i++){  
       
        if(cant - this.thisAggregates[i].Cant >= 0){
          cant -= this.thisAggregates[i].Cant; 
          continue;
        }
        else{
         semiTotal+= ((this.thisAggregates[i].Cant -cant) * this.thisAggregates[i].SalePrice);   
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
      
      }

    },

    alertMissingProduct(){
      let mssg = ''
      if(this.orderFromCatering)
        mssg = this.mssgToOrder;
      else
        mssg = this.mssgToCatering;

        
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Warning',
          message: mssg,
          buttons: [                   
          {
            text: this.Cancel,
            handler: () => {   
              this.dismissQr(); 
            },
          },
            {
            text: this.Acept,
            handler: () => {      
              this.cart = [];
               this.parent.$store.commit('setCart', this.cart); 
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
            "Name": this.Name + this.thisName,
            "Price": this.thisPrice,
            "Cant": parseInt(this.thisCant),
            "Note": this.thisNote,
            "AggregatesCant": this.aggregateCant || 0,
            "Aggregates": this.thisAggregates,
            "isService": this.isService,
            "fromCatering": this.orderFromCatering,
            "State": 0,
         }
     
        const index = this.cart.findIndex(pr => pr.ProductId === this.productId && pr.Price === this.thisPrice );
      
        if (index !== -1) {
          this.cart[index].Cant = parseInt(this.cart[index].Cant) + parseInt(this.thisCant);          
          this.cart[index].Note += this.thisNote;           
          this.thisAggregates.forEach(a => this.cart[index].Aggregates.push(a) )
        }
        else{
          this.cart.push(p);
        }            
          this.parent.$store.commit('setCart', this.cart); 
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

    cantNoValida(){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.CantNoValid,
          buttons: [                   
          {
              text: this.Acept,
              handler: () => {                                 
                            
              },
          },
          ],
      })
      .then(a => a.present())
                  
    },
 
    addSide(event, id, cant){
  
      if(!event){
        let index = this.thisAggregates.findIndex(a => a._id === id)
        return this.thisAggregates.splice(index, 1)
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
        this.thisAggregates.push(producto[0])
      } 
    },

    getIngredients(flag, value){
          
      if(flag){
        let index = this.thisIngredients.findIndex(p => p === value)
        if(index !== -1)
          this.thisIngredients.splice(index, 1)       
      }
      else
         this.thisIngredients.push(value)

      let str =this.withoutIng + ': '

      this.thisIngredients.forEach( e => str += e + '. ')
      if(this.thisIngredients.length >0)
        this.thisNote = str
      else
      this.thisNote = ''  
    },
    
    alertSelectOrderTypeCatering(){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: '',
          message: this.mssOrderType,
          inputs:[
            {type: 'radio', label: 'Catering', value: 'delivery', },
            {type: 'radio', label: this.PickUp, value: 'pick', },           
          ],
          buttons: [                   
          {
            text: this.Cancel,
            handler: () => {   
              this.dismissQr(); 
            },
          },
            {
            text: this.Acept,
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
          message: this.mssOrderType,
          inputs:[
            {type: 'radio', label: this.Delivery, value: 'delivery', },
            {type: 'radio', label: this.PickUp, value: 'pick', },
            {type: 'radio', label: this.Table, value: 'table', },        
          ],
          buttons: [                   
          {
            text: this.Cancel,
            handler: () => {   
              this.dismissQr(); 
            },
          },
            {
            text: this.Acept,
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
          message: this.message,
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