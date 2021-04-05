<template>
    <div class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>
    <!-- <router-link to="/controlPanel"><ion-button expand="full" color="tertiary"><ion-icon name="hammer"></ion-icon>{{$t('backoffice.list.buttons.goToControlPanel')}}</ion-button></router-link>
    <router-link to="/role"><ion-button expand="full" color="tertiary"><ion-icon name="arrow-round-back"></ion-icon>{{$t('backoffice.form.buttons.backToRolesList')}}</ion-button></router-link> -->

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'Role'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{title}}</h1>            
            </ion-label>
          </ion-toolbar>
    </ion-header>
    <br/>

      <!-- <ion-card> -->
    <div v-if="spinner">
        <ion-spinner name="lines" class="spinner"></ion-spinner>
    </div>
    <div v-else>
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.name')}}</ion-label>
          <ion-input type="text" name="name"
          @input="name = $event.target.value" 
          v-bind:value="name">
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">{{$t('backoffice.form.fields.description')}}</ion-label>
          <ion-textarea name="description" 
          @input="description = $event.target.value" 
          v-bind:value="description">
          </ion-textarea>
        </ion-item>
        <!-- <ion-item>
            <p>{{$t('backoffice.form.fields.permissions')}}</p>
            <ion-checkbox color="danger" slot="end" @ionChange="selectDeselectAll($event.target.checked)" 
            ></ion-checkbox>
        </ion-item> -->
        <ion-item>
            <p>{{$t('backoffice.form.fields.permissions')}}</p>
            <ion-chip slot="end" :color="all_color" @click="selectDeselectAll()">
                <ion-icon name="checkmark-circle"></ion-icon>
                <ion-label>{{all_title}}</ion-label>
            </ion-chip>
        </ion-item>

        <!-- <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionMenu')}}</p>
            <ion-checkbox color="success" slot="end" @ionChange="selectDeselectMenu($event.target.checked)"
                ></ion-checkbox>
        </ion-item> -->
        <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionMenu')}}</p>
            <ion-chip slot="end" :color="menu_color" @click="selectDeselectMenu()">
                <ion-icon name="checkmark-circle"></ion-icon>
                <ion-label>{{menu_title}}</ion-label>
            </ion-chip>
        </ion-item>
        <ion-list>
            <ion-item v-for="permission in menuPermissions" v-bind:key="permission.val">
            <ion-label>{{permission.val}}</ion-label>
            <ion-checkbox
                slot="end"
                @ionChange="permission.isChecked=$event.target.checked"
                :checked="permission.isChecked">
            </ion-checkbox>
            </ion-item>
        </ion-list>

        <!-- <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionCategory')}}</p>
            <ion-checkbox color="success" slot="end" @ionChange="selectDeselectCategory($event.target.checked)"
                :checked="category"></ion-checkbox>
        </ion-item> -->
        <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionCategory')}}</p>
            <ion-chip slot="end" :color="category_color" @click="selectDeselectCategory()">
                <ion-icon name="checkmark-circle"></ion-icon>
                <ion-label>{{category_title}}</ion-label>
            </ion-chip>
        </ion-item>
        <ion-list>
            <ion-item v-for="permission in categoryPermissions" v-bind:key="permission.val">
            <ion-label>{{permission.val}}</ion-label>
            <ion-checkbox
                slot="end"
                @ionChange="permission.isChecked=$event.target.checked"
                :checked="permission.isChecked">
            </ion-checkbox>
            </ion-item>
        </ion-list>

        <!-- <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionProduct')}}</p>
            <ion-checkbox color="success" slot="end" @ionChange="selectDeselectProduct($event.target.checked)"
                :checked="product"></ion-checkbox>
        </ion-item> -->
        <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionProduct')}}</p>
            <ion-chip slot="end" :color="product_color" @click="selectDeselectProduct()">
                <ion-icon name="checkmark-circle"></ion-icon>
                <ion-label>{{product_title}}</ion-label>
            </ion-chip>
        </ion-item>
        <ion-list>
            <ion-item v-for="permission in productPermissions" v-bind:key="permission.val">
            <ion-label>{{permission.val}}</ion-label>
            <ion-checkbox
                slot="end"
                @ionChange="permission.isChecked=$event.target.checked"
                :checked="permission.isChecked">
            </ion-checkbox>
            </ion-item>
        </ion-list>

        reservationPermissions
        <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionReservation')}}</p>
            <ion-chip slot="end" :color="reservation_color" @click="selectDeselectReservation()">
                <ion-icon name="checkmark-circle"></ion-icon>
                <ion-label>{{reservation_title}}</ion-label>
            </ion-chip>
        </ion-item>
        <ion-list>
            <ion-item v-for="permission in reservationPermissions" v-bind:key="permission.val">
            <ion-label>{{permission.val}}</ion-label>
            <ion-checkbox
                slot="end"
                @ionChange="permission.isChecked=$event.target.checked"
                :checked="permission.isChecked">
            </ion-checkbox>
            </ion-item>
        </ion-list>
        <!-- <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionVariantGroup')}}</p>
            <ion-checkbox color="success" slot="end" @ionChange="selectDeselectVariantGroup($event.target.checked)"
                :checked="variantGroup"
            ></ion-checkbox>
        </ion-item> -->
        <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionVariantGroup')}}</p>
            <ion-chip slot="end" :color="variant_color" @click="selectDeselectVariantGroup()">
                <ion-icon name="checkmark-circle"></ion-icon>
                <ion-label>{{variant_title}}</ion-label>
            </ion-chip>
        </ion-item>
        <ion-list>
            <ion-item v-for="permission in variantGroupPermissions" v-bind:key="permission.val">
            <ion-label>{{permission.val}}</ion-label>
            <ion-checkbox
                slot="end"
                @ionChange="permission.isChecked=$event.target.checked"
                :checked="permission.isChecked"
                >
            </ion-checkbox>
            </ion-item>
        </ion-list>

        <!-- <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionCustomer')}}</p>
            <ion-checkbox color="success" slot="end" @ionChange="selectDeselectCustomer($event.target.checked)"
                :checked="customer"
                ></ion-checkbox>
        </ion-item> -->
        <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionCustomer')}}</p>
            <ion-chip slot="end" :color="customer_color" @click="selectDeselectCustomer()">
                <ion-icon name="checkmark-circle"></ion-icon>
                <ion-label>{{customer_title}}</ion-label>
            </ion-chip>
        </ion-item>
        <ion-list>
            <ion-item v-for="permission in customerPermissions" v-bind:key="permission.val">
            <ion-label>{{permission.val}}</ion-label>
            <ion-checkbox
                slot="end"
                @ionChange="permission.isChecked=$event.target.checked"
                :checked="permission.isChecked"
                >
            </ion-checkbox>
            </ion-item>
        </ion-list>

        <!-- <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionTable')}}</p>
            <ion-checkbox color="success" slot="end" @ionChange="selectDeselectTable($event.target.checked)"
                :checked="table"></ion-checkbox>
        </ion-item> -->
        <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionTable')}}</p>
            <ion-chip slot="end" :color="table_color" @click="selectDeselectTable()">
                <ion-icon name="checkmark-circle"></ion-icon>
                <ion-label>{{table_title}}</ion-label>
            </ion-chip>
        </ion-item>
        <ion-list>
            <ion-item v-for="permission in tablePermissions" v-bind:key="permission.val">
            <ion-label>{{permission.val}}</ion-label>
            <ion-checkbox
                slot="end"
                @ionChange="permission.isChecked=$event.target.checked"
                :checked="permission.isChecked"
                >
            </ion-checkbox>
            </ion-item>
        </ion-list>

        <!-- <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionTax')}}</p>
            <ion-checkbox color="success" slot="end" @ionChange="selectDeselectTax($event.target.checked)"
                :checked="tax"
            ></ion-checkbox>
        </ion-item> -->
        <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionTax')}}</p>
            <ion-chip slot="end" :color="tax_color" @click="selectDeselectTax()">
                <ion-icon name="checkmark-circle"></ion-icon>
                <ion-label>{{tax_title}}</ion-label>
            </ion-chip>
        </ion-item>
        <ion-list>
            <ion-item v-for="permission in taxPermissions" v-bind:key="permission.val">
            <ion-label>{{permission.val}}</ion-label>
            <ion-checkbox
                slot="end"
                @ionChange="permission.isChecked=$event.target.checked"
                :checked="permission.isChecked"
                >
            </ion-checkbox>
            </ion-item>
        </ion-list>

        <!-- <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionShipping')}}</p>
            <ion-checkbox color="success" slot="end" @ionChange="selectDeselectShipping($event.target.checked)"
                :checked="shipping"
                ></ion-checkbox>
        </ion-item> -->
        <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionShipping')}}</p>
            <ion-chip slot="end" :color="shipping_color" @click="selectDeselectShipping()">
                <ion-icon name="checkmark-circle"></ion-icon>
                <ion-label>{{shipping_title}}</ion-label>
            </ion-chip>
        </ion-item>
        <ion-list>
            <ion-item v-for="permission in shippingPermissions" v-bind:key="permission.val">
            <ion-label>{{permission.val}}</ion-label>
            <ion-checkbox
                slot="end"
                @ionChange="permission.isChecked=$event.target.checked"
                :checked="permission.isChecked">
            </ion-checkbox>
            </ion-item>
        </ion-list>

        <!-- <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionOtherCharge')}}</p>
            <ion-checkbox color="success" slot="end" @ionChange="selectDeselectOtherCharge($event.target.checked)"
                :checked="otherCharge"
                ></ion-checkbox>
        </ion-item> -->
        <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionOtherCharge')}}</p>
            <ion-chip slot="end" :color="otherCharge_color" @click="selectDeselectOtherCharge()">
                <ion-icon name="checkmark-circle"></ion-icon>
                <ion-label>{{otherCharge_title}}</ion-label>
            </ion-chip>
        </ion-item>
        <ion-list>
            <ion-item v-for="permission in otherChargePermissions" v-bind:key="permission.val">
            <ion-label>{{permission.val}}</ion-label>
            <ion-checkbox
                slot="end"
                @ionChange="permission.isChecked=$event.target.checked"
                :checked="permission.isChecked">
            </ion-checkbox>
            </ion-item>
        </ion-list>

        <!-- <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionUser')}}</p>
            <ion-checkbox color="success" slot="end" @ionChange="selectDeselectUser($event.target.checked)"
                :checked="user"
                ></ion-checkbox>
        </ion-item> -->
        <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionUser')}}</p>
            <ion-chip slot="end" :color="user_color" @click="selectDeselectUser()">
                <ion-icon name="checkmark-circle"></ion-icon>
                <ion-label>{{user_title}}</ion-label>
            </ion-chip>
        </ion-item>
        <ion-list>
            <ion-item v-for="permission in userPermissions" v-bind:key="permission.val">
            <ion-label>{{permission.val}}</ion-label>
            <ion-checkbox
                slot="end"
                @ionChange="permission.isChecked=$event.target.checked"
                :checked="permission.isChecked">
            </ion-checkbox>
            </ion-item>
        </ion-list>

        <!-- <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionOccupation')}}</p>
            <ion-checkbox color="success" slot="end" @ionChange="selectDeselectOccupation($event.target.checked)"
                :checked="occupation"></ion-checkbox>
        </ion-item> -->
        <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionOccupation')}}</p>
            <ion-chip slot="end" :color="occupation_color" @click="selectDeselectOccupation()">
                <ion-icon name="checkmark-circle"></ion-icon>
                <ion-label>{{occupation_title}}</ion-label>
            </ion-chip>
        </ion-item>
        <ion-list>
            <ion-item v-for="permission in occupationPermissions" v-bind:key="permission.val">
            <ion-label>{{permission.val}}</ion-label>
            <ion-checkbox
                slot="end"
                @ionChange="permission.isChecked=$event.target.checked"
                :checked="permission.isChecked">
            </ion-checkbox>
            </ion-item>
        </ion-list>

        <!-- <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionRole')}}</p>
            <ion-checkbox color="success" slot="end" @ionChange="selectDeselectRole($event.target.checked)"
                :checked="role"
                ></ion-checkbox>
        </ion-item> -->
        <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionRole')}}</p>
            <ion-chip slot="end" :color="role_color" @click="selectDeselectRole()">
                <ion-icon name="checkmark-circle"></ion-icon>
                <ion-label>{{role_title}}</ion-label>
            </ion-chip>
        </ion-item>
        <ion-list>
            <ion-item v-for="permission in rolePermissions" v-bind:key="permission.val">
            <ion-label>{{permission.val}}</ion-label>
            <ion-checkbox
                slot="end"
                @ionChange="permission.isChecked=$event.target.checked"
                :checked="permission.isChecked"
                >
            </ion-checkbox>
            </ion-item>
        </ion-list>

        <!-- <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionOrder')}}</p>
            <ion-checkbox color="success" slot="end" @ionChange="selectDeselectOrder($event.target.checked)"
                :checked="order"
            ></ion-checkbox>
        </ion-item> -->
        <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionOrder')}}</p>
            <ion-chip slot="end" :color="order_color" @click="selectDeselectOrder()">
                <ion-icon name="checkmark-circle"></ion-icon>
                <ion-label>{{order_title}}</ion-label>
            </ion-chip>
        </ion-item>
        <ion-list>
            <ion-item v-for="permission in orderPermissions" v-bind:key="permission.val">
            <ion-label>{{permission.val}}</ion-label>
            <ion-checkbox
                slot="end"
                @ionChange="permission.isChecked=$event.target.checked"
                :checked="permission.isChecked"
                >
            </ion-checkbox>
            </ion-item>
        </ion-list>

        <!-- <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionSetting')}}</p>
            <ion-checkbox color="success" slot="end" @ionChange="selectDeselectSetting($event.target.checked)"
                :checked="setting"
            ></ion-checkbox>
        </ion-item> -->
        <ion-item>
            <p>{{$t('backoffice.form.permissionsGroup.permissionSetting')}}</p>
            <ion-chip slot="end" :color="setting_color" @click="selectDeselectSetting()">
                <ion-icon name="checkmark-circle"></ion-icon>
                <ion-label>{{setting_title}}</ion-label>
            </ion-chip>
        </ion-item>
        <ion-list>
            <ion-item v-for="permission in settingPermissions" v-bind:key="permission.val">
            <ion-label>{{permission.val}}</ion-label>
            <ion-checkbox
                slot="end"
                @ionChange="permission.isChecked=$event.target.checked"
                :checked="permission.isChecked"
                >
            </ion-checkbox>
            </ion-item>
        </ion-list>

      <br/>
      <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveRole()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';

export default {

  name: 'roleForm',
   
  data () {
    return {
      modelName: 'Rol',
      /****** Form Data ******/
      id: null,
      name: '',
      description: '',

      menuPermissions: [
        { id: 'canViewMenu', val: this.$t('backoffice.form.permissionsGroup.canViewMenu'), isChecked: false },
        { id: 'canCreateMenu', val: this.$t('backoffice.form.permissionsGroup.canCreateMenu'), isChecked: false },
        { id: 'canEditMenu', val: this.$t('backoffice.form.permissionsGroup.canEditMenu'), isChecked: false },
        { id: 'canDeleteMenu', val: this.$t('backoffice.form.permissionsGroup.canDeleteMenu'), isChecked: false },
      ],
      categoryPermissions: [
        { id: 'canViewCategory', val: this.$t('backoffice.form.permissionsGroup.canViewCategory'), isChecked: false },
        { id: 'canCreateCategory', val: this.$t('backoffice.form.permissionsGroup.canCreateCategory'), isChecked: false },
        { id: 'canEditCategory', val: this.$t('backoffice.form.permissionsGroup.canEditCategory'), isChecked: false },
        { id: 'canDeleteCategory', val: this.$t('backoffice.form.permissionsGroup.canDeleteCategory'), isChecked: false },
      ],
      productPermissions: [
        { id: 'canViewProduct', val: this.$t('backoffice.form.permissionsGroup.canViewProduct'), isChecked: false },
        { id: 'canCreateProduct', val: this.$t('backoffice.form.permissionsGroup.canCreateProduct'), isChecked: false },
        { id: 'canEditProduct', val: this.$t('backoffice.form.permissionsGroup.canEditProduct'), isChecked: false },
        { id: 'canDeleteProduct', val: this.$t('backoffice.form.permissionsGroup.canDeleteProduct'), isChecked: false },
      ],
      customerPermissions: [
        { id: 'canViewCustomer', val: this.$t('backoffice.form.permissionsGroup.canViewCustomer'), isChecked: false },
        { id: 'canCreateCustomer', val: this.$t('backoffice.form.permissionsGroup.canCreateCustomer'), isChecked: false },
        { id: 'canEditCustomer', val: this.$t('backoffice.form.permissionsGroup.canEditCustomer'), isChecked: false },
        { id: 'canDeleteCustomer', val: this.$t('backoffice.form.permissionsGroup.canDeleteCustomer'), isChecked: false },
      ],
      tablePermissions: [
        { id: 'canViewTable', val: this.$t('backoffice.form.permissionsGroup.canViewTable'), isChecked: false },
        { id: 'canCreateTable', val: this.$t('backoffice.form.permissionsGroup.canCreateTable'), isChecked: false },
        { id: 'canEditTable', val: this.$t('backoffice.form.permissionsGroup.canEditTable'), isChecked: false },
        { id: 'canDeleteTable', val: this.$t('backoffice.form.permissionsGroup.canDeleteTable'), isChecked: false },
      ],
      taxPermissions: [
        { id: 'canViewTax', val: this.$t('backoffice.form.permissionsGroup.canViewTax'), isChecked: false },
        { id: 'canCreateTax', val: this.$t('backoffice.form.permissionsGroup.canCreateTax'), isChecked: false },
        { id: 'canEditTax', val: this.$t('backoffice.form.permissionsGroup.canEditTax'), isChecked: false },
        { id: 'canDeleteTax', val: this.$t('backoffice.form.permissionsGroup.canDeleteTax'), isChecked: false },
      ],
      shippingPermissions: [
        { id: 'canViewShipping', val: this.$t('backoffice.form.permissionsGroup.canViewShipping'), isChecked: false },  
        { id: 'canCreateShipping', val: this.$t('backoffice.form.permissionsGroup.canCreateShipping'), isChecked: false },
        { id: 'canEditShipping', val: this.$t('backoffice.form.permissionsGroup.canEditShipping'), isChecked: false },
        { id: 'canDeleteShipping', val: this.$t('backoffice.form.permissionsGroup.canDeleteShipping'), isChecked: false },
      ],
      otherChargePermissions: [
        { id: 'canViewOtherCharge', val: this.$t('backoffice.form.permissionsGroup.canViewOtherCharge'), isChecked: false }, 
        { id: 'canCreateOtherCharge', val: this.$t('backoffice.form.permissionsGroup.canCreateOtherCharge'), isChecked: false },
        { id: 'canEditOtherCharge', val: this.$t('backoffice.form.permissionsGroup.canEditOtherCharge'), isChecked: false },
        { id: 'canDeleteOtherCharge', val: this.$t('backoffice.form.permissionsGroup.canDeleteOtherCharge'), isChecked: false },
      ],
      userPermissions: [
        { id: 'canViewUser', val: this.$t('backoffice.form.permissionsGroup.canViewUser'), isChecked: false },
        { id: 'canCreateUser', val: this.$t('backoffice.form.permissionsGroup.canCreateUser'), isChecked: false },
        { id: 'canEditUser', val: this.$t('backoffice.form.permissionsGroup.canEditUser'), isChecked: false },
        { id: 'canDeleteUser', val: this.$t('backoffice.form.permissionsGroup.canDeleteUser'), isChecked: false },
      ],
      occupationPermissions: [
        { id: 'canViewOccupation', val: this.$t('backoffice.form.permissionsGroup.canViewOccupation'), isChecked: false },
        { id: 'canCreateOccupation', val: this.$t('backoffice.form.permissionsGroup.canCreateOccupation'), isChecked: false },
        { id: 'canEditOccupation', val: this.$t('backoffice.form.permissionsGroup.canEditOccupation'), isChecked: false },
        { id: 'canDeleteOccupation', val: this.$t('backoffice.form.permissionsGroup.canDeleteOccupation'), isChecked: false },
      ],
      rolePermissions: [
        { id: 'canViewRole', val: this.$t('backoffice.form.permissionsGroup.canViewRole'), isChecked: false },
        { id: 'canCreateRole', val: this.$t('backoffice.form.permissionsGroup.canCreateRole'), isChecked: false },
        { id: 'canEditRole', val: this.$t('backoffice.form.permissionsGroup.canEditRole'), isChecked: false },
        { id: 'canDeleteRole', val: this.$t('backoffice.form.permissionsGroup.canDeleteRole'), isChecked: false },
      ],
      variantGroupPermissions: [
        { id: 'canViewVariantGroup', val: this.$t('backoffice.form.permissionsGroup.canViewVariantGroup'), isChecked: false },
        { id: 'canCreateVariantGroup', val: this.$t('backoffice.form.permissionsGroup.canCreateVariantGroup'), isChecked: false },
        { id: 'canEditVariantGroup', val: this.$t('backoffice.form.permissionsGroup.canEditVariantGroup'), isChecked: false },
        { id: 'canDeleteVariantGroup', val: this.$t('backoffice.form.permissionsGroup.canDeleteVariantGroup'), isChecked: false },
      ],
      reservationPermissions: [
        { id: 'canViewReservation', val: this.$t('backoffice.form.permissionsGroup.canViewReservation'), isChecked: false },
        { id: 'canCreateReservation', val: this.$t('backoffice.form.permissionsGroup.canCreateReservation'), isChecked: false },
        { id: 'canEditReservation', val: this.$t('backoffice.form.permissionsGroup.canEditReservation'), isChecked: false },
        { id: 'canDeleteReservation', val: this.$t('backoffice.form.permissionsGroup.canDeleteReservation'), isChecked: false },
      ],
      orderPermissions: [
        { id: 'canViewOrder', val: this.$t('backoffice.form.permissionsGroup.canViewOrder'), isChecked: false },  
        { id: 'canEditOrder', val: this.$t('backoffice.form.permissionsGroup.canEditOrder'), isChecked: false },
        { id: 'canCreateOrder', val: this.$t('backoffice.form.permissionsGroup.canCreateOrder'), isChecked: false },
        { id: 'canViewOrderForDelivery', val: this.$t('backoffice.form.permissionsGroup.canViewOrderForDelivery'), isChecked: false },
      ],
      settingPermissions: [
        { id: 'canChangeSetting', val: this.$t('backoffice.form.permissionsGroup.canChangeSetting'), isChecked: false },  
      ],

      isBackdrop: false,

      spinner: false,

      //Atributos
        all: false,
        all_color: 'success',
        all_title: 'Select all',

        setting: false,
        setting_color: 'success',
        setting_title: 'Select all',

        order: false,
        order_color: 'success',
        order_title: 'Select all',

        role: false,
        role_color: 'success',
        role_title: 'Select all',

        occupation: false,
        occupation_color: 'success',
        occupation_title: 'Select all',

        user: false,
        user_color: 'success',
        user_title: 'Select all',

        otherCharge: false,
        otherCharge_color: 'success',
        otherCharge_title: 'Select all',

        shipping: false,
        shipping_color: 'success',
        shipping_title: 'Select all',

        tax: false,
        tax_color: 'success',
        tax_title: 'Select all',

        table: false,
        table_color: 'success',
        table_title: 'Select all',

        customer: false,
        customer_color: 'success',
        customer_title: 'Select all',

        variant: false,
        variant_color: 'success',
        variant_title: 'Select all',

        product: false,
        product_color: 'success',
        product_title: 'Select all',

        category: false,
        category_color: 'success',
        category_title: 'Select all',

        menu: false,
        menu_color: 'success',
        menu_title: 'Select all',

        reservation: false,
        reservation_color: 'success',
        reservation_title: 'Select all',
    }
  },
  created: function(){
      this.init();
    
  },
  computed: {
        title() {
            return this.id ? this.$t('backoffice.form.titles.roleEditTitle') :  this.$t('backoffice.form.titles.roleNewTitle');
        },
        // menu(){
        //     for (let index = 0; index < this.menuPermissions.length; index++) {
        //         if (!this.menuPermissions[index].isChecked){
        //             return false
        //         }
        //     }
        //     return true;
        // },
        // category(){
        //     for (let index = 0; index < this.categoryPermissions.length; index++) {
        //         if (!this.categoryPermissions[index].isChecked){
        //             return false
        //         }
        //     }
        //     return true;
        // },
        // product(){
        //     for (let index = 0; index < this.productPermissions.length; index++) {
        //         if (!this.productPermissions[index].isChecked){
        //             return false
        //         }
        //     }
        //     return true;
        // },
        // customer(){
        //     for (let index = 0; index < this.customerPermissions.length; index++) {
        //         if (!this.customerPermissions[index].isChecked){
        //             return false
        //         }
        //     }
        //     return true;
        // },
        // table(){
        //     for (let index = 0; index < this.tablePermissions.length; index++) {
        //         if (!this.tablePermissions[index].isChecked){
        //             return false
        //         }
        //     }
        //     return true;
        // },
        // tax(){
        //     for (let index = 0; index < this.taxPermissions.length; index++) {
        //         if (!this.taxPermissions[index].isChecked){
        //             return false
        //         }
        //     }
        //     return true;
        // },
        // shipping(){
        //     for (let index = 0; index < this.shippingPermissions.length; index++) {
        //         if (!this.shippingPermissions[index].isChecked){
        //             return false
        //         }
        //     }
        //     return true;
        // },
        // otherCharge(){
        //     for (let index = 0; index < this.otherChargePermissions.length; index++) {
        //         if (!this.otherChargePermissions[index].isChecked){
        //             return false
        //         }
        //     }
        //     return true;
        // },
        // user(){
        //     for (let index = 0; index < this.userPermissions.length; index++) {
        //         if (!this.userPermissions[index].isChecked){
        //             return false
        //         }
        //     }
        //     return true;
        // },
        // occupation(){
        //     for (let index = 0; index < this.occupationPermissions.length; index++) {
        //         if (!this.occupationPermissions[index].isChecked){
        //             return false
        //         }
        //     }
        //     return true;
        // },
        // role(){
        //     for (let index = 0; index < this.rolePermissions.length; index++) {
        //         if (!this.rolePermissions[index].isChecked){
        //             return false
        //         }
        //     }
        //     return true;
        // },
        // variantGroup(){
        //     for (let index = 0; index < this.variantGroupPermissions.length; index++) {
        //         if (!this.variantGroupPermissions[index].isChecked){
        //             return false
        //         }
        //     }
        //     return true;
        // },
        // order(){
        //     for (let index = 0; index < this.orderPermissions.length; index++) {
        //         if (!this.orderPermissions[index].isChecked){
        //             return false
        //         }
        //     }
        //     return true;
        // },
        // setting(){
        //     for (let index = 0; index < this.settingPermissions.length; index++) {
        //         if (!this.settingPermissions[index].isChecked){
        //             return false
        //         }
        //     }
        //     return true;
        // },
        // all(){
        //     if (this.menu && this.order && this.category && this.product && this.customer && this.table 
        //             && this.tax && this.shipping && this.otherCharge && this.user && this.occupation
        //                  && this.role && this.variantGroup && this.setting)
        //             return true;
        //     else
        //         return false;
        // },
  },
  methods: {
    init(){
        this.id = this.$route.params.roleId;
        console.log("Role id");
        console.log(this.id);
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
                                console.log(response.data);
                            this.name = response.data.Name;
                            this.description = response.data.Description;

                            this.menuPermissions[0].isChecked = response.data.canViewMenu;
                            this.menuPermissions[1].isChecked = response.data.canCreateMenu;
                            this.menuPermissions[2].isChecked = response.data.canEditMenu;
                            this.menuPermissions[3].isChecked = response.data.canDeleteMenu;

                            this.categoryPermissions[0].isChecked = response.data.canViewCategory;
                            this.categoryPermissions[1].isChecked = response.data.canCreateCategory;
                            this.categoryPermissions[2].isChecked = response.data.canEditCategory;
                            this.categoryPermissions[3].isChecked = response.data.canDeleteCategory;

                            this.productPermissions[0].isChecked = response.data.canViewProduct;
                            this.productPermissions[1].isChecked = response.data.canCreateProduct;
                            this.productPermissions[2].isChecked = response.data.canEditProduct;
                            this.productPermissions[3].isChecked = response.data.canDeleteProduct;

                            this.customerPermissions[0].isChecked = response.data.canViewCustomer;
                            this.customerPermissions[1].isChecked = response.data.canCreateCustomer;
                            this.customerPermissions[2].isChecked = response.data.canEditCustomer;
                            this.customerPermissions[3].isChecked = response.data.canDeleteCustomer;
                            
                            this.tablePermissions[0].isChecked = response.data.canViewTable;
                            this.tablePermissions[1].isChecked = response.data.canCreateTable;
                            this.tablePermissions[2].isChecked = response.data.canEditTable;
                            this.tablePermissions[3].isChecked = response.data.canDeleteTable;
                            
                            this.taxPermissions[0].isChecked = response.data.canViewTax;
                            this.taxPermissions[1].isChecked = response.data.canCreateTax;
                            this.taxPermissions[2].isChecked = response.data.canEditTax;
                            this.taxPermissions[3].isChecked = response.data.canDeleteTax;
                            
                            this.shippingPermissions[0].isChecked = response.data.canViewShipping;
                            this.shippingPermissions[1].isChecked = response.data.canCreateShipping;
                            this.shippingPermissions[2].isChecked = response.data.canEditShipping;
                            this.shippingPermissions[3].isChecked = response.data.canDeleteShipping;
                            
                            this.otherChargePermissions[0].isChecked = response.data.canViewOtherCharge;
                            this.otherChargePermissions[1].isChecked = response.data.canCreateOtherCharge;
                            this.otherChargePermissions[2].isChecked = response.data.canEditOtherCharge;
                            this.otherChargePermissions[3].isChecked = response.data.canDeleteOtherCharge;

                            this.userPermissions[0].isChecked = response.data.canViewUser;
                            this.userPermissions[1].isChecked = response.data.canCreateUser;
                            this.userPermissions[2].isChecked = response.data.canEditUser;
                            this.userPermissions[3].isChecked = response.data.canDeleteUser;

                            this.occupationPermissions[0].isChecked = response.data.canViewOccupation;
                            this.occupationPermissions[1].isChecked = response.data.canCreateOccupation;
                            this.occupationPermissions[2].isChecked = response.data.canEditOccupation;
                            this.occupationPermissions[3].isChecked = response.data.canDeleteOccupation;

                            this.rolePermissions[0].isChecked = response.data.canViewRole;
                            this.rolePermissions[1].isChecked = response.data.canCreateRole;
                            this.rolePermissions[2].isChecked = response.data.canEditRole;
                            this.rolePermissions[3].isChecked = response.data.canDeleteRole;

                            this.variantGroupPermissions[0].isChecked = response.data.canViewVariantGroup;
                            this.variantGroupPermissions[1].isChecked = response.data.canCreateVariantGroup;
                            this.variantGroupPermissions[2].isChecked = response.data.canEditVariantGroup;
                            this.variantGroupPermissions[3].isChecked = response.data.canDeleteVariantGroup;

                            this.reservationPermissions[0].isChecked = response.data.canViewReservation;
                            this.reservationPermissions[1].isChecked = response.data.canCreateReservation;
                            this.reservationPermissions[2].isChecked = response.data.canEditReservation;
                            this.reservationPermissions[3].isChecked = response.data.canDeleteReservation;


                            this.orderPermissions[0].isChecked = response.data.canViewOrder;
                            this.orderPermissions[1].isChecked = response.data.canEditOrder;
                            this.orderPermissions[2].isChecked = response.data.canCreateOrder;
                            this.orderPermissions[3].isChecked = response.data.canViewOrderForDelivery;

                            this.settingPermissions[0].isChecked = response.data.canChangeSetting;

                            console.log(response.data);
                            loading.dismiss();
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
    ifErrorOccured(action){
      return this.$ionic.alertController.create({
          title: this.$t('backoffice.list.messages.connectionError'),
          message: this.$t('backoffice.list.messages.connectionErrorMessage'),
          buttons: [
            {
              text: this.$t('backoffice.list.messages.buttons.goToList'),
              handler: () => {
                  this.$router.push({
                      name: 'Role',
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
    selectDeselectMenu(){
        this.menu = !this.menu;
        if (this.menu_color == 'success')
        {
            this.menu_color = 'danger'
            this.menu_title = 'Deselect all'
        }  
        else{
            this.menu_color = 'success'
            this.menu_title = 'Select All'
        }

        this.menuPermissions.forEach(permission => {
            if (this.menu)
                permission.isChecked = true;
            else
                permission.isChecked = false;
        });
    },
    selectDeselectCategory(){
        this.category = !this.category;
        if (this.category_color == 'success')
        {
            this.category_color = 'danger'
            this.category_title = 'Deselect all'
        }  
        else{
            this.category_color = 'success'
            this.category_title = 'Select All'
        }

        this.categoryPermissions.forEach(permissionCateg => {
            if (this.category)
                permissionCateg.isChecked = true;
            else
                permissionCateg.isChecked = false;
        });
    },
    selectDeselectProduct(){
        this.product = !this.product;
        if (this.product_color == 'success')
        {
            this.product_color = 'danger'
            this.product_title = 'Deselect all'
        }  
        else{
            this.product_color = 'success'
            this.product_title = 'Select All'
        }

        this.productPermissions.forEach(permission => {
            if (this.product)
                permission.isChecked = true;
            else
                permission.isChecked = false;
        });
    },
    selectDeselectReservation(){
        this.reservation = !this.reservation;
        if (this.reservation_color == 'success')
        {
            this.reservation_color = 'danger'
            this.reservation_title = 'Deselect all'
        }  
        else{
            this.reservation_color = 'success'
            this.reservation_title = 'Select All'
        }

        this.reservationPermissions.forEach(permission => {
            if (this.reservation)
                permission.isChecked = true;
            else
                permission.isChecked = false;
        });
    },
    selectDeselectCustomer(){
        this.customer = !this.customer;
        if (this.customer_color == 'success')
        {
            this.customer_color = 'danger'
            this.customer_title = 'Deselect all'
        }  
        else{
            this.customer_color = 'success'
            this.customer_title = 'Select All'
        }

        this.customerPermissions.forEach(permission => {
            if (this.customer)
                permission.isChecked = true;
            else
                permission.isChecked = false;
        });
    },
    selectDeselectTable(){
        this.table = !this.table;
        if (this.table_color == 'success')
        {
            this.table_color = 'danger'
            this.table_title = 'Deselect all'
        }  
        else{
            this.table_color = 'success'
            this.table_title = 'Select All'
        }

        this.tablePermissions.forEach(permission => {
            if (this.table)
                permission.isChecked = true;
            else
                permission.isChecked = false;
        });
        console.log(this.tablePermissions);
    },
    selectDeselectTax(){
        this.tax = !this.tax;
        if (this.tax_color == 'success')
        {
            this.tax_color = 'danger'
            this.tax_title = 'Deselect all'
        }  
        else{
            this.tax_color = 'success'
            this.tax_title = 'Select All'
        }

        this.taxPermissions.forEach(permission => {
            if (this.tax)
                permission.isChecked = true;
            else
                permission.isChecked = false;
        });
    },
    selectDeselectShipping(){
        this.shipping = !this.shipping;
        if (this.shipping_color == 'success')
        {
            this.shipping_color = 'danger'
            this.shipping_title = 'Deselect all'
        }  
        else{
            this.shipping_color = 'success'
            this.shipping_title = 'Select All'
        }

        this.shippingPermissions.forEach(permission => {
            if (this.shipping)
                permission.isChecked = true;
            else
                permission.isChecked = false;
        });
    },
    selectDeselectOtherCharge(){
        this.otherCharge = !this.otherCharge;
        if (this.otherCharge_color == 'success')
        {
            this.otherCharge_color = 'danger'
            this.otherCharge_title = 'Deselect all'
        }  
        else{
            this.otherCharge_color = 'success'
            this.otherCharge_title = 'Select All'
        }

        this.otherChargePermissions.forEach(permission => {
            if (this.otherCharge)
                permission.isChecked = true;
            else
                permission.isChecked = false;
        });
    },
    selectDeselectUser(){
        this.user = !this.user;
        if (this.user_color == 'success')
        {
            this.user_color = 'danger'
            this.user_title = 'Deselect all'
        }  
        else{
            this.user_color = 'success'
            this.user_title = 'Select All'
        }

        this.userPermissions.forEach(permission => {
            if (this.user)
                permission.isChecked = true;
            else
                permission.isChecked = false;
        });
    },
    selectDeselectOccupation(){
        this.occupation = !this.occupation;
        if (this.occupation_color == 'success')
        {
            this.occupation_color = 'danger'
            this.occupation_title = 'Deselect all'
        }  
        else{
            this.occupation_color = 'success'
            this.occupation_title = 'Select All'
        }

        this.occupationPermissions.forEach(permission => {
            if (this.occupation)
                permission.isChecked = true;
            else
                permission.isChecked = false;
        });
    },
    selectDeselectRole(){
        this.role = !this.variant;
        if (this.role_color == 'success')
        {
            this.role_color = 'danger'
            this.role_title = 'Deselect all'
        }  
        else{
            this.role_color = 'success'
            this.role_title = 'Select All'
        }

        this.rolePermissions.forEach(permission => {
            if (this.role)
                permission.isChecked = true;
            else
                permission.isChecked = false;
        });
    },
    selectDeselectVariantGroup(){
        this.variant = !this.variant;
        if (this.variant_color == 'success')
        {
            this.variant_color = 'danger'
            this.variant_title = 'Deselect all'
        }  
        else{
            this.variant_color = 'success'
            this.variant_title = 'Select All'
        }

        this.variantGroupPermissions.forEach(permission => {
            if (this.variant)
                permission.isChecked = true;
            else
                permission.isChecked = false;
        });
    },
    selectDeselectOrder(){
        this.order = !this.order;
        if (this.order_color == 'success')
        {
            this.order_color = 'danger'
            this.order_title = 'Deselect all'
        }  
        else{
            this.order_color = 'success'
            this.order_title = 'Select All'
        }

        this.orderPermissions.forEach(permission => {
            if (this.order)
                permission.isChecked = true;
            else
                permission.isChecked = false;
        });
    },
    selectDeselectSetting(){
        this.setting = !this.setting;
        if (this.setting_color == 'success')
        {
            this.setting_color = 'danger'
            this.setting_title = 'Deselect all'
        }  
        else{
            this.setting_color = 'success'
            this.setting_title = 'Select All'
        }

        this.settingPermissions.forEach(permission => {
            if (this.setting)
                permission.isChecked = true;
            else
                permission.isChecked = false;
        });
    },
    selectDeselectAll(){
        this.all = !this.all;
        if (this.all_color == 'success')
        {
            this.all_color = 'danger'
            this.all_title = 'Deselect all'
        }  
        else{
            this.all_color = 'success'
            this.all_title = 'Select All'
        }
            
        this.selectDeselectMenu(this.all);
        this.selectDeselectCategory(this.all);
        this.selectDeselectProduct(this.all);
        this.selectDeselectCustomer(this.all);
        this.selectDeselectTable(this.all);
        this.selectDeselectTax(this.all);
        this.selectDeselectShipping(this.all);
        this.selectDeselectOtherCharge(this.all);
        this.selectDeselectUser(this.all);
        this.selectDeselectOccupation(this.all);
        this.selectDeselectRole(this.all);
        this.selectDeselectVariantGroup(this.all);
        this.selectDeselectReservation(this.all);
        this.selectDeselectOrder(this.all);
        this.selectDeselectSetting(this.all);
    },
    isValidForm(){
        // let errors = [];

        if (this.name == "")
        {
            // errors.push(this.$t('backoffice.form.validate.name'));
            return false
        }

        return true

        // if (errors.length > 0)
        // {
        //     let message = "";
        //     for (let i = 0; i < errors.length; i++) {
        //          message += (i + 1) + "- " + errors[i] + "<br/>";
        //     }
        //     this.ShowMessage(this.$t('backoffice.form.validate.validate'), message,
        //                               this.$t('backoffice.form.validate.validateRole'));
        //     this.showToastMessage(message, "danger");
        //     return false;
        // }
        // else
        // {
        //     return true;
        // }
    },
    saveRole: function(){

        if (this.isValidForm())
        {
            this.isBackdrop = true;
            let item = {
                "Name": this.name,
                "Description": this.description,
                "canViewMenu": this.menuPermissions[0].isChecked,
                "canCreateMenu": this.menuPermissions[1].isChecked,
                "canEditMenu": this.menuPermissions[2].isChecked,
                "canDeleteMenu": this.menuPermissions[3].isChecked,
                "canViewCategory": this.categoryPermissions[0].isChecked,
                "canCreateCategory": this.categoryPermissions[1].isChecked,
                "canEditCategory": this.categoryPermissions[2].isChecked,
                "canDeleteCategory": this.categoryPermissions[3].isChecked,
                "canViewProduct": this.productPermissions[0].isChecked,
                "canCreateProduct": this.productPermissions[1].isChecked,
                "canEditProduct": this.productPermissions[2].isChecked,
                "canDeleteProduct": this.productPermissions[3].isChecked,
                "canViewCustomer": this.customerPermissions[0].isChecked,
                "canCreateCustomer": this.customerPermissions[1].isChecked,
                "canEditCustomer": this.customerPermissions[2].isChecked,
                "canDeleteCustomer": this.customerPermissions[3].isChecked,
                "canViewTable": this.tablePermissions[0].isChecked,
                "canCreateTable": this.tablePermissions[1].isChecked,
                "canEditTable": this.tablePermissions[2].isChecked,
                "canDeleteTable": this.tablePermissions[3].isChecked,
                "canViewTax": this.taxPermissions[0].isChecked,
                "canCreateTax": this.taxPermissions[1].isChecked,
                "canEditTax": this.taxPermissions[2].isChecked,
                "canDeleteTax": this.taxPermissions[3].isChecked,
                "canViewShipping": this.shippingPermissions[0].isChecked,
                "canCreateShipping": this.shippingPermissions[1].isChecked,
                "canEditShipping": this.shippingPermissions[2].isChecked,
                "canDeleteShipping": this.shippingPermissions[3].isChecked,
                "canViewOtherCharge": this.otherChargePermissions[0].isChecked,
                "canCreateOtherCharge": this.otherChargePermissions[1].isChecked,
                "canEditOtherCharge": this.otherChargePermissions[2].isChecked,
                "canDeleteOtherCharge": this.otherChargePermissions[3].isChecked,
                "canViewUser": this.userPermissions[0].isChecked,
                "canCreateUser": this.userPermissions[1].isChecked,
                "canEditUser": this.userPermissions[2].isChecked,
                "canDeleteUser": this.userPermissions[3].isChecked,
                "canViewOccupation": this.occupationPermissions[0].isChecked,
                "canCreateOccupation": this.occupationPermissions[1].isChecked,
                "canEditOccupation": this.occupationPermissions[2].isChecked,
                "canDeleteOccupation": this.occupationPermissions[3].isChecked,
                "canViewRole": this.rolePermissions[0].isChecked,
                "canCreateRole": this.rolePermissions[1].isChecked,
                "canEditRole": this.rolePermissions[2].isChecked,
                "canDeleteRole": this.rolePermissions[3].isChecked,
                "canViewVariantGroup": this.variantGroupPermissions[0].isChecked,
                "canCreateVariantGroup": this.variantGroupPermissions[1].isChecked,
                "canEditVariantGroup": this.variantGroupPermissions[2].isChecked,
                "canDeleteVariantGroup": this.variantGroupPermissions[3].isChecked,
                "canViewReservation": this.reservationPermissions[0].isChecked,
                "canCreateReservation": this.reservationPermissions[1].isChecked,
                "canEditReservation": this.reservationPermissions[2].isChecked,
                "canDeleteReservation": this.reservationPermissions[3].isChecked,
                "canViewOrder": this.orderPermissions[0].isChecked,
                "canEditOrder": this.orderPermissions[1].isChecked,
                "canCreateOrder": this.orderPermissions[2].isChecked,
                "canViewOrderForDelivery": this.orderPermissions[3].isChecked,
                "canChangeSetting": this.settingPermissions[0].isChecked,
            }
            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              this.spinner = true;
              Api.putIn(this.modelName, item)
                  .then(response => {
                        // alert("Success edited");
                        // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                        //      this.$t('backoffice.list.messages.messageEditSuccesRole'), 
                        //         this.$t('backoffice.list.messages.titleEditRole'));
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccesRole'), "success");
                        this.spinner = false;
                        this.$router.push({
                          name: 'Role', 
                        });
                        return response;
                  })
                  .catch(e => {
                        this.isBackdrop = false;
                        console.log(e);
                        this.spinner = false;
                        this.ifErrorOccured(this.saveRole);
                  })
            }
            else{
              //Else, I am created a new category
              this.spinner = true;
              Api.postIn(this.modelName, item)
                  .then(response => {
                    //   this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                    //          this.$t('backoffice.list.messages.messageCreateSuccessRole'), 
                    //             this.$t('backoffice.list.messages.titleCreateRole'));
                      this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessRole'), "success");
                      this.spinner = false;
                      this.$router.push({
                        name: 'Role', 
                      });
                    return response;
                  })
                  .catch(e => {
                      this.isBackdrop = false;
                      console.log(e);
                      this.spinner = false;
                      this.ifErrorOccured(this.saveRole);
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