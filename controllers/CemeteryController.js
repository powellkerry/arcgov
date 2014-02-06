var app = angular.module('arcgov');

app.controller('CemeteryController', function($scope, $routeParams, ManageCemeteryFactory) {
    $scope.cemetery = {};
    ManageCemeteryFactory.getCemetery($routeParams.cem_id, function(data) {
        $scope.cemetery = data[0];
    });
});

app.factory('ManageCemeteryFactory', function($http) {
    var factory = {
        getCemetery: function(cem_id, callback) {
            return $http.post('/loadCemetery', {cem_id: cem_id}).success(callback).error(function() {console.warn('Failed to load cemetery');});
        }
    };
    return factory;
});