myApp.factory('LoginService', ['$rootScope', 'Constants', 'Utils', '$log', '$window', '$state', function($rootScope, Constants, Utils, $log, $window, $state) {
    var timer;
    var loginOperations = {
        login: function (user) {
            return Utils.ApiRequest({
                url: $rootScope.app.context + Constants.ENDPOINT_LOGIN_USER,
                method: 'POST',
                data: user
            }).then(response => {
                if (response.data.code == Constants.SUCCESS_RESPONSE_CODE) {
                    saveAuthData(response.data.token, new Date(new Date().getTime() + (response.data.expiresIn * 1000)), response.data.userId)
                    return this.getUserInformation(response.data.userId);
                }
            }).catch(error => {
                $log.error("Error al iniciar sesión: " + error);
            })
        },
        signup: function (user) {
            return Utils.ApiRequest({
                url: $rootScope.app.context + Constants.ENDPOINT_CREATE_USER,
                method: 'POST',
                data: user
            }).then(response => {
                if (response.data.code == Constants.SUCCESS_RESPONSE_CODE) {
                    return true;
                }
            }).catch(error => {
                $log.error("Error al crear el usuario: " + error);
            })
        },
        isLoggedIn: function () {
            return autoAuthUser();
        },
        getUserInformation: function (userId) {
            return Utils.ApiRequest({
                url: $rootScope.app.context + Constants.ENDPOINT_GET_USER_INFO + userId,
                method: 'GET'
            }).then(response => {
                if (response.data.code == Constants.SUCCESS_RESPONSE_CODE) {
                    $window.localStorage.email = response.data.email;
                    return response.data;
                }
            }).catch(error => { 
                $log.error('Error al obtener la información del usuario solicitado: ' + error);
            })
        },
        logout: function() {
            clearTimeout(timer);
            clearAuthData();
            $state.go('login');
        }
    };
    return loginOperations;

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
            loginOperations.logout();
        }, duration * 1000);
    }

    function clearAuthData() {
        delete $window.localStorage.token;
        delete $window.localStorage.expirationDate;
        delete $window.localStorage.isAuthenticated;
        delete $window.localStorage.userId;
        delete $window.localStorage.email;
        $rootScope.isAuthenticated = false;
    }

    function getAuthData() {
        var token = $window.localStorage.token;
        var expirationDate = $window.localStorage.expirationDate;
        var userId = $window.localStorage.userId;
        var email = $window.localStorage.email;
        if (!token ||  !expirationDate || !userId) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId,
            email : email
        };
    }

    function saveAuthData(token, expirationDate, userId) {
        $window.localStorage.token = token;
        $window.localStorage.expirationDate = expirationDate;
        $window.localStorage.userId = userId;
    }
}]);