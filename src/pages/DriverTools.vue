<template>
    <v-container>
        <div>
            <v-btn v-bind:to="{ name: 'driver' }">Back</v-btn>
            <br><br>
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
            <br><br>
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
            locations: [],


            headers: [
                { text: "Date", value: "date"},
                { text: "Time", value: "time"},
                { text: "Start Location", value: "startlocation"},
                { text: "End Location", value: "endlocation"},
                { text: "Action", value: "action" }
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

            await this.$axios.get(`/authorization/driver/${thisDriver.id}`).then(response => {
                for (var i = 0; i < response.data.length; i++) {
                    this.validVehicleIds.push(Number(response.data[i].vehicleid));
                }
            });
            await this.$axios.put(`/rides/findByVehicle`, {
                validVehicleIds: this.validVehicleIds
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
        },

        fetchLocationData: function(id) {
            let i = this.locations.findIndex(x => x.id === id);
            return this.getLocString(this.locations[i]);
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
        },

        test: function() {
            this.$axios.get("/drivers").then(response => {
                console.log(response);
            })
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

        signUpDriver: function(thisRide, thisDriver) {
            console.log("data: ", thisRide, thisDriver);
            this.$axios
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
        },

        getDriverString(thisDriver) {
            return `Name: ${thisDriver.firstName} ${thisDriver.lastName} | Phone: ${thisDriver.phone}`;
        },

        getLocString: function(loc) {
            return `${loc.address} ${loc.city} ${loc.zipcode}`;
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