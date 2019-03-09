myApp.controller('AccountsCtrl', ['$scope', 'LoginService', 'AccountsService', function ($scope, LoginService, AccountsService) {
    $scope.lista = [];
    $scope.cuenta = {};
    $scope.showForm = false;
    var edit = false;
    var user = {};
    $scope.idToDelete;

    (function () {
        user = LoginService.isLoggedIn();
        $("#loading-data").css("display", "block");
        if (user) {
            AccountsService.findAllByUser(user.email).then(data => {
                $scope.lista = data || [];
                $("#loading-data").css("display", "none");
            });
        } else {
            $.notify('No se ha iniciado sesión',
                'error', {
                    position: "top right"
                }
            );
            $("#loading-data").css("display", "none");
        }
    })();

    $scope.validateMail = function (field) {
        validate(field);
    }

    $scope.registro = function (data) {
        if (data) { //editar
            $scope.cuenta = angular.copy(data);
            $scope.showForm = true;
            edit = true;
        } else { //nuevo
            $scope.cuenta = {};
            $scope.showForm = true;
            edit = false;
        }
    }

    $scope.guardar = function () {
        if (edit && validateRequest()) { //editar datos de cuenta existente con parámetros completos
            $("#loading-data").css("display", "block");
            $scope.cuenta.user = user.email;
            AccountsService.editAccount($scope.cuenta).then(data => {
                if (data) {
                    $.notify('Información actualizada correctamente',
                        'success', {
                            position: "top right"
                        }
                    );
                    $scope.cuenta = {};
                    $scope.showForm = false;
                    AccountsService.findAllByUser(user.email).then(data => {
                        $scope.lista = data || [];
                        $("#loading-data").css("display", "none");
                    });
                }
            });
        } else if (!edit && validateRequest()) { //nueva cuenta parámetros completos
            $("#loading-data").css("display", "block");
            $scope.cuenta.user = user.email;
            AccountsService.addAccount($scope.cuenta).then(data => {
                if (data) {
                    $.notify('Registro exitoso',
                        'success', {
                            position: "top right"
                        }
                    );
                    $scope.cuenta = {};
                    $scope.showForm = false;
                    AccountsService.findAllByUser(user.email).then(data => {
                        $scope.lista = data || [];
                        $("#loading-data").css("display", "none");
                    });
                }
            });
        } else { //parámetros incompletos
            $.notify('Datos incompletos, favor de validar su información de captura',
                'error', {
                    position: "top right"
                }
            );
            $("#loading-data").css("display", "none");
        }
    }

    $scope.showModal = function (id) {
        $scope.idToDelete = id;
        $('#deleteAccountModal').modal({
            show: true,
            keyboard: true
        });
    }

    $scope.delete = function () {
        $('#deleteAccountModal').modal('hide');
        $("#loading-data").css("display", "block");
        AccountsService.removeAccount($scope.idToDelete).then(data => {
            if (data) {
                $.notify('Registro eliminado exitosamente',
                    'success', {
                        position: "top right"
                    }
                );
                AccountsService.findAllByUser(user.email).then(data => {
                    $scope.lista = data || [];
                    $("#loading-data").css("display", "none");
                });
            } else {
                $.notify('Error al elminar registro',
                    'error', {
                        position: "top right"
                    }
                );
                $("#loading-data").css("display", "none");
            }
        });
    }

    $scope.closeModal = function () {
        $('#deleteAccountModal').modal('hide');
    }

    $scope.cancel = function () {
        $scope.cuenta = {};
        $scope.showForm = false;
    }

    function validateRequest() {
        if (!$scope.cuenta.host || $scope.cuenta.host == '') return false;
        if (!$scope.cuenta.port || $scope.cuenta.port == '') return false;
        if (!$scope.cuenta.sourceMail || $scope.cuenta.sourceMail == '') return false;
        if (!$scope.cuenta.password || $scope.cuenta.password == '') return false;
        if (!$scope.cuenta.deliveryMail || $scope.cuenta.deliveryMail == '') return false;
        if (!$scope.cuenta.host || $scope.cuenta.host == '') return false;
        return true;
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
}]);