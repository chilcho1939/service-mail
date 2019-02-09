myApp.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'app/components/login/Login.html',
        controller: 'LoginCtrl'
    }).state('home', {
        url: '/home',
        templateUrl: 'app/components/home/Home.html',
        controller: 'HomeCtrl'
    });
    /*
            .state('unauthorized',{
                url: '/unauthorized',
                templateUrl: 'app/components/unauthorized/unauthorizedView.html',
                rol : ['*']
            })
            .state('notFound',{
                url: '/404',
                templateUrl: 'app/components/notFound/404.html',
                authenticate: false,
                rol : ['*']
            })
            //default route*/
    $urlRouterProvider.otherwise('/');

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

    function checkTokenExpirationDate() {

    }
}]);