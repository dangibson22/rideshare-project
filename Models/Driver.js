const { Model } = require("objection");
const { Drivers } = require("./Drivers");
const { Authorization } = require("./Authorization");

class Driver extends Model {
    static get tableName() {
        return "driver";
    }
    static get relationMappings() {
        return {
            drivers: {
                relation: Model.HasManyRelation,
                modelClass: Drivers,
                join: {
                    from: 'driver.id',
                    to: 'drivers.driverid'
                }
            },
            authorizations: {
                relation: Model.HasManyRelation,
                modelClass: Authorization,
                join: {
                    from: 'driver.id',
                    to: 'authorization.driverid'
                }
            }
        }
    }
}

module.exports = Driver;