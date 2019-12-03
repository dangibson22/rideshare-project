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
            config: {
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
                console.log("Got here!");
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
            config: {
                description: "View all drivers"
            },
            handler: () => {
                return Driver.query();
            }
        },
        {
            method: "GET",
            path: "/vehicles",
            config: {
                description: "View all vehicles"
            },
            handler: () => {
                return Vehicle.query();
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
