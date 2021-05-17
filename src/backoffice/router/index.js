import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../../main.js'

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

Vue.use(VueRouter)




  const routes = [


   
  //  BACKOFFICE

  {
    path: '/category',
    name: 'Category',
    component: () => import(/* webpackChunkName: "about" */ '../views/Category.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/category-form/:categoryId?',
    name: 'CategoryForm',
    component: () => import(/* webpackChunkName: "about" */ '../views/CategoryForm.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/product/:type?',
    name: 'Product',
    component: () => import(/* webpackChunkName: "about" */ '../views/Product.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/product-form/:productId?/:categoryId?/:menuId?/:type?',
    name: 'ProductForm',
    component: () => import(/* webpackChunkName: "about" */ '../views/ProductForm.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/productByCategory/:categoryId/:menuId?',
    name: 'ProductByCategory',
    component: () => import(/* webpackChunkName: "about" */ '../views/ProductByCategory.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/variantGroup',
    name: 'VariantGroup',
    component: () => import(/* webpackChunkName: "about" */ '../views/VariantGroup.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/variantGroup-form/:variantGroupId?',
    name: 'VariantGroupForm',
    component: () => import(/* webpackChunkName: "about" */ '../views/VariantGroupForm.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import(/* webpackChunkName: "about" */ '../views/Menu.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/menu-form/:menuId?',
    name: 'MenuForm',
    component: () => import(/* webpackChunkName: "about" */ '../views/MenuForm.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/customer',
    name: 'Customer',
    component: () => import(/* webpackChunkName: "about" */ '../views/Customer.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/customer-form/:customerId?',
    name: 'CustomerForm',
    component: () => import(/* webpackChunkName: "about" */ '../views/CustomerForm.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/table',
    name: 'Table',
    component: () => import(/* webpackChunkName: "about" */ '../views/Table.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/table-form/:tableId?',
    name: 'TableForm',
    component: () => import(/* webpackChunkName: "about" */ '../views/TableForm.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import(/* webpackChunkName: "about" */ '../views/Order.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/cateringOrder',
    name: 'CateringOrder',
    component: () => import(/* webpackChunkName: "about" */ '../views/OrderCatering.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/orderdetails/:orderId/:type?',
    name: 'OrderDetails',
    component: () => import(/* webpackChunkName: "about" */ '../views/OrderDetails.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/cateringOrderForm/:orderId',
    name: 'OrderCateringForm',
    component: () => import(/* webpackChunkName: "about" */ '../views/OrderCateringForm.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/ticket',
    name: 'Ticket',
    component: () => import(/* webpackChunkName: "about" */ '../views/Ticket.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/ticket/:ticketId',
    name: 'TicketForm',
    component: () => import(/* webpackChunkName: "about" */ '../views/TicketForm.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/tax',
    name: 'Tax',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Tax.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/tax-form/:taxId?',
    name: 'TaxForm',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/TaxForm.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/shipping',
    name: 'Shipping',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Shipping.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/shipping-form/:shippingId?',
    name: 'ShippingForm',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ShippingForm.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/otherCharge',
    name: 'OtherCharge',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/OtherCharge.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/otherCharge-form/:otherChargeId?',
    name: 'OtherChargeForm',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/OtherChargeForm.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/reservationbackoffice',
    name: 'ReservationBackoffice',
    component: () => import(/* webpackChunkName: "about" */ '../views/Reservation.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/reservationDetails',   
     name: 'ReservationDetails',
     component: () => import(/* webpackChunkName: "about" */ '../views/ReservationDetails.vue')
  },
  {
    path: '/user',
    name: 'User',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/User.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/user-form/:userId?/:isSupport?',
    name: 'UserForm',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/UserForm.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/role',
    name: 'Role',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Role.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/role-form/:roleId?',
    name: 'RoleForm',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/RoleForm.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/demo',
    name: 'Demo',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/demo.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/controlPanel/:firstLogin?',
    name: 'ControlPanel',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ControlPanel.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/payment',
    name: 'Payment',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Payment.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/paymentdetail',
    name: 'PaymentDetail',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/PaymentDetail.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/support/:tab?',
    name: 'Support',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/SupportPanel.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/basicDataSettingsForm/:settingId?',
    name: 'BasicSettingForm',
    component: () => import(/* webpackChunkName: "about" */ '../views/BasicDataSettingsForm.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/paymentSettingsForm/:settingId?',
    name: 'PaymentSettingsForm',
    component: () => import(/* webpackChunkName: "about" */ '../views/PaymentSettingsForm.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/KeySettingsForm/:settingId?',
    name: 'KeySettingForm',
    component: () => import(/* webpackChunkName: "about" */ '../views/KeySettingForm.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/funDataSettingsForm/:settingId?',
    name: 'FunSettingForm',
    component: () => import(/* webpackChunkName: "about" */ '../views/FunDataSettingForm.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/ColourDataSettingsForm/:settingId?',
    name: 'ColourSettingForm',
    component: () => import(/* webpackChunkName: "about" */ '../views/ColourDataSettingForm.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/aboutDataSettings',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutDataSetting.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/aboutDataSettingsForm/:aboutId?',
    name: 'AboutForm',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutDataSettingsForm.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/occupation',
    name: 'Occupation',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Occupation.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/occupation-form/:occupationId?',
    name: 'OccupationForm',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/OccupationForm.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/localization/:order/:fun?',
    name: 'Localization',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Localization.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: '/orderForDelivered',
    name: 'OrderForDelivered',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/OrderForDelivered.vue'),
    beforeEnter: (to, from, next) =>{
      if (store.state.authenticated == false)
      {
        next("/");
      } else {
        next();
      }
    }
  },

  // FRONTEND

  {
    // path: '/menus',    
    path: '/:url',    
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../../frontend/views/Home.vue')
    
  },
  {
    // path: '//catering',
    path: '/:url', 
    name: 'Catering',
    component: () => import(/* webpackChunkName: "about" */ '../../frontend/views/Catering.vue')
  },
  {
    path: '/',
    name: 'AppVue',
  },
  {
    path: '/:url',
    name: 'AppVue',
  },
  {
    // path: '/home', 
    path: '/:url',   
     name: 'AboutFront',
     component: () => import(/* webpackChunkName: "about" */ '../../frontend/views/About.vue')
   },
   {
    // path: '/home', 
    path: '/:url',   
     name: 'Ads',
     component: () => import(/* webpackChunkName: "about" */ '../../frontend/views/Ads.vue')
   },
  {
  //  path: '/products',  
    path: '/:url',  
    name: 'Products',
    component: () => import(/* webpackChunkName: "about" */ '../../frontend/views/Products.vue'),
  },
  {
    // path: '/order', 
    path: '/:url',  
    name: 'OrderFront',
    component: () => import(/* webpackChunkName: "about" */ '../../frontend/views/Order.vue')
   },
   {
    // path: '/order', 
    path: '/:url',  
    name: 'OrderTicket',
    component: () => import(/* webpackChunkName: "about" */ '../../frontend/views/OrderTicket.vue')
   },
   {
    // path: '/orderCatering',  
     path: '/:url',  
     name: 'OrderCatering',
     component: () => import(/* webpackChunkName: "about" */ '../../frontend/views/OrderCatering.vue')
   },
   {
    // path: '/orderDetail', 
     path: '/:url',   
     name: 'OrderState',
     component: () => import(/* webpackChunkName: "about" */ '../../frontend/views/OrderState.vue')
   },
   {
    // path: '/listOrder',   
      path: '/:url', 
     name: 'ListOrder',
     component: () => import(/* webpackChunkName: "about" */ '../../frontend/views/ListOrder.vue')
   },
   {
    // path: '/listOrder',   
      path: '/:url', 
     name: 'ListTicket',
     component: () => import(/* webpackChunkName: "about" */ '../../frontend/views/ListTicket.vue')
   },
   {
    // path: '/reservation', 
     path: '/:url',   
     name: 'Reservation',
     component: () => import(/* webpackChunkName: "about" */ '../../frontend/views/Reservation.vue')
   },
   {
    path: '/:url/myaccount',   
     name: 'Myaccount',
     component: () => import(/* webpackChunkName: "about" */ '../../frontend/views/MyAccount.vue')
   },
   {
    // path: '/reservationDetail',
    path: '/:url',    
     name: 'ReservationDetail',
     component: () => import(/* webpackChunkName: "about" */ '../../frontend/views/ReservationState.vue')
   },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


export default router
