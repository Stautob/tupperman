define(['app/models/tupper', 'app/services/StorageService', 'app/services/uuidService'], function (Tupper, StorageService, UuidService) {
    'use strict';

    var TupperController = function ($location, $scope, storageService, $routeParams, $mdToast) {
        storageService.getFoodGroups(this).success(function (data) {
            $scope.foodGroups = data.foodGroups;
        });

        if ($routeParams.id == "new") {
            $scope.tupper = new Tupper();
            console.log($scope.tupper.id);
        } else {
            storageService.getTupper($routeParams.id).success(function (tupper) {
                tupper.dateOfFreeze = new Date(tupper.dateOfFreeze);
                $scope.tupper = tupper;
            });
        }

        $scope.submitNew = function () {
            storageService.addTupper($scope.tupper).success(function (data) {
                $location.path('/tuppers/' + data.id);
            });
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Saved!')
                    .hideDelay(1500)
            );
        };

        $scope.createDuplicate = function () {
            var duplicateTupper = $scope.tupper;
            duplicateTupper.name = "Duplicate of " + $scope.tupper.name;
            duplicateTupper.id = UuidService.getRandomUuid();

            storageService.addTupper(duplicateTupper).success(function (data) {
                $location.path('/tuppers/' + data.id);
            });
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Duplicate created!')
                    .hideDelay(1500)
            );
        };

        $scope.openOptions = function () {
            $location.path('/options');
        }
    };

    return TupperController;
});
