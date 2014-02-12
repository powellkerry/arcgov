var app = angular.module('arcgov');

app.controller('LoginController', function($scope, LoginFactory, md5) {
    $scope.submitLoginForm = function() {
        if ($scope.user && $scope.user.email) {
            LoginFactory.login($scope.user.email, function(data) {
                if (data.password == md5.createHash($scope.user.password)) {
                    window.location = '/';
                }
            });
        }
    }
});

app.factory('LoginFactory', function($http) {
    return {
        login: function(email, callback) {
            $http.post('/login', {email: email}).success(callback).error(function() {console.log('Failed to get login info');});
        }
    }
});