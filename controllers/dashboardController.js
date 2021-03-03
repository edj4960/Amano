const Pool = require("../models/Pool");
const Customer = require("../models/Customer");
const httpStatus = require("http-status-codes");
const Dashboard = require("../classes/dashboardClasses");
const faker = require('faker');

module.exports = {

    // render dashboard view
    dashView: (req, res) => {
        res.render("dashboard/index");
    },

    //See one customer's pool dashboard
    show: (req, res) => {
        res.render("dashboard/show-pool", {faker: faker});
    },

    //Get the data for one pool
    getPool: (req, res, next) => {
        let poolId = req.params.poolId;
        Pool.findById(poolId)
            .then(pool => {
                res.locals.pool = pool;
                next();
            })
            .catch(error => {
                console.log(`Error fetching pool: ${error.message}`);
                next(error);
            });
    },

    indexPools: (req, res, next) => {
        let alerts = [];
        let newPH;
        let newCl;
        let newAlk;
        let pHAlert;
        let clAlert;
        let alkAlert;

        let currentUser = req.user;
        let userId = currentUser._id;

        User.findById(userId, "customers").populate("customers")
            .then(customers => {
                customers.customers.forEach(
                    customer => {
                        let pool = customer.pools[0];
                        if (pool != undefined) {
                            let numReadings = Object.keys(pool.chemReading).length;
                            if (numReadings != 0) {
                                newPH = new Dashboard.PH(pool.chemReading[numReadings - 1].pH);
                                pHAlert = newPH.checkLevel();
    
                                newCl = new Dashboard.Chlorine(pool.chemReading[numReadings - 1].cl);
                                clAlert = newCl.checkLevel();
    
                                newAlk = new Dashboard.Alkalinity(pool.chemReading[numReadings - 1].alk);
                                alkAlert = newAlk.checkLevel();
                                alerts.push({
                                    pHAlert: pHAlert,
                                    clAlert: clAlert,
                                    alkAlert: alkAlert,
                                    pHRead: newPH.reading,
                                    clRead: newCl.reading,
                                    alkRead: newAlk.reading,
                                    poolId: pool._id
                                })

                                console.log(pool);
                        } else {
                            alerts.push({
                                pHAlert: null,
                                clAlert: null,
                                alkAlert: null,
                                pHRead: null,
                                clRead: null,
                                alkRead: null,
                                poolId: null
                            })
                        }
                        console.log(alerts);
                        };
                    });
                res.locals.alerts = alerts;
                res.locals.customers = customers.customers;
                next();
            })
            .catch(error => {
                console.log(error);
                next(error);
            })
    },

    //Get the data for all pools and return object with alerts
    // indexPools: (req, res, next) => {
    //     let alerts = []; 
    //     let newPH; let newCl; let newAlk;
    //     let pHAlert; let clAlert; let alkAlert;
    //     Pool.find()
    //         .then(pools => {
    //             pools.forEach(pool => {
    //                 let numReadings = Object.keys(pool.chemReading).length;
    //                 console.log(pool);
    //                 if (pool.chemReading.length != 0) {
    //                     let pHRead = pool.chemReading[numReadings - 1].pH;
    //                     let clRead = pool.chemReading[numReadings - 1].cl;
    //                     let alkRead = pool.chemReading[numReadings - 1].alk;

    //                     newPH = new Dashboard.PH(pHRead);
    //                     pHAlert = newPH.checkLevel();

    //                     newCl = new Dashboard.Chlorine(clRead);
    //                     clAlert = newCl.checkLevel();

    //                     newAlk = new Dashboard.Alkalinity(alkRead);
    //                     alkAlert = newAlk.checkLevel();

    //                     alerts.push({
    //                         pHAlert: pHAlert,
    //                         clAlert: clAlert,
    //                         alkAlert: alkAlert,
    //                         poolId: pool._id
    //                     })
    //                 };
    //             });
    //             res.locals.alerts = alerts;
    //             next();
    //         })
    //         .catch(error => {
    //             console.log(error);
    //             next(error);
    //         })
    // },

    // Get returned data in JSON format
    respondJSON: (req, res) => {
        res.json({
            status: httpStatus.OK,
            data: res.locals
        });
    },

    // View error in JSON format
    errorJSON: (error, req, res, next) => {
        let errorObject;
        if (error) {
            errorObject = {
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            };
        } else {
            errorObject = {
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: "Unknown Error."
            };
        }
        res.json(errorObject);
    },

    // Add a pool -- generate random data for chemReadings
    addPool: (req, res, next) => {
        let custId = req.params.custId;
        let d = new Date();
        poolParams = {
            gallons: req.body.gallons,
            chemType: req.body.chemType,
            customer: custId,
            chemReading: [{
                    pH: ((Math.random() * (8 - 7) + 7).toFixed(1)),
                    cl: ((Math.random() * 4).toFixed(1)),
                    alk: ((Math.random() * (125 - 75) + 75).toFixed(1)),
                    readTime: d.setDate(d.getDate(d) - 5)
                },
                {
                    pH: ((Math.random() * (8 - 7) + 7).toFixed(1)),
                    cl: ((Math.random() * 4).toFixed(1)),
                    alk: ((Math.random() * (125 - 75) + 75).toFixed(1)),
                    readTime: d.setDate(d.getDate(d) + 1)
                },
                {
                    pH: ((Math.random() * (8 - 7) + 7).toFixed(1)),
                    cl: ((Math.random() * 4).toFixed(1)),
                    alk: ((Math.random() * (125 - 75) + 75).toFixed(1)),
                    readTime: d.setDate(d.getDate(d) + 1)
                },
                {
                    pH: ((Math.random() * (8 - 7) + 7).toFixed(1)),
                    cl: ((Math.random() * 4).toFixed(1)),
                    alk: ((Math.random() * (125 - 75) + 75).toFixed(1)),
                    readTime: d.setDate(d.getDate(d) + 1)
                },
                {
                    pH: ((Math.random() * (8 - 7) + 7).toFixed(1)),
                    cl: ((Math.random() * 4).toFixed(1)),
                    alk: ((Math.random() * (125 - 75) + 75).toFixed(1)),
                    readTime: d.setDate(d.getDate(d) + 1)
                },
                {
                    pH: ((Math.random() * (8 - 7) + 7).toFixed(1)),
                    cl: ((Math.random() * 4).toFixed(1)),
                    alk: ((Math.random() * (125 - 75) + 75).toFixed(1)),
                    readTime: d.setDate(d.getDate(d) + 1)
                }
            ]
        };
        Pool.create(poolParams)
            .then(pool => {
                res.locals.redirect = `/dashboard`;
                res.locals.pool = pool;
                next();
            })
            .catch((error) => {
                console.log(`There's been a problem adding a pool: ${error.message}`);
                next(error);
            })
    },

    // Render view to add pool
    addPoolView: (req, res) => {
        res.render("dashboard/new");
    },

    //Get the data for one customer
    getCustomer: (req, res, next) => {
        let custId = req.params.custId;
        Customer.findById(custId)
            .then(customer => {
                res.locals.customer = customer;
                next();
            })
            .catch(error => {
                console.log(`Error fetching customer: ${error.message}`);
                next(error);
            });
    },

    //Get all customers
    indexCustomers: async (req, res) => {
        let currentUser = req.user;
        try {
            let customers = await User.findById(currentUser._id, "customers").populate("customers");
            res.render('dashboard/index', {
                customers: customers.customers,
                faker: faker
            });
        } catch (error) {
            console.log(`There's been an error finding customers with indexCustomer: ${error.message}`);
        }
    },

    // Index customers and render in pools-with-alerts view
    indexCustomerAlerts: async (req, res) => {
        let currentUser = req.user;
        try {
            let customers = await User.findById(currentUser._id, "customers").populate("customers");
            res.render('dashboard/pools-with-alerts', {
                customers: customers.customers,
                faker: faker
            });
        } catch (error) {
            console.log(`There's been an error finding customers with indexCustomer: ${error.message}`);
        }
    },

    indexCustomerAlertsView: (req, res) => {
        res.render('dashboard/pools-with-alerts', {faker: faker});
    },

    //Part of Second Phase of Development
    // chemicalsToBring: (req, res) => {
    //     res.render("dashboard/chemicals-to-bring");
    // },

    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    }

};