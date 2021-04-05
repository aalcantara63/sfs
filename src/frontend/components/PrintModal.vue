<template>
  <div class="examples">
      Print Here 
     
  </div>

</template>



<script>


export default {
    name: 'PrintModal',
    created: function(){    
        this.print();  
    },    
    data() {
        return {           
        }
    },    
    props: {
        html:  {type: String, default:''},   
    },
    methods:{
        print(){
            // var winimp = window.open('/print', 'popimpr');         
            var winimp = window.open();         
            winimp.document.write( this.html );
            winimp.document.close();
            winimp.focus();
            winimp.print();
            winimp.close();
        }

    },

    
        
}
   
</script>



<style scope="scoped" >
.gpay-button.short, .gpay-button.plain {   
    width: 60px;
}


</style>