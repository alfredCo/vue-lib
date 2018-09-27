import "./hostmanageSrv";
let hostmanageModule = angular.module("hostmanageModule", ["hostmanageService"]);

hostmanageModule.controller("hostmanageCtrl", ["$scope", "TableCom", "$uibModal", "$translate", "hostmanageSrv", function ($scope, TableCom, $uibModal, $translate, hostmanageSrv) {
    var self = $scope;
    self.dataTitles = {
        "name": $translate.instant("cn.hostmanage.dataTitles.name"),
        "status": $translate.instant("cn.hostmanage.dataTitles.status"),
        "cpucores": $translate.instant("cn.hostmanage.dataTitles.cpucores"),
        "memory": $translate.instant("cn.hostmanage.dataTitles.memory"),
        "hostlabel": $translate.instant("cn.hostmanage.dataTitles.hostlabel"),
        "IP": $translate.instant("cn.hostmanage.dataTitles.IP")
    };
    self.hostManageName = "hostManageName";
    if (sessionStorage["hostManageName"]) {
        self.hostManageTitleData = JSON.parse(sessionStorage["hostManageName"]);
    } else {
        self.hostManageTitleData = [
            {name: "hostmanage.dataTitles.name", value: true, disable: true, search: "name"},
            {name: "hostmanage.dataTitles.IP", value: true, disable: false, search: "IP"},
            {name: "hostmanage.dataTitles.status", value: true, disable: true, search: "healthstatus_ori"},
            {name: "hostmanage.dataTitles.cpucores", value: true, disable: false, search: "cpucores"},
            {name: "hostmanage.dataTitles.memory", value: true, disable: false, search: "memory"},
            {name: "hostmanage.dataTitles.hostlabel", value: true, disable: false, search: "labels_ori"}
        ];
    }
    function hostManageSearchTerm(obj){
        self.globalSearchTerm = "";
        var tableData = obj.tableData;
        var titleData = obj.titleData;
        tableData.map(function (item) {
            item.searchTerm = [];
            titleData.forEach(function (value) {
                if (value.value) {
                    item.searchTerm.push(item[value.search]);
                }
            });
            item.searchTerm = item.searchTerm.join("\b");
        });
        self.applyGlobalSearch();
    }
    self.hostManageSearchTerm = hostManageSearchTerm;
    self.dataStatusList = [
        {name:$translate.instant("cn.hostmanage.allStatus"),status:"all"},
        {name:$translate.instant("cn.hostmanage.health"),status:"True"},
        {name:$translate.instant("cn.hostmanage.unhealth"),status:"False"},
    ];
    function hostmanageInit() {
        self.tableData = [];
        self.dataStatusForm = [];
        hostmanageSrv.getHostList().then(result => {
            result.data&&result.data.data?self.loadData = true:"";
            if (result && result.data && result.data.data) {
                result.data.data.forEach(item => {
                    var tableItem = {
                        "id" : item.metadata.uid,
                        "name" : item.metadata.name,
                        "labels" : {},
                        "healthstatus" : "",
                        "IP" : item.status.addresses[0].address,
                        "cpucores" : item.status.capacity.cpu,
                        "memory" : (item.status.capacity.memory.split("Ki")[0]/1024/1024).toFixed(1),
                    };
                    for (var i in item.metadata.labels) {
                        if (i.indexOf("kubernetes.io") == -1) {
                            tableItem.labels[i] = item.metadata.labels[i];
                        }
                    }
                    item.status.conditions.forEach(value => {
                        if (value.type == "Ready") {
                            tableItem.healthstatus = value.status;
                            if(value.status != "True"){
                                tableItem.healthstatus = "False";
                            }
                        }
                    });
                    self.tableData.push(tableItem);
                });
                successFunc(self.tableData);
            }
        });
    }
    function successFunc(data) {
        data.forEach(item => {
            if (item.healthstatus == "True") {
                item.healthstatus_ori = $translate.instant("cn.hostmanage.health");
            } else {
                item.healthstatus_ori = $translate.instant("cn.hostmanage.unhealth");
            }
            item.labels_ori = [];
            for (var i in item.labels) {
                var labelItem;
                if (item.labels[i]) {
                    labelItem = i + "=" + item.labels[i];
                } else {
                    labelItem = i + "=" + "\"\"";
                }
                item.labels_ori.push(labelItem);
            }
            item.labels_ori = item.labels_ori.join("\b");
            item.searchTerm = [item.name, item.IP, item.healthstatus_ori, item.cpucore, item.memory, item.labels_ori].join("\b");
        });
        self.hostManageListData = angular.copy(data);
        TableCom.init(self, "tableParams", self.hostManageListData, "id", 10, "checkboxes");
        hostManageSearchTerm({tableData:self.hostManageListData,titleData:self.hostManageTitleData})
    }
    hostmanageInit();
    self.choiceDataStatus = function (item) {
        self.globalSearchTerm = "";
        self.filterTableData = self.tableData.filter(value => {
            if (item.status == "all") {
                return true;
            } else {
                if (item.status == value.healthstatus) {
                    return true;
                } else {
                    return false;
                }
            }
        });
        TableCom.init(self, "tableParams", self.filterTableData, "id", 10, "checkboxes");
    };
    self.applyGlobalSearch = function () {
        var term = self.globalSearchTerm;
        self.tableParams.filter({ searchTerm: term });
    };
    self.refresh = function () {
        self.globalSearchTerm = "";
        hostmanageInit();
    };
    self.$watch("checkboxes.items", function (val) {
        self.checkedItems = [];
        for (var i in val) {
            if (val[i]) {
                self.tableParams.data.forEach(item => {
                    if (item.id == i) {
                        self.checkedItems.push(item);
                    }
                });
            }
        }
        if (self.checkedItems.length == 1) {
            self.canSetLabel = true;
        } else {
            self.canSetLabel = false;
        }
    },true);
    self.setLabel = function () {
        self.setLabelModel = $uibModal.open({
            animation : $scope.animationsEnabled,
            backdrop : "static",
            templateUrl : "setLabel.html",
            controller : "setLabelCtrl",
            resolve: {
                refresh : function () {
                    return hostmanageInit;
                },
                context : function () {
                    return self;
                }
            }
        });
    };
}]);
hostmanageModule.controller("setLabelCtrl", ["$scope", "TableCom", "$uibModal", "alertSrv", "context", "refresh", "hostmanageSrv", "$translate", function ($scope, TableCom, $uibModal, alertSrv, context, refresh, hostmanageSrv, $translate) {
    var self = $scope;
    self.nodeName = context.checkedItems[0].name;
    function setLabelInit() {
        self.tableData = [];
        self.keyname = "key";
        self.gputypelist = [];
        self.poolTypeList = ["shared", "unshared"];
        hostmanageSrv.getLabelList(context.checkedItems[0].name).then(result => {
            if (result && result.data.data) {
                result.data.data.forEach((value, index) => {
                    if (value.key.indexOf("kubernetes.io") == -1) {
                        var tableItem = {
                            "id" : index,
                            "key" : value.key,
                            "value" : value.value,
                            "isCanDelete" : value.isCanDelete,
                            "oldValue" : value.value,
                            "oldKey" : value.key
                        };
                        self.tableData.push(tableItem);
                    }
                    self.tableData.sort((a) => {
                        if (a.isCanDelete) {
                            return 1;
                        } else {
                            return -1;
                        }
                    });
                });
                successFunc(self.tableData);
            }
        });
        hostmanageSrv.getNodeTypeData().then(res => {
            if (res && res.data && res.data.data) {
                res.data.data.forEach(item => {
                    if (item.type == "gpu") {
                        self.gputypelist.push(item.uuid);
                    }
                });
            }
        })
    }
    function successFunc(data) {
        TableCom.init(self, "labeltable", data, "id", 5, "labelcheckboxes");
    }
    function resetOtherFunc(tableData,self,current){
        self[tableData].forEach(item=>{
            if(item.showEditValue==true&&item.id!=current.id){
                item.showEditValue = false;
                item.value=item.oldValue;
            }
            if(item.showEditKey==true&&item.id!=current.id){
                item.showEditKey = false;
                item.key=item.oldKey;
            }
        })
    }
    setLabelInit();
    self.$watch("labelcheckboxes.items", function (val) {
        self.labelCheckedItems = [];
        for (var i in val) {
            if (val[i]) {
                self.labeltable.data.forEach(item => {
                    if (item.id == i) {
                        self.labelCheckedItems.push(item);
                    }
                });
            }
        }
        if (self.labelCheckedItems.length == 0) {
            self.canDelLable = false;
        } else {
            self.canDelLable = true;
            for (var k = 0;k < self.labelCheckedItems.length;k++) {
                if (!self.labelCheckedItems[k].isCanDelete) {
                    self.canDelLable = false;
                    break;
                }
            }
        }
    },true);
    self.addLabel = function () {
        self.addLabelModel = $uibModal.open({
            animation : $scope.animationsEnabled,
            backdrop : "static",
            templateUrl : "addLabel.html",
            controller : "addLabelCtrl",
            resolve: {
                refresh : function () {
                    return setLabelInit;
                },
                context : function () {
                    return self;
                }
            }
        });
    };
    self.deleteLabel = function () {
        let content = {
            msg: $translate.instant("cn.hostmanage.deleteLabelMsg"),
            type: "warning",
            func: "confirmDelete"
        };
        context.$emit("ui-tag-alert", content);
        context.confirmDelete = function () {
            var option = [];
            self.labelCheckedItems.forEach(item => {
                var optionItem = "deletedLabelKeys=" + item.key;
                option.push(optionItem);
            });
            option = option.join("&");
            hostmanageSrv.deleteLabelList(option, self.nodeName).then(() => {
                setLabelInit();
            });
        };
    };
    self.close = function () {
        context.setLabelModel.close();
        refresh();
    };
    self.editLabelKey = function (item) {
        item.showEditKey = true;
        resetOtherFunc('tableData',self,item);
        if(item.showEditValue){
            item.value = item.oldValue;
            item.showEditValue = false;
        }
        self.temporaryData = item.key;
    };
    self.editLabelValue = function (item) {
        item.showEditValue = true;
        resetOtherFunc('tableData',self,item);
        if(item.showEditKey){
            item.key = item.oldKey;
            item.showEditKey = false;
        }
        self.temporaryData = item.value;

    };
    self.confirmKeyEdit = function (item, formName) {
        if (formName.$valid) {
            item.showEditKey = false;
            var option = {
                "originKey" : self.temporaryData,
                "key" : item.key,
                "value" : item.value
            };
            hostmanageSrv.editLabelList(option, self.nodeName).then(() => {
                setLabelInit();
            });
        }
    };
    self.cancelKeyEdit = function (item) {
        item.key = self.temporaryData;
        item.showEditKey = false;
    };
    self.confirmValueEdit = function (item, formName) {
        if (formName.$valid) {
            item.showEditValue = false;
            var option = {
                "originKey" : item.key,
                "key" : item.key,
                "value" : item.value
            };
            hostmanageSrv.editLabelList(option, self.nodeName).then(() => {
                setLabelInit();
            });
        } else {
            self[formName.$name + "Valid"] = true;
        }
    };
    self.cancelValueEdit = function (item) {
        item.value = self.temporaryData;
        item.showEditValue = false;
    };
}]);
hostmanageModule.controller("addLabelCtrl", ["$scope", "refresh", "context", "hostmanageSrv", function ($scope, refresh, context, hostmanageSrv) {
    var self = $scope;
    self.formData = {};
    self.$watch("formData.key", function () {
        self.isExist = false;
        for (var i = 0;i < context.tableData.length;i++) {
            if (self.formData.key == context.tableData[i].key) {
                self.isExist = true;
                break;
            }
        }
    });
    self.confirmAddLabel = function (formName) {
        if (formName.$valid && !self.isExist) {
            var option = {
                "key" : self.formData.key,
                "value" : self.formData.value
            };
            hostmanageSrv.setLabelList(option, context.nodeName).then(() => {
                refresh();
            });
            context.addLabelModel.close();
        } else {
            self[formName.$name + "Valid"] = true;
        }
    };
}]);


export default hostmanageModule.name;