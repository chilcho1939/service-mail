myApp.factory('LoginService', ['$rootScope', 'Constants', 'Utils', '$log', function($rootScope, Constants, Utils, $log) {
    return {
        login: function(user) {

        },
        signin: function(user) {
            return Utils.ApiRequest({
                url: $rootScope.app.context + Constants.ENDPOINT_CREATE_USER,
                method: 'POST',
                data: user
            }).then(response => {
                if (response.codigo == Constants.SUCCESS_RESPONSE_CODE) {
                    return response;
                }
            }).catch(error => {
                $log.error("Error al crear el usuario: " + error);
            })
        }
    };
}]);