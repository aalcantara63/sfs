<template>
    <div id="productbycategory" class="screen">

        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                <ion-back-button default-href="/controlPanel" @click="backToMenu()"></ion-back-button>
                </ion-buttons>
                <ion-label style="padding: 20px 100px;">
                <h1>{{$t('backoffice.form.titles.allProducts')}} {{categoryName}}</h1>            
                </ion-label>

                <ion-label slot="end">
                  <router-link to="/product-form">
                      <ion-chip style="font-size: 30px" outline color="primary" v-if="hasPermission('canCreateProduct')">
                          <ion-label><ion-icon name="add"></ion-icon></ion-label>
                      </ion-chip>
                  </router-link>
                </ion-label>
            </ion-toolbar>
        </ion-header>
        <br/>

        <div v-if="spinner">
            <ion-spinner name="lines" class="spinner"></ion-spinner>
        </div>
        <div v-else>
          <div v-if="screenWidth < 600">
            <paginate
            name="languages"
            :list="products"
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

                        <div v-if="hasPermission('canEditProduct')">      
                            <ion-checkbox v-if="product.Available" checked="true" slot="end" @click="availableProduct(product, false)"></ion-checkbox>
                            <ion-checkbox v-else checked="false" slot="end" @click="availableProduct(product, true)"></ion-checkbox>
                        </div>
                        <span slot="end" class="iconify" data-icon="mdi:backburger" data-inline="false"></span>
                    </ion-item>

                    <ion-item-options side="end">
                        <ion-item-option v-if="hasPermission('canEditProduct')" color="primary" @click="editProduct(product._id)">
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
            :list="products"
            :per="8"
            >
            
            <ion-list>
                <ion-item v-for="product in paginated('languages')" v-bind:key="product._id">
                    <ion-item-group side="start" v-if="hasPermission('canEditProduct')" style="margin-right: 15px">
                        <ion-checkbox v-if="product.Available" checked="true" slot="end" @click="availableProduct(product, false)"></ion-checkbox>
                        <ion-checkbox v-else checked="false" slot="end" @click="availableProduct(product, true)"></ion-checkbox>
                    </ion-item-group>
                    <ion-thumbnail slot="start">
                        <ion-img :src="product.ImageUrl"></ion-img>
                    </ion-thumbnail>
                    <ion-label class="ion-text-wrap">
                        <h2>{{ product.Name }}</h2>
                        <!-- <h3>{{ product.BarCode }}</h3> -->
                    </ion-label>

                    <ion-item-group side="end">
                        <ion-button v-if="hasPermission('canEditProduct')" color="primary" @click="editProduct(product._id)">
                            <ion-icon slot="icon-only" name="create"></ion-icon>
                        </ion-button>
                        <ion-button v-if="hasPermission('canDeleteProduct')" color="danger" @click="deleteProduct(product._id)">
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


        </div>

    </div>
</template>

<script>

import { Api } from '../api/api.js';

export default {
   name: 'product',
   created: function(){
      this.screenWidth = screen.width
      this.init()
   },
   data () {
    return {
      modelName: 'Product',
      /****** Form Data ******/
      categoryId: null,
      sourceMenuId: null,
      categoryName: "",
      products: [],

      paginate: ['languages'],

      spinner: false,
      screenWidth: 0,
    }
  },
   methods: {
     init(){
        this.categoryId = this.$route.params.categoryId;
        this.sourceMenuId = this.$route.params.menuId;
        this.fetchProductsByCategory();
        this.getCategoryName();
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
            buttons: ['OK'],
          })
        .then(a => a.present())
    },
    /****** CRUD category methods ******/
    fetchProductsByCategory: function(){
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
                Api.getProductsByCategory(this.categoryId).then(response => {
                // console.log(response.data)
                    this.products = response.data
                    loading.dismiss();
                })
                .catch(e => {
                    console.log(e);
                    loading.dismiss();
                    this.ifErrorOccured(this.init);
                });
            })
        })
    },
    getCategoryName: function(){
        Api.fetchById('Category', this.categoryId).then(response => {
          // console.log(response.data)
          this.categoryName = response.data.Name
        })
        .catch(e => {
            console.log(e);
            this.ShowMessage('Error', 'Error', 'Fetch category');
        });
    },
    backToMenu: function(){
        this.$router.push({
            name: 'MenuForm', 
            params: {
                     "menuId": this.sourceMenuId,
                    }
          });
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
    availableProduct(product, state){

        let item = {
            "_id": product._id,
            "Name": product.Name,
            "Description": product.Description,
            "CostPrice": product.CostPrice,
            "SalePrice": product.SalePrice,
            "CategoryId": product.CategoryId,
            "ImageUrl": product.ImageUrl,
            "Available": state,
            "BarCode": product.BarCode,
        }
        this.spinner = true;
        Api.putIn(this.modelName, item)
              .then(response => {
                    this.ShowMessage('Info', 'Product state was successfully change', 'Available product');
                    this.fetchProductsByCategory(this.categoryId);
                    this.spinner = false;
                    return response;
              })
              .catch(e => {
                    console.log(e);
                    this.fetchProductsByCategory(this.categoryId);
                    this.ShowMessage('Error', 'Error', 'Available product');
                    this.spinner = false;
              })

    },
    editProduct: function(id){
        this.$router.push({
        name: 'ProductForm', 
        params: { 
                    productId: id, 
                    categoryId: this.categoryId,
                    menuId: this.sourceMenuId,
                }
      });
    },
    deleteProduct: function(id){


        return this.$ionic.alertController.create({
        title: 'Confirm delete',
        message: 'Do you want to delete this product?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              
            }
          },
          {
            text: 'Delete',
            handler: () => {

                this.spinner = true;
                Api.deleteById(this.modelName, id)
                .then(response => {
                    this.ShowMessage('Info', 'Product was successfully deleted', 'Delete product');
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