myApp.controller('HomeCtrl', ['$scope', 'HomeService', function($scope, HomeService) {
    $scope.mensaje = "Hola";
    $scope.mail = {};

    $scope.sendMail = function() {
        HomeService.sendEmail($scope.mail).then((data) => {
            if (data) {
                $scope.mensaje = "Conexión exitosa";
            } else {
                $scope.mensaje = "Error, algo no va bien ";
            }
        });
    }

    $scope.cancel = function() {
        $scope.mail = {};
    }

}]);