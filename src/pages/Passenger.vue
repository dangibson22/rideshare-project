<template>
    <v-container>
        <div>
            <h4 class="display-1">Need a ride? We're here to help</h4><br>
            <v-btn v-bind:to="{ name: 'passenger-sign-up' }">Sign Up Here</v-btn><br><br>
            <h4 class="display-1">Sign up for a Specific Ride</h4><br>
            <v-btn v-bind:to="{ name: 'passenger-ride-sign-up' }">Specific Ride Sign Up Here</v-btn><br><br>
            <h4 class="display-1">Get Upcoming Rides Report</h4><br>
            <v-btn v-bind:to="{ name: 'passenger-ride-report' }">Ride Report</v-btn><br><br>
        </div>
    </v-container>
</template>