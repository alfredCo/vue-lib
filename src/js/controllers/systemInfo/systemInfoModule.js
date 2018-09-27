import systemInfoSrv from './systemInfoSrv';

let systemInfoViewModule = angular.module("systemInfoViewModule", ["systemInfoService"]);
systemInfoViewModule.controller("systemInfoCtrl",["$scope", "$rootScope", "$uibModal", "systemInfoSrv", function($scope, $rootScope, $uibModal,
    systemInfoSrv) {
    var self = $scope;
    self.canGetCode = false;
    self.sysInfo = {
        productContent: "",
        license: "",
        endServiceDate: "",
        availableNode: "",
        machineCode: ""
    };

    getSystemInfo();
    function getSystemInfo() {
        self.canGetCode = false;
        systemInfoSrv.getSystemInfo().then(function(result) {
            if(result && result.code == "0" && result.data && result.data.data) {
                let data = result.data.data;
                self.sysInfo.productContent = data.productContent;
                self.sysInfo.license = data.snArray;
                self.sysInfo.endServiceDate = data.endServiceDate;
                self.sysInfo.availableNode = data.availableNode || "N/A";
                self.sysInfo.machineCode = data.machineCode;
                self.canGetCode = true;
                let currentDate = new Date().getTime();
                if(currentDate > data.endServiceDate) {
                    $rootScope.$broadcast("ui-tag-bubble",{type:"error", code: "01160307"});
                }
            }
        });
    }
    self.getMaccode = function(){
        var $getMacCodeMadal = $uibModal.open({
            animation: self.animationsEnabled,
            backdrop: "static",
            templateUrl: "getMacCode.html",
            controller:  "getMacCodeCtrl",
            resolve: {
                macCode: function() {
                    return self.sysInfo.machineCode;
                }
            }
        });
    };
    self.importAuthorize = function(){
        var $importAuthorizeeMadal = $uibModal.open({
            animation: self.animationsEnabled,
            backdrop: "static",
            templateUrl: "importAuthorize.html",
            controller:  "importAuthorizeCtrl",
            resolve: {
                closeModal:function(){
                    return function(){
                        $importAuthorizeeMadal.close();
                    };
                },
                getSystemInfo: function() {
                    return getSystemInfo;
                }
            }
        });
    };
}]);

systemInfoViewModule.controller("getMacCodeCtrl",["$scope", "$rootScope", "macCode", function($scope, $rootScope, macCode) {
    var self = $scope;
    self.macCode = macCode;
}]);

systemInfoViewModule.controller("importAuthorizeCtrl",["$scope", "$rootScope", "$translate","$timeout", "getSystemInfo", "closeModal", function($scope,
    $rootScope, $translate, $timeout, getSystemInfo, closeModal) {
    var self = $scope;
    self.submitValid = false;
    self.fileCheck = false;
    self.selected_file = "";

    self.fileNameChanged = function() {
        self.selected_file = document.getElementById("uploadLicense").value;
        var dom = document.getElementById("uploadLicense");
        var file = dom.files[0];
        let fileSize = 0;
        var fileType = "";
        file ? fileSize = file.size:self.selected_file="";
        file ? fileType=file.name.substr(-4,4):fileType=".pem";
        if(fileType == ".pem" && fileSize < 1048576) {
            self.fileCheck = false;
        }else {
            self.fileCheck = true;
        }
        self.$apply();
    }

    self.confirm = function(m){
        if (m.$valid && !self.fileCheck) {
            var form = document.forms.namedItem("authorizeForm");
            var oData = new FormData(form);
            var oReq = new XMLHttpRequest();
            oReq.onerror = function(e) {
                if(e.type == "error") {
                    $rootScope.$apply(function() {
                        $rootScope.$broadcast("ui-tag-bubble",{type:"error", code: "impLicensefail"});
                    });
                }
            };
            oReq.onload = function(){
               var responseObj=JSON.parse(oReq.responseText);
               if(responseObj){
                    if(responseObj.code == "0") {
                        $rootScope.$apply(function() {
                            $rootScope.$broadcast("ui-tag-bubble",{type:"success", code: "impLicenseSuc"});
                        });
                        getSystemInfo();
                    }else {
                        let errorCode = responseObj.code || "impLicensefail";
                        $rootScope.$apply(function() {
                            $rootScope.$broadcast("ui-tag-bubble",{type:"error", code: errorCode});
                        });
                    }
                }
            }
            oReq.open("POST", window.GLOBALCONFIG.APIHOST.RESOURCE + "/v1/upload/license", true);
            let auth_token = localStorage.$AUTH_TOKEN;
            oReq.setRequestHeader("X-Auth-Token",auth_token);
            oReq.send(oData);
            closeModal();
        } else {
            self.submitValid = true;
        }
    };
}]);
export default systemInfoViewModule.name;