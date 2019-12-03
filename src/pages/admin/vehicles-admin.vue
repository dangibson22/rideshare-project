<template>
    <v-container>
        <div>
            <h4 class="display-1">Vehicle Management</h4><br>

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

                        </td>
                    </tr>
                </template>
            </v-data-table>
        </div>
    </v-container>
</template>

<script>
export default {
    name: "vehicles-admin",

    data: function() {
        return {
            headers: [
                { text: "Make", value: "make" },
                { text: "Model", value: "model" },
                { text: "Color", value: "color" },
                { text: "License Plate", value: "licensenumber"},
                { text: "Action", value: "action" }
            ],
            vehicles: []
        }
    },

    mounted: function() {
        this.$axios.get("/vehicles").then(response => {
            this.vehicles = response.data.map(vehicle => ({
                id: vehicle.id,
                make: vehicle.make,
                model: vehicle.model,
                color: vehicle.color,
                vehicleTypeId: vehicle.vehicletypeid,
                capacity: vehicle.capacity,
                mpg: vehicle.mpg,
                licenseState: vehicle.licensestate,
                licenseNumber: vehicle.licensenumber
            }));
        });
    },

    methods: {

    }
}
</script>