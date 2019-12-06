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
                    v-bind:items="rides"
            >
            </v-data-table>
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
                licenseNumber: "",
                id: ""
            },
            currentDriverString: "Choose a driver",

            drivers: [],
            validVehicleIds: [],


            headers: [
                { text: "Date", value: "date"},
                { text: "Time", value: "time"},
                { text: "Start Location", value: "startlocation"},
                { text: "End Location", value: "endlocation"}
            ]
        }
    },

    mounted: function() {
        this.getDrivers();
    },

    methods: {
        updateCurrent: async function(thisDriver) {
            this.currentDriver = thisDriver;
            this.currentDriverString = this.getDriverString(thisDriver);
            this.findValidVehicles(thisDriver.id);
        },

        findValidVehicles: async function(id) {
            await this.$axios.get(`/authorization/driver/${id}`).then(response => {
                for (var i = 0; i < response.data.length; i++) {
                    this.validVehicleIds.push(Number(response.data[i].vehicleid));
                }
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

        getDriverString(thisDriver) {
            return `${thisDriver.firstName} ${thisDriver.lastName} phone: ${thisDriver.phone} license: ${thisDriver.licenseNumber}`;
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