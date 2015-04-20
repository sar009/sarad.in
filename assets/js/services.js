angular
    .module('sarad.services', [])
    .factory('saradApiService', function($http) {
        var saradApi = {};
        var apiUrl = 'http://localhost:8000/api';

        saradApi.getBackgroundImage = function() {
            return $http({
                method: 'GET',
                url: apiUrl + '/get-random-background'
            });
        };

        return saradApi;
    });