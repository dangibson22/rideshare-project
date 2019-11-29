const { Model } = require('objection');
const Authorization = require("./Authorization");
const Ride = require("./Ride");
const VehicleType = require("./VehicleType");

class Vehicle extends Model {
    static get tableName() {
        return 'Vehicle';
    }
    static get relationMappings() {
        return {
            authorizations: {
                relation: Model.HasManyRelation,
                modelClass: Authorization,
                join: {
                    from: 'Vehicle.id',
                    to: 'Authorization.vehicleId'
                }
            },
            rides: {
                relation: Model.HasManyRelation,
                modelClass: Ride,
                join: {
                    from: 'Vehicle.id',
                    to: 'Ride.vehicleId'
                }
            },
            vehicleType: {
                relation: Model.BelongsToOneRelation,
                modelClass: VehicleType,
                join: {
                    from: 'Vehicle.vehicleTypeId',
                    to: 'VehicleType.id'
                }
            }
        }
    }
}

module.exports = Vehicle;