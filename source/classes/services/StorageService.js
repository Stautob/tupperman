/**
 * Created by tstauber on 04.11.15.
 */
define(['app/models/tupper', 'app/services/uuidService'], function (Tupper, uuidService) {
    'use strict';

    var StorageService = function ($http) {
        var self = this;
        var subscribers = [];

        this.getAllTuppers = function () {
            return $http.get('/api/tuppers').error(function (e) {
                console.error({msg: 'Error fetching Tuppers', e: e});
            });
        };

        this.getFoodGroups = function () {
            return $http.get('/api/options/foodGroups');
        };

        this.setFoodGroups = function (foodGroups) {
            return $http.post('/api/options/foodGroups', foodGroups);
        };

        this.getTupper = function (id) {
            return $http.get('/api/tuppers/' + id);
        };

        this.addTupper = function (tupper) {
            return $http.post('/api/tuppers/' + tupper.id, tupper);
        };

        this.removeTupper = function (id) {
            return $http.delete('/api/tuppers/' + id);
        };

        this.removeAllTuppers = function () {
            return $http.delete('/api/tuppers/')
        };
    };

    return StorageService;
});
