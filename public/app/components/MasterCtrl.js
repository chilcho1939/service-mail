myApp.controller('MasterCtrl', ['$scope', '$rootScope', '$window', 'LoginService', '$state', '$transitions', function ($scope, $rootScope, $window, LoginService, $state, $transitions) {
    $rootScope.isAuthenticated = LoginService.isLoggedIn();
    $scope.userLogged = $rootScope.isAuthenticated ? $rootScope.isAuthenticated : {};

    $scope.changeView = function (flag) {
        $rootScope.$broadcast('changeStatus', flag);
    }

    $scope.home = function (to) { 
        $state.go('/home');
        document.getElementById(to + '1').setAttribute('href', $rootScope.app.baseUrl + '/home#' + to);
    }
    $scope.logout = function () {
        LoginService.logout();
    }

    $(function () {
        $('.nav a').filter(function () {
            return this.href == location.href
        }).parent().addClass('active').siblings().removeClass('active')
        $('.nav a').click(function () {
            $(this).parent().addClass('active').siblings().removeClass('active')
        })
    })

    $scope.changeActive = function () {
        
    }

    $rootScope.$on('userData', function (event, data) {
        event.preventDefault();
        if (data) {
            $scope.userLogged = data;
            $rootScope.isAuthenticated = LoginService.isLoggedIn();
        }
    });
}]);