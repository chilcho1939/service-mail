myApp.controller('MasterCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.changeView = function(flag) {
        $rootScope.$broadcast('changeStatus', flag);
    }
}])