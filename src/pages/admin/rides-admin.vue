<template>
    <v-container>
        <div>
            <h4 class="display-2 mb-2 ml-1">Ride Management</h4>

            <div>
                <v-btn color="primary" class="ma-1" @click="showAddRide">Create new ride</v-btn>
                <v-btn color="primary" class="ma-1" @click="showAddLocation">Add new location</v-btn>
            </div>

            <v-data-table class="ma-1">

            </v-data-table>

            <div class="text-xs-center">
                <v-dialog v-model="addRideVisible">
                    <v-card>
                        <v-card-title primary-title>
                            Create a new ride
                        </v-card-title>
                        <v-card-text>
                            <v-form v-model="validRide">
                                <v-menu
                                        v-model="dateMenu"
                                        :close-on-content-click="false"
                                        offset-y
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            v-model="newRide.date"
                                            label="Date of ride"
                                            prepend-icon="mdi-calendar"
                                            readonly
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="newRide.date"
                                        @input="setDate"
                                    >
                                    </v-date-picker>
                                </v-menu>
                                <v-text-field
                                        v-model="newRide.time"
                                        v-bind:rules="rideRules.time"
                                        label="Time (24-hr time)"
                                ></v-text-field>
                                <v-text-field
                                        v-model="newRide.distance"
                                        v-bind:rules="rideRules.required"
                                        label="Distance (miles)"
                                ></v-text-field>
                                <v-menu offset-y>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            v-model="newRide.fromLocString"
                                            label="Start location for ride"
                                            readonly
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-list>
                                        <v-list-item v-for="loc in locations" v-bind:key="loc.id" @click="newRide.fromLocation = loc; newRide.fromLocString = getLocString(loc)">
                                            {{ getLocString(loc) }}
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                                <v-menu offset-y>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                                v-model="newRide.toLocString"
                                                label="End location for ride"
                                                readonly
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-list>
                                        <v-list-item v-for="loc in locations" v-bind:key="loc.id" @click="newRide.toLocation = loc; newRide.toLocString = getLocString(loc)">
                                            {{ getLocString(loc) }}
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                                <v-btn color="primary" class="ma-1" :disabled="!validRide" @click="createRide">Create Ride</v-btn>
                                <v-btn text color="primary" class="ma-1" @click="hideAddRide">Cancel</v-btn>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </div>

            <div class="text-xs-center">
                <v-dialog v-model="addLocationVisible">
                    <v-card>
                        <v-card-title primary-title>
                            Add a new location
                        </v-card-title>
                        <v-card-text>
                            <v-form v-model="validLocation">
                                <v-text-field
                                    v-model="newLocation.name"
                                    v-bind:rules="locationRules.required"
                                    label="Name for this location"
                                ></v-text-field>
                                <v-text-field
                                        v-model="newLocation.address"
                                        v-bind:rules="locationRules.required"
                                        label="Address"
                                ></v-text-field>
                                <v-text-field
                                        v-model="newLocation.city"
                                        v-bind:rules="locationRules.required"
                                        label="City"
                                ></v-text-field>
                                <v-text-field
                                        v-model="newLocation.state"
                                        v-bind:rules="locationRules.state"
                                        label="State"
                                ></v-text-field>
                                <v-text-field
                                        v-model="newLocation.zip"
                                        v-bind:rules="locationRules.zip"
                                        label="Zip code"
                                ></v-text-field>
                                <v-btn color="primary" class="ma-1" :disabled="!validLocation" @click="addLocation">Add Location</v-btn>
                                <v-btn text color="primary" class="ma-1" @click="hideAddLocation">Cancel</v-btn>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-dialog>
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

        </div>
    </v-container>
</template>

<script>
    export default {

        name: "rides-admin",

        data: function() {
            return {

                dialogHeader: "<no dialogHeader>",
                dialogText: "<no dialogText>",
                dialogVisible: false,

                dateMenu: false,
                addRideVisible: false,
                validRide: false,
                rideAdded: false,

                addLocationVisible: false,
                validLocation: false,
                locationAdded: false,


                rideRules: {
                    required: [val => val.length > 0 || "Required"],
                    time: [
                        val => /^1\d:\d\d$/.test(val) || /^2[1-3]:\d\d/.test(val) || "24 hour time, 00:00 format"
                    ]
                },

                locationRules: {
                    required: [val => val.length > 0 || "Required"],
                    state: [ val => /^[A-Z]{2}$/.test(val) || "2-letter state format (ex: IN)"],
                    zip: [val => /^\d{5}$/.test(val) || "5-number zip code format"]
                },

                newRide: {
                    date: "",
                    time: "",
                    distance: 0,
                    fuelprice: 0,
                    fee: 0,
                    vehicleId: 0,
                    fromLocation: null,
                    fromLocString: "",
                    toLocation: null,
                    toLocString: ""
                },

                defRide: {
                    date: "",
                    time: "",
                    distance: 0,
                    fuelprice: 0,
                    fee: 0,
                    vehicleId: 0,
                    fromLocationId: null,
                    toLocationId: null
                },

                newLocation: {
                    name: "",
                    address: "",
                    city: "",
                    state: "",
                    zip: 0
                },

                defLocation: {
                    name: "",
                    address: "",
                    city: "",
                    state: "",
                    zip: 0
                },

                rides: [],
                locations: [],



            }
        },

        mounted: function() {
            this.getRides();
            this.getLocations();
            this.dateMenu = false;
        },

        methods: {

            setDate: function() {
                this.dateMenu = false;
            },

            addLocation: async function() {
                this.locationAdded = false;
                let state = this.newLocation.state;
                let a = false;
                await this.$axios.put(`/state/${state}`)
                .then(result => {
                    console.log(result.data.length, !result.data.length);
                    if (result.data.length===0) {
                        this.showDialog("Error", "State does not exist!");
                        a = true;
                    }
                });

                if (a) { return; }

                this.$axios
                    .post("/location", {
                        name: this.newLocation.name,
                        address: this.newLocation.address,
                        city: this.newLocation.city,
                        state: this.newLocation.state,
                        zipcode: this.newLocation.zip
                })
                .then(result => {
                    if (result.status === 200) {
                        if (result.data.ok) {
                            this.showDialog("Success", result.data.msge);
                            this.locationAdded = true;
                        } else {
                            this.showDialog("Sorry", result.data.msge);
                        }
                    }
                })
                .catch(err => this.showDialog("Failed", err));
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
                        zip: thisLoc.zipcode
                    }));
                })
            },

            showAddRide: function() {
                this.addRideVisible = true;
            },

            hideAddRide: function() {
                this.addRideVisible = false;
                console.log(this.newRide);
            },

            showAddLocation: function() {
                this.addLocationVisible = true;
            },

            hideAddLocation: function() {
                this.addLocationVisible = false;
                this.newLocation = this.defLocation;
            },

            showDialog: function(header, text) {
                this.dialogHeader = header;
                this.dialogText = text;
                this.dialogVisible = true;
            },

            hideDialog: function() {
                this.dialogVisible = false;
                if (this.locationAdded) {
                    this.hideAddLocation();
                }
            },

            getLocString: function(loc) {
                return `${loc.address} ${loc.city} ${loc.zip}`;
            }
        }
    }
</script>