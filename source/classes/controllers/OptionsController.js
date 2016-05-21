define(['app/services/StorageService'], function (StorageService) {
    'use strict';

    var OptionsController = function ($location, $scope, storageService, $mdToast) {
        storageService.getFoodGroups(this).success(function (data) {
            $scope.foodGroups = data.foodGroups;
        });

        $scope.setFoodGroups = function () {
            storageService.setFoodGroups($scope.foodGroups).success(function (data) {
                $scope.foodGroups = data.foodGroups;
                $mdToast.simple()
                    .textContent('Saved options!')
                    .hideDelay(1500)
            });
        };

        $scope.saveOptions = function () {
            $scope.setFoodGroups();
            $mdToast.show(

            );
            $location.path('#/tupper');
        }
    };
    
    return OptionsController;
});
