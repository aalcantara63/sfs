<template>
  <div id="menu" class="screen">

         <modal name="my-first-modal" height="80%">
            <ion-header>
            <ion-toolbar>
                <ion-title>Menu Qr</ion-title>
            </ion-toolbar>
            </ion-header>

            <div style="    margin-top: 50px;">            
            <qrcode-vue :value="qrMenu" :size=280 level="H"></qrcode-vue>
             <ion-button style="text-align: center; padding: 5px 20px;" @click="printQr()"  >
              <span class="iconify" data-icon="ic:round-local-printshop" data-inline="false"></span>
              <ion-spinner v-if="spinnerPrint" name="dots"></ion-spinner></ion-button>
            </div>
        </modal>

    <!-- <router-link to="/controlPanel"><ion-button expand="full" color="tertiary"><ion-icon name="hammer"></ion-icon>{{$t('backoffice.list.buttons.goToControlPanel')}}</ion-button></router-link> -->
    <!-- <router-link to="/menu-form"><ion-button v-if="hasPermission('canCreateMenu')" expand="full" color="primary"><ion-icon name="add"></ion-icon>{{$t('backoffice.list.actions.addANew')}} {{$t('backoffice.list.entitiesName.menu')}}</ion-button></router-link> -->
    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{$t('backoffice.titles.menus')}}</h1>            
            </ion-label>

            <ion-label slot="end">
            <router-link to="/menu-form">
                <ion-chip style="font-size: 30px" outline color="primary" v-if="hasPermission('canCreateMenu')">
                    <ion-label><ion-icon name="add"></ion-icon></ion-label>
                </ion-chip>
            </router-link>
            </ion-label>
             <ion-label slot="end">            
                <ion-chip style="font-size: 30px" outline color="primary" 
                @click="show()" v-tooltip="'Show Menu Qr'">
                    <ion-label> <span class="iconify" data-icon="ion:qr-code-sharp" data-inline="false"></span></ion-label>
                </ion-chip>
          
            </ion-label>
          </ion-toolbar>

          <ion-searchbar  
                @input="handleInput($event.target.value)" @ionClear="filterMenu = menus"
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
              :list="filterMenu"
              :per="8"
            >
              <ion-list>
                <ion-item-sliding v-for="menu in paginated('languages')" v-bind:key="menu._id">
                  <ion-item style="width: 100%;">
                    <ion-label>
                        <h2>{{ menu.Name }}</h2>
                        <!-- <h3>{{ getFormatedDate(menu.Date) }}</h3> -->
                    </ion-label>
                    <ion-checkbox v-if="menu.Active" checked="true" slot="end" @click="activeMenu(menu, false)"></ion-checkbox>
                    <ion-checkbox v-else checked="false" slot="end" @click="activeMenu(menu, true)"></ion-checkbox>
                    <div slot="end"><ion-icon slot="icon-only" name="arrowDropleft"></ion-icon></div>
                    <span slot="end" class="iconify" data-icon="mdi:backburger" data-inline="false"></span>
                  </ion-item>
                  
                  <ion-item-options side="end">
                    <ion-item-option v-if="hasPermission('canEditMenu')" color="primary" @click="editMenu(menu._id)">
                      <ion-icon slot="icon-only" name="create"></ion-icon>
                    </ion-item-option>
                    <ion-item-option v-if="hasPermission('canDeleteMenu')" color="danger" @click="deleteMenu(menu._id)">
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
              :list="filterMenu"
              :per="8"
            >
              <ion-list>
                <ion-item  v-for="menu in paginated('languages')" v-bind:key="menu._id">
                  <ion-item-group side="start">
                      <ion-checkbox v-if="menu.Active" checked="true" slot="end" @click="activeMenu(menu, false)"></ion-checkbox>
                      <ion-checkbox v-else checked="false" slot="end" @click="activeMenu(menu, true)"></ion-checkbox>
                  </ion-item-group>
                  <ion-label style="margin-left: 15px">
                      <h2>{{ menu.Name }}</h2>
                      <!-- <h3>{{ getFormatedDate(menu.Date) }}</h3> -->
                  </ion-label>
                  <ion-item-group side="end">
                    <ion-button v-if="hasPermission('canEditMenu')" color="primary" @click="editMenu(menu._id)">
                      <ion-icon slot="icon-only" name="create"></ion-icon>
                    </ion-button>
                    <ion-button v-if="hasPermission('canDeleteMenu')" color="danger" @click="deleteMenu(menu._id)">
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
import { Utils } from '../utils/utils.js'
import QrcodeVue from 'qrcode.vue';

export default {

  name: 'menu',
  created: function(){
   this.fetchMenus();
   this.screenWidth = screen.width;
  },
  data () {
    return {
      modelName: 'Menu',
      menus: [],

      filterMenu: [],

      paginate: ['languages'],

      spinner: false,
      screenWidth : 0,
      qrMenu: `https://imenuapps.net/?menu=${this.$store.state.user.RestaurantId}`,    
      spinnerPrint: false,
    }
  }, 
  components: {
      QrcodeVue,
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
    show () {
      console.log(this.qrMenu)
      this.$modal.show('my-first-modal');
        },
    
    hide () {
      this.$modal.hide('my-first-modal');
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

      this.filterMenu = this.menus
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.menus.filter(item => item.Name.toLowerCase().indexOf(query) > -1 ||
                                          item.Date.indexOf(query) > -1 )
        if(cat2.length> 0)
          this.filterMenu = cat2
        else
          this.filterMenu = this.menus
      });
    },
    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canCreateMenu':
                          res = roles[index].canCreateMenu;
                          break;
                      case 'canEditMenu':
                          res = roles[index].canEditMenu;
                          break;
                      case 'canDeleteMenu':
                          res = roles[index].canDeleteMenu;
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
    fetchMenus: function(){
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
                  this.menus = response.data
                  this.filterMenu = this.menus
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
    getFormatedDate: function(date){
        return Utils.getFormatedDate(date);         
    },
    activeMenu: function(menu, state){
      let item = {
            "_id": menu._id,
            "Name": menu.Name,
            "Active": state,
            "Categories": menu.Categories,
            "Date": menu.Date,
        }
        this.spinner = true;
        Api.putIn(this.modelName, item)
              .then(response => {
                    // this.ShowMessage(this.$t('backoffice.list.messages.activeMenu'), 
                    //                     this.$t('backoffice.list.messages.menuChangeState'),
                    //                         this.$t('backoffice.list.messages.activeMenu'));
                    this.showToastMessage(this.$t('backoffice.list.messages.menuChangeState'), "success");
                    this.fetchMenus();
                    this.spinner = false;
                    return response;
              })
              .catch(e => {
                    console.log(e);
                    this.fetchMenus();
                    this.ifErrorOccured(mess => {
                        this.activeMenu(menu, state)
                        this.spinner = false
                        return mess
                    });

              })
    },
    editMenu: function(id){
        this.$router.push({
        name: 'MenuForm', 
        params: { menuId: id }
      });
    },
    deleteMenu: function(id){

      return this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteMenu'),
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
                  //                       this.$t('backoffice.list.messages.messageDeleteSuccessMenu'),
                  //                             this.$t('backoffice.list.messages.deleteSubtitleMenu'));
                  this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessMenu'), "success");
                  this.fetchMenus();
                  this.spinner = false;
                  return response;
                })
                .catch(e => {
                  console.log(e);
                  this.ifErrorOccured(mess => {
                      this.deleteMenu(id)
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

    async printQr(){

      try {
        this.spinnerPrint = true;
        const response = await Api.fetchById("Restaurant", this.$store.state.user.RestaurantId)         
        if(response.status === 200){
          const name = response.data.Name;
          let qrList = document.getElementsByTagName('canvas')
          let dataUrl = qrList[0].toDataURL();

          var html =' <html><head>';    
          html +='<style> .progressBar { width: 100%;  border-bottom: 1px solid black;display: list-item;list-style: unset; padding: 0}';
          html += '.progressBar li {list-style-type: none; float: left; position: relative; text-align: center; margin:0}';
          html += '.progressBar li .before {content: " "; line-height: 30px; border-radius: 50%; width: 30px; height: 30px; border: 1px solid #ddd;';
          html += 'display: block;text-align: center;margin: 0 auto 10px;background-color: white}';
          html += '.progressBar li .after { content: "";position: absolute;width: 100%;height: 4px;background-color: #ddd;top: 15px;left: -50%;z-index: -1;}';
          html += '.progressBar li .one .after {content: none;}.progressBar li.active {color: black;}';
          html += '.progressBar li.active .before { border-color: #63ee68; background-color: #63ee68}.progressBar .active:after {background-color: #4ca44f;} </style>';
          
          html += '</head><body><div >';
          html += '<table  align=center style="width: 90%;">';
          html += `<div style="text-align:center"><h4 >Menu Qr "${name}"</h4>`;
          html += `<img src="${dataUrl}" style="width: 50%; margin: 0px auto"></img> <div>`;  
            html += `</table></div></body></html>`;
          
          var winimp = window.open('/print', 'popimpr');
          winimp.document.open();
          winimp.document.write( html );
          winimp.document.close();
          winimp.focus();
          winimp.print();
          winimp.close();
          this.spinnerPrint = false;

        }
         this.spinnerPrint = false;
      } catch (error) {
        console.log(error); 
         this.spinnerPrint = false;       
      }

     

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