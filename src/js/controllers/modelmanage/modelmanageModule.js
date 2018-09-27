import "./modelmanageSrv";

let modelmanageModule = angular.module("modelmanageModule", ["modelmanageService"]);

modelmanageModule.controller("modelmanageCtrl", ["$scope", "TableCom", "$uibModal", "$translate", "$sce", "modelmanageSrv", "$window", "$timeout", "userSwitchSrv", "$filter", "$location","logSrv", function ($scope, TableCom, $uibModal, $translate, $sce, modelmanageSrv, $window, $timeout, userSwitchSrv, $filter, $location,logSrv) {
    var self = $scope;
    self.userSwitchSrv = userSwitchSrv;
    self.systemStatusForm = {};
    self.resizeNum = {};
    self.taskListData = [];
    self.dataTitles = {
        "name": "模型名称",
        "status": "状态",
        "path": "访问地址",
        "port": "端口号",
        "replica": "副本数",
        "runningtime": "运行时长(小时)",
        "createtime": "创建时间"
    };
    self.modelStatusList = [
        {name: "全部",status:"all"},
        {name: "创建中",status:"0"},
        {name: "运行中",status:"2"},
        {name: "调度中",status:"5"},
        {name: "删除中",status:"12"},
        {name: "删除失败",status:"13"},
        {name: "禁用中",status:"14"},
        {name: "禁用",status:"15"}
    ];
    self.modelManageName = "modelManageName";
    if (sessionStorage["modelManageName"]) {
        self.modelManageTitleData = JSON.parse(sessionStorage["modelManageName"]);
        if (self.userSwitchSrv.modeltrustee) {
            self.modelManageTitleData[1].disable = true;
            self.modelManageTitleData.forEach(item => {
                item.value = true;
            });
        } else {
            self.modelManageTitleData[1].disable = false;
        }
    } else {
        self.modelManageTitleData = [
            {name: "modelManage.dataTitles.name", value: true, disable: true, search: "modelname"},
            {name: "traincluster.dataTitles.namespace", value: true, disable: false, search: "namespace"},
            {name: "modelManage.dataTitles.status", value: true, disable: true, search: "modelrunstatus_ori"},
            {name: "modelManage.dataTitles.path", value: true, disable: false, search: "serverip_ori"},
            {name: "modelManage.dataTitles.port", value: true, disable: false, search: "serverport_ori"},
            {name: "modelManage.dataTitles.replica", value: true, disable: false, search: "replicas"},
            {name: "modelManage.dataTitles.runningtime", value: true, disable: false, search: "modelruntime"},
            {name: "modelManage.dataTitles.createtime", value: true, disable: false, search: "setuptime_ori"}
        ];
    }
    self.modelDetailName = "modelDetailName";
    if (sessionStorage["modelDetailName"]) {
        self.modelDetailTitleData = JSON.parse(sessionStorage["modelDetailName"]);
    } else {
        self.modelDetailTitleData = [
            {name: "modelManage.detailDataTitles.name", value: true, disable: true, search: "name"},
            {name: "modelManage.detailDataTitles.status", value: true, disable: true, search: "status_ori"},
            {name: "modelManage.detailDataTitles.podIP", value: true, disable: false, search: "podIP"},
            {name: "modelManage.detailDataTitles.hostIP", value: true, disable: false, search: "hostIP"},
            {name: "modelManage.detailDataTitles.startTime", value: true, disable: false, search: "startTime_ori"}
        ];
    }
    function modelListInit() {
        self.globalSearchTerm = "";
        self.systemStatusForm.name = {name: "全部",status:"all"};
        modelmanageSrv.getModelList().then((res) => {
            res.data&&res.data.data?self.loadData = true:"";
            if (res && res.data && res.data.data) {
                successFunc(res.data.data);
                tableStart(res.data.data);
            }
        });
    }
    function successFunc(data) {
        self.taskListData = data;
        self.taskListData.map(item => {
            if (item.modelrunstatus == "0") {
                item.modelrunstatus_ori = "创建中";
            } else if (item.modelrunstatus == "1") {
                item.modelrunstatus_ori = "创建失败";
            } else if (item.modelrunstatus == "2") {
                item.modelrunstatus_ori = "运行中";
            } else if (item.modelrunstatus == "5") {
                item.modelrunstatus_ori = "调度中";
            } else if (item.modelrunstatus == "6") {
                item.modelrunstatus_ori = "终止中";
            } else if (item.modelrunstatus == "7") {
                item.modelrunstatus_ori = "已终止";
            } else if (item.modelrunstatus == "8") {
                item.modelrunstatus_ori = "终止失败";
            } else if (item.modelrunstatus == "9") {
                item.modelrunstatus_ori = "重新训练失败";
            } else if (item.modelrunstatus == "10") {
                item.modelrunstatus_ori = "继续训练失败";
            } else if (item.modelrunstatus == "11") {
                item.modelrunstatus_ori = "到时限自动终止";
            } else if (item.modelrunstatus == "12") {
                item.modelrunstatus_ori = "删除中";
            } else if (item.modelrunstatus == "13") {
                item.modelrunstatus_ori = "删除失败";
            } else if (item.modelrunstatus == "14") {
                item.modelrunstatus_ori = "禁用中";
            } else if (item.modelrunstatus == "15") {
                item.modelrunstatus_ori = "禁用";
            }
            if (item.modelrunstatus == "14" || item.modelrunstatus == "15") {
                item.serverip_ori = "";
                item.serverport_ori = "";
            } else {
                item.serverip_ori = item.serverip;
                item.serverport_ori = item.serverport;
            }
            item.setuptime_ori = $filter("date")(item.setuptime, "yyyy-MM-dd HH:mm:ss");
            item.searchTerm = [item.modelname, item.modelrunstatus_ori, item.serverip_ori, item.serverport_ori, item.replicas, item.modelruntime, item.setuptime_ori];
        });
        TableCom.init(self, "tableParams", self.taskListData, "uuid", 10, "checkboxes");
        modelManageSearchTerm({tableData:self.taskListData,titleData:self.modelManageTitleData});
    }
    modelListInit();
    self.applyGlobalSearch = function () {
        var term = self.globalSearchTerm;
        self.tableParams.filter({ searchTerm: term });
    };
    self.choiceDataStatus = function (item) {
        self.globalSearchTerm = "";
        self.filterTableData = self.taskListData.filter(value => {
            if (item.status == "all") {
                return true;
            } else {
                if (item.status == value.modelrunstatus) {
                    return true;
                } else {
                    return false;
                }
            }
        });
        TableCom.init(self, "tableParams", self.filterTableData, "uuid", 10, "checkboxes");
    };
    //添加监听
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
        //判断各个按钮的状态
        if (self.checkedItems.length == 1) {
            self.canDeleteModel = true;
            self.canMoreOpt = true
            if (self.checkedItems[0].modelrunstatus == 2 || self.checkedItems[0].modelrunstatus == 5) {
                self.canCloseUsing = true;
                self.canEditModel = true;
                self.canMoreOpt = true
            } else if (self.checkedItems[0].modelrunstatus == 15) {
                self.canStartUsing = true;
                self.canCloseUsing = false;
                self.canEditModel = false;
            } else if (self.checkedItems[0].modelrunstatus == 12) {
                self.canDeleteModel = false;
            } else {
                self.canCloseUsing = false;
                self.canEditModel = false;
                self.canStartUsing = false;
            }
        } else {
            self.canDeleteModel = false;
            self.canCloseUsing = false;
            self.canEditModel = false;
            self.canStartUsing = false;
            self.canMoreOpt = false;
        }
    }, true);
    //轮询
    function tableStart(data) {
        //需要轮询的数组
        self.resizing = [];
        var compareData = {};
        data.map(x => {
            if (x.modelrunstatus == 0 || x.modelrunstatus == 2 || x.modelrunstatus == 5 || x.modelrunstatus == 6 || x.modelrunstatus == 12 || x.modelrunstatus == 14) {
                self.resizing.push(x.uuid);
                compareData[x.uuid] = x.modelrunstatus;
            }
        });
        if (self.resizing.length > 0) {
            //时间重置
            if (JSON.stringify(self.resizeNum) == "{}") {
                self.resizing.map(id => { self.resizeNum[id] = 1; });
            }
            if (!$window.resizeTimer) {
                var options = {
                    uuid: self.resizing.join(",")
                };
                $window.modelTaskResize(options, compareData);
            }
        }
    }
    $window.modelTaskResize = function (options, compareData) {
        var timer = $timeout(function () {
            $window.resizeTimer = true;
            modelmanageSrv.getListStatus(options).then(function (res) {
                if (res && res.data && res.data.data) {
                    for (var i in res.data.data) {
                        var status = res.data.data[i];
                        if (status == null) {
                            if (self.resizing.indexOf(i) > -1) {
                                self.resizing.splice(self.resizing.indexOf(i), 1);
                            }
                            self.taskListData.map(function (obj) {
                                if (obj.uuid == i) {
                                    if (self.taskListData.indexOf(obj) > -1) {
                                        self.taskListData.splice(self.taskListData.indexOf(obj), 1);
                                    }
                                }
                            });
                            successFunc(self.taskListData);
                        } else if (compareData[i] != status) {
                            if (!(status == 0 || status == 2 || status == 5 || status == 6 || status == 12)) {
                                if (self.resizing.indexOf(i) > -1) {
                                    self.resizing.splice(self.resizing.indexOf(i), 1);
                                }
                                delete compareData[i];
                            } else {
                                compareData[i] = status;
                            }
                            self.taskListData.map(function (obj) {
                                if (obj.uuid == i) {
                                    obj.modelrunstatus = status;
                                    self.checkboxes = {
                                        checked: false,
                                        items: {}
                                    };
                                    switch (obj.modelrunstatus*1) {
                                        case 0:
                                            obj.modelrunstatus_ori = "创建中";
                                            break;
                                        case 1:
                                            obj.modelrunstatus_ori = "创建失败";
                                            break;
                                        case 2:
                                            obj.modelrunstatus_ori = "运行中";
                                            break;
                                        case 5:
                                            obj.modelrunstatus_ori = "调度中";
                                            break;
                                        case 6:
                                            obj.modelrunstatus_ori = "终止中";
                                            break;
                                        case 7:
                                            obj.modelrunstatus_ori = "已终止";
                                            break;
                                        case 8:
                                            obj.modelrunstatus_ori = "终止失败";
                                            break;
                                        case 9:
                                            obj.modelrunstatus_ori = "重新训练失败";
                                            break;
                                        case 10:
                                            obj.modelrunstatus_ori = "继续训练失败";
                                            break;
                                        case 11:
                                            obj.modelrunstatus_ori = "到时限自动终止";
                                            break;
                                        case 12:
                                            obj.modelrunstatus_ori = "删除中";
                                            break;
                                        case 13:
                                            obj.modelrunstatus_ori = "删除失败";
                                            break;
                                        case 14:
                                            obj.modelrunstatus_ori = "禁用中";
                                        case 15:
                                            obj.modelrunstatus_ori = "禁用";
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            });
                        }

                        //轮询一次记录时间的更改。
                        if (self.resizeNum[i]) {
                            self.resizeNum[i] = self.resizeNum[i] + 1;
                        } else {
                            self.resizeNum[i] = 1;
                        }

                        if (self.resizeNum[i] > 151) {
                            if (self.resizing.indexOf(i) > -1) {
                                self.resizing.splice(self.resizing.indexOf(i), 1);
                            }
                        }
                    }
                }
            }).finally(function () {
                if (self.resizing.length > 0 && $window.location.hash.split("/")[2] == "modelmanage") {
                    var options = {
                        "uuid": self.resizing.join(",")
                    };
                    $window.modelTaskResize(options, compareData);
                } else {
                    $window.resizeTimer = false;
                    $timeout.cancel(timer);
                }
            });
        }, 10000);
    };
    //详情弹出层动画
    self.$on("getDetail", function (event, value) {
        self.detailTabValue = "0";
        detailInit(value);
        self.detailTabChange = function (tab) {
            switch(tab){
                case 'basicinfo':
                    self.detailTabValue = "0";
                    detailInit(value);
                    break;
                case 'example':
                    self.detailTabValue = "1";
                    self.showModel = true;
                    self.showWebshell = false;
                    self.showMinoterCanvas = false;
                    podDetailInit(value);
                    self.podRefresh = function () {
                        podDetailInit(value);
                    }
                    break;
                case 'log':
                    self.detailTabValue = "2";
                    self.getLogLists();
                    self.num = 0;
                    self.showLogBtn = false;
                    break;
            }
        };
        self.checkLog = function (podName, containerName, modelstatus, podstatus) {
            if (containerName&&containerName.length>0) {
                self.detailTabValue = "2";
                self.detailLogContainers = containerName;
                self.detailLogPodName = podName;
                self.logForm = {
                    "container": self.detailLogContainers[0]
                }
                modelmanageSrv.checkLog(podName, containerName[0]).then(res => {
                    if (res && res.data && res.data.data) {
                        self.detailLogInfo = res.data.data;
                    }
                });
            }
        }
        self.logChange = function (podName, containerName) {
            modelmanageSrv.checkLog(podName, containerName).then(res => {
                if (res && res.data && res.data.data) {
                    self.detailLogInfo = res.data.data;
                }
            });
        }
        self.logReturn = function () {
            self.showWebshell = false;
            self.showModel = true;
            self.showMinoterCanvas = false;
        }
        self.watchConsol = function(podName,containerName){
            if (containerName&&containerName.length>0) {
                self.showWebshell = true;
                self.showModel = false;
                self.showMinoterCanvas = false;
                //self.namespace = localStorage.selectedUserName;
                self.detailLogContainers = containerName;
                self.detailLogPodName = podName;
                self.logForm = {
                    "container": self.detailLogContainers[0]
                }
                self.someUrl = $sce.trustAsResourceUrl(window.GLOBALCONFIG.APIHOST.GATEONE + "?ns=" + self.namespace + "&pid=" + podName + "&cid=" + containerName[0])
            }
            self.logChange = function (podName, containerName) {
                self.someUrl = $sce.trustAsResourceUrl(window.GLOBALCONFIG.APIHOST.GATEONE +"?ns=" + self.namespace + "&pid=" + podName + "&cid=" + containerName)
            }
        }
        self.getLogLists = function(){
            let option = {
                "namespace":self.modelDetailData.namespace,
                "host":"",
                "uuid":self.modelDetailData.uuid,
                "log":"",
                "starttime":"",
                "endtime":"",
                "from":0,
                "size":500
            }
            self.logLists = [];
            logSrv.getLogList(option).then(res=>{
                if(res&&res.data&&res.data.data){
                    self.logLists = res.data.data
                    if(self.logLists.length>=500){
                        self.showLogBtn = true;
                    }
                }
            }).finally(function(){
                self.canGetLog = false;
            })
        }
        self.getMoreLog = function(){
            self.canGetLog = true;
            self.num++;
            let option = {
                "namespace":self.modelDetailData.namespace,
                "host":"",
                "uuid":self.modelDetailData.uuid,
                "log":"",
                "starttime":"",
                "endtime":"",
                "from":self.num,
                "size":500
            }
            logSrv.getLogList(option).then(res=>{
                if(res&&res.data&&res.data.data){
                    if(self.logLists.length>0){
                        self.showLogBtn = true;
                    }else{
                        self.showLogBtn = false;
                    }
                    self.logLists.push(...res.data.data);
                }
            }).finally(function(){
                self.canGetLog = false;
            })
        }
    });
    //训练任务状态：创建中:0,创建失败:1,运行中:2,调度中:5,终止中:6,已终止:7,终止失败:8,重新训练失败:9,继续训练失败:10,到时限自动终止:11,删除中:12,删除失败:13,禁用中：14，禁用：15
    function detailInit(val) {
        self.modelDetailStatusList = [
            {name: "全部",status:"all"},
            {name: "运行",status:"0"},
            {name: "未运行",status:"1"}
        ];
        modelmanageSrv.getTaskDetailData(val).then(function (res) {
            if (res && res.data && res.data.data &&  res.data.data.model) {
                self.modelDetailData = res.data.data.model;
                var modelDetailStatus = self.modelDetailData.modelrunstatus*1;
                switch (modelDetailStatus) {
                    case 0:
                        self.modelDetailData.statusTranslate = "创建中";
                        break;
                    case 1:
                        self.modelDetailData.statusTranslate = "创建失败";
                        break;
                    case 2:
                        self.modelDetailData.statusTranslate = "运行中";
                        break;
                    case 5:
                        self.modelDetailData.statusTranslate = "调度中";
                        break;
                    case 6:
                        self.modelDetailData.statusTranslate = "终止中";
                        break;
                    case 7:
                        self.modelDetailData.statusTranslate = "已终止";
                        break;
                    case 8:
                        self.modelDetailData.statusTranslate = "终止失败";
                        break;
                    case 9:
                        self.modelDetailData.statusTranslate = "重新训练失败";
                        break;
                    case 10:
                        self.modelDetailData.statusTranslate = "继续训练失败";
                        break;
                    case 11:
                        self.modelDetailData.statusTranslate = "到时限自动终止";
                        break;
                    case 12:
                        self.modelDetailData.statusTranslate = "删除中";
                        break;
                    case 13:
                        self.modelDetailData.statusTranslate = "删除失败";
                        break;
                    case 14:
                        self.modelDetailData.statusTranslate = "禁用中";
                        break;
                    case 15:
                        self.modelDetailData.statusTranslate = "禁用";
                        break;
                    default:
                        break;
                }
                self.modelDetailData.modelmetadata = JSON.parse(self.modelDetailData.modelmetadata);
            }
        });
    }
    function podDetailInit(val) {
        self.detailLoadData = true;
        self.showMinoterCanvas = false;
        self.systemStatusForm.name = {name: "全部",status:"all"};
        self.detailDataTitles = {
            "name": "实例名称",
            "status": "运行状态",
            "pod": "Pod IP",
            "host": "主机IP",
            "createdtime": "创建时间",
            "option": "操作"
        }
        self.searchOption = {
            "modelDetailGlobalSearchTerm" : ""
        }
        modelmanageSrv.getTaskDetailData(val).then(res => {
            if (res && res.data && res.data.data && res.data.data.pod) {
                self.detailTableData = res.data.data.pod;
                self.namespace = res.data.data.model.namespace;
                self.detailTableData.forEach((item, index) => {
                    item.uuid = index;
                    if (item.startTime) {
                        item.startTime = item.startTime+1000*3600*8;
                        item.startTime_ori = $filter("date")(item.startTime, "yyyy-MM-dd HH:mm:ss");
                    } else {
                        item.startTime_ori = "";
                    }
                    switch (item.status) {
                        case "0":
                            item.status_ori = "运行"
                            break;
                        case "1":
                            item.status_ori = "未运行"
                            break;
                    }
                    item.searchTerm = [item.name, item.status_ori, item.podIP, item.hostIP, item.startTime_ori].join("\b");
                });
                TableCom.init(self, "detailTable", self.detailTableData, "uuid", 10, "");
                modelDetailSearchTerm({tableData:self.detailTableData,titleData:self.modelDetailTitleData});
            }
        });
        self.modelDetailApplyGlobalSearch = function () {
            var term = self.searchOption.modelDetailGlobalSearchTerm;
            self.detailTable.filter({ searchTerm: term });
        }
        self.detailChoiceDataStatus = function (item) {
            self.searchOption.modelDetailGlobalSearchTerm = "";
            self.detailFilterTableData = self.detailTableData.filter(value => {
                if (item.status == "all") {
                    return true;
                } else {
                    if (item.status == value.status) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
            TableCom.init(self, "detailTable", self.detailFilterTableData, "uuid", 10, "");
            modelDetailSearchTerm({tableData:self.detailTableData,titleData:self.modelDetailTitleData});
        };
        function modelDetailSearchTerm(obj){
            self.searchOption.modelDetailGlobalSearchTerm = "";
            self.modelDetailApplyGlobalSearch();
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
        }
        self.modelDetailSearchTerm = modelDetailSearchTerm;
    }
    self.modelManageSearchTerm = modelManageSearchTerm;
    function modelManageSearchTerm(obj) {
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
    }
    self.refresh = function () {
        modelListInit();
    };
    self.numberRecognize = function (checkedItems) {
        var url = $location.absUrl().split("#")[0] + "recognition/#/number";
        localStorage.apiUrl = checkedItems[0].serverip+":"+ checkedItems[0].serverport + "/" + checkedItems[0].modelname;
        window.open(url, "Recognize", "", false);
    }
    self.objectRecognize = function (checkedItems) {
        var url = $location.absUrl().split("#")[0] + "recognition/#/goods";
        localStorage.apiUrl = checkedItems[0].serverip+":"+ checkedItems[0].serverport + "/" + checkedItems[0].modelname
        window.open(url, "Recognize", "", false);
    }
    self.createModel = function () {
        self.createModelModel = $uibModal.open({
            animation: $scope.animationsEnabled,
            backdrop: "static",
            templateUrl: "createModel.html",
            controller: "createModelCtrl",
            resolve: {
                refresh : function () {
                    return modelListInit;
                },
                context: function () {
                    return self;
                }
            }
        });
    };
    self.editModel = function () {
        self.editModelmanageModel = $uibModal.open({
            animation: $scope.animationsEnabled,
            backdrop: "static",
            templateUrl: "editModel.html",
            controller: "editModelCtrl",
            resolve: {
                refresh : function () {
                    return modelListInit;
                },
                context: function () {
                    return self;
                }
            }
        });
    };
    self.startUsingModel = function (checkedItems) {
        self.startUsingCheckedItems = checkedItems;
        let content = {
            msg: "确定要启用所选模型吗？",
            type: "warning",
            func: "confirmStartUsing"
        };
        self.$emit("ui-tag-alert", content);
        self.confirmStartUsing = function () {
            var option = JSON.stringify(self.startUsingCheckedItems[0]);
            modelmanageSrv.startUsing(option).then(() => {
                modelListInit();
            });
        };
    };
    self.stopUsingModel = function (checkedItems) {
        self.stopUsingCheckedItems = checkedItems;
        let content = {
            msg: "确定要禁用所选模型吗？",
            type: "warning",
            func: "confirmStop"
        };
        self.$emit("ui-tag-alert", content);
        self.confirmStop = function () {
            var option = JSON.stringify(self.stopUsingCheckedItems[0]);
            modelmanageSrv.stopmodel(option).then(() => {
                modelListInit();
            });
        };
    };
    self.deleteModel = function (checkedItems) {
        self.deleteModelCheckedItems = checkedItems;
        let content = {
            msg: "确定要删除所选模型吗？",
            type: "warning",
            func: "confirmDelete"
        };
        self.$emit("ui-tag-alert", content);
        self.confirmDelete = function () {
            var option = JSON.stringify(self.deleteModelCheckedItems[0]);
            modelmanageSrv.deleteListData(option).then(() => {
                modelListInit();
            });
        };
    };

    self.showMinoterCanvas = false;
    self.activeFlag = "1h";
    // 查看监控
    self.params={
        last:"1h",     // 最近时间范围
        interval:"300"    // 间隔时间
    }
    self.backToDetails=function(){
        self.showWebshell = false;
        self.showModel = true;
        self.showMinoterCanvas = false;
    }
    // 获取数据
    self.gpuCount = []        
    function getPodMonitorData(podName,params,timeType){
        modelmanageSrv.getPodMonitorMemory(podName,params).then(function(res){
            if(res&&res.data&&res.data.data){
                initData(res.data.data,"podMonitorMemory",timeType)
                getModuleMonitorData()
            }
        })
        modelmanageSrv.getPodMonitorCpu(podName,params).then(function(res){
            if(res&&res.data&&res.data.data){
                initData(res.data.data,"podMonitorCpu",timeType)
                getModuleMonitorData()
            }
        })
        modelmanageSrv.getPodMonitorGpu(podName,params).then(function(res){
            if(res&&res.data&&res.data.data&&res.data.data.length>0){
                for(let i=0;i<res.data.data.length;i++){
                    self.gpuCount[i] = {
                        total:res.data.data[i].memory?res.data.data[i].memory:[],
                        stamp:res.data.data[i].stamp?res.data.data[i].stamp:[],
                        used:res.data.data[i].used?res.data.data[i].used:[],
                        alloc:res.data.data[i].load?res.data.data[i].load:[],                      
                    }
                    // console.log()
                    initData(self.gpuCount[i],"podMonitorCpu"+i,timeType)
                    getModuleMonitorData()
                }
            }
        })
    }

    function getModuleMonitorData(){
        self.resInfo = []
        self.resInfo.push({
            title:"CPU核数使用状态(个)",   
            showNoData :self.podMonitorCpu&&self.podMonitorCpu.alloc&&self.podMonitorCpu.alloc.length>0?true:false,                
            data:{
                x_data:['分配CPU核数','实际使用CPU核数','总CPU核数'],
                series: [
                    {
                        name:'分配CPU核数',
                        type:'line',
                        color:"rgba(81, 163, 255, 1)",
                        data:self.podMonitorCpu?self.podMonitorCpu.alloc:[],
                        time:self.podMonitorCpu?self.podMonitorCpu.time:[],
                        yAxisIndex:0,
                    },
                    {
                        name:'实际使用CPU核数',
                        type:'line',
                        color:"rgba(243, 156, 18, 1)",
                        data:self.podMonitorCpu?self.podMonitorCpu.used:[],
                        time:self.podMonitorCpu?self.podMonitorCpu.time:[],
                        yAxisIndex:0,
                    },
                ]
            }
        },
        {
            title:"内存使用状态(GB)",
            showNoData :self.podMonitorMemory&&self.podMonitorMemory.alloc&&self.podMonitorMemory.alloc.length>0?true:false,                                
            data:{
                x_data:['分配内存数','实际使用内存数','总内存数'],
                series: [
                    {   
                        name:'分配内存数',
                        type:'line',
                        color:"rgba(81, 163, 255, 1)",
                        data:self.podMonitorMemory?self.podMonitorMemory.alloc:[],
                        time:self.podMonitorMemory?self.podMonitorMemory.time:[],
                        yAxisIndex:0,
                    },
                    {
                        name:'实际使用内存数',
                        type:'line',
                        color:"rgba(243, 156, 18, 1)",
                        data:self.podMonitorMemory?self.podMonitorMemory.used:[],
                        time:self.podMonitorMemory?self.podMonitorMemory.time:[],
                        yAxisIndex:0,
                    }
                ]
            }
        })
        if(self.gpuCount.length>0){
            for(let i=0;i<self.gpuCount.length;i++){
                self.resInfo.push(
                    {
                        title:"GPU_"+i+"核数使用状态(个)",   
                        showNoData :self["podMonitorCpu"+i]&&self["podMonitorCpu"+i].used&&self["podMonitorCpu"+i].used.length>0?true:false,                
                        data:{
                            x_data:['GPU显存使用量','GPU负载（%）','GPU显存总量'],
                            series: [
                                {
                                    name:'GPU显存使用量',
                                    type:'line',
                                    color:"rgba(81, 163, 255, 1)",
                                    data:self["podMonitorCpu"+i]?self["podMonitorCpu"+i].used:[],
                                    time:self["podMonitorCpu"+i]?self["podMonitorCpu"+i].time:[],
                                    yAxisIndex:0,
                                },
                                {
                                    name:'GPU负载（%）',
                                    type:'line',
                                    color:"rgba(243, 156, 18, 1)",
                                    data:self["podMonitorCpu"+i]?self["podMonitorCpu"+i].alloc:[],
                                    time:self["podMonitorCpu"+i]?self["podMonitorCpu"+i].time:[],
                                    yAxisIndex:1,
                                },
                                {
                                    name:'GPU显存总量',
                                    type:'line',
                                    color:"rgba(22, 160, 133, 1)",
                                    data:self["podMonitorCpu"+i]?self["podMonitorCpu"+i].total:[],
                                    time:self["podMonitorCpu"+i]?self["podMonitorCpu"+i].time:[],
                                    yAxisIndex:0,
                                },
                            ]
                        }
                    }
                )
            }
        }
        return self.resInfo
    }

    // 数据处理
    function initData(data,type,timeType){
        self[type] = {
            used : [],
            total : [],
            time : [],
            alloc : []
        }
        if(data&&data.total&&angular.isArray(data.total)){
            data.total.forEach(ele => {
                self[type].total.push(ele)
            });
        }
        data.alloc.forEach(ele => {
            self[type].alloc.push(ele)
        });
        data.used.forEach(ele => {
            self[type].used.push(ele)
        });
        if(timeType == "day"){
            data.stamp.forEach(ele => {
                self[type].time.push(moment(ele*1000).format("YYYY-MM-DD HH:mm:ss"))
            });
        }else if(timeType == "time"){
            data.stamp.forEach(ele => {
                self[type].time.push(moment(ele*1000).format("HH:mm:ss"))
            });
        }
    }

    self.watchMinoter = function(item){
        self.showMinoterCanvas = true;
        self.showModel = false;
        self.showWebshell = false;
        self.podName = item;
        getPodMonitorData(self.podName,self.params,"time")
    } 

    function resetChartData(self,arg){
        for(let i=0;i<arg.length;i++){
            self[arg[i]] = {};
        }
    }

    self.changeDataByTime = function(data,time){
        switch(data){
            case "1h":
                self.timeType = "time"
            break;
            case "12h":
                self.timeType = "time"
            break;
            case "1d":
                self.timeType = "day"
            break;
            case "12d":
                self.timeType = "day"
            break;
        }
        self.params = {
            last:data,
            interval:time
        }
        for(let i=0;i<self.gpuCount.length;i++){
            resetChartData(self,['podMonitorMemory','podMonitorCpu',"podMonitorCpu"+i]);
        }
        getPodMonitorData(self.podName,self.params,self.timeType)
        self.activeFlag = data;
    }
}]);
modelmanageModule.controller("createModelCtrl", ["$scope", "context", "refresh", "modelmanageSrv", function ($scope, context, refresh, modelmanageSrv) {
    var self = $scope;
    self.TaskengineData = [];
    self.versionListData = [];
    self.typeData = [];
    self.caffeTypeData = [];
    self.allTypeData = [];
    self.volumeData = [];
    self.addVolumes = [];
    self.hadSameName = false;

    self.taskNameList = angular.copy(context.taskListData)
    
    console.log(context)
    self.modelForm = {
        "session_cpu_num": 1,
        "session_memory_num": 1,
        "session_nvidiagpu_num": 1,
        "replicas": 1,
        "volume_groups": [],
    };
    self.choiceName = function(item){
        self.hadSameName = self.taskNameList.some(function(value){
            return value.modelname==item
        })
    }
    self.modelFormInfo = {
        cpuPattern: "(^[1-9]\\d*$)|(^0\\.[1-9]$)|(^[1-9]\\d*\\.[1-9]$)",
        cpuName: "sessionCpuName",
        cpuDesc: "只能输入保留一位有效数字的小数和正整数",
        memoryPattern: "[1-9]\\d*",
        memoryName: "sessionMemoryName",
        memoryDesc: "只能输入正整数",
        gpuName: "sessionGpuName",
        addNumber: 1,
        memoryAddNumber: 1,
        replicasName: "replicasName",
    };
    function createModelInit() {
        modelmanageSrv.getNodeTypeData().then(function (res) {
            if (res && res.data && res.data.data) {
                _.forEach(res.data.data, function (item) {
                    var obj = {};
                    obj.name = item.name;
                    obj.type = item.type;
                    self.typeData.push(obj);
                    if (obj.type != "gpu") {
                        self.caffeTypeData.push(obj);
                    }
                });
                self.allTypeData = angular.copy(self.typeData);
            }
        });
        modelmanageSrv.getVolumesData().then(function (res) {
            if (res && res.data && res.data.data) {
                self.volumeModelData = res.data.data;
                self.volumeData[0] = [];
                _.forEach(self.volumeModelData, function (item) {
                    var obj = {};
                    obj.pvc = item.volumename;
                    self.volumeData[0].push(obj);
                });
                self.allVolumeData = angular.copy(self.volumeData[0]);
            }
        });
        modelmanageSrv.getEngineListData().then(function (res) {
            if (res && res.data && res.data.data) {
                res.data.data.forEach(item => {
                    var TaskengineItem = {};
                    if (item.name.toLowerCase() != "caffe") {
                        TaskengineItem.uuid = item.uuid;
                        TaskengineItem.name = item.name;
                        self.TaskengineData.push(TaskengineItem);
                    }
                });
                self.modelForm.session_train_engine = self.TaskengineData[0];
                modelmanageSrv.getVersionListData(self.TaskengineData[0].uuid).then(function (result) {
                    if (result && result.data && result.data) {
                        self.versionListData = result.data.data;
                    }
                });
            }
        });
        modelmanageSrv.getUsersQuota(localStorage.userId).then((res) => {
            if (res && res.data && res.data.data) {
                self.quotaInfo = res.data.data;
            }
        });
    }
    createModelInit();
    self.getVersionData = function (id) {
        self.versionListData = [];
        self.modelForm.resource_groups = [];
        modelmanageSrv.getVersionListData(id).then(function (res) {
            if (res && res.data && res.data.data) {
                self.versionListData = res.data.data;
                self.modelForm.session_train_engine_version = self.versionListData[0];
            }
        });
    };
    self.seessionTypeChange = function () {
        if (self.modelForm.session_cputype.type == "gpu") {
            self.showSessionGpu = true;
        } else {
            self.showSessionGpu = false;
        }
    };
    self.confirm = function (formName) {
        self.overQuota = false;
        if (formName.$valid&&!self.hadSameName ) {
            if (self.quotaInfo.cpu_hard - self.quotaInfo.cpu_used < self.modelForm.session_cpu_num * self.modelForm.replicas) {
                self.cpuOverQuota = true;
            } else {
                self.cpuOverQuota = false;
            }
            if (self.quotaInfo.memory_hard - self.quotaInfo.memory_used < self.modelForm.session_memory_num * self.modelForm.replicas) {
                self.memoryOverQuota = true;
            } else {
                self.memoryOverQuota = false;
            }
            if (self.cpuOverQuota || self.memoryOverQuota) {
                self.overQuota = true;
            } else {
                self.overQuota = false;
            }
            if (!self.overQuota) {
                var option = {
                    "modelname": self.modelForm.modelname,
                    "session_cpu_num": self.modelForm.session_cpu_num,
                    "replicas": self.modelForm.replicas,
                    "session_memory_num": self.modelForm.session_memory_num,
                    "session_train_engine": self.modelForm.session_train_engine.name,
                    "session_train_engine_version": self.modelForm.session_train_engine_version.version,
                    "volume_groups": [self.modelForm.volume_groups[0]]
                };
                option.volume_groups[0].required = true;
                if (self.modelForm.session_cputype.type == "cpu") {
                    option.session_cputype = self.modelForm.session_cputype.name;
                } else {
                    option.session_gputype = self.modelForm.session_cputype.name;
                    option.session_nvidiagpu_num = self.modelForm.session_nvidiagpu_num;
                }
                modelmanageSrv.createModel(option).then(() => {
                    refresh();
                });
                context.createModelModel.close();
            } else {
                console.log(self.modelForm);
            }
        } else {
            self[formName.$name + "Valid"] = true;
        }
    };
}]);
modelmanageModule.controller("editModelCtrl", ["$scope", "context", "refresh", "modelmanageSrv", function ($scope, context, refresh, modelmanageSrv) {
    var self = $scope;
    self.modelFormInfo = {
        replicasPattern: "[1-9]\\d*",
        replicasName: "modelReplicasName",
        replicasDesc: "只能输入正整数",
        replicasaddNumber: 1,
    };
    self.modelForm = {
        "replicas" : context.checkedItems[0].replicas
    };
    self.confirmEdit = function (formName) {
        if (formName.$valid) {
            var option = context.checkedItems[0];
            option.replicas = self.modelForm.replicas;
            option = JSON.stringify(option);
            modelmanageSrv.setReplicas(option).then(res => {
                refresh();
            });
            context.editModelmanageModel.close();
        }
    };
}]);

export default modelmanageModule.name;