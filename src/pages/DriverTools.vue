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
                    <v-list-item v-for="driver in drivers" v-bind:key="driver.id">
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
                                    <v-list-item v-for="driver in drivers" v-bind:key="driver.id">
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

            headers: [
                { text: "Date", value: "date"},
                { text: "Time", value: "time"},
                { text: "Start Location", value: "startlocation"},
                { text: "End Location", value: "endlocation"}
            ]
        }
    },

    mounted: function() {
        this.$axios.get("/driver").then(response => {
            this.drivers = response.data.map(thisDriver => ({
                firstName: thisDriver.firstname,
                lastName: thisDriver.lastname,
                phone: thisDriver.phone,
                licenseNumber: thisDriver.licensenumber,
                id: thisDriver.id,
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