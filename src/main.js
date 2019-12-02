import Vue from "vue";
import vuetify from "./plugins/Vuetify.js";
import router from "./router";
import axios from "axios";
import App from "./App.vue";

const axiosClient = axios.create({
    baseURL: "http://localhost:3000"
});
Vue.prototype.$axios = axiosClient;

console.log("main");

new Vue({
    el: "#app",
    data: {
        currentUser: null
    },
    router,
    vuetify,
    render: h => h(App)
});