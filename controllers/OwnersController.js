var app = angular.module('arcgov');



app.controller('OwnersController', function($scope, OrdersFactory) {
    $scope.owners = [{name: 'Kerry Powell', street: '7796 N Mountain Ash Way', city: 'Eagle Mountain', state: 'UT', zip: 84005, id:12345}];
    $scope.ownerMaster;
    $scope.selectedOwner;
    $scope.selectedElement;
    $scope.addEditForm = $('#addEditForm');
    $scope.addOwnerButton = $('.add-owner');
    $scope.editOwnerButton =  $('.edit-owner');

    $scope.selectOwner = function(owner, $event) {
        if (!$scope.addOwnerButton.hasClass('selected')) {
            $scope.selectedOwner = owner;
            $scope.ownerMaster = angular.copy(owner);
            $scope.selectedElement = $($event.currentTarget);
            $scope.selectedElement.addClass('selected');
        }
    }

    $scope.addOwnerClick = function() {
        if (!$scope.addOwnerButton.hasClass('selected')) {
            $scope.reset();
        }
        $scope.addEditForm.animate({
            top: '-1px',
            height: $('#addEditForm').css('height','auto').height(),
            padding: '2rem'
        });
        $scope.addOwnerButton.addClass('selected');
    }

    $scope.editOwnerClick = function() {
        if ($scope.selectedOwner) {
            if (!$scope.editOwnerButton.hasClass('selected') && $scope.addOwnerButton.hasClass('selected')) {
                $scope.reset();
            }
            $scope.owner = $scope.selectedOwner;
            $scope.addEditForm.animate({
                top: '-1px',
                height: $scope.addEditForm.css('height','auto').height(),
                padding: '2rem'
            });
            $scope.editOwnerButton.addClass('selected');
        }
    }
    $scope.deleteOwnerClick = function() {
        if ($scope.selectedOwner) {
            OrdersFactory.deleteOwner($scope.selectedOwner, function() {
                $scope.owners.splice($scope.owners.indexOf($scope.selectedOwner),1);
            });
        }

    }

    $scope.submit = function() {
        if (!$scope.owner.id) {
            OrdersFactory.addOrder($scope.owner, function() {
                $scope.owner.id = Math.floor((Math.random() * 100000) + 1);
                $scope.owners.push($scope.owner);
                $scope.reset();
            });
        } else {
            OrdersFactory.editOrder($scope.owner, function() {
                $scope.reset();
                $scope.selectedElement.removeClass('selected');
                $scope.selectedElement = null;
                $scope.selectedOwner = null;
            })
        }
    };
    $scope.cancel = function() {
        if ($scope.ownerMaster) {
            $scope.owners[$scope.owners.indexOf($scope.owner)] = $scope.ownerMaster;
            $scope.ownerMaster = undefined;
        }
        $scope.reset();
    }
    $scope.reset = function() {
        $scope.owner = undefined;
        $scope.selectedOwner = undefined;
        $scope.ownerMaster = undefined;
        $scope.close();
    }
    $scope.close = function() {
        $('#addEditForm').animate({
            top: '-500px',
            height: '0',
            padding: '0'
        });
        $('.add-owner').removeClass('selected');
        $('.edit-owner').removeClass('selected');
        if ($scope.selectedElement) {
            $scope.selectedElement.removeClass('selected');
            $scope.selectedElement = null;
        }
    }
});

app.factory('OrdersFactory', function($http) {
    var factory = {};
    factory.addOrder = function(data, callback) {
        return $http.get('/request.html', data).success(callback).error(function() {console.warn('Add owner post failed')});
    }
    factory.editOrder = function(data, callback) {
        return $http.get('/request.html', data).success(callback).error(function() {console.warn('Edit owner post failed')});
    }
    factory.deleteOwner = function(data, callback) {
        return $http.get('/request.html', data).success(callback).error(function() {console.warn('Delete owner post failed')});
    }
    return factory;
});