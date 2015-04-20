angular
    .module('sarad.controllers', [])
    .controller("home", function($scope, $interval, saradApiService) {
        $scope.init = function() {
            getBackground();
            $interval(function() {
                getBackground();
            }, 1000 * 60 * 3);
        };

        var getBackground = function() {
            saradApiService.getBackgroundImage().success(function (response) {
                if (response.status === 1) {
                    $scope.backgroundUrl = response.background.url;
                }
            });
        };
    });