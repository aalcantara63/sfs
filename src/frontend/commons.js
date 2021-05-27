import store from '../main.js'
import {Api} from '../backoffice/api/api.js'

export var Commons = {

    order: store.state.order,
    cart: store.state.cart,
    configuration: store.state.configuration,
    restaurantActive: store.state.restaurantActive,
    clientId: store.state.customer._id,
    CustomerName: store.state.customer.Name,
    email: store.state.customer.EmailAddress,
    phone: store.state.customer.Phone,   

    getOtherCharges: async function(){   
        
        console.log('in commomns getOtherCharges')
        console.log(JSON.parse(JSON.stringify(this.cart)))
       
        const otherCharges = []
        for (const obj of this.cart){
            const resp = await Api.findProductCharges(obj.ProductId, obj.Cant);
            console.log('resp');
            console.log(resp);
            if(resp.status === 200 && resp.data.length > 0){
                 otherCharges.push( resp.data[0]);   
                 console.log('otherCharges')
                 console.log(otherCharges)             
            }             
         }         
         return otherCharges;
    },

    setCartCommit(cart){
        store.commit('setCart', cart);
    }


    
}