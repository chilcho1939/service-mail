myApp.factory('Utils', ['$http', 'Constants', '$q', function($http, Constants, $q) {
    return {
        ApiRequest: function(args) {
            // Let's retrieve the token from the cookie, if available
            //$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
            params = args.params || {};
            args = args || {};
            var url = args.url || '',
                method = args.method || "GET",
                params = params,
                data = args.data || {};
            var request;
            request = $http({
                url: url,
                method: method.toUpperCase(),
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            });

            return request.then(handleSuccessAPI, handleErrorAPIRequest);
        }
    }

    function handleErrorAPIRequest(response) {
        if (response.status == 500) {
            // $.notify($rootScope.translate('msg.general.errorInesperado'), {
            //     type: 'danger'
            // });
        }
        if (response.status == 400 && response.statusText == "Bad Request") {
            // $.notify($rootScope.translate('msg.general.errorInesperado'), {
            //     type: 'danger'
            // });
        }
        if (!angular.isObject(response.data) || !response.data.message) {
            return $q.reject("An unknown error occurred.");
        }
        return $q.reject(response.data.message);
    }

    function handleSuccessAPI(response) {
        if (response.codigo == Constants.ERROR_RESPONSE_CODE) {
            //Cambiar por notificaciones bootstrap

            // $.notify(response.data.mensaje, {
            //     type: 'danger'
            // });
        }
        return response;
    }
}]);