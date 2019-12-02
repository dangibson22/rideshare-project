const { Model } = require('objection');
const { Vehicle } = require("./Vehicle");

class VehicleType extends Model {
    static get tableName() {
        return 'vehicletype';
    }
    static get relationMappings() {
        return {
            vehicle: {
                relation: Model.HasManyRelations,
                modelClass: Vehicle,
                join: {
                    from: 'vehicletype.id',
                    to: 'vehicle.vehicletypeId'
                }
            }
        }
    }
}

module.exports = VehicleType;