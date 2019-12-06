<template>
    <v-container>
        <div>
            <v-btn color="primary" text v-bind:to="{ name: 'driver' }">&lt; Back</v-btn>
            <br><br>
            <h2>First, we need to know who you are.</h2>
            <v-menu offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn color="primary" v-on="on">
                        <span>{{ currentDriverString }}</span>
                        <v-icon dark>mdi-menu-down</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="driver in drivers" v-bind:key="driver.id" @click="updateCurrent(driver)">
                        <span>{{ getDriverString(driver) }}</span>
                    </v-list-item>
                </v-list>
            </v-menu>
            <br><br><br>
            <h4 class="display-2">Sign Up to Drive</h4><br>
            <v-data-table
                    class="elevation-1"
                    v-bind:headers="headers"
                    v-bind:items="validRides"
            >
                <template v-slot:item="{ item }">
                    <tr>
                        <td>{{ item.date }}</td>
                        <td>{{ item.time }}</td>
                        <td>{{ fetchLocationData(item.fromLocationId) }}</td>
                        <td>{{ fetchLocationData(item.toLocationId) }}</td>
                        <td>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                        color="primary"
                                        smalldark
                                        class="ma-1"
                                        v-on="on"
                                        @click="signUpDriver(item, currentDriver)"
                                    >
                                        <v-icon>mdi-clipboard-plus</v-icon>
                                    </v-btn>
                                </template>
                                <span>Sign up to drive</span>
                            </v-tooltip>
                        </td>
                    </tr>
                </template>
            </v-data-table><br>
            <h4 class="display-2">Rides You're Scheduled to Drive For</h4><br>
            <v-data-table
                class="elevation-1"
                v-bind:headers="signedUpHeaders"
                v-bind:items="signedUpRides"
            >
                <template v-slot:item="{ item }">
                    <tr>
                        <td>{{ item.date }}</td>
                        <td>{{ item.time }}</td>
                        <td>{{ fetchLocationData(item.fromLocationId) }}</td>
                        <td>{{ fetchLocationData(item.toLocationId) }}</td>
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
    name: "DriverTools",

    data: function() {
        return {
            dialogHeader: "<no dialogHeader>",
            dialogText: "<no dialogText>",
            dialogVisible: false,

            currentDriver: {
                firstName: "",
                lastName: "",
                phone: "",
                licenseNumber: "",
                id: 0
            },
            currentDriverString: "Choose a driver",

            drivers: [],
            validVehicleIds: [],
            validRides: [],
            signedUpRideIds: [],
            signedUpRides: [],
            locations: [],


            headers: [
                { text: "Date", value: "date"},
                { text: "Time", value: "time"},
                { text: "Start Location", value: "startlocation"},
                { text: "End Location", value: "endlocation"},
                { text: "Action", value: "action" }
            ],
            signedUpHeaders: [
                { text: "Date", value: "date"},
                { text: "Time", value: "time"},
                { text: "Start Location", value: "startlocation"},
                { text: "End Location", value: "endlocation"},
            ]
        }
    },

    mounted: function() {
        this.getDrivers();
        this.getLocations();
    },

    methods: {
        updateCurrent: async function(thisDriver) {
            this.currentDriver = thisDriver;
            this.currentDriverString = this.getDriverString(thisDriver);
            this.validVehicleIds = [];
            this.signedUpRideIds = [];

            await this.$axios.get(`/authorization/driver/${thisDriver.id}`).then(response => {
                for (var i = 0; i < response.data.length; i++) {
                    this.validVehicleIds.push(Number(response.data[i].vehicleid));
                }
            });
            await this.$axios.put(`/rides/findByVehicleId`, {
                inputArray: this.validVehicleIds
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
            })

            await this.$axios.get(`drivers/${thisDriver.id}`).then(response => {
                for (var i = 0; i < response.data.length; i++) {
                    this.signedUpRideIds.push(Number(response.data[i].rideid));
                }
            });
            console.log(this.signedUpRideIds);
            await this.$axios.put("/rides/findByRideIdArray", {
                inputArray: this.signedUpRideIds
            })
            .then(response => {
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
            })
        },

        fetchLocationData: function(id) {
            let i = this.locations.findIndex(x => x.id === id);
            return this.getLocString(this.locations[i]);
        },

        getDrivers: function() {
            this.$axios.get("/driver").then(response => {
                this.drivers = response.data.map(thisDriver => ({
                    firstName: thisDriver.firstname,
                    lastName: thisDriver.lastname,
                    phone: thisDriver.phone,
                    licenseNumber: thisDriver.licensenumber,
                    id: thisDriver.id,
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

        getSignedUpRides: async function() {
            console.log("updating!");
            await this.$axios.get(`drivers/${this.currentDriver.id}`).then(response => {
                for (var i = 0; i < response.data.length; i++) {
                    this.signedUpRideIds.push(Number(response.data[i].rideid));
                }
            });
            await this.$axios.put("/rides/findByRideIdArray", {
                inputArray: this.signedUpRideIds
            })
            .then(response => {
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
            })
        },

        signUpDriver: async function(thisRide, thisDriver) {
            console.log("data: ", thisRide, thisDriver);
            await this.$axios
                .post("/drivers", {
                    driverId: thisDriver.id,
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
            this.getSignedUpRides();
        },

        getDriverString(thisDriver) {
            return `Name: ${thisDriver.firstName} ${thisDriver.lastName} | Phone: ${thisDriver.phone}`;
        },

        getLocString: function(loc) {
            return `${loc.address} ${loc.city}, ${loc.state} ${loc.zipcode}`;
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