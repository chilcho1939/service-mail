myApp.controller('ActivationCtrl', ['$scope','$stateParams','ActivationService', function ($scope,$stateParams,  ActivationService) {
    ActivationService.activateAccount($stateParams.token).then(data => {
        if(data) {
            $.notify("Cuenta activada exitosamente", 'success',{position: "top right"});
            $scope.texto = "Cuenta activada exitosamente."
        }
    });
}])