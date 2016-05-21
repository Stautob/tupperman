/**
 * Server configuration
 */

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('tupperman.db');
const fs = require('fs');
const favicon = require('express-favicon');




db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Tuppers'",
    function (err, rows) {
        if (err !== null) {
            console.log(err);
        }
        else if (rows === undefined) {
            db.run('CREATE TABLE "Tuppers" ' +
                '(id STRING PRIMARY KEY, ' +
                'name VARCHAR(255), ' +
                'description VARCHAR(255), ' +
                'foodGroup VARCHAR(255), ' +
                'dateOfFreeze DATE)', function (err) {
                if (err !== null) {
                    console.log(err);
                }
                else {
                    console.log("SQL Table 'Tuppers' initialized.");
                }
            });
        }
        else {
            console.log("SQL Table 'Tuppers' already initialized.");
        }
    });

var allowCrossDomain = function (request, response, next) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};


/**
 * Tupper storage
 */

function insertTupper(tupper) {
    var sqlRequestInsert = "INSERT INTO 'Tuppers' VALUES('" + tupper.id + "', '" + tupper.name + "', '" + tupper.description + "', '" + tupper.foodGroup + "', '" + tupper.dateOfFreeze + "')";
    db.run(sqlRequestInsert, function (err) {
        if (err !== null) {
            console.log(err);
        }
    });
}

function createTupper(tupper, callback) {
    if (tupper.id && tupper.name && tupper.description && tupper.foodGroup && tupper.dateOfFreeze) {
        findTupper(tupper.id, function (tu) {
            updateTupper(tupper);
            callback(tupper);
        }, function () {
            insertTupper(tupper);
            callback(tupper);
        });
    } else {
        return null;
    }
}

function updateTupper(tupper) {
    var sqlRequest = "UPDATE 'Tuppers' SET " +
        "name = '" + tupper.name + "', " +
        "description = '" + tupper.description + "', " +
        "foodGroup = '" + tupper.foodGroup + "', " +
        "dateOfFreeze = '" + tupper.dateOfFreeze + "' WHERE id = '" + tupper.id + "'";
    console.log(sqlRequest);
    db.run(sqlRequest, function (err) {
        if (err) {
            console.log(err);
        }
    });
}

function findTupper(id, callback, callnotFound) {
    var sqlRequest = "SELECT * from Tuppers WHERE id='" + id + "'";
    db.get(sqlRequest, function (err, row) {
        if (err) {
            console.log(err);
        }
        else {
            if (row) {
                callback(row);
            } else {
                callnotFound();
            }
        }
    });
}

function removeTupper(id, callback, callerror) {
    findTupper(id, function (tupper) {
        var sqlRequest = "DELETE FROM Tuppers WHERE id='" + tupper.id + "'";
        db.run(sqlRequest, function (err) {
            if (err) {
                console.log(err);
            }
        });
        getAllTuppers(callback);
    }, callerror);
}

function removeAllTuppers() {
    var sqlRequest = "DELETE FROM Tuppers";
    db.run(sqlRequest, function (err) {
        if (err) {
            console.log(err);
        }
    });
}

function getAllTuppers(callback) {
    var sqlRequest = "SELECT * from Tuppers";
    db.all(sqlRequest, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            callback(rows);
        }
    });
}

/**
 * Dummy data
 */

// createTupper(
//     "c85267aa-7522-446a-815a-edec4508db2d",
//     "Grosses rundes Test Tupper 01 ",
//     "Reis mit Pouletbrust an Rahmsauce",
//     "Menu",
//     new Date('2015-11-15T19:00:00'),
//     function (tu) {
//         console.log(tu)
//     }
// );
//
// createTupper(
//     "e60ba163-c553-4280-b16b-51303359c8c6",
//     "Grosses rundes Test Tupper 02 ",
//     "Tomaten Püree",
//     "Zutat",
//     new Date('2016-01-20T19:00:00'),
//     function (tu) {
//         console.log(tu)
//     }
// );

/**
 * Basic server
 */

var app = express();
app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use('/api', express.static(__dirname + '/api'));
app.use('/', express.static(__dirname + '/../source'));
// tests, remove this for production
app.use('/tests', express.static(__dirname + '/../tests'));
app.use('/source', express.static(__dirname + '/../source'));

app.use(favicon(__dirname + '/public/images/favicon.ico'));


/**
 * API routes
 */

// Tuppers

app.get('/api/tuppers', function (request, response) {
    getAllTuppers(function (tuppers) {
        response.json({tuppers: tuppers});
    });
});

app.delete('/api/tuppers', function (request, response) {
    removeAllTuppers();
});

app.get('/api/tuppers/:id', function (request, response) {
    findTupper(request.params.id,
        function (tupper) {
            response.json(tupper);
        },
        function () {
            response.status(404).send('tupper (id ' + request.params.id + ') not found.');
        }
    );
});

app.post('/api/tuppers/:id', function (request, response) {
    console.log(request.body);
    createTupper(request.body,
        function (tupper) {
            response.json(tupper);
        }
    );
});

app.delete('/api/tuppers/:id', function (request, response) {
    removeTupper(request.params.id,
        function (tuppers) {
            response.json({tuppers: tuppers});
        },
        function () {
            response.status(404).send('tupper (id ' + request.params.id + ') not found.');
        });
});

//Options

var foodGroups;

fs.readFile('foodGroups.opt', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        foodGroups = JSON.parse(data);
    }
});

app.get('/api/options', function (request, response) {
});

app.get('/api/options/foodGroups', function (request, response) {
    response.json({foodGroups: foodGroups});
});

app.post('/api/options/foodGroups', function (request, response) {
    if (request.body) {
        foodGroups = request.body;
        fs.writeFile('foodGroups.opt', JSON.stringify(foodGroups), (err) => {
            console.log(err)
        });
        response.json({foodGroups: foodGroups});
    } else {
        response.status(404).send('No foodGroups attached.')
    }
});

/**
 * Server start
 */
var appPort = 9080;
app.listen(appPort);
console.log('Server running on port ' + appPort);
