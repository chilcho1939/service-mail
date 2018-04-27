myApp.factory('RestServiceUtil', ['$http', '$q', function($http, $q) {
    return {
        get: function(endpoint, requestParams) {
            //restServicesFunctions.preProcessing(endpoint);
            return $http.get(endpoint, {
                    params: requestParams
                })
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        return $q.reject(response.data);
                    }

                }, function(response) {
                    return $q.reject(response.data);
                });
        },
        post: function(endpoint, requestParams) {
            //restServicesFunctions.preProcessing(endpoint);
            return $http.post(endpoint, requestParams)
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        return $q.reject(response.data);
                    }

                }, function(response) {
                    return $q.reject(response.data);
                });
        },
        put: function(endpoint, requestParams) {
            //restServicesFunctions.preProcessing(endpoint);
            return $http.put(endpoint, requestParams)
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        return $q.reject(response.data);
                    }

                }, function(response) {
                    return $q.reject(response.data);
                });
        },
        del: function(endpoint, requestParams) {
            //restServicesFunctions.preProcessing(endpoint);
            return $http.delete(endpoint, {
                    data: requestParams
                })
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        return $q.reject(response.data);
                    }

                }, function(response) {
                    return $q.reject(response.data);
                });
        }
    }
}]);