
const express    = require('express');
const bodyParser = require('body-parser');
const app        = express();
const favicon    = require('express-favicon');
const Config     = require('./config/config');


/**
 * Basic server
 */

var allowCrossDomain = function (request, response, next) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

app.use(allowCrossDomain);
app.set('secret', Config.secret);
app.set('port', process.env.PORT || 9080);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(favicon(__dirname + '/public/images/favicon.ico'));


/**
 * ROUTES
 */

var Routes = require('./app/routes.js');

/**
 * STATIC
 */

app.use('/', express.static(__dirname + '/../source'));

app.use('/api', express.static(__dirname + '/apidoc'));

app.use('/source', express.static(__dirname + '/../source'));


/**
 * API Tuppers
 */

var apiTupperRouter = express.Router();

apiTupperRouter.use(Routes.validate);

/**
 * @api {get} /api/tuppers/ Request all Tuppers
 * @apiVersion 1.0.0
 * @apiName GetTuppers
 * @apiGroup Tuppers
 *
 * @apiHeader x-access-token JSONWebToken
 *
 * @apiSuccess {Tupper[]} tuppers The Tuppers
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [{"uuid": "123f87e8-7c52-48d6-8f2c-a8eedf029d4d",
 *       "name": "Sample Tupper",
 *       "description": "Nice healthy food",
 *       "foodGroups": "Vegan :-P",
 *       "weight": 42,
 *       "freezeDate": "2016-11-11 11:11:11.111 +00:00",
 *       "expiryDate": "2016-22-11 11:11:11.111 +00:00"},
 *      {"uuid": "58649822-6543-4cca-beae-c203bcf9c42d",
 *       "name": "Fancy Tupper",
 *       "description": "Fancy food",
 *       "foodGroups": "Fancy-Stuff",
 *       "weight": 4242,
 *       "freezeDate": "2016-11-11 11:11:11.111 +00:00",
 *       "expiryDate": "2016-22-11 11:11:11.111 +00:00"}]

 * @apiError (Error 401) {String} status Failed to authenticate token
 *
 * @apiError (Error 401) {String} status No access token provided
 */
apiTupperRouter.get('/', Routes.getTuppers);

/**
 * @api {delete} /api/tuppers/ Delete all Tuppers
 * @apiVersion 1.0.0
 * @apiName DeleteTuppers
 * @apiGroup Tuppers
 *
 * @apiHeader x-access-token JSONWebToken
 *
 * @apiSuccess {String} status Tuppers deleted
 *
 * @apiError (Error 401) {String} status Failed to authenticate token
 *
 * @apiError (Error 401) {String} status No access token provided
 */
apiTupperRouter.delete('/', Routes.deleteTuppers);

/**
 * @api {get} /api/tuppers/:uuid Request Tupper
 * @apiVersion 1.0.0
 * @apiName GetTupper
 * @apiGroup Tuppers
 *
 * @apiParam {Number} uuid Tupper unique ID
 * @apiHeader x-access-token JSONWebToken
 *
 * @apiSuccess {Object} tupper The Tupper with the unique ID "uuid"
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *       "uuid": "123f87e8-7c52-48d6-8f2c-a8eedf029d4d",
 *       "name": "Sample Tupper",
 *       "description": "Nice healthy food",
 *       "foodGroups": "Vegan :-P",
 *       "weight": 42,
 *       "freezeDate": "2016-11-11 11:11:11.111 +00:00",
 *       "expiryDate": "2016-22-11 11:11:11.111 +00:00"
 *      }
 *
 * @apiError (Error 500) {String} status Tupper (id uuid) not found
 *
 * @apiError (Error 401) {String} status Failed to authenticate token
 *
 * @apiError (Error 401) {String} status No access token provided
 */
apiTupperRouter.get('/:uuid', Routes.getTupper);

/**
 * @api {post} /api/tuppers/ Create or update Tupper
 * @apiVersion 1.0.0
 * @apiName UpdateTupper
 * @apiGroup Tuppers
 *
 * @apiParam {String} uuid Tupper unique ID
 * @apiParam {String} name Tupper name
 * @apiParam {String} description Tupper description
 * @apiParam {String[]} foodGroups Tupper foodGroups
 * @apiParam {Number} weight Tupper weight (in gramms)
 * @apiParam {Date} freezeDate Tupper freeze date
 * @apiParam {Date} expiryDate Tupper expiry date
 *
 * @apiHeader x-access-token JSONWebToken.
 *
 * @apiSuccess {Object} tupper The created or updated Tupper
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *       "uuid": "123f87e8-7c52-48d6-8f2c-a8eedf029d4d",
 *       "name": "Sample Tupper",
 *       "description": "Nice healthy food",
 *       "foodGroups": "Vegan :-P",
 *       "weight": 42,
 *       "freezeDate": "2016-11-11 11:11:11.111 +00:00",
 *       "expiryDate": "2016-22-11 11:11:11.111 +00:00"
 *      }
 *
 * @apiError (Error 500) {String} status Tupper (id uuid) not found
 *
 * @apiError (Error 401) {String} status Failed to authenticate token
 *
 * @apiError (Error 401) {String} status No access token provided
 */
apiTupperRouter.post('/', Routes.createOrUpdateTupper);

/**
 * @api {delete} /api/tuppers/:uuid Delete Tupper
 * @apiVersion 1.0.0
 * @apiName DeleteTupper
 * @apiGroup Tuppers
 *
 * @apiParam {String} uuid Tupper unique ID
 *
 * @apiHeader x-access-token JSONWebToken
 *
 * @apiSuccess {Object} tuppers The remaining Tuppers
 *
 * @apiError (Error 500) {String} status Tupper (id uuid) not found
 *
 * @apiError (Error 401) {String} status Failed to authenticate token
 *
 * @apiError (Error 401) {String} status No access token provided
 */
apiTupperRouter.delete('/:uuid', Routes.deleteTupper);

app.use('/api/tuppers/', apiTupperRouter);


/**
 * Public API Users
 */

var apiUsersPublicRouter = express.Router();

/**
 * @api {post} /api/users/authenticate Authenticate user
 * @apiVersion 1.0.0
 * @apiName Authenticate user
 * @apiGroup Users
 *
 * @apiParam {String} email Username (email address) of the User
 * @apiParam {String} password Password of the User
 *
 * @apiSuccess {Object} token The JSONWebToken for authentication
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "success": {Boolean},
 *      "message": {String},
 *      "token": {String}
 *     }
 *
 * @apiError (Error 401) {Object} status Username or password wrong
 */
apiUsersPublicRouter.post('/authenticate', Routes.authenticate);

/**
 * @api {post} /api/users/create Create user
 * @apiVersion 1.0.0
 * @apiName CreateUser
 * @apiGroup Users
 *
 * @apiParam {String} email Username (email address) of the User
 * @apiParam {String} password Password of the User (Min length 10; min 1 digit, min 1 capital letter, min 1 special character)
 *
 * @apiSuccess {Object} status Success
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "success": {Boolean},
 *      "message": {String},
 *      "token": {String}
 *     }
 *
 * @apiError (Error 500) {Object} status User with this email already exists
 *
 * @apiError (Error 500) {Object} status Email does not look like an email address
 *
 * @apiError (Error 500) {Object} errors Array that contains the errors in the password
 */
apiUsersPublicRouter.post('/create', Routes.createUser);

app.use('/api/users/', apiUsersPublicRouter);


/**
 * Protected API Users
 */

var apiUsersRouter = express.Router();

apiUsersRouter.use(Routes.validate);


/**
 * @api {post} /api/users/update Update user
 * @apiVersion 1.0.0
 * @apiName UpdateUser
 * @apiGroup Users
 *
 * @apiParam {String} password New password (Min length 10; min 1 digit, min 1 capital letter, min 1 special character)
 *
 * @apiHeader x-access-token JSONWebToken
 *
 * @apiSuccess {Object} status Password successfully updated
 *
 * @apiError (Error 401) {String} status No access token provided
 *
 * @apiError (Error 401) {String} status Failed to authenticate token
 *
 * @apiError (Error 500) {Object} errors Array that contains the errors in the password
 */
apiUsersRouter.post('/update', Routes.updateUser);

/**
 * @api {get} /api/users/foodGroups Get foodGroups
 * @apiVersion 1.0.0
 * @apiName GetFoodGroups
 * @apiGroup Users
 *
 * @apiHeader x-access-token JSONWebToken
 *
 * @apiSuccess {String[]} foodGroups An array containing the foodGroups
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *      {["Berries",
 *        "Ice cream",
 *        "Meat"]}
 *
 * @apiError (Error 401) {String} status Failed to authenticate token
 *
 * @apiError (Error 401) {String} status No access token provided
 */
apiUsersRouter.get('/foodGroups', Routes.getFoodGroups);

/**
 * @api {get} /api/users/foodGroups Update foodGroups
 * @apiVersion 1.0.0
 * @apiName UpdateFoodGroups
 * @apiGroup Users
 *
 * @apiParam {String[]} foodGroups FoodGroups
 *
 * @apiHeader x-access-token JSONWebToken
 *
 * @apiSuccess {String} status FoodGroups successful updated
 *
 * @apiError (Error 401) {String} status Failed to authenticate token
 *
 * @apiError (Error 401) {String} status No access token provided
 */
apiUsersRouter.post('/foodGroups', Routes.updateFoodGroups);

app.use('/api/users/', apiUsersRouter);


/**
 * Start Server
 */

app.listen(app.get('port'));
console.log('Server running on port ' + app.get('port'));
