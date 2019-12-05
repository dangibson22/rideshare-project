<template>
    <v-container>
        <div>
            <v-btn v-bind:to="{ name: 'passenger' }">Back</v-btn>
            <br><br><h4 class="display-1">Passenger Sign-Up</h4>

            <v-form v-model="valid">
                <v-text-field
                        v-model="newPassenger.firstName"
                        v-bind:rules="rules.required"
                        label="First name"
                ></v-text-field>
                <v-text-field
                        v-model="newPassenger.lastName"
                        v-bind:rules="rules.required"
                        label="Last name"
                ></v-text-field>
                <v-text-field
                        v-modle="newPassenger.phone"
                        v-bind:rules="rules.phone"
                        label="Phone number"
                ></v-text-field>
                <v-btn :disabled="!valid" v-on:click="handleSubmit">
                    Become Passenger
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
                            <v-btn color="primary" text v-on:click="hideDialog">OKay</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>
        </div>
    </v-container>
</template>

<script>
    export default {
        name: "PassengerSignUp.vue",
        components: {},
        data: function() {
            return{
                valid: false,

                newPassenger: {
                    firstName: "",
                    lastName: "",
                    phone: ""
                },

                passengerRegistered: false,

                dialogHeader: "<no dialogHeader>",
                dialogText: "<no dialogText>",
                dialogVisible: false,

                // Validation Rules

                rules: {
                    required: [val => val.length > 0 || "Required"],
                    phone: [val => /^\d{3}-\d{3}-\d{4}$/.test(val) && val.length > 0 || "Invalid number - ex. 123-456-7890"]
                }
            }
        },
        methods: {
            handleSubmit: function() {
                this.passengerCreated = false;

                this.$axios
                    .post("/find-ride/passenger-sign-up", {
                        firstName: this.newPassenger.firstName,
                        lastName: this.newPassenger.lastName,
                        phone: this.newPassenger.phone
                    })
                    .then(result => {
                        if (result.status === 200) {
                            if (result.data.ok) {
                                this.showDialog("Success", result.data.msge);
                                this.passengerCreated = true;
                            }else{
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