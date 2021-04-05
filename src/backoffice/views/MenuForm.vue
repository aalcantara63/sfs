<template>
    <div id="menu" class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>
    <!-- <router-link to="/controlPanel"><ion-button expand="full" color="tertiary"><ion-icon name="hammer"></ion-icon>{{$t('backoffice.list.buttons.goToControlPanel')}}</ion-button></router-link> -->
    <!-- <router-link to="/menu"><ion-button expand="full" color="tertiary"><ion-icon name="arrow-round-back"></ion-icon>{{$t('backoffice.form.buttons.backToMenusList')}}</ion-button></router-link> -->

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'Menu'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{title}}</h1>            
            </ion-label>
          </ion-toolbar>
    </ion-header>
    <br/>

    <div v-if="spinner">
        <ion-spinner name="lines" class="spinner"></ion-spinner>
    </div>
    <div v-else>
      <!-- <ion-card> -->
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.menuName')}}</ion-label>
          <ion-input type="text" name="name"
          @input="name = $event.target.value" 
          v-bind:value="name">
          </ion-input>
        </ion-item>

        <!-- <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.date')}}</ion-label>
          <ion-datetime name="date" 
          @ionChange="date = $event.target.value" 
          v-bind:value="date"
          placeholder="Select Date">
          </ion-datetime>
        </ion-item> -->

        <ion-item>
           <ion-label>{{$t('backoffice.form.fields.isCatering')}}</ion-label>
           <ion-checkbox slot="end" name="isCatering" 
            @ionChange="isCatering = $event.target.checked"
            :checked="isCatering"  >    
          </ion-checkbox>
        </ion-item>

        <ion-item>
           <ion-label>{{$t('backoffice.form.fields.active')}}</ion-label>
           <ion-checkbox slot="end" name="active" 
            @ionChange="active = $event.target.checked"
            :checked="active"  >    
          </ion-checkbox>
        </ion-item>

        <ion-item>
           <ion-label>{{$t('backoffice.form.fields.isService')}}</ion-label>
           <ion-checkbox slot="end" name="isService" 
            @ionChange="changeService($event.target.checked)"
            :checked="isService"  >    
          </ion-checkbox>
        </ion-item>

        <!-- <ion-item v-for="entry in form" v-bind:key="entry.val">
          <ion-label>{{entry.val}}</ion-label>
          <ion-checkbox
            slot="end"
            @input="entry.checked = $event.target.value"
            :value="entry.isChecked">
          </ion-checkbox>
        </ion-item> -->

        <div v-if="screenWidth < 600">

            <ion-item>
                <ion-label>
                    <router-link to="/category">{{$t('backoffice.form.fields.availableCategories')}}</router-link>
                </ion-label>
            </ion-item>
            <ion-list>
                <ion-item-sliding v-for="category in availableCategories" v-bind:key="category._id">
                <ion-item>
                    <ion-thumbnail slot="start">
                        <ion-img :src="category.ImageUrl"></ion-img>
                    </ion-thumbnail>
                    <ion-label>
                        <!-- <h2>{{ product.CategoryId }}</h2> -->
                        <h2><div style="word-wrap: break-word">{{ category.Name }}</div></h2>
                    </ion-label>
                <span slot="end" class="iconify" data-icon="mdi:backburger" data-inline="false"></span>
                </ion-item>
                <ion-item-options side="end">
                    <ion-item-option color="primary" >
                    <ion-icon slot="icon-only" name="add" @click="addCategory(category._id)"></ion-icon>
                    </ion-item-option>
                    <ion-item-option v-if="hasPermission('canEditProduct')" color="success" >
                    <ion-icon slot="icon-only" name="list" @click="productsByCategory(category._id)"></ion-icon>
                    </ion-item-option>
                </ion-item-options>
                </ion-item-sliding>
            </ion-list>

        </div>

        <div v-if="screenWidth >= 600">

            <ion-item>
                <ion-label>
                    <router-link to="/category">{{$t('backoffice.form.fields.availableCategories')}}</router-link>
                </ion-label>
            </ion-item>
            <ion-list>
                <ion-item v-for="category in availableCategories" v-bind:key="category._id">

                    <ion-thumbnail slot="start">
                        <ion-img :src="category.ImageUrl"></ion-img>
                    </ion-thumbnail>
                    <ion-label>
                        <!-- <h2>{{ product.CategoryId }}</h2> -->
                        <h2><div style="word-wrap: break-word">{{ category.Name }}</div></h2>
                    </ion-label>
                    <ion-item-group side="end">
                        <ion-button color="primary" @click="addCategory(category._id)">
                            <ion-icon slot="icon-only" name="add"></ion-icon>
                        </ion-button>
                        <ion-button v-if="hasPermission('canEditProduct')" color="success" @click="productsByCategory(category._id)">
                            <ion-icon slot="icon-only" name="list"></ion-icon>
                        </ion-button>
                    </ion-item-group>
                </ion-item>
            </ion-list>

        </div>

        <div v-if="screenWidth < 600">
            <ion-item>
                <ion-label>
                    <span style="color: red">*</span>{{$t('backoffice.form.fields.selectedCategories')}}
                </ion-label>
            </ion-item>
            <ion-list>
                <ion-item-sliding v-for="category in selectedCategories" v-bind:key="category._id">
                <ion-item>
                    <ion-thumbnail slot="start">
                    <ion-img :src="category.ImageUrl"></ion-img>
                </ion-thumbnail>
                    <ion-label>
                        <!-- <h2>{{ product.CategoryId }}</h2> -->
                        <h2><div style="word-wrap: break-word">{{ category.Name }}</div></h2>
                    </ion-label>
                <span slot="end" class="iconify" data-icon="mdi:backburger" data-inline="false"></span>
                </ion-item>
                <ion-item-options side="end">
                    <ion-item-option color="danger" >
                    <ion-icon slot="icon-only" name="trash" @click="deleteCategory(category._id)"></ion-icon>
                    </ion-item-option>
                    <ion-item-option color="success" >
                    <ion-icon slot="icon-only" name="list" @click="productsByCategory(category._id)"></ion-icon>
                    </ion-item-option>
                </ion-item-options>
                </ion-item-sliding>
            </ion-list>
        </div>

        <div v-if="screenWidth >= 600">
            <ion-item>
                <ion-label>
                    <span style="color: red">*</span>{{$t('backoffice.form.fields.selectedCategories')}}
                </ion-label>
            </ion-item>
            <ion-list>
                <ion-item v-for="category in selectedCategories" v-bind:key="category._id">
                    <ion-thumbnail slot="start">
                        <ion-img :src="category.ImageUrl"></ion-img>
                    </ion-thumbnail>
                    <ion-label>
                        <!-- <h2>{{ product.CategoryId }}</h2> -->
                        <h2><div style="word-wrap: break-word">{{ category.Name }}</div></h2>
                    </ion-label>
                    <ion-item-group side="end">
                        <ion-button color="danger" @click="deleteCategory(category._id)">
                            <ion-icon slot="icon-only" name="trash"></ion-icon>
                        </ion-button>
                        <ion-button color="success" @click="productsByCategory(category._id)">
                            <ion-icon slot="icon-only" name="list"></ion-icon>
                        </ion-button>
                    </ion-item-group>
                </ion-item>
            </ion-list>
        </div>

      <!-- </ion-card>  -->
        <br/>
        <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveMenu()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
    </div>
    </div>
</template>
<script>

import { Api } from '../api/api.js';

export default{

  name: 'menuForm',
   
  data () {
    return {
      modelName: 'Menu',
      /****** Form Data ******/
      id: null,
      name: '',
      date: '',
      active: false,
      isCatering: false,
      isService: false,

      categories: [],
      selectedCategories: [],
      availableCategories: [],

      initialLoading: true,

      isBackdrop: false,
      spinner: false,

      screenWidth : 0,
    }
  },
  created: function(){
    this.screenWidth = screen.width;
    this.fetchAllCategories();
  },
  computed: {
        title() {
            return this.id ? this.$t('backoffice.form.titles.menuEditTitle') :  this.$t('backoffice.form.titles.menuNewTitle');
        }
  },
  methods:{
        changeService(val){
            this.isService = val;

            if (!this.id)
              this.initialLoading = false;

            if (!this.initialLoading)
            {
                this.availableCategories = [];
                this.selectedCategories = [];
                this.fetchAllCategoriesByType(val);
            }

            this.initialLoading = false;
            
        },
        ifErrorOccured(action){
          return this.$ionic.alertController.create({
              title: this.$t('backoffice.list.messages.connectionError'),
              message: this.$t('backoffice.list.messages.connectionErrorMessage'),
              buttons: [
                {
                  text: this.$t('backoffice.list.messages.buttons.goToList'),
                  handler: () => {
                      this.$router.push({
                          name: 'Menu',
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
                      case 'canEditProduct':
                          res = roles[index].canEditProduct;
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
    isValidForm(){
        // let errors = [];
        if (this.name == "")
        {
            // errors.push(this.$t('backoffice.form.validate.name'));
            return false
        }
        // if (this.date == "")
        // {
        //     // errors.push(this.$t('backoffice.form.validate.date'));
        //     return false
        // }
        if (this.selectedCategories.length == 0)
        {
            // errors.push(this.$t('backoffice.form.validate.category'));
            return false
        }

        return true

        // if (errors.length > 0)
        // {
        //     let message = "";
        //     for (let i = 0; i < errors.length; i++) {
        //          message += (i + 1) + "- " + errors[i] + "<br/>";
        //     }
        //     // this.ShowMessage(this.$t('backoffice.form.validate.validate'), 
        //     //                   message, this.$t('backoffice.form.validate.validateMenu'));
        //     this.showToastMessage(message, "danger");
        //     return false;
        // }
        // else
        // {
        //     return true;
        // }
    },
    ShowMessage: function(type, message, topic='') {
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
      productsByCategory: function(id){
          this.$router.push({
            name: 'ProductByCategory', 
            params: {
                     "categoryId": id,
                     "menuId": this.id,
                    }
          });
      },
      fetchAllCategoriesByType: function(val){
        this.$ionic.loadingController
        .create({
          cssClass: 'my-custom-class',
          message: this.$t('backoffice.titles.loading'),
          backdropDismiss: true
        })
        .then(loading => {
            loading.present()
            setTimeout(() => {  // Some AJAX call occurs
              Api.fetchAll('Category')
              .then(response => {    
                  this.availableCategories = response.data;
                  if (val)
                    this.availableCategories = this.availableCategories.filter(categ => categ.Service == true);
                  else
                    this.availableCategories = this.availableCategories.filter(categ => !categ.Service || categ.Service == false);
                  loading.dismiss();
                })
                .catch(e => {
                  console.log(e);
                  loading.dismiss();
                })  
            })
        })
      },
      fetchAllCategories: function(){

      this.$ionic.loadingController
      .create({
        cssClass: 'my-custom-class',
        message: this.$t('backoffice.titles.loading'),
        backdropDismiss: true
      })
      .then(loading => {
          loading.present()
          setTimeout(() => {  // Some AJAX call occurs
            Api.fetchAll('Category')
            .then(response => {    
                this.categories = response.data;
                this.id = this.$route.params.menuId;
                  if (this.id){
                      this.title = 'Edit menu';
                      Api.fetchById(this.modelName, this.id)
                          .then(responseMenu => {
                            this.initData(responseMenu.data);
                            loading.dismiss();
                            return responseMenu;
                          })
                          .catch(e => {
                            console.log(e);
                            loading.dismiss();
                            this.ifErrorOccured(this.fetchAllCategories);
                          })   
                  }
                  else{
                    this.initAvailableCategories();
                    loading.dismiss();
                  }
              })
              .catch(e => {
                console.log(e);
                loading.dismiss();
              })  
          })
      })
      },
      initData: function(data){
        // this.createSelectedProductList(data.Categories);
        this.name = data.Name;
        this.date = data.Date;
        this.active = data.Active;
        this.isCatering = data.IsCatering;
        this.isService = data.IsService;
        // this.$refs.active.checked = this.active;
        let categoriesIds = data.Categories;

        this.selectedCategories = this.mapCategory(categoriesIds);

        this.initAvailableCategories();
      },
      mapCategory: function(categoriesIds){
         let selCategories = [];
         
         categoriesIds.forEach(categoryId => {

            let selCategory = null;
            this.categories.forEach(category => {
                if (categoryId == category._id)
                    selCategory = category;
            });

            selCategories.push(selCategory);

         });

        // console.log("SelectedCateg");
        // console.log(selCategories);

         return selCategories;
         
      },
      ///aqui
      initAvailableCategories: function(){
          if (this.id)
          {
              let availableCateg = [];
              this.categories.forEach(category => {
                  let found = false;
                  this.selectedCategories.forEach(selectCateg => {
                    //  console.log(category);
                    //  console.log(selectCateg);
                     if (selectCateg._id == category._id)
                        found = true;
                  });
                  if (!found)
                    availableCateg.push(category);
              });

             this.availableCategories = availableCateg;
             if (this.isService)
                this.availableCategories = this.availableCategories.filter(categ => categ.Service == true)
             else
                this.availableCategories = this.availableCategories.filter(categ => !categ.Service || categ.Service == false)
          //     this.categories.forEach(category => {
          //     let found = false;
          //     this.selectedCategories.forEach(categorySelected => {
          //         if (category._id == categorySelected)
          //         {
          //            found = true;
          //         }
          //     });
          //     if (found == false)
          //         this.availableCategories.push(category);
          //     });
          }
          else
          {

                //               console.log('CATEGORIESSSS');
                // console.log(this.categories);
              this.availableCategories = this.categories;
              this.availableCategories = this.availableCategories.filter(categ => !categ.Service || categ.Service == false)
              // console.log("AVAILABLE CATEGORY");
              // console.log(this.availableCategories);
              // console.log("CATEGORIES");
              // console.log(this.categories);
          } 
      },
      // selActive(event){
      //   if (event) event.preventDefault()
      //     this.active = !this.active;
      // },
      clearData: function(){
          this.name = '';
          this.date = Date.now();
          this.active = false;
          this.categories = [];
          this.selectedCategories = [];
          this.availableCategories = [];
      },
      addCategory: function(id){
          let categ = this.availableCategories.find(category => category._id == id);
          this.selectedCategories.push(categ);

          var categoryIndex = this.availableCategories.indexOf(categ); // get index
          this.availableCategories.splice(categoryIndex, 1);
      },
      deleteCategory: function(id){
          let categ = this.selectedCategories.find(category => category._id == id);
          this.availableCategories.push(categ);

          var categoryIndex = this.selectedCategories.indexOf(categ);
          this.selectedCategories.splice(categoryIndex, 1);
      },
      //The category name must be unique.
      // searchCategoryIdByName: function(name){
      //    let categ =  this.categories.filter(categ => name == categ.Name);
      //   //  console.log(categ[0]);
      //    return categ[0]._id;
      // },
      // Create or edit a new menu
    createCategoriesObject: function(){

        let sCategories = [];
        // let productItem = null;
        this.selectedCategories.forEach(categorySelected => {
            sCategories.push(categorySelected._id);
        });
         return sCategories;
      },
    // updateActiveStateMenus: function(){
    //     Api.fetchAll('Menu')
    //       .then( response =>{
    //           let menus = response.data;
    //           menus.forEach( menu=> {
    //             if (menu._id != this.id)
    //             {
    //                 let item = {
    //                     "_id": menu._id,
    //                     "Name": menu.Name,
    //                     "Active": false,
    //                     "Categories": menu.Categories,
    //                     "Date": menu.Date,
    //                 }
    //                 Api.putIn('Menu', item)
    //                     .catch(e => {
    //                           console.log(e);
    //                           this.ShowMessage('Error', 'Error', 'Fetch Menu');
    //                     })
    //             }
    //           });
    //       })
    //       .catch(e => {
    //           console.log(e);
    //           this.ShowMessage('Error', 'Error', 'Fetch Menu');
    //       }) 
    //   },
      saveMenu: function(){

        if (this.isValidForm())
        {
            this.isBackdrop = true;
            console.log(this.active);
            let categories = this.createCategoriesObject();
            let item = {
                "Name": this.name,
                "Active": this.active,
                "IsCatering": this.isCatering,
                "IsService": this.isService,
                "Categories": categories,
                "Date": this.date,
            }
            // if (this.active)
            // {
            //    this.updateActiveStateMenus();
            // }
            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              this.spinner = true;
              Api.putIn(this.modelName, item)
                  .then(response => {
                        // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                        //      this.$t('backoffice.list.messages.messageEditSuccessMenu'), 
                        //         this.$t('backoffice.list.messages.titleEditMenu'));
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessMenu'), "success");
                        this.clearData();
                        this.spinner = false;
                        this.$router.push({
                          name: 'Menu', 
                        });
                        return response;
                  })
                  .catch(e => {
                        this.isBackdrop = false;
                        console.log(e);
                        this.spinner = false;
                        this.ifErrorOccured(this.saveMenu);
                  })
            }
            else{
              //Else, I am created a new menu
              this.spinner = true;
              Api.postIn(this.modelName, item)
                  .then(response => {
                      // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                      //        this.$t('backoffice.list.messages.messageCreateSuccessMenu'), 
                      //           this.$t('backoffice.list.messages.titleCreateMenu'));
                      this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessMenu'), "success");
                      this.clearData();
                      this.spinner = false;
                      this.$router.push({
                        name: 'Menu', 
                      });
                      return response;
                  })
                  .catch(e => {
                      this.isBackdrop = false;
                      console.log(e);
                      this.spinner = false;
                      this.ifErrorOccured(this.saveMenu);
                  })
            }

        }
        
      },
  },

}
</script>

<style>

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