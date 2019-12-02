const { Model } = require('objection');
const { Passenger } = require("./Passenger");
const { Ride } = require("./Ride");

class Passengers extends Model {
    static get tableName() {
        return 'passengers';
    }
    static get relationMappings() {
        return {
            passenger: {
                relation: Model.BelongsToOneRelation,
                modelClass: Passenger,
                join: {
                    from: 'passengers.passengerid',
                    to: 'passenger.id'
                }
            },
            ride: {
                relation: Model.BelongsToOneRelation,
                modelClass: Ride,
                join: {
                    from: 'passengers.rideid',
                    to: 'ride.id'
                }
            }
        }
    }
}

module.exports = Passengers;