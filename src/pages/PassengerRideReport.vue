<template>
    <v-container>
        <div>
            <v-btn v-bind:to="{ name: 'passenger' }">Back</v-btn>
            <br><br>
            <h4 class="display-2 mb-2 ml-1">Ride Report</h4>

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
                    class="elevation-1 ma-1"
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
                        <td>{{ fetchVehicleData(item.vehicleId) }}</td>
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
                currentPassenger: {
                    firstName: "",
                    lastName: "",
                    phone: "",
                    id: ""
                },
                currentPassengerString: "Choose a passenger",

                rides: [],
                locations: [],
                vehicles: [],

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
            this.getRides();
            this.getLocations();
            this.getVehicles();
        },

        methods: {
            //getPassengers: function() {
            //    this.$axios.get("/passengers")
            //}

            updateCurrent: async function(thisPassenger) {
                this.currentPassenger = thisPassenger;
                this.currentPassengerString = this.getPassengerString(thisPassenger);
                this.findValidVehicles(thisPassenger.id);
            },

            fetchLocationData: function(id) {
                let i = this.locations.findIndex(x => x.id === id);
                return this.getLocString(this.locations[i]);
            },

            fetchVehicleData: function(id) {
                let i = this.vehicles.find(x => x.id === id);
                return i.licenseNumber;
            },

            getRides: function() {
                this.$axios.get("/ride").then(response => {
                    this.rides = response.data.map(thisRide => ({
                        id: thisRide.id,
                        date: thisRide.date,
                        time: thisRide.time,
                        distance: thisRide.distance,
                        fuelPrice: thisRide.fuelprice,
                        fee: thisRide.fee,
                        vehicleId: thisRide.vehicleid,
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

            getVehicles: function() {
                this.$axios.get("/vehicles").then(response => {
                    this.vehicles = response.data.map(vehicle => ({
                        id: vehicle.id,
                        make: vehicle.make,
                        model: vehicle.model,
                        color: vehicle.color,
                        capacity: vehicle.capacity,
                        mpg: vehicle.mpg,
                        licenseState: vehicle.licensestate,
                        licenseNumber: vehicle.licensenumber
                    }));
                });
            },


            getLocString: function(loc) {
                return `${loc.address} ${loc.city} ${loc.zipcode}`;
            }
        }
    }
</script>