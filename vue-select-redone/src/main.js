import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import jsonp from 'jsonp'

axios.defaults.baseURL = "http://api.londrinaweb.com.br/PUC/";
Vue.prototype.jsonp = jsonp;
Vue.prototype.axios = axios;

new Vue({
    el: '#app',
    render: h => h(App)
})
