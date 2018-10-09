import Vue from 'vue';
import VueRouter from 'vue-router';
import {router} from './route/route';
Vue.use(VueRouter);


 const app = new Vue({router}).$mount("#app")