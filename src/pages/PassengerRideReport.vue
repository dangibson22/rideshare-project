<template>
    <v-container>
        <div>
            <v-btn v-bind:to="{ name: 'passenger' }">Back</v-btn>
            <br><br>
            <h4 class="display-2 mb-2 ml-1">Ride Report</h4>

            <v-menu offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn color="primary" v-on="on">
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
            <p>Data is there but is shy, check vue debugger</p>
            <v-data-table
                    class="elevation-1 ma-1"
                    v-bind:headers="headers"
                    v-bind:items="validRides"
            >
                <template v-slot:item="{ item }">
                    <tr>
                        <td>{{ item.date }}</td>
                        <td>{{ item.time }}</td>
                        <td>{{ item.fee.toFixed(2) }}</td>
                        <td>{{ fetchLocationData(item.fromLocationId) }}</td>
                        <td>{{ fetchLocationData(item.toLocationId) }}</td>
                        <!--<td>{{ fetchVehicleData(item.vehicleId) }}</td>-->
                    </tr>
                </template>
            </v-data-table>
        </div>
    </v-container>
</template>

<script>
    export default {

        name: "passenger-ride-report",

        data: function() {
            return {
                dialogHeader: "<no dialogHeader>",
                dialogText: "<no dialogText>",
                dialogVisible: false,

                currentPassenger: {
                    firstName: "",
                    lastName: "",
                    phone: "",
                    id: ""
                },
                currentPassengerString: "Choose a passenger",

                signedUpRides: [],
                locations: [],
                vehicles: [],
                passengers: [],
                validRides: [],

                headers: [
                    { text: "Date", value: "date" },
                    { text: "Time", value: "time" },
                    { text: "Price", value: "fee" },
                    { text: "Start", value: "fromLocation" },
                    { text: "Destination", value: "toLocation" },
                    { text: "Vehicle License Plate", value: "vehicle" }
                ]


            }
        },

        mounted: function() {
            //this.getRides(currentPassenger.id);
            this.getLocations();
            //this.getVehicles();
            this.getPassengers();
        },

        methods: {
            updateCurrent: async function(thisPassenger) {
                this.currentPassenger = thisPassenger;
                this.currentPassengerString = this.getPassengerString(thisPassenger);
                this.validRideIds = [];

                await this.$axios.get(`/find-ride/${thisPassenger.id}`).then(response => {
                    for (var i = 0; i < response.data.length; i++) {
                        this.validRideIds.push(Number(response.data[i].rideid));
                    }
                });
                await this.$axios.put(`/rides/findByRideIdArray`, {
                    inputArray: this.validRideIds
                })
                .then(response => {
                    this.validRides = response.data.map(thisRide => ({
                        id: thisRide.id,
                        date: thisRide.date,
                        time: thisRide.time,
                        distance: thisRide.distance,
                        fuelPrice: thisRide.fuelprice,
                        fee: thisRide.fee,
                        vehicleId: thisRide.vehicleid,
                        fromLocationId: thisRide.fromlocationid,
                        toLocationId: thisRide.tolocationid
                    }))
                    console.log(this.validRides);
                })

                await this.$axios.get(`/find-ride/${thisPassenger.id}`).then(response => {
                    for (var i = 0; i < response.data.length; i++) {
                        //this.signedUpRideIds.push(Number(response.data[i].rideid));
                    }
                });
                for(var i=0; i <this.validRideIds.length;i++) {
                    //console.log(this.validRideIds[i]);
                }
                await this.$axios.put("/rides/findByRideIdArray", {
                    inputArray: this.validRideIds
                })
               /* .then(response => {
                    this.signedUpRides = response.data.map(thisRide => ({
                        id: thisRide.id,
                        date: thisRide.date,
                        time: thisRide.time,
                        distance: thisRide.distance,
                        fuelPrice: thisRide.fuelprice,
                        fee: thisRide.fee,
                        vehicleId: thisRide.vehicleid,
                        fromLocationId: thisRide.fromlocationid,
                        toLocationId: thisRide.tolocationid
                    }))
                })*/
            },

            getPassengers: function() {
                this.$axios.get(`/find-ride/passenger-ride-report`).then(response => {
                    this.passengers = response.data.map(thisPassenger => ({
                        firstName: thisPassenger.firstname,
                        lastName: thisPassenger.lastname,
                        phone: thisPassenger.phone,
                        id: thisPassenger.id,
                    }));
                })
            },

            getPassengerString(thisPassenger) {
                return `${thisPassenger.firstName} ${thisPassenger.lastName} phone: ${thisPassenger.phone}`;
            },

            getRides: function(id) {
                this.$axios.get(`/find-ride/${id}`).then(response => {
                    this.rides = response.data.map(thisRide => ({
                        id: thisRide.id,
                        date: thisRide.date,
                        time: thisRide.time,
                        fromLocationId: thisRide.fromlocationid,
                        toLocationId: thisRide.tolocationid
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
        }
    }
</script>