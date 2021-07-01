<template>
    <div v-if="urlPayFabric!==''">
       <iframe :src="urlPayFabric" style="width: 100%; height: 65vh;"></iframe>
    </div>
</template>

<script>




export default {
    name: 'PayFabric',
    created: async function(){   
        let that = this;
        window.addEventListener('message',function(event) {
            console.log(typeof(event.data));
            if(typeof(event.data)=== 'string'){
                var objMsg = JSON.parse(event.data);
                if(event.origin !== 'https://sandbox.payfabric.com') return;        
                if(objMsg.Event === "successCallback" && objMsg.ResponseMsg === "APPROVED")   {
                    //  console.log(objMsg);
                  return  that.getPaymentResponse(objMsg);
                }    
                   
            }
       
      },false)
       
    },  
    data() {
        return { 
           
        }
    }, 
     props: { 
        parent: {type: Object, default: ()=> {}} ,
        urlPayFabric:  {type: String, default:"" } , 
        total: {type: String, default:"" } ,
    },
    methods: {
        getPaymentResponse(res){

            const response = {
                        "total": this.total,
                        "transId": res.TrxKey,
                        "accountNumber": "",
                        "expirationCard": '',
                        "accountType": '',
                        "method": 'Card',
                        "moto": false,
                    }
            return this.parent.responsePayFabric(response); 

        }
    }, 
}
</script>