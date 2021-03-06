const { Model } = require('objection');
const { Driver } = require("./Driver");
const { Ride } = require("./Ride");

class Drivers extends Model {
    static get tableName() {
        return "drivers";
    }
    static get relationMappings() {
        return {
            driver: {
                relation: Model.BelongsToOneRelation,
                modelClass: Driver,
                join: {
                    from: "drivers.driverid",
                    to: "driver.id"
                }
            },
            ride: {
                relation: Model.BelongsToOneRelation,
                modelClass: Ride,
                join: {
                    from: "drivers.rideid",
                    to: "ride.id"
                }
            }
        }
    }
}

module.exports = Drivers;