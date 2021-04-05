

export var Utils={

    getFormatedDate: function(date){
        var d = new Date(date);
        var day = d.getUTCDate();
        var month = d.getUTCMonth() + 1;
        var year = d.getUTCFullYear();
        return month + "-" + day + "-" + year;
      },

      getFormatNumber: function(currencyCode, number){
          new Intl.NumberFormat('en', {style: "currency", currency: currencyCode} ).format(number).toString()
      },

      decimalAdjust: function(type, value, exp) {
        // Si exp es undefined o cero...
        if (typeof exp === 'undefined' || +exp === 0) {
          return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // Si el valor no es un número o exp no es un entero...
        if (Number.isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
          return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+`${value[0]}e${value[1] ? +value[1] - exp : -exp}`);
        // Shift back
        value = value.toString().split('e');
        return +`${value[0]}e${value[1] ? +value[1] + exp : exp}`;
      },
      

      defaultStyles:":root { -ion-color-primary: #3880ff ; " +
                            "--ion-color-primary-rgb: 56,128,255; " +
                            "--ion-color-primary-contrast: #ffffff; " +
                            "--ion-color-primary-contrast-rgb: 255,255,255; " +
                            "--ion-color-primary-shade: #3171e0; " +
                            "--ion-color-primary-tint: #4c8dff; " +

                            "--ion-color-secondary: #3dc2ff; " +
                            "--ion-color-secondary-rgb: 61,194,255; " +
                            "--ion-color-secondary-contrast: #ffffff; " +
                            "--ion-color-secondary-contrast-rgb: 255,255,255; " +
                            "--ion-color-secondary-shade: #36abe0; " +
                            "--ion-color-secondary-tint: #50c8ff; " +

                            "--ion-color-tertiary: #5260ff; " +
                            "--ion-color-tertiary-rgb: 82,96,255; " + 
                            "--ion-color-tertiary-contrast: #ffffff; " +
                            "--ion-color-tertiary-contrast-rgb: 255,255,255; " +
                            "--ion-color-tertiary-shade: #4854e0; " + 
                            "--ion-color-tertiary-tint: #6370ff; " +

                            "--ion-color-success: #2dd36f; " +
                            "--ion-color-success-rgb: 45,211,111; " +
                            "--ion-color-success-contrast: #ffffff; " +
                            "--ion-color-success-contrast-rgb: 255,255,255; " +
                            "--ion-color-success-shade: #28ba62; " + 
                            "--ion-color-success-tint: #42d77d; " +

                            "--ion-color-danger: #eb445a; " +
                            "--ion-color-danger-rgb: 235,68,90; " +
                            "--ion-color-danger-contrast: #ffffff; " + 
                            "--ion-color-danger-contrast-rgb: 255,255,255; " +
                            "--ion-color-danger-shade: #cf3c4f; " +
                            "--ion-color-danger-tint: #ed576b; }"


}

