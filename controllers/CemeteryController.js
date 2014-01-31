var app = angular.module('arcgov');

app.controller('CemeteryController', function($scope, CemeteryFactory) {
    $scope.cemeteries = [];
    CemeteryFactory.getCemeteries(null, function(data) {
        $scope.cemeteries = data;
    });
});

app.factory('CemeteryFactory', function($http) {
    var factory = {
        getCemeteries:  function(userId, callback) {
            return $http.get('/JSON/cemeteries.json', userId).success(callback).error(function() {console.warn('Failed to load archives')});
        }
    }
    return factory;
})