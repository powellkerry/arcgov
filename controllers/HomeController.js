var app = angular.module('arcgov');

app.controller('HomeController', function ($scope, $sce, HomeFactory) {
    $scope.archives = [];
    HomeFactory.getArchives(function (data) {
        $scope.archives = data;
    });
    $scope.getArchiveDescription = function (archive) {
        return $sce.trustAsHtml(archive.desc);
    };
    $scope.routeToArchive = function (archive) {
        window.location = archive.url;
    };
});

app.factory('HomeFactory', function ($http) {
    var factory = {
        getArchives:  function (callback) {
            return $http.get('/JSON/archives.json', {auth: arcgov.auth}).success(callback).error(arcgov.errors.handleError);
        }
    };
    return factory;
});