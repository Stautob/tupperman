require.config({
    // base url relative to the index.html
    baseUrl: './',
    paths: {
        'frameworks/angular': 'frameworks/angular/angular',
        'libraries/angularRoute': 'libraries/angular-route.min',
        'app': 'classes',
        'frameworks/angular-animate': "http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-animate.min",
        'frameworks/angular-aria': "http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-aria.min",
        'frameworks/angular-messages': "http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-messages.min",
        'frameworks/angular-material': "http://ajax.googleapis.com/ajax/libs/angular_material/1.0.0/angular-material.min"
    },
    // angular does not support async loading out of the box -> use the shim loader
    shim: {
        'frameworks/angular': {
            exports: 'angular'
        },
        'libraries/angularRoute': {
            deps: ['frameworks/angular']
        },
        'frameworks/angular-animate': {
            deps: ['frameworks/angular']
        },
        'frameworks/angular-aria': {
            deps: ['frameworks/angular']
        },
        'frameworks/angular-messages': {
            deps: ['frameworks/angular']
        },
        'frameworks/angular-material': {
            deps: ['frameworks/angular', 'frameworks/angular-animate', 'frameworks/angular-aria', 'frameworks/angular-messages' ]
        }
    }
});

define(['frameworks/angular', 'app/modules/tupperman'], function (Angular, TupperMan) {
    'use strict';

    Angular.element(document).ready(function () {
        Angular.bootstrap(document, [TupperMan.name]);
    });
});


