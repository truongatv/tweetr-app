import Vue from 'vue';
import VueI18n from 'vue-i18n';
import us from './vue-i18n/en.json'
import vn from './vue-i18n/vn.json'
import jp from './vue-i18n/jp.json'

Vue.use(VueI18n);
export default new VueI18n({
    locale: 'vn', // set locale
    fallbackLocale: 'us',
    messages: {
        vn: vn ,
        us: us ,
        jp: jp
    }
});