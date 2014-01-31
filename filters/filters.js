var app = angular.module('arcgov');

app.filter('percentage', function() {
    return function(input) {
        return input ? Math.round(input * 100)+'%' : '0%'
    }
})