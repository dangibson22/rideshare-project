const { Model } = require('objection');
const { Driver } = require("./Driver");
const { Vehicle } = require("./Vehicle");

class Authorization extends Model {
    static get tableName() {
        return 'authorization';
    }
    static get relationMappings() {
        return {
            driver: {
                relation: Model.BelongsToOneRelation,
                modelClass: Driver,
                join: {
                    from: 'authorization.driverid',
                    to: 'driver.id'
                }
            },
            vehicle: {
                relation: Model.BelongsToOneRelation,
                modelClass: Vehicle,
                join: {
                    from: 'authorization.vehicleid',
                    to: 'vehicle.id'
                }
            }
        }
    }
}

module.exports = Authorization;