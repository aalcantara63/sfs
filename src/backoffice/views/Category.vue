<template>
  <div id="category" class="screen">

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{$t('backoffice.titles.categories')}}</h1>            
            </ion-label>

            <ion-label slot="end">
            <router-link to="/category-form">
                <ion-chip style="font-size: 30px" outline color="primary" v-if="hasPermission('canCreateCategory')">
                    <ion-label><ion-icon name="add"></ion-icon></ion-label>
                </ion-chip>
            </router-link>
            </ion-label>
          </ion-toolbar>

            <ion-searchbar  
                @input="handleInput($event.target.value)" @ionClear="filterCategories = categories" 
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
              :list="filterCategories"
              :per="8"
            >
            <ion-list>
              <ion-item-sliding v-for="category in paginated('languages')" v-bind:key="category._id">
                <ion-item>
                  <ion-thumbnail slot="start">
                    <ion-img :src="category.ImageUrl"></ion-img>
                  </ion-thumbnail>
                  <ion-label>
                      <h2>{{ category.Name }} | <div v-if="category.Service" style="display: inline-block">{{$t('backoffice.form.fields.service')}}</div><div style="display: inline-block" v-else>{{$t('backoffice.form.fields.product')}}</div></h2>
                      <h3><div style="word-wrap: break-word">{{ category.Description }}</div></h3>
                  </ion-label>
                  <span class="iconify" data-icon="mdi:backburger" data-inline="false"></span>
                </ion-item>
                <ion-item-options side="end">
                  <ion-item-option v-if="hasPermission('canEditCategory')" color="primary" @click="editCategory(category._id)">
                      <ion-icon slot="icon-only" name="create"></ion-icon>
                  </ion-item-option>
                  <ion-item-option v-if="hasPermission('canDeleteCategory')" color="danger" @click="deleteCategory(category._id)">
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
              :list="filterCategories"
              :per="8"
            >
            <ion-list>
              <ion-item v-for="category in paginated('languages')" v-bind:key="category._id">
                <ion-thumbnail slot="start">
                  <ion-img :src="category.ImageUrl"></ion-img>
                </ion-thumbnail>
                <ion-label>
                    <h2>{{ category.Name }} | <div v-if="category.Service" style="display: inline-block">{{$t('backoffice.form.fields.service')}}</div><div style="display: inline-block" v-else>{{$t('backoffice.form.fields.product')}}</div></h2>
                    <h3><div style="word-wrap: break-word">{{ category.Description }}</div></h3>
                </ion-label>
                <ion-item-group side="end">
                  <ion-button v-if="hasPermission('canEditCategory')" color="primary" @click="editCategory(category._id)">
                      <ion-icon slot="icon-only" name="create"></ion-icon>
                  </ion-button>
                  <ion-button v-if="hasPermission('canDeleteCategory')" color="danger" @click="deleteCategory(category._id)">
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

  name: 'category',
  created: function(){
   this.fetchCategories();
   this.screenWidth = screen.width;
  },
  data () {
    return {
      modelName: 'Category',
      categories: [],
      filterCategories: [],

      paginate: ['languages'],

      spinner: false,
      screenWidth: 0,
    }
  }, 
  methods: {
    doRefresh(){
        this.fetchCategories();
    },
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

      this.filterCategories = this.categories
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.categories.filter(item => item.Name.toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterCategories = cat2
        else
          this.filterCategories = this.categories
      });
    },
    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canCreateCategory':
                          res = roles[index].canCreateCategory;
                          break;
                      case 'canEditCategory':
                          res = roles[index].canEditCategory;
                          break;
                      case 'canDeleteCategory':
                          res = roles[index].canDeleteCategory;
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
    /****** CRUD category methods ******/
    fetchCategories: function(){
       this.$ionic.loadingController
      .create({
        cssClass: 'my-custom-class',
        message: this.$t('backoffice.titles.loading'),
        // duration: 1000,  
        backdropDismiss: true
      })
      .then(loading => {
          loading.present()
          setTimeout(() => {  // Some AJAX call occurs
                Api.fetchAll(this.modelName).then(response => {
                this.categories = response.data
                this.filterCategories = this.categories;
                loading.dismiss();
              })
              .catch(e => {
                console.log(e)
                loading.dismiss()
                this.ifErrorOccured(this.fetchCategories)
              });
          })
      })
    },
    editCategory: function(id){
        this.$router.push({
        name: 'CategoryForm', 
        params: { categoryId: id }
      });
    },
    deleteCategory: function(id){

        this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteCategory'),
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
              Api.deleteById(this.modelName, id)
                .then(response => {
                  // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'), 
                  //                       this.$t('backoffice.list.messages.messageDeleteSuccessCategory'), 
                  //                               this.$t('backoffice.list.messages.deleteSubtitleCategory'));
                  this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessCategory'), "success");
                  this.fetchCategories();
                  this.spinner = false;
                  return response;
                })
                .catch(e => {
                  console.log(e);
                  this.ifErrorOccured(mess => {
                      this.deleteCategory(id)
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
