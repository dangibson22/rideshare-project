// Standard Node modules
const Path = require("path");

// Knex
const knex = require("knex")({
    client: "pg",
    connection: {
        host: "faraday.cse.taylor.edu",
        user: "daniel_gibson",
        password: "rugahaqa",
        database: "daniel_gibson"
    }
});

// Objection
const objection = require("objection");
objection.Model.knex(knex);

// Models
const Authorization = require("./Models/Authorization");
const Driver = require("./Models/Driver");
//const Drivers = require("./Models/Drivers");
const Location = require("./Models/Location");
//const Passenger = require("./Models/Passenger");
//const Passengers = require("./Models/Passengers");
const Ride = require("./Models/Ride");
const State = require("./Models/State");
const Vehicle = require("./Models/Vehicle");
const VehicleType = require("./Models/VehicleType");

// Hapi
const Joi = require("@hapi/joi"); // Input validation
const Hapi = require("@hapi/hapi"); // Server

const server = Hapi.server({
    host: "localhost",
    port: 3000,
    routes: {
        cors: true,
		files: {
			relativeTo: Path.join(__dirname, 'public')
			}
	}
});

async function init() {
    // Show routes at startup.
    await server.register(require("blipp"));

    // Output logging information.
    await server.register({
        plugin: require("hapi-pino"),
        options: {
            prettyPrint: true
        }
    });

    // Configure static file service.

    await server.register(require("@hapi/inert"));

    // Configure routes.
    server.route([
        {
            method: "POST",
            path: "/driver",
            options: {
                description: "Add a driver",
                validate: {
                    payload: Joi.object({
                        firstName: Joi.string().required(),
                        lastName: Joi.string().required(),
                        phone: Joi.string().required(),
                        licenseNumber: Joi.string().required()
                    })
                }
            },
            handler: async (request) => {
                const existingDriver = await Driver.query()
                    .where("licensenumber", request.payload.licenseNumber)
                    .first();
                if (existingDriver) {
                    return returnObject(false, `License number ${request.payload.licenseNumber} has already been registered!`);
                }

                const newDriver = await Driver.query().insert({
                    firstname: request.payload.firstName,
                    lastname: request.payload.lastName,
                    phone: request.payload.phone,
                    licensenumber: request.payload.licenseNumber
                });

                if (newDriver) {
                    return returnObject(true, `Signed up ${request.payload.firstName} ${request.payload.lastName} as a driver!`);
                } else {
                    return returnObject(false, `Error signing up ${request.payload.firstName} ${request.payload.lastName} as a driver`);
                }
            }
        },
        {
            method: "GET",
            path: "/driver",
            options: {
                description: "View all drivers"
            },
            handler: () => {
                return Driver.query();
            }
        },
        {
            method: "PUT",
            path: "/driver/",
            options: {
                description: "View all drivers in the validDriverIds array"
            },
            handler: (request) => {
                let ids = request.payload.validIds;
                return Driver.query().whereIn("id", ids);
            }
        },
        {
            method: "GET",
            path: "/vehicles",
            options: {
                description: "View all vehicles"
            },
            handler: () => {
                return Vehicle.query();
            }
        },
        {
            method: "POST",
            path: "/vehicles",
            options: {
                description: "Add a new vehicle",
                validate: {
                    payload: Joi.object({
                        make: Joi.string().required(),
                        model: Joi.string().required(),
                        color: Joi.string().required(),
                        capacity: Joi.number().integer().min(0).required(),
                        mpg: Joi.number().integer().min(0).required(),
                        licenseState: Joi.string().required(),
                        licenseNumber: Joi.string().required()
                    })
                }
            },
            handler: async (request) => {
                const existingVehicle = await Vehicle.query()
                    .where("licensenumber", request.payload.licenseNumber)
                    .where("licensestate", request.payload.licenseState)
                    .first();
                if (existingVehicle) {
                    return returnObject(true, `Vehicle with plate number ${request.payload.licenseNumber} from ${request.payload.licenseState} already exists!`);
                }

                const newVehicle = await Vehicle.query().insert({
                    make: request.payload.make,
                    model: request.payload.model,
                    color: request.payload.color,
                    capacity: request.payload.capacity,
                    mpg: request.payload.mpg,
                    licensestate: request.payload.licenseState,
                    licensenumber: request.payload.licenseNumber
                });

                if (newVehicle) {
                    return returnObject(true, `Added vehicle with plate number ${request.payload.licenseNumber} from ${request.payload.licenseState}`);
                } else {
                    return returnObject(true, `Error: could not add vehicle with plate number ${request.payload.licenseNumber} from ${request.payload.licenseState}`);
                }
            }
        },
        {
            method: "PUT",
            path: "/vehicles/{id}",
            options: {
                description: "Update a vehicle"
            },
            handler: async (request) => {
                const plateExists = await Vehicle.query()
                    .whereNot("id", request.params.id)
                    .where("licensenumber", request.payload.licenseNumber)
                    .first();

                if (plateExists) {
                    return returnObject(false, `Vehicle with plate number ${request.payload.licenseNumber} already exists!`);
                }

                const updateVehicle = await Vehicle.query()
                    .where("id", request.params.id)
                    .update({
                        make: request.payload.make,
                        model: request.payload.model,
                        color: request.payload.color,
                        capacity: request.payload.capacity,
                        mpg: request.payload.mpg,
                        licensestate: request.payload.licenseState,
                        licensenumber: request.payload.licenseNumber
                    });

                if (updateVehicle) {
                    return returnObject(true, `Updated vehicle with plate number ${request.payload.licenseNumber} from ${request.payload.licenseState}`)
                } else {
                    return returnObject(false, `Error: could not update vehicle with plate number ${request.payload.licenseNumber} from ${request.payload.licenseState}`);
                }

            }
        },
        {
            method: "GET",
            path: "/authorization/{vehicleId}",
            options: {
                description: "Get all driverIds authorized to drive the specified vehicle"
            },
            handler: (request) => {
                return Authorization.query().select("driverid").where("vehicleid", request.params.vehicleId);
            }
        },
        {
            method: "POST",
            path: "/authorization",
            options: {
                description: "Authorize a driver for a vehicle"
            },
            handler: async (request) => {
                const authExists = await Authorization.query()
                    .where("driverid", request.payload.driverId)
                    .where("vehicleid", request.payload.vehicleId)
                    .first();

                if (authExists) {
                    return returnObject(false, `${request.payload.driverFirst} ${request.payload.driverLast} is already authorized to drive this vehicle!`);
                }

                const addAuth = await Authorization.query().insert({
                    driverid: request.payload.driverId,
                    vehicleid: request.payload.vehicleId
                });

                if (addAuth) {
                    return returnObject(true, `${request.payload.driverFirst} ${request.payload.driverLast} is now authorized to drive this vehicle!`);
                } else {
                    return returnObject(false, `Error signing up ${request.payload.driverFirst} ${request.payload.driverLast} to drive this vehicle`)
                }
            }
        },
        {
            method: "POST",
            path: "/location",
            options: {
                description: "Add a new location"
            },
            handler: async (request) => {
                const locationExists = await Location.query()
                    .where("address", request.payload.address)
                    .where("city", request.payload.city)
                    .where("zipcode", request.payload.zipcode)
                    .orWhere("name", request.payload.name)
                    .first();

                if (locationExists) {
                    return returnObject(false, "Location already exists in database!");
                }

                const addAuth = await Location.query().insert({
                    name: request.payload.name,
                    address: request.payload.address,
                    city: request.payload.city,
                    state: request.payload.state,
                    zipcode: request.payload.zipcode
                });

                if (addAuth) {
                    return returnObject(true, "Location successfully added!");
                } else {
                    return returnObject(false, `Error adding location`)
                }
            }
        },
        {
            method: "PUT",
            path: "/state/{ab}",
            options: {
                description: "Find the given state"
            },
            handler: async (request) => {
                return State.query()
                    .where("abbreviation", request.params.ab);
            }
        },
        {
            method: "GET",
            path: "/ride",
            options: {
                description: "Fetch all rides"
            },
            handler: () => {
                return Ride.query();
            }
        },
        {
            method: "POST",
            path: "/ride",
            options: {
                description: "Create a new ride"
            },
            handler: async (request) => {
                const rideExists = await Ride.query()
                    .where("date", request.payload.date)
                    .where("time", request.payload.time)
                    .where("fromlocationid", request.payload.fromLocationId)
                    .where("tolocationid", request.payload.toLocationId)
                    .where("vehicleid", request.payload.vehicleId)
                    .first();

                if (rideExists) {
                    return returnObject(false, `Error: Ride already exists!`);
                }

                const rideAdded = await Ride.query().insert({
                    date: request.payload.date,
                    time: request.payload.time,
                    distance: request.payload.distance,
                    fuelprice: request.payload.fuelPrice,
                    fee: request.payload.fee,
                    vehicleid: request.payload.vehicleId,
                    fromlocationid: request.payload.fromLocationId,
                    tolocationid: request.payload.toLocationId
                });

                if (rideAdded) {
                    return returnObject(true, "Ride successfully added!");
                } else {
                    return returnObject(false, "Error adding ride");
                }

            }

        },

        {
            method: "GET",
            path: "/locations",
            options: {
                description: "Fetch all locations"
            },
            handler: () => {
                return Location.query();
            }
        },
        {
            method: "POST",
            path: "/vehicletype",
            options: {
                description: "Add a new vehicle type"
            },
            handler: async (request) => {
                const typeExists = await VehicleType.query()
                    .where("type", request.payload.type)
                    .first();

                if (typeExists) {
                    return returnObject(false, `Error: vehicle type already exists!`);
                }

                const typeAdded = await VehicleType.query().insert({
                    type: request.payload.type
                });

                if (typeAdded) {
                    return returnObject(true, `Vehicle type ${request.payload.type} successfully added!`);
                } else {
                    return returnObject(false, `Vehicle type ${request.payload.type} not added`);
                }

            }
        }
    ]);

    // Start the server.
    await server.start();
}

function returnObject(a, b) {
    return {
        ok: a,
        msge: b
    };
}

process.on("unhandledRejection", err => {
    server.logger().error(err);
    process.exit(1);
});

init();
