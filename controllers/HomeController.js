var app = angular.module('arcgov');

app.controller('HomeController', function($scope, $sce, HomeFactory) {
    $scope.archives = [];
    HomeFactory.getArchives(null, function(data) {
        $scope.archives = data;
    });
    $scope.getArchiveDescription = function(archive) {
        return $sce.trustAsHtml(archive.desc);
    };
    $scope.routeToArchive = function(archive) {
        window.location = archive.url;
    };
});

app.factory('HomeFactory', function($http) {
    var factory = {
        getArchives:  function(userId, callback) {
            return $http.get('/JSON/archives.json', userId).success(callback).error(function() {console.warn('Failed to load archives');});
        }
    };
    return factory;
});