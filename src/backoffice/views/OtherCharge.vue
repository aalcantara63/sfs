<template>
    <div id="otherCharge" class="screen">

        <!-- <router-link to="/controlPanel"><ion-button expand="full" color="tertiary"><ion-icon name="hammer"></ion-icon>{{$t('backoffice.list.buttons.goToControlPanel')}}</ion-button></router-link>
        <router-link to="/otherCharge-form"><ion-button v-if="hasPermission('canCreateOtherCharge')" expand="full" color="primary"><ion-icon name="add"></ion-icon>{{$t('backoffice.list.actions.addANew')}} {{$t('backoffice.list.entitiesName.otherCharge')}}</ion-button></router-link> -->

        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{$t('backoffice.titles.otherCharges')}}</h1>            
            </ion-label>

            <ion-label slot="end">
            <router-link to="/otherCharge-form">
                <ion-chip style="font-size: 30px" outline color="primary" v-if="hasPermission('canCreateOtherCharge')">
                    <ion-label><ion-icon name="add"></ion-icon></ion-label>
                </ion-chip>
            </router-link>
            </ion-label>
          </ion-toolbar>

          <ion-searchbar  
                @input="handleInput($event.target.value)" @ionClear="filterOtherCharges = otherCharges"
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
            :list="filterOtherCharges"
            :per="8"
          >
              <ion-list>
                  <ion-item-sliding v-for="otherCharge in paginated('languages')" v-bind:key="otherCharge._id">
                      <ion-item>
                          <ion-label class="ion-text-wrap">
                              <h2>{{ otherCharge.Name }}</h2>
                              <h3>{{ otherCharge.ProductMin }}-{{ otherCharge.ProductMax }}...{{$t('backoffice.form.fields.price')}}:{{otherCharge.Price}}</h3>
                          </ion-label>
                          <ion-checkbox v-if="otherCharge.Available" checked="true" slot="end" @click="availableOtherCharge(otherCharge, false)"></ion-checkbox>
                          <ion-checkbox v-else checked="false" slot="end" @click="availableOtherCharge(otherCharge, true)"></ion-checkbox>
                          <span slot="end" class="iconify" data-icon="mdi:backburger" data-inline="false"></span>
                      </ion-item>
                      <ion-item-options side="end">
                          <ion-item-option v-if="hasPermission('canEditOtherCharge')" color="primary" @click="editOtherCharge(otherCharge._id)">
                              <ion-icon slot="icon-only" name="create"></ion-icon>
                          </ion-item-option>
                          <ion-item-option v-if="hasPermission('canDeleteOtherCharge')" color="danger" @click="deleteOtherCharge(otherCharge._id)">
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
            :list="filterOtherCharges"
            :per="8"
          >
              <ion-list>
                  <ion-item v-for="otherCharge in paginated('languages')" v-bind:key="otherCharge._id">
                      <ion-item-group side="start">
                          <ion-checkbox v-if="otherCharge.Available" checked="true" slot="end" @click="availableOtherCharge(otherCharge, false)"></ion-checkbox>
                          <ion-checkbox v-else checked="false" slot="end" @click="availableOtherCharge(otherCharge, true)"></ion-checkbox>
                      </ion-item-group>
                      <ion-label style="margin-left: 20px" class="ion-text-wrap">
                          <h2>{{ otherCharge.Name }}</h2>
                          <h3>{{ otherCharge.ProductMin }}-{{ otherCharge.ProductMax }}...{{$t('backoffice.form.fields.price')}}:{{otherCharge.Price}}</h3>
                      </ion-label>
                      <ion-item-group side="end">
                          <ion-button v-if="hasPermission('canEditOtherCharge')" color="primary" @click="editOtherCharge(otherCharge._id)">
                              <ion-icon slot="icon-only" name="create"></ion-icon>
                          </ion-button>
                          <ion-button v-if="hasPermission('canDeleteOtherCharge')" color="danger" @click="deleteOtherCharge(otherCharge._id)">
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

        <!-- <ion-infinite-scroll @ionInfinite="loadMore" threshold="100px" position="bottom">
            <ion-infinite-scroll-content></ion-infinite-scroll-content>
        </ion-infinite-scroll> -->

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
      modelName: 'OtherCharges',
      /****** Form Data ******/
    //   categoryId: null,
      otherCharges: [],
      filterOtherCharges: [],
      products: [],

      paginate: ['languages'],

      spinner: false,
      screenWidth: 0,
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
       this.fetchOtherCharges();
       this.fetchProducts();
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

      this.filterOtherCharges = this.otherCharges
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.otherCharges.filter(item => item.Name.toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterOtherCharges = cat2
        else
          this.filterOtherCharges = this.otherCharges
      });
    },
    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canCreateOtherCharge':
                          res = roles[index].canCreateOtherCharge;
                          break;
                      case 'canEditOtherCharge':
                          res = roles[index].canEditOtherCharge;
                          break;
                      case 'canDeleteOtherCharge':
                          res = roles[index].canDeleteOtherCharge;
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
    fetchOtherCharges: function(){
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
                  // console.log(response.data)
                  this.otherCharges = response.data
                  this.filterOtherCharges = this.otherCharges
                  loading.dismiss()
                })
                .catch(e => {
                    console.log(e);
                    loading.dismiss();
                    this.ifErrorOccured(this.init);
                    // this.ShowMessage('Error', 'Error', 'Fetch other charges');
                });
            })
        })
    },
    fetchProducts: function(){
        Api.fetchAll('Product').then(response => {
          // console.log(response.data)
          this.products = response.data
        })
        .catch(e => {
            // this.ShowMessage('Error', 'Error', 'Fetch product');
            console.log(e);
        });
    },
    // getCategoryNameById: function(id){
    //     var categ = '';
    //     this.categories.forEach(category => {
    //         if (category._id == id) {
    //             categ = category.Name;                
    //         }
    //     });
    //     return categ;
    // },
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
    availableOtherCharge: function(otherCharge, state){
      let item = {
            "_id": otherCharge._id,
            "Name": otherCharge.Name,
            "ProductMin": otherCharge.ProductMin,
            "ProductMax": otherCharge.ProductMax,
            "Price": otherCharge.Price,
            "ProductId": otherCharge.ProductId,
            "Available": state,
        }
        this.spinner = true;
        Api.putIn(this.modelName, item)
              .then(response => {
                    this.ShowMessage(this.$t('backoffice.list.messages.activeOtherCharge'), 
                          this.$t('backoffice.list.messages.otherChargeChangeState'),
                        this.$t('backoffice.list.messages.activeOtherCharge'));
                    this.fetchOtherCharges();
                    this.spinner = false;
                    return response;
              })
              .catch(e => {
                    console.log(e);
                    this.fetchOtherCharges();
                    this.ifErrorOccured(mess => {
                      this.availableOtherCharge(otherCharge, state)
                      this.spinner = false
                      return mess
                    });

              })
    },
    editOtherCharge: function(id){
        this.$router.push({
        name: 'OtherChargeForm', 
        params: { otherChargeId: id }
      });
    },
    deleteOtherCharge: function(id){

        return this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteOtherCharge'),
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
              
                this.spinner = true
                Api.deleteById(this.modelName, id)
                .then(response => {
                  // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                  //     this.$t('backoffice.list.messages.messageDeleteSuccessOtherCharges'),
                  //         this.$t('backoffice.list.messages.deleteSubtitleOtherCharges'));
                    this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessOtherCharges'), "success");
                    this.fetchOtherCharges();
                    this.spinner = false;
                    return response;
                })
                .catch(e => {
                    console.log(e);
                    this.ifErrorOccured(mess => {
                      this.deleteOtherCharge(id)
                      this.spinner = false;
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