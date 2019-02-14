myApp.controller('LoginCtrl', ['$scope', 'LoginService', '$log', '$state', '$rootScope', function ($scope, LoginService, $log, $state, $rootScope) {
    $scope.user = {};
    $scope.login = true;

    /**
     * Método que crea nuevos usuarios en la base de datos
     */
    $scope.createUser = function() {
        LoginService.signup($scope.user).then(data => {
            if (data) {
                $.notify('Usuario registrado correctamente', {
                    type: 'success',
                    position: "top right"
                });
            }
        }).catch(error => {
            $log.error('Error al registrar usuario:' + error);
            $.notify('Error al crear el usuario: ' + error, {
                type: 'error',
                position: "top right"
            });
        });
    };

    $scope.login = function() {
        LoginService.login($scope.user).then(data => {
            if (data) {
                $rootScope.user = {
                    email: data.email
                };
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
        $scope.login = data;
    };

    $scope.$on('changeStatus', function(event, data) {
        event.preventDefault();
        changeView(data);
    });
}]);