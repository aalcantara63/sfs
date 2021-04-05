<template>
    <div id="ProductForm" class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>
    <!-- <router-link to="/controlPanel"><ion-button expand="full" color="tertiary"><ion-icon name="hammer"></ion-icon>{{$t('backoffice.list.buttons.goToControlPanel')}}</ion-button></router-link>
    <ion-button expand="full" color="tertiary" @click="backToProductList()"><ion-icon name="arrow-round-back"></ion-icon>{{$t('backoffice.form.buttons.backToProductsList')}}</ion-button> -->

    <ion-header>
          <ion-toolbar>
            <ion-item>
                <ion-buttons slot="start">
                <ion-back-button default-href="/controlPanel" @click="goToBack()">
                    </ion-back-button>
                </ion-buttons>
                <ion-label v-if="screenWidth < 600" style="padding: 20px 0px;">
                    <h1>{{title}}</h1>            
                </ion-label>
                <ion-label v-if="screenWidth >= 600" style="padding: 20px 35%;">
                    <h1>{{title}}</h1>            
                </ion-label>

            </ion-item>
            <ion-segment v-if="cType == 'product'" scrollable id="productSegment" @ionChange="segmentChanged($event.target.value)" :value="segmentValue" @input="value=segmentValue">
                <ion-segment-button v-if="cType == 'product'" value="general">
                    <!-- <span class="iconify" data-icon="dashicons:businessman" data-inline="false"></span> -->
                    <span>{{$t('backoffice.form.titles.genaral')}}</span>
                </ion-segment-button>
                <ion-segment-button value="variants">
                    <!-- <span class="iconify" data-icon="mdi:sitemap" data-inline="false"></span> -->
                    <span>{{$t('backoffice.form.titles.variants')}}</span>
                </ion-segment-button>
                <ion-segment-button value="sides">
                    <!-- <span class="iconify" data-icon="ant-design:unordered-list-outlined" data-inline="false"></span> -->
                    <span>{{$t('backoffice.form.titles.sides')}}</span>
                </ion-segment-button>
                <ion-segment-button value="ingredients">
                    <!-- <span class="iconify" data-icon="ant-design:unordered-list-outlined" data-inline="false"></span> -->
                    <span>{{$t('backoffice.form.titles.ingredients')}}</span>
                </ion-segment-button>
            </ion-segment>
          </ion-toolbar>
    </ion-header>
    <br/>

    <!-- <ion-card> -->
    <div v-if="spinner">
        <ion-spinner name="lines" class="spinner"></ion-spinner>
    </div>
    <div v-else>
        <div v-if="general">
            <ion-item>
            <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.name')}}</ion-label>
            <ion-input type="text" name="name"
            @input="name = $event.target.value" 
            v-bind:value="name">
            </ion-input>
            </ion-item>

            <ion-item>
            <ion-label position="floating">{{$t('backoffice.form.fields.description')}}</ion-label>
            <ion-textarea rows="10" name="description" 
            @input="description = $event.target.value" 
            v-bind:value="description"></ion-textarea>
            </ion-item>

            <ion-item v-if="cType == 'service'">
              <ion-label>{{$t('backoffice.form.fields.showServicePrice')}}</ion-label>
              <ion-checkbox slot="end" name="ShowServicePrice" 
                @ionChange="showServicePrice = $event.target.checked"
                :checked="showServicePrice"  >    
              </ion-checkbox>
            </ion-item>

            <ion-item>
            <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.costPrice')}}</ion-label>
            <ion-input type="number" name="costPrice"
            @input="costPrice = $event.target.value" 
            v-bind:value="costPrice">
            </ion-input>
            </ion-item>

            <ion-item>
            <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.salePrice')}}</ion-label>
            <ion-input type="number" name="salePrice"
            @input="salePrice = $event.target.value" 
            v-bind:value="salePrice">
            </ion-input>
            </ion-item>

            <ion-item>
              <ion-card v-if="checkImage()" >
                  <ion-img :src="file"></ion-img>
              </ion-card>
              <ion-card v-else>
                  {{ $t('backoffice.form.titles.imageText')}}
              </ion-card>
              <!-- <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.image')}}</ion-label>
              <ion-input type="file" accept=".jpg,.png,.gif" name="file"
              @change="handleImage">
              </ion-input> -->
            </ion-item>

            <ion-item>
                <div>
                    <ion-label>{{$t('backoffice.form.fields.image')}}</ion-label>
                </div>
                <input type="file" accept="image/png, image/jpeg" @change="handleImage" />
            </ion-item>

            <ion-list>
                <ion-list-header>
                    <ion-label>
                        <span style="color: red">*</span><router-link to="/category">{{$t('backoffice.form.fields.category')}}</router-link>
                    </ion-label>
                </ion-list-header>

                <ion-item>
                    <ion-label>{{$t('backoffice.form.titles.selectACategory')}}</ion-label>
                    <ion-select  :ok-text="$t('backoffice.form.messages.buttons.ok')" :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                    @ionChange="categoryId = $event.target.value" v-bind:value="categoryId">
                        <ion-select-option v-for="category in categories" v-bind:key="category.Id" v-bind:value="category._id" >{{category.Name}}</ion-select-option>
                    </ion-select>
                </ion-item>
            </ion-list>
            <ion-item>
              <ion-label>{{$t('backoffice.form.fields.available')}}</ion-label>
              <ion-checkbox slot="end" name="available" 
                @ionChange="available = $event.target.checked"
                :checked="available"  >    
              </ion-checkbox>
            </ion-item>
        </div>
        <div v-if="variants">
            <div v-if="!addVariant">
                <ion-item>
                    <ion-button color="primary" @click="addVariant=true">+ {{$t('backoffice.form.buttons.addChoice')}}</ion-button>
                </ion-item>
            </div>
            <div v-else style="padding-left: 10%">
                    <ion-item><h2>{{$t('backoffice.form.buttons.addChoice')}}</h2></ion-item>
                    <ion-item>
                        <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.name')}}</ion-label>
                        <ion-input type="text" name="vf_name"
                        @input="vf_name = $event.target.value" 
                        v-bind:value="vf_name">
                        </ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="floating">{{$t('backoffice.form.fields.description')}}</ion-label>
                        <ion-textarea name="vf_description" 
                        @input="vf_description = $event.target.value" 
                        v-bind:value="vf_description">
                        </ion-textarea>
                    </ion-item>
                    <ion-item>
                        <ion-label position="floating">Size</ion-label>
                        <ion-input type="text" name="vf_size"
                        @input="vf_size = $event.target.value" 
                        v-bind:value="vf_size">
                        </ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.costPrice')}}</ion-label>
                        <ion-input type="number" name="vf_costPrice"
                        @input="vf_costPrice = $event.target.value" 
                        v-bind:value="vf_costPrice">
                        </ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.salePrice')}}</ion-label>
                        <ion-input type="number" name="vf_salePrice"
                        @input="vf_salePrice = $event.target.value" 
                        v-bind:value="vf_salePrice">
                        </ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-card v-if="checkImage2()" >
                            <ion-img :src="vf_file"></ion-img>
                        </ion-card>
                        <ion-card v-else>
                            {{ $t('backoffice.form.titles.imageText')}}
                        </ion-card>
                        <!-- <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.image')}}</ion-label>
                        <ion-input type="file" accept=".jpg,.png,.gif" name="vf_file"
                        @change="handleImage">
                        </ion-input> -->
                    </ion-item>
                    <ion-item>
                        <div>
                            <ion-label><span style="color: red">*</span>{{$t('backoffice.form.fields.image')}}</ion-label>
                        </div>
                    <input id="variantImg" type="file" accept="image/png, image/jpeg" @change="handleImage2" />
                    </ion-item>
                    <ion-item>
                        <ion-label>{{$t('backoffice.form.fields.active')}}</ion-label>
                        <ion-checkbox slot="end" name="vf_active" 
                            @ionChange="vf_active = $event.target.checked"
                            :checked="vf_active" >    
                        </ion-checkbox>
                    </ion-item>
                    <ion-item>
                        <ion-button color="primary" @click="save()">{{$t('backoffice.form.buttons.save')}}</ion-button>
                        <ion-button color="danger" @click="clearForm()">{{$t('backoffice.list.messages.buttons.cancel')}}</ion-button>
                    </ion-item>   
            </div>
            <div v-if="variantList.length > 0">
                <ion-item><h2>{{$t('backoffice.form.titles.variants')}}</h2></ion-item>

                <ion-list>
                    <ion-item v-for="variant in variantList" v-bind:key="variantList.indexOf(variant)">
                        <ion-label>
                            <h3>{{variant.Name}}</h3>
                            <h3>Cost price:{{variant.CostPrice}}</h3>
                            <h3>Sale price{{variant.SalePrice}}</h3>
                        </ion-label>
                        <ion-label slot="end">
                            <ion-button color="primary" @click="editVariant(variantList.indexOf(variant))"><ion-icon slot="icon-only" name="create"></ion-icon></ion-button>
                            <ion-button color="danger" @click="deleteVariant(variantList.indexOf(variant))"><ion-icon slot="icon-only" name="trash"></ion-icon></ion-button>
                        </ion-label>
                    </ion-item>
                </ion-list>
            </div>
            <!-- <ion-list v-if="cType == 'product'">
                <ion-list-header>
                    <ion-label>
                        {{$t('backoffice.form.fields.variantGroup')}}
                    </ion-label>
                </ion-list-header>

                <ion-item>
                    <ion-label>{{$t('backoffice.form.titles.selectAVariantGroup')}}</ion-label>
                    <ion-select  :ok-text="$t('backoffice.form.messages.buttons.ok')" :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                    @ionChange="variantGroupId = $event.target.value" v-bind:value="variantGroupId">
                        <ion-select-option v-for="variant in variantGroups" v-bind:key="variant.Id" v-bind:value="variant._id" >{{variant.Name}}</ion-select-option>
                    </ion-select>
                </ion-item>
            </ion-list> -->

        </div>

            <!-- <ion-item > -->
                <!-- <ion-label>{{$t('backoffice.form.fields.qrCode')}}</ion-label> -->
                <!-- <ion-card><qrcode-vue :value="qr" :size=330 level="H"></qrcode-vue></ion-card>
            </ion-item> -->
        <div v-if="sides">
            <ion-item v-if="cType == 'product'">
              <!-- Traducir -->
              <ion-label>{{$t('backoffice.form.fields.haveSides')}}</ion-label> 
              <ion-checkbox slot="end" name="addAgregates" 
                @ionChange="addAgregates = $event.target.checked"
                :checked="addAgregates"  >    
              </ion-checkbox>
            </ion-item>

            <div class="aggregates" v-if="addAgregates && cType == 'product'">

                  <ion-item>
                      <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.cantOfSides')}}</ion-label>
                      <ion-input type="number" name="aggregatesCant"
                      @input="aggregatesCant = $event.target.value" 
                      v-bind:value="aggregatesCant">
                      </ion-input>
                  </ion-item>

                  <ion-list>
                      <ion-list-header>
                          <ion-label>
                            <!-- Traducir -->
                              {{$t('backoffice.form.fields.categoryOfSides')}}
                          </ion-label>
                      </ion-list-header>

                      <ion-item>
                          <ion-label>{{$t('backoffice.form.titles.filterCategory')}}</ion-label>
                          <ion-select  :ok-text="$t('backoffice.form.messages.buttons.ok')" :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                          @ionChange="aggregateCategoryId = changeAggregateCategory($event.target.value)" v-bind:value="aggregateCategoryId">
                              <ion-select-option v-for="category in categories" v-bind:key="category.Id" v-bind:value="category._id" >{{category.Name}}</ion-select-option>
                          </ion-select>
                      </ion-item>
                  </ion-list>

                  <div v-if="aggregateCategoryId != false">
                    <!-- <div> -->
                      <h2>{{$t('backoffice.form.fields.availableProducts')}}</h2>
                      <div>
                          <ion-spinner v-if="spinner" name="lines" class="spinner"></ion-spinner>
                      </div>
                      <ion-list>
                            <ion-item-sliding v-for="product in productByCategory" v-bind:key="product._id">
                                  <ion-item>
                                      <ion-thumbnail slot="start">
                                          <ion-img :src="product.ImageUrl"></ion-img>
                                      </ion-thumbnail>
                                      <ion-label class="ion-text-wrap">
                                          <h2>{{ product.Name }}</h2>
                                      </ion-label>
                                      <ion-label slot="end">
                                          <p>{{ getCategoryNameById(product.CategoryId) }}</p>
                                      </ion-label>
                                  </ion-item>
                                  <ion-item-options side="end">
                                      <ion-item-option color="primary" @click="addProduct(product)">
                                          <ion-icon slot="icon-only" name="add"></ion-icon>
                                      </ion-item-option>
                                  </ion-item-options>
                              </ion-item-sliding>
                      </ion-list>
                  </div>
                  <div v-if="aggregates.length > 0">
                      <h2>{{$t('backoffice.form.fields.selectedAggregates')}}</h2>
                      <ion-list>
                            <ion-item-sliding v-for="product in aggregates" v-bind:key="product._id">
                                  <ion-item>
                                      <ion-thumbnail slot="start">
                                          <ion-img :src="product.ImageUrl"></ion-img>
                                      </ion-thumbnail>
                                      <ion-label class="ion-text-wrap">
                                          <h2>{{ product.Name }}</h2>
                                      </ion-label>
                                      <ion-label slot="end">
                                          <p>{{ getCategoryNameById(product.CategoryId) }}</p>
                                      </ion-label>
                                  </ion-item>
                                  <ion-item-options side="end">
                                      <ion-item-option color="danger" @click="delProduct(product)">
                                          <ion-icon slot="icon-only" name="remove"></ion-icon>
                                      </ion-item-option>
                                  </ion-item-options>
                              </ion-item-sliding>
                      </ion-list>
                  </div>
            </div>
        </div>

        <div v-if="ingredientsB">
            <ion-item v-if="cType == 'product'">
                <!-- Traducir -->
                <ion-label>{{$t('backoffice.form.fields.addIngredients')}}</ion-label>
                <ion-checkbox slot="end" name="addIngredients" 
                  @ionChange="addIngredients = $event.target.checked"
                  :checked="addIngredients"  >    
                </ion-checkbox>
            </ion-item>

            <div v-if="addIngredients && cType == 'product'">

                  <div class="aggregates">
                      <ion-item>
                          <ion-label>{{$t('backoffice.form.fields.typeAnIngredient')}}:</ion-label>
                          <ion-input type="text" name="textIngredient"
                              @input="textIngredient = $event.target.value" 
                              v-bind:value="textIngredient">
                          </ion-input> 
                          <ion-button color="secondary" @click="addIngredient()" v-if="textIngredient != ''"><ion-icon slot="icon-only" name="add"></ion-icon></ion-button>
                      </ion-item>
                      <ion-list>
                          <ion-item v-for="ingredient in ingredients" v-bind:key="ingredients.indexOf(ingredient)">
                            <ion-label>{{ ingredient }}</ion-label>
                            <ion-button color="danger" @click="removeIngredient(ingredients.indexOf(ingredient))"><ion-icon slot="icon-only" name="remove"></ion-icon></ion-button>
                          </ion-item>
                      </ion-list>
                  </div>

            </div>

            <br/>
        </div>
        <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveProduct()">{{ $t('backoffice.form.buttons.save') }}</ion-button>

            <!-- <div v-if="spinner">
              <ion-spinner  name="lines" class="spinner"></ion-spinner>
            </div> -->
        <!-- </ion-card>  -->
    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';
// import QrcodeVue from 'qrcode.vue';

export default {

  name: 'pruductForm',
   
  data () {
    return {
      modelName: 'Product',
       /****** Form Data ******/
      id: null,
      name: '',
      description: '',
      barCode: "",
      costPrice: 0,
      salePrice: 0,
      available: false,
      epos: null,

      showServicePrice: false,

      categoryId: null,
      categories: [],

    //   variantGroupId: null,
    //   variantGroups: [],

      sourceCategoryId: null,
      sourceMenuId: null,

      //Sides
      addAgregates: false,
      aggregateCategoryId : false,
      productByCategory: [],
      aggregatesCant: 0,
      aggregates : [],

      //Ingredients List
      addIngredients: false,
      textIngredient: '',
      ingredients: [],

      file: null,
      fileName: '',
      qr: '',

      cType: '',

      isBackdrop: false,
      spinner: false,

      //Segment
      segmentValue: 'general',
      general: true,
      variants: false,
      sides: false,
      ingredientsB: false,

      //screenwidth
      screenWidth: 0,

      //Variant
      addVariant: false,
      vf_id: -1,
      vf_name: '',
      vf_description: '',
      vf_size: '',
      vf_costPrice: 0,
      vf_salePrice: 0,
      vf_active: false,
      vf_file: null,
      vf_fileName: '',
      vf_qr: '',
      variantGroupId: null,
      variantList: [],
      
    }
  },
//   components: {
//       QrcodeVue,
//   },
  created: function(){
      this.init();
  },
  computed: {
        title() {
            if (this.cType != 'product')
                return this.id ? this.$t('backoffice.form.titles.serviceEditTitle') :  this.$t('backoffice.form.titles.serviceNewTitle');
            else
                return this.id ? this.$t('backoffice.form.titles.productEditTitle') :  this.$t('backoffice.form.titles.productNewTitle');
        }
  },
  methods: {
    segmentChanged(value){            
        console.log(value)
        if(value === 'general'){
            this.general = true
            this.variants = false
            this.sides = false
            this.ingredientsB = false
        }
        if(value === 'variants'){
            this.general = false
            this.variants = true
            this.sides = false
            this.ingredientsB = false
        }  
        if(value === 'sides'){
            this.general = false
            this.variants = false
            this.sides = true
            this.ingredientsB = false            
        }
        if(value === 'ingredients'){
            this.general = false
            this.variants = false
            this.sides = false
            this.ingredientsB = true              
        }
        this.segmentValue = value;
    },
    clearForm(){
        this.addVariant = false
        this.vf_id = -1
        this.vf_name = ''
        this.vf_description = ''
        this.vf_size = ''
        this.vf_costPrice = 0
        this.vf_salePrice = 0
        this.vf_active = false
        this.vf_file = null
        this.vf_fileName = ''
        document.getElementById('variantImg').value = ''
        this.vf_qr = ''
    },
    isValidVariantForm(){
        let errors = [];
        if (this.vf_name == "")
        {
            errors.push(this.$t('backoffice.form.validate.name'));
        }
        if (this.vf_file == null)
        {
            errors.push(this.$t('backoffice.form.validate.image'));
        }
        if (isNaN(this.vf_costPrice))
        {
            errors.push(this.$t('backoffice.form.validate.costPriceNumber'));
        }
        if (isNaN(this.vf_salePrice))
        {
            errors.push(this.$t('backoffice.form.validate.salePriceNumber'));
        }
        if (this.vf_costPrice == 0)
        {
            errors.push(this.$t('backoffice.form.validate.costPriceGreater'));
        }
        if (this.vf_salePrice == 0)
        {
            errors.push(this.$t('backoffice.form.validate.salePriceGreater'));
        }

        if (errors.length > 0)
        {
            let message = "";
            for (let i = 0; i < errors.length; i++) {
                 message += (i + 1) + "- " + errors[i] + "<br/>";
            }
            // this.ShowMessage(this.$t('backoffice.form.validate.validate'),
            //                    message, this.$t('backoffice.form.validate.validateVariantGroup')); // Traducciones
            this.showToastMessage(message, "danger");
            return false;
        }
        else
        {
            return true;
        }
    },
    save(){
        if (this.isValidVariantForm())
        {
            let item = {
                "Name": this.vf_name,
                "Description": this.vf_description,
                "CostPrice": this.vf_costPrice,
                "SalePrice": this.vf_salePrice,
                "Size": this.vf_size,
                "Active": this.vf_active,
            }
            if (this.vf_file != null)
            {
                item["ImageUrl"] = this.vf_file;
                item["ImageName"] = this.vf_fileName;
            }

            if (this.vf_id != -1) // Editing
            {
                this.variantList[this.vf_id].Name = item.Name;
                this.variantList[this.vf_id].Description = item.Description;
                this.variantList[this.vf_id].CostPrice = item.CostPrice;
                this.variantList[this.vf_id].SalePrice = item.SalePrice;
                this.variantList[this.vf_id].Size = item.Size;
                this.variantList[this.vf_id].Active = item.Active;

                if (item.ImageUrl){
                    this.variantList[this.vf_id].ImageUrl = item.ImageUrl;
                    this.variantList[this.vf_id].ImageName = item.ImageName;
                }
                this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessVariant'), "success");
            }
            else{ // Create
                this.variantList.push(item)
                this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessVariant'), "success");
            }

            this.clearForm()
        }
        
    },
    deleteVariant(pos){
        return this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteVariantGroup'), 
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

                this.variantList.splice(pos, 1);
                this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessVariant'), "success");
            }
          }
        ]
      })
      .then(a => a.present());
    },
    editVariant(pos){
        this.addVariant = true
        this.vf_id = pos
        this.vf_name = this.variantList[pos].Name
        this.vf_description = this.variantList[pos].Description
        this.vf_size = this.variantList[pos].Size
        this.vf_costPrice = this.variantList[pos].CostPrice
        this.vf_salePrice = this.variantList[pos].SalePrice
        this.vf_active = this.variantList[pos].Active

        if (this.variantList[pos].ImageUrl){
            this.vf_file = this.variantList[pos].ImageUrl
            this.vf_fileName = this.variantList[pos].ImageName
        }
        
        this.vf_qr = ''
    },
    init(){
        this.screenWidth = screen.width;
        this.id = this.$route.params.productId;
        this.sourceCategoryId = this.$route.params.categoryId;
        this.sourceMenuId = this.$route.params.menuId;
        this.cType = this.$route.params.type || 'product';
        console.log(this.cType);

        this.fetchCategories();
        // this.fetchVariantGroups();
        
        if (this.id){

            this.$ionic.loadingController
            .create({
                cssClass: 'my-custom-class',
                message: this.$t('backoffice.titles.loading'),
                backdropDismiss: true
            })
            .then(loading => {
                loading.present()
                setTimeout(() => {  // Some AJAX call occurs
                    Api.fetchById(this.modelName, this.id)
                    .then(response => {
                        this.name = response.data.Name;
                        this.description = response.data.Description;
                        this.costPrice = response.data.CostPrice;
                        this.salePrice = response.data.SalePrice
                        this.categoryId = response.data.CategoryId;
                        this.barCode = response.data.BarCode;
                        this.file = response.data.ImageUrl;
                        this.available = response.data.Available;
                        if (response.data.VariantGroupId)
                        {
                            this.variantGroupId = response.data.VariantGroupId;
                            console.log(this.variantGroupId)
                            Api.fetchById('VariantGroup', this.variantGroupId)
                            .then(response => {
                                this.variantList = response.data.Variants
                            })
                            .catch(e => {
                                console.log(e)
                            })
                        }
                            
                        this.qr = response.data._id;
                        if (this.cType == 'service')
                            this.showServicePrice = response.data.ShowServicePrice;
                        this.ingredients = response.data.Ingredients;
                        if (this.ingredients.length > 0)
                            this.addIngredients = true;
                        this.aggregatesCant = response.data.AggregateCant;
                        //this.aggregates = response.data.Aggregates;
                        this.fetchAggregatesObj(response.data.Aggregates)
                        if(response.data.Aggregates.length > 0)
                            this.addAgregates = true
                            loading.dismiss();
                        this.epos = response.data.EposId;

                        return response;
                    })
                    .catch(e => {
                        console.log(e);
                        loading.dismiss();
                        this.ifErrorOccured(this.init);
                    }) 
                })
            })  
        }

        console.log(this.$route.params);
    },
    goToBack(){
        if (this.sourceMenuId != null)
        {
            this.$router.push({
                            name: 'ProductByCategory',
                            params: {
                                categoryId: this.categoryId,
                                menuId: this.sourceMenuId
                            }
                        })
        }
        else{
            this.$router.push({ 
                name: 'Product',
                params: {
                    type: this.cType
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
              text: this.$t('backoffice.list.messages.buttons.goToList'),
              handler: () => {
                  this.$router.push({
                      name: 'Product',
                      params: {
                          type: this.cType
                      }
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
    isValidForm(){
        // let errors = [];
        if (this.name == "")
        {
            // errors.push(this.$t('backoffice.form.validate.name'));
            return false
        }
        if (isNaN(this.costPrice))
        {
            // errors.push(this.$t('backoffice.form.validate.costPriceNumber'));
            return false
        }
        if (isNaN(this.salePrice))
        {
            // errors.push(this.$t('backoffice.form.validate.salePriceNumber'));
            return false
        }
        if (this.costPrice == 0)
        {
            // errors.push(this.$t('backoffice.form.validate.costPriceGreater'));
            return false
        }
        if (this.salePrice == 0)
        {
            // errors.push(this.$t('backoffice.form.validate.salePriceGreater'));
            return false
        }
        if (this.categoryId == null)
        {
            // errors.push(this.$t('backoffice.form.validate.category'));
            return false
        }
        // if (this.file == null)
        // {
        //     // errors.push(this.$t('backoffice.form.validate.image'));
        //     return false
        // }

        return true

        // if (errors.length > 0)
        // {
        //     let message = "";
        //     for (let i = 0; i < errors.length; i++) {
        //          message += (i + 1) + "- " + errors[i] + "<br/>";
        //     }
        //     // this.ShowMessage(this.$t('backoffice.form.validate.validate'), message,
        //     //                    this.$t('backoffice.form.validate.validateProduct'));
        //     this.showToastMessage(message, "danger");
        //     return false;
        // }
        // else
        // {
        //     return true;
        // }
    },
    addIngredient(){
        if (this.textIngredient != "" && this.ingredients.indexOf(this.textIngredient) == -1)
        {
            this.ingredients.push(this.textIngredient)
            this.textIngredient = ""
        }
        else{
          this.ShowMessage('Error', 'Error', 'Error')
        }      
    },
    removeIngredient(index){
        this.ingredients.splice(index, 1);
    }, 
    changeAggregateCategory(value){
        this.aggregateCategoryId = value

        this.spinner = true
        Api.getProductsByCategory(this.aggregateCategoryId)
        .then(response => {
            console.log(response.data)
            this.productByCategory = response.data
            this.updateSelectedProduct()
            this.spinner = false
        })
        .catch(e => {
            console.log(e)
            this.spinner = false
        })  
    },
    fetchAggregatesObj(aggregateIds){
      console.log(aggregateIds);
        Api.fetchAll(this.modelName)
          .then(response => { 
              let productAggregates = response.data
              
              aggregateIds.forEach(aggId => {
                 const agg = productAggregates.filter(aggregate => aggregate._id == aggId)
                 agg.forEach(a => {
                    this.aggregates.push(a)
                 })
              })
              console.log(this.aggregates)
          })
          .catch(e => {
              console.log(e)
          })
    },
    updateSelectedProduct(){
        this.aggregates.forEach(aggregate => {
            this.productByCategory = this.productByCategory.filter(product => product._id != aggregate._id) 
        })
    },
    restoreProduct(product){
        this.productByCategory.push(product);
    },
    addProduct(product){
        let index = this.aggregates.indexOf(product);
        if (index == -1)
        {
            this.aggregates.push(product);
        }
        this.updateSelectedProduct();
    },
    delProduct(product){
        let index = this.aggregates.indexOf(product);
        this.aggregates.splice(index, 1);
        this.restoreProduct(product);
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
    /****** Load image use base64 encode esto debería ir en un componente******/
    checkImage: function(){
      return this.file != null;
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
            this.file = e.target.result;
            console.log(this.file);
        };
        reader.readAsDataURL(fileObject);
    },

    checkImage2: function(){
      return this.vf_file != null;
    },
    handleImage2: function(event)
    {
        const selectedImage = event.target.files[0];
        this.vf_fileName = selectedImage.name;
        this.createBase64Img2(selectedImage);
    },
    createBase64Img2: function(fileObject){
        const reader = new FileReader();

        reader.onload = (e) => {
            this.vf_file = e.target.result;
            console.log(this.vf_file);
        };
        reader.readAsDataURL(fileObject);
    },
    /*******          Fin           *******/
    fetchCategories: function(){
        Api.fetchAll('Category').then(response => {
          // console.log(response.data)
          this.categories = response.data
          if (this.cType === 'product')
          {
              this.categories = this.categories.filter(cat => !cat.Service || cat.Service == false)
          }
          else{
              this.categories = this.categories.filter(cat => cat.Service == true)
          }
        })
        .catch(e => {
          console.log(e)
        });
    },
    // fetchVariantGroups: function(){
    //     Api.fetchAll('VariantGroup').then(response => {
    //       // console.log(response.data)
    //       this.variantGroups = response.data
    //     })
    //     .catch(e => {
    //       console.log(e)
    //     });
    // },
    //Create or edit a new product
    saveProduct: async function(){

        // this.spinner = true
        console.log('CategoryId: '+ this.categoryId)

        if (this.isValidForm())
        {
            this.isBackdrop = true;
            let item = {
            "Name": this.name,
            "Description": this.description,
            "CostPrice": this.costPrice,
            "SalePrice": this.salePrice,
            "CategoryId": this.categoryId,
            "ImageUrl": "",
            "Available": this.available,
            "BarCode": "",
            "AggregateCant": 0,
            "Aggregates": [],
            "Ingredients": [],
            "VariantGroupId": null
            }
            if (this.file != null)
            {
              item["ImageUrl"] = this.file;
              item["ImageName"] = this.fileName;
            }
            // if(this.variantGroupId){
            //     item["VariantGroupId"] = this.variantGroupId;
            // }
            if (this.addAgregates)
            {
                  item["AggregateCant"] = this.aggregatesCant;

                  let aggregatesList = [];
                  this.aggregates.forEach(aggregate => {
                      aggregatesList.push(aggregate._id)
                  });
                  item["Aggregates"] = aggregatesList;
            }
            if (this.addIngredients)
            {
                item["Ingredients"] = this.ingredients;
            }
            if (this.cType == 'service')
            {
                item["ShowServicePrice"] = this.showServicePrice;
            }
            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              item['BarCode'] = this.id;
              if (this.epos)
              {
                  item["EposId"] = this.epos;
              }
              this.spinner = true;
              console.log(Api.token);

              //VariantGroup
              console.log("Variant group: " + this.variantGroupId)
              if (this.variantList.length > 0)
              {
                  let itemVG = {
                    "Name": this.name,
                    "Description": this.description,
                    "Variants": this.variantList,
                    }
                  if (this.variantGroupId)
                  {
                      itemVG["_id"] = this.variantGroupId
                      const v = await Api.putIn('VariantGroup', itemVG)
                      console.log("Es esta")
                      console.log(v)
                      if (v.status == 200 && v.statusText === "OK")
                      {
                          item["VariantGroupId"] = this.variantGroupId
                          this.putInProduct(item)
                      }
                        
                  }
                  else{
                      Api.postIn('VariantGroup', itemVG)
                      .then(response => {
                          item["VariantGroupId"] = response.data._id
                          this.putInProduct(item)
                      })
                  }
              }
              else
              {
                  if (this.variantGroupId){
                      item["VariantGroupId"] = null
                      Api.deleteById('VariantGroup', this.variantGroupId)
                  }
                  this.putInProduct(item)
              }

            }
            else{
              //Else, I am created a new category
              this.spinner = true;

              //VariantGroup
              
              //VariantGroup
              
              if (this.variantList.length > 0)
              {
                  let itemVG = {
                    "Name": this.name,
                    "Description": this.description,
                    "Variants": this.variantList,
                    }
                  if (this.variantGroupId)
                  {
                      itemVG["_id"] = this.variantGroupId
                      Api.putIn('variantGroup', itemVG)
                      this.postInProduct(item)
                  }
                  else{
                      Api.postIn('variantGroup', itemVG)
                      .then(response => {
                          console.log('AQUIII')
                          item["VariantGroupId"] = response.data._id
                        //   console.log("ID")
                        //   console.log(item.VariantGroupId)
                          console.log(response)
                          this.postInProduct(item)
                      })
                  }
              }
              else
              {
                  if (this.variantGroupId){
                      item["VariantGroupId"] = null
                      Api.deleteById('variantGroup', this.variantGroupId)
                  }
                  this.postInProduct(item)
              }
            }
        }   
    },
    postInProduct(item){
        Api.postIn(this.modelName, item)
        .then(response => {
            // this.spinner = false;
        //   this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
        //          this.$t('backoffice.list.messages.messageCreateSuccessProduct'), 
        //             this.$t('backoffice.list.messages.titleCreateProduct'));
            this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessProduct'), "success");
            this.name = '';
            this.description = '';
            this.salePrice = 0;
            this.costPrice = 0;
            this.categoryId = null;
            this.file = null;
            this.barCode = '';
            this.available = false;
            this.spinner = false;

            if (this.sourceMenuId != null){
                this.$router.push({
                    name: 'ProductByCategory',
                    params: {
                        categoryId: this.categoryId,
                        menuId: this.sourceMenuId
                    }
                });
            }
            else{
                this.$router.push({
                    name: 'Product',
                    params: {
                        type: this.cType
                    } 
                });
            }

            return response;
        })
        .catch(e => {
            this.isBackdrop = false;
            console.log(e);
            this.spinner = false;
            this.ifErrorOccured(this.saveProduct);
        })
    },
    putInProduct(item){
        Api.putIn(this.modelName, item)
        .then(response => {
            // this.spinner = false;
            // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
            //      this.$t('backoffice.list.messages.messageEditSuccessProduct'), 
            //         this.$t('backoffice.list.messages.titleEditProduct'));
            this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessProduct'), "success");
            this.name = '';
            this.description = '';
            this.salePrice = 0;
            this.costPrice = 0;
            this.categoryId = null;
            this.file = null;
            this.barCode = '';
            this.available = false;
            this.spinner = false;

            if (this.sourceMenuId != null){
                this.$router.push({
                    name: 'ProductByCategory',
                    params: {
                        categoryId: this.categoryId,
                        menuId: this.sourceMenuId
                    }
                });
            }
            else{
                this.$router.push({
                    name: 'Product',
                    params: {
                        type: this.cType
                    }
                });
            }

            
            return response;
        })
        .catch(e => {
            this.isBackdrop = false;
            console.log(e);
            this.spinner = false;
            this.ifErrorOccured(this.saveProduct);
        })
    },
    backToProductList: function(){
        if (this.sourceCategoryId && this.sourceMenuId)
        {
            this.$router.push({
                name: 'ProductByCategory', 
                params: {
                          categoryId: this.sourceCategoryId,
                          menuId: this.sourceMenuId,
                        }
            });
        }
        else{
            this.$router.push({
              name: 'Product',
              params: {
                  type: this.cType
              } 
            });
        }
    }
    /**************** Support Methods ****************/
    //  editCategory: function(id, name, description){
    //     this.isEditing = true;
    //     this.editingId = id;
    //     this.name = name;
    //     this.description = description;
    //     this.file = null;
    //  },
    //  clearCategory: function(){
    //     this.isEditing = false;
    //     this.editingId = null;
    //     this.name = '';
    //     this.description = '';
    //     this.file = null;
    //  },
  },

}
    
</script>
<style>

.spinner {
    
    display: inline-block;
    position: relative;
    width: 70px;
    height: 70px;
    color: var(--color);
    user-select: none;
}

div.aggregates{

  margin-left: 5%;
  margin-right: 5%;

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