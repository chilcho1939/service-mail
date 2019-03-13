myApp.controller('LoginCtrl', ['$scope', 'LoginService', '$log', '$state', '$rootScope', function ($scope, LoginService, $log, $state, $rootScope) {
    $scope.user = {};
    $scope.login = true;
    var resultText = $("#passwordValidator");

    /**
     * Método que crea nuevos usuarios en la base de datos
     */
    $scope.createUser = function() {
        LoginService.signup($scope.user).then(data => {
            if (data) {
                $.notify(data.message, 'success', {position: "top right"});
                $scope.user = {};
            } else {
                $.notify("Error al crear el usuario", 'error',{ position: "top right"});
            }
        }).catch(error => {
            $log.error('Error al registrar usuario:' + error);
            $.notify('Error al crear el usuario: ' + error, 'error', {position: "top right"});
        });
    };

    $scope.comparePasswords = function () { 
        if (!$scope.login && $scope.user.password) { 
            validatePasswords();
        }
    }

    function validatePasswords() { 
        resultText.text("");
        var same = $scope.user.password === $scope.user.confirmPassword;
        if (same) {
            resultText.text("Las contraseñas coinciden");
            resultText.css("color", "green");
        } else { 
            resultText.text("Las contraseñas no coinciden");
            resultText.css("color", "red");
        }
    }

    $scope.login = function() {
        LoginService.login($scope.user).then(data => {
            if (data) {
                $rootScope.$broadcast('userData', data);
                $state.go('/');
            } else {
                $.notify('Error al iniciar sesión, usuario o contraseña no validos',
                    'error', { position: "top right" }
                );
            }
        }).catch(err => {
            $log.error("Error al iniciar sesión: " + err);
        })
    }

    $scope.isLoggedIn = function () { 
        return LoginService.isLoggedIn();
    }

    function changeView(data) {
        resultText.text("");
        $scope.login = data;
    };

    $scope.$on('changeStatus', function(event, data) {
        event.preventDefault();
        changeView(data);
    });
}]);