myApp.controller('HomeCtrl', ['$scope', 'HomeService', function($scope, HomeService) {
    $scope.mensaje = "";
    $scope.mailObject = {};

    $scope.sendMail = function() {
        HomeService.sendEmail(mailObject).then((data) => {
            if (data) {
                $scope.mensaje = "Conexión exitosa";
            } else {
                $scope.mensaje = "Error, algo no va bien ";
            }
        });
    }

}]);