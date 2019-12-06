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
                    <v-list-item v-for="passenger in passengers" v-bind:key="passenger.id">
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
                        <td>{{ fetchVehicleData(item.vehicleId) }}</td>
                    </tr>
                </template>
            </v-data-table>
        </div>
    </v-container>
</template>

<script>
    export default {
        name: "DriverTools",

        data: function() {
            return {
                currentRide: {
                    firstName: "",
                    lastName: "",
                    phone: "",
                    licenseNumber: "",
                    id: ""
                },
                currentPassengerString: "Choose a passenger",

                drivers: [],

                headers: [
                    { text: "Date", value: "date"},
                    { text: "Time", value: "time"},
                    { text: "Start Location", value: "startlocation"},
                    { text: "End Location", value: "endlocation"}
                ]
            }
        },

        mounted: function() {
            this.$axios.get("/passenger").then(response => {
                this.passengers = response.data.map(thisPassenger => ({
                    firstName: thisPassenger.firstname,
                    lastName: thisPassenger.lastname,
                    phone: thisPassenger.phone,
                    id: thisPassenger.id,
                }));
                console.log("mapped");
            })
        },

        methods: {
            updateCurrent(thisPassenger) {
                this.currentPassenger = thisPassenger;
                this.currentPassengerString = this.getPassengerString(thisPassenger);
            },

            getPassengerString(thisPassenger) {
                return `${thisPassenger.firstName} ${thisPassenger.lastName} phone: ${thisPassenger.phone}`;
            },

            getRides: function() {
                this.$axios.get("/ride").then(response => {
                    this.rides = response.data.map(thisRide => ({
                        id: thisRide.id,
                        date: thisRide.date,
                        time: thisRide.time,
                        fromLocationId: thisRide.fromlocationid,
                        toLocationId: thisRide.tolocationid
                    }));
                })
            }
        }
    }

</script>