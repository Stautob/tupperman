define(['app/services/uuidService'], function (uuidService) {
    'use strict';

    var Tupper = function (id,
                          name,
                          description,
                          foodGroup,
                          dateOfFreeze) {

        this.id = id || uuidService.getRandomUuid();
        this.name = name;
        this.description = description;
        this.foodGroup = foodGroup;
        this.dateOfFreeze = dateOfFreeze || new Date();
    };

    return Tupper;
});





