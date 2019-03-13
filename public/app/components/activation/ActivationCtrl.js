myApp.controller('ActivationCtrl', ['$scope','$stateParams','ActivationService', function ($scope,$stateParams,  ActivationService) {
    ActivationService.activateAccount($stateParams.token);
}])