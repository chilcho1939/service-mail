/**
 * Configure the Routes
 */
myApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    //rutas
    // * : todos los roles
    $routeProvider.when('/', {
        templateUrl: '/app/components/home/home.html',
        controller: 'HomeCtrl'
    });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });
}]);