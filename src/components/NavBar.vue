<template>
    <v-app-bar app dark color="primary">
        <router-link v-bind:to="{name: 'home-page' }">
            <v-toolbar-title class="white--text">
                Ride Sharing
            </v-toolbar-title>
        </router-link>

        <v-spacer></v-spacer>

        <v-btn v-bind:to="{ name: 'passenger' }">Find a Ride</v-btn>
        <v-btn v-bind:to="{ name: 'driver' }">Become a Driver</v-btn>
        <v-btn v-bind:to="{ name: 'about' }">About Us</v-btn>

        <v-menu offset-y>
            <template v-slot:activator="{ on }">
                <v-btn text v-on="on">
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
                <v-list-item v-bind:to="{ name: 'auth-admin' }">
                    <v-list-item-title>Manage Authorizations</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

    </v-app-bar>
</template>