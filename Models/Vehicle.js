const { Model } = require('objection');
const { Authorization } = require("./Authorization");
const { Ride } = require("./Ride");
const { VehicleType } = require("./VehicleType");

class Vehicle extends Model {
    static get tableName() {
        return 'vehicle';
    }
    static get relationMappings() {
        return {
            authorizations: {
                relation: Model.HasManyRelation,
                modelClass: Authorization,
                join: {
                    from: 'vehicle.id',
                    to: 'authorization.vehicleid'
                }
            },
            rides: {
                relation: Model.HasManyRelation,
                modelClass: Ride,
                join: {
                    from: 'vehicle.id',
                    to: 'ride.vehicleid'
                }
            },
            vehicleType: {
                relation: Model.BelongsToOneRelation,
                modelClass: VehicleType,
                join: {
                    from: 'vehicle.vehicletypeid',
                    to: 'vehicletype.id'
                }
            }
        }
    }
}

module.exports = Vehicle;