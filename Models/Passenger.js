const { Model } = require('objection');

class Passenger extends Model {
    static get tableName() {
        return 'Passenger';
    }
    static get relationMappings() {
        return {
            passengers: {
                relation: Model.HasManyRelations,
                modelClass: Passengers,
                join: {
                    from: 'Passenger.id',
                    to: 'Passengers.passengerId'
                }
            }
        }
    }
}

module.exports = Passenger;