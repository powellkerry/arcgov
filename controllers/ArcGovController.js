var app = angular.module('arcgov', ['ngRoute','angular-md5']);


app.config(function($routeProvider) {
    $routeProvider.when('/', {
            controller: 'HomeController',
            templateUrl: '/views/home.html'
        }).
        when('/register', {
            controller: 'RegisterController',
            templateUrl: '/views/register.html'
        }).
        when('/login', {
            controller: 'LoginController',
            templateUrl: '/views/login.html'
        }).
        when('/cemeteries', {
            controller: 'CemeteriesController',
            templateUrl: '/views/cemeteries.html'
        }).
        when('/cemeteries/:cem_id', {
            controller: 'CemeteryController',
            templateUrl: 'views/cemetery.html'
        }).
        when('/owners', {
            controller: 'OwnersController',
            templateUrl: '/views/owners/main.html'
    });
});

app.controller('MainController', function($scope) {
    $scope.routeToMain = function() {
        window.location = '/';
    };
    $scope.routeToRegister = function() {
        window.location = '/#/register'
    }
    $scope.routeToLogIn = function() {
        window.location = '/#/login'
    }
});

app.controller('StatesController', function($scope, appLoadFactory) {
    $scope.init = function() {
        appLoadFactory.loadStates().success(function(data) {
            $scope.states = data;
        });
    };
    $scope.init();
});


app.factory('appLoadFactory', function($http) {
    var factory = {};
    factory.loadStates = function() {
        return $http.get('/JSON/states.json');
    };
    return factory;
});

