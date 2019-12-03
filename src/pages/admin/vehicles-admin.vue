<template>
    <v-container>
        <div>
            <h4 class="display-1">Vehicle Management</h4><br>

            <v-btn light @click="showSignUp">Add new Vehicle</v-btn>
            <v-btn light @click="getVehicles">Refresh Table</v-btn><br><br>

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
                                    <v-icon small class="ml-2" v-on="on" @click="showEdit(item)">
                                        mdi-pencil
                                    </v-icon>
                                </template>
                                <span>Edit vehicle</span>
                            </v-tooltip>
                        </td>
                    </tr>
                </template>
            </v-data-table>

            <div class="text-xs-center">
                <v-dialog v-model="editVehicleVisible">
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
                                <v-btn right color="primary" :disabled="!valid" v-on:click="handleUpdateVehicle">
                                    Add Vehicle
                                </v-btn>
                                <v-btn right text color="primary" @click="hideEdit">Cancel</v-btn>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </div>

            <div class="text-xs-center">
                <v-dialog v-model="addVehicleVisible">
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
                                <v-btn right color="primary" :disabled="!valid" v-on:click="handleSubmitNewVehicle">
                                    Add Vehicle
                                </v-btn>
                                <v-btn right text color="primary" @click="hideSignUp">Cancel</v-btn>
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

            vehicleEdited: false,
            editVehicleVisible: false,
            editValid: false,
            editingVehicle: {
                make: "",
                model: "",
                color: "",
                capacity: 0,
                mpg: 0.0,
                licenseState: "",
                licenseNumber: ""
            },

            defaultVehicle: {
                make: "",
                model: "",
                color: "",
                capacity: 0,
                mpg: 0.0,
                licenseState: "",
                licenseNumber: ""
            },

            newVehicle: {
                make: "",
                model: "",
                color: "",
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

            edit: {}
        }
    },

    mounted: function() {
        this.getVehicles();
    },

    methods: {
        handleSubmitNewVehicle: function() {
            this.vehicleAdded = false;

            this.$axios
                .post("/vehicles", {
                    make: this.newVehicle.make,
                    model: this.newVehicle.model,
                    color: this.newVehicle.color,
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
                .put("/vehicles", {
                    id: this.editingVehicle.id,
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

        showSignUp: function() {
            this.addVehicleVisible = true;
        },

        hideSignUp: function() {
            this.addVehicleVisible = false;
        },

        showEdit: function(item) {
            this.editingVehicle = item;
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
        }
    }
}
</script>