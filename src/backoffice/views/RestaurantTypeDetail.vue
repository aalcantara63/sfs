<template>
  <div id="order" class="screen">

     <modal name="category-modal"  width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
        <ion-buttons slot="start" @click="hideCategory()">
              <ion-back-button default-href="home"></ion-back-button>
        </ion-buttons>
        <ion-header>
          <ion-toolbar>
            <ion-title>{{$t('backoffice.form.fields.category')}}</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-card>
        
          <ion-item :disabled="spinner? true: false"  >                  
            <ion-label position="floating">{{$t('backoffice.form.fields.name')}}<strong style="color: red">*</strong></ion-label>                               
            <ion-input type="text" required=true  
            :value="newCategory.Name"  @input="newCategory.Name=$event.target.value"
            ></ion-input>
          </ion-item>
          <ion-item :disabled="spinner? true: false"  >                  
              <ion-label position="floating">{{$t('backoffice.form.fields.description')}}
                </ion-label>                               
              <ion-input type="text" required=true  
              :value="newCategory.Description"  @input="newCategory.Description=$event.target.value"
              ></ion-input>
          </ion-item>               
          <ion-button  @click="hideCategory()">{{ this.$t('frontend.home.cancel') }}</ion-button>
          <ion-button :disabled="newCategory.Name === ''? true: false"   @click="addCategory()">{{ this.$t('frontend.home.acept') }}</ion-button>
          
        </ion-card>          
      </modal>

      <modal name="category-modal-edit"  width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
        <ion-buttons slot="start" @click="categoryForEdit=-1,hideCategoryEdit()">
              <ion-back-button default-href="home"></ion-back-button>
        </ion-buttons>
        <ion-header>
          <ion-toolbar>
            <ion-title>{{$t('backoffice.list.messages.titleEditCategory')}}</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-card v-if="indexMenu !== -1 && categoryForEdit !== -1">
        
          <ion-item :disabled="spinner? true: false"  >                  
            <ion-label position="floating">{{$t('backoffice.form.fields.name')}}<strong style="color: red">*</strong></ion-label>                               
            <ion-input type="text" required=true  
            :value="restaurantType.Datas[indexMenu].Categories[categoryForEdit].Name"  
            @input="restaurantType.Datas[indexMenu].Categories[categoryForEdit].Name=$event.target.value"
            ></ion-input>
          </ion-item>
          <ion-item :disabled="spinner? true: false"  >                  
              <ion-label position="floating">{{$t('backoffice.form.fields.description')}}
                </ion-label>                               
              <ion-input type="text" required=true  
              :value="restaurantType.Datas[indexMenu].Categories[categoryForEdit].Description"  
              @input="restaurantType.Datas[indexMenu].Categories[categoryForEdit].Description=$event.target.value"
              ></ion-input>
          </ion-item>               
          <ion-button :disabled="restaurantType.Datas[indexMenu].Categories[categoryForEdit].Name === ''? true: false" 
           @click="categoryForEdit=-1,hideCategoryEdit()">{{ this.$t('frontend.home.acept') }}</ion-button>
          
        </ion-card>          
      </modal>


      <modal name="product-modal-create"  width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
        <ion-buttons slot="start" @click="hideAddProduct()">
              <ion-back-button default-href="home"></ion-back-button>
        </ion-buttons>
        <ion-header>
          <ion-toolbar>
            <ion-title>{{$t('backoffice.options.manageProducts')}}</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-card>
        
          <ion-item :disabled="spinner? true: false"  >                  
            <ion-label position="floating">{{$t('backoffice.form.fields.name')}}<strong style="color: red">*</strong></ion-label>                               
            <ion-input type="text" required=true  
            :value="newProduct.Name"  @input="newProduct.Name=$event.target.value"
            ></ion-input>
          </ion-item>
          <ion-item :disabled="spinner? true: false"  >                  
              <ion-label position="floating">{{$t('backoffice.form.fields.description')}}
                </ion-label>                               
              <ion-input type="text" required=true  
              :value="newProduct.Description"  @input="newProduct.Description=$event.target.value"
              ></ion-input>
          </ion-item>               
          <ion-item :disabled="spinner? true: false"  >                  
              <ion-label position="floating">{{$t('backoffice.form.fields.salePrice')}}
                </ion-label>                               
              <ion-input type="number" required=true  
              :value="newProduct.SalePrice"  @input="newProduct.SalePrice=$event.target.value"
              ></ion-input>
          </ion-item>  
           
          <ion-button  @click="hideAddProduct()">{{ this.$t('frontend.home.cancel') }}</ion-button>
          <ion-button :disabled="newProduct.Name === ''? true: false"   @click="addProduct()">{{ this.$t('frontend.home.acept') }}</ion-button>
          
        </ion-card>          
      </modal>

      <modal name="product-modal-edit"  width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
        <ion-buttons slot="start" @click="productForEdit=-1,hideEditProduct()">
              <ion-back-button default-href="home"></ion-back-button>
        </ion-buttons>
        <ion-header>
          <ion-toolbar>
            <ion-title>{{$t('backoffice.list.messages.titleEditProduct')}}</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-card  v-if="indexMenu !== -1 && categorySelected !== -1 && productForEdit !==-1">
        
          <ion-item :disabled="spinner? true: false"  >                  
            <ion-label position="floating">{{$t('backoffice.form.fields.name')}}<strong style="color: red">*</strong></ion-label>                               
            <ion-input type="text" required=true  
            :value="restaurantType.Datas[indexMenu].Categories[categorySelected].Product[productForEdit].Name"  
            @input="restaurantType.Datas[indexMenu].Categories[categorySelected].Product[productForEdit].Name=$event.target.value"
            ></ion-input>
          </ion-item>
          <ion-item :disabled="spinner? true: false"  >                  
              <ion-label position="floating">{{$t('backoffice.form.fields.description')}}
                </ion-label>                               
              <ion-input type="text" required=true  
              :value="restaurantType.Datas[indexMenu].Categories[categorySelected].Product[productForEdit].Description"  
              @input="restaurantType.Datas[indexMenu].Categories[categorySelected].Product[productForEdit].Description=$event.target.value"
              ></ion-input>
          </ion-item>             
          <ion-item :disabled="spinner? true: false"  >                  
              <ion-label position="floating">{{$t('backoffice.form.fields.salePrice')}}
                </ion-label>                               
              <ion-input type="number" required=true  
              :value="restaurantType.Datas[indexMenu].Categories[categorySelected].Product[productForEdit].SalePrice"  
              @input="restaurantType.Datas[indexMenu].Categories[categorySelected].Product[productForEdit].SalePrice=$event.target.value"
              ></ion-input>
          </ion-item>             
         
          <ion-button :disabled="restaurantType.Datas[indexMenu].Categories[categorySelected].Product[productForEdit].Name === ''? true: false"   
          @click="productForEdit=-1,hideEditProduct()">{{ this.$t('frontend.home.acept') }}</ion-button>
          
        </ion-card>          
      </modal>

      <modal name="menu-modal"  width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
        <ion-buttons slot="start" @click="hideMenu()">
              <ion-back-button default-href="home"></ion-back-button>
        </ion-buttons>
        <ion-header>
          <ion-toolbar>
            <ion-title>{{$t('backoffice.options.manageMenus')}}</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-card>
               <ion-item :disabled="spinner? true: false"  >                  
                    <ion-label position="floating">{{$t('backoffice.form.fields.name')}}<strong style="color: red">*</strong></ion-label>                               
                    <ion-input type="text" required=true  
                    :value="newMenu.Name"  @input="newMenu.Name=$event.target.value"
                    ></ion-input>
                </ion-item>               
                <ion-item :disabled="spinner? true: false" >                  
                    <ion-label>{{$t('backoffice.titles.cateringMenus')}}                           
                      <ion-toggle :checked ="newMenu.IsCatering" @ionChange="newMenu.IsCatering=$event.target.checked"></ion-toggle>
                    </ion-label>   
                </ion-item>
                <ion-item :disabled="spinner? true: false" >                  
                    <ion-label >{{$t('backoffice.form.fields.isService')}}                                
                      <ion-toggle :checked ="newMenu.IsService" @ionChange="newMenu.IsService=$event.target.checked"></ion-toggle>
                    </ion-label>
                </ion-item>
           
          <ion-button  @click="hideMenu()">{{ this.$t('frontend.home.cancel') }}</ion-button>
          <ion-button :disabled="newMenu.Name === ''? true: false"  @click="createMenu()">{{ this.$t('frontend.home.acept') }}</ion-button>
          
        </ion-card>          
      </modal>
    
    <ion-header>
          <div style="display: flex; align-items: center;flex-direction: row; justify-content: space-between;">
            <ion-buttons slot="start">
              <ion-back-button default-href="/support" @click="goToSupport()"></ion-back-button>
            </ion-buttons>
            
               <h1>{{$t('frontend.createNew.restaurantType')}}</h1>  
           
            <div>
              <ion-button @click="saveRestaurantType()">{{$t('backoffice.form.buttons.save')}}</ion-button>
              <ion-button v-if="restaurantType._id && restaurantType.CanDelete" @click="deleteRestaurantType()">Delete</ion-button>
            </div>
          </div>
                  
                  
    </ion-header>

      <ion-refresher 
        style="position: relative"
        slot="fixed"
        @ionRefresh="doRefresh($event)">
          <ion-refresher-content 
            refreshing-spinner="crescent"
          ></ion-refresher-content>
      </ion-refresher>

  
      <ion-loading
        v-if="spinner"
        cssClass="my-custom-class"
        :message="$t('frontend.tooltips.loadRestaurant')"
      ></ion-loading>
  
      <div :key="updateKey+'U'">  

        <ion-item :disabled="spinner? true: false">                  
              <ion-label position="floating">{{$t('frontend.createNew.restaurantType')}} <strong style="color: red">*</strong></ion-label>                               
              <ion-input type="text" required=true  
              class="menu-col-8" 
              :value="restaurantType.Type" @input="restaurantType.Type = $event.target.value"
                  ></ion-input>
          </ion-item> 
       

          <div  style="display: flex;justify-content: flex-start;align-items: center;">   
             <ion-select interface="popover" icon="add" v-if="restaurantType.Datas.length > 0"
            style="padding: 20px;font-size: 20px;font-weight: bold;"
            :ok-text="$t('backoffice.form.messages.buttons.ok')"
            :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
            :value="0"
            :placeholder="$t('frontend.menu.menu')"
              @ionChange="indexMenu=$event.target.value,categorySelected='',categoryForEdit=-1,productForEdit=-1" >
                <ion-select-option v-for="(res, index) in restaurantType.Datas"                    
                  :key="index" 
                  :value="index" >{{res.Name}}
                </ion-select-option>                                
            </ion-select> 
             <ion-button @click="showMenu()" style="    display: table;">+ {{$t('backoffice.options.manageMenus')}}</ion-button>             
          </div>

         
          <ion-card v-if="indexMenu !== -1" >
            
             <v-breakpoint>
              <div slot-scope="scope" >

                  <div style="display: flex;align-items: center;justify-content: space-around;" >
                        <ion-item :disabled="spinner? true: false"  >                  
                          <ion-label position="floating">{{$t('backoffice.form.fields.name')}}<strong style="color: red">*</strong></ion-label>                               
                          <ion-input type="text" required=true  
                          :value="restaurantType.Datas[indexMenu].Name"  @input="restaurantType.Datas[indexMenu].Name=$event.target.value"
                          ></ion-input>
                      </ion-item>               
                      <div  style="display: flex;align-items: center;flex-direction: column;">                  
                          <ion-label>{{$t('backoffice.titles.cateringMenus')}}  <strong style="color: red">*</strong></ion-label>                               
                          <ion-toggle :checked ="restaurantType.Datas[indexMenu].IsCatering" @ionChange="restaurantType.Datas[indexMenu].IsCatering=$event.target.checked"></ion-toggle>
                      </div>
                      <div  style="display: flex;align-items: center;flex-direction: column;" >                  
                          <ion-label >{{$t('backoffice.form.fields.isService')}}<strong style="color: red">*</strong></ion-label>                               
                          <ion-toggle :checked ="restaurantType.Datas[indexMenu].IsService" @ionChange="restaurantType.Datas[indexMenu].IsService=$event.target.checked"></ion-toggle>
                      </div>  
                      <div style="display: flex">
                          <div @click="showCategory()" style="    display: table;"><span class="iconify" data-icon="fluent:add-square-multiple-16-filled" data-inline="false"></span></div>
                          <div @click="restaurantType.Datas.splice(indexMenu,1), indexMenu=-1,updateKey+=1"><span class="iconify" data-icon="fluent:delete-48-regular" data-inline="false"></span></div>
                      </div>
                  </div>

                  <ion-card >                                   
                    
                    <div style="display: flex;flex-direction: row;flex-wrap: wrap;">
                              <div  v-for="(category, indexC) in restaurantType.Datas[indexMenu].Categories" :key="indexC"              
                                  :class="scope.isSmall || scope.noMatch? 'menu-col-12 card-categories' : scope.isMedium? 'menu-col-6 card-categories' : 'menu-col-3 card-categories'">  
                                                
                                <ion-card                         
                                  color="primary"                          
                                  :style="categorySelected===indexC? 'opacity: 1;text-align: center;margin-bottom: 0;': 'opacity: 0.75;text-align: center;margin-bottom: 0;'"
                                  @click="categorySelected=indexC,showProd=true"
                                > 
                                
                                  <ion-avatar style="margin-inline: auto; margin-top: 25px;" >
                                    <img :src="category.ImageUrl">
                                  </ion-avatar>
                                  <h1 class="elipsy-center" v-tooltip="category.Name" style="margin: 5px;">{{category.Name}}</h1>                                                                                                               
                                </ion-card>
                                <ion-card style="display: flex;justify-content: space-around;margin-top: 0.5px;" color="ligth">
                                  <div @click="categoryForEdit=indexC,showAddProduct()"><span class="iconify" data-icon="fluent:add-square-multiple-16-filled" data-inline="false"></span></div>
                                  <div @click="categoryForEdit=indexC,showCategoryEdit()"><span class="iconify" data-icon="fa-solid:edit" data-inline="false" ></span></div>
                                    <div @click="deleteCategory(indexC)"><span class="iconify" data-icon="fluent:delete-48-regular" data-inline="false"></span></div>
                                </ion-card>
                              </div>
                    </div>            

                    <div  v-if="categorySelected !==''" :key="updateKey">

                      <ion-label v-if="categorySelected !==''">{{restaurantType.Datas[indexMenu].Categories[categorySelected].Description}}</ion-label>
                      <div v-if="categorySelected !==''" style="display: flex;flex-direction: row;flex-wrap: wrap;">                
                        <div  v-for="(product, indexP) in restaurantType.Datas[indexMenu].Categories[categorySelected].Product" :key="indexP"              
                              :class="scope.isSmall || scope.noMatch? 'menu-col-12 card-categories' : scope.isMedium? 'menu-col-6 card-categories' : 'menu-col-3 card-categories'">        
                                      
                              <ion-card  color="primary" style="    text-align: center;" > 
                                <ion-avatar style="margin-inline: auto; margin-top: 25px;" >
                                  <img :src="product.ImageUrl">
                                </ion-avatar>
                                <h1 class="elipsy-center" v-tooltip="product.Name" style="margin: 5px;">{{product.Name}}</h1> 
                                {{getFormatPrice(product.SalePrice) }}                                                                                                             
                              </ion-card>
                              <ion-card style="display: flex;justify-content:space-around;margin-top: 0.5px;" color="light">
                                  <div @click="productForEdit=indexP,showEditProduct()"><span class="iconify" data-icon="fa-solid:edit" data-inline="false" ></span></div>
                                  <div @click="deleteProduct(indexP)"><span class="iconify" data-icon="fluent:delete-48-regular" data-inline="false"></span></div>
                              </ion-card> 
                            </div>
                      </div>        

                    </div>

                  </ion-card>

              </div>
             </v-breakpoint>

          </ion-card>

         

         
        

      </div>
            
  </div>
</template>

<script>

import { Api } from '../api/api.js';
// import { Utils } from '../utils/utils.js';
import { VBreakpoint } from 'vue-breakpoint-component'

export default {

  name: 'restaurantType',
  created: function(){  
    
    if(this.$route.params.restaurantType){
      this.restaurantType = this.$route.params.restaurantType;
      if(!this.restaurantType.Datas || !Array.isArray(this.restaurantType.Datas)) this.restaurantType.Datas = [];
    }
      else{
        this.restaurantType = {
          "Type": '',
          "State": true,
          "Datas": [],
        }
      }
    if(this.$route.params.parent)
      this.parent = this.$route.params.parent;

    if(this.restaurantType.Datas.length > 0)
       this.indexMenu = 0
  
  },
  components:{   
    VBreakpoint: VBreakpoint,  
  },
  data () {
    return {
      modelName: 'restauranttype',     
      spinner: false,     
      currency: 'USD',
      restaurantType: {},
      parent: {},
      newMenu: {
        "Categories" : [],
        "Name" : "",
        "Active" : true,  
        "IsCatering" : false,
        "IsService" : false
      },
     
      indexMenu: -1,
      newCategory: {
        "Product" : [],
        "Name" : "",
        "Description" : "",       
        "IsService" : false,
        "ImageUrl": 'https://storagemenusuccess.blob.core.windows.net/restauranttype/category.jpg'
      },
      categorySelected:'',
      categoryForEdit: -1,
      productForEdit: -1,
      newProduct: {
        "Name" : "",
        "Description" : "",       
        "Available"  : true,
        "CostPrice" : 1,
        "SalePrice" : 1, 
        "ImageUrl" : "https://storagemenusuccess.blob.core.windows.net/restauranttype/producto.jpg",       
      },
       updateKey: 0,
       showProd: true,

     
    }
  }, 
  methods: {


   getFormatPrice(price){
       let result = price           
          if (this.currency)
            result = new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(price)      
         return result;
    },

    async toastMss(message, color) {
      return this.$ionic.toastController      
        .create({
          message: message,         
          position: 'top',
          color: color,
           duration: 1000
        
        })
      .then(a => a.present())
    },  
    
    async saveRestaurantType(){
      
     try {
       this.spinner = true;
        let res;
        if(this.restaurantType._id)
            res = await Api.putIn('restaurantType', this.restaurantType)
        else
          res = await Api.postIn('restaurantType', this.restaurantType)
        this.spinner = false;
        if(res.status === 200)
          return this.toastMss('bien hecho', 'success')
       
     } catch (error) {
       error
       this.spinner = false;
       return this.toastMss('mal hecho', 'danger')
     }
    },

    async deleteRestaurantType(){
      const id = this.restaurantType._id
       console.log('delete restaurantype: ' + id)
      try {
        this.spinner = true;
        const response = await Api.deleteById('restauranttype', id);
        if(response.status === 200)
          return this.goToSupport();
         this.spinner = false;
        
      } catch (error) {
        error
         this.spinner = false;
      }
    },

    goToSupport(){
       return this.$router.push({ name: 'Support',  params:{segmentValue:'restaurants'}});
    },

    createMenu(){

      JSON.parse(JSON.stringify(this.restaurantType));

      if(this.newMenu.Name !=='')
        this.restaurantType.Datas.push(this.newMenu);

      this.indexMenu = this.restaurantType.Datas.length -1;
      this.updateKey++

      this.newMenu = {
        "Categories" : [],
        "Name" : "",
        "Active" : true,  
        "IsCatering" : false,
        "IsService" : false
       }
       this.hideMenu();
       console.log(JSON.parse(JSON.stringify(this.restaurantType)))
    },

    addCategory(){
       console.log(JSON.parse(JSON.stringify(this.restaurantType)))
      if(this.indexMenu !== -1){
        this.restaurantType.Datas[this.indexMenu].Categories.push(this.newCategory);
      }
      this.newCategory = {
        "Product" : [],
        "Name" : "",
        "Description" : "",       
        "IsService" : false,
        "ImageUrl": 'https://storagemenusuccess.blob.core.windows.net/restauranttype/category.jpg'
      },
      console.log(JSON.parse(JSON.stringify(this.restaurantType)))
    },

    addProduct(){

      console.log(JSON.parse(JSON.stringify(this.restaurantType)))
      if(this.indexMenu !== -1 && this.categoryForEdit !== -1){
        this.restaurantType.Datas[this.indexMenu].Categories[this.categoryForEdit].Product.push(this.newProduct);
      }
      this.newProduct = {
        "Name" : "",
        "Description" : "",       
        "Available"  : true,
        "CostPrice" : 1,
        "SalePrice" : 1,
        "ImageUrl" : "https://storagemenusuccess.blob.core.windows.net/restauranttype/producto.jpg", 
      },
      console.log(JSON.parse(JSON.stringify(this.restaurantType)))
    },

    showCategory () {
      this.$modal.show('category-modal');
        },
    
    hideCategory () {
      this.$modal.hide('category-modal');
        },

    showCategoryEdit () {
      this.$modal.show('category-modal-edit');
        },
    
    hideCategoryEdit () {
      this.$modal.hide('category-modal-edit');
        },

    showAddProduct () {
      this.$modal.show('product-modal-create');
        },
    
    hideAddProduct () {
      this.$modal.hide('product-modal-create');
        },
        
    showEditProduct () {
      this.$modal.show('product-modal-edit');
        },
    
    hideEditProduct () {
      this.$modal.hide('product-modal-edit');
        },
        

    hideMenu(){
        this.$modal.hide('menu-modal');
    },
     showMenu () {
      this.$modal.show('menu-modal');
    },

    deleteProduct(index){
      this.restaurantType.Datas[this.indexMenu].Categories[this.categorySelected].Product.splice(index,1);      
      this.updateKey++;     
    },

    deleteCategory(index){
      this.categorySelected = '';
      console.log( this.categorySelected)
      this.restaurantType.Datas[this.indexMenu].Categories.splice(index,1);      
      console.log(JSON.parse(JSON.stringify(this.restaurantType.Datas[this.indexMenu].Categories)))
      this.updateKey++;     
    }



  },

}

</script>

<style>

.menu-col-3{
    flex: 0 0 calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
}

  .menu-col-4{
    flex: 0 0 calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
    visibility: visible;
    }

    .menu-col-6{
    flex: 0 0 calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
    visibility: visible;
    }
    
    .menu-col-5{
    flex: 0 0 calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
    visibility: visible;
    }

    
ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

.paginate-list {
  width: 159px;
  margin: 0 auto;
  text-align: left;
 
}
 .paginate-list li {
    display: block;   
  }

 .paginate-list li:before {
      content: '⚬ ';
      font-weight: bold;
      color: slategray;
    }

.paginate-links.items {
  user-select: none;
}
  a {
    cursor: pointer;
  }
  li.active a {
    font-weight: bold;
  }
  li.next:before {
    content: ' | ';
    margin-right: 13px;
    color: #ddd;
  }
  li.disabled a {
    color: #ccc;
    cursor: no-drop;
  }
  .prev, .next{
    font-size: 40px;
  }

  h6 {
    font-size: 16px;
    margin: 5px;
    font-weight: 200;
}

 .elipsis-menu{
        text-overflow: ellipsis !important;
    overflow: hidden !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

@media only screen and (min-width : 1024px){

    .screen{
        /* padding-left: 10%;
        padding-right: 10%;
        border: #edf1ee solid 1px; */
        margin-right: 10%;
        margin-left: 10%;
        /* border-radius: 25px; */
    }

}

</style>