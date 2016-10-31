/**
 * Created by stautob on 10/17/16.
 */

"use strict";

const User      = require("./models/user");
const Tupper    = require("./models/tupper");
const bcrypt    = require("bcrypt");
const jwt       = require("jsonwebtoken");
const validator = require("validator");
const owasp     = require("owasp-password-strength-test");
const uuidv4    = require("uuid-v4");

owasp.config({
    allowPassphrases: true,
    maxLength: 128,
    minLength: 10,
    minPhraseLength: 20,
    minOptionalTestsToPass: 4
});

function sendNoTokenProvided(res) {
    res.status(401).send("No access token provided.");
}

function sendTupperNotFound(res, uuid) {
    res.status(500).send("tupper (id " + uuid + ") not found.");
}

function sendMissingParameter(res) {
    res.status(500).send("A parameter is missed");
}


module.exports = {

    "getTuppers": function (req, res) {
        Tupper.findAll({
            where: {user: req.decoded.sub},
            attributes: {exclude: ["user"]}
        }).then(function (tuppers) {
            res.json(tuppers);
        });
    },

    "deleteTuppers": function (req, res) {
        Tupper.destroy({where: {user: req.decoded.sub}}).then(function () {
            res.status(200).send("Tuppers deleted");
        });
    },

    "getTupper": function (req, res) {
        var uuid = req.body.uuid || req.query.uuid || req.params.uuid;
        if (!uuid) {
            sendMissingParameter(res);
            return;
        }
        Tupper.findOne({
            where: {user: req.decoded.sub, uuid: uuid},
            attributes: {exclude: ["user"]}
        }).then(function (tupper) {
            if (tupper) {
                res.json(tupper);
            } else {
                sendTupperNotFound(res, uuid);
            }
        });
    },

    "createOrUpdateTupper": function (req, res) {
        var uuid        = req.body.uuid || req.query.uuid || req.params.uuid;
        var name        = req.body.name || req.query.name || req.params.name;
        var description = req.body.description || req.query.description || req.params.description;
        var foodGroups  = req.body.foodGroups || req.query.foodGroups || req.params.foodGroups;
        var weight      = req.body.weight || req.query.weight || req.params.weight;
        var freezeDate  = req.body.freezeDate || req.query.freezeDate || req.params.freezeDate;
        var expiryDate  = req.body.expiryDate || req.query.expiryDate || req.params.expiryDate;
        if (!uuid || !name || !description || !foodGroups || !weight || !freezeDate || !expiryDate) {
            sendMissingParameter(res);
            return;
        }

        Tupper.findOrCreate({
            where: {uuid: uuid, user: req.decoded.sub},
            defaults: {
                uuid: uuid,
                user: req.decoded.sub
            }
        }).spread(function (tupper, created) {
            if (tupper) {
                tupper.name        = name;
                tupper.description = description;
                tupper.foodGroups  = foodGroups;
                tupper.weight      = weight;
                tupper.freezeDate  = freezeDate;
                tupper.expiryDate  = expiryDate;
                tupper.save();
                Tupper.findOne({
                    where: {uuid: uuid, user: req.decoded.sub},
                    attributes: {exclude: ["user"]}
                }).then(function (tupper) {
                    res.json(tupper);
                });
            }
        });

    },

    "deleteTupper": function (req, res) {
        var uuid = req.body.id || req.query.id || req.params.id;
        if (!uuid) {
            sendMissingParameter(res);
            return;
        }

        Tupper.findOne({where: {user: req.decoded.sub, uuid: uuid}}).then(function (tupper) {
            if (tupper) {
                tupper.destroy();
                Tupper.findAll({
                    where: {user: req.decoded.sub},
                    attributes: {exclude: ["user"]}
                }).then(function (tuppers) {
                    res.json(tuppers);
                });
            } else {
                sendTupperNotFound(res, uuid);
            }
        });
    },

    "createUser": function (req, res) {
        var email    = req.body.email || req.query.email || req.headers["email"];
        var password = req.body.password || req.query.password || req.headers["password"];
        if (!email || !password) {
            sendMissingParameter(res);
            return;
        }

        if (!validator.isEmail(email)) {
            res.status(500).json({
                success: false,
                message: "Email (" + email + ") does not look like an email address"
            });
        }
        var result = owasp.test(password);
        if (!(result.errors.length === 0)) {
            res.status(500).json({success: false, message: result.errors});
        } else {
            User.findOne({where: {email: email}}).then(function (user) {
                if (user) {
                    res.json({success: false, message: "User with email (" + email + ") already exists"});
                } else {
                    User.create({uuid: uuidv4(), email: email, password: bcrypt.hashSync(password, 10)});
                    User.sync();
                    res.json({success: true, message: "User successfully created"})
                }
            });
        }
    },

    "updateUser": function (req, res) {
        var password = req.body.password || req.query.password || req.headers["password"];
        if (!password) {
            sendMissingParameter(res);
            return;
        }
        var result = owasp.test(password);
        if (!(result.errors.length === 0)) {
            res.json({success: false, message: result.errors});
        } else {
            User.findOne({where: {uuid: req.decoded.sub}}).then(function (user) {
                user.password = bcrypt.hashSync(password, 10);
                user.save();
                res.json({success: true, message: "Password successfully updated"});
            });
        }
    },

    "validate": function (req, res, next) {
        var token = req.headers["x-access-token"];
        if (!token) {
            sendNoTokenProvided(res);
            return;
        }
        jwt.verify(token, req.app.get("secret"), function (err, decoded) {
            if (err) {
                return res.status(401).send("Failed to authenticate token");
            } else {
                req.decoded = decoded;
                next();
            }
        });
    },

    "authenticate": function (req, res) {
        var email    = req.body.email || req.query.email || req.headers["email"];
        var password = req.body.password || req.query.password || req.headers["password"];
        if (!email || !password) {
            sendMissingParameter(res);
            return;
        }

        User.findOne({where: {email: email}}).then(function (user) {
            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                    var token = jwt.sign({sub: user.uuid}, req.app.get("secret"), {
                        expiresIn: 60 * 60 * 24
                    });
                    res.json({
                        success: true,
                        message: "Access granted!",
                        token: token
                    });
                } else {
                    res.status(401).json({success: false, message: "Username or password wrong."});
                }
            } else {
                res.status(401).json({success: false, message: "Username or password wrong."});
            }
        });
    },

    "getFoodGroups": function (req, res) {
        User.findOne({where: {uuid: req.decoded.sub}}).then(function (user) {
            var foodGroups = user.foodGroups.split(":");
            res.json(foodGroups);
        });
    },

    "updateFoodGroups": function (req, res) {
        var foodGroups = req.body.foodGroups || req.query.foodGroups || req.params.foodGroups;
        if (!foodGroups) {
            sendMissingParameter(res);
            return;
        }
        User.findOne({where: {uuid: req.decoded.sub}}).then(function (user) {
            user.foodGroups = foodGroups.join(":");
            user.save();
            res.status(200).send("FoodGroups successful updated");
        });
    }
};