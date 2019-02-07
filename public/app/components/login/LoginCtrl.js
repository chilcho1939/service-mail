myApp.controller('LoginCtrl', ['$scope', 'LoginService', '$log', function($scope, LoginService, $log) {
    $scope.user = {};
    $scope.login = true;

    /**
     * Método que crea nuevos usuarios en la base de datos
     */
    $scope.createUser = function() {
        LoginService.signin($scope.user).then(response => {
            if (response) {
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
            })
        });
    };

    $scope.changeView = function(data) {
        $scope.login = data;
    };

    $scope.$on('changeStatus', function(event, data) {
        event.preventDefault();
        $scope.changeView(data);
    });
}]);