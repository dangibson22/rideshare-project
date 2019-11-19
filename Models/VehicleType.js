const { Model } = require('objection');

class VehicleType extends Model {
    static get tableName() {
        return 'VehicleType';
    }
    static get relationMappings() {
        return {
            vehicle: {
                relation: Model.HasManyRelations,
                modelClass: Vehicle,
                join: {
                    from: 'VehicleType.id',
                    to: 'Vehicle.vehicleTypeId'
                }
            }
        }
    }
}

module.exports = VehicleType;