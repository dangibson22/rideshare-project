const { Model } = require('objection');
const { Location } = require("./Location");

class State extends Model {
    static get tableName() {
        return 'State';
    }
    static get relationMappings() {
        return {
            aLocation: {
                relation: Model.HasManyRelations,
                modelClass: Location,
                join: {
                    from: 'State.abbreviation',
                    to: 'Location.state'
                }
            }
        }
    }
}

module.exports = State;