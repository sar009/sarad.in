angular.module('sarad.routers', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        var md5Checksum = "@@partialChecksum@@";
        $routeProvider.when('/', {
            templateUrl: 'assets/templates/home.html?id=' + md5Checksum,
            controller: 'home'
        });
    }]);