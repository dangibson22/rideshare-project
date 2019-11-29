const { Model } = require('objection');
const Drivers = require("./Drivers");
const Vehicle = require("./Vehicle");
const Location = require("./Location");

class Ride extends Model {
    static get tableName() {
        return 'Ride';
    }
    static get relationMappings() {
        return {
            drivers: {
                relation: Model.HasManyRelations,
                modelClass: Drivers,
                join: {
                    from: 'Ride.id',
                    to: 'Drivers.rideId'
                }
            },
            vehicle: {
                relation: Model.BelongsToOneRelation,
                modelClass: Vehicle,
                join: {
                    from: 'Ride.vehicleId',
                    to: 'Vehicle.id'
                }
            },
            fromLocations: {
                relation: Model.BelongsToOneRelation,
                modelClass: Location,
                join: {
                    from: 'Ride.fromLocationId',
                    to: 'Location.id'
                }
            },
            toLocations: {
                relation: Model.BelongsToOneRelation,
                modelClass: Location,
                join: {
                    from: 'Ride.toLocationId',
                    to: 'Location.id'
                }
            }
        }
    }
}

module.exports = Ride;