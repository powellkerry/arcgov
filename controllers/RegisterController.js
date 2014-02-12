var app = angular.module('arcgov');

app.controller('RegisterController', function($scope, RegisterFactory, md5) {
    $scope.user = {};
    $scope.submitRegisterForm = function() {
        $scope.validate(function(isValid) {
            if (isValid) {
                $scope.user.password = md5.createHash($scope.user.password);
                $scope.user.password_confirm = md5.createHash($scope.user.password_confirm);
                console.log($scope.user)
                RegisterFactory.register($scope.user, function() {
                    window.location = '/';
                });
            } else {
                alert('Not valid.');
            }
        });
    }

    $scope.validate = function(callback) {
        var valid = true;
        if (!$scope.user.first_name) { valid = false; }
        if (!$scope.user.last_name) { valid = false; }

        if (!$scope.user.email || !$scope.user.email_confirm || $scope.user.email != $scope.user.email_confirm) {
            valid = false;
        }
        if (!$scope.user.password || !$scope.user.password_confirm || $scope.user.password != $scope.user.password_confirm) {
            valid = false;
        }
        return callback(valid);
    }


});

app.factory('RegisterFactory', function($http) {
    return {
        register: function(user, callback) {
           $http.post('/register', {user: user}).success(callback).error(function() {console.log('Failed to register user');});
        }

    }
})