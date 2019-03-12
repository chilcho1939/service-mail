myApp.run(['$rootScope', '$location', '$state', 'LoginService', '$transitions','$state', function ($rootScope, $location, $state, LoginService, $transitions, $state) {
    $rootScope.app = {
        context: 'http://localhost:8999/api'
    };
    /**
     * Add the routes with or || in the boolean method
     */
    const criteria = {
        to: state => state.name == 'accounts'
    }
    /*
     * If user is not authenticated redirect to login
     */
    $transitions.onStart(criteria, function (trans) {
        var auth = trans.injector().get('LoginService');
        if (!auth.isLoggedIn()) {
            $state.go('login');
        }
    });

}]);