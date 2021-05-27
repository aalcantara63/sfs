<template>
    <div >         

        <div v-if="prod.length > 0">

         <h3 style="text-align: center;">{{category}}: {{categoryDescription}}</h3>                                     
           
          <ion-searchbar  
                style="padding: 1px;"
                @ionClear="handleInput('')"
                @input="$event.target.value? handleInput($event.target.value): handleInput('')"
                :placeholder="$t('frontend.home.search')">           
            </ion-searchbar>

          <v-breakpoint>
            <div slot-scope="scope">
              <span  v-if="!scope.isSmall && !scope.noMatch"> 
                  <div  v-for="pr in filterProduct" :key="pr._id" 
                   :class="scope.isMedium? 'menu-col-6 card-category': 'menu-col-3 card-category'">
                                    
                     <ion-card color="primary"> 
                          <ion-avatar style="margin-inline: auto; margin-top: 25px;"  v-if="menuactive==='gridPicture'">
                            <img :src="pr.ImageUrl">
                          </ion-avatar>  
                          <h1 v-if="menuactive==='gridPicture'" class="elipsy-center" v-tooltip="pr.Name" style="margin: 5px;">{{pr.Name}}</h1>                       
                          <ion-label v-else class="ion-text-wrap menu-col-6" >
                            <h1 class="elipsy-center" v-tooltip="pr.Name">{{pr.Name}}</h1>
                          </ion-label>
                           <ion-label style="font-size: 12pt;font-weight: bold;text-align: center;">
                             <h2>{{ getPrice(pr.SalePrice, pr.VariantGroupId || '') }} </h2>
                          </ion-label> 
                          <ion-item color="primary">
                           <div style="width: 30%;float: left; text-align: center;    margin: 2px;">
                              <ion-button color="light" style="padding:0"  @click.stop=" productDetail(pr)" >
                               <span class="iconify" data-icon="ant-design:eye-filled" data-inline="false"  style="  width: 20px; height: 20px; margin: 0;"></span>
                             </ion-button>
                           </div>
                           <div style="width: 30%;float: left; text-align: center;    margin: 2px;">
                             <ion-button color="light" style="padding:0" @click.stop="share(pr.Name, staticUrl+pr._id)">
                                <span class="iconify" data-icon="fe:share" data-inline="false" style="  width: 20px; height: 20px; margin: 0;"></span>
                             </ion-button>
                           </div>
                            <div style="width: 30%;float: left; text-align: center;    margin: 2px;">
                             <ion-button color="light" style="padding:0" @click.stop="addToCart(pr.ImageUrl, pr._id, pr.Name, pr.SalePrice, pr.count || 1 , pr.Note ||'', [], pr.AggregateCant)">
                                <span class="iconify" data-icon="carbon:add" data-inline="false" style="  width: 20px; height: 20px; margin: 0;"></span>
                             </ion-button>
                           </div>
                              
                          </ion-item>

                      </ion-card>

                  </div>                
              </span>

              
            </div>
          </v-breakpoint>

       


            <!-- <ion-button expand="block" color="secondary" @click="done()">{{$t('frontend.product.back')}}</ion-button> -->
        </div>
        <div v-else>
          <ion-label>
              <!-- {{$t('frontend.product.noProducts')}}  -->
          </ion-label>             
        </div>

    </div>
</template>

<script>

import { EventBus } from '../event-bus';
import { VBreakpoint } from 'vue-breakpoint-component'
import ProductDetail from '../components/ProductDetail'
import { Plugins } from '@capacitor/core';
const { Share } = Plugins;

import { 
   
  logoFacebook, 
  logoInstagram,   
} from 'ionicons/icons';



export default {
 name: "Products",
  props: {
    restaurantSelectedId:  {type: String, default: "" }, 
    restaurantName:  {type: String, default: "" }, 
    currency:  {type: String, default: "" },     
    prod: {type: Array, default: () => [] },
    products: {type: Array, default: () => [] },
    variants: {type: Array, default: () => [] },
    categories: {type: Array, default:() => [] }, 
    categoryId: {type: String, default: "" } , 
    category: {type: String, default: "" }, 
    categoryDescription: {type: String, default: "" }, 
    orderType: {type: String, default: "" }, 
    orderFromCatering: {type: Boolean, default: false},
    isService: {type: Boolean, default: false},
    menuactive: {type: String, default: "grid" },
  },
 data () {
    return { 
          staticUrl:`https://imenuapps.net/?rid=${this.restaurantSelectedId}&share=`, 
          // staticUrl:`http://localhost:8080?rid=${this.restaurantSelectedId}&share=`, 
          logoFacebook, 
          logoInstagram,
          filterProduct: [],
          cart: []
    }
  },    
   components:{
    VBreakpoint: VBreakpoint, 
  },
  created: function(){    

    this.cart = this.$store.state.cart;

    this.prod.forEach(p => {p.show = false})
    this.filterProduct = JSON.parse(JSON.stringify(this.prod))
   },
  
  methods: {

    handleInput(value){
      
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.prod.filter(item => item.Name.toLowerCase().indexOf(query) > -1
                                    ||  item.Description.toLowerCase().indexOf(query) > -1
                                    || this.getSubcategory(item.CategoryId).toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterProduct = cat2
        else
          this.filterProduct = this.prod 
      });
    },

    getPrice(price, VariantGroupId){
      if(VariantGroupId ===''){
       const result = new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(price)
        return result;      
       
        }
           
      if(this.variants){
        var productVariant = this.variants.filter(v => v._id == VariantGroupId)
        if(productVariant.length > 0){
          var min = productVariant[0].Variants[0].SalePrice.toFixed(2)
          var max = productVariant[0].Variants[productVariant[0].Variants.length -1].SalePrice.toFixed(2)
          const result = new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(min)
          +' - '+ new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(max)
          return result;
          // return '$ '+min+' - '+'$ '+max;
        }
      }

      const result = new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(price)
      return result;
      // return '$ '+ price.toFixed(2);
    },

    haveVariant(VariantGroupId){
      if(this.variants){
       var productVariant = this.variants.filter(v => v._id == VariantGroupId)
        if(productVariant.length > 0)
          return true;
        else
          return false;
       }

    },

    getSubcategoryImg(CategoryId){
        
        let categ = this.categories.filter(item => item._id === CategoryId)
      
        if(categ.length >0 && categ[0].ParentId)
          return categ[0].ImageUrl
        return ''  
      },

    getSubcategory(CategoryId){
      
      let categ = this.categories.filter(item => item._id === CategoryId)
     
      if(categ.length >0 && categ[0].ParentId)
         return categ[0].Name
      return ''  
    },

    addToCart: function(ImageUrl, id, name, price, count, note, aggregates, aggregateCant){
     
        if(count <1)
          return this.cantNoValida();

         let p = {
           "ImageUrl": ImageUrl,
            "ProductId": id,
            "Name": name,
            "Price": price,
            "Cant": parseInt(count),
            "Note": note,
            "AggregatesCant": aggregateCant || 0,
            "Aggregates": aggregates,
            "isService": this.isService,
            "fromCatering": this.orderFromCatering,
            "State": 0,
         }
     
        const index = this.cart.findIndex(pr => pr.ProductId === id && pr.Price === price );
      
        if (index !== -1) {
          this.cart[index].Cant = parseInt(this.cart[index].Cant)  + parseInt(count);          
          this.cart[index].Note += note;  
          aggregates.forEach(a => this.cart[index].Aggregates.push(a) )        
        }
         else{
            this.cart.push(p);
             }   

          this.$store.commit('setCart', this.cart);
          this.openToast();
      },
     
    removeFromCart: function(id){
      const index = this.cart.findIndex(pr => pr.ProductId === id);   
        if (index !== -1) {
          this.cart.splice(index,1)  
          this.openToast();                  
        } 
        this.$store.commit('setCart', this.cart);
    },

    done: function(){
      EventBus.$emit('showProduct', false );
      },

    productDetail: function(pr){
           
      var productVariant=[]
      if(pr.VariantGroupId !=''){
        productVariant = this.variants.filter(v => v._id == pr.VariantGroupId)
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
            productId: pr._id,
            Name: pr.Name,
            SalePrice: parseFloat(pr.SalePrice),
            Description: pr.Description,
            ImageUrl: pr.ImageUrl,
            ProductCant: parseInt(pr.count) || 1,
            Note: pr.Note,
            productVariant: productVariant,
            aggregateCant: pr.AggregateCant || 0,
            Aggregates: pr.Aggregates || [],
            products: this.products,           
            orderType: this.orderType,            
            Ingredients: pr.Ingredients || [],          
            orderFromCatering: this.orderFromCatering,
            isService: this.isService,           
            currency: this.currency,
          },
        },
      })
      .then(m => m.present())
      },

 
     
    cantNoValida(){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.$t('frontend.home.cantNotValid'),
          buttons: [                   
          {
              text: this.$t('frontend.home.acept'),
              handler: () => {                                 
                            
              },
          },
          ],
      })
      .then(a => a.present())
                  
    },
     
     validateCant(event ){
      if(event>0)
        return event;
      else     
         return '1';
      
     },

     async openToast() {
      return this.$ionic.toastController
      
        .create({
          message: this.$t('frontend.product.massageToast'),
          duration: 500,
          position: 'top',
          color:'success'
        })
      .then(a => a.present())
    },

   
    alertSelectOrderType(){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: '',
          message: this.$t('frontend.home.selectOrderType'),
          buttons: [                   
          {
            text: this.$t('frontend.home.acept'),
            handler: () => {},
          },
          //  {
          //   text: this.$t('frontend.app.deliver'),
          //   handler: () => {              
          //     return EventBus.$emit('openDeliveryModal', true );    
          //   },
          // },
          //  {
          //   text: this.$t('frontend.app.pickup'),
          //   handler: () => {                                 
          //    return EventBus.$emit('openPickUpModal', true );                     
          //   },
          // },
          //  {
          //   text: this.$t('frontend.app.table'),
          //   handler: () => {                                 
          //     return EventBus.$emit('openTableModal', true );          
          //   },
          // },
          ],
      })
      .then(a => a.present())
                  
    },

    async share(name, url){
      try {
          await Share.share({
          title: name +' / '+ this.restaurantName,
          // text: name +' / '+ this.restaurantName,
          url: url,
          dialogTitle: `Share product ${name} from ${this.restaurantName}`
        });
        
      } catch (error) {
         this.getError(error);
        
      }
    },

    async getError(message) {
      return this.$ionic.toastController
    
      .create({
        message: message,
        duration: 2000,
        position: 'top',
        color:'danger'
      })
    .then(a => a.present())
  },

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >

 .menu-col-2{
        flex: 0 0 calc(calc(2 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(2 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(2 / var(--ion-grid-columns, 12)) * 100%);
    }
      .menu-col-5{
        flex: 0 0 calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
        padding: 0 5px;
    }
    .menu-col-6{
        flex: 0 0 calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
        padding: 0 5px;
    }
    .menu-col-4{
    flex: 0 0 calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    padding: 0 5px;
    }
    .menu-col-3{
    flex: 0 0 calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    padding: 0 5px;
    }
    .menu-col-12{
        flex: 0 0 calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
        padding: 0 5px;
    }
    .card-category{
      float: left;
      margin: 0;
      padding: 10px 2px;
    }
  .whatsapp__design__flat {
    background-color: transparent !important;
    color: #12ad10 !important;
}
.facebook__design__flat{
    background-color: transparent !important;
    color: #3b5998 !important;
}
.linkedin__design__flat{
    background-color: transparent !important;
    color: #0077b5 !important;
}
.email__design__flat{
    background-color: transparent !important;
    color: #414141 !important;
}
.sc-ion-card-md-h{
  font-size: 22px;
}
.button-social {    
    padding: 7px 1px !important;
    margin: 3px 1.5px;
    border-radius: 3px;
}
.img-product{
   max-width: 300px !important;
    margin: 0 auto !important;
    border-radius: 10px !important;
    height: 200px;
}
.card-category ion-card{
    max-width: 400px !important;
  margin: 0 auto !important;
}

.menu-share .button-native{
  width: 30px !important;
  height: 30px !important;
}
.elipsy-center{
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box; 
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;  
    text-align: center;
  }
</style>