<template>
    <v-container>
        <div>
            <h4 class="display-2 mb-2 ml-1">Ride Management</h4>

            <v-card>
                <v-card-text>
                    <v-btn color="primary" class="ma-1" @click="showAddRide">Create new ride</v-btn>
                    <v-btn color="primary" class="ma-1" @click="showAddLocation">Add new location</v-btn>
                </v-card-text>
            </v-card>

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
                        <td>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                            color="primary"
                                            small
                                            dark
                                            class="ma-1"
                                            v-on="on"
                                            @click="showEditRide(item)"
                                    >
                                        <v-icon> mdi-pencil</v-icon>
                                    </v-btn>
                                </template>
                                <span>Edit vehicle</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                        color="primary"
                                        small
                                        dark
                                        class="ma-1"
                                        v-on="on"
                                        @click="showDrivers(item)"
                                    >
                                        <v-icon>mdi-car-side</v-icon>
                                    </v-btn>
                                </template>
                                <span>View drivers</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                        color="primary"
                                        small
                                        dark
                                        class="ma-1"
                                        v-on="on"
                                        @click="showPassengers(item)"
                                    >
                                        <v-icon>mdi-account-group</v-icon>
                                    </v-btn>
                                </template>
                                <span>View passengers</span>
                            </v-tooltip>
                        </td>

                    </tr>
                </template>

            </v-data-table>

            <div class="text-xs-center">
                <v-dialog v-model="addRideVisible" width="1000">
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
                                            :rules="rideRules.required"
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
                                            :rules="rideRules.location"
                                            label="Start location for ride"
                                            readonly
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-list>
                                        <v-list-item @click="newRide.fromlocation = null; newRide.fromLocString = null; newRide.fromLocId = 0"><span>None</span></v-list-item>
                                        <v-list-item v-for="loc in locations" v-bind:key="loc.id" @click="newRide.fromLocation = loc; newRide.fromLocString = getLocString(loc); newRide.fromLocId = loc.id">
                                            {{ getLocString(loc) }}
                                        </v-list-item>
                                    </v-list>
                                </v-menu>

                                <v-menu offset-y>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                                v-model="newRide.toLocString"
                                                :rules="rideRules.location"
                                                label="End location for ride"
                                                readonly
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-list>
                                        <v-list-item @click="newRide.toLocation = null; newRide.toLocString = null; newRide.fromLocId = 0"><span>None</span></v-list-item>
                                        <v-list-item v-for="loc in locations" v-bind:key="loc.id" @click="newRide.toLocation = loc; newRide.toLocString = getLocString(loc); newRide.toLocId = loc.id">
                                            {{ getLocString(loc) }}
                                        </v-list-item>
                                    </v-list>
                                </v-menu>

                                <v-menu offset-y>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                                v-model="newRide.vehicleLicense"
                                                :rules="rideRules.vehicle"
                                                label="Vehicle being used for ride (license plate number)"
                                                readonly
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-list>
                                        <v-list-item @click="newRide.vehicleLicense = ``; newRide.vehicleId = 0; newRide.vehicle = null; "><span>None</span></v-list-item>
                                        <v-list-item v-for="vehicle in vehicles" v-bind:key="vehicle.id" @click="newRide.vehicleId = vehicle.id; newRide.vehicleLicense = vehicle.licenseNumber; newRide.vehicle = vehicle;">
                                            {{ vehicle.licenseNumber }}
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
                <v-dialog v-model="editRideVisible" width="1000">
                    <v-card>
                        <v-card-title primary-title>
                            Edit ride
                        </v-card-title>
                        <v-card-text>
                            <v-form v-model="validRide">
                                <v-menu
                                        v-model="editDateMenu"
                                        :close-on-content-click="false"
                                        offset-y
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                                v-model="editingRide.date"
                                                label="Date of ride"
                                                :rules="rideRules.required"
                                                prepend-icon="mdi-calendar"
                                                readonly
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                            v-model="editingRide.date"
                                            @input="setDate"
                                    >
                                    </v-date-picker>
                                </v-menu>

                                <v-text-field
                                        v-model="editingRide.time"
                                        v-bind:rules="rideRules.time"
                                        label="Time (24-hr time)"
                                ></v-text-field>

                                <v-text-field
                                        v-model="editingRide.distance"
                                        v-bind:rules="rideRules.required"
                                        label="Distance (miles)"
                                ></v-text-field>


                                <v-menu offset-y>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                                v-model="editingRide.fromLocString"
                                                :rules="rideRules.location"
                                                label="Start location for ride"
                                                readonly
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-list>
                                        <v-list-item @click="editingRide.fromlocation = null; editingRide.fromLocString = null; editingRide.fromLocId = 0"><span>None</span></v-list-item>
                                        <v-list-item v-for="loc in locations" v-bind:key="loc.id" @click="editingRide.fromLocation = loc; editingRide.fromLocString = getLocString(loc); editingRide.fromLocId = loc.id">
                                            {{ getLocString(loc) }}
                                        </v-list-item>
                                    </v-list>
                                </v-menu>

                                <v-menu offset-y>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                                v-model="editingRide.toLocString"
                                                :rules="rideRules.location"
                                                label="End location for ride"
                                                readonly
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-list>
                                        <v-list-item @click="editingRide.toLocation = null; editingRide.toLocString = null; editingRide.fromLocId = 0"><span>None</span></v-list-item>
                                        <v-list-item v-for="loc in locations" v-bind:key="loc.id" @click="editingRide.toLocation = loc; editingRide.toLocString = getLocString(loc); editingRide.toLocId = loc.id">
                                            {{ getLocString(loc) }}
                                        </v-list-item>
                                    </v-list>
                                </v-menu>

                                <v-menu offset-y>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                                v-model="editingRide.vehicleLicense"
                                                :rules="rideRules.editVehicle"
                                                label="Vehicle being used for ride (license plate number)"
                                                readonly
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-list>
                                        <v-list-item @click="editingRide.vehicleLicense = ``; editingRide.vehicleId = 0; editingRide.vehicle = null; "><span>None</span></v-list-item>
                                        <v-list-item v-for="vehicle in vehicles" v-bind:key="vehicle.id" @click="editingRide.vehicleId = vehicle.id; editingRide.vehicleLicense = vehicle.licenseNumber; editingRide.vehicle = vehicle;">
                                            {{ vehicle.licenseNumber }}
                                        </v-list-item>
                                    </v-list>
                                </v-menu>

                                <v-btn color="primary" class="ma-1" :disabled="!validRide" @click="editRide">Edit Ride</v-btn>
                                <v-btn text color="primary" class="ma-1" @click="hideEditRide">Cancel</v-btn>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </div>

            <div class="text-xs-center">
                <v-dialog v-model="addLocationVisible" width="1000">
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
                                        v-model="newLocation.zipcode"
                                        v-bind:rules="locationRules.zipcode"
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
                <v-dialog v-model="viewDriversVisible" width="500">
                    <v-card>
                        <v-card-title primary-title>
                            <v-icon class="mr-2">mdi-car-side</v-icon>Drivers
                        </v-card-title>
                        <v-card v-for="driver in validDrivers" v-bind:key="driver.id">
                            <v-card-text>
                                <v-icon class="mr-2">mdi-car-side</v-icon>
                                {{ getDriverString(driver) }}
                            </v-card-text>
                        </v-card>
                        <v-card v-if="validDrivers.length==0">
                            <v-card-text>No drivers signed up for this ride!</v-card-text>
                        </v-card>
                        <v-card-actions>
                            <v-btn light color="primary" right @click="hideDialog()">
                                Close
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>

            <div class="text-xs-center">
                <v-dialog v-model="viewPassengersVisible" width="500">
                    <v-card>
                        <v-card-title primary-title>
                            <v-icon class="mr-2">mdi-car-side</v-icon>Passengers
                        </v-card-title>
                        <v-card v-for="p in validPassengers" v-bind:key="p.id">
                            <v-card-text>
                                <v-icon class="mr-2">mdi-car-side</v-icon>
                                {{ getDriverString(p) }}
                            </v-card-text>
                        </v-card>
                        <v-card v-if="validPassengers.length==0">
                            <v-card-text>No drivers signed up for this ride!</v-card-text>
                        </v-card>
                        <v-card-actions>
                            <v-btn light color="primary" right @click="hideDialog()">
                                Close
                            </v-btn>
                        </v-card-actions>
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
                editDateMenu: false,

                addRideVisible: false,
                validRide: false,
                rideAdded: false,

                editRideVisible: false,
                vehicleEdited: false,

                addLocationVisible: false,
                validLocation: false,
                locationAdded: false,

                viewDriversVisible: false,
                viewPassengersVisible: false,


                rideRules: {
                    required: [val => console.log(val) || val.length > 0 || "Required"],
                    time: [
                        val => /^[0-1]\d:\d\d:?\d?\d?$/.test(val) || /^2[0-3]:\d\d/.test(val) || "24 hour time, 00:00 format"
                    ],
                    vehicle: [
                        () => this.newRide.vehicle != null || "Ride must have a vehicle!"
                    ],
                    editVehicle: [
                        () => this.editingRide.vehicle != null || "Ride must have a vehicle!"
                    ]
                },

                locationRules: {
                    required: [val => val.length > 0 || "Required"],
                    state: [ val => /^[A-Z]{2}$/.test(val) || "2-letter state format (ex: IN)"],
                    zipcode: [val => /^\d{5}$/.test(val) || "5-number zip code format"]
                },

                newRide: {
                    date: "",
                    time: "",
                    distance: 0,
                    fuelprice: 0,
                    fee: 0,
                    vehicleId: 0,
                    vehicleLicense: "",
                    vehicle: null,
                    fromLocation: null,
                    fromLocString: "",
                    fromLocId: 0,
                    toLocation: null,
                    toLocString: "",
                    toLocId: 0,
                },

                editingRide: {
                    date: "",
                    time: "",
                    distance: 0,
                    fuelprice: 0,
                    fee: 0,
                    vehicleId: 0,
                    vehiclePlate: "",
                    fromLocation: null,
                    fromLocString: "",
                    fromLocId: 0,
                    toLocation: null,
                    toLocString: "",
                    toLocId: 0,
                },

                defRide: {
                    date: "",
                    time: "",
                    distance: 0,
                    fuelprice: 0,
                    fee: 0,
                    vehicleId: 0,
                    vehiclePlate: "",
                    fromLocation: null,
                    fromLocString: "",
                    fromLocId: 0,
                    toLocation: null,
                    toLocString: "",
                    toLocId: 0,
                },

                newLocation: {
                    name: "",
                    address: "",
                    city: "",
                    state: "",
                    zipcode: 0
                },

                defLocation: {
                    name: "",
                    address: "",
                    city: "",
                    state: "",
                    zipcode: 0
                },

                rides: [],
                locations: [],
                vehicles: [],

                validDriverIds: [],
                validDrivers: [],
                validPassIds: [],
                validPassengers: [],

                headers: [
                    { text: "Date", value: "date" },
                    { text: "Time", value: "time" },
                    { text: "Price", value: "fee" },
                    { text: "Start", value: "fromLocation" },
                    { text: "Destination", value: "toLocation" },
                    { text: "Vehicle License Plate", value: "vehicle" },
                    { text: "Actions", value: "actions" }
                ]


            }
        },

        mounted: function() {
            this.getRides();
            this.getLocations();
            this.getVehicles();
            this.dateMenu = false;
        },

        methods: {
            setDate: function() {
                this.dateMenu = false;
                this.editDateMenu = false;
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
                        zipcode: this.newLocation.zipcode
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

            createRide: function() {
                let fuelPrice = 2.60;
                let mpg = this.newRide.vehicle.mpg;
                let range = mpg*13;
                let fee = (this.newRide.distance / range) * fuelPrice * 13;
                this.$axios
                    .post("/ride", {
                        date: this.newRide.date,
                        time: this.newRide.time,
                        distance: this.newRide.distance,
                        fuelPrice: fuelPrice,
                        fee: fee,
                        vehicleId: this.newRide.vehicle.id,
                        fromLocationId: this.newRide.fromLocation.id,
                        toLocationId: this.newRide.toLocation.id
                })
                .then(result => {
                    if (result.status === 200) {
                        if (result.data.ok) {
                            this.showDialog("Success", result.data.msge);
                            this.rideAdded = true;
                        } else {
                            this.showDialog("Sorry", result.data.msge);
                        }
                    }
                })
                .catch(err => this.showDialog("Failed", err));
            },

            editRide: function() {
                let fuelPrice = 2.60;
                let mpg = this.newRide.vehicle.mpg;
                let range = mpg*13;
                let fee = (this.newRide.distance / range) * fuelPrice * 13;
                this.$axios
                    .put(`/rides/${this.editingRide.id}`), {
                        date: this.editingRide.date,
                        time: this.editingRide.time,
                        distance: this.editingRide.distance,
                        fuelPrice: fuelPrice,
                        fee: fee,
                        vehicleId: this.editingRide.vehicle.id,
                        fromLocationId: this.editingRide.fromLocation.id,
                        toLocationId: this.editingRide.toLocation.id
                }
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

            showAddRide: function() {
                this.addRideVisible = true;
            },

            hideAddRide: function() {
                this.addRideVisible = false;
                this.newRide = this.defRide;
            },

            showEditRide: function(thisRide) {
                this.editRideVisible = true;
                this.editingRide = thisRide;
                this.editingRide.fromLocation = this.locations.find(x => x.id === thisRide.fromLocationId);
                this.editingRide.fromLocString = this.getLocString(this.editingRide.fromLocation);
                this.editingRide.fromLocId = this.editingRide.fromLocation.fromLocationId;
                this.editingRide.toLocation = this.locations.find(x => x.id === thisRide.toLocationId);
                this.editingRide.toLocString = this.getLocString(this.editingRide.toLocation);
                this.editingRide.toLocId = this.editingRide.toLocation.toLocationId;
                this.editingRide.vehicle = this.vehicles.find(x => x.id === thisRide.vehicleId);
                this.editingRide.vehicleLicense = this.editingRide.vehicle.licenseNumber;
                this.editingRide.vehicleId = this.editingRide.vehicle.id;
            },

            hideEditRide: function() {
                this.editRideVisible = false;
            },

            showAddLocation: function() {
                this.addLocationVisible = true;
            },

            hideAddLocation: function() {
                this.addLocationVisible = false;
                this.newLocation = this.defLocation;
            },

            showDrivers: async function(thisRide) {
                this.validDriverIds = [];
                this.validDrivers = [];

                await this.$axios.get(`drivers/rideId/${thisRide.id}`).then(response => {
                    for (var i = 0; i < response.data.length; i++) {
                        this.validDriverIds.push(Number(response.data[i].driverid));
                    }
                });
                console.log("yeet", this.validDriverIds);
                await this.$axios.put("/driver/findByDriverIdArray", {
                    inputArray: this.validDriverIds
                })
                .then(response => {
                    this.validDrivers = response.data.map(thisDriver => ({
                        id: thisDriver.id,
                        firstName: thisDriver.firstname,
                        lastName: thisDriver.lastname,
                        phone: thisDriver.phone,
                        licenseNumber: thisDriver.licensenumber
                    }))
                });
                this.viewDriversVisible = true;
            },

            showPassengers: async function(thisP) {
                this.validPassIds = [];
                this.validPassengers = [];

                await this.$axios.get(`passengers/rideId/${thisP.id}`).then(response => {
                    for (var i = 0; i < response.data.length; i++) {
                        this.validPassIds.push(Number(response.data[i].passengerid));
                    }
                });
                console.log("yeet", this.validPassIds);
                await this.$axios.put("/passenger/findByDriverIdArray", {
                    inputArray: this.validPassIds
                })
                    .then(response => {
                        this.validPassengers = response.data.map(thisPass => ({
                            id: thisPass.id,
                            firstName: thisPass.firstname,
                            lastName: thisPass.lastname,
                            phone: thisPass.phone
                        }))
                    });
                console.log(this.validPassengers);
                this.viewPassengersVisible = true;
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
                if (this.rideAdded) {
                    this.hideAddRide();
                    this.getRides();
                }
                if (this.viewDriversVisible) {
                    this.viewDriversVisible = false;
                    this.validDriverIds = [];
                    this.validDrivers = [];
                }
                if (this.viewPassengersVisible) {
                    this.viewPassengersVisible = false;
                    this.validPassIds = [];
                    this.validDrivers = [];
                }
            },

            getLocString: function(loc) {
                return `${loc.address} ${loc.city} ${loc.zipcode}`;
            },

            getDriverString(thisDriver) {
                return `Name: ${thisDriver.firstName} ${thisDriver.lastName} | Phone: ${thisDriver.phone}`;
            },
        }
    }
</script>