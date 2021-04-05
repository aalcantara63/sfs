<template>
  <div id="tax" class="screen">

    <!-- <router-link to="/controlPanel"><ion-button expand="full" color="tertiary"><ion-icon name="hammer"></ion-icon>{{$t('backoffice.list.buttons.goToControlPanel')}}</ion-button></router-link>
    <router-link to="/tax-form"><ion-button v-if="hasPermission('canCreateTax')"  expand="full" color="primary"><ion-icon name="add"></ion-icon>{{$t('backoffice.list.actions.addANew')}} {{$t('backoffice.list.entitiesName.tax')}}</ion-button></router-link> -->

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{$t('backoffice.titles.taxes')}}</h1>            
            </ion-label>

            <ion-label slot="end">
            <router-link to="/tax-form">
                <ion-chip style="font-size: 30px" outline color="primary" v-if="hasPermission('canCreateTax')">
                    <ion-label><ion-icon name="add"></ion-icon></ion-label>
                </ion-chip>
            </router-link>
            </ion-label>
          </ion-toolbar>

          <ion-searchbar  
                @input="handleInput($event.target.value)" @ionClear="filterTaxes = taxes"
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
          :list="filterTaxes"
          :per="8"
        >
          <ion-list>
            <ion-item-sliding v-for="tax in paginated('languages')" v-bind:key="tax._id">
              <ion-item>
                <ion-label>
                    <h2>{{ tax.Name }}</h2>
                    <h3>Tax percentage: {{ tax.Percentage }}%</h3>
                    <h3>Tax priority: {{ tax.Priority }}</h3>
                </ion-label>
                <div v-if="hasPermission('canEditTax')">
                    <ion-checkbox v-if="tax.Available" checked="true" slot="end" @click="activeTax(tax, false)"></ion-checkbox>
                    <ion-checkbox v-else checked="false" slot="end" @click="activeTax(tax, true)"></ion-checkbox>
                </div>
                <!-- <ion-label>
                    <ion-checkbox v-if="tax.Available" disabled="true" checked="true"></ion-checkbox>
                    <ion-checkbox v-else disabled="true" checked="false"></ion-checkbox>
                </ion-label> -->
                <span slot="end" class="iconify" data-icon="mdi:backburger" data-inline="false"></span>
              </ion-item>
              
              <ion-item-options side="end">
                <ion-item-option v-if="hasPermission('canEditTax')" color="primary" @click="editTax(tax._id)">
                  <ion-icon slot="icon-only" name="create"></ion-icon>
                </ion-item-option>
                <ion-item-option v-if="hasPermission('canDeleteTax')" color="danger" @click="deleteTax(tax._id)">
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
          :list="filterTaxes"
          :per="8"
        >
          <ion-list>
            <ion-item v-for="tax in paginated('languages')" v-bind:key="tax._id">
                <ion-item-group side="start">
                  <div v-if="hasPermission('canEditTax')">
                      <ion-checkbox v-if="tax.Available" checked="true" slot="end" @click="activeTax(tax, false)"></ion-checkbox>
                      <ion-checkbox v-else checked="false" slot="end" @click="activeTax(tax, true)"></ion-checkbox>
                  </div>
                </ion-item-group>
                <ion-label style="margin-left: 15px">
                    <h2>{{ tax.Name }}</h2>
                    <h3>Tax percentage: {{ tax.Percentage }}%</h3>
                    <h3>Tax priority: {{ tax.Priority }}</h3>
                </ion-label>
                <!-- <ion-label>
                    <ion-checkbox v-if="tax.Available" disabled="true" checked="true"></ion-checkbox>
                    <ion-checkbox v-else disabled="true" checked="false"></ion-checkbox>
                </ion-label> -->
              
              <ion-item-group side="end">
                <ion-button v-if="hasPermission('canEditTax')" color="primary" @click="editTax(tax._id)">
                  <ion-icon slot="icon-only" name="create"></ion-icon>
                </ion-button>
                <ion-button v-if="hasPermission('canDeleteTax')" color="danger" @click="deleteTax(tax._id)">
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

  name: 'tax',
  created: function(){
      this.screenWidth = screen.width;
      this.fetchTaxes();
  },
  data () {
    return {
      modelName: 'Tax',
      taxes: [],
      filterTaxes: [],

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

      this.filterTaxes = this.taxes
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.taxes.filter(item => item.Name.toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterTaxes = cat2
        else
          this.filterTaxes = this.taxes
      });
    },
    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canCreateTax':
                          res = roles[index].canCreateTax;
                          break;
                      case 'canEditTax':
                          res = roles[index].canEditTax;
                          break;
                      case 'canDeleteTax':
                          res = roles[index].canDeleteTax;
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
    fetchTaxes: function(){
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
                  this.taxes = response.data
                  this.filterTaxes = this.taxes
                  loading.dismiss()
                })
                .catch(e => {
                  console.log(e)
                  loading.dismiss()
                  this.ifErrorOccured(this.fetchTaxes)
                });
            })
        })
    },
    activeTax: function(tax, state){
      let item = {
            "_id": tax._id,
            "Name": tax.Name,
            "Available": state,
            "Percentage": tax.Percentage,
        }
        if (tax.EposId){
            item['EposId'] = tax.EposId
        }
        this.spinner = true
        Api.putIn(this.modelName, item)
              .then(response => {
                    // this.ShowMessage(this.$t('backoffice.list.messages.activeTax'), 
                    //   this.$t('backoffice.list.messages.taxChangeState'),
                    //     this.$t('backoffice.list.messages.activeTax'));
                    this.showToastMessage(this.$t('backoffice.list.messages.taxChangeState'), "success");
                    this.fetchTaxes();
                    this.spinner = false;
                    return response;
              })
              .catch(e => {
                    console.log(e);
                    this.fetchTaxes();
                    this.ifErrorOccured(mess => {
                      this.activeTax(tax, state)
                      this.spinner = false
                      return mess
                    });
              })
    },
    editTax: function(id){
        this.$router.push({
        name: 'TaxForm', 
        params: { taxId: id }
      });
    },
    deleteTax: function(id){

        return this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteTax'),
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
                    //   this.$t('backoffice.list.messages.messageDeleteSuccessTax'),
                    //       this.$t('backoffice.list.messages.deleteSubtitleTax'));
                  this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessTax'), "success");
                  this.fetchTaxes();
                  this.spinner = false;
                  return response;
                })
                .catch(e => {
                  console.log(e);
                  this.ifErrorOccured(mess => {
                    this.deleteTax(id)
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