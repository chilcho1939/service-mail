myApp.controller('MasterCtrl', ['$scope', '$rootScope', '$window', 'LoginService', function($scope, $rootScope, $window, LoginService) {
    $rootScope.isAuthenticated = LoginService.isLoggedIn();
    $scope.userLogged = $rootScope.isAuthenticated ? $rootScope.isAuthenticated : {};

    $scope.changeView = function (flag) {
        $rootScope.$broadcast('changeStatus', flag);
    }
    $scope.logout = function() {
        LoginService.logout();
    }

    // $scope.$watch('user', function (newValue, oldValue) {
    //     if ($rootScope.user) {
    //         $scope.userLogged.email = newValue.email;
    //     }
    // });

    $rootScope.$on('userData', function (event, data) { 
        event.preventDefault();
        if (data) { 
            $scope.userLogged.email = data;
            $rootScope.isAuthenticated = LoginService.isLoggedIn();
        }
    })
}]);