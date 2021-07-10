<template>

    <div>
        <div>
                <!-- <ion-item> -->
                    <div style="display: flex;">
                        <ion-select style="border: 1px solid darkred; margin-left:5px; border-radius: 3px" interface="popover" icon="add"
                            :ok-text="$t('backoffice.form.messages.buttons.ok')"
                            :cancel-text="$t('backoffice.form.messages.buttons.dismiss')" 
                            :value="adsType"
                            placeholder="Select an Ads type"
                            @ionChange="adsType = $event.target.value">
                                <ion-select-option key="menu" value="menu">Menu</ion-select-option>
                                <ion-select-option key="image" value="image">Image</ion-select-option>
                                <ion-select-option key="video" value="video">Video</ion-select-option>
                                <ion-select-option key="map" value="map">Map</ion-select-option>
                                <ion-select-option key="url" value="url">Url</ion-select-option>
                        </ion-select>
                        <ion-input v-if="adsType == 'video' || adsType == 'menu' || adsType == 'image' || adsType == 'map' || adsType == 'url'" style="border: 1px solid darkred; margin-left:5px; border-radius: 3px" placeholder="Name" type="text" @input="adsname = $event.target.value" :value="adsname"></ion-input>
                        <ion-select v-if="adsType == 'menu'" style="border: 1px solid darkred; margin-left:5px; border-radius: 3px" interface="popover" icon="add"
                            :ok-text="$t('backoffice.form.messages.buttons.ok')"
                            :cancel-text="$t('backoffice.form.messages.buttons.dismiss')" 
                            :value="adsMenu"
                            placeholder="Select an Ads type"
                            @ionChange="adsMenu = $event.target.value; adsname = getMenuNameFromId(val)">
                                <ion-select-option v-for="menu in menus" v-bind:key="menu.Id" v-bind:value="menu._id" >{{menu.Name}}</ion-select-option>
                        </ion-select>
                        <ion-input v-if="adsType == 'video'" style="border: 1px solid darkred; margin-left:5px; border-radius: 3px" placeholder="Video link" type="text" @input="adsVideo = $event.target.value" :value="adsVideo"></ion-input>
                        <ion-input v-if="adsType == 'map'" style="border: 1px solid darkred; margin-left:5px; border-radius: 3px" placeholder="Map link" type="text" @input="adsMap = $event.target.value" :value="adsMap"></ion-input>
                        <ion-input v-if="adsType == 'url'" style="border: 1px solid darkred; margin-left:5px; border-radius: 3px" placeholder="Url link" type="text" @input="adsUrl = $event.target.value" :value="adsUrl"></ion-input>
                    
                        <ion-item-group side="end">
                            <ion-button color="primary" @click="addAds()">
                                <ion-icon slot="icon-only" name="add"></ion-icon>
                            </ion-button>
                        </ion-item-group>
                    </div>
                    <div v-if="adsType == 'image'" style="margin-left:15px; margin-top: 20px">
                        <div>
                            <input type="file" accept="image/png, image/jpeg" @change="handleImage" />
                        </div>
                    </div>
                    <div v-if="adsType == 'image'">                            
                        <ion-card v-if="checkImage()" >
                            <ion-img :src="adsImage"></ion-img>
                        </ion-card>
                        <ion-card v-else>
                            {{ $t('backoffice.form.titles.imageText')}}
                        </ion-card>
                    </div>
                <!-- </ion-item> -->
                <br />
                <ion-list>
                    <ion-item v-for="ads in adsList" v-bind:key="adsList.indexOf(ads)">
                        <ion-label>{{ads.Type}}</ion-label>
                        <ion-label>{{ads.Name}}</ion-label>
                        <ion-label v-if="ads.Type != 'menu' && ads.Type != 'image'">{{ads.Value}}</ion-label>
                        <ion-label v-if="ads.Type == 'menu'">{{ads.Name}}</ion-label>
                        <ion-label v-if="ads.Type == 'image'">
                            <ion-thumbnail>
                                <ion-img :src="ads.Value"></ion-img>
                            </ion-thumbnail>
                        </ion-label>
                        <ion-item-group side="end">
                            <ion-button color="danger" @click="deleteAds(ads)">
                                <ion-icon slot="icon-only" name="trash"></ion-icon>
                            </ion-button>
                        </ion-item-group>
                    </ion-item>
                </ion-list>
                <br />
                <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="save()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
            </div>
    </div>
    
</template>

<script>
import { Api } from '../api/api';
export default {
    name: 'ManageAds',
    data(){

        return{
            // restaurantId: this.$store.state.user.RestaurantId,
            // restaurant: null,

            setting: null,

            adsType: 'select',
            adsname: '',

            adsMenu: '',
            menus: [],
            adsImage: null,
            adsVideo: '',
            adsMap: '',
            adsUrl: '',
            adsList: [],
        }

    },
    created(){
        Api.fetchAll('Menu')
        .then(response => {
            this.menus = response.data

        })
        .catch(e => {
            console.log(e)
        })
        this.init()
    },
    methods:{
        init(){

            Api.fetchAll('Setting')
            .then(response => {
                if (response.data.length > 0)
                {
                    // this.settingId = response.data[0]._id
                    this.setting = response.data[0]
                    this.adsList = this.setting.Ads
                }
            })
            .catch(e => {
                console.log(e)
            })

            // Api.fetchById('Restaurant', this.restaurantId)
            // .then(response => {
            //     this.restaurant = response.data
            //     if (this.restaurant.Ads)
            //         this.adsList = this.restaurant.Ads
            // })
            // .catch(e => {
            //     console.log(e)
            // })
        },
        // getMenuNameFromId(id){
        //     const menu = this.menus.find(m => m._id == id)
        //     return menu.Name

        // },
        checkImage(){
            return this.adsImage != null;
        },
        handleImage: function(event)
        {
            const selectedImage = event.target.files[0];
            this.fileName = selectedImage.name;
            this.createBase64Img(selectedImage);
        },
        createBase64Img: function(fileObject){
            const reader = new FileReader();

            reader.onload = (e) => {
                this.adsImage = e.target.result;
            };
            reader.readAsDataURL(fileObject);
        },
        clearFields(){
            this.adsMenu = ''
            this.adsImage = null
            this.adsVideo = ''
            this.adsMap = ''
            this.adsUrl = ''
        },
        addAds(){
            let val = ''
            // let name = ''
            if (this.adsType == 'menu'){
                val = this.adsMenu
                // name = this.getMenuNameFromId(val)
            }
            if (this.adsType == 'image'){
                val = this.adsImage
            }
            if (this.adsType == 'video'){
                val = this.adsVideo
            }
            if (this.adsType == 'map'){
                val = this.adsMap
            }
            if (this.adsType == 'url'){
                val = this.adsUrl
            }
            let ads = {
                "Type": this.adsType,
                "Value": val,
                "Name": this.adsname
            }
            this.adsList.push(ads)
            this.clearFields()
        },
        deleteAds(ads){
            console.log(ads)
            const index = this.adsList.indexOf(ads)
            this.adsList.splice(index, 1)
        },
        isValidForm(){
            return true;
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
        async save(){
            // const restaurantId = this.$store.state.user.RestaurantId
            // let restaurant = await Api.fetchById('Restaurant', this.restaurantId)

            this.setting.Ads = this.adsList
            Api.putIn('Setting', this.setting)
            .then(() => {
                this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessSetting'), "success");
            })  
            .catch(e => {
                console.log(e)
            })
        },


    }

}
</script>