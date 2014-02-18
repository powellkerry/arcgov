var app = angular.module('arcgov');

app.controller('CemeteryController', function ($scope, $routeParams, ManageCemeteryFactory) {
    $scope.cem_id = $routeParams.cem_id;
    $scope.cemetery = {};
    $scope.plots = [];
    $scope.plot = {};
    $scope.masterPlot = {};
    $scope.owner = null;
    $scope.masterOwner = null;
    $scope.occupant = null;
    $scope.masterOccupant = null;

    ManageCemeteryFactory.getCemetery($scope.cem_id, function (data) {
        $scope.cemetery = data[0];
    });

    ManageCemeteryFactory.loadPlots($scope.cem_id, function (data) {
        $scope.plots = data;
    });

    $scope.rowClick = function (plot, $event) {
        $('.list .selected').removeClass('selected');
        $($event.currentTarget).addClass('selected');
        $scope.masterPlot = angular.copy(plot);
        $scope.plot = plot;
        $('.right').css({
            display: 'inline-block'
        });
        if (plot.owner_id) {
            ManageCemeteryFactory.loadOwner(plot.owner_id, function (data) {
                $scope.owner = data[0];
            });
        } else {
            $scope.owner = null;
        }

        if (plot.occupant_id) {
            ManageCemeteryFactory.loadOccupant(plot.occupant_id, function (data) {
                $scope.occupant = data[0];
                var birthDate = new Date(data[0].occupant_birth_date),
                    deathDate = new Date(data[0].occupant_death_date);

                birthDate = birthDate.toISOString();
                deathDate = deathDate.toISOString();
                $scope.occupant.occupant_birth_date = birthDate.substr(0, birthDate.indexOf('T'));
                $scope.occupant.occupant_death_date = deathDate.substr(0, deathDate.indexOf('T'));
            });
        } else {
            $scope.occupant = null;
        }
    };

    // Plots

    $scope.showPlotForm = function (plot) {
        if (plot) {
            $('.plot-form-window .title').text('Edit Plot');
        } else {
            $('.plot-form-window .title').text('Add Plot');
            $scope.plot = {};
        }
        $('.mask').show();
        $('.plot-form-window').show();
    };
    $scope.submitPlotForm = function () {
        if ($scope.plot.plot_id) {
            ManageCemeteryFactory.updatePlot($scope.plot, $scope.cem_id, function () {
                $scope.hidePlotForm();
            });
        } else {
            ManageCemeteryFactory.createPlot($scope.plot, $scope.cem_id, function (data) {
                $scope.plot.plot_id = data.plot_id;
                $scope.plots.push($scope.plot);
                $scope.hidePlotForm();
            });
        }
    };

    $scope.deletePlot = function (plot) {
        ManageCemeteryFactory.deletePlot(plot.plot_id, function () {
            $scope.plots.splice($scope.plots.indexOf(plot), 1);
        });
    };

    $scope.cancelPlotForm = function () {
        $scope.plots[$scope.plots.indexOf($scope.plot)] = $scope.masterPlot;
        $('.right').css({
            display: 'none'
        });
        $scope.hidePlotForm();
    };

    $scope.hidePlotForm = function () {
        $('.mask').hide();
        $('.plot-form-window').hide();
    };

    // Owners

    $scope.showOwnerForm = function (owner, plot) {
        $('.mask').show();
        $('.owner-form-window').show();
        $scope.masterOwner = angular.copy($scope.owner);
    };

    $scope.submitOwnerForm = function () {
        if ($scope.owner.owner_id) {
            ManageCemeteryFactory.updateOwner($scope.owner, function () {
                $scope.hideOwnerForm();
            });
        } else {
            ManageCemeteryFactory.createOwner($scope.owner, $scope.plot, function (data) {
                $scope.owner.owner_id = data.owner_id;
                $scope.plot.owner_id = data.owner_id;
                $scope.hideOwnerForm();
            });
        }
    };
    $scope.removeOwner = function (owner) {
        ManageCemeteryFactory.deleteOwner(owner.owner_id, function () {
            $scope.owner = null;
            $scope.plot.owner_id = null;
        });
    };

    $scope.cancelOwnerForm = function () {
        $scope.owner = $scope.masterOwner;
        $scope.hideOwnerForm();
    };

    $scope.hideOwnerForm = function () {
        $('.mask').hide();
        $('.owner-form-window').hide();
    };

    // Occupants

    $scope.showOccupantForm = function (occupant, plot) {
        $('.mask').show();
        $('.occupant-form-window').show();
        $scope.masterOccupant = angular.copy($scope.occupant);
    };

    $scope.submitOccupantForm = function () {
        if ($scope.occupant.occupant_id) {
            ManageCemeteryFactory.updateOccupant($scope.occupant, $scope.plot, function () {
                $scope.hideOccupantForm();
            });
        } else {
            ManageCemeteryFactory.createOccupant($scope.occupant, $scope.plot, function (data) {
                $scope.occupant.occupant_id = data.occupant_id;
                $scope.plot.occupant_id = data.occupant_id;
                $scope.hideOccupantForm();
            });
        }
    };

    $scope.removeOccupant = function () {
        ManageCemeteryFactory.deleteOccupant($scope.occupant.occupant_id, function () {
            $scope.plot.occupant_id = null;
            $scope.occupant = null;
        });
    };

    $scope.cancelOccupantForm = function () {
        $scope.occupant = $scope.masterOccupant;
        $scope.hideOccupantForm();
    };

    $scope.hideOccupantForm = function () {
        $('.mask').hide();
        $('.occupant-form-window').hide();
    };
});

app.factory('ManageCemeteryFactory', function ($http) {
    var factory = {
        getCemetery: function (cem_id, callback) {
            return $http.post('/loadCemetery', {cem_id: cem_id, auth: JSON.parse(localStorage.getItem('auth'))}).success(callback).error(arcgov.errors.handleError);
        },
        loadPlots: function (cem_id, callback) {
            return $http.post('/loadPlots', {cem_id: cem_id, auth: JSON.parse(localStorage.getItem('auth'))}).success(callback).error(arcgov.errors.handleError);
        },
        createPlot: function (plot, cem_id, callback) {
            return $http.post('/createPlot', {plot: plot, cem_id: cem_id, auth: JSON.parse(localStorage.getItem('auth'))}).success(callback).error(arcgov.errors.handleError);
        },
        updatePlot: function (plot, cem_id, callback) {
            return $http.post('/updatePlot', {plot: plot, cem_id: cem_id, auth: JSON.parse(localStorage.getItem('auth'))}).success(callback).error(arcgov.errors.handleError);
        },
        deletePlot: function (plot_id, callback) {
            return $http.post('/deletePlot', {plot_id: plot_id, auth: JSON.parse(localStorage.getItem('auth'))}).success(callback).error(arcgov.errors.handleError);
        },
        loadOwner: function (owner_id, callback) {
            return $http.post('loadOwner', {owner_id: owner_id, auth: JSON.parse(localStorage.getItem('auth'))}).success(callback).error(arcgov.errors.handleError);
        },
        createOwner: function (owner, plot, callback) {
            return $http.post('/createOwner', {owner: owner, plot: plot, auth: JSON.parse(localStorage.getItem('auth'))}).success(callback).error(arcgov.errors.handleError);
        },
        updateOwner: function (owner, callback) {
            return $http.post('/updateOwner', {owner: owner, auth: JSON.parse(localStorage.getItem('auth'))}).success(callback).error(arcgov.errors.handleError);
        },
        deleteOwner: function (owner_id, callback) {
            return $http.post('/deleteOwner', {owner_id: owner_id, auth: JSON.parse(localStorage.getItem('auth'))}).success(callback).error(arcgov.errors.handleError);
        },
        loadOccupant: function (occupant_id, callback) {
            return $http.post('/loadOccupant', {occupant_id: occupant_id, auth: JSON.parse(localStorage.getItem('auth'))}).success(callback).error(arcgov.errors.handleError);
        },
        createOccupant: function (occupant, plot, callback) {
            return $http.post('/createOccupant', {occupant: occupant, plot: plot, auth: JSON.parse(localStorage.getItem('auth'))}).success(callback).error(arcgov.errors.handleError);
        },
        updateOccupant: function (occupant, plot, callback) {
            return $http.post('/updateOccupant', {occupant: occupant, plot: plot, auth: JSON.parse(localStorage.getItem('auth'))}).success(callback).error(arcgov.errors.handleError);
        },
        deleteOccupant: function (occupant_id, callback) {
            return $http.post('/deleteOccupant', {occupant_id: occupant_id, auth: JSON.parse(localStorage.getItem('auth'))}).success(callback).error(arcgov.errors.handleError);
        }
    };
    return factory;
});