<template>
    <v-app>
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

    export default {
        name: "App",
        components: {

        }
    };
</script>