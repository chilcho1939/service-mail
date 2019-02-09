myApp.controller('MasterCtrl', ['$scope', '$rootScope', '$window', 'LoginService', function($scope, $rootScope, $window, LoginService) {
    $scope.changeView = function(flag) {
        $rootScope.$broadcast('changeStatus', flag);
    }
    $scope.logout = function() {
        LoginService.logout();
    }
}]);