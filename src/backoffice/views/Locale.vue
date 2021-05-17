<template>
        <!-- <ion-list> -->
            <ion-item id="locale" class="locale">
                <ion-label>{{$t('backoffice.form.titles.selectALanguage')}}</ion-label>
                <ion-select interface="popover"
                 :ok-text="$t('backoffice.form.messages.buttons.ok')"
                 :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                @ionChange="changeLanguage($event.target.value)" :value="currentLanguaje">
                    <ion-select-option v-for="language in languages" :key="language.locale" :value="language.locale" >{{language.title}}</ion-select-option>
                </ion-select>
            </ion-item>
        <!-- </ion-list> -->

    <!-- </ion-content> -->
</template>

<script>
import { i18n } from '@/plugins/i18n'

export default{
    name: 'LanguageComponent',
    data: () => ({
        currentLanguaje: i18n.locale,
    }),
    computed: {
        languages() {
            return [
                { locale: 'es', title: this.$t('spanish') },
                { locale: 'en', title: this.$t('english') }
            ]
        }
    },
    methods: {
        changeLanguage(locale) {
            console.log('Segment changed', locale);
            this.currentLanguaje = locale
            i18n.locale = locale
        }
    }
}
</script>