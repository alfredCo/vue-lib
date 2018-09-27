import configManageSrv from "./configmanageSrv";

let configmanageViewModule = angular.module("configmanageViewModule", ["configManageSrv"]);
configmanageViewModule.controller("configmanageCtrl", ["$scope", "TableCom", "$uibModal", "$translate", "configManageSrv", function ($scope, TableCom, $uibModal, $translate, configManageSrv) {
    var self = $scope;
    function configmanageInit() {
        self.globalSearchTerm = "";
        configManageSrv.getConfigList().then(function(res) {
            if (res && res.data && res.data.data) {
                res.data&&res.data.data?self.loadData = true:"";
                self.configListData = res.data.data;
                self.configListData.forEach(item => {
                    item.searchTerm = [item.name, item.cpu, item.memory, item.gpu].join("\b");
                });
                TableCom.init(self, "tableParams", self.configListData, "uuid", 10);
            }
        });
        self.$watch("checkboxes.items", function (val) {
            self.checkedItems = [];
            for (var i in val) {
                if (val[i]) {
                    self.tableParams.data.forEach(item => {
                        if (item.uuid == i) {
                            self.checkedItems.push(item);
                        }
                    });
                }
            }
            if (self.checkedItems.length >= 1) {
                self.canEditConfig = false;
                self.canDeleteConfig = false;
                if (self.checkedItems.length == 1) {
                    self.canEditConfig = true;
                    self.canDeleteConfig = true;
                }
            } else {
                self.canEditConfig = false;
                self.canDeleteConfig = false;
            }
        },true);
    }
    configmanageInit();
    self.applyGlobalSearch = function () {
        var term = self.globalSearchTerm;
        self.tableParams.filter({
            searchTerm: term
        });
    };
    self.refresh = function () {
        configmanageInit();
    }
    self.createConfig = function () {
        self.createConfigModal = $uibModal.open({
            animation: self.animationsEnabled,
            backdrop: "static",
            templateUrl: "createConfig.html",
            controller: "createConfigCtrl",
            resolve: {
                refresh: function () {
                    return configmanageInit;
                },
                context: function () {
                    return self;
                }
            }
        });
    }
    self.editConfig = function () {
        self.createConfigModal = $uibModal.open({
            animation: self.animationsEnabled,
            backdrop: "static",
            templateUrl: "createConfig.html",
            controller: "editConfigCtrl",
            resolve: {
                refresh: function () {
                    return configmanageInit;
                },
                context: function () {
                    return self;
                }
            }
        });
    }
    self.deleteConfig = function () {
        let content = {
            msg: $translate.instant("cn.configmanage.delConfigTips"),
            type: "warning",
            func: "confirmDelete"
        };
        self.$emit("ui-tag-alert", content);
        self.confirmDelete = function () {
            configManageSrv.deleteConfig(self.checkedItems[0].uuid).then(function () {
                configmanageInit();
            });
        };
    };
}]);
configmanageViewModule.controller("createConfigCtrl", ["$scope", "refresh", "context", "configManageSrv", function ($scope, refresh, context, configManageSrv) {
    var self = $scope;
    self.title = "新建配置";
    self.pageType = "create";
    self.modelForm = {};
    self.hadSameName = false
    self.configNameList = angular.copy(context.configListData)
    
    self.choiceName = function(item){
        self.hadSameName = self.configNameList.some(function(value){
            return value.name==item
        })
    }
    self.confirmCreate = function (formName) {
        if (formName.$valid&&!self.hadSameName) {
            configManageSrv.createConfig(self.modelForm).then(function () {
                refresh();
            });
            context.createConfigModal.close();
        } else {
            self[formName.$name + "Valid"] = true;
        }
    }
}]);
configmanageViewModule.controller("editConfigCtrl", ["$scope", "refresh", "context", "configManageSrv", function ($scope, refresh, context, configManageSrv) {
    var self = $scope;
    self.title = "编辑配置";
    self.pageType = "modify";
    self.modelForm = context.checkedItems[0];
    self.confirmCreate = function (formName) {
        if (formName.$valid) {
            var option = {
                "uuid": self.modelForm.uuid,
                "cpu": self.modelForm.cpu,
                "gpu": self.modelForm.gpu,
                "memory": self.modelForm.memory
            }
            configManageSrv.editConfig(option, self.modelForm.uuid).then(function () {
                refresh();
            });
            context.createConfigModal.close();
        } else {
            self[formName.$name + "Valid"] = true;
        }
    }
}]);
export default configmanageViewModule.name;