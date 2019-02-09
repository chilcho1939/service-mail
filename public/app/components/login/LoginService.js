myApp.factory('LoginService', ['$rootScope', 'Constants', 'Utils', '$log', '$window', '$state', function($rootScope, Constants, Utils, $log, $window, $state) {
    var timer;
    return {
        login: function(user) {
            return Utils.ApiRequest({
                url: $rootScope.app.context + Constants.ENDPOINT_LOGIN_USER,
                method: 'POST',
                data: user
            }).then(response => {
                if (response.data.code == Constants.SUCCESS_RESPONSE_CODE) {
                    saveAuthData(response.data.token, new Date(new Date().getTime() + (response.data.expiresIn * 1000)))
                    return autoAuthUser();
                }
            }).catch(error => {
                $log.error("Error al iniciar sesión: " + error);
            })
        },
        signup: function(user) {
            return Utils.ApiRequest({
                url: $rootScope.app.context + Constants.ENDPOINT_CREATE_USER,
                method: 'POST',
                data: user
            }).then(response => {
                if (response.data.code == Constants.SUCCESS_RESPONSE_CODE) {

                }
            }).catch(error => {
                $log.error("Error al crear el usuario: " + error);
            })
        },
        logout: function() {
            clearTimeout(timer);
            clearAuthData();
            $state.go('login');
        }
    };

    function autoAuthUser() {
        var authData = getAuthData();
        if (!authData) return;
        var now = new Date();
        var expiresIn = authData.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            $window.localStorage.isAuthenticated = true;
            $rootScope.isAuthenticated = true;
            setAuthTimer(expiresIn / 1000);
        } else {
            $window.localStorage.isAuthenticated = false;
        }
        return authData;
    }

    function setAuthTimer(duration) {
        timer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    function clearAuthData() {
        delete $window.localStorage.token;
        delete $window.localStorage.expirationDate;
        delete $window.localStorage.isAuthenticated;
        $rootScope.isAuthenticated = false;
    }

    function getAuthData() {
        var token = $window.localStorage.token;
        var expirationDate = $window.localStorage.expirationDate;
        if (!token ||  !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate)
        };
    }

    function saveAuthData(token, expirationDate) {
        $window.localStorage.token = token;
        $window.localStorage.expirationDate = expirationDate;
    }
}]);