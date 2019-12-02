const { Model } = require('objection');
const { Driver } = require("./Driver");
const { Vehicle } = require("./Vehicle");

class Authorization extends Model {
    static get tableName() {
        return 'Authorization';
    }
    static get relationMappings() {
        return {
            driver: {
                relation: Model.BelongsToOneRelation,
                modelClass: Driver,
                join: {
                    from: 'Authorization.driverId',
                    to: 'Driver.id'
                }
            },
            vehicle: {
                relation: Model.BelongsToOneRelation,
                modelClass: Vehicle,
                join: {
                    from: 'Authorization.vehicleId',
                    to: 'Vehicle.id'
                }
            }
        }
    }
}

module.exports = Authorization;