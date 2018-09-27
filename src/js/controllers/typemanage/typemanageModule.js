import typeManageSrv from "./typemanageSrv";

let typemanageViewModule = angular.module("typemanageViewModule", ["typeManageSrv"]);
typemanageViewModule.controller("typemanageCtrl", ["$scope", "TableCom", "$uibModal", "$translate", "typeManageSrv", function ($scope, TableCom, $uibModal, $translate, typeManageSrv) {
    var self = $scope;
    function typemanageInit() {
        self.globalSearchTerm = "";
        typeManageSrv.getTypeList().then(function (res) {
            if (res && res.data && res.data.data) {
                res.data&&res.data.data?self.loadData = true:"";
                self.typeListData = res.data.data;
                self.typeListData.forEach(item => {
                    item.searchTerm = [item.name, item.description].join("\b");
                });
                TableCom.init(self, "tableParams", self.typeListData, "uuid", 10);
            }
        })
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
                self.canDeleteType = true;
            } else {
                self.canDeleteType = false;
            }
        },true);
    }
    typemanageInit();
    self.applyGlobalSearch = function () {
        var term = self.globalSearchTerm;
        self.tableParams.filter({
            searchTerm: term
        });
    };
    self.refresh = function () {
        typemanageInit();
    }
    self.createType = function () {
        self.createTypeModal = $uibModal.open({
            animation: self.animationsEnabled,
            backdrop: "static",
            templateUrl: "createType.html",
            controller: "createTypeCtrl",
            resolve: {
                refresh: function () {
                    return typemanageInit;
                },
                context: function () {
                    return self;
                }
            }
        })
    }
    self.deletetype = function () {
        let content = {
            msg: $translate.instant("cn.typemanage.delTypeTips"),
            type: "warning",
            func: "confirmDelete"
        };
        self.$emit("ui-tag-alert", content);
        self.confirmDelete = function () {
            // userManageSrv.delUser(self.checkedItems[0].userID).then(function (data) {
            //     self.refresh();
            // })
            console.log("delete done");
        };
    };
}]);
typemanageViewModule.controller("createTypeCtrl", ["$scope", "context", "refresh", function ($scope, context, refresh) {
    var self = $scope;
    self.modelForm = {};
    self.typeList = [
        {name: "CPU",value: "cpu"},
        {name: "GPU",value: "gpu"}
    ];
    self.confirmCreate = function (formName) {
        if (formName.$valid) {
            // (function () {
            //     console.log("create done");
            // })().then(() => {
            //     context.createTypeModal.close();
            // })
            console.log("create done");
        } else {
            self[formName.$name + "Valid"] = true;
        }
    }
}]);
export default typemanageViewModule.name;