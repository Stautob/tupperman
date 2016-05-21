// declare dependency to angular (similar to import in java)
define(['frameworks/angular', 'libraries/angularRoute', 'app/controllers/TupperListController', 'app/controllers/OptionsController', 'app/controllers/TupperController', 'app/services/StorageService', 'frameworks/angular-material']
    , function (Angular, ngRoute, TupperListController, OptionsController, TupperController, StorageService, ngMaterial) {
        'use strict';

        var TupperMan = Angular.module('tupperman', ['ngRoute', 'ngMaterial']);

        TupperMan.config(function ($routeProvider) {
            $routeProvider.when(
                '/tupper',
                {
                    templateUrl: 'views/list.html',
                    controller: 'TupperListController'
                }
            ).when(
                '/tupper/:id',
                {
                    templateUrl: 'views/detail.html',
                    controller: 'TupperController'
                }
            ).when(
                '/options',
                {
                    templateUrl: 'views/options.html',
                    controller: 'OptionsController'
                }
            ).otherwise(
                {redirectTo: '/tupper'});
        });

        StorageService.$inject = ['$http'];
        TupperMan.service('StorageService', StorageService);

        OptionsController.$inject = ['$location', '$scope', 'StorageService', '$mdToast'];
        TupperMan.controller('OptionsController', OptionsController);

        TupperListController.$inject = ['$location', '$scope', 'StorageService', '$mdDialog'];
        TupperMan.controller('TupperListController', TupperListController);

        TupperController.$inject = ['$location', '$scope', 'StorageService', '$routeParams', '$mdToast'];
        TupperMan.controller('TupperController', TupperController);

        return TupperMan;
    });
