var app = angular.module('arcgov');

app.controller('CemeteriesController', function($scope, CemeteryFactory) {
    $scope.cemeteries = [];
    $scope.cemetery = {};
    CemeteryFactory.getCemeteries(null, function(data) {
        $scope.cemeteries = data;
    });

    $scope.loadCemeteryMap = function(cemetery) {
        $scope.cemetery = cemetery;
        CemeteryFactory.geoCodeAddress($scope.getFullAddress(cemetery), function(data) {
            var lat = data.results[0].geometry.location.lat,
                lng = data.results[0].geometry.location.lng;

            var mapOptions = {
                center: new google.maps.LatLng(lat, lng),
                zoom: 18
            };
            var map = new google.maps.Map(document.getElementById("map-canvas"),
                mapOptions);

            new google.maps.Marker({
                position: new google.maps.LatLng(lat,lng),
                map: map,
                title: cemetery.name
            });
        });
    }
    $scope.getFullAddress = function(cemetery) {
        return cemetery.address+', '+cemetery.city+', '+cemetery.state+' '+cemetery.zip;
    }
});

app.factory('CemeteryFactory', function($http) {
    var factory = {
        getCemeteries:  function(userId, callback) {
            return $http.get('/JSON/cemeteries.json', userId).success(callback).error(function() {console.warn('Failed to load archives')});
        },
        geoCodeAddress: function(address, callback) {
            return $http.get('http://maps.googleapis.com/maps/api/geocode/json?address='+address+'&sensor=false').success(callback).error(function() {console.warn('Geocode request failed')});
        }
    }
    return factory;
});