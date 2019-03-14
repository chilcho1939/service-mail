myApp.run(['$rootScope', '$location', '$state', 'LoginService', '$transitions','$state', function ($rootScope, $location, $state, LoginService, $transitions, $state) {
    $rootScope.app = {
        context: 'https://send-mail-service.herokuapp.com/api'
        , baseUrl: 'https://send-mail-service.herokuapp.com/#!'
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