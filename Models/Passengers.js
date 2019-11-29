const { Model } = require('objection');
const Passenger = require("./Passenger");
const Ride = require("./Ride");

class Passengers extends Model {
    static get tableName() {
        return 'Passengers';
    }
    static get relationMappings() {
        return {
            passenger: {
                relation: Model.BelongsToOneRelation,
                modelClass: Passenger,
                join: {
                    from: 'Passengers.passengerId',
                    to: 'Passenger.id'
                }
            },
            ride: {
                relation: Model.BelongsToOneRelation,
                modelClass: Ride,
                join: {
                    from: 'Passengers.rideId',
                    to: 'Ride.id'
                }
            }
        }
    }
}

module.exports = Passengers;