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
//const Authorization = require("./Models/Authorization");
const Driver = require("./Models/Driver");
//const Drivers = require("./Models/Drivers");
//const Location = require("./Models/Location");
//const Passenger = require("./Models/Passenger");
//const Passengers = require("./Models/Passengers");
//const Ride = require("./Models/Ride");
//const State = require("./Models/State");
const Vehicle = require("./Models/Vehicle");
//const VehicleType = require("./Models/VehicleType");

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
			method: "GET",
			path: '/{param*}',
			handler: {
				directory: {
					path: '.',
					redirectToSlash: true
				}
			}
		},
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
            // eslint-disable-next-line no-unused-vars
            handler: async (request, h) => {
                const existingDriver = await Driver.query()
                    .where("licensenumber", request.payload.licenseNumber)
                    .first();
                if (existingDriver) {
                    return {
                        ok: false,
                        msge: `License number ${request.payload.licenseNumber} has already been registered!`
                    };
                }

                const newDriver = await Driver.query().insert({
                    firstname: request.payload.firstName,
                    lastname: request.payload.lastName,
                    phone: request.payload.phone,
                    licensenumber: request.payload.licenseNumber
                });

                if (newDriver) {
                    return {
                        ok: true,
                        msge: `Signed up ${request.payload.firstName} ${request.payload.lastName} with vehicle `
                    }
                } else {
                    return {
                        ok: false,
                        msge: `big oof`
                    }
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
                    return {
                        ok: false,
                        msge: `Vehicle with plate number ${request.payload.licenseNumber} from ${request.payload.licenseState} already exists!`
                    }
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
                    return {
                        ok: true,
                        msge: `Added vehicle with plate number ${request.payload.licenseNumber} from ${request.payload.licenseState}`
                    }
                } else {
                    return {
                        ok: false,
                        msge: `Error: could not add vehicle with plate number ${request.payload.licenseNumber} from ${request.payload.licenseState}`
                    }
                }
            }
        },
        {
            method: "PUT",
            path: "/vehicles",
            options: {
                description: "Update a vehicle"
            },
            handler: async (request) => {
                const plateExists = await Vehicle.query()
                    .where("licensenumber", request.payload.licenseNumber)
                    .first();

                if (plateExists) {
                    return {
                        ok: false,
                        msge: `Vehicle with plate number ${request.payload.licenseNumber} already exists!`
                    }
                }

                const updateVehicle = await Vehicle.query()
                    .where("id", request.payload.id)
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
                    return {
                        ok: true,
                        msge: `Updated vehicle with plate number ${request.payload.licenseNumber} from ${request.payload.licenseState}`
                    }
                } else {
                    return {
                        ok: false,
                        msge: `Error: could not update vehicle with plate number ${request.payload.licenseNumber} from ${request.payload.licenseState}`
                    }
                }

            }
        }
    ]);

    // Start the server.
    await server.start();
}

process.on("unhandledRejection", err => {
    server.logger().error(err);
    process.exit(1);
});

init();
