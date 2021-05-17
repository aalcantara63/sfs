<template>
  <form :model="form" @submit.prevent="submit" ref="contactForm">
    <div class="form-group row">
      <label >Name</label>
      <div class="col-sm-10">
        <input  required="">
      </div>
    </div>
    <div class="form-group row">
     
    </div>
    <div class="form-group row">
      <label for="robot" class="col-sm-2 col-form-label">Roboot</label>
      <div class="col-sm-10">
        <vue-recaptcha 
          sitekey="6LdVK4IaAAAAAECLMi3WkdELlSJ6bCpFOZAMcsAO">
        </vue-recaptcha>
      </div>
    </div>
    <button type="submit" class="btn btn-primary mb-2">Send</button>. 
  </form>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha';

export default {
  data() {
    return {
      form: {
        robot: false
      }
    }
  },
  methods: {
    submit: function() {
      if (this.form.robot) {
        console.log('submit')
      }
    },
    onVerify: function (response) {
      if (response) this.form.robot = true;
    },
  },
  components: {
    'vue-recaptcha': VueRecaptcha
  },
}
</script>