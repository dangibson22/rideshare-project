<template>
    <v-app-bar app class="mt-0 mb-0" dark color="primary">
        <router-link v-bind:to="{name: 'home-page' }">
            <v-toolbar-title class="white--text">
                Ride Sharing
            </v-toolbar-title>
        </router-link>

        <v-spacer></v-spacer>

        <v-btn style="height: 100%; border-radius: 0px;" text v-bind:to="{ name: 'passenger' }">Find a Ride</v-btn>
        <v-divider vertical></v-divider>
        <v-btn style="height: 100%; border-radius: 0px;" text v-bind:to="{ name: 'about' }">About Us</v-btn>
        <v-divider vertical></v-divider>
        <v-btn style="height: 100%; border-radius: 0px;" text v-bind:to="{ name: 'driver' }">Driver</v-btn>
        <v-divider vertical></v-divider>

        <v-menu offset-y>
            <template v-slot:activator="{ on }">
                <v-btn style="height: 100%; border-radius: 0px;" text v-on="on">
                    <span>Admin</span>
                    <v-icon dark>mdi-menu-down</v-icon>
                </v-btn>
            </template>

            <v-list>
                <v-list-item v-bind:to="{ name: 'vehicles-admin' }">
                    <v-list-item-title>Manage Vehicles</v-list-item-title>
                </v-list-item>
                <v-list-item v-bind:to="{ name: 'rides-admin' }">
                    <v-list-item-title>Manage Rides</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

    </v-app-bar>
</template>