myApp.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider, LoginService) {
    $stateProvider.state('/home', {
        url: '/home',
        templateUrl: 'app/components/home/Home.html',
        controller: 'HomeCtrl',
        authenticate: false
    }).state('login', {
        url: '/login',
        templateUrl: 'app/components/login/Login.html',
        controller: 'LoginCtrl',
        authenticate: false
    }).state('accounts', {
        url: '/user/accounts',
        templateUrl: 'app/components/account/Accounts.html',
        controller: 'AccountsCtrl',
        authenticate: true,
        rol: ['*']
    }).state('activate:token', {
        url: '/activate/:token',
        templateUrl: 'app/components/activation/Activation.html',
        controller: 'ActivationCtrl',
        authenticate: false,
        rol: ['*']
    }).state('changePass', {
        url: '/changepass',
        templateUrl: 'app/components/account/PasswordChange.html',
        controller: 'LoginCtrl',
        authenticate: false,
        rol: ['*']
    }).state('notFound', {
        url: '/404',
        templateUrl: 'app/commons/layouts/notFound.html',
        authenticate: false,
        rol: ['*']
    }).state('unauthorized', {
        url: '/unauthorized',
        templateUrl: 'app/components/unauthorized/unauthorizedView.html',
        rol: ['*']
    });
    //default route
    $urlRouterProvider.otherwise('/home');

    $httpProvider.interceptors.push(['$q', '$location', '$window', function($q, $location, $window) {
        return {
            'request': function(config) {
                config.headers = config.headers || {};
                if ($window.localStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
                }
                return config;
            },
            'responseError': function(response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        }
    }]);
}]);