myApp.factory('ActivationService', ['$rootScope', 'Utils', 'Constants', '$log', function ($rootScope, Utils, Constants, $log) {
    var activationService = {
        activateAccount: function (token) {
            return Utils.ApiRequest({
                url: $rootScope.app.context + Constants.ENDPOINT_ACTIVATE_ACCOUNT + token,
                method: 'PUT'
            }).then(response => {
                if (response.data.code == Constants.SUCCESS_REPONSE_CODE) {
                    return response.data;
                }
            }).catch(err => {
                $log.error("Error al activar la cuenta:" + err);
            })
        }
    };
    return activationService;
}]);