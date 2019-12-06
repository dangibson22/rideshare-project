<template>
    <v-container>
        <div>
            <h4 class="display-3">Taylor University Rideshare</h4><br>

            <span class="display-1">Need a ride?</span><br>
            <v-btn color="primary" :to="{ name: passenger }">Find a ride</v-btn>
            <br><br>
            <span class="display-1">Want to drive?</span><br>
            <v-btn color="primary" :to="{ name: driver }">Become a driver</v-btn>
        </div>
    </v-container>
</template>