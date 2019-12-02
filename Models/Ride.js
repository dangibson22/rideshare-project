const { Model } = require('objection');
const { Drivers } = require("./Drivers");
const { Vehicle } = require("./Vehicle");
const { Location } = require("./Location");

class Ride extends Model {
    static get tableName() {
        return 'ride';
    }
    static get relationMappings() {
        return {
            drivers: {
                relation: Model.HasManyRelations,
                modelClass: Drivers,
                join: {
                    from: 'ride.id',
                    to: 'drivers.rideid'
                }
            },
            vehicle: {
                relation: Model.BelongsToOneRelation,
                modelClass: Vehicle,
                join: {
                    from: 'ride.vehicleid',
                    to: 'vehicle.id'
                }
            },
            fromLocations: {
                relation: Model.BelongsToOneRelation,
                modelClass: Location,
                join: {
                    from: 'ride.fromlocationid',
                    to: 'location.id'
                }
            },
            toLocations: {
                relation: Model.BelongsToOneRelation,
                modelClass: Location,
                join: {
                    from: 'ride.tolocationid',
                    to: 'location.id'
                }
            }
        }
    }
}

module.exports = Ride;