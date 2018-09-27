import sshKeytSrv from "./sshKeytSrv";
let sshKeytViewModule = angular.module("sshKeytViewModule", ["sshKeytService"]);
sshKeytViewModule.controller("sshKeytCtrl",["$scope", "$rootScope", "$translate","$routeParams","$timeout", "$uibModal", "NgTableParams", "alertSrv",
    "checkedSrv","TableCom", "userSwitchSrv", "sshKeytSrv", function($scope, $rootScope, $translate,$routeParams,$timeout, $uibModal, NgTableParams,
    alertSrv, checkedSrv,TableCom, userSwitchSrv, sshKeytSrv) {
    var self = $scope;
    self.userSwitchSrv = userSwitchSrv;
    self.userFormData = {};
    getTableData();
    self.create = function(){
        var $SSHModal = $uibModal.open({
            animation: self.animationsEnabled,
            backdrop: "static",
            templateUrl: "createSSH.html",
            controller:  "createSSHCtrl",
            resolve: {
                closeModal:function(){
                    return function(){
                        $SSHModal.close();
                    };
                },
                refreshKeyTable:function() {
                    return getTableData;
                },
                existedNamesList: function() {
                    return self.existedNamesList;
                }
            }
        });
    };
    self.importPubkey = function(){
        var $pubkeyModal = $uibModal.open({
            animation: self.animationsEnabled,
            backdrop: "static",
            templateUrl: "importPubkey.html",
            controller:  "importPubkeyCtrl",
            resolve: {
                closeModal:function(){
                    return function(){
                        $pubkeyModal.close();
                    };
                },
                refreshKeyTable:function() {
                    return getTableData;
                },
                existedNamesList: function() {
                    return self.existedNamesList;
                }
            }
        });
    };
    self.delete = function () {
        let content = {
            msg: $translate.instant("cn.SSH.deKeytTips"),
            type: "warning",
            func: "confirmDelete"
        };
        self.$emit("ui-tag-alert", content);
        self.confirmDelete = function () {
            var keyId = self.checkedItems[0].keyid;
            sshKeytSrv.deleteKey(keyId).then(function(result) {
                getTableData();
            });
        };
    };
    self.refresh = function() {
        self.globalSearchTerm = "";
        getTableData();
    };
    self.applyGlobalSearch = function () {
        var term = self.globalSearchTerm;
        self.tableParams.filter({ searchTerm: term });
    };
    function getTableData() {
        self.canAdd = false;
        var userName = localStorage.userName;
        if(localStorage.isAdmin == "true") {
            userName = localStorage.selectedUserName;
            if(!userName || userName == "全部用户") {
                userName = "allUsers";
            }
        }
        var option = {
            owner: userName
        }
        sshKeytSrv.getKeyList(option).then(function(result) {
            result.data&&result.data.data?self.loadData = true:"";
            if(result.code == "0" && result.data && result.data.data) {
                self.tableData = result.data.data;
                self.existedNamesList = [];
                self.tableData.map(item => {
                    self.existedNamesList.push(item.keyname);
                    var searchArr = [item.keyname, item.owner, item.figure];
                    if(self.userSwitchSrv.sshKeyt) {
                        searchArr.splice(1, 1);
                    }
                    item.searchTerm = searchArr.join("\b");
                });
                self.canAdd = true;
                TableCom.init(self,"tableParams",self.tableData,"keyid",10);
                self.$watch(function() {
                    return self.checkboxes.items;
                }, function(val) {
                    self.checkedItems = [];
                    var arr=[];
                    for(var i in self.checkboxes.items){
                        arr.push(self.checkboxes.items[i]);
                    }
                    self.canEdit = null;
                    self.canDel = null;
                    if(val && arr.length>=0){
                        for(var key in val){
                            if(val[key]){
                                self.tableParams.data.forEach(item=>{
                                    if(item.keyid==key){
                                        self.checkedItems.push(item);
                                    }
                                });
                            }
                        }
                    }
                    if(self.checkedItems.length==1){
                        self.canEdit=true;
                        self.canDel= true;
                    }else if(self.checkedItems.length==0){
                        self.canEdit=false;
                        self.canDel= false;
                    }else if(self.checkedItems.length>1){
                        self.canEdit=false;
                        self.canDel= false;
                    }
                },true);
            }
        });
    };
}]);
sshKeytViewModule.controller("importPubkeyCtrl",["$scope", "$translate", "closeModal", "refreshKeyTable", "sshKeytSrv", "existedNamesList", function($scope,
    $translate, closeModal, refreshKeyTable, sshKeytSrv, existedNamesList) {
    var self = $scope;
    self.existedNamesList = existedNamesList;
    self.submitValid = false;
    self.formData = {
        name: "",
        pubkey: ""
    }
    self.confirm = function(m){
        if (m.$valid) {
            var option = {
                keyName: self.formData.name,
                keyPublic: "ssh-rsa "+self.formData.pubkey
            }
            sshKeytSrv.importKey(option).then(function(result) {
                refreshKeyTable();
            });
            closeModal();
        } else {
            self.submitValid = true;
        }
    };
}]);
sshKeytViewModule.controller("createSSHCtrl",["$scope", "$translate", "$uibModal", "closeModal", "refreshKeyTable", "sshKeytSrv", "existedNamesList",
    function($scope, $translate, $uibModal, closeModal, refreshKeyTable, sshKeytSrv, existedNamesList) {
    var self = $scope;
    self.existedNamesList = existedNamesList;
    self.submitValid = false;
    self.formData = {
        name: ""
    }
    self.confirm = function(m){
        if (m.$valid) {
            var option = {
                keyName: self.formData.name,
                keyType: "rsa",
                keyLen: 2048
            }
            sshKeytSrv.createKey(option).then(function(result) {
                if(result && result.code == "0") {
                    refreshKeyTable();
                    var $downloadKeyModal = $uibModal.open({
                        animation: self.animationsEnabled,
                        backdrop: "static",
                        templateUrl: "downloadKey.html",
                        controller:  "downloadKeyCtrl",
                        resolve: {
                            closeModal:function(){
                                return function(){
                                    $downloadKeyModal.close();
                                };
                            },
                            keyData: function() {
                                return result.data.data;
                            }
                        }
                    });
                }
            });
            closeModal();
        } else {
            self.submitValid = true;
        }
    };
}]);
sshKeytViewModule.controller("downloadKeyCtrl",["$scope", "closeModal", "FileSaver", "Blob", "keyData", function($scope, closeModal, FileSaver, Blob, keyData) {
    var self = $scope;
    self.downloadKey = function() {
        var pemData = new Blob(
            [keyData.keyprivate],
            { type: "application/x-pem-file" }
        );
        FileSaver.saveAs(pemData, keyData.keyname + ".pem");
        closeModal();
    }
}]);
export default sshKeytViewModule.name;