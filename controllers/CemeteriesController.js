var app = angular.module('arcgov');

app.controller('CemeteriesController', function($scope, CemeteryFactory) {
    $scope.cemeteries = [];
    $scope.cemetery = {};
    $scope.cemeteryMaster = {};
    CemeteryFactory.getCemeteries(function(data) {
        $scope.cemeteries = data;
    });

    $scope.loadCemeteryMap = function(cemetery, $event) {
        $('.list .selected').removeClass('selected');
        $($event.currentTarget).addClass('selected');
        $scope.cemeteryMaster = angular.copy(cemetery);
        $scope.cemetery = cemetery;
        CemeteryFactory.geoCodeAddress($scope.getFullAddress(cemetery), function(data) {
            var lat = data.results[0].geometry.location.lat,
                lng = data.results[0].geometry.location.lng;

            var mapOptions = {
                center: new google.maps.LatLng(lat, lng),
                zoom: 16
            };
            var map = new google.maps.Map(document.getElementById("map-canvas"),
                mapOptions);

            new google.maps.Marker({
                position: new google.maps.LatLng(lat,lng),
                map: map,
                title: cemetery.cem_name
            });
        });
        $('.right').css({
            display: 'inline-block'
        });
    };
    $scope.getFullAddress = function(cemetery) {
        return cemetery.cem_street+', '+cemetery.cem_city+', '+cemetery.cem_state+' '+cemetery.cem_zip;
    };

    $scope.showCemeteryForm = function(cemetery) {
        if (!cemetery) {
            $('.cemetery-form-window .title').text('Add Cemetery');
            $scope.cemetery = {};
        } else {
            $('.cemetery-form-window .title').text('Edit Cemetery');
        }
        $('.mask').show();
        $('.cemetery-form-window').show();
    };

    $scope.submitCemeteryForm = function() {
        if ($scope.cemetery.cem_id) {
            CemeteryFactory.updateCemetery($scope.cemetery, function() {
                $scope.hideCemeteryForm();
            });
        } else {
            CemeteryFactory.createCemetery($scope.cemetery, function(data) {
                $scope.cemetery.cem_id = data.cem_id;
                $scope.cemeteries.push($scope.cemetery);
                $scope.hideCemeteryForm();
            });
        }
    };

    $scope.deleteCemetery = function(cemetery) {
        CemeteryFactory.deleteCemetery(cemetery, function() {
            $scope.cemeteries.splice($scope.cemeteries.indexOf(cemetery), 1);
        });
    };

    $scope.cancelCemeteryForm = function() {
        $scope.cemeteries[$scope.cemeteries.indexOf($scope.cemetery)] = $scope.cemeteryMaster;
        $scope.hideCemeteryForm();
    };

    $scope.hideCemeteryForm = function() {
        $('.mask').hide();
        $('.cemetery-form-window').hide();
    };

    $scope.goToManage = function(cemetery) {
        window.location = '#/cemeteries/'+cemetery.cem_id;
    };
});

app.factory('CemeteryFactory', function($http) {
    var factory = {
        getCemeteries:  function(callback) {
            return $http.post('/loadCemeteries', {auth: JSON.parse(localStorage.getItem('auth'))}).success(callback).error(function(data, status) {arcgov.errors.handleError(data, status);});
        },
        geoCodeAddress: function(address, callback) {
            return $http.get('http://maps.googleapis.com/maps/api/geocode/json?address='+address+'&sensor=false').success(callback).error(function(data, status) {arcgov.errors.handleError(data, status);});
        },
        createCemetery: function(cemetery, callback) {
            return $http.post('/createCemetery', {cemetery:cemetery, org_id: 1, auth: JSON.parse(localStorage.getItem('auth'))}).success(callback).error(function(data, status) {arcgov.errors.handleError(data, status);});
        },
        updateCemetery: function(cemetery, callback) {
            return $http.post('/updateCemetery', {cemetery:cemetery, org_id: 1, auth: JSON.parse(localStorage.getItem('auth'))}).success(callback).error(function(data, status) {arcgov.errors.handleError(data, status);});
        },
        deleteCemetery: function(cemetery, callback) {
            return $http.post('/deleteCemetery', {cem_id: cemetery.cem_id, org_id:1, auth: JSON.parse(localStorage.getItem('auth'))}).success(callback).error(function(data, status) {arcgov.errors.handleError(data, status);});
        }
    };
    return factory;
});