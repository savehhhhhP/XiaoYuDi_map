'use strict';


// Declare app level module which depends on filters, and services
//angular.module('map', []).
//    config(['$routeProvider', function ($routeProvider) {
//        $routeProvider.
//            when('/map', {templateUrl: 'app/map.html', controller: MapListCtrl}).
//            otherwise({redirectTo: '/map'});
//    }]);


angular.module('map', [],
    function($routeProvider){
        $routeProvider.
            when('/test',
            {
                templateUrl: 'app/map.html'
            })
            .otherwise({redirectTo: '/test'});;
    }
);