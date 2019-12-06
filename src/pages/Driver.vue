<template>
    <v-container>
        <div>
            <h1 class="display-1">Want to become a driver?</h1><br>
            <v-btn color="primary" v-bind:to="{ name: 'driver-sign-up' }">Sign up here</v-btn><br><br>
            <h1 class="display-1">Already signed up to drive?</h1><br>
            <v-btn color="primary" v-bind:to="{ name: 'driver-tools' }">Find a ride to drive for</v-btn>
        </div>
    </v-container>
</template>