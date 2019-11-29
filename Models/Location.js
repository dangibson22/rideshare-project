const { Model } = require('objection');
const Ride = require("./Ride");
const State = require("./State");

class Location extends Model {
    static get tableName() {
        return 'Location';
    }
    static get relationMappings() {
        return {
            fromLocation: {
                relation: Model.HasManyRelations,
                modelClass: Ride,
                join: {
                    from: 'Location.id',
                    to: 'Ride.fromLocationId'
                }
            },
            toLocation: {
                relation: Model.HasManyRelations,
                modelClass: Ride,
                join: {
                    from: 'Location.id',
                    to: 'Ride.toLocationId'
                }
            },
            states: {
                relation: Model.BelongsToOneRelation,
                modelClass: State,
                join: {
                    from: 'Location.state',
                    to: 'State.abbreviation'
                }
            }
        }
    }
}

module.exports = Location;