myApp.controller('AccountsCtrl', ['$scope', 'LoginService', 'AccountsService', function ($scope, LoginService, AccountsService) {
    $scope.lista = [];
    $scope.cuenta = {};
    $scope.showForm = false;

    (function () {
        var user = LoginService.isLoggedIn();
        if (user) {
            AccountsService.findAllByUser(user.email).then(data => {
                $scope.lista = data || [];
            });
        } else {
            $.notify('No se ha iniciado sesión',
                'error', {
                    position: "top right"
                }
            );
        }
    })();

    $scope.registro = function (data) { 
        if (data) {//editar
            $scope.cuenta = data;
            $scope.showForm = true;
            console.log(data)
        } else { //nuevo
            $scope.cuenta = {};
            $scope.showForm = true;
        }
    }

    $scope.guardar = function () { 
        var request = {};
    }

    $scope.cancel = function () { 
        $scope.cuenta = {};
        $scope.showForm = false;
    }
}]);