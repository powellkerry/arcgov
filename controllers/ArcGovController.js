var app = angular.module('arcgov', ['ngRoute']);


app.config(function($routeProvider) {
    $routeProvider.when('/', {
            controller: 'HomeController',
            templateUrl: '/views/home.html'
        }).
        when('/cemeteries', {
            controller: 'CemeteriesController',
            templateUrl: '/views/cemeteries.html'
        }).
        when('/owners', {
            controller: 'OwnersController',
            templateUrl: '/views/owners/main.html'
    });
});

app.controller('MainController', function($scope) {
    $scope.routeToMain = function() {
        window.location = '/';
    }
});

app.controller('StatesController', function($scope, appLoadFactory) {
    $scope.init = function() {
        appLoadFactory.loadStates().success(function(data) {
            $scope.states = data;
        });
    }
    $scope.init();
});


app.factory('appLoadFactory', function($http) {
    var factory = {};
    factory.loadStates = function() {
        return $http.get('/JSON/states.json');
    }
    return factory;
});

