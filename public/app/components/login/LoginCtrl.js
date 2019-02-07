myApp.controller('LoginCtrl', ['$scope', 'LoginService','$log', function ($scope, LoginService, $log) {
    $scope.user = {};

    $scope.createUser = function () { 
        LoginService.signin(user).then(response => {
            if (response) { 
                //notificar que se creo el usuario correctamente
            }
        }).catch(error => { 
            $log.error('Error al registrar usuario:' + error);
        });
    }
}]);