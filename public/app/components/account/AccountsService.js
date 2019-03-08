myApp.factory('AccountsService', ['$rootScope', 'Utils', 'Constants', '$log', function ($rootScope, Utils, Constants, $log) {
    const accountOperations = {
        addAccount: function (account) {
            return Utils.ApiRequest({
                url: $rootScope.app.context + Constants.ENDPOINT_ADD_ACCOUNT,
                method: 'POST',
                data: account
            }).then(response => {
                if (response.data.code == Constants.SUCCESS_RESPONSE_CODE) {
                    return true;
                }
            }).catch(err => {
                $log.error(err);
            });
        },
        editAccount: function (account) {
            return Utils.ApiRequest({
                url: $rootScope.app.context + Constants.ENDPOINT_EDIT_ACCOUNT,
                method: 'POST',
                data: account
            }).then(response => {
                if (response.data.code == Constants.SUCCESS_RESPONSE_CODE) {
                    return true;
                }
            }).catch(err => {
                $log.error(err);
            });
        },
        removeAccount: function (id) {
            return Utils.ApiRequest({
                url: $rootScope.app.context + Constants.ENDPOINT_DELETE_ACCOUNT + id,
                method: 'DELETE'
            }).then(response => {
                if (response.data.code == Constants.SUCCESS_RESPONSE_CODE) {
                    return response.data;
                }
            }).catch(err => {
                $log.error("Error al eliminar el registro: " + err);
            });
        },
        findAllByUser: function (user) {
            return Utils.ApiRequest({
                url: $rootScope.app.context + Constants.ENDPOINT_FINDALL_ACCOUNTS_BY_USER,
                method: 'POST',
                data: {
                    user: user
                }
            }).then(response => {
                if (response.data.code == Constants.SUCCESS_RESPONSE_CODE) {
                    return response.data.result;
                }
            }).catch(err => {
                $log.error("Error obteniendo el listado de hosts: " + err);
            });
        },
        getById: function (id) {
            return Utils.ApiRequest({
                url: $rootScope.app.context + Constants.ENDPOINT_GETBYID_ACCOUNT + id,
                method: 'DELETE'
            }).then(response => {
                if (response.data.code == Constants.SUCCESS_RESPONSE_CODE) {
                    return response.data;
                }
            }).catch(err => {
                $log.error("Error al eliminar el registro: " + err);
            })
        }
    };
    return accountOperations;
}])