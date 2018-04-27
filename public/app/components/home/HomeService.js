myApp.factory('HomeService', ['$rootScope', 'RestServiceUtil', '$log', function($rootScope, RestServiceUtil, $log) {

    var request = {};
    var endpoint = '/api/mailService'

    return {
        sendEmail: function(data) {
            $log.debug('Preparando request..');
            return RestServiceUtil.post(endpoint, data).then((successResponse) => {
                if (successResponse.message == 'success') {
                    return successResponse.obj;
                }
            }, (errorResponse) => {
                $log.error("Error al procesar el correo");
            });
        }
    }
}]);