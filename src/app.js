import Vue from 'vue'
import VueResource from 'vue-resource'
import VueTap from './plugins/vue-tap.js'
import Moment from 'moment'

Moment.locale('zh-cn')

Vue.use(VueResource)
Vue.use(VueTap)
Vue.config.debug=true
Vue.http.options.headers = {
	'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
}
Vue.http.options.emulateJSON = true

Vue.filter('moment', function(datetime) {
	return Moment(datetime).fromNow();
});
const app=Vue.extend(require("./app.vue"))

new app({
	el: '#app'
})