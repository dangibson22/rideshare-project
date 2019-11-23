<template>
    <v-app>
        <nav-bar />
        <v-content>
            <v-container> <router-view></router-view> </v-container>
        </v-content>
        <v-footer class="pa-3">
            <v-layout class="font-weight-thin">that's really sad</v-layout>
        </v-footer>
    </v-app>
</template>

<script>
    console.log("loaded");
    import NavBar from "./components/NavBar.vue";

    export default {
        name: "App",
        components: {
            NavBar
        }
    };
</script>