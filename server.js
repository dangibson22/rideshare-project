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
const Drivers = require("./Models/Drivers");
const Location = require("./Models/Location");
const Passenger = require("./Models/Passenger");
const Passengers = require("./Models/Passengers");
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
            path: "/passenger",
            options: {
                description: "Get all passengers"
            },
            handler: () => {
                return Passenger.query();
            }
        },
        {
            method: "POST",
            path: "/find-ride/passenger-sign-up",
            options: {
                description: "Create new passenger",
                validate: {
                    payload: Joi.object({
                        firstName: Joi.string().required(),
                        lastName: Joi.string().required(),
                        phone: Joi.string().required()
                    })
                }
            },
            handler: async (request) => {
                const existingPassenger = await Passenger.query()
                    .where("phone", request.payload.phone)
                    .first();
                if(existingPassenger) {
                    return returnObject(false, `Phone number ${request.payload.phone} has already been taken!`);
                }
                const newPassenger = await Passenger.query().insert({
                    firstname: request.payload.firstName,
                    lastname: request.payload.lastName,
                    phone: request.payload.phone,
                    id: request.payload.id
                });
                if(newPassenger) {
                    return returnObject(true, `Signed up ${request.payload.firstName} ${request.payload.lastName} as a passenger!`);
                }else{
                    return returnObject(false, `Error signing up ${request.payload.firstName} ${request.payload.lastName} as a passenger!`);
                }
            }
        },
        {
            method: "GET",
            path: "/find-ride/passenger-ride-report",
            options: {
                description: "View all passengers"
            },
            handler: () => {
                return Passenger.query();
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
            method: "PUT",
            path: "/rides/findByVehicleId",
            options: {
                description: "View all rides whose vehicle are in the validVehicleIds array"
            },
            handler: (request) => {
                let ids = request.payload.inputArray;
                return Ride.query().whereIn("vehicleid", ids);
            }
        },
        {
            method: "PUT",
            path: "/rides/findByRideIdArray",
            options: {
                description: "View all rides whose id are in the validRideIds array"
            },
            handler: (request) => {
                let ids = request.payload.inputArray;
                return Ride.query().whereIn("id", ids).orderBy("date");
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
                        typeId: Joi.number().integer().min(1).required(),
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
                    vehicletypeid: request.payload.typeId,
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
            method: "GET",
            path: "/authorization/driver/{driverId}",
            options: {
                description: "Get all vehicleIds the driver is authorized for"
            },
            handler: async (request) => {
                return Authorization.query().select("vehicleid").where("driverid", request.params.driverId);
            }
        },
        {
            method: "GET",
            path: '/find-ride/{id}',
            options: {
                description: "Get all rides the passenger is signed up for"
            },
            handler: async (request) => {
                return Passengers.query()
                    .select("rideid")
                    .where("passengerid", request.params.id);
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
            method: "GET",
            path: "/drivers/{driverId}",
            options: {
                description: "Fetch all rides driver is signed up for"
            },
            handler: (request) => {
                return Drivers.query()
                    .select("rideid")
                    .where("driverid", request.params.driverId);
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
            path: "/vehicleType",
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
        },
        {
            method: "GET",
            path: "/vehicleType",
            options: {
                description: "Get all vehicle types"
            },
            handler: () => {
                return VehicleType.query();
            }
        },
        {
            method: "POST",
            path: "/drivers",
            options: {
                description: "Sign up a driver for a ride"
            },
            handler: async (request) => {
                const itemExists = await Drivers.query()
                    .where("driverid", request.payload.driverId)
                    .where("rideid", request.payload.rideId)
                    .first();

                if (itemExists) {
                    return returnObject(false, `You are already signed up for this ride!`);
                }

                const itemAdded = await Drivers.query().insert({
                    driverid: request.payload.driverId,
                    rideid: request.payload.rideId
                });

                if (itemAdded) {
                    return returnObject(true, `You're signed up to drive for this ride!`);
                } else {
                    return returnObject(false, `Something went wrong signing you up`);
                }

            }
        },
        {
            method: "POST",
            path: "/passengers",
            options: {
                description: "Sign a passenger up for a ride"
            },
            handler: async (request) => {
                const itemExists = await Passengers.query()
                    .where("passengerid", request.payload.passengerId)
                    .where("rideid", request.payload.rideId)
                    .first();

                if (itemExists) {
                    return returnObject(false, `You are already signed up for this ride!`);
                }

                const itemAdded = await Passengers.query().insert({
                    passengerid: request.payload.passengerId,
                    rideid: request.payload.rideId
                });

                if (itemAdded) {
                    return returnObject(true, `You're signed up for this ride!`);
                } else {
                    return returnObject(false, `Something went wrong signing you up`);
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
