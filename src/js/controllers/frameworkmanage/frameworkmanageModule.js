import frameworkManageSrv from "./frameworkmanageSrv";

let frameworkmanageViewModule = angular.module("frameworkmanageViewModule", ["frameworkManageSrv"]);
frameworkmanageViewModule.controller("FrameworkCtrl", ["$scope", "TableCom", "$uibModal", "$translate", "$location", "frameworkManageSrv", function ($scope, TableCom, $uibModal, $translate, $location, frameworkManageSrv) {
    var self = $scope;
    function frameworkmanageInit() {
        self.globalSearchTerm = "";
        frameworkManageSrv.getFrameworkList().then(function (res) {
            if (res && res.data && res.data.data) {
                res.data&&res.data.data?self.loadData = true:"";
                self.frameworlListData = res.data.data;
                self.frameworlListData.forEach(item => {
                    item.searchTerm = [item.name, item.description].join("\b");
                });
                TableCom.init(self, "tableParams", self.frameworlListData, "uuid", 10);
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
            if (self.checkedItems.length == 1) {
                self.canDeleteFramework = true;
            } else {
                self.canDeleteFramework = false;
            }
        },true);
    }
    frameworkmanageInit();
    self.applyGlobalSearch = function () {
        var term = self.globalSearchTerm;
        self.tableParams.filter({
            searchTerm: term
        });
    };
    self.refresh = function () {
        frameworkmanageInit();
    }
    self.createFramework = function () {
        self.createFrameworkModal = $uibModal.open({
            animation: self.animationsEnabled,
            backdrop: "static",
            templateUrl: "createFramework.html",
            controller: "CreateFrameworkCtrl",
            resolve: {
                refresh: function () {
                    return frameworkmanageInit;
                },
                context: function () {
                    return self;
                }
            }
        })
    }
    self.deleteFramework = function () {
        let content = {
            msg: $translate.instant("cn.frameworkmanage.delFrameworkTips"),
            type: "warning",
            func: "confirmDelete"
        };
        self.$emit("ui-tag-alert", content);
        self.confirmDelete = function () {
            frameworkManageSrv.deleteFramework(self.checkedItems[0].uuid).then(function () {
                frameworkmanageInit();
            });
        };
    };
    self.$on("getDetail", function (event, value) {
        self.detailCheckboxes = {
            "items": []
        }
        self.detailIsShow = true;
        self.detailTip = "detailTip";
        function detailInfoInit() {
            self.searchOption = {
                "frameDetailGlobalSearchTerm": ""
            }
            frameworkManageSrv.getVersionList(value).then(res => {
                res.data&&res.data.data?self.detailLoadData = true:"";
                if (res && res.data && res.data.data) {
                    self.frameworklDetialData = res.data.data;
                    self.frameworklDetialData.forEach(item => {
                        item.searchTerm = [item.version].join("\b");
                    });
                    TableCom.init(self, "detailTableParams", self.frameworklDetialData, "id", 10, "detailCheckboxes");
                }
            });
            self.$watch("detailCheckboxes.items", function (val) {
                self.detailCheckedItems = [];
                for (var i in val) {
                    if (val[i]) {
                        self.detailTableParams.data.forEach(item => {
                            if (item.id == i) {
                                self.detailCheckedItems.push(item);
                            }
                        });
                    }
                }
                if (self.detailCheckedItems.length == 1) {
                    self.canDeleteVersion = true;
                } else {
                    self.canDeleteVersion = false;
                }
            },true);
        }
        detailInfoInit();
        self.frameDetailApplyGlobalSearch = function () {
            var term = self.searchOption.frameDetailGlobalSearchTerm;
            self.detailTableParams.filter({
                searchTerm: term
            });
        };
        self.refreshDetail = function () {
            detailInfoInit();
        }
        self.createVersion = function (value) {
            self.createVersionModal = $uibModal.open({
                animation: self.animationsEnabled,
                backdrop: "static",
                templateUrl: "createVersion.html",
                controller: "CreateVersionCtrl",
                resolve: {
                    refresh: function () {
                        return detailInfoInit;
                    },
                    context: function () {
                        return self;
                    }
                }
            })
        }
        self.deleteVersion = function () {
            let content = {
                msg: $translate.instant("cn.frameworkmanage.delVersionworkTips"),
                type: "warning",
                func: "confirmDeleteVersion"
            };
            self.$emit("ui-tag-alert", content);
            self.confirmDeleteVersion = function () {
                frameworkManageSrv.deleteVersion($location.search().id ,self.detailCheckedItems[0].id).then(function () {
                    detailInfoInit();
                });
            };
        };
    });
}]);
frameworkmanageViewModule.controller("CreateFrameworkCtrl", ["$scope", "context", "refresh", "frameworkManageSrv", function ($scope, context, refresh, frameworkManageSrv) {
    var self = $scope;
    self.modelForm = {};
    self.hadSameName = false
    self.frameworlNameData = angular.copy(context.frameworlListData)
   
    self.choiceName = function(item){
        self.hadSameName = self.frameworlNameData.some(function(value){
            return value.name==item
        })
    }
    self.tenginenameList = [
        {name: "Tensorflow",value: "tensorflow"},
        {name: "Mxnet",value: "mxnet"},
        {name: "Caffe",value: "caffe"}
    ];
    self.confirmCreate = function (formName) {
        if (formName.$valid&&!self.hadSameName) {
            frameworkManageSrv.createFramework(self.modelForm).then(function () {
                refresh();
            });
            context.createFrameworkModal.close();
        } else {
            self[formName.$name + "Valid"] = true;
        }
    }
}]);
frameworkmanageViewModule.controller("CreateVersionCtrl", ["$scope", "context", "refresh", "$location", "frameworkManageSrv", function ($scope, context, refresh, $location, frameworkManageSrv) {
    var self = $scope;
    self.detailModelForm = {};
    self.confirmCreateVersion = function (formName) {
        if (formName.$valid) {
            var data = {
                "engineId": $location.search().id,
                "version": self.detailModelForm.versionNum
            }
            frameworkManageSrv.createVserion(data).then(function () {
                refresh();
            });
            context.createVersionModal.close();
        } else {
            self[formName.$name + "Valid"] = true;
        }
    }
}]);
export default frameworkmanageViewModule.name;