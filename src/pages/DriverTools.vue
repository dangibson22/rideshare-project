<template>
    <v-container>
        <div>
            <v-btn v-bind:to="{ name: 'driver' }">&lt; Back</v-btn>
            <br><br>
            <v-menu offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn text v-on="on">
                        <span>{{ currentDriverString }}</span>
                        <v-icon dark>mdi-menu-down</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="driver in drivers" v-bind:key="driver.id" @click="updateCurrent(driver); getRides(driver);">
                        <span>{{ getDriverString(driver) }}</span>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
    </v-container>
</template>

<script>
export default {
    name: "DriverTools",

    data: function() {
        return {
            currentDriver: {
                firstName: "",
                lastName: "",
                phone: "",
                licenseNumber: ""
            },
            currentDriverString: "Choose a driver",

            drivers: []
        }
    },

    mounted: function() {
        this.$axios.get("/driver").then(response => {
            this.drivers = response.data.map(thisDriver => ({
                firstName: thisDriver.firstname,
                lastName: thisDriver.lastname,
                phone: thisDriver.phone,
                licenseNumber: thisDriver.licensenumber
            }));
            console.log("mapped");
        })
    },

    methods: {
        updateCurrent(thisDriver) {
            this.currentDriver = thisDriver;
            this.currentDriverString = this.getDriverString(thisDriver);
        },

        getDriverString(thisDriver) {
            return `${thisDriver.firstName} ${thisDriver.lastName} phone: ${thisDriver.phone} license: ${thisDriver.licenseNumber}`;
        },

        getRides(thisDriver) {
            return thisDriver;
        }
    }
}

</script>