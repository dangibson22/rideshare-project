const { Model } = require("objection");
const { Drivers } = require("./Drivers");
const { Authorization } = require("./Authorization");

class Driver extends Model {
    static get tableName() {
        return "Driver";
    }
    static get relationMappings() {
        return {
            drivers: {
                relation: Model.HasManyRelation,
                modelClass: Drivers,
                join: {
                    from: 'Driver.id',
                    to: 'Drivers.driverId'
                }
            },
            authorizations: {
                relation: Model.HasManyRelation,
                modelClass: Authorization,
                join: {
                    from: 'Driver.id',
                    to: 'Authorization.driverId'
                }
            }
        }
    }
}

module.exports = Driver;