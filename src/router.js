import Vue from "vue";
import Router from "vue-router";

import Home from "./pages/Home.vue";
import AuthAdmin from "./pages/admin/auth-admin.vue";
import RidesAdmin from "./pages/admin/rides-admin.vue";
import VehicleAdmin from "./pages/admin/vehicles-admin.vue";
import Passenger from "./pages/Passenger.vue";
import PassengerSignUp from "./pages/PassengerSignUp.vue";
import PassengerRideSignUp from "./pages/PassengerRideSignUp.vue";
import PassengerRideReport from "./pages/PassengerRideReport.vue";
import Driver from "./pages/Driver.vue";
import DriverSignUp from "./pages/DriverSignUp.vue";
import DriverTools from "./pages/DriverTools.vue";
import About from "./pages/About.vue";


Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        { name: "home-page", path: "/", component: Home },
        { name: "auth-admin", path: "/admin/authorization", component: AuthAdmin },
        { name: "rides-admin", path: "/admin/rides", component: RidesAdmin },
        { name: "vehicles-admin", path: "/admin/vehicles", component: VehicleAdmin },
        { name: "passenger", path: "/find-ride", component: Passenger },
        { name: "passenger-sign-up", path:"/find-ride/passenger-sign-up", component: PassengerSignUp },
        { name: "passenger-ride-sign-up", path:"/find-ride/passenger-ride-sign-up", component: PassengerRideSignUp },
        { name: "passenger-ride-report", path:"/find-ride/passenger-ride-report", component: PassengerRideReport },
        { name: "driver", path: "/driver", component: Driver },
        { name: "driver-sign-up", path: "/driver/sign-up", component: DriverSignUp },
        { name: "driver-tools", path: "/driver/tools", component: DriverTools },
        { name: "about", path: "/about-us", component: About }
    ]
})