var app = angular.module('arcgov');

arcgov = {
    auth: {
        user: {
            email:null,
            password:null
        },
        lastLogin: null
    }
};

app.controller('LoginController', function($scope, LoginFactory, md5) {
    $scope.submitLoginForm = function() {
        if ($scope.user && $scope.user.email) {
            LoginFactory.login($scope.user.email, function(data) {
                if (data.password == md5.createHash($scope.user.password)) {
                    localStorage.setItem('auth', '{"user": {"email": "'+$scope.user.email+'", "password": "'+data.password+'"}, "lastLogin": "'+new Date()+'"}');
                    window.location = '/';
                }
            });
        }
    };
});

app.factory('LoginFactory', function($http) {
    return {
        login: function(email, callback) {
            $http.post('/login', {email: email}).success(callback).error(function() {console.log('Failed to get login info');});
        }
    };
});