myApp.controller('LoginCtrl', ['$scope', 'LoginService', '$log', '$state', '$rootScope', function ($scope, LoginService, $log, $state, $rootScope) {
    $scope.user = {};
    $scope.login = true;
    var resultText = $("#passwordValidator");

    /**
     * Método que crea nuevos usuarios en la base de datos
     */
    $scope.createUser = function() {
        LoginService.signup($scope.user).then(data => {
            if (data) {
                $.notify(data.message, 'success', {position: "top right"});
                $scope.user = {};
            } else {
                $.notify("Error al crear el usuario", 'error',{ position: "top right"});
            }
        }).catch(error => {
            $log.error('Error al registrar usuario:' + error);
            $.notify('Error al crear el usuario: ' + error, 'error', {position: "top right"});
        });
    };

    $scope.comparePasswords = function (flag) { 
        if ((!$scope.login && $scope.user.password) || flag) { 
            validatePasswords();
        }
    }

    function validatePasswords() { 
        resultText.text("");
        var same = $scope.user.password === $scope.user.confirmPassword;
        if (same) {
            resultText.text("Las contraseñas coinciden");
            resultText.css("color", "green");
        } else { 
            resultText.text("Las contraseñas no coinciden");
            resultText.css("color", "red");
        }
    }

    $scope.iniciarSesion = function() {
        LoginService.login($scope.user).then(data => {
            if (data) {
                $rootScope.$broadcast('userData', data);
                $state.go('/home');
                $scope.user = {};
            } else {
                $.notify('Error al iniciar sesión, usuario o contraseña no validos',
                    'error', { position: "top right" }
                );
            }
        }).catch(err => {
            $log.error("Error al iniciar sesión: " + err);
        })
    }

    $scope.isLoggedIn = function () { 
        return LoginService.isLoggedIn();
    }

    function changeView(data) {
        resultText.text("");
        $scope.login = data;
    };

    $scope.changePass = function(){
        $state.go('changePass');
    }

    $scope.cambiarPass = function(){
        if(!$scope.user.password || !$scope.user.confirmPassword || !$scope.user.email) {
            $.notify('Datos incompletos, favor de validar', 'warning', {position: "top right"});
            return;
        }
        LoginService.changePassword($scope.user).then(data => {
            if(data.ok) {
                $.notify(data.message, 'success', {position: "top right"});
                $scope.user = {};
                $state.go('login');
            }
            else $.notify(data.message, 'error', {position: "top right"});
        });
    }

    $scope.$on('changeStatus', function(event, data) {
        event.preventDefault();
        changeView(data);
    });
}]);