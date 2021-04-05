<template>
    <div id="product" class="screen">

        <!-- <router-link to="/controlPanel"><ion-button expand="full" color="tertiary"><ion-icon name="hammer"></ion-icon>{{$t('backoffice.list.buttons.goToControlPanel')}}</ion-button></router-link>
        <router-link to="/product-form"><ion-button v-if="hasPermission('canCreateProduct')" expand="full" color="primary"><ion-icon name="add"></ion-icon>{{$t('backoffice.list.actions.addANew')}} {{$t('backoffice.list.entitiesName.product')}}</ion-button></router-link> -->

        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1 v-if="cType == 'product'">{{$t('backoffice.titles.products')}}</h1>
              <h1 v-else>{{$t('backoffice.options.manageServices')}}</h1>           
            </ion-label>

            <ion-label slot="end">
            <!-- <router-link :to="goToForm()"> -->
                <ion-chip style="font-size: 30px" outline color="primary" v-if="hasPermission('canCreateProduct')" @click="goToForm()">
                    <ion-label><ion-icon name="add"></ion-icon></ion-label>
                </ion-chip>
            <!-- </router-link> -->
            </ion-label>
          </ion-toolbar>

          <ion-searchbar  
                @input="handleInput($event.target.value)" @ionClear="filterProducts = products"
                :placeholder="$t('frontend.home.search')">           
            </ion-searchbar>
        </ion-header>

        <div v-if="spinner">
            <ion-spinner name="lines" class="spinner"></ion-spinner>
        </div>
        <div v-else>
          <div v-if="screenWidth < 600">
            <paginate
            name="languages"
            :list="filterProducts"
            :per="8"
            >

            <ion-list>
                <ion-item-sliding v-for="product in paginated('languages')" v-bind:key="product._id">
                    <ion-item>
                        <ion-thumbnail slot="start">
                            <ion-img :src="product.ImageUrl"></ion-img>
                        </ion-thumbnail>
                        <ion-label class="ion-text-wrap">
                            <h2>{{ product.Name }}</h2>
                            <!-- <h3>{{ product.BarCode }}</h3> -->
                        </ion-label>
                        <ion-label >
                            <p><router-link to="/category">{{ getCategoryNameById(product.CategoryId) }}</router-link></p>
                            <p>{{$t('backoffice.form.fields.costPrice')}}: {{ getFormateNumber(product.CostPrice)}} </p>
                            <p>{{$t('backoffice.form.fields.salePrice')}}: {{ getFormateNumber(product.SalePrice)}} </p>
                        </ion-label>
                        <span slot="end" class="iconify" data-icon="mdi:backburger" data-inline="false"></span>
                    </ion-item>
                  <!--  <ion-item>
                    <ion-item>  
                    <ion-label>
                        <h2>{{ product.Name }}</h2>
                        <h3>{{ product.Description }}</h3>
                        <ion-label>{{ fetchCategoryById(product.CategoryId) }}</ion-label> 
                    </ion-label> 
                    </ion-item>-->
                    <ion-item-options side="end">
                        <ion-item-option v-if="hasPermission('canEditProduct')" color="primary" @click="editProduct(product._id, product.Name, product.Description,
                        product.CostPrice, product.SalePrice, product.CategoryId)">
                            <ion-icon slot="icon-only" name="create"></ion-icon>
                        </ion-item-option>
                        <ion-item-option v-if="hasPermission('canDeleteProduct')" color="danger" @click="deleteProduct(product._id)">
                            <ion-icon slot="icon-only" name="trash"></ion-icon>
                        </ion-item-option>
                    </ion-item-options>
                </ion-item-sliding>
            </ion-list>

            </paginate>

            <paginate-links for="languages" color="primary" 
                :simple="{
                next:'»' ,
                prev: '« ' }"
            ></paginate-links> 

          </div>

          <div v-if="screenWidth >= 600">
            <paginate
            name="languages"
            :list="filterProducts"
            :per="8"
            >

            <ion-list>
                <ion-item v-for="product in paginated('languages')" v-bind:key="product._id">
                    <ion-thumbnail slot="start">
                        <ion-img :src="product.ImageUrl"></ion-img>
                    </ion-thumbnail>
                    <ion-label class="ion-text-wrap">
                        <h2>{{ product.Name }}</h2>
                        <!-- <h3>{{ product.BarCode }}</h3> -->
                    </ion-label>
                    <ion-label >
                        <p><router-link :to="'/category-form/'+product.CategoryId">{{ getCategoryNameById(product.CategoryId) }}</router-link></p>
                        <p>{{$t('backoffice.form.fields.costPrice')}}: {{ getFormateNumber(product.CostPrice)}}</p>
                        <p>{{$t('backoffice.form.fields.salePrice')}}: {{ getFormateNumber(product.SalePrice)}}</p>
                    </ion-label>
                    <ion-item-group side="end">
                        <ion-button v-if="hasPermission('canEditProduct')" color="primary" @click="editProduct(product._id, product.Name, product.Description,
                        product.CostPrice, product.SalePrice, product.CategoryId)">
                            <ion-icon slot="icon-only" name="create"></ion-icon>
                        </ion-button>
                        <ion-button v-if="hasPermission('canDeleteProduct')" color="danger" @click="deleteProduct(product)">
                            <ion-icon slot="icon-only" name="trash"></ion-icon>
                        </ion-button>
                    </ion-item-group>
                </ion-item>
            </ion-list>

            </paginate>

            <paginate-links for="languages" color="primary" 
                :simple="{
                next:'»' ,
                prev: '« ' }"
            ></paginate-links> 

          </div>

        <!-- <ion-infinite-scroll @ionInfinite="loadMore" threshold="100px" position="bottom">
            <ion-infinite-scroll-content></ion-infinite-scroll-content>
        </ion-infinite-scroll> -->

        <!-- <ion-infinite-scroll>
            <ion-infinite-scroll-content
                loadingSpinner="bubbles"
                loadingText="Loading more data…">
            </ion-infinite-scroll-content>
        </ion-infinite-scroll> -->
        </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';

export default {
   name: 'product',
   created: function(){
       this.init();
       this.screenWidth = screen.width;
   },
   data () {
    return {
      modelName: 'Product',
      /****** Form Data ******/
    //   categoryId: null,
      categories: [],
      categoriesIds: [],
      products: [],
      filterProducts: [],

      loading: null,

      paginate: ['languages'],

      cType: '',

      spinner: false,
      screenWidth: 0,

      currency: 'USD',

      rou: '/product-form'
    }
  },
   methods: {
    // showLoading(){
    //     return this.$ionic.loadingController
    //     .create({
    //       cssClass: 'my-custom-class',
    //       message: this.$t('backoffice.titles.loading'),
    //       duration: 1000,
    //       backdropDismiss: true
    //     })
    //     .then(a => a.present())
    // },
    init(){
      Api.fetchAll('VariantGroup')
      .then(res => {
         console.log('Variants: ' + res.data.length)
      })

       this.cType = this.$route.params.type || 'product';
       if (this.cType != 'product')
          this.rou = '/product-form/service'
       this.getCurrency();
       this.fetchCategories();

      //  this.fetchProducts();
    },
    getCurrency(){
        const restaurantID = this.$store.state.user.RestaurantId
        if (restaurantID){
            Api.fetchById('Restaurant', restaurantID).then(response => {
                this.currency = response.data.Currency
            }).catch(e => {
                console.log(e)
            })
        } 
    },
    getFormateNumber: function(number){
      return new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(number).toString()
    },
    goToForm(){
        if (this.cType != 'product')
        {
            this.$router.push({
                name: 'ProductForm',
                params: {
                    type: 'service'
                }
            })
        }
        else{
            this.$router.push({
                name: 'ProductForm',
                params: {
                    type: 'product'
                }
            })
        }
    },
    ifErrorOccured(action){
      return this.$ionic.alertController.create({
          title: this.$t('backoffice.list.messages.connectionError'),
          message: this.$t('backoffice.list.messages.connectionErrorMessage'),
          buttons: [
            {
              text: this.$t('backoffice.list.messages.buttons.goToAdministration'),
              handler: () => {
                  this.$router.push({
                      name: 'ControlPanel',
                  });
              }
            },
            {
              text: this.$t('backoffice.list.messages.buttons.retry'),
              handler: () => {
                  action();
              }
            }
          ]
        })
        .then(a => a.present());
    },
    handleInput(value){

      this.filterProducts = this.products
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.products.filter(item => item.Name.toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterProducts = cat2
        else
          this.filterProducts = this.products
      });
    },
    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canCreateProduct':
                          res = roles[index].canCreateProduct;
                          break;
                      case 'canEditProduct':
                          res = roles[index].canEditProduct;
                          break;
                      case 'canDeleteProduct':
                          res = roles[index].canDeleteProduct;
                          break;
                      default:
                          break;
                }
                if (res)
                { 
                    return res;
                }              
            }
        }
        return res;
    },
    ShowMessage(type, message, topic='') {
        return this.$ionic.alertController
          .create({
            cssClass: 'my-custom-class',
            header: type,
            subHeader: topic,
            message: message,
            buttons: [this.$t('backoffice.form.messages.buttons.ok')],
          })
        .then(a => a.present())
    },
    showToastMessage(message, tColor){
      return this.$ionic.toastController.create({
        color: tColor,
        position: 'top',
        duration: 3000,
        message: message,
        showCloseButton: false
      }).then(a => a.present())
    },
    loadMore: function(event) {
        // this.$store.dispatch('loadMore')
        event.target.complete();    
    },
    /****** CRUD category methods ******/
    fetchCategories: function(){
        this.$ionic.loadingController
        .create({
          cssClass: 'my-custom-class',
          message: this.$t('backoffice.titles.loading'),
          backdropDismiss: true
        })
        .then(loading => {
            loading.present()
            setTimeout(() => {
                  //llamada ajax						
                  Api.fetchAll('Category').then(response => {
                  // console.log(response.data)
                  this.categories = response.data
                  if (this.cType == 'product')
                  {
                      this.categories = this.categories.filter(cat => !cat.Service || cat.Service == false)
                  }
                  else{
                      this.categories = this.categories.filter(cat => cat.Service == true)
                  }
                  this.categories.forEach(cat => {
                      this.categoriesIds.push(cat._id)
                  })
                  console.log(this.categoriesIds)
                  this.fetchProducts();
                  loading.dismiss();
                })
                .catch(e => {
                    console.log(e);
                    loading.dismiss();
                    // this.ShowMessage('Error', 'Error', 'Fetch category');
                });
            })
        })
    },
    fetchProducts: function(){
        this.$ionic.loadingController
        .create({
          cssClass: 'my-custom-class',
          message: this.$t('backoffice.titles.loading'),
          backdropDismiss: true
        })
        .then(loading => {
            loading.present()
            setTimeout(() => {
                //llamada ajax						
                Api.fetchAll(this.modelName).then(response => {
                  this.products = response.data
                  //AQUI ME QUEDE
                  this.products = this.products.filter(prod => this.categoriesIds.includes(prod.CategoryId))
                  this.filterProducts = this.products
                  loading.dismiss()
                })
                .catch(e => {
                    console.log(e);
                    loading.dismiss();
                    this.ifErrorOccured(this.init)
                });
            })
        })
    },
    getCategoryNameById: function(id){
        var categ = '';
        this.categories.forEach(category => {
            if (category._id == id) {
                categ = category.Name;                
            }
        });
        return categ;
    },
    // fetchCategoryById: function(id) {
    //     let categoryName = '';
    //     this.categories.forEach(category => {
    //         if (category._id == id){
    //             categoryName = category.Name;
    //             return categoryName;
    //         }
    //     }
    //     );

    //     return categoryName;
    // },
    editProduct: function(id){
          this.$router.push({
            name: 'ProductForm', 
            params: { 
              productId: id,
              type: this.cType
            }
          });
    },
    deleteProduct: function(product){

        const id = product._id
        return this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteProduct'),
        buttons: [
          {
            text: this.$t('backoffice.list.messages.buttons.cancel'),
            role: 'cancel',
            handler: () => {
              
            }
          },
          {
            text: this.$t('backoffice.list.messages.buttons.delete'),
            handler: () => {
              
                this.spinner = true;
                if (product.VariantGroupId)
                {
                    Api.deleteById('VariantGroup', product.VariantGroupId)
                }
                Api.deleteById(this.modelName, id)
                .then(response => {
                    // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                    //   this.$t('backoffice.list.messages.messageDeleteSuccessProduct'),
                    //       this.$t('backoffice.list.messages.deleteSubtitleProduct'));
                    this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessProduct'), "success");
                    this.fetchProducts();
                    this.spinner = false;
                    return response;
                })
                .catch(e => {
                    console.log(e);
                    this.ifErrorOccured(mess => {
                      this.deleteProduct(id)
                      this.spinner = false
                      return mess
                    });
                })

            }
          }
        ]
      })
      .then(a => a.present());  

     },
   } 
}
</script>

<style>

.menu-col-3{
    flex: 0 0 calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
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

@media only screen and (min-width : 1024px){

    .screen{
        padding-left: 10%;
        padding-right: 10%;
        border: #edf1ee solid 1px;
        margin-right: 10%;
        margin-left: 10%;
        /* border-radius: 25px; */
    }

}

</style>