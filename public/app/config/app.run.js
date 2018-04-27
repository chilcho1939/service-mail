myApp.run(["$rootScope", "Constants", function($rootScope, Constants) {
    $rootScope.app = {
        context: '/',
        name: 'Node JS Project',
        author: 'Seguritech',
        description: 'Sistema que envia correos electrónicos',
        version: '1.0',
        year: new Date().getFullYear()
    };
}]);