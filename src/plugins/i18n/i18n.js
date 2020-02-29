import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from './vue-i18n/en.json'
import vi from './vue-i18n/vi.json'

Vue.use(VueI18n);
export default new VueI18n({
    locale: 'vi', // set locale
    messages: { vi }
});