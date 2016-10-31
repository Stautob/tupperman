require.config({
    baseUrl: './',
    paths: {
        'frameworks/angular':          "bower_components/angular/angular.min",
        'frameworks/angular-animate':  "bower_components/angular-animate/angular-animate.min",
        'frameworks/angular-aria':     "bower_components/angular-aria/angular-aria.min",
        'frameworks/angular-messages': "bower_components/angular-messages/angular-messages.min",
        'frameworks/angular-material': "bower_components/angular-material/angular-material.min",
        'libraries/angularRoute':      "bower_components/angular-route/angular-route.min",
        'app': 'classes'
    },
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
            deps: ['frameworks/angular', 'frameworks/angular-animate', 'frameworks/angular-aria', 'frameworks/angular-messages']
        }
    }
});

define(['frameworks/angular', 'app/modules/tupperman'], function (Angular, TupperMan) {
    'use strict';

    Angular.element(document).ready(function () {
        Angular.bootstrap(document, [TupperMan.name]);
    });
});


