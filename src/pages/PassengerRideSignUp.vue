<template>
    <v-container>
        <div>
            <v-btn v-bind:to="{ name: 'passenger' }">&lt; Back</v-btn>
            <br><br>
            <v-menu offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn text v-on="on">
                        <span>{{ currentPassengerString }}</span>
                        <v-icon dark>mdi-menu-down</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="passenger in passengers" v-bind:key="passenger.id" @click="updateCurrent(passenger)">
                        <span>{{ getPassengerString(passenger) }}</span>
                    </v-list-item>
                </v-list>
            </v-menu>
            <br><br>
            <v-data-table
                    class="elevation-1"
                    v-bind:headers="headers"
                    v-bind:items="rides"
            >
                <template v-slot:item="{ item }">
                    <tr>
                        <td>{{ item.date }}</td>
                        <td>{{ item.time }}</td>
                        <td>{{ item.fee.toFixed(2) }}</td>
                        <td>{{ fetchLocationData(item.fromLocationId) }}</td>
                        <td>{{ fetchLocationData(item.toLocationId) }}</td>
                        <td>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                        color="primary"
                                        small
                                        dark
                                        class="ma-1"
                                        v-on="on"
                                        @click="signUpPassenger(item, currentPassenger)">
                                        <v-icon>mdi-car-side</v-icon>
                                    </v-btn>
                                </template>
                                <span>Sign up for this ride</span>
                            </v-tooltip>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>

        <div class="text-xs-center">
            <v-dialog v-model="dialogVisible" width="500">
                <v-card>
                    <v-card-title primary-title>
                        {{ dialogHeader }}
                    </v-card-title>

                    <v-card-text>
                        {{ dialogText }}
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" text v-on:click="hideDialog">Okay</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </v-container>
</template>

<script>
    export default {
        name: "PassengerRideSignUp",

        data: function() {
            return {
                dialogHeader: "<no dialogHeader>",
                dialogText: "<no dialogText>",
                dialogVisible: false,

                currentPassenger: {
                    firstName: "",
                    lastName: "",
                    phone: "",
                    id: 0
                },
                currentPassengerString: "Choose a passenger",

                headers: [
                    { text: "Date", value: "date"},
                    { text: "Time", value: "time"},
                    { text: "Cost", value: "fee" },
                    { text: "Start Location", value: "startloc"},
                    { text: "End Location", value: "endloc"},
                    { text: "Action", value: "action" }
                ],

                passengers: [],
                locations: [],
                rides: [],
            }
        },

        mounted: function() {
            this.getRides();
            this.getPassengers();
            this.getLocations();
        },

        methods: {
            updateCurrent(thisPass) {
                this.currentPassenger = thisPass;
                this.currentPassengerString = this.getPassengerString(thisPass);
            },

            fetchLocationData: function(id) {
                let i = this.locations.findIndex(x => x.id === id);
                return this.getLocString(this.locations[i]);
            },



            signUpPassenger(thisRide, thisPass) {
                this.$axios
                    .post("/passengers", {
                        passengerId: thisPass.id,
                        rideId: thisRide.id
                    })
                    .then(result => {
                        if (result.status === 200) {
                            if (result.data.ok) {
                                this.showDialog("Success", result.data.msge);
                                console.log(result.data);
                            } else {
                                this.showDialog("Sorry", result.data.msge);
                            }
                        }
                    })
                    .catch(err => { this.showDialog("Failed", err); console.log(err); } );
            },

            getRides: function() {
                this.$axios.get("/ride").then(response => {
                    this.rides = response.data.map(thisRide => ({
                        id: thisRide.id,
                        date: thisRide.date,
                        time: thisRide.time,
                        fuelPrice: thisRide.fuelprice,
                        fee: thisRide.fee,
                        vehicleId: thisRide.vehicleid,
                        fromLocationId: thisRide.fromlocationid,
                        toLocationId: thisRide.tolocationid
                    }));
                })
            },

            getPassengers: function() {
                this.$axios.get("/passenger").then(response => {
                    this.passengers = response.data.map(thisPassenger => ({
                        firstName: thisPassenger.firstname,
                        lastName: thisPassenger.lastname,
                        phone: thisPassenger.phone,
                        id: thisPassenger.id,
                    }));
                })
            },

            getLocations: function() {
                this.$axios.get("/locations").then(response => {
                    this.locations = response.data.map(thisLoc => ({
                        id: thisLoc.id,
                        name: thisLoc.name,
                        address: thisLoc.address,
                        city: thisLoc.city,
                        state: thisLoc.state,
                        zipcode: thisLoc.zipcode,
                    }));
                })
            },

            getLocString: function(loc) {
                console.log(loc.address);
                return `${loc.address} ${loc.city} ${loc.zipcode}`;
            },

            getPassengerString: function(pass) {
                return `Name: ${pass.firstName} ${pass.lastName} | Phone: ${pass.phone}`;
            },

            showDialog: function(header, text) {
                this.dialogHeader = header;
                this.dialogText = text;
                this.dialogVisible = true;
            },

            hideDialog: function() {
                this.dialogVisible = false;
            }
        }
    }

</script>