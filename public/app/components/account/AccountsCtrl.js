myApp.controller('AccountsCtrl', ['$scope', 'LoginService', 'AccountsService', function ($scope, LoginService, AccountsService) {
    $scope.lista = [];
    $scope.cuenta = {};
    $scope.showForm = false;

    (function () {
        var user = LoginService.isLoggedIn();
        if (user) {
            AccountsService.findAllByUser(user.email).then(data => {
                $scope.lista = data || [];
            });
        } else {
            $.notify('No se ha iniciado sesión',
                'error', {
                    position: "top right"
                }
            );
        }
    })();

    $scope.validateMail = function (field) {
        validate(field);
    }

    function validate(field) {
        var resultText = undefined;
        var emails = undefined;
        if (field == 'from') {
            resultText = $("#resultFrom");
            emails = $scope.cuenta.sourceMail;
        } else {
            resultText = field == 'to' ? $("#result") : $("#resultCC");
            emails = field == 'to' ? $scope.cuenta.deliveryMail.split(',') : $scope.cuenta.ccMail.split(',');
        }
        resultText.text("");

        if (validateEmail(emails)) {
            resultText.text("correo valido");
            resultText.css("color", "green");
        } else {
            resultText.text("correo invalido");
            resultText.css("color", "red");
        }
        return false;
    }

    function validateEmail(arrEmail) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var valid = true;
        if (arrEmail instanceof Array) {
            arrEmail.forEach(email => {
                if (!re.test(email.trim())) valid = false;
            });
        } else {
            valid = re.test(arrEmail.trim());
        }

        return valid;
    }

    $scope.registro = function (data) { 
        if (data) {//editar
            $scope.cuenta = data;
            $scope.showForm = true;
            console.log(data)
        } else { //nuevo
            $scope.cuenta = {};
            $scope.showForm = true;
        }
    }

    $scope.guardar = function () { 
        var request = {};
    }

    $scope.cancel = function () { 
        $scope.cuenta = {};
        $scope.showForm = false;
    }
}]);