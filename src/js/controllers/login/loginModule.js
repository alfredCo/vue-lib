var loginModule = angular.module("loginModule", []);
loginModule.controller("loginCtrl", ["$scope", "$rootScope", "$http", "$location","$timeout", "globalMenuModule", function($scope, $rootScope, $http,
    $location, $timeout, globalMenuModule) {
    var self = $scope;
    $rootScope.effeToken = false;
    self.submitted = false;
    self.loginCfmed = false; //控制错误信息提示以及4秒消失
    self.logining = false;//控制登陆转圈的显示
    self.submitted = false;
    self.loginError = 0;
    self.login = {
        username: "",
        userPassword: ""
    };
    localStorage.clear();
    sessionStorage.headerViewType = "businessView";

    self.$on("loginerror", function(e, type) {
        if (type == "error") {
            self.loginError = 1;
        }else if (type == "servererror") {
            self.loginError = 2;
        }else if (type == "01030711") {
            self.loginError = 3;
        }
    });

    self.interacted = function(field) {
        return self.submitted || field.$dirty;
    };

    self.submitForm = function() {
        if (self.loginForm.$valid) {
            self.loginCfmed = true;
            self.logining = true;
            self.loginError = "";
            var data = {
                userName: self.login.username,
                userPassword: self.login.password
            };
            $http({
                method: "POST",
                url: "user-manager/v1/login",
                data: data
            }).then(function(result) {
                if(result && result.code == "0") {
                    if(result.data.data.role == "2" && result.data.data.isAdmin){
                        localStorage.roleName = "admin"
                    }else if(result.data.data.role == "3" && !result.data.data.isAdmin){
                        localStorage.roleName = "project_admin"
                    }else if(result.data.data.role == "4" && !result.data.data.isAdmin){
                        localStorage.roleName = "member"
                    }
                    localStorage.projectId = result.data.data.project ? result.data.data.project : "";
                    localStorage.$AILOGINED = true;
                    localStorage.$AUTH_TOKEN = result.data.data.token;
                    localStorage.isAdmin = result.data.data.isAdmin;
                    localStorage.userId = result.data.data.userId;
                    localStorage.userName = result.data.data.userName;
                    self.loginError = 0;
                    loginInit();
                }
            }).finally(function(){
                self.logining = false;
                $timeout(function(){
                   self.loginCfmed = false;
                },4000);
            });
        }else {
            self.submitted = true;
        }
    };

    function loginInit() {
        if(localStorage.isAdmin == "true") {
            $rootScope.isAdmin = true;
            $location.path("/resource/resourceview").replace();
        }else {
            $rootScope.isAdmin = false;
            $location.path("/resource/resourceview").replace();
        }
    }
}]);
export default loginModule.name;