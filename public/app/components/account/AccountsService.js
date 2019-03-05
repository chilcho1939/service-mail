myApp.factory('AccountsService', ['$rootScope', 'Utils', 'Constants', '$log', function ($rootScope, Utils, Constants, $log) { 
    const accountOperations = {
        addAccount: function (account) { 

        },
        editAccount: function (account) { 

        }, 
        removeAccount: function (id) {
            
        },
        findAllByUser: function (user) { 
            return Utils.ApiRequest({
                url: $rootScope.app.context + Constants.ENDPOINT_FINDALL_ACCOUNTS_BY_USER,
                method: 'POST',
                data: { user: user }
            }).then(response => {
                if (response.data.code == Constants.SUCCESS_RESPONSE_CODE) {
                    return response.data.result;
                }
            }).catch(err => {
                $log.error("Error obteniendo el listado de hosts: " + err);
            });
        },
        getById: function (id) { 

        }
    };
    return accountOperations;
}])