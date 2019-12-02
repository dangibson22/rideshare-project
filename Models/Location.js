const { Model } = require('objection');
const { Ride } = require("./Ride");
const { State } = require("./State");

class Location extends Model {
    static get tableName() {
        return 'location';
    }
    static get relationMappings() {
        return {
            fromLocation: {
                relation: Model.HasManyRelations,
                modelClass: Ride,
                join: {
                    from: 'location.id',
                    to: 'ride.fromlocationid'
                }
            },
            toLocation: {
                relation: Model.HasManyRelations,
                modelClass: Ride,
                join: {
                    from: 'location.id',
                    to: 'ride.tolocationid'
                }
            },
            states: {
                relation: Model.BelongsToOneRelation,
                modelClass: State,
                join: {
                    from: 'location.state',
                    to: 'state.abbreviation'
                }
            }
        }
    }
}

module.exports = Location;