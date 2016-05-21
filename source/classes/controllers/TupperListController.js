define(['app/models/tupper', 'app/services/StorageService'], function (Tupper, StorageService) {
    'use strict';

    var TupperListController = function ($location, $scope, storageService, $mdDialog) {
        storageService.getAllTuppers(this).success(function (data) {
            console.log(data);
            $scope.tuppers = data.tuppers;
        });

        $scope.removeTupper = function (id) {
            storageService.removeTupper(id).success(function (data) {
                $scope.tuppers = data.tuppers;
            });
        };

        $scope.emptyTupper = function (tupper) {
            tupper.description = "";
            tupper.foodGroup = "";
            tupper.dateOfFreeze = null;
            storageService.addTupper(tupper).success(function (data) {
            });
        };

        $scope.openOptions = function () {
            $location.path('/options');
        };

        $scope.deleteAllTuppers = function () {
            storageService.removeAllTuppers();
            $scope.tuppers = [];
        };

        $scope.showConfirmDelAll = function (ev) {
            var confirm = $mdDialog.confirm()
                .title('Proceding will delete all your Tuppers!')
                .targetEvent(ev)
                .ok('Please do it!')
                .cancel('Get me out of here!');

            $mdDialog.show(confirm).then(function () {
                $scope.deleteAllTuppers();
            }, function () {
                console.log("Aborted");
            });
        };
    };

    return TupperListController;
});
