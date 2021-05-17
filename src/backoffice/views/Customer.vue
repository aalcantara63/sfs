<template>
  <div id="customer" class="screen">
    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{$t('backoffice.titles.customers')}}</h1>            
            </ion-label>

            <ion-label slot="end">
            <router-link to="/customer-form">
                <ion-chip style="font-size: 30px" outline color="primary" v-if="hasPermission('canCreateCustomer')">
                    <ion-label><ion-icon name="add"></ion-icon></ion-label>
                </ion-chip>
            </router-link>
            </ion-label>
          </ion-toolbar>

          <ion-searchbar  
                @input="handleInput($event.target.value)" @ionClear="filterCustomers = customers"
                :placeholder="$t('frontend.home.search')">           
            </ion-searchbar>
    </ion-header>

    <div v-if="spinner">
        <ion-spinner name="lines" class="spinner"></ion-spinner>
    </div>
    <div v-else>
        <paginate
          name="languages"
          :list="filterCustomers"
          :per="8"
        >
          <ion-list>
            <ion-item-sliding v-for="customer in paginated('languages')" v-bind:key="customer._id">
              <ion-item>
                <ion-label>
                    <h2>{{ customer.Name }}</h2>
                </ion-label>
                <ion-label>
                    <h3>{{ customer.Phone }}</h3>
                    <h3>{{ customer.EmailAddress }}</h3>
                </ion-label>
              </ion-item>
            </ion-item-sliding>
        </ion-list>

      </paginate>

      <paginate-links for="languages" color="primary" 
        :simple="{
          next:'»' ,
          prev: '« ' }"
      ></paginate-links>  

    </div>
  </div>
</template>

<script>

import { Api } from '../api/api.js';

export default {

  name: 'customer',
  created: function(){
   this.fetchCustomers();
  },
  data () {
    return {
      modelName: 'Customer',
      allCustomers: [],
      customers: [],
      orders: [],
      filterCustomers: [],

      paginate: ['languages'],

      spinner: false,
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

      this.filterCustomers = this.customers
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.customers.filter(item => item.Name.toLowerCase().indexOf(query) > -1 ||
                                           item.EmailAddress.toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterCustomers = cat2
        else
          this.filterCustomers = this.customers
      });
    },
    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canCreateCustomer':
                          res = roles[index].canCreateCustomer;
                          break;
                      case 'canEditCustomer':
                          res = roles[index].canEditCustomer;
                          break;
                      case 'canDeleteCustomer':
                          res = roles[index].canDeleteCustomer;
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
    fetchCustomers: function(){
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
                  console.log(response.data)
                  this.allCustomers = response.data
                  
                  this.fetchOrders(loading)
                })
                .catch(e => {
                  console.log(e)
                  loading.dismiss()
                  this.ifErrorOccured(this.fetchCustomers)
                });
            })
        })
    },
    fetchOrders: function(loading){
        Api.fetchAll("order").then(response => {
            this.orders = response.data
            // console.log("All client")
            // console.log(this.allCustomers)
            // console.log("All orders")
            // console.log(this.orders)
            this.orders.forEach(order => {
                if (order.ClientId){
                    for (let index = 0; index < this.allCustomers.length; index++) {
                        let customer = this.allCustomers[index]
                        if (order.ClientId == customer._id && !this.customers.find(c => c._id === customer._id))
                        {
                            this.customers.push(customer)
                            break
                        }
                    }
                }
            });
            this.filterCustomers = this.customers
            loading.dismiss()
        })
        .catch(e => {
            console.log(e)
            loading.dismiss()
        })
    },
    editCustomer: function(id){
        this.$router.push({
        name: 'CustomerForm',
        params: { customerId: id }
      });
    },
    deleteCustomer: function(id){

      return this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteCustomer'),
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
                //                        this.$t('backoffice.list.messages.messageDeleteSuccessCustomer'),
                //                                 this.$t('backoffice.list.messages.deleteSubtitleCustomer'));
                this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessCustomer'), "success");
                this.fetchCustomers();
                this.spinner = false;
                return response;
              })
              .catch(e => {
                console.log(e);
                this.ifErrorOccured(mess => {
                    this.deleteCustomer(id)
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