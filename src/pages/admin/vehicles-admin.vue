<template>
    <v-container>
        <div>
            <h4 class="display-1">Vehicle Management</h4><br>

            <v-card class="">
                <v-card-text>
                    <v-btn color="primary" class="ma-1" @click="showSignUp">Add new Vehicle</v-btn>
                    <v-btn color="primary" class="ma-1" @click="showAddType">Add new vehicle type</v-btn>
                    <v-btn color="primary" class="ma-1" @click="getVehicles">Refresh Table</v-btn>
                </v-card-text>
            </v-card>

            <br>

            <v-data-table
                class="elevation-1"
                v-bind:headers="headers"
                v-bind:items="vehicles"
            >
                <template v-slot:item="{ item }">
                    <tr>
                        <td>{{ item.make }}</td>
                        <td>{{ item.model }}</td>
                        <td>{{ item.color }}</td>
                        <td>{{ item.licenseNumber }}</td>
                        <td>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                        color="primary"
                                        small
                                        dark
                                        class="ma-1"
                                        v-on="on"
                                        @click="showEdit(item)"
                                    >
                                        <v-icon> mdi-pencil</v-icon>
                                    </v-btn>
                                </template>
                                <span>Edit vehicle</span>
                            </v-tooltip>


                            <v-menu>
                                <template #activator="{ on: menu }">
                                    <v-tooltip bottom>
                                        <template #activator="{ on: tooltip }">
                                            <v-btn
                                                    color="primary"
                                                    small
                                                    dark
                                                    class="ma-1"
                                                    v-on="{ ...tooltip, ...menu }"
                                            >
                                                <v-icon>mdi-plus</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Add authorized driver</span>
                                    </v-tooltip>
                                </template>
                                <v-list>
                                    <v-list-item v-for="driver in drivers" v-bind:key="driver.id" @click="addAuthorization(driver, item)">
                                        {{ getDriverString(driver) }}
                                    </v-list-item>
                                </v-list>
                            </v-menu>

                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                        color="primary"
                                        small
                                        dark
                                        class="ma-1"
                                        v-on="on"
                                        @click="getValidDrivers(item); showAuth(item)"
                                    >
                                        <v-icon>mdi-view-headline</v-icon>
                                    </v-btn>
                                </template>
                            <span>View authorized drivers</span>
                            </v-tooltip>
                        </td>
                    </tr>
                </template>
            </v-data-table>

            <div class="text-xs-center">
                <v-dialog v-model="manageAuthorizationsVisible" width="500">
                    <v-card>
                        <v-card-title primary-title>
                            Authorizations
                        </v-card-title>
                        <v-card v-for="driver in validDrivers" v-bind:key="driver.id">
                            <v-card-text>{{ getDriverString(driver) }}
                            </v-card-text>
                        </v-card>
                        <v-card v-if="validDrivers.length==0">
                            <v-card-text>No drivers authorized for this vehicle!</v-card-text>
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
                <v-dialog v-model="editVehicleVisible" width="1000">
                    <v-card>
                        <v-card-title primary-title>
                            Edit vehicle data
                        </v-card-title>
                        <v-card-text>
                            <v-form v-model="valid">
                                <v-text-field
                                        v-model="editingVehicle.make"
                                        v-bind:rules="newRules.required"
                                        label="Make of vehicle"
                                ></v-text-field>
                                <v-text-field
                                        v-model="editingVehicle.model"
                                        v-bind:rules="newRules.required"
                                        label="Model of vehicle"
                                ></v-text-field>
                                <v-text-field
                                        v-model="editingVehicle.color"
                                        v-bind:rules="newRules.required"
                                        label="Color"
                                ></v-text-field>
                                <v-select
                                        v-model="editingVehicle.type"
                                        label="Vehicle type"
                                        :items="vehicleTypes"
                                        item-text="type"
                                        item-value="id"
                                        return-object
                                >
                                </v-select>
                                <v-text-field
                                        v-model="editingVehicle.capacity"
                                        v-bind:rules="newRules.capacity"
                                        label="Capacity"
                                ></v-text-field>
                                <v-text-field
                                        v-model="editingVehicle.mpg"
                                        v-bind:rules="newRules.mpg"
                                        label="MPG of vehicle"
                                ></v-text-field>
                                <v-text-field
                                        v-model="editingVehicle.licenseState"
                                        v-bind:rules="newRules.state"
                                        label="License plate state"
                                ></v-text-field>
                                <v-text-field
                                        v-model="editingVehicle.licenseNumber"
                                        v-bind:rules="newRules.licenseNumber"
                                        label="License plate number"
                                ></v-text-field>
                                <v-btn right color="primary" class="ma-1" :disabled="!valid" v-on:click="handleUpdateVehicle">
                                    Update Vehicle
                                </v-btn>
                                <v-btn right text color="primary" class="ma-1" @click="hideEdit">Cancel</v-btn>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </div>

            <div class="text-xs-center">
                <v-dialog v-model="addVehicleVisible" width="1000">
                    <v-card>
                        <v-card-title primary-title>
                            Add a new vehicle
                        </v-card-title>
                        <v-card-text>
                            <v-form v-model="valid">
                                <v-text-field
                                    v-model="newVehicle.make"
                                    v-bind:rules="newRules.required"
                                    label="Make of vehicle"
                                ></v-text-field>
                                <v-text-field
                                    v-model="newVehicle.model"
                                    v-bind:rules="newRules.required"
                                    label="Model of vehicle"
                                ></v-text-field>
                                <v-text-field
                                    v-model="newVehicle.color"
                                    v-bind:rules="newRules.required"
                                    label="Color"
                                ></v-text-field>
                                <v-select
                                    v-model="newVehicle.type"
                                    label="Vehicle type"
                                    :items="vehicleTypes"
                                    item-text="type"
                                    item-value="id"
                                    return-object
                                >
                                </v-select>
                                <v-text-field
                                    v-model="newVehicle.capacity"
                                    v-bind:rules="newRules.capacity"
                                    label="Capacity"
                                ></v-text-field>
                                <v-text-field
                                    v-model="newVehicle.mpg"
                                    v-bind:rules="newRules.mpg"
                                    label="MPG of vehicle"
                                ></v-text-field>
                                <v-text-field
                                    v-model="newVehicle.licenseState"
                                    v-bind:rules="newRules.state"
                                    label="License plate state"
                                ></v-text-field>
                                <v-text-field
                                    v-model="newVehicle.licenseNumber"
                                    v-bind:rules="newRules.licenseNumber"
                                    label="License plate number"
                                ></v-text-field>
                                <v-btn right color="primary" class="ma-1" :disabled="!valid" @click="handleSubmitNewVehicle">
                                    Add Vehicle
                                </v-btn>
                                <v-btn right text color="primary" class="ma-1" @click="hideSignUp">Cancel</v-btn>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </div>

            <div class="text-xs-center">
                <v-dialog v-model="addTypeVisible" width="1000">
                    <v-card>
                        <v-card-title>Add a new vehicle type</v-card-title>
                        <v-card-text>
                            <v-form v-model="validType">
                                <v-text-field
                                    v-model="newType.type"
                                    :rules="newRules.required"
                                    label="Type of vehicle"
                                ></v-text-field>
                                <v-btn color="primary" class="ma-1" :disabled="!validType" @click="addType">
                                    Add Vehicle Type
                                </v-btn>
                                <v-btn text color="primary" class="ma-1" @click="hideAddType">Cancel</v-btn>
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
    name: "vehicles-admin",

    data: function() {
        return {

            dialogHeader: "<no dialogHeader>",
            dialogText: "<no dialogText>",
            dialogVisible: false,

            vehicleAdded: false,
            addVehicleVisible: false,
            valid: false,

            manageAuthorizationsVisible: false,

            addTypeVisible: false,
            validType: false,
            typeAdded: false,

            newType: {
                type: ""
            },

            defType: {
                type: ""
            },

            authVehicle: {
                id: 0,
                make: "",
                model: "",
                color: "",
                capacity: 0,
                mpg: 0.0,
                licenseState: "",
                licenseNumber: ""
            },
            authDriver: {
                id: 0,
                firstName: "",
                lastName: "",
                phone: "",
                licenseNumber: ""
            },
            validDriverIds: [],
            validDrivers: [],

            vehicleEdited: false,
            editVehicleVisible: false,
            editValid: false,
            editingVehicle: {
                make: "",
                model: "",
                color: "",
                type: {
                    id: 0,
                    type: ""
                },
                capacity: 0,
                mpg: 0.0,
                licenseState: "",
                licenseNumber: ""
            },

            defaultVehicle: {
                make: "",
                model: "",
                color: "",
                type: {
                    id: 0,
                    type: ""
                },
                capacity: 0,
                mpg: 0.0,
                licenseState: "",
                licenseNumber: ""
            },

            newVehicle: {
                make: "",
                model: "",
                color: "",
                type: {
                    id: 0,
                    type: ""
                },
                capacity: 0,
                mpg: 0.0,
                licenseState: "",
                licenseNumber: ""
            },

            newRules: {
                required: [val => val.length > 0 || "Required"],
                capacity: [val => /^\d+$/.test(val) || "Must be number"],
                mpg: [val => /^\d+$/.test(val) || "Must be number"],
                state: [val => /^[A-Z]{2}$/.test(val) || "2-letter state format (ex: IN)"],
                licenseNumber: [val => /^\w{6}$/.test(val) || "Invalid format (6 alphanumeric digits)"]
            },

            headers: [
                { text: "Make", value: "make" },
                { text: "Model", value: "model" },
                { text: "Color", value: "color" },
                { text: "License Plate", value: "licensenumber"},
                { text: "Action", value: "action" }
            ],

            vehicles: [],

            vehicleTypes: [],

            drivers: [],


            edit: {}
        }
    },

    mounted: function() {
        this.getVehicles();
        this.getDrivers();
        this.getVehicleTypes();
    },

    methods: {
        handleSubmitNewVehicle: function() {
            this.vehicleAdded = false;
            console.log(this.newVehicle);

            this.$axios
                .post("/vehicles", {
                    make: this.newVehicle.make,
                    model: this.newVehicle.model,
                    color: this.newVehicle.color,
                    typeId: this.newVehicle.type.id,
                    capacity: Number(this.newVehicle.capacity),
                    mpg: Number(this.newVehicle.mpg),
                    licenseState: this.newVehicle.licenseState,
                    licenseNumber: this.newVehicle.licenseNumber
                })
                .then(result => {
                    if (result.status === 200) {
                        if (result.data.ok) {
                            this.showDialog("Success", result.data.msge);
                            this.vehicleAdded = true;
                        } else {
                            this.showDialog("Sorry", result.data.msge);
                        }
                    }
                })
                .catch(err => this.showDialog("Failed", err));
        },

        handleUpdateVehicle: function() {
            this.vehicleEdited = false;

            this.$axios
                .put(`/vehicles/${this.editingVehicle.id}`, {
                    make: this.editingVehicle.make,
                    model: this.editingVehicle.model,
                    color: this.editingVehicle.color,
                    capacity: Number(this.editingVehicle.capacity),
                    mpg: Number(this.editingVehicle.mpg),
                    licenseState: this.editingVehicle.licenseState,
                    licenseNumber: this.editingVehicle.licenseNumber
                })
                .then(result => {
                    if (result.status === 200) {
                        if (result.data.ok) {
                            this.showDialog("Success", result.data.msge);
                            this.vehicleEdited = true;
                        } else {
                            this.showDialog("Sorry", result.data.msge);
                        }
                    }
                })
                .catch(err => this.showDialog("Failed", err));
        },

        getVehicles: function() {
            this.$axios.get("/vehicles").then(response => {
                this.vehicles = response.data.map(vehicle => ({
                    id: vehicle.id,
                    make: vehicle.make,
                    model: vehicle.model,
                    color: vehicle.color,
                    type: {
                        id: vehicle.vehicletypeid,
                        type: ""
                    },
                    capacity: vehicle.capacity,
                    mpg: vehicle.mpg,
                    licenseState: vehicle.licensestate,
                    licenseNumber: vehicle.licensenumber
                }));
            });
            for (let i = 0; i < this.vehicles.length; i++) {
                let num = this.vehicles[i].licenseNumber;
                console.log(num);
                this.edit.num = false;
            }
        },

        getDrivers: function() {
            this.$axios.get("/driver").then(response => {
                this.drivers = response.data.map(thisDriver => ({
                    id: thisDriver.id,
                    firstName: thisDriver.firstname,
                    lastName: thisDriver.lastname,
                    phone: thisDriver.phone,
                    licenseNumber: thisDriver.licensenumber
                }));
            })
        },

        getVehicleTypes: function() {
            this.$axios.get("/vehicleType").then(response => {
                this.vehicleTypes = response.data.map(thisType => ({
                    type: thisType.type,
                    id: thisType.id
                }));
            })
        },


        getValidDrivers: async function(thisVehicle) {
            await this.$axios.get(`/authorization/${thisVehicle.id}`).then(response => {
                for (var i = 0; i < response.data.length; i++) {
                    this.validDriverIds.push(Number(response.data[i].driverid));
                }
            });
            await this.$axios.put(`/driver/`, {
                validIds: this.validDriverIds
            })
            .then(response => {
                this.validDrivers = response.data.map(thisDriver => ({
                    id: thisDriver.id,
                    firstName: thisDriver.firstname,
                    lastName: thisDriver.lastname,
                    phone: thisDriver.phone,
                    licenseNumber: thisDriver.licensenumber
                }));
            })
        },

        addAuthorization: function(thisDriver, thisVehicle) {
            this.$axios
                .post("/authorization", {
                    driverId: thisDriver.id,
                    vehicleId: thisVehicle.id,
                    driverFirst: thisDriver.firstName,
                    driverLast: thisDriver.lastName
                })
                .then(result => {
                    if (result.status === 200) {
                        if (result.data.ok) {
                            this.showDialog("Success", result.data.msge);
                        } else {
                            this.showDialog("Sorry", result.data.msge);
                        }
                    }
                })
                .catch(err => this.showDialog("Failed", err));
        },

        addType: function() {
            this.typeAdded = false;
            this.$axios
                .post("/vehicleType", {
                    type: this.newType.type
                })
                .then(result => {
                    if (result.status === 200) {
                        if (result.data.ok) {
                            this.showDialog("Success", result.data.msge);
                            this.typeAdded = true;
                        } else {
                            this.showDialog("Sorry", result.data.msge);
                        }
                    }
                })
                .catch(err => this.showDialog("Failed", err));
        },

        getDriverString(thisDriver) {
            return `Name: ${thisDriver.firstName} ${thisDriver.lastName} | Phone: ${thisDriver.phone}`;
        },

        showAddType: function() {
            this.addTypeVisible = true;
        },

        hideAddType: function() {
            this.addTypeVisible = false;
            this.newType = this.defType;
        },

        showAuth: function(thisVehicle) {
            this.manageAuthorizationsVisible = true;
            this.authVehicle = thisVehicle;
        },

        showSignUp: function() {
            this.addVehicleVisible = true;
        },

        hideSignUp: function() {
            this.addVehicleVisible = false;
        },

        showEdit: function(item) {
            this.editingVehicle = item;
            console.log(this.vehicleTypes.find(x => x.id === this.editingVehicle.type.id));
            let i = this.vehicleTypes.findIndex(x => x.id === this.editingVehicle.type.id);
            console.log(i);
            this.editingVehicle.type.type = this.vehicleTypes[i].type;
            this.editVehicleVisible = true;
        },

        hideEdit: function() {
            this.editVehicleVisible = false;
        },

        showDialog: function(header, text) {
            this.dialogHeader = header;
            this.dialogText = text;
            this.dialogVisible = true;
        },

        hideDialog: function() {
            this.dialogVisible = false;
            if (this.vehicleAdded) {
                this.newVehicle = this.defaultVehicle;
                this.getVehicles();
                this.hideSignUp();
            }
            if (this.vehicleEdited) {
                this.editingVehicle = this.defaultVehicle;
                this.getVehicles();
                this.hideEdit();
            }
            if (this.manageAuthorizationsVisible) {
                this.validDriverIds = [];
                this.validDrivers = [];
                this.manageAuthorizationsVisible = false;
            }
            if (this.typeAdded) {
                this.hideAddType();
                this.getVehicleTypes();
            }
        }
    }
}
</script>