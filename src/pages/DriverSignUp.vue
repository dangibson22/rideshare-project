<template>
    <v-container>
        <div>
            <v-btn v-bind:to="{ name: 'driver' }">&lt; Back</v-btn>
            <br><br><h4 class="display-1">Driver Sign-Up</h4>

            <v-form v-model="valid">
                <v-text-field
                    v-model="newDriver.firstName"
                    v-bind:rules="rules.required"
                    label="First name"
                ></v-text-field>
                <v-text-field
                    v-model="newDriver.lastName"
                    :rules="rules.required"
                    label="Last name"
                ></v-text-field>
                <v-text-field
                    v-model="newDriver.phone"
                    :rules="rules.phone"
                    label="Phone number"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="newDriver.licenseNumber"
                    :rules="rules.licenseNumber"
                    label="License plate number"
                    required
                ></v-text-field>
                <v-btn :disabled="!valid" v-on:click="handleSubmit">
                    Become Driver
                </v-btn>
            </v-form>

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

            <p class="body-1">arbitrary placeholder</p>
        </div>
    </v-container>
</template>

<script>
export default {
    name: "DriverSignUpPage",
    components: {},
    data: function() {
        return {
            valid: false,

            newDriver: {
                firstName: "",
                lastName: "",
                phone: "",
                licenseNumber: ""
            },

            driverRegistered: false,

            dialogHeader: "<no dialogHeader>",
            dialogText: "<no dialogText>",
            dialogVisible: false,

            // Validation rules

            rules: {
                required: [val => val.length > 0 || "Required"],
                phone: [val => /\d{3}-\d{3}-\d{4}/.test(val) || "Invalid number - ex. 123-456-7890"],
                licenseNumber: [
                    // idk how license plates work
                    val => /^([A-Za-z]{3}\d{3})|([A-Za-z]{2}\d{4})$/.test(val) || "Invalid license plate - must be AA9999 or AAA999"
                ]
            }
        }
    },
    methods: {
        handleSubmit: function() {
            this.driverCreated = false;

            this.$axios
                .post("/driver/sign-up", {
                    firstName: this.newDriver.firstName,
                    lastName: this.newDriver.lastName,
                    phone: this.newDriver.phone,
                    licenseNumber: this.newDriver.licenseNumber,
                })
                .then(result => {
                    if (result.status === 200) {
                        if (result.data.ok) {
                            this.showDialog("Success", result.data.msge);
                            this.driverCreated = true;
                        } else {
                            this.showDialog("Sorry", result.data.msge);
                        }
                    }
                })
                .catch(err => this.showDialog("Failed", err));
        },

        showDialog: function(header, text) {
            this.dialogHeader = header;
            this.dialogText = text;
            this.dialogVisible = true;
        },

        hideDialog: function() {
            this.dialogVisible = false;
        }
    },
};
</script>