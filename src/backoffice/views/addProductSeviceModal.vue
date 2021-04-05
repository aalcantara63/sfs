<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
        <ion-list>
            <ion-list-header>
                <ion-label>
                    <span style="color: red">*</span> {{ parent.$t('backoffice.titles.cateringMenus') }}
                </ion-label>
            </ion-list-header>

            <ion-item>
                <ion-label>Select a catering menu</ion-label>
                <ion-select  :ok-text="parent.$t('backoffice.form.messages.buttons.ok')" :cancel-text="parent.$t('backoffice.form.messages.buttons.dismiss')"
                @ionChange="changeMenu($event.target.value)" v-bind:value="menuSelected">
                    <ion-select-option v-for="menu in cateringMenus" v-bind:key="menu._id" v-bind:value="menu._id" >{{menu.Name}}</ion-select-option>
                </ion-select>
            </ion-item>
        </ion-list>

        <ion-list v-if="menuSelected">
            <ion-list-header>
                <ion-label>
                    <span style="color: red">*</span>{{ parent.$t('backoffice.options.manageCategories') }}
                </ion-label>
            </ion-list-header>

            <ion-item>
                <ion-label>{{ parent.$t('backoffice.form.titles.selectACategory') }}</ion-label>
                <ion-select  :ok-text="parent.$t('backoffice.form.messages.buttons.ok')" :cancel-text="parent.$t('backoffice.form.messages.buttons.dismiss')"
                @ionChange="changeCategory($event.target.value)" v-bind:value="categorySelected">
                    <ion-select-option v-for="category in categories" v-bind:key="category._id" v-bind:value="category._id" >{{category.Name}}</ion-select-option>
                </ion-select>
            </ion-item>
        </ion-list>

        <div v-if="categorySelected">
            <div v-if="screenWidth < 600">
                <ion-item>
                    <ion-label>
                        {{ parent.$t('backoffice.form.fields.availableProducts') }}
                    </ion-label>
                </ion-item>
                <ion-list>
                    <ion-item-sliding v-for="product in products" v-bind:key="product._id">
                    <ion-item>
                        <ion-thumbnail slot="start">
                            <ion-img :src="product.ImageUrl"></ion-img>
                        </ion-thumbnail>
                        <ion-label>
                            <h2><div style="word-wrap: break-word">{{ product.Name }}</div></h2>
                        </ion-label>
                    <span slot="end" class="iconify" data-icon="mdi:backburger" data-inline="false"></span>
                    </ion-item>
                    <ion-item-options side="end">
                        <ion-item-option color="primary" @click="addProduct(product)">
                        <ion-icon slot="icon-only" name="add"></ion-icon>
                        </ion-item-option>
                    </ion-item-options>
                    </ion-item-sliding>
                </ion-list>

            </div>

            <div v-if="screenWidth >= 600">

                <ion-item>
                    <ion-label>
                        {{ parent.$t('backoffice.form.fields.availableProducts') }}
                    </ion-label>
                </ion-item>
                <ion-list>
                    <ion-item v-for="product in products" v-bind:key="product._id">

                        <ion-thumbnail slot="start">
                            <ion-img :src="product.ImageUrl"></ion-img>
                        </ion-thumbnail>
                        <ion-label>
                            <h2><div style="word-wrap: break-word">{{ product.Name }}</div></h2>
                        </ion-label>
                        <ion-item-group side="end">
                            <ion-button color="primary" @click="addProduct(product)">
                                <ion-icon slot="icon-only" name="add"></ion-icon>
                            </ion-button>
                        </ion-item-group>
                    </ion-item>
                </ion-list>

            </div>
        </div>

        <div v-if="productsSelected.length > 0">
            <div v-if="screenWidth < 600">

                <ion-item>
                    <ion-label>
                         parent.$t('backoffice.form.fields.selectedProducts')
                    </ion-label>
                </ion-item>
                <ion-list>
                    <ion-item-sliding v-for="product in productsSelected" v-bind:key="product._id">
                    <ion-item>
                        <ion-thumbnail slot="start">
                            <ion-img :src="product.ImageUrl"></ion-img>
                        </ion-thumbnail>
                        <ion-label>
                            <h2><div style="word-wrap: break-word">{{ product.Name }}</div></h2>
                        </ion-label>
                    <span slot="end" class="iconify" data-icon="mdi:backburger" data-inline="false"></span>
                    </ion-item>
                    <ion-item-options side="end">
                    <ion-item-option color="danger" >
                      <ion-icon slot="icon-only" name="trash" @click="deleteProduct(product)"></ion-icon>
                    </ion-item-option>
                    </ion-item-options>
                    </ion-item-sliding>
                </ion-list>

            </div>

            <div v-if="screenWidth >= 600">

                <ion-item>
                    <ion-label>
                       {{ parent.$t('backoffice.form.fields.availableProducts') }}
                    </ion-label>
                </ion-item>
                <ion-list>
                    <ion-item v-for="product in productsSelected" v-bind:key="product._id">

                        <ion-thumbnail slot="start">
                            <ion-img :src="product.ImageUrl"></ion-img>
                        </ion-thumbnail>
                        <ion-label>
                            <h2><div style="word-wrap: break-word">{{ product.Name }}</div></h2>
                        </ion-label>
                        <ion-item-group side="end">
                            <ion-button color="danger" @click="deleteProduct(product)">
                                <ion-icon slot="icon-only" name="trash" ></ion-icon>
                            </ion-button>
                        </ion-item-group>
                    </ion-item>
                </ion-list>

            </div>
        </div>

        <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="add()">{{ parent.$t('frontend.order.add') }}</ion-button>
        <ion-button expand="full" color="danger" @click="dismissModal()">X</ion-button>
    </ion-content>
  </div>
</template>

<script>
import { Api } from '../api/api.js';
import { EventBus } from '../../frontend/event-bus';

export default {
  name: 'Modal',
  props: {
    title: { type: String, default: 'Super Modal' },
    addType: { type: String, default: 'product'},
    button: { type: String, default: 'Close'},
    button2: { type: String, default: 'Cancel order'},
    parent: { type: Object, default: null },
    isCatering: { type: Boolean, default: true},
  },
  data() {
    return {
      content: 'Content',

      menuSelected : '',
      cateringMenus : [],

      allCategories: [],
      categorySelected: '',
      categories: [],

      products: [],
      productsSelected: [],

      screenWidth : 0,
    }
  },
  created: function(){
    this.screenWidth = screen.width;
    this.fetchCategories()
    this.fetchMenus()

  },
  methods:{
      fetchMenus: function(){
        this.$ionic.loadingController
        .create({
          cssClass: 'my-custom-class',
          message: this.parent.$t('backoffice.titles.loading'),
          backdropDismiss: true
        })
        .then(loading => {
            loading.present()
            setTimeout(() => {
                //llamada ajax						
                Api.fetchAll('menu').then(response => {
                  // console.log(response.data)
                  this.cateringMenus = response.data
                  if (this.isCatering)
                      this.cateringMenus = this.cateringMenus.filter(menu => menu.IsCatering)
                  else
                      this.cateringMenus = this.cateringMenus.filter(menu => !menu.IsCatering)
                  if (this.addType == 'product')
                    this.cateringMenus = this.cateringMenus.filter(menu => !menu.IsService || menu.IsService == false)
                  else
                    this.cateringMenus = this.cateringMenus.filter(menu => menu.IsService == true)
                  if (this.cateringMenus.length > 0)
                  {
                      this.menuSelected = this.cateringMenus[0]._id
                  }
                      
                  loading.dismiss();
                })
                .catch(e => {
                  console.log(e)
                  loading.dismiss()
                  this.ifErrorOccured(this.fetchMenus)
                });
            })
        }) 
    },
    fetchCategories: function(){
        this.$ionic.loadingController
        .create({
          cssClass: 'my-custom-class',
          message: this.parent.$t('backoffice.titles.loading'),
          backdropDismiss: true
        })
        .then(loading => {
            loading.present()
            setTimeout(() => {
                //llamada ajax						
                Api.fetchAll('category').then(response => {
                  // console.log(response.data)
                  this.allCategories = response.data
                  if (this.addType == 'product')
                      this.allCategories = this.allCategories.filter(category => !category.Service || category.Service == false)
                  else
                      this.allCategories = this.allCategories.filter(category => category.Service)
                      
                  loading.dismiss();
                })
                .catch(e => {
                  console.log(e)
                  loading.dismiss()
                  this.ifErrorOccured(this.fetchMenus)
                });
            })
        }) 
    },
    changeMenu(menu){
        console.log("MENU: " + menu)
        this.menuSelected = menu;

          //Traer las todas las categorías de ese menú
          if (menu){
            this.$ionic.loadingController
            .create({
              cssClass: 'my-custom-class',
              message: this.parent.$t('backoffice.titles.loading'),
              backdropDismiss: true
            })
            .then(loading => {
                loading.present()
                setTimeout(() => {  // Some AJAX call occurs
                    Api.fetchById('menu', menu)
                      .then(response => {
                        const listCategoriesIds = response.data.Categories;

                        this.categories = [];
                        listCategoriesIds.forEach(categoryId => {
                          let selCategory = null;
                          this.allCategories.forEach(category => {
                              if (categoryId == category._id)
                                  selCategory = category;
                          });
                          this.categories.push(selCategory);
                        })
                        if (this.categories.length > 0)
                        {
                            this.categorySelected = this.categories[0]._id
                        }

                        loading.dismiss();
                        return response;
                      })
                      .catch(e => {
                        console.log(e);
                        loading.dismiss();
                        this.ifErrorOccured(this.init)
                      })
                })
            })
        }
        
    },
    changeCategory(category){
        this.categorySelected = category;

        //Traer todos los productos de esa categoría
        this.$ionic.loadingController
        .create({
          cssClass: 'my-custom-class',
          message: this.parent.$t('backoffice.titles.loading'),
          backdropDismiss: true
        })
        .then(loading => {
            loading.present()
            setTimeout(() => {
                //llamada ajax						
                Api.fetchAll('product').then(response => {
                  // console.log(response.data)
                  this.products = response.data
                  this.products = this.products.filter(prod => prod.CategoryId == category)
                      
                  loading.dismiss();
                })
                .catch(e => {
                  console.log(e)
                  loading.dismiss()
                });
            })
        })
    },
    addProduct(product){
        console.log(product)
        if (!this.productsSelected.find(prod => product._id == prod._id))
            this.productsSelected.push(product)
    },
    deleteProduct(product){
        this.productsSelected.splice(this.productsSelected.indexOf(product), 1)
    },
    ifErrorOccured(action){
      return this.parent.$ionic.alertController.create({
          title: this.parent.$t('backoffice.list.messages.connectionError'),
          message: this.parent.$t('backoffice.list.messages.connectionErrorMessage'),
          buttons: [
            {
              text: this.parent.$t('backoffice.list.messages.buttons.goToAdministration'),
              handler: () => {
                  this.parent.$router.push({
                      name: 'ControlPanel',
                  });
              }
            },
            {
              text: this.parent.$t('backoffice.list.messages.buttons.retry'),
              handler: () => {
                  action();
              }
            }
          ]
        })
        .then(a => a.present());
    },
    dismissModal() { 
        this.$ionic.modalController.dismiss(null);
    },
    isValidForm(){
        if (this.productsSelected.length > 0)
          return true
        
        return false
    },
    ShowMessage(type, message, topic='') {
      return this.$ionic.alertController
          .create({
              cssClass: 'my-custom-class',
              header: type,
              subHeader: topic,
              message: message,
              buttons: [this.parent.$t('backoffice.form.messages.buttons.ok')],
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
    add(){
        console.log("Aqui")
        console.log(this.productsSelected)

        let productSel = []
        this.productsSelected.forEach(prod => {
            let item = {
                'Aggregates': prod.Aggregates,
                'AggregateCant': prod.AggregateCant,
                'Cant': 1,
                'ImageUrl': prod.ImageUrl,
                'Name': prod.Name,
                'Note': prod.Note,
                'Price': prod.CostPrice,
                '_id': prod._id,
                'fromCatering': true,
            }
            //Precios diferentes si es catering o no.
            if (!this.isCatering) item.Price = prod.SalePrice
            if (this.addType == 'product')
                item['isService'] = false
            else
                item['isService'] = true
            productSel.push(item)
        })

        if (this.addType == 'product')
            EventBus.$emit('ProductsSelected', productSel);
        else
            EventBus.$emit('ServicesSelected', productSel);

        this.dismissModal()
    }
  },
}
</script>
