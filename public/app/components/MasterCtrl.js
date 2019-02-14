myApp.controller('MasterCtrl', ['$scope', '$rootScope', '$window', 'LoginService', function($scope, $rootScope, $window, LoginService) {
    $rootScope.isAuthenticated = LoginService.isLoggedIn();
    $scope.changeView = function (flag) {
        $rootScope.$broadcast('changeStatus', flag);
    }
    $scope.logout = function() {
        LoginService.logout();
    }
}]);