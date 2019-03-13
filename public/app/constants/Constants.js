myApp.constant('Constants', {
    /* COMMON MESSAGES*/
    SUCCESS_RESPONSE_CODE: 'ok',
    ERROR_RESPONSE_CODE: 'error',
    /* ENDPOINTS REST*/
    ENDPOINT_CREATE_USER: "/login/registrar",
    ENDPOINT_LOGIN_USER: "/login/iniciarSesion",
    ENDPOINT_GET_USER_INFO: "/login/userData/",
    ENDPOINT_ACTIVATE_ACCOUNT: "/login/activateAccount/",
    ENDPOINT_GENERATE_EMAIL_TOKEN: "/login/generateToken",
    ENDPOINT_GET_TOKENS_BY_USER: "/login/tokensByUser/",
    ENDPOINT_REMOVE_TOKEN_BY_ID: "/login/deleteToken/",
    /*ACCOUNT ENDPOINTS */
    ENDPOINT_FINDALL_ACCOUNTS_BY_USER: "/accounts/findAllByUser",
    ENDPOINT_EDIT_ACCOUNT: "/accounts/updateAccount",
    ENDPOINT_ADD_ACCOUNT: "/accounts/saveAccount",
    ENDPOINT_DELETE_ACCOUNT: "/accounts/deleteAccount/",
    ENDPOINT_GETBYID_ACCOUNT: "/accounts/getById/"


});